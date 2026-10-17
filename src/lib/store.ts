import { useSyncExternalStore } from "react";
import { EMAIL, ME, member, type AssessmentId, type Comment, type Member, type Reaction } from "../content";

/**
 * Everything a reader changes, kept in this browser's local storage under
 * `gg19p-*` and sent nowhere: the profile as edited, posts written, reactions,
 * comments, votes, follows, invitations, endorsements, assessment results and
 * settings. One store per kind, each a value with a setter and a hook, so a
 * change made on one page shows on the others. If storage is unavailable the
 * stores keep their values in memory for the visit.
 */
type Listener = () => void;

export function persisted<T>(key: string, initial: T) {
  const k = `gg19p-${key}`;
  let value: T = initial;
  try { const raw = localStorage.getItem(k); if (raw) { const v = JSON.parse(raw); value = (Array.isArray(initial) ? v : { ...initial, ...v }) as T; } } catch { /* in memory */ }
  const listeners = new Set<Listener>();
  const set = (next: T | ((v: T) => T)) => {
    value = typeof next === "function" ? (next as (v: T) => T)(value) : next;
    try { localStorage.setItem(k, JSON.stringify(value)); } catch { /* in memory */ }
    listeners.forEach((l) => l());
  };
  const subscribe = (l: Listener) => { listeners.add(l); return () => { listeners.delete(l); }; };
  return {
    get: () => value,
    set,
    use: () => useSyncExternalStore(subscribe, () => value, () => value),
  };
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** The signed-in member's profile, as edited. */
export const me = persisted<Member>("me", clone(member(ME)!));
/** A member as shown: the edited profile for the signed-in member, the catalogue's for anyone else. */
export function useMember(id: string): Member | undefined {
  const m = me.use();
  return id === ME ? m : member(id);
}

export interface OwnPost { id: string; text: string; photo?: string; audience: "anyone" | "connections"; at: number; repostOf?: string }
export const ownPosts = persisted<OwnPost[]>("posts", []);

export interface Social {
  reactions: Record<string, Reaction>;
  comments: Record<string, Comment[]>;
  likedComments: Record<string, true>;
  votes: Record<string, number>;
  going: Record<string, true>;
  saved: Record<string, true>;
  hidden: Record<string, true>;
  follows: Record<string, boolean>;
  invited: Record<string, true>;
  endorsed: Record<string, true>;
  sent: Record<string, { to: string[]; at: number }>;
  messages: Record<string, { text: string; at: number }[]>;
}
export const social = persisted<Social>("social", {
  reactions: {}, comments: {}, likedComments: {}, votes: {}, going: {}, saved: {}, hidden: {}, follows: {}, invited: {}, endorsed: {}, sent: {}, messages: {},
});
/** Toggle a key in one of the social maps. */
export function toggle<K extends keyof Social>(field: K, key: string, on?: boolean) {
  social.set((s) => {
    const map = { ...(s[field] as Record<string, unknown>) };
    const next = on ?? !map[key];
    if (next) map[key] = true; else delete map[key];
    return { ...s, [field]: map };
  });
}

export interface Result { score: number; total: number; passed: boolean; at: number; show: boolean }
export const results = persisted<Record<AssessmentId | string, Result>>("results", {});

export interface Settings {
  theme: "light" | "dark" | "device";
  feedSort: "top" | "recent";
  lastName: "full" | "initial";
  viewing: "name" | "characteristics" | "private";
  autoplay: boolean;
  sounds: boolean;
  photos: "everyone" | "network" | "connections";
  connectionsVisible: boolean;
  activeStatus: "connections" | "everyone" | "nobody";
  shareUpdates: boolean;
  readReceipts: boolean;
  invitations: "everyone" | "email" | "nobody";
  recruiters: boolean;
  twoStep: boolean;
  emails: { address: string; primary?: boolean; verified: boolean }[];
  sessions: string[];
  notifications: Record<string, boolean>;
  ads: Record<string, boolean>;
  language: string;
}
export const SESSIONS = ["Chrome on macOS · Naples, Italy · This browser", "GIFin app on iPhone · Naples, Italy", "Safari on iPad · Lima, Peru"];
export const settings = persisted<Settings>("settings", {
  theme: "device", feedSort: "top", lastName: "full", viewing: "name", autoplay: true, sounds: false, photos: "everyone",
  connectionsVisible: true, activeStatus: "connections", shareUpdates: true, readReceipts: true, invitations: "everyone", recruiters: true, twoStep: false,
  emails: [{ address: EMAIL, primary: true, verified: true }], sessions: SESSIONS,
  notifications: {}, ads: {}, language: "English",
});

/** Applies the Display setting to the page: an explicit light or dark, or the device's own. */
export function applyTheme(t: Settings["theme"]) {
  const root = document.documentElement;
  if (t === "device") delete root.dataset.theme; else root.dataset.theme = t;
}
applyTheme(settings.get().theme);

/** Everything this study keeps, cleared. */
export function resetAll() {
  try { Object.keys(localStorage).filter((k) => k.startsWith("gg19p-")).forEach((k) => localStorage.removeItem(k)); } catch { /* nothing kept */ }
}

/** The name shown to members outside the network when the last name is set to an initial. */
export const shownName = (m: Member, s: Settings) => (m.id === ME && s.lastName === "initial" ? `${m.first} ${m.last[0] ?? ""}.` : [m.first, m.last].filter(Boolean).join(" "));
