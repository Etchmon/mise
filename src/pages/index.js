import Head from 'next/head'
import { useState } from 'react';
import { getSession } from "next-auth/react";
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Image from 'next/image';
import bgImage from '../../public/images/chef.jpg';

export default function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Mise</title>
        <meta name="description" content="Mise — save recipes, build cookbooks, and discover new dishes." />
      </Head>
      <Navbar />

      <main className="relative bg-stone-950 text-stone-100 flex flex-col flex-grow">
        {/* Background image fades in independently — content is always visible */}
        <Image
          src={bgImage}
          alt=""
          onLoad={() => setImageLoaded(true)}
          quality={65}
          className={`absolute inset-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 filter blur-md w-full h-full object-cover`}
        />
        <div className="absolute inset-0 bg-stone-950 opacity-70 pointer-events-none" aria-hidden="true" />

        {/* Hero */}
        <section id="main-content" className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-5 text-rose-400 leading-tight">
              Your recipes, organised.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-stone-300">
              Save recipes, build cookbooks, and discover new dishes — all in one place.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-rose-600 text-white py-3 px-10 rounded-lg hover:bg-rose-500 font-semibold text-lg transition-colors"
            >
              Get started
            </Link>
            <p className="mt-4 text-sm text-stone-400">
              Already have an account?{' '}
              <Link href="/login" className="text-rose-400 hover:text-rose-300 underline">
                Log in
              </Link>
            </p>
          </div>
        </section>

        {/* Feature section */}
        <section className="relative z-10 bg-stone-950 bg-opacity-85 border-t border-stone-800 py-14 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-base font-semibold text-rose-400 mb-2">Save recipes</h3>
              <p className="text-stone-400 text-sm">Store your favourite recipes with ingredients and step-by-step instructions.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-rose-400 mb-2">Build cookbooks</h3>
              <p className="text-stone-400 text-sm">Organise recipes into themed collections you can revisit any time.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-rose-400 mb-2">Discover dishes</h3>
              <p className="text-stone-400 text-sm">Browse the community stream and add recipes from other cooks to your collection.</p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: '/dashboard' } };
  }
  return { props: {} };
}
