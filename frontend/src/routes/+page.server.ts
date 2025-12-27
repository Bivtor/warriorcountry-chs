import type { PageServerLoad } from './$types';
import { getHomepageSettings, getNewsPosts } from '$lib/api/strapi';

export const load: PageServerLoad = async () => {
    try {
        // Fetch homepage settings and news posts in parallel
        const [settings, newsPosts] = await Promise.all([
            getHomepageSettings(),
            getNewsPosts({ limit: 5 }) // Default to 5, will be overridden by settings
        ]);

        // Use the featured news count from settings if available
        const newsCount = settings.featuredNewsCount || 5;
        const recentNews = newsPosts.slice(0, newsCount);

        return {
            settings,
            newsPosts: recentNews
        };
    } catch (error) {
        console.error('Error loading homepage data:', error);
        // Return empty data on error - component will handle display
        return {
            settings: null,
            newsPosts: [],
            error: error instanceof Error ? error.message : 'Failed to load homepage data'
        };
    }
};
