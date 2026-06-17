// Mock reference data for Complete Profile pickers (handoff §6.1). Replaced by
// real lookups/API when the backend exists.
export const COUNTRIES = [
  'Iran',
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Turkey',
  'United Arab Emirates',
  'India',
  'Japan',
  'Australia',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
];

const CITIES: Record<string, string[]> = {
  Iran: ['Tehran', 'Isfahan', 'Shiraz', 'Mashhad', 'Tabriz'],
  'United States': ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Bristol'],
  default: ['Capital City', 'Other'],
};

export function citiesFor(country: string): string[] {
  return CITIES[country] ?? CITIES.default ?? [];
}

export const PROFESSIONS = [
  'Student',
  'Researcher',
  'Writer / Author',
  'Editor',
  'Teacher / Professor',
  'Librarian',
  'Translator',
  'Journalist',
  'Designer',
  'Engineer',
  'Marketer',
  'Other',
];

export const DEGREES = [
  'High School',
  'Associate',
  "Bachelor's",
  "Master's",
  'Doctorate (PhD)',
  'Postdoctoral',
  'Prefer not to say',
];

export const GENRES = [
  'Literary Fiction',
  'Magical Realism',
  'Science Fiction',
  'Mystery & Thriller',
  'Poetry',
  'Philosophy',
  'History',
  'Biography & Memoir',
  'Fantasy',
  'Non-fiction',
  'Classics',
  'Romance',
];
