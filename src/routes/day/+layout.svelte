<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import type { LayoutData } from './$types';
	import { days } from '$lib/days';
	import { reducedMotion } from '$lib/reducedMotion';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let data: LayoutData;

	$: day = data.day;

	$: showNext = day < days.length;
	$: showPrev = day > 1;
	$: range = getPageRange(day);

	function getPageRange(current: number) {
		const items = days.map((d) => d.num);
		const offset = 2;
		const leftBoundary = Math.max(current - offset - 1, 0);
		const rightBoundary = current + offset;
		const left = items.slice(leftBoundary, current);
		const right = items.slice(current, rightBoundary);
		const diff = left.length - (right.length - 1);
		if (diff < 0) {
			right.push(...items.slice(rightBoundary, rightBoundary + Math.abs(diff)));
		} else if (left.length > right.length - 1) {
			left.unshift(...items.slice(leftBoundary - Math.abs(diff), leftBoundary));
		}
		return left.concat(right);
	}
</script>

<!-- TODO: skip link, make this not in main -->
<nav class="items" in:slide>
	<svelte:element
		this={showPrev ? 'a' : 'div'}
		class="item"
		href={showPrev ? `/day/${day - 1}` : null}
		aria-hidden={showPrev ? undefined : 'true'}
	>
		<span class="visually-hidden">Previous day</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
			/>
		</svg>
	</svelte:element>
	{#each range as idx (idx)}
		{@const isCurrent = idx === day}
		<a
			class="item"
			animate:flip={{ duration: $reducedMotion ? 0 : 400 }}
			transition:fade|local={{ duration: $reducedMotion ? 0 : 400 }}
			class:current={isCurrent}
			href="/day/{idx}"
			style:--primary={idx % 2 === 0 ? 'var(--green-7)' : null}>{idx}</a
		>
	{/each}
	<svelte:element
		this={showNext ? 'a' : 'div'}
		class="item"
		href={showNext ? `/day/${day + 1}` : null}
		aria-hidden={showNext ? undefined : 'true'}
	>
		<span class="visually-hidden">Next day</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
			/>
		</svg>
	</svelte:element>
</nav>

<div class="content">
	<slot />
</div>
<h2>
	<a
		href="https://github.com/geoffrich/advent-of-svelte-2023/tree/main/src/routes/day/{day}/%2Bpage.svelte"
		>Source code</a
	>
</h2>
{#each data.code as { filename, source }}
	{@const splitFilename = filename.split('.')}
	<h3>
		<a
			class="codelink"
			href="https://github.com/geoffrich/advent-of-svelte-2023/tree/main/src/routes/day/{day}/{filename}"
			><code>{filename}</code></a
		>
	</h3>
	<CodeBlock {source} lang={splitFilename[splitFilename.length - 1]} />
{/each}

<style>
	h2,
	h3 {
		font-weight: 400;
	}

	h2 {
		margin-top: 1.2rem;
	}

	a {
		color: black;
	}

	code {
		padding: 0.5rem;
		display: block;
		background: var(--gray-2);
		border-radius: var(--radius-2);
	}

	.codelink {
		color: black;
	}

	.item {
		--primary: var(--red-7);
		border-radius: var(--radius-round);
		background: var(--primary);
		height: 2.5rem;
		width: 2.5rem;
		display: grid;
		place-items: center;
		color: white;
		border: 1px solid var(--primary);
		text-decoration: none;
		transition: border 250ms;
		font-weight: 700;
	}

	.item.current {
		border: 3px solid black;
	}

	.items {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.item svg {
		width: var(--size-5);
	}

	/* enforce a11y via CSS! */
	.item[aria-hidden] {
		filter: grayscale();
	}

	.content {
		align-self: stretch;
	}
</style>
