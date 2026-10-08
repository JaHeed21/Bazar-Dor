import Image from "next/image";
import Header from "../components/header";
import CategoryNavbar from "../components/category-navbar";
import ProductMarquee from "../components/marquee";
import CurrentDate from "../components/current-date";

function BazarHero() {
  return (
    <section className="bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-3xl border border-[#e0e9e2] bg-[#fbfdfb] px-5 py-6 sm:px-8 md:flex-row md:px-10 md:py-8">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full bg-[#e2f3e9] px-3 py-1 text-xs font-medium text-[#078f4b]">
            <CurrentDate />
          </p>
          <h1 className="text-3xl font-bold leading-tight text-[#1c2923] sm:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#68716b] sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <a
            href="#categories"
            className="mt-6 inline-flex rounded-md bg-[#078f4b] px-5 py-2.5 text-sm font-medium text-white shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#067c41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]"
          >
            সব পণ্য দেখুন
          </a>
        </div>
        <Image
          src="/bazar-hero.png"
          alt="বাজারের তাজা সবজি ও পণ্যের ঝুড়ি"
          width={267}
          height={200}
          priority
          className="h-auto w-44 shrink-0 object-contain sm:w-56"
        />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f2f2]">
      <Header />
      <CategoryNavbar />
      <ProductMarquee />
      <BazarHero />
    </main>
  );
}
