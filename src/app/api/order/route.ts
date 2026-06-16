import {NextResponse} from 'next/server';

// Серверний обробник форми замовлення.
// ВАЖЛИВО (безпека): уся перевірка — тут, на сервері. Токен бота читається з env
// і НІКОЛИ не потрапляє на клієнт. Дані з клієнта не вважаємо довіреними.

// Людиночитані підписи для Telegram (заявки читає україномовна людина).
const CATEGORY_LABELS: Record<string, string> = {
  ring: 'Каблучка',
  earrings: 'Сережки',
  necklace: 'Кольє / підвіска',
  bracelet: 'Браслет',
  chain: 'Ланцюжок',
  brooch: 'Брошка',
};
const METAL_LABELS: Record<string, string> = {
  white: 'Біле золото',
  yellow: 'Жовте золото',
  rose: 'Рожеве золото',
};

// Екранування для parse_mode: HTML (щоб < > & не ламали повідомлення).
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ok: false, error: 'bad_request'}, {status: 400});
    }

    // Anti-spam: приховане поле-пастка. Боти його заповнюють — тихо «приймаємо», але не шлемо.
    if (typeof data.company === 'string' && data.company.trim() !== '') {
      return NextResponse.json({ok: true});
    }

    // Обов’язкові поля
    const idea = String(data.idea ?? '').trim();
    const name = String(data.name ?? '').trim();
    const contact = String(data.contact ?? '').trim();
    if (!idea || !name || !contact) {
      return NextResponse.json({ok: false, error: 'missing_fields'}, {status: 400});
    }
    if (idea.length > 2000 || name.length > 120 || contact.length > 120) {
      return NextResponse.json({ok: false, error: 'too_long'}, {status: 400});
    }

    // Необов’язкові поля — приймаємо лише валідні значення
    const size = String(data.size ?? '').trim().slice(0, 60);
    const ref = String(data.ref ?? '').trim().slice(0, 160);
    const category = CATEGORY_LABELS[String(data.category)] ?? '';
    const metal = METAL_LABELS[String(data.metal)] ?? '';
    const purity = data.purity === '585' || data.purity === '750' ? data.purity : '';
    const locale = data.locale === 'en' ? 'en' : 'uk';

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      // Бот ще не налаштований — повертаємо зрозумілу помилку (форма покаже фолбек).
      console.error('[order] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не задані в .env.local');
      return NextResponse.json({ok: false, error: 'not_configured'}, {status: 503});
    }

    // Складаємо повідомлення для Telegram
    const lines: string[] = [
      '🆕 <b>Нова заявка — Dream Gold</b>',
      '',
      `<b>Ім’я:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)}`,
    ];
    if (category) lines.push(`<b>Тип:</b> ${escapeHtml(category)}`);
    if (metal) lines.push(`<b>Метал:</b> ${escapeHtml(metal)}`);
    if (purity) lines.push(`<b>Проба:</b> ${escapeHtml(purity)}`);
    if (size) lines.push(`<b>Розмір:</b> ${escapeHtml(size)}`);
    if (ref) lines.push(`<b>Натхнення:</b> ${escapeHtml(ref)}`);
    lines.push('', '<b>Опис:</b>', escapeHtml(idea), '', `<i>Мова сайту: ${locale}</i>`);
    const text = lines.join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      const detail = await tgRes.text().catch(() => '');
      console.error('[order] Telegram API error:', tgRes.status, detail);
      return NextResponse.json({ok: false, error: 'telegram_failed'}, {status: 502});
    }

    return NextResponse.json({ok: true});
  } catch (e) {
    console.error('[order] Непередбачена помилка:', e);
    return NextResponse.json({ok: false, error: 'server_error'}, {status: 500});
  }
}
