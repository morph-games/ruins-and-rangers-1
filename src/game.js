import { createApp } from 'vue/dist/vue.esm-bundler.js';
import ScrollOSprites from './ScrollOSprites.js';
// import { PseudoRandomizer } from 'rocket-utility-belt';
// import Actor from './Actor.js';
import World from './World.js';

// const r = PseudoRandomizer();
// console.log(r);

const world = new World();
const scroll = new ScrollOSprites('./images/scroll-o-sprites.png');

world.addItem(0, { name: 'gem' });
window.world = world;

// const filler = [
// 	'HP: 20/20 - Statuses',
// 	'something else',
// 	'more status',
// 	'news',
// 	'more news',
// 	'even more news',
// ];

// function checkOverlap(elementA, elementB) {
// 	const rectA = elementA.getBoundingClientRect();
// 	const rectB = elementB.getBoundingClientRect();
// 	return (
// 		rectA.left < rectB.right && rectA.right > rectB.left
// 		&& rectA.top < rectB.bottom && rectA.bottom > rectB.top
// 	);
// }

const $id = (id) => window.document.getElementById(id);

function connectLine(topElt, bottomElt, lineElt) {
	if (!topElt || !bottomElt || !lineElt) return;
	const topRect = topElt.getBoundingClientRect();
	const bottomRect = bottomElt.getBoundingClientRect();
	const point1 = { x: topRect.left + (topRect.width / 2), y: topRect.bottom };
	const point2 = { x: bottomRect.left + (bottomRect.width / 2), y: bottomRect.top };
	const h = bottomRect.top - topRect.bottom;
	const w = point2.x - point1.x;
	const hypotenuse = Math.sqrt(h ** 2 + w ** 2);
	const xOffset = (w - hypotenuse) / 2;
	const radians = Math.atan2(h, w);
	const { style } = lineElt;
	style.width = `${hypotenuse}px`;
	style.top = `${point1.y}px`;
	style.left = `${point1.x}px`;
	style.transform = `translate(${xOffset}px, ${(h / 2)}px) rotate(${radians}rad)`;
}

