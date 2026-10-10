"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";

export default function ProfileSettings({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string | null;
}) {
  const router = useRouter();
  const [newName, setNewName] = useState(name);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [enabledProviders, setEnabledProviders] = useState({
    google: false,
    github: false,
  });
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [linkingProvider, setLinkingProvider] = useState("");
  const [accountError, setAccountError] = useState("");
  const safeImage =
    image && URL.canParse(image) && new URL(image).protocol === "https:"
      ? image
      : null;

  useEffect(() => {
    let active = true;

    async function loadAccountConnections() {
      try {
        const [accountsResult, providersResponse] = await Promise.all([
          authClient.listAccounts(),
          fetch("/api/auth/providers", { cache: "no-store" }),
        ]);

        if (accountsResult.error) {
          throw new Error(accountsResult.error.message);
        }
        if (!providersResponse.ok) {
          throw new Error(
            `Provider status request failed: ${providersResponse.status}`,
          );
        }

        const providersPayload: unknown = await providersResponse.json();
        if (
          typeof providersPayload !== "object" ||
          providersPayload === null ||
          !("google" in providersPayload) ||
          typeof providersPayload.google !== "boolean" ||
          !("github" in providersPayload) ||
          typeof providersPayload.github !== "boolean"
        ) {
          throw new Error("Provider status endpoint returned invalid data.");
        }

        if (active) {
          setLinkedProviders(
            (accountsResult.data ?? []).map((account) => account.providerId),
          );
          setEnabledProviders({
            google: providersPayload.google,
            github: providersPayload.github,
          });
        }
      } catch (cause) {
        if (!active) {
          return;
        }
        const message =
          cause instanceof Error
            ? cause.message
            : "অ্যাকাউন্ট সংযোগের তথ্য লোড করা যায়নি।";
        setAccountError(message);
        toast.error(message);
      } finally {
        if (active) {
          setIsLoadingAccounts(false);
        }
      }
    }

    void loadAccountConnections();
    return () => {
      active = false;
    };
  }, []);

  async function handleLinkProvider(provider: "google" | "github") {
    setAccountError("");
    setLinkingProvider(provider);
    try {
      const result = await authClient.linkSocial({
        provider,
        callbackURL: `${window.location.origin}/profile`,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : `${provider} অ্যাকাউন্ট সংযুক্ত করা যায়নি। আবার চেষ্টা করুন।`;
      setAccountError(message);
      toast.error(message);
      setLinkingProvider("");
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = newName.trim();
    if (!trimmedName) {
      const message = "নাম লিখুন।";
      setError(message);
      toast.error(message);
      return;
    }

    setIsSaving(true);
    try {
      const result = await authClient.updateUser({ name: trimmedName });
      if (result.error) {
        const message =
          result.error.message ?? "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।";
        setError(message);
        toast.error(message);
        return;
      }

      setNewName(trimmedName);
      const message = "আপনার তথ্য আপডেট হয়েছে।";
      setSuccess(message);
      toast.success(message);
      router.refresh();
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setError("");
    setIsSigningOut(true);
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
      router.replace("/");
      router.refresh();
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-[#1c2923]">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-[#68716b]">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e2f3e9] text-xl font-bold text-[#078f4b]">
            {safeImage ? (
              <Image
                src={safeImage}
                alt=""
                aria-hidden="true"
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span aria-hidden="true">
                {name.trim().charAt(0).toLocaleUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#1c2923]">{name}</p>
            <p className="truncate text-sm text-[#68716b]">{email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="shrink-0 rounded-lg border border-[#f0a3a3] px-3 py-2 text-sm font-medium text-[#dc3838] transition-colors hover:bg-[#fff1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc3838] disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningOut ? "সাইন আউট হচ্ছে…" : "↶ সাইন আউট"}
        </button>
      </section>

      <section className="mt-5 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 sm:p-5">
        <h2 className="font-semibold text-[#1c2923]">তথ্য</h2>
        <form onSubmit={handleSave} className="mt-5">
          <label
            htmlFor="profile-name"
            className="mb-1.5 block text-sm text-[#26312b]"
          >
            নাম
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fbfdfb] px-3 text-sm text-[#26312b] outline-none focus-visible:border-[#078f4b] focus-visible:ring-2 focus-visible:ring-[#078f4b]/20"
          />
          <button
            type="submit"
            disabled={isSaving || newName.trim() === name}
            className="mt-3 h-10 w-full rounded-lg bg-[#078f4b] text-sm font-medium text-white shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#067c41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "আপডেট হচ্ছে…" : "আপডেট"}
          </button>
          {error ? (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="mt-3 text-sm text-[#078f4b]">
              {success}
            </p>
          ) : null}
        </form>
      </section>

      <section className="mt-5 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 sm:p-5">
        <h2 className="font-semibold text-[#1c2923]">সাইন-ইন পদ্ধতি</h2>
        <p className="mt-1 text-sm text-[#68716b]">
          আগে থেকে থাকা অ্যাকাউন্টে Google বা GitHub যুক্ত করুন।
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {(["google", "github"] as const).map((provider) => {
            const isLinked = linkedProviders.includes(provider);
            const isEnabled = enabledProviders[provider];
            const label = provider === "google" ? "Google" : "GitHub";

            return (
              <button
                key={provider}
                type="button"
                disabled={
                  isLoadingAccounts ||
                  !isEnabled ||
                  isLinked ||
                  linkingProvider !== ""
                }
                onClick={() => void handleLinkProvider(provider)}
                className="h-10 rounded-lg border border-[#dfe7e1] px-3 text-sm font-medium text-[#26312b] transition-colors hover:bg-[#f0f5f1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLinked
                  ? `${label} সংযুক্ত`
                  : linkingProvider === provider
                    ? `${label} সংযুক্ত হচ্ছে…`
                    : isEnabled
                      ? `${label} সংযুক্ত করুন`
                      : `${label} চালু নেই`}
              </button>
            );
          })}
        </div>
        {accountError ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {accountError}
          </p>
        ) : null}
      </section>
    </>
  );
}
