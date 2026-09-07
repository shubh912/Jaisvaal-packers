// lib/reviewGenerator.ts

export const BUSINESS = 'Saket Packers & Movers';

export type ReviewRating = 3 | 4 | 5;

export type ReviewInput = {
  rating: ReviewRating;
  fromCity: string;
  toCity: string;
  service: string;
  experiences: string[];
};

const cities = [
  'Ayodhya',
  'Faizabad',
  'Lucknow',
  'Gorakhpur',
  'Prayagraj',
  'Varanasi',
  'Kanpur',
  'Delhi',
  'Noida',
  'Ghaziabad',
  'Agra',
  'Jaipur',
  'Chandigarh',
  'Gurugram',
  'Meerut',
  'Bareilly',
  'Kanpur',
  'Aligarh',
];

export const MAJOR_CITIES = cities;

export const SERVICES = [
  'House Shifting',
  'Office Relocation',
  'Local Shifting',
  'Intercity Shifting',
  'Bike Transport',
  'Car Transport',
  'Packing & Moving',
  'Loading & Unloading',
];

export const EXPERIENCES = [
  {
    id: 'packing',
    label: 'Packing was good',
    phrases: [
      'The packing was done properly and everything was handled with care.',
      'Packing was neat and the team handled the सामान carefully.',
      'The packing team did a good job and took care of the items.',
      'I was happy with how the सामान was packed and handled.',
    ],
  },
  {
    id: 'loading',
    label: 'Loading was smooth',
    phrases: [
      'Loading was quite smooth and the team worked efficiently.',
      'The loading process was well managed.',
      'The team handled the loading properly without unnecessary delay.',
      'Loading and handling were done in a professional way.',
    ],
  },
  {
    id: 'unloading',
    label: 'Unloading was smooth',
    phrases: [
      'Unloading was also smooth and the items were handled carefully.',
      'The unloading process was hassle free.',
      'Everything was unloaded properly at the destination.',
      'The team handled the unloading nicely.',
    ],
  },
  {
    id: 'staff',
    label: 'Staff was cooperative',
    phrases: [
      'The staff was cooperative and easy to communicate with.',
      'The team members were polite and helpful throughout.',
      'Staff behaviour was good and they were responsive.',
      'The team was friendly and cooperative.',
    ],
  },
  {
    id: 'ontime',
    label: 'On-time service',
    phrases: [
      'The delivery was completed within the expected time.',
      'The service was on time as discussed.',
      'The shifting was completed without unnecessary delay.',
      'The timing was handled well from pickup to delivery.',
    ],
  },
  {
    id: 'communication',
    label: 'Good communication',
    phrases: [
      'Communication was clear throughout the shifting process.',
      'They kept communication simple and clear.',
      'It was easy to coordinate with the team.',
      'The response and communication were good.',
    ],
  },
  {
    id: 'price',
    label: 'Reasonable pricing',
    phrases: [
      'The pricing was reasonable for the service provided.',
      'The charges were fair compared with the overall service.',
      'Pricing was quite reasonable.',
      'The service felt worth the price.',
    ],
  },
  {
    id: 'careful',
    label: 'Items handled carefully',
    phrases: [
      'My items were handled carefully during the move.',
      'I liked the way the team handled the household सामान.',
      'The team took reasonable care of the belongings.',
      'Overall handling of the items was good.',
    ],
  },
];

type PhraseGroup = {
  start: string[];
  middle: string[];
  ending: string[];
};

const FIVE_STAR_PATTERNS: PhraseGroup[] = [
  {
    start: [
      'Had a really good experience with',
      'Overall a very good experience with',
      'Quite happy with the service from',
      'Used',
      'Recently used',
      'Took their service for',
      'My experience with',
      'I had a smooth experience with',
      'Really satisfied with',
      'Pretty happy with',
    ],
    middle: [
      'for my move from {FROM} to {TO}.',
      'for shifting from {FROM} to {TO}.',
      'for my shifting requirement from {FROM} to {TO}.',
      'for a {SERVICE} move from {FROM} to {TO}.',
      'when I needed {SERVICE} from {FROM} to {TO}.',
    ],
    ending: [
      'Would definitely recommend them for a smooth move.',
      'Overall, good service and cooperative team.',
      'Good option if you are looking for packers and movers in Ayodhya.',
      'Happy with the overall service.',
      'Would consider using them again.',
      'A reliable option for moving and transportation.',
      'Good experience overall.',
    ],
  },
];

