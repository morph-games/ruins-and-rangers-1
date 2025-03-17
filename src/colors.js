/* eslint-disable quote-props */
const COLORS = {
	'Enbydiade6': { // https://lospec.com/palette-list/enbydiade6
		0: '231c24', // 0 darkest
		1: '332945', // 1 dark purple
		2: '5b3f69', // 2 purple
		3: '8f596c', // 3 orangish
		4: 'c2a47e', // 4 yellowish
		5: 'cce3e3', // 5 lightest blue
		aliases: {
			pc: 5,
			ground: 1,
			prop: 2,
			item: 4,
			monster: 3,
			npc: 4,
			naturalBg: 1,
			darkBg: 0,
			greenGround: 1,
			brownGround: 1,
			rockGround: 1,
			waterGround: 3,
			waterBg: 2,
		},
	},
	'Paper-8': { // https://lospec.com/palette-list/paper-8
		0: '1f244b', // 0 darkest
		1: '654053', // 1 purple/brown
		2: 'a8605d', // 2 orange
		3: 'd1a67e', // 3 dusty yellow
		4: 'f6e79c', // 4 bright yellow
		5: 'b6cf8e', // 5 light green
		6: '60ae7b', // bright green
		7: '3c6b64', // dark green
		aliases: {
			pc: 4,
			ground: 1,
			prop: 2,
			item: 3,
			monster: 5,
			npc: 3,
			naturalBg: 7,
			darkBg: 0,
			greenGround: 6,
			brownGround: 2,
			rockGround: 2,
			waterGround: 5,
			waterBg: 6,
		},
	},
};

function hexToRgbArray(hexStringParam) {
	const hexString = hexStringParam.replaceAll('#', '');
	if (hexString.length !== 6) throw new Error('Invalid hex string length');
	const hexArr = [
		hexString.substring(0, 2),
		hexString.substring(2, 4),
		hexString.substring(4, 6),
	];
	return hexArr.map((hexStr) => parseInt(hexStr, 16));
}

const colors = {
	palette: 'Enbydiade6',
	rgbCache: null,
	setBodyClass() {
		const bodyClasses = document.getElementsByTagName('body')[0].classList;
		Object.keys(COLORS).forEach((paletteKey) => {
			bodyClasses.remove(paletteKey.toLowerCase());
		});
		bodyClasses.add(this.palette.toLowerCase());
	},
	setRgbCache() {
		this.rgbCache = {};
		const palObj = COLORS[this.palette];
		Object.keys(palObj).forEach((colorKey) => {
			if (colorKey === 'aliases') return; // Skip special object
			this.rgbCache[colorKey] = hexToRgbArray(palObj[colorKey]);
		});
		if (!palObj.aliases) return;
		Object.keys(palObj.aliases).forEach((colorKey) => {
			const rgbColor = this.rgbCache[palObj.aliases[colorKey]];
			if (!rgbColor) {
				console.warn('No color found for alias', colorKey);
				return;
			}
			this.rgbCache[colorKey] = rgbColor;
		});
	},
	loadPalette(pName) {
		if (pName) this.palette = pName;
		this.setBodyClass();
		this.setRgbCache();
	},
	get(colorKey) {
		if (!this.rgbCache[colorKey]) console.warn('No color found', colorKey);
		return this.rgbCache[colorKey];
	},
};

export default colors;
