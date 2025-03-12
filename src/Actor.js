import { clamp } from 'rocket-utility-belt';
import { rollDamages } from './combat.js';
import Entity from './Entity.js';
import allMobs from './config/mobs.js';

const ACTION_POOL_COST = 10;

export default class Actor extends Entity {
	constructor(x, actorId, mobKey, sprite = []) {
		super(x);
		this.mobId = actorId;
		this.actorId = actorId;
		this.inventory = [];
		// Set defaults for some properties based on the mob type, and defaults even
		// if a property is missing from the mob type
		const {
			aggro = 1,
			faction = '?',
			hp = 10,
			name = '?',
			naturalDamage = { physical: [1, 2] },
			stamina = 50,
			mana = 0,
			faith = 0,
			deflection = 10,
		} = allMobs[mobKey];
		this.name = name || '?';
		this.aggro = aggro;
		this.combatCooldown = 0;
		this.hp = hp;
		this.maxHp = this.hp;
		this.faction = faction;
		this.naturalDamage = naturalDamage;

		const [spriteName] = sprite;
		this.spriteName = spriteName;

		this.lastHits = [];
		this.nextAction = null;
		this.intelligence = 1; // Follows AI planning or no
		this.initiative = 0;
		// Pools
		// Stamina, mana, faith are used for applying damage
		// (maybe later for spells)
		this.stamina = stamina;
		this.maxStamina = this.stamina;
		this.mana = mana;
		this.maxMana = this.mana;
		this.faith = faith;
		this.maxFaith = this.faith;
		// Deflection is used to reduce incoming damage
		this.deflection = deflection;
		this.maxDeflection = this.deflection;
		// Equipping
		this.equipSlots = {
			hand: null,
			offHand: null,
			head: null,
			cloak: null,
			torso: null,
			hands: null,
			neck: null,
			waist: null,
			feet: null,
			legs: null,
			finger: null,
		};
	}

	damage(dmg) {
		this.hp -= dmg;
	}

	get isActor() { // eslint-disable-line class-methods-use-this
		return true;
	}

	get alive() {
		return this.hp > 0;
	}

	getEquipBoostTotal(propName) {
		return this.inventory.reduce((sum, item) => {
			if (!item?.equipped) return sum;
			return sum + (item?.equipBoost?.[propName] || 0);
		}, 0);
	}

	getMaxHp() { return this.maxHp + this.getEquipBoostTotal('maxHp'); }

	getMaxStamina() { return this.maxStamina + this.getEquipBoostTotal('maxStamina'); }

	getMaxMana() { return this.maxMana + this.getEquipBoostTotal('maxMana'); }

	getMaxFaith() { return this.maxFaith + this.getEquipBoostTotal('maxFaith'); }

	getMaxDeflection() { return this.maxDeflection + this.getEquipBoostTotal('maxDeflection'); }

	setInitiative() {
		this.initiative = Math.random();
	}

	isEquipSlotOpen(slotKey) {
		if (!slotKey) return false;
		if (slotKey === 'bothHands') {
			return (!this.equipSlots.hand && this.equipSlots.offHand);
		}
		if (this.equipSlots[slotKey] === undefined) return false; // actor doesn't have this slot
		return !this.equipSlots[slotKey];
	}

	getItem(itemOrId) {
		const itemId = (typeof itemOrId === 'object') ? itemOrId.itemId : itemOrId;
		return this.inventory.find((it) => it.itemId === itemId);
	}

	addEquipEffects(effects) {
		if (!effects) return;
	}

	removeEquipEffects(effects) {
		if (!effects) return;
	}

	equipItem(itemId, { allowToggle = true, allowSwap = false } = {}) {
		const item = this.getItem(itemId);
		if (!item) return [false, 'Item not in inventory'];
		if (!item.equip) return [false, 'Item cannot be equipped'];
		// If we have the item equipped already, then toggle?
		if (this.equipSlots[item.equip] === itemId && allowToggle) {
			return this.unEquipItem(itemId);
		}
		if (allowSwap) {
			// TODO: Allow swapping the existing item with whatever is currently equipped
		}
		if (!this.isEquipSlotOpen(item.equip)) return [false, `Slot ${item.equip} occupied`];
		item.equipped = true;
		if (item.equip === 'bothHands') {
			this.equipSlots.hand = itemId;
			this.equipSlots.offHand = itemId;
		} else {
			this.equipSlots[item.equip] = itemId;
		}
		this.addEquipEffects(item.onEquip);
		return [true, `Equipped ${item.name || item.key}`];
	}

	unEquipItem(itemId) {
		const item = this.inventory.find((it) => it.itemId === itemId);
		if (!item) return [false, 'Item not in inventory'];
		item.equipped = false;
		this.removeEquipEffects(item.onEquip);
		Object.keys(this.equipSlots).forEach((slotKey) => {
			if (this.equipSlots[slotKey] === itemId) this.equipSlots[slotKey] = null;
		});
		return [true, `Unequipped ${item.name || item.key}`];
	}

	cleanInventory() {
		const emptySpots = [];
		this.inventory.forEach((item, index) => { if (!item) emptySpots.push(index); });
		if (emptySpots.length) console.warn('Found empty spaces in inventory', JSON.stringify(this.inventory));
		// Loop through backwards to remove the blanks at the indices
		for (let i = this.inventory.length - 1; i >= 0; i -= 1) {
			if (emptySpots.includes(i)) this.inventory.splice(i, 1);
		}
	}

	addItem(item) {
		this.inventory.push(structuredClone(item));
	}

