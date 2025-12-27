<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header/Header.svelte';

	export let data: PageData;

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

<svelte:head>
	<title>{data.post.title} - Athletics News</title>
	<meta name="description" content={data.post.excerpt} />
	{#if data.post.featuredImage}
		<meta property="og:image" content={data.post.featuredImage.url} />
	{/if}
</svelte:head>

<Header />

<main class="news-post">
	<article class="container">
		<!-- Back to News Link -->
		<nav class="breadcrumb">
			<a href="/news">← Back to News</a>
		</nav>

		<!-- Featured Image -->
		{#if data.post.featuredImage}
			<div class="featured-image">
				<img
					src={data.post.featuredImage.formats.large?.url || data.post.featuredImage.url}
					srcset="
						{data.post.featuredImage.formats.medium?.url || data.post.featuredImage.url} 750w,
						{data.post.featuredImage.formats.large?.url || data.post.featuredImage.url} 1000w,
						{data.post.featuredImage.formats.xlarge?.url || data.post.featuredImage.url} 1920w
					"
					sizes="(max-width: 768px) 100vw, 1200px"
					alt={data.post.featuredImage.alternativeText || data.post.title}
					loading="eager"
				/>
			</div>
		{/if}

		<!-- Post Header -->
		<header class="post-header">
			<h1 class="post-title">{data.post.title}</h1>

			<div class="post-meta">
				<time class="post-date" datetime={data.post.publishedAt}>
					{formatDate(data.post.publishedAt)}
				</time>
				{#if data.post.author}
					<span class="post-author">By {data.post.author}</span>
				{/if}
			</div>
		</header>

		<!-- Post Content -->
		<div class="post-content">
			{@html data.post.content}
		</div>

		<!-- Back to News Link (bottom) -->
		<nav class="post-footer">
			<a href="/news" class="back-link">← Back to All News</a>
		</nav>
	</article>
</main>

<style>
	.news-post {
		min-height: 100vh;
		background: #f9fafb;
		padding: 2rem 0 4rem;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* Breadcrumb */
	.breadcrumb {
		margin-bottom: 2rem;
	}

	.breadcrumb a {
		color: #0066cc;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s;
	}

	.breadcrumb a:hover {
		color: #0052a3;
	}

	/* Featured Image */
	.featured-image {
		width: 100%;
		margin-bottom: 2rem;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.featured-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	/* Post Header */
	.post-header {
		margin-bottom: 2rem;
	}

	.post-title {
		font-size: 3rem;
		font-weight: 800;
		color: #1a1a1a;
		margin: 0 0 1rem 0;
		line-height: 1.2;
	}

	.post-meta {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		color: #666;
		font-size: 1rem;
	}

	.post-date {
		font-weight: 600;
	}

	.post-author {
		font-style: italic;
	}

	/* Post Content */
	.post-content {
		background: white;
		padding: 3rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		margin-bottom: 3rem;
		line-height: 1.8;
		color: #333;
	}

	.post-content :global(h2) {
		font-size: 2rem;
		font-weight: 700;
		margin: 2rem 0 1rem 0;
		color: #1a1a1a;
	}

	.post-content :global(h3) {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
		color: #1a1a1a;
	}

	.post-content :global(p) {
		margin: 0 0 1.5rem 0;
		font-size: 1.125rem;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin: 0 0 1.5rem 0;
		padding-left: 2rem;
	}

	.post-content :global(li) {
		margin-bottom: 0.5rem;
		font-size: 1.125rem;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid #0066cc;
		padding-left: 1.5rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: #555;
	}

	.post-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1.5rem 0;
	}

	.post-content :global(a) {
		color: #0066cc;
		text-decoration: underline;
	}

	.post-content :global(a:hover) {
		color: #0052a3;
	}

	/* Post Footer */
	.post-footer {
		text-align: center;
		padding-top: 2rem;
		border-top: 2px solid #e5e7eb;
	}

	.back-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: background 0.2s;
	}

	.back-link:hover {
		background: #0052a3;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.post-title {
			font-size: 2rem;
		}

		.post-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.post-content {
			padding: 1.5rem;
		}

		.post-content :global(h2) {
			font-size: 1.5rem;
		}

		.post-content :global(h3) {
			font-size: 1.25rem;
		}

		.post-content :global(p),
		.post-content :global(li) {
			font-size: 1rem;
		}
	}
</style>
