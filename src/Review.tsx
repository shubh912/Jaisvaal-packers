import React, { useState } from 'react';
import {
  Alert,
  Clipboard,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  BUSINESS,
  EXPERIENCES,
  MAJOR_CITIES,
  SERVICES,
  ReviewRating,
  generateUniqueReview,
} from '../../lib/reviewGenerator';

const GOOGLE_REVIEW_URL =
  'https://maps.app.goo.gl/Bcj1gqt2r6TR7Htq5';

export default function Review() {
  const [rating, setRating] = useState<ReviewRating>(5);
  const [fromCity, setFromCity] = useState('Ayodhya');
  const [toCity, setToCity] = useState('Lucknow');
  const [service, setService] = useState('House Shifting');

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(
    [],
  );

  const [review, setReview] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleExperience = (id: string) => {
    setSelectedExperiences((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, id];
    });
  };

  const generate = async () => {
    if (!fromCity || !toCity) {
      Alert.alert(
        'Select locations',
        'Please select both pickup and destination cities.',
      );
      return;
    }

    if (!service) {
      Alert.alert('Select service', 'Please select the service you used.');
      return;
    }

    if (selectedExperiences.length === 0) {
      Alert.alert(
        'Select your experience',
        'Please select at least one thing that was actually part of your experience.',
      );
      return;
    }

    const generated = generateUniqueReview({
      rating,
      fromCity,
      toCity,
      service,
      experiences: selectedExperiences,
    });

    setReview(generated);
    setCopied(false);

    try {
      await Clipboard.setStringAsync(generated);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const copyReview = async () => {
    if (!review) {
      Alert.alert('Generate a review first');
      return;
    }

    try {
      await Clipboard.setStringAsync(review);
      setCopied(true);

      Alert.alert(
        'Review copied',
        'Your review has been copied. You can now open Google and paste it into the review box.',
      );
    } catch {
      Alert.alert(
        'Copy failed',
        'Please select and copy the review manually.',
      );
    }
  };

  const openGoogleReview = async () => {
    if (!review) {
      Alert.alert(
        'Generate review first',
        'Please generate your review before opening Google.',
      );
      return;
    }

    // Make one final clipboard copy immediately before opening Google.
    try {
      await Clipboard.setStringAsync(review);
      setCopied(true);
    } catch {
      // Continue to Google even if clipboard copying fails.
    }

    try {
      await Linking.openURL(GOOGLE_REVIEW_URL);
    } catch {
      Alert.alert(
        'Unable to open Google',
        'Please open Google Maps manually and paste your copied review.',
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Share Your Experience</Text>

        <Text style={styles.subtitle}>
          Tell us about your actual experience with {BUSINESS}.
        </Text>
      </View>

      {/* RATING */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your rating</Text>

        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => setRating(value as ReviewRating)}
              style={[
                styles.starButton,
                rating >= value && styles.starButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.star,
                  rating >= value && styles.starActive,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingText}>
          {rating}/5
        </Text>
      </View>

      {/* ROUTE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your move</Text>

        <Text style={styles.label}>From</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {MAJOR_CITIES.map((city) => (
            <TouchableOpacity
              key={`from-${city}`}
              onPress={() => setFromCity(city)}
              style={[
                styles.chip,
                fromCity === city && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  fromCity === city && styles.chipTextActive,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.selectedText}>
          Pickup: {fromCity}
        </Text>

        <Text style={styles.label}>To</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {MAJOR_CITIES.map((city) => (
            <TouchableOpacity
              key={`to-${city}`}
              onPress={() => setToCity(city)}
              style={[
                styles.chip,
                toCity === city && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  toCity === city && styles.chipTextActive,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.selectedText}>
          Destination: {toCity}
        </Text>
      </View>

      {/* SERVICE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service used</Text>

        <View style={styles.wrap}>
          {SERVICES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setService(item)}
              style={[
                styles.chip,
                service === item && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  service === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* EXPERIENCE */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          What was actually good?
        </Text>

        <Text style={styles.helperText}>
          Select only things that match your real experience.
        </Text>

        <View style={styles.wrap}>
          {EXPERIENCES.map((experience) => {
            const selected = selectedExperiences.includes(
              experience.id,
            );

            return (
              <TouchableOpacity
                key={experience.id}
                onPress={() => toggleExperience(experience.id)}
                style={[
                  styles.experienceItem,
                  selected && styles.experienceItemActive,
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    selected && styles.checkboxActive,
                  ]}
                >
                  {selected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.experienceText,
                    selected && styles.experienceTextActive,
                  ]}
                >
                  {experience.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* GENERATE */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={generate}
      >
        <Text style={styles.generateButtonText}>
          Generate My Review
        </Text>
      </TouchableOpacity>

      {/* GENERATED REVIEW */}
      {review ? (
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>
              Your review
            </Text>

            {copied && (
              <Text style={styles.copiedText}>
                ✓ Copied
              </Text>
            )}
          </View>

          <View style={styles.reviewBox}>
            <Text style={styles.reviewText}>
              {review}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={copyReview}
          >
            <Text style={styles.copyButtonText}>
              {copied ? 'Copy Again' : 'Copy Review'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={openGoogleReview}
          >
            <Text style={styles.googleButtonText}>
              Open Google Review
            </Text>
          </TouchableOpacity>

          <Text style={styles.notice}>
            Your review is copied before Google opens. Please paste it,
            check that it accurately reflects your experience, make any
            changes you want, and submit it yourself.
          </Text>
        </View>
      ) : null}

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F7F8FA',
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  starButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  starButtonActive: {
    backgroundColor: '#FFF7D6',
  },

  star: {
    fontSize: 28,
    color: '#D1D5DB',
  },

  starActive: {
    color: '#F59E0B',
  },

  ratingText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
    marginBottom: 8,
  },

  horizontalList: {
    marginHorizontal: -4,
  },

  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
    marginVertical: 4,
  },

  chipActive: {
    backgroundColor: '#111827',
  },

  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  chipTextActive: {
    color: '#FFFFFF',
  },

  selectedText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
    marginBottom: 8,
  },

  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  helperText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    marginBottom: 10,
  },

  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },

  experienceItemActive: {
    backgroundColor: '#111827',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  checkboxActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },

  checkmark: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },

  experienceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  experienceTextActive: {
    color: '#FFFFFF',
  },

  generateButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 14,
  },

  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  copiedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },

  reviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 15,
    marginBottom: 12,
  },

  reviewText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1F2937',
  },

  copyButton: {
    minHeight: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  copyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  googleButton: {
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  notice: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },

  footerSpace: {
    height: 30,
  },
});
