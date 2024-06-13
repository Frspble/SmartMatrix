<template>
	<view class="color-panel" 
	@mousedown="panel.touchstart" 
	@mousemove="panel.touchmove"
		@mouseup="panel.touchend"
		 @mouseleave="panel.touchend" 
		 @touchstart="panel.touchstart"
		  @touchmove.stop.prevent="panel.touchmove"
		@touchend="panel.touchend" @touchcancel="panel.touchend" :style="{backgroundColor:hueColor}">
		<view class="slider-block" :style="pointStyle"></view>
	</view>
</template>
<script module="panel" src='./ColorPanelWxs.wxs' lang="wxs"></script>
<!-- #ifdef MP-ALIPAY -->
<script module="panel" src='./ColorPanelSjs.sjs' lang="sjs"></script>
<!-- #endif -->
<script>
	export default {
		emits: ['change'],
		props: {
			h: {
				type: Number,
				default: 0
			},
			s: {
				type: Number,
				default: 100
			},
			l: {
				type: Number,
				default: 50
			}
		},
		data() {
			return {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				pointStyle: {},
				touched: false
			}
		},
		watch: {
			s(newValue) {
				this.x = parseInt(newValue * this.width / 100);
				if (!this.touched) {
					this.pointStyle = { top: this.y - 8 + 'px', left: this.x - 8 + 'px' }
				}
			},
			l(newValue) {
				this.y = parseInt((100 - newValue) * this.height / 100);
				if (!this.touched) {
					this.pointStyle = { top: this.y - 8 + 'px', left: this.x - 8 + 'px' }
				}
			}
		},
		computed: {
			hueColor() {
				return `hsl(${this.h}, 100%, 50%)`;
			}
		},
		created() {
			const { windowTop } = uni.getSystemInfoSync()
			// #ifdef H5 || APP-VUE
			this.panel.setWindowTop(windowTop)
			// #endif

		},
		mounted() {
			this.init()
		},
		methods: {
			firstTouch() {
				this.touched = true
			},
			emitEvent(data) {
				this.$emit('change', data)
			},
			init() {
				const views = uni.createSelectorQuery().in(this);
				views.select('.color-panel').boundingClientRect(data => {
						const {
							height,
							width,
						} = data
						this.width = width;
						this.height = height;
						this.x = parseInt(this.s * width / 100);
						this.y = parseInt((100 - this.l) * height / 100);
						this.pointStyle = { top: this.y - 8 + 'px', left: this.x - 8 + 'px' }
					})
					.exec();
			}
		}
	}
</script>

<style scoped>
	.color-panel {
		width: 632rpx;
		height: 374rpx;
		position: relative;
		overflow: hidden;
		background-image: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0) 50%),
			linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0) 50%),
			linear-gradient(to right, rgba(128, 128, 128, 1), rgba(128, 128, 128, 0));
	}


	.slider-block {
		position: absolute;
		width: 18px;
		height: 18px;
		border: 1px #e1e1e1 solid;
		border-radius: 50%;
		cursor: pointer;
	}
</style>