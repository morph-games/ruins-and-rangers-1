import addKeyFreeze from '../addKeyFreeze.js';

export default addKeyFreeze({
	town: {
		grounds: ['grass', 'mud'],
		props: ['house', 'shop', 'tower', 'cart'],
		mobChance: 0.2,
		mobs: ['villager'],
		itemChance: 0.1,
		itemTags: ['food', 'gear'],
	},
	plains: {
		grounds: ['grass', 'grass', 'grass', 'grass', 'river'],
		props: [],
		mobChance: 0.05,
		mobs: ['villager'],
		itemTags: ['food'],
	},
	lightForest: {
		grounds: ['grass'],
		props: ['deciduousTree', 'anyTree'],
		mobChance: 0.05,
		mobs: ['goblin'],
		itemTags: ['food'],
	},
	darkForest: {
		grounds: ['grass'],
		props: ['boulders', 'pineTree', 'pineTree', 'anyTree'],
		mobs: ['goblin'],
	},
	mountains: {
		grounds: ['grass', 'rock', 'rock'],
		propChance: 0.3,
		props: ['boulders'],
		itemChance: 1,
		// items: ['pickaxe', 'torch', 'lantern', 'rope', 'chest', 'unpolished-stone', 'bone',
		// 'fossil-ammonite'],
		mobs: ['goblin', 'orc'],
	},
	ruins: {
		grounds: ['mud', 'rock'],
		props: [],
		itemChance: 0.2,
		itemTags: ['gear', 'weapon', 'armor'],
		mobChance: 0.2,
		mobs: ['goblin', 'orc', 'cyclops', 'troll'],
	},
	crypt: {
		grounds: ['mud', 'rock'],
		itemChance: 0.1,
		itemTags: ['gear'],
		propChance: 0.1,
		props: ['grave', 'deadTree'],
		mobs: ['skeleton', 'skeletonKnight', 'orc'],
	},
});
