<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { interpolateHsl } from 'd3-interpolate';

	const MAX_VALUE = 20;

	const { data } = $props();
	const weights = $state(
		data.weights.map((weight) => ({
			...weight,
			include: false,
			id: crypto.randomUUID()
		}))
	);
	const total = $derived(getTotalWeight());
	const tweenedTotal = tweened(total);
	const tweenedProgressColor = tweened('green', {
		interpolate: interpolateHsl
	});

	$effect(() => {
		tweenedTotal.set(total);
		tweenedProgressColor.set(interpolateHsl('green', 'red')(total / MAX_VALUE));
	});

	function getTotalWeight() {
		return weights.reduce((total, { weight, include }) => total + (include ? weight : 0), 0);
	}

	function removeAll() {
		weights.forEach((weight) => (weight.include = false));
	}

	function canToggleItem(item: (typeof weights)[0]) {
		return item.weight + total <= MAX_VALUE || item.include;
	}

	function toggleItem(item: (typeof weights)[0]) {
		if (canToggleItem(item)) {
			item.include = !item.include;
		}
	}
</script>

<div class="total">
	<p>Total: {total.toFixed(2)}</p>

	<progress max={MAX_VALUE} value={$tweenedTotal} style:accent-color={$tweenedProgressColor}
	></progress>
</div>

<button onclick={removeAll}>Remove all</button>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Weight (kg)</th>
			<th>Include?</th>
		</tr>
	</thead>
	<tbody>
		{#each weights as item (item.id)}
			{@const { name, weight } = item}
			{@const canToggle = canToggleItem(item)}
			<tr onclick={() => toggleItem(item)} data-disabled={!canToggle ? '' : null}>
				<td>{name}</td>
				<td>{weight}</td>
				<td
					><input
						type="checkbox"
						bind:checked={item.include}
						aria-label="Include {name}"
						disabled={!canToggle}
					/></td
				>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	progress {
		width: 100%;
	}

	.total {
		position: sticky;
		top: 0;
		background: white;
		padding-top: 0.5rem;
	}

	tbody tr:hover {
		cursor: pointer;
	}

	tr[data-disabled] {
		opacity: 0.5;
	}

	tr[data-disabled]:hover {
		cursor: not-allowed;
	}

	tr:has(:checked) td {
		text-decoration: line-through;
	}

	input {
		height: 1rem;
		width: 1rem;
	}

	table {
		border-spacing: 0.5rem;
	}
</style>
