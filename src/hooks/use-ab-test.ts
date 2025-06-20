
'use client';

import { useState, useEffect } from 'react';
import { getVariant, type Variant } from '@/lib/ab-testing';

/**
 * A React hook to easily conduct an A/B test on a component.
 * It prevents hydration mismatches by only determining the variant on the client side.
 *
 * @param testName The unique name for the A/B test.
 * @returns The assigned variant ('A' or 'B') for the current user, or null during server-side rendering and initial client render.
 */
export function useABTest(testName: string): Variant | null {
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    // This effect runs only on the client side, after hydration.
    // This is important because getVariant relies on localStorage, a browser-only API.
    const assignedVariant = getVariant(testName);
    setVariant(assignedVariant);
  }, [testName]);

  return variant;
}
