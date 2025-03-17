import { PseudoRandomizer, Random } from 'rocket-utility-belt';
import regions from './config/regions.js';
import allGrounds from './config/grounds.js';
import allProps from './config/props.js';
import allItems from './config/items.js';
import allMobs from './config/mobs.js';
import Actor from './Actor.js';

const MAX_X = 9999999;
const MIN_X = -MAX_X;
const ADJECTIVE_CHANCE = 0.7;
const REGION_SIZE = 12;
const DEFAULT_PROP_CHANCE = 0.3;
const DEFAULT_ITEM_CHANCE = 0.1;
const DEFAULT_MOB_CHANCE = 0.1;

const REGION_KEYS = Object.keys(regions);

export default class Floor {
	constructor(floorId, seed, minX = MIN_X, maxX = MAX_X) {
		if (!floorId) throw Error('No floor id');
		this.floorSeed = seed;
		this.floorId = floorId;
		this.minX = minX;
		this.maxX = maxX;
		this.regionSize = REGION_SIZE;
		this.terrainMods = {}; // Save any changes to the ground or background
		this.props = new Map();
		this.items = new Map();
		this.mobs = new Map();
		this.regionOverrides = new Map();
		this.logs = [];
		this.maxLogs = 4;
	}

	addLog(message, x) {
		this.logs.push({ message, x });
		if (this.logs.length > this.maxLogs) this.logs.shift();
	}

	removeItem(itemId) {
		const item = this.items.get(itemId);
		item.removed = true;
		item.x = null;
		this.items.set(itemId, item);
	}

	findPropAtX(x) {
		let foundProp;
		this.props.forEach((prop) => { // Make more efficient?
			if (prop.x === x) foundProp = prop;
		});
		return foundProp;
	}

	findMobsAtX(x) {
		const foundMobs = [];
		this.mobs.forEach((mob) => { // Make more efficient?
			if (mob.x === x) foundMobs.push(mob);
		});
		return foundMobs;
	}

	findItemsAtX(x) {
		const found = [];
		this.items.forEach((item) => {
			if (item.x === x) found.push(item);
		});
		return found;
	}

	randPick(seedOffset, arr = []) {
		const i = PseudoRandomizer.getPseudoRandInt(this.floorSeed + seedOffset, arr.length);
		return arr[i];
	}

	addRegionOverride(regionX, region = {}) {
		this.regionOverrides.set(regionX, region);
	}

	getRegion(x) {
		const regionX = Math.floor(x / this.regionSize);
		const regionOverride = this.regionOverrides.get(regionX);
		if (regionOverride) return { ...regionOverride, regionX };
		const regionKey = this.randPick((9 * regionX), REGION_KEYS);
		// console.log(x, regionX, regionKey);
		return {
			grounds: [],
			props: [],
			mobs: [],
			itemTags: [],
			...regions[regionKey],
			regionKey,
			regionX,
		};
	}

	getGround(x, region) {
		if (!region) region = this.getRegion(x); // eslint-disable-line no-param-reassign
		const groundSeed = this.floorSeed + (x * 2);
		const groundKey = this.randPick(groundSeed, region.grounds);
		const { sprites, propRequirements = [] } = allGrounds[groundKey];
		// console.log(region, groundKey, allGrounds[groundKey]);
		const sprite = this.randPick((groundSeed + 1), sprites);
		const [spriteName, colorKey, bgColorKey] = sprite;
		return {
			x,
			spriteColors: [],
			spriteName,
			groundKey,
			regionKey: region.regionKey,
			colorKey,
			bgColorKey: bgColorKey || region.bgColorKey || 0,
			propRequirements,
		};
	}

	makeProp(x, region, propId) {
		if (!region) region = this.getRegion(x); // eslint-disable-line no-param-reassign
		const { props = [], propChance = DEFAULT_PROP_CHANCE } = region;
		if (!props.length) return null;
		// Random chance of having a prop here
		const propSeed = this.floorSeed + 100 + x;
		const r = PseudoRandomizer.getPseudoRand(propSeed);
		if (r > propChance) return null;
		// Check to ma
		const ground = this.getGround(x, region);
		// TODO: If we have prop tags, then make sure the prop has the tags in the propRequirements
		// list, otherwise don't spawn. For now, if there are any requirements, then don't spawn.
		if (ground.propRequirements.length) return null;
		// Randomly pick out a prop
		const propKey = this.randPick((propSeed + 1), props);
		const p = allProps[propKey];
		if (!p) {
			console.error('No prop', propKey);
			return null;
		}
		const { name } = p;
		const sprite = this.randPick((propSeed + 2), p.sprites);
		const [spriteName] = sprite;
		const prop = {
			propId,
			x,
			name,
			spriteColors: [],
			spriteName,
			propKey,
			regionKey: region.regionKey,
		};
		// Cache it
		this.props.set(propId, prop);
		return prop;
	}

