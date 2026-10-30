<template>
	<view class="index-container">
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

	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from "vue"
	import {
		onLoad,

	} from "@dcloudio/uni-app"
	import reverseCode from '../../utils/geocode.ts'
	const menuButtonInfo = ref(null)
	onLoad(() => {
		// #ifdef MP-WEIXIN
		menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
		// #endif

		// #ifdef H5 || APP-PLUS
		menuButtonInfo.value = {
			top: '0px',
			height: '40px'
		}
		// #endif
		console.log(111)
		getLocation()
	})

	const headerStyle = computed(() => {
		let style = {
			height: '200px'
		}
		// #ifdef MP-WEIXIN
		if (menuButtonInfo.value) {
			style = {
				height: `${menuButtonInfo.value.height + menuButtonInfo.value.top + 20}px  `
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
		if (menuButtonInfo.value) {
			style = {
				height: menuButtonInfo.value.height + 'px',
				top: menuButtonInfo.value.top + 'px'
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

	const cityName = ref('')

	const handleLocation = () => {
		getLocation()
	}
	const getLocation = () => {
		uni.getLocation({
			type: "wgs84",
			geocode: true,
			success: async (data) => {
				try {
					console.log(data,data?.longitude, data?.latitude,'经纬度')
					const res = await reverseCode(data?.longitude, data?.latitude)
					cityName.value = res
				} catch (error) {
					//TODO handle the exception
					console.log(error,'err')
					cityName.value = '无法定位'
				}

			},
			fail() {
				cityName.value = '无法获取定位';
				uni.
				({
					title: "提示",
					content: '需要获取您的位置信息，是否设置开启定位权限',
					success: (res) => {
						if (res.confirm) {
							// #ifdef MP-WEIXIN
							uni.openSetting({
								success: (settings) => {
									console.log('打开设置页面', settings)

								}
							})
							//  #endif
							// #ifdef APP-PLUS
							uni.showModal({
								title: "提示",
								content: "请去系统设置中开启定位权限并重新定位",
								showCancel: false
							})
							// #endif
							// #ifdef H5
							setTimeout(() => {
								uni.showModal({
									title: '提示',
									content: "请去浏览器设置中开启定位权限并重新定位",
									showCancel: false
								})

							}, 300)
							// #endif

						}

					}
				})
			}
		})
	}
</script>

<style lang="scss">
	.index-container {
		background-color: #f7f7f7;

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
	}
</style>
