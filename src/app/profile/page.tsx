import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import CategoryNavbar from "../../components/category-navbar";
import Footer from "../../components/footer";
import Header from "../../components/header";
import ProductMarquee from "../../components/marquee";
import ProfileSettings from "../../components/profile-settings";
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
        <div className="h-fit w-full max-w-3xl">
          <ProfileSettings
            name={session.user.name}
            email={session.user.email}
            image={session.user.image ?? null}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
