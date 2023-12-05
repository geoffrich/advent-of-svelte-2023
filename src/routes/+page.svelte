<script>
	import { days } from '$lib/days';
</script>

<p>
	My solutions to the <a href="https://advent.sveltesociety.dev/">Advent of Svelte</a> challenges.
	Code for my solutions is available on
	<a href="https://github.com/geoffrich/advent-of-svelte-2023">GitHub</a>.
</p>
<!-- <p>
	Many of the solutions work without JavaScript through the magic of ✨ progressive enhancement ✨
</p> -->
<ol>
	{#each days as day}
		<li>
			<a href="/day/{day.num}" class="title">{day.title}</a>
			<span class="code"
				>(<a
					href="https://github.com/geoffrich/advent-of-svelte-2023/tree/main/src/routes/day/{day.num}/+page.svelte"
					>code<span class="visually-hidden"> for solution {day.num}</span></a
				>)</span
			>
		</li>
	{/each}
</ol>

<style>
	.code {
		font-size: var(--font-size-0);
	}

	ol {
		align-self: start;
	}
</style>
