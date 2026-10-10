"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export function getAuthCallbackURL() {
  const callbackURL = getSafeCallbackURL();
  return callbackURL ?? "/";
}

export function getAuthPageURL(path: "/signin" | "/signup") {
  const callbackURL = getSafeCallbackURL();
  if (!callbackURL) {
    return path;
  }

  const searchParams = new URLSearchParams({ callbackURL });
  return `${path}?${searchParams.toString()}`;
}

function getSafeCallbackURL() {
  const callbackURL = new URLSearchParams(window.location.search).get(
    "callbackURL",
  );
  if (!callbackURL) {
    return null;
  }

  const destination = new URL(callbackURL, window.location.origin);
  if (
    destination.origin !== window.location.origin ||
    !destination.pathname.startsWith("/") ||
    destination.pathname.startsWith("//")
  ) {
    return null;
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
