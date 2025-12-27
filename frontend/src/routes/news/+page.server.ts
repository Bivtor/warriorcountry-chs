import type { PageServerLoad } from './$types';
import { getNewsPosts } from '$lib/api/strapi';

export const load: PageServerLoad = async ({ url }) => {
    try {
        // Get page number from query parameter, default to 1
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const pageSize = 10;

        // Fetch all news posts with pagination
        const newsPosts = await getNewsPosts({ page, pageSize });

        return {
            newsPosts,
            currentPage: page,
            pageSize
        };
    } catch (error) {
        console.error('Error loading news archive:', error);
        return {
            newsPosts: [],
            currentPage: 1,
            pageSize: 10,
            error: error instanceof Error ? error.message : 'Failed to load news posts'
        };
    }
};
