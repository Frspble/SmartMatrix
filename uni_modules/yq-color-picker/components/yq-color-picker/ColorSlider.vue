<template>
	<view class="color-slider-wrapper" @mousedown="silder.touchstart" @mousemove="silder.touchmove"
		@mouseup="silder.touchend" @mouseleave="silder.touchend" @touchstart="silder.touchstart"
		@touchmove="silder.touchmove" @touchend="silder.touchend" @touchcancel="silder.touchend">
		<view class="color-slider" :style="background">
			<view class="slider-block" :style="pointStyle">
			</view>
		</view>
	</view>
</template>
<script module="silder" src="./ColorSliderWxs.wxs" lang="wxs"></script>
<!-- #ifdef MP-ALIPAY -->
<script module="silder" src="./ColorSliderSjs.sjs" lang="sjs"></script>
<!-- #endif -->
<script>
	export default {
		emits: ['change'],
		props: {
			value: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: 'hue'
			},
			color: {
				type: String,
				default: 'black'
			}
		},
		data() {
			return {
				x: 0,
				width: 0,
				pointStyle: {},
				touched: false
			}
		},
		watch: {
			value(newValue) {
				if (this.type === 'hue') {
					this.x = parseInt(newValue * this.width / 360);
				} else if (this.type === 'alpha') {
					this.x = parseInt(newValue * this.width);
				}
				if (!this.touched) {
					this.pointStyle = { left: this.x - 8 + 'px' }
				}
			}
		},
		computed: {
			background() {
				if (this.type == 'hue') {
					return 'background-image: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);'
				} else {
					return `background-image: linear-gradient(to right, transparent, ${this.color});`
				}
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			firstTouch() {
				this.touched = true
			},
			emitEvent({ distance }) {
				let value
				if (this.type === 'hue') {
					value = parseInt(distance * 360)
				} else {
					value = parseFloat(distance.toFixed(1))
				}
				this.$emit('change', value)
			},
			init() {
				const views = uni.createSelectorQuery().in(this);
				views.select('.color-slider').boundingClientRect(data => {
						const {
							width,
							left
						} = data
						this.width = width
						if (this.type === 'hue') {
							this.x = parseInt(this.value * width / 360);
						} else if (this.type === 'alpha') {
							this.x = parseInt(this.value * width);
						}
						this.pointStyle = { left: this.x - 8 + 'px' }
					})
					.exec();
			}
		}
	}
</script>

<style scoped>
	.color-slider-wrapper {
		border-radius: 2px;
		width: 400rpx;
		background-size: 16px 16px;
		background-position: 0 0, 8px 8px;
		background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
			linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
	}

	.color-slider {
		width: 100%;
		height: 16px;
		border-radius: 2px;
		outline: none;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.slider-block {
		position: absolute;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #f2f2f2;
		cursor: pointer;
		box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
			7px 7px 20px 0px rgba(0, 0, 0, .1),
			4px 4px 5px 0px rgba(0, 0, 0, .1);
	}
</style>