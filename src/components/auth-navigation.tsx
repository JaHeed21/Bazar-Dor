"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";

const linkClassName =
  "px-2 py-2 text-sm font-medium text-[#1c2923] transition-colors hover:text-[#078f4b]";
const buttonClassName =
  "rounded-md bg-[#078f4b] px-5 py-2 text-sm font-medium text-white shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#067c41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]";

export default function AuthNavigation() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        const message =
          result.error.message ?? "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("সাইন আউট সফল হয়েছে।");
      menuRef.current?.removeAttribute("open");
      router.refresh();
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    }
  }

  if (isPending || !session) {
    return (
      <nav aria-label="অ্যাকাউন্ট" className="flex items-center gap-4">
        <Link href="/signin" className={linkClassName}>
          সাইন ইন
        </Link>
        <Link href="/signup" className={buttonClassName}>
          সাইন আপ
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="অ্যাকাউন্ট" className="flex items-center">
      <details ref={menuRef} className="group relative">
        <summary
          aria-label="প্রোফাইল মেনু খুলুন"
          className="flex max-w-48 cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#1c2923] transition-colors hover:bg-[#f0f5f1] hover:text-[#078f4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b] [&::-webkit-details-marker]:hidden"
        >
          <span className="max-w-32 truncate sm:max-w-40">
            {session.user.name}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4 shrink-0 fill-current transition-transform group-open:rotate-180"
          >
            <path d="m5.5 7.5 4.5 4 4.5-4z" />
          </svg>
        </summary>
        <div className="absolute right-0 z-50 mt-2 min-w-40 rounded-xl border border-[#dfe7e1] bg-[#fbfdfb] p-1.5 shadow-lg">
          {error ? (
            <p role="alert" className="px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          ) : null}
          <Link
            href="/profile"
            onClick={() => menuRef.current?.removeAttribute("open")}
            className="block rounded-lg px-3 py-2 text-sm text-[#26312b] transition-colors hover:bg-[#e2f3e9] hover:text-[#078f4b] focus-visible:outline-2 focus-visible:outline-[#078f4b]"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#26312b] transition-colors hover:bg-[#e2f3e9] hover:text-[#078f4b] focus-visible:outline-2 focus-visible:outline-[#078f4b]"
          >
            Sign out
          </button>
        </div>
      </details>
    </nav>
  );
}
