export const days = [
	{ title: 'Naughty or Nice' },
	{ title: 'Merry Munch-o-Meter' },
	{ title: 'Jingle Bell Balancer' }
].map((day, idx) => ({
	...day,
	num: idx + 1
}));