const FOUR_STAR_PATTERNS: PhraseGroup[] = [
  {
    start: [
      'Had a good experience with',
      'Overall my experience with',
      'I recently used',
      'Used',
      'My experience with',
      'Quite satisfied with',
      'The service from',
    ],
    middle: [
      'for shifting from {FROM} to {TO}.',
      'for my move from {FROM} to {TO}.',
      'for {SERVICE} from {FROM} to {TO}.',
      'when I needed shifting from {FROM} to {TO}.',
    ],
    ending: [
      'Overall the service was good.',
      'A decent experience overall.',
      'The team was helpful and cooperative.',
      'There is some room for improvement, but overall I was satisfied.',
      'Would recommend them for their overall service.',
      'Good service overall.',
    ],
  },
];

const THREE_STAR_PATTERNS: PhraseGroup[] = [
  {
    start: [
      'Used',
      'I recently tried',
      'My experience with',
      'I took the service of',
      'Overall experience with',
    ],
    middle: [
      'for shifting from {FROM} to {TO}.',
      'for my moving requirement from {FROM} to {TO}.',
      'for {SERVICE} from {FROM} to {TO}.',
    ],
    ending: [
      'Overall it was an okay experience.',
      'The service was acceptable, although there is room for improvement.',
      'Some parts of the service were good, while some could be better.',
      'Overall a mixed but manageable experience.',
    ],
  },
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function replaceRoute(text: string, input: ReviewInput): string {
  return text
    .replace(/\{FROM\}/g, input.fromCity)
    .replace(/\{TO\}/g, input.toCity)
    .replace(/\{SERVICE\}/g, input.service.toLowerCase());
}

function getPattern(rating: ReviewRating): PhraseGroup {
  if (rating === 5) return randomItem(FIVE_STAR_PATTERNS);
  if (rating === 4) return randomItem(FOUR_STAR_PATTERNS);
  return randomItem(THREE_STAR_PATTERNS);
}

function getExperiencePhrases(input: ReviewInput): string[] {
  const selected = input.experiences
    .map((id) => EXPERIENCES.find((experience) => experience.id === id))
    .filter(Boolean) as typeof EXPERIENCES;

  return shuffle(
    selected.flatMap((experience) => experience.phrases),
  ).slice(0, Math.min(3, selected.length));
}

function keywordSentence(input: ReviewInput): string {
  const options = [
    `If you are searching for the best packers in ${input.fromCity}, they are worth considering.`,
    `${input.fromCity} me packers and movers ke liye my experience was good.`,
    `For anyone looking for a good moving service in ${input.fromCity}, they are a decent option.`,
    `I was looking for a reliable service in ${input.fromCity} and overall the experience was good.`,
    `For ${input.fromCity} to ${input.toCity} shifting, the overall service was satisfactory.`,
    `I would consider them among the better moving options in ${input.fromCity}.`,
    `Good option for people looking for packers and movers in ${input.fromCity}.`,
    `Overall, the service was good for my ${input.fromCity} to ${input.toCity} move.`,
  ];

  return randomItem(options);
}

function hinglishSentence(input: ReviewInput): string {
  const options = [
    `Overall kaafi smooth experience raha.`,
    `Team ka response bhi theek tha.`,
    `Coordination mein koi major issue nahi hua.`,
    `Kaam properly manage kiya gaya.`,
    `Overall service se satisfied raha.`,
    `Team cooperative thi aur kaam time par handle hua.`,
    `Mera overall experience positive raha.`,
    `Shifting process relatively hassle free raha.`,
  ];

  return randomItem(options);
}

export function generateReview(input: ReviewInput): string {
  const pattern = getPattern(input.rating);

  const start = replaceRoute(randomItem(pattern.start), input);
  const middle = replaceRoute(randomItem(pattern.middle), input);
  const experiences = getExperiencePhrases(input);

  const parts: string[] = [
    `${start} ${BUSINESS} ${middle}`,
  ];

  if (experiences.length > 0) {
    parts.push(...experiences);
  }

  // Hinglish is intentionally occasional, not forced into every review.
  if (Math.random() > 0.45) {
    parts.push(hinglishSentence(input));
  }

  // SEO phrase is used naturally and not in every generated review.
  if (Math.random() > 0.55) {
    parts.push(keywordSentence(input));
  }

  parts.push(randomItem(pattern.ending));

  return cleanReview(parts.join(' '));
}

function cleanReview(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();
}

/**
 * Returns a fresh review every time.
 * The timestamp + random seed prevents accidental same-output repetition
 * when the user taps Generate repeatedly.
 */
export function generateUniqueReview(input: ReviewInput): string {
  const review = generateReview(input);

  // Small variation if the random generator happens to produce
  // the same output consecutively.
  return `${review} `;
}

export function getCityOptions(): string[] {
  return MAJOR_CITIES;
}

export function getServiceOptions(): string[] {
  return SERVICES;
}
