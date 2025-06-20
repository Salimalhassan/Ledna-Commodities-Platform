
// A simple A/B testing utility using localStorage for persistence.

// Define the variants for our tests.
export type Variant = 'A' | 'B';

/**
 * Assigns a user to a variant for a given A/B test.
 * The assignment is random on the first visit and then stored in localStorage
 * to ensure the user consistently sees the same variant.
 *
 * @param testName The unique name of the test (e.g., 'HomePageCTA').
 * @returns The assigned variant ('A' or 'B').
 */
export function getVariant(testName: string): Variant {
  // Return 'A' immediately if not in a browser environment (e.g., during SSR).
  if (typeof window === 'undefined') {
    return 'A';
  }

  const storageKey = `ab-test-${testName}`;

  try {
    // Check if the user already has a variant assigned in localStorage.
    const existingVariant = localStorage.getItem(storageKey);
    if (existingVariant === 'A' || existingVariant === 'B') {
      return existingVariant;
    }

    // If not, assign a new variant randomly (50/50 split).
    const newVariant: Variant = Math.random() < 0.5 ? 'A' : 'B';

    // Store the new variant in localStorage for future visits.
    localStorage.setItem(storageKey, newVariant);
    
    return newVariant;
  } catch (error) {
    // localStorage might be disabled (e.g., in private browsing mode).
    // The assignment will just be for this session.
    console.warn('Could not read/write to localStorage for A/B test. Defaulting to variant A.', error);
    return 'A';
  }
}
