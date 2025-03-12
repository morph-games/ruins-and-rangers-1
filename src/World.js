// import { PseudoRandomizer } from 'rocket-utility-belt';
import Floor from './Floor.js';
import Actor from './Actor.js';

const starterRegion = {
	name: 'Home Village',
	grounds: ['grass', 'mud'],
	props: ['house', 'shop', 'tower', 'cart'],
	itemTags: ['food', 'gear', 'weapon'],
	itemChance: 0.2,
	// itemTags: ['gear'],
};

const PC_ID = 'pc';

export default class World {
	constructor() {
		this.worldSeed = this.makeWorldSeed();
		this.floors = new Map();
		this.overworldId = 'OW';
		const overworld = new Floor(this.overworldId, this.worldSeed);
		overworld.addRegionOverride(0, starterRegion);
		overworld.addRegionOverride(-1, starterRegion);
		this.floors.set(this.overworldId, overworld);
		this.activeFloor = this.floors.get(this.overworldId);
		this.pc = new Actor(0, PC_ID, 'hero', ['archer-m', 1]);
		this.pc.intelligence = 0;
		this.activeFloor.addMob(this.pc);
		this.highestRange = 0;
	}

	getRegion(x = this.pc?.x || 0) {
		return this.activeFloor.getRegion(x);
	}

	setWorldSeed(seed) {
		this.worldSeed = seed;
		const url = new URL(window.location.href);
		url.searchParams.set('worldSeed', this.worldSeed);
		window.history.pushState({}, '', url);
		return this.worldSeed;
	}

	makeWorldSeed() {
		const url = new URL(window.location.href);
		this.worldSeed = Number(url.searchParams.get('worldSeed'));
		if (this.worldSeed) return this.worldSeed;
		// If no worldSeed set, then make one
		// this.worldSeed = 111;
		return this.setWorldSeed(Math.ceil(Math.random() * 9999));
	}

	movePlayerCharacter(dx = 1) {
		this.activeFloor.planMove(PC_ID, dx);
		this.advanceRound();
	}

	meleeAttack(dx = 1) {
		const x = this.pc.x + dx;
		this.activeFloor.planMeleeAttack(PC_ID, x);
		this.advanceRound();
	}

	action(verb, dx) {
		this.activeFloor.planAction(PC_ID, verb, dx);
		this.advanceRound();
	}

	equip(itemId, allowSwap) {
		const [, message] = this.pc.equipItem(itemId, allowSwap);
		return message;
	}

	eat(itemId) {
		// TODO: Move this to a planned action and advance round
		// ...once it is possible to send the text feedback back to the inventory UI
		return this.pc.eat(itemId);
	}

	pickUp(dx) {
		this.activeFloor.planAction(PC_ID, 'pickUp', dx);
		this.advanceRound();
	}

	deconstruct(itemId) {
		this.activeFloor.planAction(PC_ID, 'deconstruct', 0, { itemId });
		this.advanceRound();
	}

	drop(itemId, dx = 0) {
		this.activeFloor.planAction(PC_ID, 'drop', dx, { itemId });
		this.advanceRound();
	}

	wait() {
		this.pc.wait();
		this.advanceRound();
	}

	advanceRound() {
		if (!this.pc.alive) return;
		this.activeFloor.advanceRound();
	}

	getPlayerCharacterX() {
		return this.pc.x;
	}

	getSpaces(xMin, count = 12) {
		return this.activeFloor.getSpaces(xMin, count);
		// Add some logs to the spaces
		// .map((space) => ({
		// 	...space,
		// 	logs: this.logs.filter((log) => log.x === space.x).map((log) => log.message),
		// }));
	}

	addProp(x, prop = {}) { this.activeFloor.props.set(x, prop); }

	addItem(x, item = {}) { this.activeFloor.items.set(x, item); }

	addMob(x, mob = {}) { this.activeFloor.mobs.set(x, mob); }
}
