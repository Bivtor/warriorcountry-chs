<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header/Header.svelte';
	import NewsCard from '$lib/components/NewsCard.svelte';

	export let data: PageData;

	// Calculate pagination info
	$: totalPosts = data.newsPosts.length;
	$: hasNextPage = totalPosts === data.pageSize;
	$: hasPrevPage = data.currentPage > 1;

	function goToPage(page: number) {
		window.location.href = `/news?page=${page}`;
	}
</script>

<Header />

<main class="news-archive">
	<div class="container">
		<header class="page-header">
			<h1 class="page-title">News Archive</h1>
			<p class="page-description">
				Stay up to date with the latest athletics news and achievements
			</p>
		</header>

		{#if data.error}
			<div class="error-message">
				<p>{data.error}</p>
			</div>
		{/if}

		{#if data.newsPosts && data.newsPosts.length > 0}
			<div class="news-list">
				{#each data.newsPosts as post}
					<NewsCard {post} variant="list" />
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if hasNextPage || hasPrevPage}
				<nav class="pagination" aria-label="News pagination">
					<button
						class="pagination-button"
						disabled={!hasPrevPage}
						on:click={() => goToPage(data.currentPage - 1)}
					>
						← Previous
					</button>

					<span class="pagination-info">Page {data.currentPage}</span>

					<button
						class="pagination-button"
						disabled={!hasNextPage}
						on:click={() => goToPage(data.currentPage + 1)}
					>
						Next →
					</button>
				</nav>
			{/if}
		{:else}
			<div class="no-posts">
				<p>No news posts available at this time.</p>
				<a href="/" class="back-home">← Back to Home</a>
			</div>
		{/if}
	</div>
</main>

<style>
	.news-archive {
		min-height: 100vh;
		background: #f9fafb;
		padding: 2rem 0 4rem;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
		padding-top: 2rem;
	}

	.page-title {
		font-size: 3rem;
		font-weight: 800;
		color: #1a1a1a;
		margin: 0 0 1rem 0;
	}

	.page-description {
		font-size: 1.25rem;
		color: #666;
		margin: 0;
	}

	.error-message {
		background: #fee;
		color: #c00;
		padding: 1rem;
		text-align: center;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.no-posts {
		text-align: center;
		padding: 4rem 2rem;
	}

	.no-posts p {
		font-size: 1.25rem;
		color: #666;
		margin: 0 0 1.5rem 0;
	}

	.back-home {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: background 0.2s;
	}

	.back-home:hover {
		background: #0052a3;
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		padding: 2rem 0;
	}

	.pagination-button {
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.pagination-button:hover:not(:disabled) {
		background: #0052a3;
	}

	.pagination-button:disabled {
		background: #ccc;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.pagination-info {
		font-size: 1rem;
		color: #666;
		font-weight: 600;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.page-description {
			font-size: 1rem;
		}

		.page-header {
			margin-bottom: 2rem;
		}

		.pagination {
			gap: 1rem;
		}

		.pagination-button {
			padding: 0.5rem 1rem;
			font-size: 0.875rem;
		}
	}
</style>
