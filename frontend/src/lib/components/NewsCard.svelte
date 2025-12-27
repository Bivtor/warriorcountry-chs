<script lang="ts">
	import type { NewsPost } from '$lib/types/strapi';

	export let post: NewsPost;
	export let variant: 'featured' | 'list' = 'featured';

	// Format date for display
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<article class="news-card {variant}">
	<a href="/news/{post.slug}" class="news-card-link">
		{#if post.featuredImage}
			<div class="news-card-image">
				<img
					src={post.featuredImage.formats.medium?.url || post.featuredImage.url}
					srcset="
						{post.featuredImage.formats.small?.url || post.featuredImage.url} 500w,
						{post.featuredImage.formats.medium?.url || post.featuredImage.url} 750w,
						{post.featuredImage.formats.large?.url || post.featuredImage.url} 1000w
					"
					sizes={variant === 'featured'
						? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
						: '(max-width: 640px) 100vw, 300px'}
					alt={post.featuredImage.alternativeText || post.title}
					loading="lazy"
					width={post.featuredImage.width}
					height={post.featuredImage.height}
				/>
			</div>
		{/if}

		<div class="news-card-content">
			<h3 class="news-card-title">{post.title}</h3>
			<time class="news-card-date" datetime={post.publishedAt}>
				{formatDate(post.publishedAt)}
			</time>
			<p class="news-card-excerpt">{post.excerpt}</p>
			<span class="news-card-read-more">Read More →</span>
		</div>
	</a>
</article>

<style>
	.news-card {
		display: flex;
		flex-direction: column;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.news-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.news-card-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.news-card-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #f0f0f0;
	}

	.news-card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.news-card-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.news-card-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: #1a1a1a;
		line-height: 1.3;
	}

	.news-card-date {
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 1rem;
		display: block;
	}

	.news-card-excerpt {
		font-size: 1rem;
		color: #333;
		line-height: 1.6;
		margin: 0 0 1rem 0;
		flex: 1;
	}

	.news-card-read-more {
		font-size: 0.875rem;
		font-weight: 600;
		color: #0066cc;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	/* List variant styles */
	.news-card.list {
		flex-direction: row;
	}

	.news-card.list .news-card-link {
		flex-direction: row;
	}

	.news-card.list .news-card-image {
		width: 300px;
		min-width: 300px;
		aspect-ratio: 4 / 3;
	}

	.news-card.list .news-card-title {
		font-size: 1.25rem;
	}

	.news-card.list .news-card-excerpt {
		font-size: 0.9375rem;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.news-card.list {
			flex-direction: column;
		}

		.news-card.list .news-card-link {
			flex-direction: column;
		}

		.news-card.list .news-card-image {
			width: 100%;
			aspect-ratio: 16 / 9;
		}

		.news-card-title {
			font-size: 1.25rem;
		}

		.news-card-content {
			padding: 1rem;
		}
	}
</style>
