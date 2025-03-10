import addKeyFreeze from '../addKeyFreeze.js';

export default addKeyFreeze({
	hero: {
		name: 'Hero',
		char: '@',
		aggro: 0,
		sprites: [
			['plain-m', 1],
			['plain-f', 1],
		],
		hp: 40,
		faction: 'humans',
		mana: 10,
	},
	villager: {
		name: 'villager',
		aggro: 0,
		sprites: [
			['plain-m', 1],
			['plain-f', 1],
		],
		hp: 10,
		faction: 'humans',
		deflection: 0,
		faith: 10,
	},
	goblin: {
		name: 'goblin',
		aggro: 1,
		char: 'g',
		sprites: [
			['goblin', 1],
		],
		hp: 8,
		faction: 'trollkin',
	},
	orc: {
		name: 'orc',
		aggro: 1,
		char: 'O',
		sprites: [
			['orc', 1],
		],
		hp: 12,
		faction: 'trollkin',
		naturalDamage: { physical: [3, 5] },
	},
	cyclops: {
		name: 'cyclops',
		aggro: 1,
		char: 'C',
		sprites: [
			['cyclops', 1],
		],
		hp: 15,
		faction: 'trollkin',
		naturalDamage: { physical: [3, 7] },
		deflection: 20,
	},
	troll: {
		name: 'troll',
		aggro: 1,
		char: 'T',
		sprites: [
			['troll', 1],
		],
		hp: 20,
		faction: 'trollkin',
		naturalDamage: { physical: [3, 8] },
		deflection: 30,
	},
	skeleton: {
		aggro: 1,
		name: 'skeleton',
		char: 's',
		sprites: [
			['skeleton', 1],
		],
		hp: 9,
		faction: 'unliving',
		naturalDamage: { physical: [4, 4] },
	},
	skeletonKnight: {
		aggro: 1,
		name: 'skeleton',
		char: 's',
		sprites: [
			['skeleton-knight', 1],
		],
		hp: 15,
		faction: 'unliving',
		naturalDamage: { physical: [4, 6] },
		deflection: 30,
	},
});
