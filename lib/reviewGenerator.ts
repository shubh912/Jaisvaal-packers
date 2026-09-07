// src/lib/reviewGenerator.ts

export const BUSINESS_NAME = "NEW JAISAVAAL PACKERS & MOVERS AYODHYA";

export const LOCATIONS = [
  "Ayodhya",
  "Lucknow",
  "Varanasi",
  "Prayagraj",
  "Gorakhpur",
  "Kanpur",
  "Agra",
  "Delhi",
  "New Delhi",
  "Noida",
  "Greater Noida",
  "Ghaziabad",
  "Gurugram",
  "Faridabad",
  "Jaipur",
  "Chandigarh",
  "Dehradun",
  "Haridwar",
  "Meerut",
  "Bareilly",
  "Moradabad",
  "Mathura",
  "Vrindavan",
  "Aligarh",
  "Jhansi",
  "Lucknow to Ayodhya",
  "Ayodhya to Lucknow",
  "Ayodhya to Delhi",
  "Ayodhya to Noida",
  "Ayodhya to Varanasi",
  "Ayodhya to Prayagraj",
  "Ayodhya to Gorakhpur",
  "Ayodhya to Kanpur",
  "Ayodhya to Jaipur",
  "Ayodhya to Chandigarh",
];

export const SERVICES = [
  "Household Shifting",
  "1BHK Shifting",
  "2BHK Shifting",
  "3BHK Shifting",
  "Office Relocation",
  "Car Transport",
  "Bike Transport",
  "Local Shifting",
  "Long Distance Shifting",
  "Packing & Moving",
  "Furniture Shifting",
];

export const EXPERIENCE_POINTS = [
  "packing",
  "loading",
  "unloading",
  "careful handling",
  "communication",
  "on-time delivery",
  "vehicle arrangement",
  "staff behaviour",
  "pricing",
  "overall service",
];

const openingLines = [
  "Overall, my experience was very good.",
  "I had a good experience with the team.",
  "The shifting experience was smooth and well managed.",
  "I was happy with the service I received.",
  "The team handled my shifting professionally.",
  "My shifting was completed smoothly.",
  "I had a positive experience with this packers and movers service.",
  "The overall process was quite convenient.",
  "The service was handled in a professional manner.",
  "My experience with the team was good.",
];

const closingLines = [
  "I would consider using them again.",
  "Overall, I was satisfied with the service.",
  "The team made the shifting process easier for me.",
  "I would recommend them based on my experience.",
  "Good option if you are looking for a local moving service in Ayodhya.",
  "I am satisfied with the way the shifting was handled.",
  "The service was worth considering for my requirement.",
  "I would be comfortable recommending them to others.",
];

const connectorLines = [
  "The team was responsive throughout the process.",
  "Communication was clear during the shifting.",
  "The staff was polite and cooperative.",
  "The process was explained clearly before the move.",
  "The team coordinated the move properly.",
  "The staff handled the items carefully.",
];

