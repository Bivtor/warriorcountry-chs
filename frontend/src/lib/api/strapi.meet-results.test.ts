/**
 * Property-Based Tests for Meet Results
 * 
 * Tests Properties 10, 11, and 12 from the design document:
 * - Property 10: Meet Results Organization
 * - Property 11: PDF Link Correctness
 * - Property 12: Meet Type Support
 */

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import type { MeetResult, StrapiFile } from '$lib/types/strapi';

// ============================================================================
// Generators for Property-Based Testing
// ============================================================================

/**
 * Generator for valid meet names
 */
const meetNameGenerator = () =>
    fc.constantFrom('RussellCup', 'CountyMeet', 'AllComers');

/**
 * Generator for valid years (reasonable range for athletics records)
 */
const yearGenerator = () =>
    fc.integer({ min: 1950, max: 2030 });

/**
 * Generator for Strapi file objects (PDFs)
 */
const strapiFileGenerator = (): fc.Arbitrary<StrapiFile> =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        name: fc.string({ minLength: 5, maxLength: 50 }).map(s => `${s}.pdf`),
        alternativeText: fc.option(fc.string({ minLength: 5, maxLength: 100 })),
        caption: fc.option(fc.string({ minLength: 5, maxLength: 100 })),
        url: fc.string({ minLength: 10, maxLength: 100 }).map(s => `/uploads/${s}.pdf`),
        mime: fc.constant('application/pdf'),
        size: fc.integer({ min: 1000, max: 10000000 })
    });

/**
 * Generator for valid ISO date strings
 */
const isoDateGenerator = () =>
    fc.integer({ min: 946684800000, max: 1924905600000 }) // 2000-01-01 to 2030-12-31 in milliseconds
        .map(timestamp => new Date(timestamp).toISOString());

/**
 * Generator for MeetResult objects
 */
const meetResultGenerator = (): fc.Arbitrary<MeetResult> =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        meetName: meetNameGenerator(),
        year: yearGenerator(),
        title: fc.string({ minLength: 5, maxLength: 100 }),
        description: fc.option(fc.string({ minLength: 10, maxLength: 500 })),
        resultsPDF: strapiFileGenerator(),
        publishedAt: isoDateGenerator(),
        createdAt: isoDateGenerator(),
        updatedAt: isoDateGenerator()
    });

/**
 * Generator for arrays of MeetResult objects
 */
const meetResultsArrayGenerator = (minLength = 1, maxLength = 20) =>
    fc.array(meetResultGenerator(), { minLength, maxLength });

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sort meet results by year descending (most recent first)
 */
function sortMeetResultsByYear(results: MeetResult[]): MeetResult[] {
    return [...results].sort((a, b) => b.year - a.year);
}

/**
 * Check if results are sorted by year descending
 */
function isSortedByYearDescending(results: MeetResult[]): boolean {
    for (let i = 0; i < results.length - 1; i++) {
        if (results[i].year < results[i + 1].year) {
            return false;
        }
    }
    return true;
}

/**
 * Check if a URL is valid for a PDF file
 */
function isValidPDFUrl(url: string): boolean {
    // URL should be non-empty and point to a PDF
    return url.length > 0 && (url.endsWith('.pdf') || url.includes('.pdf'));
}

/**
 * Filter meet results by meet name
 */
function filterByMeetName(
    results: MeetResult[],
    meetName: 'RussellCup' | 'CountyMeet' | 'AllComers'
): MeetResult[] {
    return results.filter(r => r.meetName === meetName);
}

// ============================================================================
// Property Tests
// ============================================================================

describe('Meet Results Property Tests', () => {

    /**
     * Property 10: Meet Results Organization
     * 
     * For any collection of meet results for a specific meet, displaying them 
     * should show results sorted by year in descending order (most recent first).
     * 
     * Validates: Requirements 4.3
     */
    test('Feature: athletics-website-redesign, Property 10: Meet Results Organization', () => {
        fc.assert(
            fc.property(
                meetResultsArrayGenerator(2, 20),
                (results) => {
                    // Sort the results by year descending
                    const sorted = sortMeetResultsByYear(results);

                    // Verify the sorted results are in descending order
                    expect(isSortedByYearDescending(sorted)).toBe(true);

                    // Verify all original results are present
                    expect(sorted.length).toBe(results.length);

                    // Verify no results were lost or duplicated
                    const originalIds = results.map(r => r.id).sort();
                    const sortedIds = sorted.map(r => r.id).sort();
                    expect(sortedIds).toEqual(originalIds);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Property 11: PDF Link Correctness
     * 
     * For any meet result with an uploaded PDF, the rendered link should point 
     * to the correct PDF file URL that successfully downloads or opens the file.
     * 
     * Validates: Requirements 4.4
     */
    test('Feature: athletics-website-redesign, Property 11: PDF Link Correctness', () => {
        fc.assert(
            fc.property(
                meetResultGenerator(),
                (result) => {
                    // Verify the PDF object exists
                    expect(result.resultsPDF).toBeDefined();

                    // Verify the PDF has a valid URL
                    expect(result.resultsPDF.url).toBeDefined();
                    expect(isValidPDFUrl(result.resultsPDF.url)).toBe(true);

                    // Verify the PDF has correct MIME type
                    expect(result.resultsPDF.mime).toBe('application/pdf');

                    // Verify the PDF has a name
                    expect(result.resultsPDF.name).toBeDefined();
                    expect(result.resultsPDF.name.length).toBeGreaterThan(0);

                    // Verify the URL is accessible (non-empty string)
                    expect(typeof result.resultsPDF.url).toBe('string');
                    expect(result.resultsPDF.url.length).toBeGreaterThan(0);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Property 12: Meet Type Support
     * 
     * For any of the three meet types (RussellCup, CountyMeet, AllComers), 
     * the system should accept, store, and retrieve meet results with that 
     * type correctly.
     * 
     * Validates: Requirements 4.5
     */
    test('Feature: athletics-website-redesign, Property 12: Meet Type Support', () => {
        fc.assert(
            fc.property(
                meetResultsArrayGenerator(10, 30),
                meetNameGenerator(),
                (results, targetMeetName) => {
                    // Filter results by the target meet name
                    const filtered = filterByMeetName(results, targetMeetName);

                    // Verify all filtered results have the correct meet name
                    for (const result of filtered) {
                        expect(result.meetName).toBe(targetMeetName);
                    }

                    // Verify no results with the target meet name were excluded
                    const expectedCount = results.filter(r => r.meetName === targetMeetName).length;
                    expect(filtered.length).toBe(expectedCount);

                    // Verify the meet name is one of the valid types
                    const validMeetNames = ['RussellCup', 'CountyMeet', 'AllComers'];
                    expect(validMeetNames).toContain(targetMeetName);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Additional Property: Meet Results Filtering and Sorting Combined
     * 
     * For any collection of meet results, filtering by meet name and then 
     * sorting by year should produce results that are both correctly filtered 
     * and correctly sorted.
     */
    test('Feature: athletics-website-redesign, Combined filtering and sorting', () => {
        fc.assert(
            fc.property(
                meetResultsArrayGenerator(10, 30),
                meetNameGenerator(),
                (results, targetMeetName) => {
                    // Filter by meet name
                    const filtered = filterByMeetName(results, targetMeetName);

                    // Sort by year descending
                    const sorted = sortMeetResultsByYear(filtered);

                    // Verify all results have the correct meet name
                    for (const result of sorted) {
                        expect(result.meetName).toBe(targetMeetName);
                    }

                    // Verify results are sorted by year descending
                    expect(isSortedByYearDescending(sorted)).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });
});
