<script lang="ts">
	import { page } from '$app/stores';
	const { data } = $props();
	let tallies = $state(data.tallies.map((t) => ({ ...t, id: crypto.randomUUID() })));

	const statuses = ['all', 'naughty', 'nice'] as const;
	type ChildStatus = (typeof statuses)[number];
	const sorts = ['none', 'asc', 'desc'] as const;
	type SortDirection = (typeof sorts)[number];

	let selectedStatus = $derived(
		($page.url.searchParams.get('status') as ChildStatus) || statuses[0]
	);

	let sortName = $derived(($page.url.searchParams.get('sortName') as SortDirection) || 'none');
	let sortTally = $derived(($page.url.searchParams.get('sortTally') as SortDirection) || 'none');

	function nextSort(current: SortDirection) {
		return sorts[(sorts.indexOf(current) + 1) % sorts.length];
	}

	const filteredTallies = $derived(filterTallies());
	const sortedTallies = $derived(sortTallies());

	function filterTallies() {
		if (selectedStatus === 'all') {
			return tallies;
		}

		return tallies.filter((t) => getStatus(t.tally) === selectedStatus);
	}

	type Tally = (typeof tallies)[number];
	type TallyKey = keyof Tally;

	function sortTallies() {
		const filters: [SortDirection, TallyKey][] = [
			[sortName, 'name'],
			[sortTally, 'tally']
		];

		const filterBy = filters.find(([sort]) => sort !== 'none');
		if (!filterBy) return filteredTallies;

		const [sort, key] = filterBy;

		return [...filteredTallies].sort((a, b) => {
			const [aVal, bVal] = sort === 'asc' ? [a[key], b[key]] : [b[key], a[key]];
			return typeof aVal === 'string'
				? aVal.localeCompare(bVal as string)
				: aVal - (bVal as number);
		});
	}

	function getStatus(tally: number) {
		return tally > 0 ? 'nice' : tally < 0 ? 'naughty' : 'unknown';
	}

	let name = $state('');
	let tally = $state(0);

	function addChild(e: SubmitEvent) {
		e.preventDefault(); // sorry Paolo
		tallies.unshift({
			name,
			tally,
			id: crypto.randomUUID()
		});
		name = '';
		tally = 0;
		(e.target as HTMLFormElement)?.querySelector('input')?.focus();
	}

	function handleStatusChange(e: Event) {
		(e.target as HTMLInputElement)?.form?.requestSubmit();
	}
</script>

<form
	onchange={handleStatusChange}
	data-sveltekit-keepfocus
	data-sveltekit-replacestate
	class="status-form"
>
	<fieldset>
		<legend>Status</legend>
		{#each statuses as status}
			<label class="radio">
				<input type="radio" name="status" value={status} checked={status === selectedStatus} />
				{status}
			</label>
		{/each}
		<button>Filter</button>
	</fieldset>
</form>

<h2>Add Child</h2>
<form onsubmit={addChild} class="add-form">
	<div><label>Name <input type="text" bind:value={name} required /></label></div>
	<div>
		<label>Tally <input type="number" bind:value={tally} required /></label>
		<button>Add</button>
	</div>
</form>

<form data-sveltekit-keepfocus data-sveltekit-replacestate>
	<input type="hidden" name="status" value={selectedStatus} />
	<table>
		<thead>
			<tr>
				<th
					>Name <button class="sort" name="sortName" value={nextSort(sortName)}
						>{@render sortIcon(sortName)}</button
					></th
				>
				<th
					>Tally <button class="sort" name="sortTally" value={nextSort(sortTally)}
						>{@render sortIcon(sortTally)}</button
					></th
				>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each sortedTallies as { name, tally, id } (id)}
				{@const status = getStatus(tally)}
				<tr>
					<td>{name}</td>
					<td>{tally}</td>
					<td data-status={status}>{status}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</form>

{#snippet sortIcon(direction: SortDirection)}
	<span class="visually-hidden">Sort {direction}</span>
	{#if direction === 'asc'}
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
				d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
			/>
		</svg>
	{:else if direction === 'desc'}
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
				d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
			/>
		</svg>
	{:else}
		<span>&mdash;</span>
	{/if}
{/snippet}

<style>
	.status-form {
		display: inline-block;
	}

	h2 {
		margin-bottom: 0.2em;
	}

	form {
		margin-bottom: 1rem;
	}

	th {
		padding: 0.5em;
	}

	.radio {
		margin-right: 0.5em;
	}

	[data-status='naughty'] {
		color: var(--red-8);
	}

	[data-status='nice'] {
		color: var(--green-8);
	}

	button.sort {
		appearance: none;
		background: none;
		cursor: pointer;
		border: 1px solid black;
		border-radius: 2px;

		display: inline-flex;
		gap: 0.5em;
		align-items: center;
		font-size: 0.75rem;
	}

	svg {
		flex-shrink: 0;
		width: 1rem;
		height: 1rem;
	}

	.add-form div {
		margin-top: 1rem;
	}
</style>