	makeMob(x, region, mobId) {
		if (!region) region = this.getRegion(x); // eslint-disable-line no-param-reassign
		const mobAlreadySpawned = this.mobs.get(mobId);
		if (mobAlreadySpawned) return null;
		const { mobs = [], mobChance = DEFAULT_MOB_CHANCE } = region;
		if (!mobs.length) return null;
		const mobSeed = this.floorSeed + 201 + x;
		const r = PseudoRandomizer.getPseudoRand(mobSeed);
		if (r > mobChance) return null;
		// Do the spawning
		const mobKey = this.randPick((mobSeed + 1), mobs);
		if (!allMobs[mobKey]) {
			console.error('No mob', mobKey);
			return null;
		}
		const { sprites } = allMobs[mobKey];
		const sprite = this.randPick((mobSeed + 2), sprites);
		const mob = new Actor(x, mobId, mobKey, sprite);
		// Cache it
		this.mobs.set(mobId, mob);
		return mob;
	}

	makeItem(x, region, itemId) {
		if (!region) region = this.getRegion(x); // eslint-disable-line no-param-reassign
		const existingItem = this.items.get(itemId);
		if (existingItem) return null;
		const { itemTags = [], itemChance = DEFAULT_ITEM_CHANCE } = region;
		if (!itemTags.length) return null;
		const itemSeed = this.floorSeed + 166 + x;
		const r = PseudoRandomizer.getPseudoRand(itemSeed);
		if (r > itemChance) return null;
		// Do the spawning
		const tag = this.randPick((itemSeed + 1), itemTags);
		const itemKeysWithTag = Object.keys(allItems)
			.filter((key) => ((allItems[key].tags || []).includes(tag)));
		if (!itemKeysWithTag.length) {
			console.error('No items with tag', tag);
			return null;
		}
		const itemKey = this.randPick((itemSeed + 2), itemKeysWithTag);
		const {
			sprites,
			adjectives = [],
			tags = [],
			name = `??${itemId}??`,
			equip, // = ['hand'],
			attack,
			eat,
			toss,
			fire,
			equipBoost,
		} = allItems[itemKey];
		const sprite = this.randPick((itemSeed + 3), sprites);
		const adjectiveRoll = PseudoRandomizer.getPseudoRand(itemSeed + 4);
		const adjective = (adjectiveRoll <= ADJECTIVE_CHANCE)
			? this.randPick((itemSeed + 5), adjectives) || '' : '';
		const [spriteName] = sprite;
		const item = {
			itemId,
			itemKey,
			spriteColors: [],
			spriteName,
			x,
			name,
			adjective,
			tags,
			equip,
			attack,
			eat,
			toss,
			fire,
			equipBoost,
			equipped: false,
		};
		// Cache it
		this.items.set(itemId, item);
		return item;
	}

	getProp(x, region) {
		const propId = `P${x}`;
		const prop = this.findPropAtX(x);
		if (prop && !prop.removed) return prop;
		return this.makeProp(x, region, propId);
	}

	getMob(x, region) {
		const mobId = `M${x}`;
		const mobs = this.findMobsAtX(x);
		if (mobs.length) {
			const aliveMobs = mobs.filter((m) => m.alive && !m.removed);
			return (aliveMobs.length > 0) ? aliveMobs[0] : null;
		}
		return this.makeMob(x, region, mobId);
	}

	getItems(x, region) {
		const itemId = `I${x}`;
		const items = this.findItemsAtX(x).filter((item) => !item.removed);
		if (items.length) {
			return items;
		}
		const spawnedItem = this.makeItem(x, region, itemId);
		return spawnedItem ? [spawnedItem] : [];
	}

	getSpace(x) {
		const region = this.getRegion(x);
		const ground = this.getGround(x, region);
		const prop = this.getProp(x, region);
		const items = this.getItems(x, region);
		const mob = this.getMob(x, region);
		const logs = this.logs.filter((log) => log.x === x).map((log) => log.message);
		return { ground, prop, items, mob, x, light: 1, logs };
	}

	getSpaces(xMin = 0, count = 12) {
		const spaces = [];
		const xMax = xMin + (count - 1);
		for (let i = xMin; i <= xMax; i += 1) {
			spaces.push(this.getSpace(i));
		}
		return spaces;
	}

	addProp(prop = {}) {
		this.props.set(prop.propId, prop);
	}

	addItem(item = {}) {
		const itemId = item.itemId || Math.random();
		const existingItem = this.items.get(itemId);
		if (existingItem) {
			console.warn('Overwriting item', item);
			// this.items.set(itemId, { ...existingItem, ...item });
			// return;
		}
		this.items.set(itemId, item);
	}

	addMob(mob = {}) { // Mutates mob
		const mobId = mob.actorId || mob.mobId || Math.random();
		mob.mobId = mobId; // eslint-disable-line no-param-reassign
		this.mobs.set(mobId, mob);
	}

	// ------------ Actions ----

