import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CreateYourOwn from '@/components/home/CreateYourOwn';
import FeaturedWorks from '@/components/home/FeaturedWorks';
import EditorialSplit from '@/components/home/EditorialSplit';
import WhatWeCan from '@/components/home/WhatWeCan';
import Craft from '@/components/home/Craft';
import Trust from '@/components/home/Trust';
import Reviews from '@/components/home/Reviews';
import ServicePromise from '@/components/home/ServicePromise';
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
        <EditorialSplit />
        <WhatWeCan />
        <Craft />
        <Trust />
        <Reviews />
        <ServicePromise />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