const appOptions = {
	props: {},
	emits: [],
	mounted() {
		this.bubbles.push(this.makeSpaceBubble(5));
		this.bubbles.push(this.makeSpaceBubble(6));
		this.focusWorld();
	},
	data() {
		return {
			showTitle: true, // toggle for testing
			highestRange: 0,
			isPcAlive: true,
			selectedSpaceIndex: null,
			worldX: 0,
			spacesSize: 12,
			facing: 1,
			actionIndex: 0,
			spaces: [
				130, 3, 127, 126, 125, 1,
				9, 126, 125, 125, 60, 80,
			],
			actionsLeft: [
				{ verb: 'move', display: 'Move [a]', act: () => this.move(-1) },
				{ verb: 'attack', display: 'Attack [q]', act: () => this.attack(-1) },
				{ verb: 'pickup', display: 'Pick up [z]', act: () => this.doAction('pickUp', -1) },
			],
			actionsRight: [
				{ verb: 'move', display: 'Move [d]', act: () => this.move(1) },
				{ verb: 'attack', display: 'Attack [e]', act: () => this.attack(1) },
				// { verb: 'fire', display: 'Fire' },
				// { verb: 'bash', display: 'Bash' },
				{ verb: 'pickup', display: 'Pick up [x]', act: () => this.doAction('pickUp', 1) },
				// { verb: 'throw', display: 'Throw' },
				// { verb: 'use', display: 'Use' },
				// { verb: 'eat', display: 'Eat' },
				// { verb: 'wait', display: 'Wait' },
			],
			selectedInventoryAction: 'inspect',
			inventoryActions: [
				{ verb: 'inspect', display: 'Inspect' },
				// { verb: 'use', display: 'Use' },
				{ verb: 'equip', display: 'Equip' },
				{ verb: 'eat', display: 'Eat' },
				// { verb: 'toss', display: 'Throw' },
			],
			selectedInventoryItem: null,
			extraBubbles: [],
			showInventory: false,
			inventory: [],
			inventoryMessage: '',
		};
	},
	watch: {},
	computed: {
		bubbles() {
			return [
				this.makeSpaceBubble(5),
				this.makeSpaceBubble(6),
				...this.extraBubbles,
			];
		},
	},
	expose: [], // parent component can call these
	methods: {
		focusWorld() {
			const offset = (this.facing > 0) ? 1 : 0;
			this.worldX = Math.min(world.getPlayerCharacterX() - (this.spacesSize / 2) + offset);
			// console.log(this.worldX);
			this.loadSpaces();
			this.shuffleBubbles();
		},
		move(n = 1) {
			this.facing = (n > 0) ? 1 : -1;
			// console.log('Move?');
			world.movePlayerCharacter(n);
			this.focusWorld();
		},
		attack(dx = 1) {
			world.meleeAttack(dx);
			this.focusWorld();
		},
		wait() {
			world.wait();
			this.focusWorld();
		},
		doAction(verb, dx) {
			world.action(verb, dx);
			this.focusWorld();
		},
		loadSpaces() {
			this.spaces = world.getSpaces(this.worldX, this.spacesSize);
			this.isPcAlive = world.pc.alive;
			const range = Math.abs(world.pc.x);
			if (range > this.highestRange) this.highestRange = range;
			console.log([...this.spaces]);
		},
		getImageSource(spriteName) {
			return scroll.getDataUri(spriteName);
		},
		getImageSourceForSpace(spaceIndex) {
			const space = this.spaces[spaceIndex];
			const { ground, prop, items, mob } = space;
			let spriteName = (ground) ? ground.spriteName : 'skull';
			if (prop) spriteName = prop.spriteName;
			if (items && items.length) spriteName = items[items.length - 1].spriteName;
			if (mob) spriteName = mob.spriteName;
			return this.getImageSource(spriteName);
		},
		getImageClass(spaceIndex) {
			const space = this.spaces[spaceIndex];
			// const { ground, prop, items, mob } = space;
			const { mob } = space;
			if (mob && mob.actorId === 'pc') {
				return { attacking: true }; // FIXME
			}
			return { };
		},
		getBubbleStyle(bubbleIndex) {
			const bubble = this.bubbles[bubbleIndex];
			return { left: `${bubble.left}px`, top: `${bubble.top}px` };
		},
		shuffleBubbles() {
			this.bubbles.forEach((bubble, i) => {
				setTimeout(() => {
					connectLine(
						$id(`bubble-${i}`),
						$id(`space-${bubble.spaceIndex}`),
						$id(`bubble-connector-line-${i}`),
					);
				}, 6);
			});
		},
		getSpaceDescription(spaceIndex) {
			const space = this.spaces[spaceIndex];
			if (typeof space !== 'object') return '';
			const { mob, prop, ground, items } = space;
			const things = [];
			const mobName = mob ? mob.name || mob.mobKey : '';
			if (mobName) things.push(mobName);
			const itemNames = items.map(
				(item) => (`${item.adjective || ''} ${item.name || item.itemKey}`).trim(),
			).reverse().join(', ');
			if (itemNames) things.push(itemNames);
			const propName = prop ? prop.name || prop.propKey : '';
			if (propName) things.push(propName);
			const groundName = ground ? ground.name || ground.groundKey || 'void' : 'void';
			if (!things.length) return groundName;
			return `${things.join(' and ')} on ${groundName}`;
		},
		getTextBar(currentValue, maxValue, base = 10, symbol = '■') {
			const n = currentValue / base;
			const nInt = Math.floor(n);
			const fraction = n - nInt;
			const showFraction = (fraction > 0.2) ? 1 : 0;
			const left = Math.max(0, Math.floor(maxValue / base) - nInt - showFraction);
			// console.log(currentValue, maxValue, n, nInt, fraction, left);
			return ['[',
				...Array(nInt).fill(symbol),
				(showFraction ? '□' : ''),
				...Array(left).fill('-'),
				']',
			].join('');
		},
		getSpaceInfoLines(spaceIndex) {
			const space = this.spaces[spaceIndex];
			const { mob, logs } = space;
			let lines = [
				// `x: ${this.worldX + spaceIndex}`,
				this.getSpaceDescription(spaceIndex),
			];
			if (mob) {
				lines.push(`Def ${this.getTextBar(mob.deflection, mob.getMaxDeflection())} ${Math.floor(mob.deflection / 10)}`);
				lines.push(
					`H P ${this.getTextBar(mob.hp, mob.getMaxHp(), 5, '♥')} ${mob.hp}/${mob.maxHp}`,
				);
				if (mob.getMaxStamina()) lines.push(`Stm ${this.getTextBar(mob.stamina, mob.getMaxStamina())}`);
				if (mob.getMaxMana()) lines.push(`Mna ${this.getTextBar(mob.mana, mob.getMaxMana())}`);
				if (mob.getMaxFaith()) lines.push(`Fth ${this.getTextBar(mob.faith, mob.getMaxFaith())}`);
			}
			if (logs) lines = lines.concat(logs);
			return lines;
		},
		makeSpaceBubble(spaceIndex) {
			return {
				lines: this.getSpaceInfoLines(spaceIndex),
				left: 0,
				top: 0,
				spaceIndex,
			};
		},
		selectSpace(spaceIndex) {
			this.deselectSpace();
			this.selectedSpaceIndex = spaceIndex;
			this.extraBubbles.push(this.makeSpaceBubble(spaceIndex));
			this.shuffleBubbles();
		},
		deselectSpace() {
			if (this.selectedSpaceIndex !== null) this.extraBubbles.pop();
			this.selectedSpaceIndex = null;
		},
		clickGame() {
			this.deselectSpace();
		},
		handleKeyDown(event) {
			const { key } = event;
			let refresh = true;
			if (key === 'ArrowRight' || key === 'd') {
				if (this.facing > 0) this.move(1);
				else this.facing = 1;
				refresh = true;
			} else if (key === 'ArrowLeft' || key === 'a') {
				if (this.facing < 0) this.move(-1);
				else this.facing = -1;
				refresh = true;
			} else if (key === 'i') {
				this.toggleInventory();
			} else if (key === ' ') {
				world.wait();
			} else if (key === 'q') {
				this.attack(-1);
			} else if (key === 'e') {
				this.attack(1);
			} else if (key === 'z') {
				this.doAction('pickUp', -1);
			} else if (key === 'x') {
				this.doAction('pickUp', 1);
			} else {
				refresh = false;
				console.log(key);
			}
			if (refresh) {
				this.focusWorld();
			}
		},
		switchFacing() {
			this.facing = (this.facing > 0) ? -1 : 1;
			this.actionIndex = 0;
			this.focusWorld();
		},
		// ----- Inventory
		loadInventory() {
			this.inventory = Object.freeze(structuredClone(world.pc.inventory));
		},
		toggleInventory() {
			this.showInventory = !this.showInventory;
			this.loadInventory();
			if (!this.showInventory) this.focusWorld();
		},
		getInventoryClasses() {
			return {
				inventory: true,
				'inventory-open': this.showInventory,
			};
		},
		getInventoryItemClasses(item) {
			return {
				'inventory-item': true,
				'inventory-item-equipped': item?.equipped,
			};
		},
		clickInventoryItem(item) {
			this.selectedInventoryItem = item;
			if (this.selectedInventoryAction === 'inspect') {
				// Do nothing?
			} else {
				if (this.selectedInventoryAction === 'equip') {
					this.inventoryMessage = world.equip(item.itemId, true);
				} else if (this.selectedInventoryAction === 'eat') {
					this.inventoryMessage = world.eat(item.itemId);
				}
				this.loadInventory();
				this.selectedInventoryItem = this.inventory.find((it) => it.itemId === item.itemId);
			}
		},
		// ----- End Game
		reload() { window.location.reload(); },
		reloadNew() {
			world.setWorldSeed('');
			this.reload();
		},
	},
	components: {},
	template: /* vue-html */`
	<div id="game" @click="clickGame" @keydown="handleKeyDown" tabindex="0">
		<div class="top-bar" :class="showTitle ? 'title' : ''">
			<div>
				Ruins &amp; Rangers 7DRL
				<span class="version">v1.0.1</span>
			</div>
			<div class="sub-title">
				A One-Dimensional Traditional Roguelike
				<!-- Adventure Along the Arcane Axis -->
			</div>
			<div class="scores" v-if="!showTitle">
				Score: {{highestRange}}
			</div>
			<div v-if="showTitle">
				<button type="button" @click="showTitle = false">Start</button>
			</div>
		</div>
		<div id="info" :class="showInventory ? 'info-closed' : ''" v-if="!showTitle">
			<div class="info-bubbles">
				<div v-for="(bubble, bubbleIndex) in bubbles"
					class="bubble" :id="['bubble', bubbleIndex].join('-')"
					:style="getBubbleStyle(bubbleIndex)"
					draggable="true">
					<div v-for="text in bubble.lines" class="bubble-line">{{text}}</div>
					<div :id="['bubble-connector-line', bubbleIndex].join('-')"
						class="connector-line"
						style="position: absolute"
						></div>
				</div>
			</div>
			<div v-if="!isPcAlive" class="dead">
				Congratulations!
				<br>YOU DIED!
			</div>
		</div>
		<div id="map" v-if="!showTitle">
			<div v-for="(spaceId, index) in spaces"
				class="space" :id="['space', index].join('-')"
				@click.stop="selectSpace(index)">
				<img :src="getImageSourceForSpace(index)" :class="getImageClass(index)" />
			</div>
		</div>
		<div id="controls" v-if="!showTitle">
			<div v-if="!isPcAlive" class="dead-controls">
				<button type="button" @click="reload">Reload Same World</button>
				<button type="button" @click="reloadNew">Reload New World</button>
			</div>
			<div v-if="isPcAlive" class="space-controls">
				<div id="left-controls" v-if="!showInventory" :class="facing > 0 ? 'controls-inactive' : ''">
					<li v-for="action in actionsLeft">
						<button type="button" @click="action.act" class="action-button">
							{{action.display}}
						</button>
					</li>
				</div>
				<div id="right-controls" v-if="!showInventory" :class="facing < 0 ? 'controls-inactive' : ''">
					<li v-for="(action, index) in actionsRight">
						<button v-if="actionIndex === index"
							@click="switchFacing"
							class="action-selection">
							<img :src="getImageSource('arrow-cardinal')"
								:class="facing > 0 ? 'arrow-right' : 'arrow-left'" />
						</button>
						<button type="button" @click="action.act" class="action-button">
							{{action.display}}
						</button>
					</li>
				</div>
			</div>
			<div :class="getInventoryClasses()">
				<ul class="inventory-actions">
					<li v-for="action in inventoryActions">
						<input type="radio" name="inv-action"
							v-model="selectedInventoryAction"
							:id="action.verb" :value="action.verb" />
						<label :for="action.verb">
							{{action.display}}
						</label>
					</li>
				</ul>
				<ol class="inventory-items">
					<div class="inventory-message">
						{{inventoryMessage}}
					</div>
					<div v-if="!inventory.length">
						Empty
					</div>
					<li v-for="item in inventory"
						:class="getInventoryItemClasses(item)"
						@click="clickInventoryItem(item)">
						<img :src="getImageSource(item?.spriteName)" class="inventory-item-image" />
						<div class="inventory-tooltip">
							{{item?.adjective}} {{item?.name || '??'}}
						</div>
						<!--  {{item.name}} -->
						<!-- {{JSON.stringify(item)}} -->
					</li>
				</ol>
				<div class="inventory-info" v-if="selectedInventoryItem">
					<div class="inventory-title">
						{{selectedInventoryItem?.adjective}} {{selectedInventoryItem?.name || '??'}}
					</div>
					<div v-if="selectedInventoryItem?.equipped" class="inventory-info-equipped">
						Equipped
					</div>
					<div v-if="selectedInventoryItem?.eat?.heal">
						Edible<br>
						Heals 
						<span v-for="(dmgArr, dmgType) in selectedInventoryItem?.eat?.heal">
							{{dmgArr.join('-')}} 
						</span> HP
					</div>
					<div v-if="selectedInventoryItem?.attack?.damage">
						Melee damage:
						<span v-for="(dmgArr, dmgType) in selectedInventoryItem?.attack?.damage">
							{{dmgArr.join('-')}} {{dmgType}}
						</span>
					</div>
					<div v-if="selectedInventoryItem?.equipBoost">
						<div v-for="(val, propName) in selectedInventoryItem.equipBoost">
							{{propName}}: +{{Math.floor(val / 10)}}
						</div>
					</div>
					<div class="inventory-info-tags">
						{{selectedInventoryItem.tags.join(', ')}}
					</div>
				</div>
			</div>
			<div class="player-controls" v-if="isPcAlive">
				<button type="button" @click="toggleInventory">Inventory [i]</button>
				<button type="button" @click="wait">Wait [space]</button>
			</div>
		</div>
	</div>
	`,
};

async function start() {
	try {
		console.log('Starting! Loading scroll...');
		await scroll.load();
	} catch (err) {
		console.error(err);
	}
	const app = createApp(appOptions);
	console.log('Scroll loaded and app created. Mounting...');
	app.mount('#app');
}

window.addEventListener('DOMContentLoaded', start);
