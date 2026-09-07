// lib/reviewGenerator.ts

export const BUSINESS = "jaisaval Packers & Movers";

export type Rating = 1 | 2 | 3 | 4 | 5;

export type ReviewOptions = {
  rating: Rating;
  fromCity: string;
  toCity: string;
  service: string;
  experiences: string[];
};

const introductions = [
  "Had a good experience with",
  "Recently used",
  "I had a smooth experience with",
  "Really happy with the service from",
  "Used",
  "My experience with",
  "Quite satisfied with",
  "Overall, I had a good experience with",
  "I recently booked",
  "Glad I chose",
  "Had a pretty smooth experience with",
  "I used the services of",
  "Overall happy with",
  "My shifting experience with",
  "I recently took help from",
  "Booked",
  "The overall experience with",
  "I had a nice experience with",
  "Very satisfied with",
  "I was quite happy with",
];

const serviceSentences = [
  "The team handled the shifting work professionally.",
  "The team was cooperative and easy to coordinate with.",
  "The staff was polite and the overall process was well managed.",
  "The team explained the process clearly and kept things simple.",
  "The workers were responsive and completed the work properly.",
  "The coordination was good from the beginning till the end.",
  "The team arrived as discussed and got started without unnecessary delay.",
  "The staff was helpful throughout the shifting process.",
  "The overall coordination was smooth and convenient.",
  "The team made the shifting process much easier for me.",
  "The workers were professional and knew how to handle the shifting work.",
  "Communication with the team was clear and straightforward.",
  "The staff was friendly and cooperative during the process.",
  "Everything was coordinated properly according to the requirements.",
  "The team was responsive whenever I needed an update.",
];

const packingSentences = [
  "Packing was done properly and the team handled the items carefully.",
  "The packing team worked neatly and systematically.",
  "The packing process was organised and handled with care.",
  "The team took proper care while packing the household items.",
  "Packing and loading were handled in a professional manner.",
  "The workers were careful while handling the items during packing.",
  "The packing work was done neatly and without unnecessary confusion.",
  "The team managed the packing work quite efficiently.",
];

const transportSentences = [
  "Transportation was coordinated smoothly from pickup to delivery.",
  "The movement from pickup to destination was handled well.",
  "The transportation part of the move was properly coordinated.",
  "The team kept the transportation process straightforward.",
  "The vehicle and delivery coordination were handled well.",
  "The shifting from one city to another was managed smoothly.",
  "The delivery coordination was simple and convenient.",
  "The overall transportation experience was satisfactory.",
];

const experienceMap: Record<string, string[]> = {
  "Careful packing": [
    "I especially liked the way the packing was handled.",
    "The packing work was one of the better parts of the service.",
    "I was satisfied with how the items were packed.",
    "The packing was done in a neat and organised way.",
  ],

  "Professional team": [
    "The team was professional and cooperative.",
    "The staff behaved professionally throughout the work.",
    "The workers were polite and professional.",
    "The team maintained a professional approach during the move.",
  ],

  "On-time service": [
    "The service was completed around the agreed schedule.",
    "The team followed the planned timing reasonably well.",
    "The work was coordinated according to the discussed schedule.",
    "The timing and coordination were handled well.",
  ],

  "Good communication": [
    "Communication was clear whenever I needed an update.",
    "It was easy to communicate with the team.",
    "The response from the team was good throughout the process.",
    "I could easily coordinate with the staff whenever required.",
  ],

  "Smooth loading": [
    "Loading was handled properly and without much hassle.",
    "The loading work was organised and fairly smooth.",
    "The team managed the loading work efficiently.",
    "Loading was done in a systematic manner.",
  ],

  "Smooth delivery": [
    "Delivery was coordinated smoothly at the destination.",
    "The delivery process was convenient and straightforward.",
    "The destination-side coordination was handled well.",
    "The delivery was managed without unnecessary confusion.",
  ],

  "Helpful staff": [
    "The staff was helpful whenever I had a question.",
    "The team was cooperative whenever I needed assistance.",
    "The staff was approachable and helpful.",
    "Everyone I interacted with was reasonably helpful.",
  ],

  "Value for money": [
    "Overall, I felt the service was worth the money.",
    "For the service provided, I found it reasonably priced.",
    "The overall service felt like good value for the money.",
    "I found the service fairly reasonable for the work involved.",
  ],
};

const keywordTemplates = [
  (city: string) =>
    `If you are looking for packers and movers in ${city}, this is a good option.`,

  (city: string) =>
    `For anyone searching for the best packers in ${city}, this is worth considering.`,

  (city: string) =>
    `I can recommend them if you need a moving service in ${city}.`,

  (city: string) =>
    `A good option for packers and movers in ${city}.`,

  (city: string) =>
    `For my requirement, they provided one of the better moving services in ${city}.`,

  (city: string) =>
    `People looking for a reliable moving service in ${city} can consider them.`,

  (city: string) =>
    `Overall, I would consider them among the better packers in ${city}.`,

  (city: string) =>
    `If you need moving services around ${city}, their service is worth checking out.`,
];

