<script lang="ts">
	import { fly } from 'svelte/transition';

	let count = $state(0);
	const MAX_COUNT = 20;
	const canAdd = $derived(count < MAX_COUNT);
	const canRemove = $derived(count > 0);
	let didHitMax = $state(false);
	let resetting = $state(false);

	const status = $derived(getStatus());

	function getStatus() {
		if (resetting) {
			return '🤮';
		}
		if (count === 0) {
			if (didHitMax) {
				return '😮‍💨';
			}
			return '😥';
		} else if (count < 5) {
			return '😌';
		} else if (count < 10) {
			return '🤩';
		} else if (count < 16) {
			return '😟';
		} else if (count < MAX_COUNT) {
			return '🥴';
		}
	}

	$effect(() => {
		if (count >= MAX_COUNT) {
			resetting = true;
			didHitMax = true;
			backToZero().then(() => (resetting = false));
		}
	});

	async function backToZero() {
		while (count > 0) {
			count--;
			await delay(100);
		}
	}

	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

<h1>Cookie Counter</h1>
<div class="buttons">
	<button onclick={() => count++} disabled={!canAdd}>More</button>
	<button onclick={() => count--} disabled={!canRemove}>Less</button>
	<button onclick={() => (count = 18)}>Reset</button>
</div>
<h2>Santa status: {status}</h2>
<div class="cookies">
	{#each { length: count } as _, idx (idx)}
		<span class="cookie" out:fly={{ y: 30, duration: 100 }}>🍪</span>
	{/each}
</div>

<style>
	.cookies {
		display: flex;
		flex-wrap: wrap;
		align-content: start;
		min-height: 10rem;
		border: 2px solid black;
		padding: 1rem;
	}

	.cookie {
		font-size: 2rem;
	}

	.buttons {
		margin-bottom: 1rem;
	}
</style>
