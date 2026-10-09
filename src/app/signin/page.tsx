import type { Metadata } from "next";
import Link from "next/link";
import CategoryNavbar from "../../components/category-navbar";
import Header from "../../components/header";
import ProductMarquee from "../../components/marquee";
import SigninForm from "../../components/signin-form";

export const metadata: Metadata = {
  title: "সাইন ইন | বাজার দর",
  description: "বাজার দর-এ সাইন ইন করে বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখুন।",
};

export default function SigninPage() {
  return (
    <>
      <Header />
      <CategoryNavbar />
      <ProductMarquee />
      <main className="flex flex-1 flex-col items-center justify-center bg-[#f0f5f1] px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#1c2923] sm:text-[28px]">
              সাইন ইন
            </h1>
            <p className="mt-1.5 text-sm text-[#68716b]">
              বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
            </p>
          </header>

          <SigninForm />

          <Link
            href="/"
            className="mt-5 block text-center text-sm text-[#68716b] transition-colors hover:text-[#078f4b] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#078f4b]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    </>
  );
}
