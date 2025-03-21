import addKeyFreeze from '../addKeyFreeze.js';

const foodAdjectives = [
	'fresh', 'stale', 'moldy', 'hard', 'soggy', 'delicious', 'half-eaten', 'old', 'ancient',
];
const metalAdjectives = ['worn', 'rusty', 'polished', 'engraved', 'dented', 'bent'];
const magicalAdjectives = ['magic', 'mystical', 'glowing', 'engraved'];
const holyAdjectives = ['mystical', 'blessed', 'engraved'];
const armorAdjectives = ['worn', 'ugly', 'tattered', 'scuffed'];

export default addKeyFreeze({
	bread: {
		name: 'bread',
		adjectives: [
			...foodAdjectives,
			'sourdough', 'wheat', 'rye', 'beer', 'flat', 'plump', 'banana', 'nut',
		],
		equip: 'offHand',
		tags: ['food'],
		eat: { heal: { physical: [4, 5] } },
		sprites: [['bread', 1]],
	},
	cheese: {
		name: 'cheese',
		adjectives: [
			...foodAdjectives,
			'stinky', 'gooey',
		],
		tags: ['food'],
		eat: { heal: { physical: [6, 7] } },
		sprites: [['cheese', 1]],
	},
	beer: {
		name: 'beer',
		adjectives: [
			...foodAdjectives,
			'stinky', 'gooey',
		],
		equip: 'offHand',
		tags: ['food', 'drink', 'alcohol'],
		eat: { heal: { physical: [6, 7] } },
		sprites: [['beer', 1]],
		equipBoost: { maxStamina: 10 },
	},
	chickenLeg: {
		name: 'chicken leg',
		adjectives: [...foodAdjectives],
		equip: 'hand',
		tags: ['food', 'meat'],
		eat: { heal: { physical: [8, 9] } },
		sprites: [['meat-leg', 1]],
		attack: {},
	},
	turkeyLeg: {
		name: 'turkey leg',
		adjectives: [...foodAdjectives],
		equip: 'hand',
		tags: ['food', 'meat'],
		eat: { heal: { physical: [8, 14] } },
		sprites: [['meat-leg', 1]],
		attack: { damage: { physical: [2, 2] } },
	},
	pork: {
		name: 'porkchop',
		adjectives: [...foodAdjectives],
		tags: ['food', 'meat'],
		eat: { heal: { physical: [4, 14] } },
		sprites: [['meat-slab', 1]],
		attack: { damage: { physical: [2, 2] } },
	},
	mysteryMeat: {
		name: 'mystery meat',
		adjectives: [...foodAdjectives],
		tags: ['food', 'meat'],
		eat: { heal: { physical: [0, 13] } },
		sprites: [['meat-leg', 1], ['meat-slab', 1], ['kebab', 1]],
		attack: { damage: { physical: [2, 2] } },
	},
	healPotion1: {
		name: 'small yellow potion',
		adjectives: [...foodAdjectives],
		tags: ['food', 'drink', 'yellow', 'small'],
		eat: { heal: { physical: [10, 20] } },
		sprites: [['small-vial', 1]],
	},
	healPotion2: {
		name: 'medium yellow potion',
		adjectives: [...foodAdjectives],
		tags: ['food', 'drink', 'yellow', 'medium'],
		eat: { heal: { physical: [18, 30] } },
		sprites: [['small-vial', 1]],
	},
	healPotion3: {
		name: 'large yellow potion',
		adjectives: [...foodAdjectives],
		tags: ['food', 'drink', 'yellow', 'large'],
		eat: { heal: { physical: [26, 40] } },
		sprites: [['small-vial', 1]],
	},

	// ----- Weapons
	dagger: {
		name: 'dagger',
		adjectives: [...metalAdjectives, 'sharp', 'pointy', 'jagged', 'bloody'],
		equip: 'hand',
		tags: ['weapon', 'gear', 'metal', 'sharp'],
		sprites: [['dagger', 1]],
		attack: { damage: { physical: [3, 4] } },
	},
	sword: {
		name: 'copper sword',
		adjectives: [...metalAdjectives, 'sharp', 'bloody'],
		equip: 'hand',
		tags: ['weapon', 'gear', 'metal', 'sharp'],
		sprites: [['sword', 1]],
		eat: { damage: { physical: [4, 5] } },
		attack: { damage: { physical: [5, 6] } },
	},
	ironSword: {
		name: 'iron sword',
		adjectives: [...metalAdjectives, 'sharp', 'bloody'],
		equip: 'hand',
		tags: ['weapon', 'gear', 'metal', 'sharp'],
		sprites: [['sword', 1]],
		eat: { damage: { physical: [4, 5] } },
		attack: { damage: { physical: [6, 8] } },
	},
	club: {
		name: 'club',
		adjectives: ['bloody', 'dented'],
		equip: 'hand',
		tags: ['weapon', 'gear'],
		sprites: [['club', 1]],
		attack: { damage: { physical: [5, 5] } },
	},
	axe: {
		name: 'axe',
		adjectives: [...metalAdjectives, 'sharp', 'bloody'],
		equip: 'hand',
		tags: ['weapon', 'gear', 'metal', 'sharp'],
		sprites: [['axe', 1]],
		attack: { damage: { physical: [5, 8] } },
	},

	// ----- Holy
	holyHammer: {
		name: 'holy hammer',
		adjectives: [...holyAdjectives],
		equip: 'hand',
		tags: ['weapon', 'gear', 'metal', 'blunt', 'holy'],
		sprites: [['hammer', 1]],
		attack: { damage: { physical: [3, 5], holy: [3, 7] } },
		equipBoost: { maxFaith: 10 },
	},
	deathStaff: {
		name: 'staff of death',
		adjectives: [...holyAdjectives],
		equip: 'hand',
		tags: ['weapon', 'gear', 'evil', 'holy'],
		sprites: [['skull-staff', 1]],
		attack: { damage: { holy: [4, 10] } },
		equipBoost: { maxFaith: 10 },
	},

	// ----- Magick
	staff: {
		name: 'staff',
		adjectives: [...magicalAdjectives],
		equip: 'hand',
		tags: ['weapon', 'gear', 'magic'],
		sprites: [['magick-staff', 1], ['magick-scepter', 1]],
		attack: { damage: { magic: [4, 7] } },
		equipBoost: { maxMana: 10 },
	},
	wand: {
		name: 'staff of chaos',
		adjectives: [...magicalAdjectives],
		equip: 'hand',
		tags: ['weapon', 'gear', 'evil', 'magic'],
		sprites: [['skull-staff', 1]],
		attack: { damage: { magic: [4, 10] } },
		equipBoost: { maxMana: 20 },
	},

	// ----- Off-hand Gear
	shield: {
		name: 'shield',
		adjectives: [...metalAdjectives],
		equip: 'offHand',
		tags: ['gear', 'metal', 'round'],
		sprites: [['round-shield', 1]],
		equipBoost: { maxDeflection: 10 },
	},
	kiteShield: {
		name: 'shield',
		adjectives: [...metalAdjectives],
		equip: 'offHand',
		tags: ['gear', 'metal'],
		sprites: [['shield', 1]],
		equipBoost: { maxDeflection: 20 },
	},
	orb: {
		name: 'orb',
		adjectives: [...magicalAdjectives, 'clear', 'foggy'],
		equip: 'offHand',
		tags: ['gear', 'glass', 'round', 'magic'],
		sprites: [['orb', 1]],
		equipBoost: { maxMana: 50 },
	},
	ankh: {
		name: 'ankh',
		adjectives: [...magicalAdjectives, 'clear', 'foggy'],
		equip: 'offHand',
		tags: ['gear', 'glass', 'round'],
		sprites: [['ankh', 1]],
		equipBoost: { maxFaith: 50 },
	},
	flute: {
		name: 'flute',
		adjectives: ['dirty', 'polished'],
		equip: 'offHand',
		tags: ['gear', 'music', 'instrument', 'metal'],
		sprites: [['flute', 1]],
		equipBoost: { maxFaith: 10, maxStamina: 10, maxMana: 10 },
	},
	lute: {
		name: 'lute',
		adjectives: ['tuned', 'untuned', 'famous'],
		equip: 'offHand',
		tags: ['gear', 'music', 'instrument', 'wood'],
		sprites: [['lute', 1]],
		equipBoost: { maxFaith: 20, maxStamina: 20, maxMana: 20 },
	},
	harp: {
		name: 'harp',
		adjectives: ['dusty', 'ancient'],
		equip: 'offHand',
		tags: ['gear', 'music', 'instrument'],
		sprites: [['harp', 1]],
		equipBoost: { maxFaith: 30, maxStamina: 30, maxMana: 30 },
	},

	// ----- Armor
	leatherHelm: {
		name: 'leather helmet',
		adjectives: [...armorAdjectives],
		equip: 'head',
		tags: ['gear', 'armor', 'leather'],
		sprites: [['helmet-a', 1]],
		equipBoost: { maxFaith: 10, maxDeflection: 10 },
	},
	ironHelm: {
		name: 'iron helmet',
		adjectives: [...armorAdjectives],
		equip: 'head',
		tags: ['gear', 'armor', 'metal'],
		sprites: [['helmet-b', 1]],
		equipBoost: { maxDeflection: 20 },
	},
	wizardHat: {
		name: 'hat',
		adjectives: [...armorAdjectives, "sage's", "wizard's"],
		equip: 'head',
		tags: ['gear', 'armor', 'cloth'],
		sprites: [['cone-hat', 1]],
		equipBoost: { maxMana: 20, maxDeflection: 10 },
	},
	leatherGloves: {
		name: 'leather gloves',
		adjectives: [...armorAdjectives],
		equip: 'hands',
		tags: ['gear', 'armor', 'leather'],
		sprites: [['gloves', 1]],
		equipBoost: { maxFaith: 10, maxDeflection: 10 },
	},
	rangerBracers: {
		name: 'ranger bracers',
		adjectives: [...armorAdjectives],
		equip: 'hands',
		tags: ['gear', 'armor', 'leather'],
		sprites: [['bracers', 1]],
		equipBoost: { maxFaith: 10, maxDeflection: 20, maxMana: 10 },
	},
	boots: {
		name: 'boots',
		adjectives: [...armorAdjectives],
		equip: 'feet',
		tags: ['gear', 'armor', 'leather'],
		sprites: [['boots', 1]],
		equipBoost: { maxStamina: 10, maxDeflection: 10 },
	},
	belt: {
		name: 'belt',
		adjectives: [...armorAdjectives],
		equip: 'waist',
		tags: ['gear', 'armor', 'leather'],
		sprites: [['belt', 1]],
		equipBoost: { maxStamina: 10 },
	},
	priestRobe: {
		name: 'priest robe',
		adjectives: [...armorAdjectives],
		equip: 'torso',
		tags: ['gear', 'armor', 'cloth', 'holy'],
		sprites: [['robe', 1]],
		equipBoost: { maxFaith: 30 },
	},
	magicRobe: {
		name: 'wizard robe',
		adjectives: [...armorAdjectives],
		equip: 'torso',
		tags: ['gear', 'armor', 'cloth', 'magic'],
		sprites: [['robe', 1]],
		equipBoost: { maxMana: 20 },
	},
	leatherVest: {
		name: 'leather vest',
		adjectives: [...armorAdjectives, 'sexy', 'attractive'],
		equip: 'torso',
		tags: ['gear', 'armor', 'leather'],
		sprites: [['vest', 1]],
		equipBoost: { maxStamina: 10, maxDeflection: 10 },
	},
	ironPlatemail: {
		name: 'iron platemail',
		adjectives: [...armorAdjectives, 'polished', 'dented'],
		equip: 'torso',
		tags: ['gear', 'armor', 'metal'],
		sprites: [['chest-plate', 1]],
		equipBoost: { maxDeflection: 30 },
	},
	cloak: {
		name: 'cloak',
		adjectives: [...armorAdjectives, 'dark', 'green', 'blue', 'red', 'black'],
		equip: 'torso',
		tags: ['gear', 'armor', 'cloth'],
		sprites: [['cloak', 1]],
		equipBoost: { maxDeflection: 10 },
	},
	ring: {
		name: 'ring',
		adjectives: [...armorAdjectives, ...metalAdjectives],
		equip: 'finger',
		tags: ['gear', 'armor', 'metal'],
		sprites: [['ring', 1]],
	},
	magicRing: {
		name: 'ring of power',
		adjectives: [...armorAdjectives, ...metalAdjectives],
		equip: 'finger',
		tags: ['gear', 'armor', 'metal'],
		sprites: [['ring', 1]],
		equipBoost: { maxDeflection: 10, maxMana: 10, maxFaith: 10 },
	},
	amulet: {
		name: 'amulet',
		adjectives: [...armorAdjectives, ...metalAdjectives],
		equip: 'neck',
		tags: ['gear', 'armor', 'metal'],
		sprites: [['amulet', 1]],
		equipBoost: { maxDeflection: 10, maxMana: 10 },
	},
	crown: {
		name: 'crown',
		adjectives: [...armorAdjectives, ...metalAdjectives],
		equip: 'head',
		tags: ['loot', 'armor', 'metal'],
		sprites: [['crown', 1]],
		equipBoost: { maxDeflection: 10, maxMana: 10, maxFaith: 10, maxStamina: 10 },
	},

});
