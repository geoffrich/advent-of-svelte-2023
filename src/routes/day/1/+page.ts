export async function load({ fetch }) {
	const tallies: { name: string; tally: number }[] = await fetch(
		'https://advent.sveltesociety.dev/data/2023/day-one.json'
	).then((r) => r.json());
	return {
		tallies
	};
}
