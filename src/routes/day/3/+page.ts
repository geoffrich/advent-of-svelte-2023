export async function load({ fetch }) {
	const weights: { name: string; weight: number }[] = await fetch(
		'https://advent.sveltesociety.dev/data/2023/day-three.json'
	).then((r) => r.json());
	return {
		weights
	};
}
