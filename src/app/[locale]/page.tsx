import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CreateYourOwn from '@/components/home/CreateYourOwn';
import FeaturedWorks from '@/components/home/FeaturedWorks';
import WhatWeCan from '@/components/home/WhatWeCan';
import Trust from '@/components/home/Trust';
import Reviews from '@/components/home/Reviews';
import FinalCta from '@/components/home/FinalCta';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <CreateYourOwn />
        <FeaturedWorks />
        <WhatWeCan />
        <Trust />
        <Reviews />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
