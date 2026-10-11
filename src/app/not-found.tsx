import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f0f5f1] px-4 py-16 sm:px-6">
      <section className="w-full max-w-lg rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] px-6 py-10 text-center shadow-sm sm:px-10">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#078f4b]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[#1c2923] sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#68716b]">
          আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে, ঠিকানা বদলেছে, অথবা এটি
          উপলভ্য নয়।
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[#078f4b] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#067c41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
