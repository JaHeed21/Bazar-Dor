"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const providerLabels = {
  google: "Google",
  github: "GitHub",
} as const;

export default function AuthSuccessToast() {
  useEffect(() => {
    const currentURL = new URL(window.location.href);
    const provider = currentURL.searchParams.get("authSuccess");

    if (provider !== "google" && provider !== "github") {
      return;
    }

    currentURL.searchParams.delete("authSuccess");
    window.history.replaceState(
      window.history.state,
      "",
      `${currentURL.pathname}${currentURL.search}${currentURL.hash}`,
    );
    toast.success(`${providerLabels[provider]} দিয়ে সাইন ইন সফল হয়েছে।`);
  }, []);

  return null;
}
