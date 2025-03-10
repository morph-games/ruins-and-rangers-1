import GameImage from './GameImage.js';

const BASE_X = 32;
const row1 = 96;

const ATLAS = {
	characters: [
		{
			y: row1,
			names: ['plain-m', 'archer-m', 'warrior-m', 'cleric-m', 'rogue-m', 'wizard-m', 'druid-m', 'king', 'boy', 'dog', 'yeller-m', 'fat-m', 'reverse-m'],
		},
		{
			y: row1 + 16,
			names: ['plain-f', 'archer-f', 'warrior-f', 'cleric-f', 'rogue-f', 'wizard-f', 'druid-f', 'queen', 'girl', 'cat', 'yeller-f', 'fat-f', 'reverse-f'],
		},
		{
			y: row1 + 32,
			names: ['old-man', 'pirate', 'knight', 'cloaked-figure', 'old-wizard', 'cloaked-rogue', 'mermaid'],
		},
	],
	expression: [
		{
			y: 176,
			names: ['meh', 'happy', 'excited', 'sad', 'angry', 'mad', 'shouting', 'smirk', 'eating', 'shy', 'pirate', 'nerd'],
		},
	],
	fauna: [
		{
			y: 224,
			names: ['rat', 'bat', 'crawley', 'spider', 'scorpion', 'snail', 'snake', 'wolf', 'lioness', 'bear', 'drake', 'dragon', 'unicorn'],
		},
	],
	trollkind: [
		{
			y: 272,
			names: ['goblin', 'orc', 'cyclops', 'troll'],
		},
	],
	unliving: [
		{
			y: 320,
			names: ['zombie', 'hand', 'skeleton', 'skeleton-knight', 'lich', 'ghost', 'skull-orb', 'phantom'],
		},
	],
	creatures: [
		{
			y: 368,
			names: ['slime', 'tentacles', 'watcher', 'gremlin', 'imp', 'mimic', 'mechanoid', 'golem'],
		},
	],
	building: [
		{
			y: 416,
			names: ['stone-a', 'stone-b', 'stone-c', 'rock-a', 'rock-b', 'rock-c', 'wall-button', 'wall-button-in', 'wall-cap', 'wall-slot', 'stairs-down', 'stairs-up', 'door', 'door-open', 'fire', 'lid'],
		},
		{
			y: 416 + 16,
			names: ['gravestone', 'sign', 'stool', 'desk', 'shelves', 'table', 'chair'],
		},
		{
			y: 416 + 32,
			names: ['wall-a', 'wall-b', 'wall-c', 'wall-d', 'wall-e', 'wall-f', 'wall-g', 'wall-h', 'wall-i', 'wall-j', 'wall-k', 'wall-l'],
		},
	],
	devices: [
		{
			y: 496,
			names: ['net-trap', 'spin-trap', 'bear-trap', 'bear-trap-closed', 'spike-trap-1', 'spike-trap-2', 'grate', 'grate-open', 'button', 'button-in', 'switch-left', 'switch-right'],
		},
	],
	overworld: [
		{
			y: 544,
			names: ['grass-a', 'grass-b', 'grass-c', 'tree', 'pine-tree', 'barren-tree', 'water', 'boulders', 'cavern', 'house', 'keep', 'cart', 'boat'],
		},
	],
	exploration: [
		{
			y: 592,
			names: ['torch', 'lantern', 'shovel', 'pickaxe', 'rope', 'bomb', 'chest', 'chest-open', 'pot', 'pot-smashed', 'key-a', 'key-b', 'pouch', 'coins', 'unpolished-stone', 'cut-stone'],
		},
		{
			y: 608,
			names: ['polished-stone', 'corpse', 'bone', 'fossil-ammonite', 'fossil-skull'],
		},
	],
	food: [
		{
			y: 656,
			names: ['meat-leg', 'meat-slab', 'kebab', 'fish', 'eyeball', 'bread', 'egg', 'cheese', 'apple', 'pumpkin', 'beet', 'leaf', 'flower', 'mushroom', 'candy', 'cupcake'],
		},
	],
	drinks: [
		{
			y: 672,
			names: ['beer', 'jar', 'amphorae', 'small-vial', 'medium-vial', 'large-vial'],
		},
	],
	outfit: [
		{
			y: 720,
			names: ['dagger', 'sword', 'axe', 'spear', 'staff', 'club', 'hammer', 'round-shield', 'shield', 'bow', 'arrows', 'helmet-a', 'helmet-b', 'cone-hat', 'gloves', 'bracers'],
		},
		{
			y: 736,
			names: ['boots', 'pants', 'belt', 'robe', 'vest', 'chest-plate', 'cloak', 'ring', 'amulet', 'crown', 'glasses'],
		},
	],
	magick: [
		{
			y: 784,
			names: ['magick-staff', 'magick-scepter', 'skull-staff', 'orb', 'ankh', 'skull', 'scroll-1', 'scroll-2', 'book', 'altar', 'cauldron', 'spell-swirl', 'spell-square', 'spell-hand', 'spell-circle'],
		},
	],
	music: [
		{
			y: 832,
			names: ['lute', 'harp', 'flute', 'bell', 'xylophone', 'drum'],
		},
	],
	symbols: [
		{
			y: 880,
			names: ['at', 'arrow-cardinal', 'arrow-diagnol', 'plus', 'x', 'heart', 'star', 'sun', 'moon', 'target', 'alert', 'music', 'fire', 'snow', 'water-drop', 'lightning-bolt'],
		},
		{
			y: 896,
			names: ['swirl', 'bubbles', 'zzz', 'skull-effect', 'combat', 'shield-effect', 'waiting'],
		},
	],
};

export default class ScrollOSprites {
	constructor(url) {
		this.url = url;
		this.sheet = new GameImage(url);
		this.sprites = {};
	}

	async load() {
		try {
			await this.sheet.load();
		} catch (err) {
			console.error(err);
		}
		this.parse();
	}

	getSubImageDataUri(x, y, w = 16, h = 16, canvas = undefined, ctx = undefined) {
		if (!canvas || !ctx) {
			const duo = GameImage.getCanvasContext(w, h);
			canvas = duo[0]; // eslint-disable-line prefer-destructuring, no-param-reassign
			ctx = duo[1]; // eslint-disable-line prefer-destructuring, no-param-reassign
		}
		ctx.drawImage(this.sheet, x, y, w, h, 0, 0, w, h);
		const dataUri = canvas.toDataURL('image/png');
		return new GameImage(dataUri);
	}

	parse() {
		// const [sheetCanvas, sheetCtx] = this.sheet.getCanvasContext();
		const [canvas, ctx] = GameImage.getCanvasContext(16, 16);
		let index = 0;
		Object.entries(ATLAS).forEach(([groupName, groupRows]) => {
			let groupIndex = 0;
			groupRows.forEach((row) => {
				const { y, names } = row;
				let x = BASE_X;
				names.forEach((name) => {
					const gameImage = this.getSubImageDataUri(x, y, 16, 16, canvas, ctx);
					[
						`sprite-${index}`,
						`${groupName}-${groupIndex}`,
						name,
					].forEach((alias) => {
						this.sprites[alias] = gameImage;
					});
					// Increment
					x += 16;
					index += 1;
					groupIndex += 1;
				});
			});
		});
	}

	get(id) {
		return this.sprites[id];
	}

	getDataUri(id) {
		const gi = this.get(id);
		if (!gi) return '';
		return gi.getImageDataUri();
	}
}
