<template>
	<view class="color-box" @click="onClick">
		<view class="color-box-inside" :style="{backgroundColor:color}">

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			color: {
				type: String,
				default: 'transparent'
			}
		},
		emits: ['click'],
		methods: {
			onClick(e) {
				this.$emit('click', this.color)
			}
		}
	}
</script>

<style scoped>
	.color-box {
		border: 1px solid #d3e3fd;
		width: 50rpx;
		height: 50rpx;
		background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
			linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
		background-size: 16px 16px;
		background-position: 0 0, 8px 8px;
		cursor: pointer;
		border-radius: 3px;
		box-sizing: border-box;
	}

	.color-box-inside {
		width: 50rpx;
		height: 50rpx;
	}
</style>