// src/Review.tsx

import React, { useState } from "react";
import {
  generateReview,
  type Rating,
} from "../lib/reviewGenerator";

const GOOGLE_REVIEW_URL =
  "https://share.google/fBdd3U8mb7QdD9PbE";

const services = [
  "House Shifting",
  "Office Shifting",
  "Packing & Moving",
  "Bike Transportation",
  "Car Transportation",
  "Loading & Unloading",
];

const experienceOptions = [
  "Careful packing",
  "Professional team",
  "On-time service",
  "Good communication",
  "Smooth loading",
  "Smooth delivery",
  "Helpful staff",
  "Value for money",
];

export default function Review() {
  const [rating, setRating] = useState<Rating>(5);
  const [service, setService] = useState("House Shifting");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [generatedReview, setGeneratedReview] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleExperience = (experience: string) => {
    setExperiences((current) =>
      current.includes(experience)
        ? current.filter((item) => item !== experience)
        : [...current, experience]
    );
  };

  const copyReview = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const successful =
          document.execCommand("copy");

        document.body.removeChild(textarea);

        return successful;
      } catch {
        return false;
      }
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setCopied(false);

    try {
      const review = generateReview({
        rating,
        service,
        experiences,
      });

      setGeneratedReview(review);

      const wasCopied = await copyReview(review);

      setCopied(wasCopied);

      /*
       * Small delay gives the browser time to complete
       * the clipboard operation before navigating away.
       */
      setTimeout(() => {
        window.location.href = GOOGLE_REVIEW_URL;
      }, 250);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Share Your Experience
          </h1>

          <p style={styles.subtitle}>
            NEW JAISAVAAL PACKERS & MOVERS AYODHYA
          </p>

          <p style={styles.description}>
            Tell us about your actual experience and
            we'll prepare a review for you.
          </p>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>
            Your Rating
          </label>

          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setRating(value as Rating)
                }
                style={{
                  ...styles.starButton,
                  opacity: value <= rating ? 1 : 0.3,
                }}
                aria-label={`${value} star`}
              >
                ★
              </button>
            ))}
          </div>

          <div style={styles.ratingText}>
            {rating} / 5
          </div>
        </div>

        <div style={styles.card}>
          <label
            htmlFor="service"
            style={styles.label}
          >
            Service Used
          </label>

          <select
            id="service"
            value={service}
            onChange={(event) =>
              setService(event.target.value)
            }
            style={styles.select}
          >
            {services.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>
            What was good about your experience?
          </label>

          <p style={styles.helper}>
            Select only the things that actually
            happened during your move.
          </p>

          <div style={styles.options}>
            {experienceOptions.map((experience) => {
              const selected =
                experiences.includes(experience);

              return (
                <button
                  key={experience}
                  type="button"
                  onClick={() =>
                    toggleExperience(experience)
                  }
                  style={{
                    ...styles.option,
                    ...(selected
                      ? styles.optionSelected
                      : {}),
                  }}
                >
                  <span>
                    {selected ? "✓" : "+"}
                  </span>

                  <span>{experience}</span>
                </button>
              );
            })}
          </div>
        </div>

        {generatedReview && (
          <div style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <strong>
                Your Review
              </strong>

              {copied && (
                <span style={styles.copied}>
                  Copied ✓
                </span>
              )}
            </div>

            <p style={styles.reviewText}>
              {generatedReview}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            ...styles.generateButton,
            ...(isGenerating
              ? styles.generateButtonDisabled
              : {}),
          }}
        >
          {isGenerating
            ? "Preparing Review..."
            : "Generate & Post Review"}
        </button>

        <p style={styles.note}>
          Your review is copied automatically and
          Google will open next. Please check and edit
          the review before posting.
        </p>

        <div style={styles.footer}>
          NEW JAISAVAAL PACKERS & MOVERS AYODHYA
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f7f9",
    padding: "24px 16px 40px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "28px",
    lineHeight: 1.2,
    fontWeight: 700,
  },

  subtitle: {
    margin: "0 0 8px",
    fontSize: "14px",
    fontWeight: 700,
  },

  description: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "14px",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.06)",
  },

  label: {
    display: "block",
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "12px",
  },

  helper: {
    margin: "-4px 0 14px",
    color: "#777",
    fontSize: "13px",
    lineHeight: 1.4,
  },

  stars: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
  },

  starButton: {
    border: "none",
    background: "transparent",
    fontSize: "42px",
    lineHeight: 1,
    cursor: "pointer",
    padding: "2px 5px",
  },

  ratingText: {
    textAlign: "center",
    marginTop: "8px",
    fontSize: "14px",
    color: "#666",
  },

  select: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  options: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  option: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: "14px",
    textAlign: "left",
    cursor: "pointer",
  },

  optionSelected: {
    border: "1px solid #222",
    background: "#f1f1f1",
    fontWeight: 600,
  },

  reviewCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "14px",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.06)",
  },

  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  copied: {
    fontSize: "13px",
    fontWeight: 600,
  },

  reviewText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.65,
    color: "#333",
  },

  generateButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "16px 20px",
    background: "#111",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.15)",
  },

  generateButtonDisabled: {
    opacity: 0.65,
    cursor: "wait",
  },

  note: {
    textAlign: "center",
    color: "#777",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: "12px 8px 0",
  },

  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: "11px",
    marginTop: "30px",
  },
};
