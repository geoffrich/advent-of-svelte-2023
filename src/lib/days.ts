export const days = [{ title: 'Naughty & Nice' }, { title: 'Cookie Counter' }].map((day, idx) => ({
	...day,
	num: idx + 1
}));