	moveActor(actorId, dx) {
		const actor = this.mobs.get(actorId);
		const newX = actor.x + dx;
		const mobs = this.findMobsAtX(newX).filter((m) => m.alive);
		if (mobs.length) {
			// If from a different faction, no passing
			const unfriendlyMobs = mobs.filter((m) => m.faction !== actor.faction || m.aggro);
			if (unfriendlyMobs.length) return 0;
			mobs.forEach((mob) => { // Switch places
				mob.x += (dx < 0) ? 1 : -1; // eslint-disable-line no-param-reassign
			});
		}
		// TODO: Make this recursive so it checks all coordinates along the path if dx > 1
		actor.x += dx;
		return dx;
	}

	pickUp(actor, dx) {
		const x = actor.x + dx;
		const pickUpRange = 1; // TODO: get this from the actor?
		if (Math.abs(dx) > pickUpRange) return 'Too far to pick up.';
		const items = this.findItemsAtX(x).filter((item) => !item.removed);
		const item = items.pop();
		if (!item) return 'No item found';
		actor.addItem(item);
		this.removeItem(item.itemId);
		return `Picked up ${item.name || '??'}`;
	}

	drop(actor, itemId, dx = 0) {
		const x = actor.x + dx;
		const item = actor.dropItem(itemId);
		if (!item) return 'No item to drop.';
		item.x = x;
		this.addItem(item);
		let where = '';
		if (dx < 0) where = 'to the left';
		if (dx > 0) where = 'to the right';
		return `Dropped ${item.name} ${where}.`;
	}

	meleeAttack(actorId, x) {
		const attacker = this.mobs.get(actorId);
		// TODO: check range actor.x vs x
		const mobs = this.findMobsAtX(x).filter((m) => m.alive);
		if (!mobs.length) {
			this.addLog(`${attacker.name} hits at nothing.`, x);
			return;
		}
		const defender = mobs[mobs.length - 1];
		const [attackDamage = {}, strengthenAmounts = {}] = attacker.calcMeleeAttackDamage();
		const strengthsArray = Object.values(strengthenAmounts);
		const isWeak = Math.max(...strengthsArray) <= 0;
		const [
			total, , deflecting,
		] = defender.applyDamage(attackDamage);
		attacker.putInCombat();
		defender.putInCombat();
		const outcome = (total ? `for ${total} damage` : '') + (deflecting ? ' (deflected)' : '');
		// eslint-disable-next-line no-nested-ternary
		const msgVerb = (total) ? (isWeak ? 'weakly hits' : 'hits') : 'misses';
		const msg = [attacker.name, msgVerb, defender.name, outcome].join(' ');
		this.addLog(`${msg}.`, x);
	}

	doNextAction(mob) {
		if (!mob.nextAction || !mob.alive) return;
		const { verb, x, dx, itemId } = mob.nextAction;
		if (verb === 'attack') {
			this.meleeAttack(mob.actorId, x);
		} else if (verb === 'move') {
			this.moveActor(mob.actorId, dx);
		} else if (verb === 'pickUp') {
			this.pickUp(mob, dx);
		} else if (verb === 'drop') {
			this.drop(mob, itemId, dx);
		} else if (verb === 'deconstruct') {
			mob.deconstruct(itemId);
		} else {
			console.warn('Unknown action', verb);
		}
		mob.nextAction = null; // eslint-disable-line no-param-reassign
	}

	planMeleeAttack(actorId, x) {
		const actor = this.mobs.get(actorId);
		actor.nextAction = { verb: 'attack', x };
	}

	planMove(actorId, dx) {
		const actor = this.mobs.get(actorId);
		actor.nextAction = { verb: 'move', dx };
	}

	planAction(actorId, verb, dx, actionProps = {}) {
		const actor = this.mobs.get(actorId);
		actor.nextAction = { ...actionProps, verb, dx };
	}

	mobPlanning(mob) {
		if (!mob.intelligence) return;
		const mobsLeft = this.findMobsAtX(mob.x - 1);
		const mobsRight = this.findMobsAtX(mob.x + 1);
		const nearMobs = mobsLeft.concat(mobsRight);
		const enemies = nearMobs.filter((m) => m.faction !== mob.faction);
		if (enemies.length) {
			const target = Random.pick(enemies);
			this.planMeleeAttack(mob.actorId, target.x);
		}
	}

	advanceRound() {
		this.mobs.forEach((mob) => mob.setInitiative());
		const orderedMobs = [...this.mobs.values()].sort((a, b) => b.initiative - a.initiative);
		orderedMobs.forEach((mob) => {
			if (!mob.alive) return;
			this.mobPlanning(mob);
			this.doNextAction(mob);
			mob.advanceTurn();
		});
		// Do things after everyone has acted?
		// orderedMobs.forEach((mob) => {
		// 	mob.advanceTurn();
		// });
	}

	// getLightLevelAt(x) {
	// 	//
	// }
}
