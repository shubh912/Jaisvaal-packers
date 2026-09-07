import React, { useState } from "react";
import {
  generateReview,
  type Rating,
} from "../lib/reviewGenerator";

const GOOGLE_REVIEW_URL =
  "https://maps.app.goo.gl/Bcj1gqt2r6TR7Htq5";

const cities = [
  "Ayodhya",
  "Faizabad",
  "Lucknow",
  "Varanasi",
  "Prayagraj",
  "Gorakhpur",
  "Kanpur",
  "Delhi",
  "New Delhi",
  "Noida",
  "Greater Noida",
  "Ghaziabad",
  "Agra",
  "Meerut",
  "Bareilly",
  "Aligarh",
  "Moradabad",
  "Mathura",
  "Vrindavan",
  "Jaipur",
  "Chandigarh",
  "Gurugram",
  "Faridabad",
  "Dehradun",
  "Haridwar",
  "Amritsar",
  "Ludhiana",
  "Patiala",
  "Kota",
  "Bhopal",
  "Indore",
  "Prayagraj",
  "Raipur",
];

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

const ratingLabels: Record<Rating, string> = {
  1: "Poor",
  2: "Needs improvement",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copied = document.execCommand("copy");

    document.body.removeChild(textarea);

    return copied;
  } catch {
    return false;
  }
}

