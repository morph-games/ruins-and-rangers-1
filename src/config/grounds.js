import addKeyFreeze from '../addKeyFreeze.js';

export default addKeyFreeze({
	grass: {
		sprites: [
			['grass-a', 'greenGround'],
			['grass-b', 'greenGround'],
			['grass-c', 'greenGround'],
		],
	},
	mud: {
		sprites: [
			['grass-b', 'brownGround'],
		],
	},
	rock: {
		sprites: [
			['rock-a', 'rockGround'],
			['rock-b', 'rockGround'],
			['rock-c', 'rockGround'],
		],
	},
	river: {
		sprites: [
			['water', 'waterGround', 'waterBg'],
		],
		propRequirements: ['water'],
	},
});
