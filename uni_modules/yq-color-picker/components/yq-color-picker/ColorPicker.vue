<template>
	<view class="color-picker">
		<view class="color-picker-mask" v-if="show &&!ispc" @click="close"></view>
		<view v-if="ispc || show" class="color-picker-container" :class="{'color-picker-fixed':!ispc}">
			<view class="color-picker-header" v-if="!ispc">
				<view class="color-picker-title">
					{{title}}
				</view>
				<view class="close-btn" @click="close">✕</view>
			</view>
			<ColorPanel :h="h" :s="s" :l="l" @change="slChange" />
			<view class="control-panel">
				<view class="color-display">
					<view class="display-fill" :style="{ backgroundColor: `hsl(${h},${s}%,${l}%,${a})` }">
					</view>
				</view>
				<view class="control-bar">
					<ColorSlider type="hue" @change="hueChange" :value="h" />
					<ColorSlider type="alpha" :color="`hsl(${h},${s}%,${l}%)`" @change="alphaChange" :value="a" />
				</view>
			</view>
			<view class="result-panel">
				<view class="result-box" v-if="mode==0">
					<ColorInput width="460rpx" val-key="hex" text="十六进制" @change="valueChange" :value="hex" />
				</view>
				<view class="result-box" v-if="mode==1">
					<ColorInput text="R" type="number" val-key="r" @change="valueChange" :value="r" />
					<ColorInput text="G" type="number" val-key="g" @change="valueChange" :value="g" />
					<ColorInput text="B" type="number" val-key="b" @change="valueChange" :value="b" />
					<ColorInput text="A" val-key="a" @change="valueChange" :value="a" />
				</view>
				<view class="result-box" v-if="mode==2">
					<ColorInput text="H" type="number" val-key="h" @change="valueChange" :value="h" />
					<ColorInput text="S" type="number" val-key="s" @change="valueChange" :value="s" />
					<ColorInput text="L" type="number" val-key="l" @change="valueChange" :value="l" />
					<ColorInput text="A" val-key="a" @change="valueChange" :value="a" />
				</view>
				<button class="change-button" @click="changeMode">
					<text>切换</text>
					<text>模式</text>
				</button>
			</view>
			<view class="preset-panel" v-if="colorList.length">
				<template v-for="(item,index) in colorList">
					<ColorBox :color="item" @click="colorBoxClick"></ColorBox>
				</template>
			</view>
			<view class="preset-panel" v-if="historyList.length || !disableHistory">
				<template v-for="(item,index) in historyList">
					<ColorBox :color="item" @click="colorBoxClick"></ColorBox>
				</template>
			</view>
			<view class="picker-foot">
				<button class="btn btn-confirm" hover-class="confirm-hover" @click="confirm">确定</button>
			</view>
		</view>

	</view>
</template>

