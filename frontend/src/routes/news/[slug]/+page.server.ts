import type { PageServerLoad } from './$types';
import { getNewsPostBySlug } from '$lib/api/strapi';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const post = await getNewsPostBySlug(params.slug);

        if (!post) {
            throw error(404, 'News post not found');
        }

        return {
            post
        };
    } catch (err) {
        // If it's already a SvelteKit error, re-throw it
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        }

        // Otherwise, log and throw a generic error
        console.error('Error loading news post:', err);
        throw error(500, 'Failed to load news post');
    }
};
