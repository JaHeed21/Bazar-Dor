"use client";

import Image from "next/image";
import Link from "next/link";

export default function SignupForm() {
  return (
    <section className="rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-5 sm:p-6">
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm text-[#26312b]"
            >
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              required
              className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fbfdfb] px-3 text-sm text-[#26312b] placeholder:text-[#26312b] outline-none focus-visible:border-[#078f4b] focus-visible:ring-2 focus-visible:ring-[#078f4b]/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-[#26312b]"
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fbfdfb] px-3 text-sm text-[#26312b] placeholder:text-[#26312b] outline-none focus-visible:border-[#078f4b] focus-visible:ring-2 focus-visible:ring-[#078f4b]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm text-[#26312b]"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              minLength={8}
              required
              className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fbfdfb] px-3 text-sm text-[#26312b] placeholder:text-[#26312b] outline-none focus-visible:border-[#078f4b] focus-visible:ring-2 focus-visible:ring-[#078f4b]/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm text-[#26312b]"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              required
              className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fbfdfb] px-3 text-sm text-[#26312b] placeholder:text-[#26312b] outline-none focus-visible:border-[#078f4b] focus-visible:ring-2 focus-visible:ring-[#078f4b]/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled
          className="mt-4 h-10 w-full rounded-lg bg-[#078f4b] text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed"
        >
          অ্যাকাউন্ট তৈরি করুন
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-[#68716b]">
        <span aria-hidden="true" className="h-px flex-1 bg-[#dfe7e1]" />
        <span>অথবা</span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#dfe7e1]" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled
          title="Google দিয়ে সাইন আপ শিগগিরই চালু হবে"
          className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe7e1] px-2 text-xs font-semibold text-[#26312b] disabled:cursor-not-allowed sm:text-sm"
        >
          <Image
            src="/auth/google.png"
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
            className="size-4 object-contain"
          />
          Google দিয়ে চালিয়ে যান
        </button>
        <button
          type="button"
          disabled
          title="GitHub দিয়ে সাইন আপ শিগগিরই চালু হবে"
          className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe7e1] px-2 text-xs font-semibold text-[#26312b] disabled:cursor-not-allowed sm:text-sm"
        >
          <Image
            src="/auth/github.png"
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
            className="size-4 object-contain"
          />
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-[#26312b]">
        অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/signin"
          className="text-[#078f4b] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]"
        >
          সাইন ইন করুন
        </Link>
      </p>
    </section>
  );
}
