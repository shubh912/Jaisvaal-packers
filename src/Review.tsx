import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clipboard,
  ExternalLink,
  MapPin,
  RefreshCw,
  Send,
  Star,
  Truck,
} from "lucide-react";

import {
  EXPERIENCE_POINTS,
  GOOGLE_REVIEW_URL,
  LOCATIONS,
  SERVICES,
  generateReview,
  type ReviewInput,
} from "../lib/reviewGenerator";

const DEFAULT_EXPERIENCE = EXPERIENCE_POINTS.slice(0, 3);

export default function Review() {
  const [stars, setStars] = useState(5);
  const [service, setService] = useState("Household Shifting");
  const [from, setFrom] = useState("Ayodhya");
  const [to, setTo] = useState("Lucknow");
  const [experiencePoints, setExperiencePoints] =
    useState<string[]>(DEFAULT_EXPERIENCE);
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);

  const input: ReviewInput = useMemo(
    () => ({
      stars,
      service,
      from,
      to,
      experiencePoints,
      customNote,
    }),
    [stars, service, from, to, experiencePoints, customNote]
  );

  const [review, setReview] = useState(() => generateReview(input));

  const toggleExperience = (point: string) => {
    setExperiencePoints((current) => {
      if (current.includes(point)) {
        return current.filter((item) => item !== point);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, point];
    });
  };

  const generate = () => {
    setCopied(false);

    const nextInput: ReviewInput = {
      stars,
      service,
      from,
      to,
      experiencePoints,
      customNote,
    };

    setReview(generateReview(nextInput));
  };

  const copyReview = async () => {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = review;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    }
  };

  const openGoogleReview = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#FFFCF5] text-[#12151A]">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 md:py-10">
        {/* Header */}
        <section className="rounded-3xl bg-[#0F1220] p-6 text-white shadow-xl md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00]">
              <Truck size={24} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Customer Feedback
              </p>

              <h1 className="text-xl font-extrabold md:text-2xl">
                NEW JAISAVAAL PACKERS & MOVERS
              </h1>

              <p className="mt-1 text-sm text-white/70">
                Ayodhya
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm leading-6 text-white/80">
              Share your genuine experience. Select the details that actually
              match your move, then edit the generated text before posting.
            </p>
          </div>
        </section>

        {/* Rating */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold">Your rating</h2>
              <p className="mt-1 text-sm text-black/50">
                Choose the rating that matches your experience.
              </p>
            </div>

            <span className="rounded-full bg-[#FFF1E7] px-3 py-1 text-sm font-bold text-[#FF6B00]">
              {stars}/5
            </span>
          </div>

          <div className="mt-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} star`}
                onClick={() => {
                  setStars(star);
                  setCopied(false);
                }}
                className="rounded-xl p-1 transition-transform active:scale-90"
              >
                <Star
                  size={38}
                  fill={star <= stars ? "#FFB000" : "transparent"}
                  className={
                    star <= stars
                      ? "text-[#FFB000]"
                      : "text-black/20"
                  }
                />
              </button>
            ))}
          </div>
        </section>

        {/* Service */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <h2 className="font-extrabold">What service did you use?</h2>

          <div className="relative mt-3">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-black/10 bg-[#FFFCF5] px-4 py-4 pr-11 text-sm font-semibold outline-none focus:border-[#FF6B00]"
            >
              {SERVICES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <ChevronDown
              size={19}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </section>

        {/* Route */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <h2 className="font-extrabold">Move details</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <LocationSelect
              label="From"
              value={from}
              onChange={setFrom}
            />

            <LocationSelect
              label="To"
              value={to}
              onChange={setTo}
            />
          </div>
        </section>

        {/* Experience */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold">What actually stood out?</h2>
              <p className="mt-1 text-sm text-black/50">
                Select up to 4 things that match your experience.
              </p>
            </div>

            <span className="shrink-0 text-xs font-bold text-black/40">
              {experiencePoints.length}/4
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXPERIENCE_POINTS.map((point) => {
              const selected = experiencePoints.includes(point);

              return (
                <button
                  key={point}
                  type="button"
                  onClick={() => toggleExperience(point)}
                  className={[
                    "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                    selected
                      ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                      : "border-black/10 bg-[#FFFCF5] text-black/70",
                  ].join(" ")}
                >
                  {selected && (
                    <Check size={15} className="mr-1.5 inline" />
                  )}
                  {point}
                </button>
              );
            })}
          </div>
        </section>

        {/* Optional customer note */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <h2 className="font-extrabold">
            Add your own words
            <span className="ml-2 text-xs font-medium text-black/40">
              Optional
            </span>
          </h2>

          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Example: Driver reached on time and the cartons were properly labelled."
            rows={4}
            maxLength={300}
            className="mt-4 w-full resize-none rounded-2xl border border-black/10 bg-[#FFFCF5] p-4 text-sm leading-6 outline-none focus:border-[#FF6B00]"
          />

          <p className="mt-2 text-right text-xs text-black/40">
            {customNote.length}/300
          </p>
        </section>

        {/* Generate */}
        <button
          type="button"
          onClick={generate}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6B00] px-5 py-4 font-extrabold text-white shadow-lg shadow-orange-500/20 transition active:scale-[0.99]"
        >
          <RefreshCw size={19} />
          Generate Review
        </button>

        {/* Review */}
        <section className="mt-5 rounded-3xl bg-[#0F1220] p-5 text-white shadow-xl md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                Generated review
              </p>

              <div className="mt-2 flex gap-1">
                {Array.from({ length: stars }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill="#FFB000"
                    className="text-[#FFB000]"
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={generate}
              className="rounded-xl border border-white/10 p-2.5 text-white/70 hover:bg-white/10"
              aria-label="Generate another version"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-white/5 p-5">
            <p className="text-[15px] leading-7 text-white/90">
              {review}
            </p>
          </div>

          <p className="mt-4 text-xs leading-5 text-white/45">
            Please read and edit this before posting. Only post it if it
            accurately describes your own experience.
          </p>
        </section>

        {/* Actions */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={copyReview}
            className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-4 font-extrabold shadow-sm"
          >
            {copied ? <Check size={19} /> : <Clipboard size={19} />}
            {copied ? "Copied!" : "Copy Review"}
          </button>

          <button
            type="button"
            onClick={openGoogleReview}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#0F1220] px-5 py-4 font-extrabold text-white shadow-sm"
          >
            <ExternalLink size={19} />
            Open Google Review
          </button>
        </div>

        {/* Instructions */}
        <section className="mt-5 rounded-3xl border border-[#FF6B00]/20 bg-[#FFF7EF] p-5 md:p-6">
          <div className="flex gap-3">
            <MapPin
              size={21}
              className="mt-0.5 shrink-0 text-[#FF6B00]"
            />

            <div>
              <h3 className="font-extrabold">
                How to post
              </h3>

              <ol className="mt-2 space-y-2 text-sm leading-6 text-black/65">
                <li>1. Read the generated review.</li>
                <li>2. Edit anything that isn't accurate.</li>
                <li>3. Tap "Copy Review".</li>
                <li>4. Open Google Review.</li>
                <li>5. Select your rating and paste your review.</li>
                <li>6. Post it from your own Google account.</li>
              </ol>
            </div>
          </div>
        </section>

        <p className="px-4 py-6 text-center text-xs leading-5 text-black/40">
          Reviews should reflect your genuine experience. You are free to
          edit, shorten, or completely rewrite the generated text before
          posting.
        </p>
      </div>
    </main>
  );
}

function LocationSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/40">
        {label}
      </label>

      <div className="relative">
        <MapPin
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B00]"
        />

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-black/10 bg-[#FFFCF5] py-4 pl-11 pr-11 text-sm font-semibold outline-none focus:border-[#FF6B00]"
        >
          {LOCATIONS.map((location) => (
            <option key={location}>{location}</option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
