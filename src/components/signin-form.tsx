"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  authClient,
  getAuthCallbackURL,
  getAuthPageURL,
} from "../lib/auth-client";
import AuthSocialButtons from "./auth-social-buttons";

export default function SigninForm() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await authClient.signIn.email({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });

      if (result.error) {
        const message =
          result.error.message ?? "সাইন ইন করা যায়নি। তথ্য যাচাই করুন।";
        setError(message);
        toast.error(message);
        return;
      }
      toast.success("সাইন ইন সফল হয়েছে।");
      toast.success("সাইন ইন সফল হয়েছে।");
      window.location.replace(getAuthCallbackURL());
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-5 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
              autoComplete="current-password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fbfdfb] px-3 text-sm text-[#26312b] placeholder:text-[#26312b] outline-none focus-visible:border-[#078f4b] focus-visible:ring-2 focus-visible:ring-[#078f4b]/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 h-10 w-full rounded-lg bg-[#078f4b] text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#067c41] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
        </button>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-[#68716b]">
        <span aria-hidden="true" className="h-px flex-1 bg-[#dfe7e1]" />
        <span>অথবা</span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#dfe7e1]" />
      </div>

      <AuthSocialButtons action="সাইন ইন" onError={setError} />

      <p className="mt-4 text-center text-sm text-[#26312b]">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/signup"
          onClick={(event) => {
            event.preventDefault();
            window.location.assign(getAuthPageURL("/signup"));
          }}
          className="text-[#078f4b] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </section>
  );
}
