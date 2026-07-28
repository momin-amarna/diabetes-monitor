import Head from 'next/head';
import Hero from '../components/LandingPage/Hero';
import Problem from '../components/LandingPage/Problem';
import Solution from '../components/LandingPage/Solution';
import Features from '../components/LandingPage/Features';
import Demo from '../components/LandingPage/Demo';
import CTA from '../components/LandingPage/CTA';

export default function Home() {
  return (
    <>
      <Head>
        <title>مراقب السكري الذكي</title>
      </Head>
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Demo />
        <CTA />
      </main>
    </>
  );
}
