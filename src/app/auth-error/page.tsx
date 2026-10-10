import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

type AuthErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  return (
    <Suspense fallback={<AuthErrorFallback />}>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AuthErrorContent({ searchParams }: AuthErrorPageProps) {
  await connection();
  const { error } = await searchParams;
  const accountNotLinked = error === "account_not_linked";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f5f1] px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-6 text-center sm:p-8">
        <h1 className="text-2xl font-bold text-[#1c2923]">
          {accountNotLinked ? "এই ইমেইলে অ্যাকাউন্ট আছে" : "সাইন ইন করা যায়নি"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#68716b]">
          {accountNotLinked
            ? "এই ইমেইল দিয়ে আগে অ্যাকাউন্ট তৈরি হয়েছে। আগে থেকে ব্যবহৃত পদ্ধতিতে সাইন ইন করুন, তারপর প্রোফাইলের “সাইন-ইন পদ্ধতি” অংশ থেকে Google বা GitHub সংযুক্ত করুন।"
            : "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন অথবা সাইন-ইন পেজে ফিরে যান।"}
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#078f4b] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#067c41]"
        >
          সাইন ইন পেজে যান
        </Link>
      </section>
    </main>
  );
}

function AuthErrorFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f5f1] px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-6 text-center sm:p-8">
        <h1 className="text-2xl font-bold text-[#1c2923]">
          সাইন ইন করা যায়নি
        </h1>
        <Link
          href="/signin"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#078f4b] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#067c41]"
        >
          সাইন ইন পেজে যান
        </Link>
      </section>
    </main>
  );
}
