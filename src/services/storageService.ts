import { WorkerProfile, QuoteData } from '../types/quote';

const PROFILE_KEY = 'maestropro_profile';
const QUOTES_KEY = 'maestropro_quotes';

export const DEFAULT_PROFILE: WorkerProfile = {
  name: 'Maestro Don Lupe',
  trade: 'plomeria',
  phone: '55 1234 5678',
  city: 'Ciudad de México',
  avatarSeed: 'Lupe',
};

export const getSavedProfile = (): WorkerProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading profile from localStorage:', e);
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: WorkerProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
};

export const getSavedQuotes = (): QuoteData[] => {
  try {
    const raw = localStorage.getItem(QUOTES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading quotes:', e);
    return [];
  }
};

export const saveQuote = (quote: QuoteData): void => {
  try {
    const quotes = getSavedQuotes();
    const existingIndex = quotes.findIndex(q => q.id === quote.id);
    if (existingIndex >= 0) {
      quotes[existingIndex] = quote;
    } else {
      quotes.unshift(quote);
    }
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Error saving quote:', e);
  }
};

export const deleteQuote = (id: string): void => {
  try {
    const quotes = getSavedQuotes().filter(q => q.id !== id);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Error deleting quote:', e);
  }
};

