"use client";

import {
  buildFullConsent,
  CONSENT_STORAGE_KEY,
  type UserConsent,
} from "./consent";

export function loadStoredConsent(): UserConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserConsent;
  } catch {
    return null;
  }
}

export function storeConsent(consent: UserConsent): void {
  sessionStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
}

export function clearConsent(): void {
  sessionStorage.removeItem(CONSENT_STORAGE_KEY);
}

export { buildFullConsent };
