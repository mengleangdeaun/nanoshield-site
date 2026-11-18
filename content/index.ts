import en, { type Dictionary } from "./en";
import km from "./km";
import { locales, type Locale } from "./site";

const dictionaries: Record<Locale, Dictionary> = { en, km };

export const hasLocale = (lang: string): lang is Locale => (locales as readonly string[]).includes(lang);
export const getDictionary = (lang: Locale) => dictionaries[lang];
export type { Dictionary, Locale };