export default function Review() {
  const [rating, setRating] = useState<Rating>(5);
  const [fromCity, setFromCity] = useState("Ayodhya");
  const [toCity, setToCity] = useState("Lucknow");
  const [service, setService] = useState("House Shifting");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const toggleExperience = (experience: string) => {
    setExperiences((current) => {
      if (current.includes(experience)) {
        return current.filter(
          (item) => item !== experience
        );
      }

      return [...current, experience];
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setCopied(false);

    const generated = generateReview({
      rating,
      fromCity,
      toCity,
      service,
      experiences,
    });

    setReview(generated);

    const copiedSuccessfully =
      await copyToClipboard(generated);

    setCopied(copiedSuccessfully);
    setGenerating(false);
  };

  const handleCopy = async () => {
    if (!review) return;

    const copiedSuccessfully =
      await copyToClipboard(review);

    setCopied(copiedSuccessfully);
  };

  const handleOpenGoogle = () => {
    window.open(
      GOOGLE_REVIEW_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleGenerateAndOpen = async () => {
    setGenerating(true);
    setCopied(false);

    const generated = generateReview({
      rating,
      fromCity,
      toCity,
      service,
      experiences,
    });

    setReview(generated);

    await copyToClipboard(generated);

    setCopied(true);
    setGenerating(false);

    window.open(
      GOOGLE_REVIEW_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badge}>
            Customer Review
          </div>

          <h1 style={styles.title}>
            Share Your Experience
          </h1>

          <p style={styles.subtitle}>
            Tell us about your actual experience with{" "}
            <strong>Saket Packers & Movers</strong>.
          </p>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>
            Your Rating
          </label>

          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => {
              const selected =
                value <= rating;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setRating(value as Rating)
                  }
                  aria-label={`${value} star rating`}
                  style={{
                    ...styles.starButton,
                    opacity: selected ? 1 : 0.3,
                  }}
                >
                  ★
                </button>
              );
            })}
          </div>

          <div style={styles.ratingText}>
            {ratingLabels[rating]}
          </div>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>
            Moving From
          </label>

          <select
            value={fromCity}
            onChange={(event) =>
              setFromCity(event.target.value)
            }
            style={styles.select}
          >
            {cities.map((city: string) => (
              <option
                value={city}
                key={`from-${city}`}
              >
                {city}
              </option>
            ))}
          </select>

          <label
            style={{
              ...styles.label,
              marginTop: 18,
            }}
          >
            Moving To
          </label>

          <select
            value={toCity}
            onChange={(event) =>
              setToCity(event.target.value)
            }
            style={styles.select}
          >
            {cities.map((city: string) => (
              <option
                value={city}
                key={`to-${city}`}
              >
                {city}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>
            Service Used
          </label>

          <select
            value={service}
            onChange={(event) =>
              setService(event.target.value)
            }
            style={styles.select}
          >
            {services.map((item: string) => (
              <option
                value={item}
                key={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>
            What was your actual experience?
          </label>

          <p style={styles.helper}>
            Select only the things that genuinely
            happened during your move.
          </p>

          <div style={styles.experienceGrid}>
            {experienceOptions.map(
              (experience: string) => {
                const selected =
                  experiences.includes(experience);

                return (
                  <button
                    type="button"
                    key={experience}
                    onClick={() =>
                      toggleExperience(experience)
                    }
                    style={{
                      ...styles.experienceButton,
                      ...(selected
                        ? styles.experienceSelected
                        : {}),
                    }}
                  >
                    <span>
                      {selected ? "✓" : "+"}
                    </span>

                    {experience}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          style={{
            ...styles.generateButton,
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating
            ? "Generating..."
            : "Generate My Review"}
        </button>

        {review && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>
                Your Review
              </h2>

              {copied && (
                <span style={styles.copiedBadge}>
                  Copied
                </span>
              )}
            </div>

            <div style={styles.reviewBox}>
              {review}
            </div>

            <p style={styles.notice}>
              Review the text and edit anything that
              does not exactly match your experience
              before posting.
            </p>

            <div style={styles.actionGrid}>
              <button
                type="button"
                onClick={handleCopy}
                style={styles.copyButton}
              >
                {copied
                  ? "✓ Copied"
                  : "Copy Review"}
              </button>

              <button
                type="button"
                onClick={handleOpenGoogle}
                style={styles.googleButton}
              >
                Open Google Review
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateAndOpen}
              style={styles.mainActionButton}
            >
              Generate New + Open Google
            </button>

            <p style={styles.pasteHelp}>
              The review is copied to your clipboard.
              After Google opens, paste it into the
              review box, check/edit it, and submit it
              yourself.
            </p>
          </div>
        )}

        <div style={styles.footer}>
          <strong>Jaisavaal Packers & Movers</strong>
          <span>
            Your genuine experience helps others make
            better decisions.
          </span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    padding: "24px 14px 50px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#172033",
  },

  container: {
    width: "100%",
    maxWidth: 680,
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: 24,
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: 999,
    background: "#e8f0ff",
    color: "#2454a6",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 10,
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 7vw, 42px)",
    lineHeight: 1.1,
    fontWeight: 800,
  },

  subtitle: {
    margin:
      "12px auto 0",
    maxWidth: 550,
    color: "#687386",
    fontSize: 15,
    lineHeight: 1.6,
  },

  card: {
    background: "#ffffff",
    borderRadius: 18,
    padding: "20px",
    marginBottom: 14,
    boxShadow:
      "0 8px 28px rgba(15, 23, 42, 0.07)",
    border: "1px solid #e8edf3",
    boxSizing: "border-box",
  },

  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 750,
    marginBottom: 10,
  },

  helper: {
    margin: "-3px 0 14px",
    color: "#788395",
    fontSize: 13,
    lineHeight: 1.5,
  },

  stars: {
    display: "flex",
    justifyContent: "center",
    gap: 5,
    marginTop: 2,
  },

  starButton: {
    border: 0,
    background: "transparent",
    cursor: "pointer",
    fontSize: 40,
    lineHeight: 1,
    padding: "2px 5px",
    color: "#f5b400",
  },

  ratingText: {
    textAlign: "center",
    marginTop: 8,
    color: "#667085",
    fontSize: 13,
    fontWeight: 600,
  },

  select: {
    width: "100%",
    height: 48,
    padding: "0 13px",
    borderRadius: 11,
    border: "1px solid #d7dde6",
    background: "#fff",
    color: "#172033",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  },

  experienceGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 9,
  },

  experienceButton: {
    minHeight: 46,
    borderRadius: 11,
    border: "1px solid #dbe1e9",
    background: "#f9fafb",
    color: "#374151",
    cursor: "pointer",
    padding: "9px 10px",
    fontSize: 13,
    fontWeight: 600,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  experienceSelected: {
    background: "#edf5ff",
    border: "1px solid #4b83dc",
    color: "#174a91",
  },

  generateButton: {
    width: "100%",
    minHeight: 54,
    border: 0,
    borderRadius: 14,
    background:
      "linear-gradient(135deg, #155eef, #3b82f6)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 800,
    boxShadow:
      "0 8px 22px rgba(37, 99, 235, 0.24)",
    marginBottom: 16,
  },

  resultCard: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 20,
    boxShadow:
      "0 8px 28px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e4e9f0",
  },

  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  resultTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
  },

  copiedBadge: {
    background: "#eaf8ef",
    color: "#16803c",
    padding: "5px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },

  reviewBox: {
    background: "#f7f9fc",
    border: "1px solid #e2e7ee",
    borderRadius: 13,
    padding: 16,
    fontSize: 15,
    lineHeight: 1.7,
    color: "#293548",
    whiteSpace: "pre-wrap",
  },

  notice: {
    margin:
      "11px 0 14px",
    fontSize: 12,
    lineHeight: 1.55,
    color: "#7a8494",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 9,
  },

  copyButton: {
    minHeight: 48,
    borderRadius: 11,
    border: "1px solid #cfd7e3",
    background: "#ffffff",
    color: "#263449",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 750,
  },

  googleButton: {
    minHeight: 48,
    borderRadius: 11,
    border: 0,
    background: "#1f2937",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 750,
  },

  mainActionButton: {
    width: "100%",
    minHeight: 50,
    marginTop: 10,
    border: 0,
    borderRadius: 11,
    background: "#0f766e",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 800,
  },

  pasteHelp: {
    textAlign: "center",
    margin:
      "12px 5px 0",
    fontSize: 12,
    lineHeight: 1.55,
    color: "#7a8494",
  },

  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    textAlign: "center",
    marginTop: 24,
    color: "#7a8494",
    fontSize: 12,
    lineHeight: 1.5,
  },
};