const adjectives = [
  "smooth",
  "well organised",
  "convenient",
  "professional",
  "straightforward",
  "comfortable",
  "well coordinated",
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function uniqueItems<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function servicePhrase(service: string): string {
  const map: Record<string, string> = {
    "Household Shifting": "household shifting",
    "1BHK Shifting": "1BHK shifting",
    "2BHK Shifting": "2BHK shifting",
    "3BHK Shifting": "3BHK shifting",
    "Office Relocation": "office relocation",
    "Car Transport": "car transport",
    "Bike Transport": "bike transport",
    "Local Shifting": "local shifting",
    "Long Distance Shifting": "long-distance shifting",
    "Packing & Moving": "packing and moving",
    "Furniture Shifting": "furniture shifting",
  };

  return map[service] || service.toLowerCase();
}

function ratingTone(stars: number): string {
  if (stars >= 5) return "excellent";
  if (stars === 4) return "positive";
  if (stars === 3) return "mixed";
  if (stars === 2) return "critical";
  return "very critical";
}

function buildExperienceSentence(points: string[]): string {
  if (!points.length) return "";

  const selected = shuffle(uniqueItems(points)).slice(0, 3);

  const sentences: string[] = [];

  selected.forEach((point) => {
    switch (point) {
      case "packing":
        sentences.push(
          randomItem([
            "The packing was handled properly.",
            "I was satisfied with how the items were packed.",
            "The packing work was done carefully.",
          ])
        );
        break;

      case "loading":
        sentences.push(
          randomItem([
            "Loading was done in an organised way.",
            "The loading team handled the items carefully.",
            "The loading process was fairly smooth.",
          ])
        );
        break;

      case "unloading":
        sentences.push(
          randomItem([
            "Unloading was completed without much hassle.",
            "The unloading was handled properly.",
            "The team helped with the unloading process.",
          ])
        );
        break;

      case "careful handling":
        sentences.push(
          randomItem([
            "The staff handled my belongings carefully.",
            "I liked the way the team handled the household items.",
            "The team took reasonable care of the सामान during shifting.",
          ])
        );
        break;

      case "communication":
        sentences.push(
          randomItem([
            "Communication was good during the move.",
            "The team kept me informed about the shifting.",
            "Coordination was smooth throughout the process.",
          ])
        );
        break;

      case "on-time delivery":
        sentences.push(
          randomItem([
            "The delivery was completed within the expected time.",
            "The team reached the destination as discussed.",
            "The timing was handled well for my move.",
          ])
        );
        break;

      case "vehicle arrangement":
        sentences.push(
          randomItem([
            "The vehicle arrangement worked well for my requirement.",
            "The vehicle provided was suitable for the move.",
            "The transport arrangement was convenient.",
          ])
        );
        break;

      case "staff behaviour":
        sentences.push(
          randomItem([
            "The staff behaviour was polite and cooperative.",
            "The staff was respectful and helpful.",
            "The team members were cooperative during the move.",
          ])
        );
        break;

      case "pricing":
        sentences.push(
          randomItem([
            "The pricing was explained before the move.",
            "The charges were discussed clearly.",
            "The pricing was reasonable for my requirement.",
          ])
        );
        break;

      case "overall service":
        sentences.push(
          randomItem([
            "The overall service was satisfactory.",
            "Overall coordination was good.",
            "The complete process was handled fairly well.",
          ])
        );
        break;
    }
  });

  return sentences.join(" ");
}

export type ReviewInput = {
  stars: number;
  service: string;
  from: string;
  to: string;
  experiencePoints: string[];
  customNote?: string;
};

export function generateReview(input: ReviewInput): string {
  const stars = Math.min(5, Math.max(1, Number(input.stars) || 5));

  const service = servicePhrase(input.service);
  const from = input.from.trim();
  const to = input.to.trim();

  const experience = buildExperienceSentence(input.experiencePoints);

  const route =
    from && to
      ? `${from} to ${to}`
      : from
        ? `from ${from}`
        : to
          ? `to ${to}`
          : "";

  let review = "";

  if (stars === 5) {
    const opening = randomItem(openingLines);

    review = `${opening} I booked ${service}${
      route ? ` for ${route}` : ""
    }. ${experience}`;

    if (input.customNote?.trim()) {
      review += ` ${input.customNote.trim()}.`;
    }

    review += ` ${randomItem(connectorLines)} ${randomItem(closingLines)}`;
  } else if (stars === 4) {
    review =
      `I had a ${randomItem(adjectives)} experience with ${service}${
        route ? ` ${route}` : ""
      }. ` +
      `${experience} ` +
      `${input.customNote?.trim() ? input.customNote.trim() + ". " : ""}` +
      `${randomItem(closingLines)}`;
  } else if (stars === 3) {
    review =
      `My experience with ${service}${
        route ? ` ${route}` : ""
      } was average overall. ` +
      `${experience} ` +
      `${input.customNote?.trim() ? input.customNote.trim() + ". " : ""}` +
      `There were some good points, but there is still room for improvement.`;
  } else {
    review =
      `I used the service for ${service}${
        route ? ` ${route}` : ""
      }. ` +
      `${input.customNote?.trim() || "The experience did not fully meet my expectations."} ` +
      `I hope the team takes this feedback positively and improves the service.`;
  }

  return cleanText(review);
}

/**
 * Generate a different version from the same factual inputs.
 * The randomisation comes from different sentence patterns,
 * not from inventing a different customer experience.
 */
export function regenerateReview(input: ReviewInput): string {
  return generateReview(input);
}

export function getRandomDestination(): string {
  return randomItem(LOCATIONS);
}

export function getRandomService(): string {
  return randomItem(SERVICES);
}

export function getRandomExperiencePoints(count = 3): string[] {
  return shuffle(EXPERIENCE_POINTS).slice(0, count);
}

export const GOOGLE_REVIEW_URL =
  "https://maps.app.goo.gl/Bcj1gqt2r6TR7Htq5";
