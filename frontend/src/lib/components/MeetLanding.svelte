<script lang="ts">
	import { onMount } from 'svelte';
	import { getMeetResultsByName } from '$lib/api/strapi';
	import type { MeetResult } from '$lib/types/strapi';

	export let meetName: 'RussellCup' | 'CountyMeet' | 'AllComers';

	let results: MeetResult[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			loading = true;
			error = null;
			results = await getMeetResultsByName(meetName);
			// Results are already sorted by year descending from the API
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load meet results';
			console.error('Error fetching meet results:', err);
		} finally {
			loading = false;
		}
	});

	// Format meet name for display
	function formatMeetName(name: string): string {
		switch (name) {
			case 'RussellCup':
				return 'Russell Cup';
			case 'CountyMeet':
				return 'Santa Barbara County Meet';
			case 'AllComers':
				return 'All Comers Meet';
			default:
				return name;
		}
	}
</script>

<div class="meet-landing">
	<h1>{formatMeetName(meetName)}</h1>

	{#if loading}
		<div class="loading">
			<p>Loading meet results...</p>
		</div>
	{:else if error}
		<div class="error">
			<p>{error}</p>
		</div>
	{:else if results.length === 0}
		<div class="empty">
			<p>No results available for this meet yet.</p>
		</div>
	{:else}
		<div class="results-grid">
			{#each results as result}
				<div class="result-card">
					<div class="card-header">
						<h2>{result.year}</h2>
						<h3>{result.title}</h3>
					</div>
					{#if result.description}
						<div class="card-description">
							<p>{result.description}</p>
						</div>
					{/if}
					<div class="card-footer">
						<a
							href={result.resultsPDF.url}
							target="_blank"
							rel="noopener noreferrer"
							class="pdf-link"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
							Download PDF Results
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.meet-landing {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: #1a1a1a;
		text-align: center;
	}

	.loading,
	.error,
	.empty {
		text-align: center;
		padding: 3rem 1rem;
		font-size: 1.125rem;
	}

	.error {
		color: #dc2626;
	}

	.empty {
		color: #6b7280;
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.result-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.2s ease;
	}

	.result-card:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.card-header h2 {
		font-size: 2rem;
		font-weight: bold;
		color: #1a1a1a;
		margin: 0 0 0.5rem 0;
	}

	.card-header h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #374151;
		margin: 0 0 1rem 0;
	}

	.card-description {
		margin-bottom: 1.5rem;
	}

	.card-description p {
		color: #6b7280;
		line-height: 1.6;
		margin: 0;
	}

	.card-footer {
		border-top: 1px solid #e5e7eb;
		padding-top: 1rem;
	}

	.pdf-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #2563eb;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.pdf-link:hover {
		color: #1d4ed8;
		text-decoration: underline;
	}

	.pdf-link svg {
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.results-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
