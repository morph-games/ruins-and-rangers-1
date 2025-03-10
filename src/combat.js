import { Random } from 'rocket-utility-belt';

function rollDamage(damageArray = [0, 0]) {
	const [min, max] = damageArray;
	const diff = max - min;
	return (!diff) ? min : min + Random.randomInt(diff);
}

function rollDamages(damageObj = {}) {
	const rolledDamage = {};
	Object.keys(damageObj).forEach((dmgKey) => {
		const v = damageObj[dmgKey];
		if (typeof v === 'number') {
			rolledDamage[dmgKey] = v;
		} else {
			rolledDamage[dmgKey] = rollDamage(v);
		}
	});
	return rolledDamage;
}

export { rollDamage, rollDamages };
