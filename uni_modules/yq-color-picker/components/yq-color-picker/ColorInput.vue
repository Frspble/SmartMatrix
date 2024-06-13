<template>
	<view class="color-input-warper">
		<input class="color-input" ref="input" maxlength="9" :type="type" :style="{width: width}" @input="onInput"
			v-model="val" :class="{'input-focus':isFocused}" @focus="isFocused=true" @blur="change" />
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		emits: ['change'],
		props: {
			value: [String, Number],
			text: String,
			width: {
				type: [String, Number],
				default: '100rpx'
			},
			type: {
				type: String,
				default: 'text'
			},
			"valKey": String
		},
		data() {
			return {
				isFocused: false,
				val: ''
			}
		},
		watch: {
			value(newVal) {
				this.val = newVal
			}
		},
		created() {
			this.val = this.value
		},
		methods: {
			onInput(e) {
				let value = e.detail.value

				if (value === '') {
					return this.$nextTick(() => {
						this.val = value
					})
				}
				if (this.type === 'number') {
					value = parseInt(value)
					if (isNaN(value)) value = 0
					if (this.valKey === 'h') {
						this.$nextTick(() => {
							this.val = value <= 0 ? 0 : value >= 360 ? 360 : value
						})
					} else if (this.valKey === 's' || this.valKey === 'l') {
						this.$nextTick(() => {
							this.val = value <= 0 ? 0 : value >= 100 ? 100 : value
						})
					} else if (this.valKey === 'r' || this.valKey === 'g' || this.valKey === 'b') {
						this.$nextTick(() => {
							this.val = value <= 0 ? 0 : value >= 255 ? 255 : value
						})
					}
				} else if (this.valKey === 'a') {
					value = value.replace(/[^0-9.]/g, '');
					// 验证小数点只能有一个
					const parts = value.split('.');
					if (parts.length > 2) {
						value = parts[0] + '.' + parts[1];
					}
					
					const floatNumber = parseFloat(value);
					if (!isNaN(floatNumber) && !value.endsWith('.')) {
						value = floatNumber <= 0 ? '0' : value >= 1 ? '1' : floatNumber.toFixed(1)
					}

					this.$nextTick(() => {
						this.val = value
					})
				} else {
					value = value.replace(/[^0-9a-fA-F#]/g, '').substring(0, 9);
					this.$nextTick(() => {
						this.val = value
					})
				}
			},
			change() {
				this.isFocused = false
				let val = this.val
				if (this.type === 'number' || this.valKey === 'a') {
					val = Number(val)
					this.val = val
				} else {
					val = val ? val : '#000'
					this.val = val
				}
				this.$emit('change', {
					key: this.valKey,
					value: val
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.color-input-warper {
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px 0;
		color: #707070;

		.color-input {
			border: 1px solid #C7C7C7;
			text-align: center;
			border-radius: 3px;
			font-size: 14px;
			height: 30px;
		}

		.input-focus {
			border-color: #0b57d0;
			pointer-events: none;
		}

		.color-input:hover {
			background-color: #f2f2f2;
		}
	}
</style>