	removeItem(itemOrId) {
		const itemId = (typeof itemOrId === 'object') ? itemOrId.itemId : itemOrId;
		const index = this.inventory.findIndex((it) => it.itemId === itemId);
		if (index === -1) return false;
		this.unEquipItem(itemId);
		this.inventory.splice(index, 1);
		return true;
	}

	deconstruct(itemOrId) {
		const item = this.getItem(itemOrId);
		if (!item) return 'No such item';
		if (item.equipped) return 'Cannot deconstruct equipped items.';
		this.removeItem(itemOrId);
		// TODO: Add some materials
		return `Destroyed ${item.name || '??'}`;
	}

	dropItem(itemOrId) {
		const item = this.getItem(itemOrId);
		if (!item) return null;
		this.unEquipItem(item.itemId);
		this.removeItem(item);
		return item;
	}

	// ----- Damage Calculations

	calcDamageStrength(dmgKey) {
		if (dmgKey === 'physical') {
			if (this.stamina < ACTION_POOL_COST) return 0; // weak
			this.stamina -= ACTION_POOL_COST;
			return 1;
		}
		if (dmgKey === 'magic') {
			if (this.mana < ACTION_POOL_COST) return 0; // weak
			this.mana -= ACTION_POOL_COST;
			return 1;
		}
		if (dmgKey === 'holy') {
			if (this.faith < ACTION_POOL_COST) return 0; // weak
			this.faith -= ACTION_POOL_COST;
			return 1;
		}
		console.warn('Unknown damage type', dmgKey);
		return 0;
	}

	strengthenDamage(dmgKey, dmgArr = [0, 0]) {
		let dmgArray = [...dmgArr];
		const damageStrength = this.calcDamageStrength(dmgKey);
		if (damageStrength >= 1) { // strong
			// dmgArr is good
		} else { // weak
			dmgArray = [Math.min(1, dmgArray[0]), dmgArray[0]];
		}
		return [dmgArray, damageStrength];
	}

	/**
	 * Applies strength to damages
	 */
	applyStrengthToDamages(damageObj = {}) {
		const newDamage = {};
		const strengthenAmounts = {};
		Object.keys(damageObj).forEach((dmgKey) => {
			const [newDmgArray, dmgStr] = this.strengthenDamage(dmgKey, damageObj[dmgKey]);
			newDamage[dmgKey] = newDmgArray;
			strengthenAmounts[dmgKey] = dmgStr;
		});
		// console.log(newDamage, strengthenAmounts);
		return newDamage;
	}

	calcMeleeAttackDamage() {
		let baseDamage = this.naturalDamage;
		if (this.equipSlots.hand) {
			const weapon = this.getItem(this.equipSlots.hand);
			if (!weapon || !weapon.attack || !weapon.attack.damage) return {};
			baseDamage = weapon.attack.damage;
		}
		return rollDamages(this.applyStrengthToDamages(baseDamage));
	}

	applyDamage(incomingDamage = {}) {
		const damageObj = rollDamages(incomingDamage);
		let total = 0;
		const typesOfDamageApplied = [];
		Object.keys(damageObj).forEach((dmgKey) => {
			const dmgValue = damageObj[dmgKey];
			if (typeof dmgValue !== 'number') console.error('Unrolled damage?', damageObj);
			if (dmgValue) typesOfDamageApplied.push(dmgKey);
			total += dmgValue;
		});
		let deflecting = false;
		if (total > 0 && this.deflection >= ACTION_POOL_COST) {
			this.deflection -= ACTION_POOL_COST;
			deflecting = true;
			total = 1;
		}
		this.hp -= total;
		return [total, typesOfDamageApplied, deflecting];
	}

	applyHealing(incomingDamage = {}) {
		const damageObj = rollDamages(incomingDamage);
		let total = 0;
		Object.keys(damageObj).forEach((dmgKey) => {
			const dmgValue = damageObj[dmgKey];
			total += dmgValue;
		});
		this.hp += total;
		return [total];
	}

	eat(itemId) {
		const item = this.getItem(itemId);
		if (!item) return 'No item';
		if (!item.eat) return 'Not edible.';
		if (item.equipped) return 'Cannot eat equipped items';
		let msg = `Ate the ${item.name}, and `;
		if (item.eat.heal) {
			const [amount] = this.applyHealing(item.eat.heal);
			msg += `healed ${amount} HP`;
		}
		if (item.eat.damage) {
			const [amount] = this.applyDamage(item.eat.damage);
			msg += `damaged for ${amount} HP`;
		}
		msg += '.';
		this.removeItem(item);
		return msg;
	}

	wait() {
		this.naturalHeal();
	}

	naturalHeal() {
		if (this.hp > this.getMaxHp()) {
			const roll = Math.random();
			if (roll < 0.5) this.hp -= 1;
		}
		if (this.combatCooldown <= 0) {
			this.deflection = clamp(this.deflection + 7, 0, this.getMaxDeflection());
			this.stamina = clamp(this.stamina + 5, 0, this.getMaxStamina());
			this.mana = clamp(this.mana + 4, 0, this.getMaxMana());
			this.faith = clamp(this.faith + 6, 0, this.getMaxFaith());
		}
	}

	putInCombat() {
		this.combatCooldown = 1;
	}

	advanceTurn() {
		// TODO: things like bleeding, aging, cooldowns, etc.
		this.naturalHeal();
		if (this.combatCooldown > 0) this.combatCooldown = clamp(this.combatCooldown - 1, 0, 1);
		this.cleanInventory();
	}
}