<script>
	import ColorBox from './ColorBox.vue'
	import ColorInput from './ColorInput.vue'
	import ColorPanel from './ColorPanel.vue'
	import ColorSlider from './ColorSlider.vue'
	import { hslToRgb, rgbToHex, extractColor, rgbToHsl, hexToRgb, rgbToString, hslToString } from './color'

	function unique(arr) {
		return Array.from(new Set(arr))
	}
	export default {
		components: {
			ColorBox,
			ColorInput,
			ColorPanel,
			ColorSlider
		},
		emits: ['confirm'],
		props: {
			color: String,
			title: String,
			preset: Array,
			ispc: Boolean,
			disableHistory: Boolean,
		},
		data() {
			return {
				mode: 0,
				h: 0,
				s: 100,
				l: 50,
				a: 1,
				r: 255,
				g: 0,
				b: 0,
				hex: '#ff0000',
				show: false,
				historyList: [],
				colorList: []
			}
		},
		created() {
			this.init(this.color);
			this.colorList = this.preset.slice(0, 6)
			if (!this.disableHistory) {
				uni.getStorage({
					key: 'yq_color_history_list',
					success: (res) => {
						this.historyList = res.data||[]
					}
				})
			}

		},
		methods: {
			close() {
				this.show = false
			},
			open() {
				this.show = true
			},
			confirm() {
				let color = this.hex
				if (this.mode == 1) {
					color = rgbToString([this.r, this.g, this.b, this.a])
				} else if (this.mode == 2) {
					color = hslToString([this.h, this.s, this.l, this.a])
				}
				
				if (!this.disableHistory) {
					if (this.historyList.length == 6) {
						this.historyList.pop()
					}
					this.historyList.unshift(color)
					this.historyList = unique(this.historyList)
					uni.setStorage({
						key: 'yq_color_history_list',
						data: this.historyList
					})
				}
				this.$emit('confirm', color)
				this.close()
			},
			colorBoxClick(e) {
				this.init(e)
			},
			valueChange(e) {
				const {
					key,
					value
				} = e
				this[key] = value
				this.updateColor(this.mode)
			},
			hueChange(e) {
				this.h = e
				this.updateColor()
			},
			alphaChange(e) {
				this.a = e
				this.updateColor()
			},
			slChange(e) {
				const {
					saturation,
					lightness
				} = e;
				this.s = saturation;
				this.l = lightness;
				this.updateColor()
			},
			init(color) {
				try {
					const colorObject = extractColor(color)
					Object.assign(this, colorObject)
				} catch (e) {
					uni.showToast({
						title: e.message,
						icon: 'error'
					})
				}
			},
			updateColor(mode = 2) {
				try {
					if (mode === 2) {
						const { h, s, l, a } = this
						const [r, g, b] = hslToRgb([h, s, l, a])
						const hex = rgbToHex([r, g, b, a])
						Object.assign(this, { r, g, b, hex })
					} else if (mode == 1) {
						const { r, g, b, a } = this
						const [h, s, l] = rgbToHsl([r, g, b])
						const hex = rgbToHex([r, g, b, a])
						Object.assign(this, { h, s, l, hex })
					} else {
						const hex = this.hex
						const [r, g, b, a] = hexToRgb(hex)
						const [h, s, l] = rgbToHsl([r, g, b])
						Object.assign(this, { h, s, l, r, g, b, a })
					}
				} catch (e) {
					uni.showToast({
						title: e.message,
						icon: 'error'
					})
				}

			},
			changeMode() {
				if (this.mode == 2) {
					this.mode = 0
				} else {
					this.mode++
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.color-picker {

		.color-picker-mask {
			position: fixed;
			bottom: 0;
			top: 0;
			left: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.3);
			z-index: 99;
		}

		.color-picker-fixed {
			position: fixed;
			bottom: calc(var(--window-bottom));
			left: 0;
			right: 0;
			transition-property: transform;
			transition-duration: 0.3s;
			transform: translateY(1000px);
			z-index: 100;
			border-radius: 8px 8px 0 0;
		}

		.color-picker-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #fff;
			transform: translateY(0);

			.color-picker-header {
				padding: 8px;
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
				width: 100%;
				box-sizing: border-box;
				position: relative;
				color: #606060;
				font-size: 16px;

				.close-btn {
					font-size: 20px;
					font-weight: bold;
					position: absolute;
					top: 6px;
					right: 16px;
					cursor: pointer;
				}
			}

			.control-panel {
				margin-top: 20px;
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 18px;

				.color-display {
					width: 96rpx;
					height: 96rpx;
					border-radius: 50%;
					background-color: #fff;
					background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
						linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
					background-size: 16px 16px;
					background-position: 0 0, 8px 8px;
					border: 1px #eee solid;
					overflow: hidden;
					box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
						7px 7px 20px 0px rgba(0, 0, 0, .1),
						4px 4px 5px 0px rgba(0, 0, 0, .1);

					.display-fill {
						width: 96rpx;
						height: 96rpx;
					}
				}

				.control-bar {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 28rpx;
				}
			}

			.result-panel {
				margin-top: 16px;
				display: flex;
				align-items: center;
				padding-bottom: 20px;
				border-bottom: 1px solid #d3e3fd;
				gap: 20px 12px;

				.result-box {
					flex: 1;
					display: flex;
					align-items: center;
					gap: 16rpx;
				}

				.change-button {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 118rpx;
					height: 118rpx;
					border-radius: 6px;
					font-size: 24rpx;
					line-height: 1.5;
					padding: 0;
					color: #606060;
					box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
						7px 7px 20px 0px rgba(0, 0, 0, .1),
						4px 4px 5px 0px rgba(0, 0, 0, .1);

				}
			}

			.preset-panel {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 632rpx;
				box-sizing: border-box;
				padding: 12px 22px;
				gap: 48rpx;
				border-bottom: 1px solid #d3e3fd;
			}

			.picker-foot {
				width: 632rpx;
				padding: 12px 6px;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				gap: 8px;

				.btn {
					margin: 0;
					flex: 1;
					font-size: 14px;
				}

				.btn-confirm {
					background-color: #3355ff;
					border-color: #3355ff;
					color: #fff;
				}

				.confirm-hover {
					background-color: #334dcc;
					border-color: #334dcc;
					color: #f9f9f9;
				}
			}
		}
	}
</style>