<template>
	<view class="header" :style="headerStyle">
		<view class="status-bar"></view>
		<view class="nav-content" :style="navStyle">
			<view class="location" @click="handleLocation">
				<uni-icons type="location" size="28" color="#fff"></uni-icons>
				<text class="city">{{cityName}}</text>
			</view>
			<view class="search-box">
				<uni-search-bar radius="100" placeholder="搜索宠物服务" clear-button="none" cancel-button="none"
					style="width: 100%"></uni-search-bar>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface IProps {
  menuButtonInfo:{
	  top:string,
	  height: string
  },
  cityName: string
}
	const props = defineProps<IProps>()
	const emit = defineEmits(['getLocation'])

	const headerStyle = computed(() => {
		let style = {
			height: '200px'
		}
		// #ifdef MP-WEIXIN
		if (props.menuButtonInfo) {
			style = {
				height: `${props.menuButtonInfo.height + props.menuButtonInfo.top + 20}px  `
			}
		}

		// #endif
		// #ifdef H5 || APP-PLUS
		style = {
			height: '90px'
		}
		// #endif
		return style

	})

	const navStyle = computed(() => {
		let style = {
			height: '44px',
			top: '0px'
		}
		// #ifdef MP-WEIXIN
		if (props.menuButtonInfo) {
			style = {
				height: props.menuButtonInfo.height + 'px',
				top: props.menuButtonInfo.top + 'px'
			}
		}
		// #endif
		// #ifdef H5 || APP-PLUS
		style = {
			top: "20px",
			height: "50px"
		}
		// #endif
		return style
	})
	const handleLocation = () => {
		emit('getLocation')
	}
</script>

<style lang="scss">
	.header {
		background-color: $uni-color-primary;

		.status-bar {
			width: 100%;
			height: var(--status-bar-height);
		}

		.nav-content {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			position: fixed;
			left: 0;
			right: 0;

			.location {
				display: flex;
				align-items: center;
				margin-right: 10rpx;

				.city {
					color: #fff;
					font-size: 28rpx;
					width: 120rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.search-box {
				width: 360rpx;
			}
		}
	}
</style>
