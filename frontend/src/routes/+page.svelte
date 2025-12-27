<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header/Header.svelte';
	import NewsCard from '$lib/components/NewsCard.svelte';

	export let data: PageData;
</script>

<Header />

<main class="homepage">
	{#if data.error}
		<div class="error-message">
			<p>{data.error}</p>
		</div>
	{/if}

	<!-- Hero Section -->
	{#if data.settings}
		<section class="hero">
			{#if data.settings.heroImage}
				<div class="hero-image">
					<img
						src={data.settings.heroImage.formats.large?.url || data.settings.heroImage.url}
						srcset="
							{data.settings.heroImage.formats.medium?.url || data.settings.heroImage.url} 750w,
							{data.settings.heroImage.formats.large?.url || data.settings.heroImage.url} 1000w,
							{data.settings.heroImage.formats.xlarge?.url || data.settings.heroImage.url} 1920w
						"
						sizes="100vw"
						alt="Hero"
						loading="eager"
					/>
				</div>
			{/if}

			<div class="hero-content">
				{#if data.settings.logoImage}
					<img
						src={data.settings.logoImage.formats.medium?.url || data.settings.logoImage.url}
						alt="Logo"
						class="hero-logo"
					/>
				{/if}
				<h1 class="hero-title">{data.settings.heroTitle || 'Feel the Speed, Embrace the Pride'}</h1>
				{#if data.settings.heroSubtitle}
					<p class="hero-subtitle">{data.settings.heroSubtitle}</p>
				{/if}
			</div>
		</section>
	{:else}
		<section class="hero hero-fallback">
			<div class="hero-content">
				<h1 class="hero-title">Feel the Speed, Embrace the Pride</h1>
			</div>
		</section>
	{/if}

	<!-- News Section -->
	<section class="news-section">
		<div class="container">
			<div class="section-header">
				<h2 class="section-title">Latest News</h2>
				<a href="/news" class="view-all-button">View All News →</a>
			</div>

			{#if data.newsPosts && data.newsPosts.length > 0}
				<div class="news-grid">
					{#each data.newsPosts as post}
						<NewsCard {post} variant="featured" />
					{/each}
				</div>
			{:else}
				<p class="no-news">No news posts available at this time.</p>
			{/if}
		</div>
	</section>

	<!-- Instagram Section -->
	{#if data.settings?.instagramEmbedCode}
		<section class="instagram-section">
			<div class="container">
				<h2 class="section-title">Follow Us on Instagram</h2>
				<div class="instagram-embed">
					{@html data.settings.instagramEmbedCode}
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	.homepage {
		min-height: 100vh;
		background: #f9fafb;
	}

	.error-message {
		background: #fee;
		color: #c00;
		padding: 1rem;
		text-align: center;
		border-bottom: 2px solid #c00;
	}

	/* Hero Section */
	.hero {
		position: relative;
		width: 100%;
		min-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.hero-fallback {
		min-height: 300px;
	}

	.hero-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	.hero-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-image::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		color: white;
		padding: 2rem;
		max-width: 800px;
	}

	.hero-logo {
		max-width: 200px;
		height: auto;
		margin: 0 auto 2rem;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	.hero-title {
		font-size: 3rem;
		font-weight: 800;
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		line-height: 1.2;
	}

	.hero-subtitle {
		font-size: 1.25rem;
		margin: 0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		line-height: 1.6;
	}

	/* Container */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* News Section */
	.news-section {
		padding: 4rem 0;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0;
	}

	.view-all-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: background 0.2s;
	}

	.view-all-button:hover {
		background: #0052a3;
	}

	.news-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.no-news {
		text-align: center;
		color: #666;
		font-size: 1.125rem;
		padding: 3rem 0;
	}

	/* Instagram Section */
	.instagram-section {
		padding: 4rem 0;
		background: white;
	}

	.instagram-embed {
		max-width: 800px;
		margin: 2rem auto 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero {
			min-height: 400px;
		}

		.hero-title {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.hero-logo {
			max-width: 150px;
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.news-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.news-section,
		.instagram-section {
			padding: 2rem 0;
		}
	}
</style>
