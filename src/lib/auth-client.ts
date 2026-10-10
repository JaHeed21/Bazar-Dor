"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export function getAuthCallbackURL() {
  const callbackURL = new URLSearchParams(window.location.search).get(
    "callbackURL",
  );
  if (!callbackURL) {
    return "/";
  }

  const destination = new URL(callbackURL, window.location.origin);
  if (destination.origin !== window.location.origin) {
    return "/";
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
