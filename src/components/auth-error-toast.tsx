"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthErrorToast({ error }: { error?: string }) {
  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(
      error === "account_not_linked"
        ? "এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে। আগে থেকে ব্যবহৃত পদ্ধতিতে সাইন ইন করুন।"
        : "সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
    );
  }, [error]);

  return null;
}
