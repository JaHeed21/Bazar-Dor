"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

type Provider = "google" | "github";

const providers: {
  id: Provider;
  label: string;
  icon: string;
}[] = [
  {
    id: "google",
    label: "Google",
    icon: "/auth/google.png",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "/auth/github.png",
  },
];

export default function AuthSocialButtons({
  action,
  onError,
}: {
  action: "সাইন ইন" | "সাইন আপ";
  onError: (message: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState<
    Record<Provider, boolean>
  >({ google: false, github: false });

  useEffect(() => {
    const controller = new AbortController();

    async function loadEnabledProviders() {
      try {
        const response = await fetch("/api/auth/providers", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Provider status request failed: ${response.status}`);
        }

        const payload: unknown = await response.json();
        if (
          typeof payload !== "object" ||
          payload === null ||
          !("google" in payload) ||
          typeof payload.google !== "boolean" ||
          !("github" in payload) ||
          typeof payload.github !== "boolean"
        ) {
          throw new Error("Provider status endpoint returned invalid data.");
        }

        setEnabledProviders({
          google: payload.google,
          github: payload.github,
        });
      } catch (cause) {
        if (controller.signal.aborted) {
          return;
        }
        onError(
          cause instanceof Error
            ? cause.message
            : "সামাজিক সাইন ইন-এর অবস্থা লোড করা যায়নি।",
        );
      }
    }

    void loadEnabledProviders();
    return () => controller.abort();
  }, [onError]);

  async function handleSocialSignIn(provider: Provider) {
    setIsSubmitting(true);
    onError("");
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (result.error) {
        onError(result.error.message ?? `${provider} দিয়ে ${action} করা যায়নি।`);
      }
    } catch (cause) {
      onError(
        cause instanceof Error
          ? cause.message
          : `${provider} দিয়ে ${action} করা যায়নি। আবার চেষ্টা করুন।`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          disabled={!enabledProviders[provider.id] || isSubmitting}
          onClick={() => handleSocialSignIn(provider.id)}
          title={
            enabledProviders[provider.id]
              ? undefined
              : `${provider.label} credentials configure করার পর চালু হবে`
          }
          className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe7e1] px-2 text-xs font-semibold text-[#26312b] transition-colors hover:bg-[#f0f5f1] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          <Image
            src={provider.icon}
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
            className="size-4 object-contain"
          />
          {provider.label} দিয়ে চালিয়ে যান
        </button>
      ))}
    </div>
  );
}
