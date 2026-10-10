import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import CategoryNavbar from "../../components/category-navbar";
import Footer from "../../components/footer";
import Header from "../../components/header";
import ProductMarquee from "../../components/marquee";
import { getAuth } from "../../lib/auth";

export const metadata: Metadata = {
  title: "Profile | বাজার দর",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileLoading() {
  return (
    <>
      <Header />
      <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10 sm:px-6">
        <div
          aria-label="প্রোফাইল লোড হচ্ছে"
          className="h-48 w-full max-w-xl animate-pulse rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb]"
        />
      </main>
      <Footer />
    </>
  );
}

async function ProfileContent() {
  await connection();
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <Header />
      <CategoryNavbar />
      <ProductMarquee />
      <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-10 sm:px-6">
        <section className="h-fit w-full max-w-xl rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-5 sm:p-7">
          <h1 className="text-2xl font-bold text-[#1c2923]">Profile</h1>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-[#68716b]">Name</dt>
              <dd className="mt-1 font-medium text-[#1c2923]">
                {session.user.name}
              </dd>
            </div>
            <div>
              <dt className="text-[#68716b]">Email</dt>
              <dd className="mt-1 font-medium text-[#1c2923]">
                {session.user.email}
              </dd>
            </div>
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
