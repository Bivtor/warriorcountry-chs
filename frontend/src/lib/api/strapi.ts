/**
 * Strapi API Client
 * 
 * Provides functions to fetch content from the Strapi CMS backend.
 * Handles error cases and provides type-safe responses.
 */

import type {
    StrapiResponse,
    StrapiError,
    MeetResult,
    NewsPost,
    ArchiveLink,
    HomepageSettings
} from '$lib/types/strapi';

// Get Strapi URL from environment variable or use default
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

/**
 * Generic fetch function for Strapi API with error handling
 * 
 * @param path - API endpoint path (e.g., '/meet-results')
 * @param params - Optional query parameters
 * @returns Parsed JSON response
 * @throws Error with user-friendly message on failure
 */
export async function fetchAPI<T>(
    path: string,
    params?: Record<string, any>
): Promise<T> {
    try {
        // Build query string from parameters
        const queryString = params
            ? '?' + new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => {
                    // Handle nested objects and arrays for Strapi filters
                    if (typeof value === 'object' && value !== null) {
                        acc[key] = JSON.stringify(value);
                    } else {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            ).toString()
            : '';

        const url = `${STRAPI_URL}/api${path}${queryString}`;
        const response = await fetch(url);

        if (!response.ok) {
            // Handle different error types
            if (response.status === 404) {
                throw new Error('Content not found');
            } else if (response.status === 500) {
                throw new Error('Something went wrong. Please try again later.');
            } else if (response.status === 503) {
                throw new Error('Service temporarily unavailable. Please try again later.');
            } else {
                throw new Error(`API error: ${response.status}`);
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Unable to connect. Please check your internet connection.');
        }
        // Re-throw other errors
        throw error;
    }
}

/**
 * Get all meet results, optionally filtered by meet name
 * 
 * @param meetName - Optional meet name to filter by
 * @returns Array of meet results
 */
export async function getMeetResults(
    meetName?: 'RussellCup' | 'CountyMeet' | 'AllComers'
): Promise<MeetResult[]> {
    const params: Record<string, any> = {
        'populate': 'resultsPDF',
        'sort': 'year:desc'
    };

    if (meetName) {
        params['filters[meetName][$eq]'] = meetName;
    }

    const response = await fetchAPI<StrapiResponse<MeetResult[]>>('/meet-results', params);
    return response.data;
}

/**
 * Get meet results for a specific meet name
 * 
 * @param meetName - The meet name to filter by
 * @returns Array of meet results for the specified meet
 */
export async function getMeetResultsByName(
    meetName: 'RussellCup' | 'CountyMeet' | 'AllComers'
): Promise<MeetResult[]> {
    return getMeetResults(meetName);
}

/**
 * Get news posts with optional pagination and limit
 * 
 * @param options - Optional pagination and limit options
 * @returns Array of news posts
 */
export async function getNewsPosts(options?: {
    page?: number;
    pageSize?: number;
    limit?: number;
}): Promise<NewsPost[]> {
    const params: Record<string, any> = {
        'populate': 'featuredImage',
        'sort': 'publishedAt:desc'
    };

    if (options?.page) {
        params['pagination[page]'] = options.page;
    }
    if (options?.pageSize) {
        params['pagination[pageSize]'] = options.pageSize;
    }
    if (options?.limit) {
        params['pagination[limit]'] = options.limit;
    }

    const response = await fetchAPI<StrapiResponse<NewsPost[]>>('/news-posts', params);
    return response.data;
}

/**
 * Get a single news post by slug
 * 
 * @param slug - The URL-friendly slug of the news post
 * @returns The news post or null if not found
 */
export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
    const params = {
        'filters[slug][$eq]': slug,
        'populate': 'featuredImage'
    };

    const response = await fetchAPI<StrapiResponse<NewsPost[]>>('/news-posts', params);

    if (response.data.length === 0) {
        return null;
    }

    return response.data[0];
}

/**
 * Get homepage settings configuration
 * 
 * @returns Homepage settings object
 */
export async function getHomepageSettings(): Promise<HomepageSettings> {
    const params = {
        'populate': '*'
    };

    const response = await fetchAPI<StrapiResponse<HomepageSettings>>('/homepage-setting', params);
    return response.data;
}

/**
 * Get all archive links, optionally sorted by year
 * 
 * @returns Array of archive links
 */
export async function getArchiveLinks(): Promise<ArchiveLink[]> {
    const params = {
        'sort': 'year:desc'
    };

    const response = await fetchAPI<StrapiResponse<ArchiveLink[]>>('/archive-links', params);
    return response.data;
}
