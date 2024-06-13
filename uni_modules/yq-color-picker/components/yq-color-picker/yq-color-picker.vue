<template>
	<view class="yq-color-picker">
		<view class="picker-slot" @click="open">
			<slot>
				<view class="picker-editor" :class="{'picker-editor-border':showValue}">
					<view class="color-block" :style="{backgroundColor: currentColor}"></view>
					<input v-if="showValue" class="color-input" disabled placeholder="选择颜色" v-model="currentColor" />
				</view>
			</slot>
		</view>
		<view class="yq-color-picker-mask" v-if="show && !isPhone" @click="close"></view>
		<view class="yq-color-picker-container" v-if="!isPhone&&show">
			<view class="pc-content" :style="popover">
				<view class="popper-arrow"></view>
				<ColorPicker ref="pc" ispc :disable-history="this.disableHistory" :preset="preset" :title="title" :color="currentColor" @confirm="onConfirm" />
			</view>
		</view>
		<ColorPicker v-if="isPhone" :disable-history="this.disableHistory" ref="mobile" :preset="preset" :title="title" :color="currentColor"
			@confirm="onConfirm" />
	</view>
</template>

<script>
	/**
	 * yq-color-picker
	 * @description 颜色选择器
	 * @property {String} color 设置当前的初始颜色值
	 * @property {String} title 选择器标题
	 * @property {Boolean} showValue= [true|false] 是否显示数值
	 * @property {Bollean} disableHistory= [true|false] 是否禁用历史记录
	 * @property {Bollean} disabled= [true|false] 是否禁用组件
	 * @property {Array} preset 预置色卡
	 * @event {Function} confirm 点击确定按钮触发 $event='color string'
	 */
	import ColorPicker from './ColorPicker.vue';
	export default {
		components: {
			ColorPicker
		},
		name: "yq-color-picker",
		props: {
			color: {
				type: String,
				default: '#ff0000'
			},
			title: {
				type: String,
				default: '颜色选择器'
			},
			showValue: {
				type: Boolean,
				default: true
			},
			disableHistory: {
				type: Boolean,
				default:false
			},
			disabled:{
				type: Boolean,
				default:false
			},
			preset: {
				type: Array,
				default () {
					return ['#B8F1ED', '#F16D7A', '#AE716E', '#C86F67', '#B7D28D', '#D9B8F1']
				}
			},
		},
		emits: ['confirm'],
		watch:{
			color(newVal){
				this.currentColor=newVal
			}
		},
		data() {
			return {
				currentColor: '#ff0000',
				show: false,
				popover: {},
				isPhone: false
			};
		},
		created() {
			this.platform()
			this.currentColor = this.color || '#ff0000'
		},
		methods: {
			onConfirm(e) {
				this.currentColor = e
				this.$emit('confirm', e)
				this.close()
			},
			close() {
				this.show = false
			},
			platform() {
				const {
					windowWidth
				} = uni.getSystemInfoSync()
				this.isPhone = windowWidth <= 960
				this.windowWidth = windowWidth
			},
			open() {
				if (this.disabled) {
					return
				}
				this.platform()
				if (this.isPhone) {
					return this.$refs.mobile.open()
				}
				this.popover = {
					top: '8px'
				}
				const dateEditor = uni.createSelectorQuery().in(this).select(".picker-slot")
				dateEditor.boundingClientRect(rect => {
					if (this.windowWidth - rect.left < uni.upx2px(632)) {
						this.popover.right = 0
					}
					this.show = !this.show
				}).exec()
			}
		}
	}
</script>

<style lang="scss">
	.yq-color-picker {
		&-mask {
			position: fixed;
			bottom: 0px;
			top: 0px;
			left: 0px;
			right: 0px;
			background-color: transparent;
			z-index: 99;
		}

		.picker-slot {
			.picker-editor-border {
				border: 1px solid #e5e5e5;
			}

			.picker-editor {
				display: flex;
				flex-direction: row;
				align-items: center;
				background-color: #fff;
				box-sizing: border-box;
				border-radius: 4px;
				cursor: pointer;

				.color-block {
					width: 50px;
					height: 32px;
					margin-right: 4px;
					border-radius: 4px;
				}

				.color-input {
					position: relative;
					overflow: hidden;
					font-size: 14px;
					color: #666;
				}
			}
		}

		&-container {
			position: relative;

			.pc-content {
				background-color: #fff;
				position: absolute;
				top: 0;
				z-index: 999;
				border: 1px solid #EBEEF5;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				border-radius: 4px;

				.popper-arrow,
				.popper-arrow::after {
					position: absolute;
					display: block;
					width: 0;
					height: 0;
					border: 6px solid transparent;
					border-top-width: 0;
				}

				.popper-arrow {
					filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
					top: -6px;
					left: 10%;
					margin-right: 3px;
					border-bottom-color: #EBEEF5;
				}

				.popper-arrow::after {
					content: " ";
					top: 1px;
					margin-left: -6px;
					border-bottom-color: #fff;
				}
			}
		}
	}
</style>