const endings = [
  "Overall, it was a convenient experience and I would consider using them again.",
  "Overall satisfied with the service and would recommend them.",
  "The whole process was fairly smooth and I would recommend them.",
  "Happy with the overall service and coordination.",
  "Overall, a positive experience and I would recommend the team.",
  "The service made my shifting process easier than expected.",
  "I would consider them again for a future move.",
  "Overall, a satisfactory experience from my side.",
  "Quite happy with the way the move was handled.",
  "Good experience overall and the team was cooperative.",
  "The service was convenient and I was satisfied with the overall handling.",
  "Overall, the service was professional and easy to coordinate.",
];

const hinglishLines = [
  "Overall kaafi smooth experience raha.",
  "Team ka response bhi achha tha.",
  "Coordination mein zyada hassle nahi hua.",
  "Kaam overall properly managed tha.",
  "Shifting process kaafi straightforward raha.",
  "Team ke saath coordinate karna easy tha.",
  "Overall experience simple aur convenient raha.",
  "Staff ka behaviour bhi achha tha.",
  "Process mein unnecessary confusion nahi hua.",
  "Kaafi decent service experience raha.",
  "Team cooperative thi aur kaam smoothly hua.",
  "Overall kaam expected way mein ho gaya.",
];

const serviceKeywords: Record<string, string[]> = {
  "House Shifting": [
    "house shifting",
    "home shifting",
    "house moving",
    "home relocation",
  ],

  "Office Shifting": [
    "office shifting",
    "office relocation",
    "commercial shifting",
    "office moving",
  ],

  "Packing & Moving": [
    "packing and moving",
    "packing and shifting",
    "moving service",
    "relocation service",
  ],

  "Bike Transportation": [
    "bike transportation",
    "bike shifting",
    "two-wheeler transportation",
    "bike relocation",
  ],

  "Car Transportation": [
    "car transportation",
    "car shifting",
    "vehicle transportation",
    "car relocation",
  ],

  "Loading & Unloading": [
    "loading and unloading",
    "loading service",
    "unloading service",
    "shifting assistance",
  ],
};

let lastGeneratedReview = "";

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomChance(percent: number): boolean {
  return Math.random() * 100 < percent;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function buildReview(options: ReviewOptions): string {
  const {
    rating,
    fromCity,
    toCity,
    service,
    experiences,
  } = options;

  const parts: string[] = [];

  parts.push(
    `${randomItem(introductions)} ${BUSINESS} for ${service.toLowerCase()}.`
  );

  if (fromCity && toCity) {
    parts.push(
      `I needed to move from ${fromCity} to ${toCity}, and the overall coordination was handled well.`
    );
  } else if (fromCity) {
    parts.push(
      `I needed moving assistance in ${fromCity}, and the overall coordination was handled well.`
    );
  }

  parts.push(randomItem(serviceSentences));

  if (
    service.toLowerCase().includes("pack") ||
    randomChance(55)
  ) {
    parts.push(randomItem(packingSentences));
  }

  if (
    fromCity &&
    toCity &&
    fromCity !== toCity &&
    randomChance(60)
  ) {
    parts.push(randomItem(transportSentences));
  }

  if (experiences.length > 0) {
    const usableExperiences = experiences
      .flatMap(
        (experience) => experienceMap[experience] || []
      )
      .filter(Boolean);

    if (usableExperiences.length > 0) {
      const shuffled = [...usableExperiences].sort(
        () => Math.random() - 0.5
      );

      const selected = shuffled.slice(
        0,
        Math.min(2, shuffled.length)
      );

      selected.forEach((sentence) => {
        parts.push(sentence);
      });
    }
  }

  if (randomChance(35)) {
    parts.push(randomItem(hinglishLines));
  }

  if (randomChance(50)) {
    const keywordCity =
      randomChance(50) ? fromCity : toCity;

    if (keywordCity) {
      const keywordTemplate =
        randomItem(keywordTemplates);

      parts.push(keywordTemplate(keywordCity));
    }
  }

  if (randomChance(25)) {
    const keywords = serviceKeywords[service];

    if (keywords && keywords.length > 0) {
      parts.push(
        `The ${randomItem(keywords)} experience was overall satisfactory.`
      );
    }
  }

  if (rating <= 2) {
    parts.push(
      "There were a few areas where the service could have been better."
    );
  } else if (rating === 3) {
    parts.push(
      "Overall it was a decent experience, although there is still some room for improvement."
    );
  } else {
    parts.push(randomItem(endings));
  }

  return cleanText(parts.join(" "));
}

export function generateReview(
  options: ReviewOptions
): string {
  let review = "";
  let attempts = 0;

  do {
    review = buildReview(options);
    attempts++;
  } while (
    review === lastGeneratedReview &&
    attempts < 20
  );

  lastGeneratedReview = review;

  return review;
}
