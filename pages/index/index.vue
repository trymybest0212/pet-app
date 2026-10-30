<template>
	<view class="index-container">
		<Header :menu-button-info="menuButtonInfo" :city-name="cityName" @getLocation="getLocation"></Header>
		<view class="content">
			<swiper class="banner-list" :indicator-dots="true" autoplay circular indicator-color="rgb(255,255,255,0.6)"
				indicator-active-color="#fff">
				<swiper-item v-for="item in bannerList" :key="item.title">
					<view class="swiper-item-content">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="part-list">
				<up-scroll-list indicatorColor="#fff0f0" indicatorActiveColor="#ffce2c">
					<view class="part-item" v-for="item in partList" :key="item.title">
						<image class="part-image" :src="item.url" mode="aspectFill"></image>
						<text class="part-title">{{item.title}}</text>
					</view>
				</up-scroll-list>
			</view>
			<view class="part-list">
				<view class="p-4 bg-white">
					<up-box height="180px" gap="12px">
						<template #left>
							<image class="box-image" src="/static/modules/home/pic1.png" mode="aspectFill"></image>
						</template>
						<template #rightTop>
							<image class="box-image" src="/static/modules/home/pic2.png" mode="aspectFill"></image>
						</template>
						<template #rightBottom>
							<image class="box-image" src="/static/modules/home/pic3.png" mode="aspectFill"></image>
						</template>
					</up-box>
				</view>
			</view>
			<view class="exchange-section">
				<view class="section-title-area">
					<text class="section-title">省钱速报</text>
					<text class="section-subtitle">折扣促销每日更新</text>
					<view class="go-btn">GO</view>
				</view>
				<view class="promo-cards">
					<view class="promo-card" v-for="item in exchangeCards" :key="item.title">
						<image class="img-placeholder" :src="item.imgUrl" mode="aspectFill"></image>
						<text class="promo-title">{{item.title}}</text>
						<text class="promo-desc">{{item.desc}}</text>
						<view class="samll-go">GO</view>
					</view>
				</view>
			</view>
			<StoreList :merchan-list="merchanList"></StoreList>
		</view>
	</view>
</template>


<script setup lang="ts">
	import {
		computed,
		ref
	} from "vue"
	import {
		onLoad,
		onReachBottom

	} from "@dcloudio/uni-app"
	import reverseCode from '../../utils/geocode'
	import {
		imageItem,
		IMerchantItem
	} from './type'
	import {
		get
	} from '../../http/index.js'
	import Header from './components/header.vue'
	import StoreList from './components/store-list.vue'
	const menuButtonInfo = ref(null)
	const cityName = ref('')
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
		getLocation();
		getBannerList();
		getPartList();
		getMerchanList(1);
	})

	const getLocation = () => {
		uni.getLocation({
			type: "wgs84",
			geocode: true,
			success: async (data) => {
				try {
					console.log(data, data?.longitude, data?.latitude, '经纬度')
					const res = await reverseCode(data?.longitude, data?.latitude)
					cityName.value = res
				} catch (error) {
					//TODO handle the exception
					console.log(error, 'err')
					cityName.value = '无法定位'
				}

			},
			fail() {
				cityName.value = '无法获取定位';
				uni.showModal({
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

	const bannerList = ref<imageItem[]>([])
	const getBannerList = async () => {
		try {
			const res : any = await get("/home/banner")
			bannerList.value = res.banner;
		} catch (error) {
			//TODO handle the exception
			console.log(error)
		}
	}

	const partList = ref<imageItem[]>([])
	const getPartList = async () => {
		try {
			const res : any = await get("/home/part")
			partList.value = res.part;
		} catch (error) {
			//TODO handle the exception
			console.log(error)
		}
	}

	const exchangeCards = ref([
		{
			imgUrl: '/static/modules/home/pic4.jpg',
			title: '到店服务',
			desc: '限时降价'
		},
		{
			imgUrl: '/static/modules/home/pic5.jpg',
			title: '领券中心',
			desc: '618立减'
		}
	])

	const merchanList = ref<IMerchantItem[]>([])
	const currentPage = ref<number>(1)
	const totalPages = ref<number>(0)
	const getMerchanList = async (page : number) => {
		try {
			const { list, pagination } : any = await get("/home/merchants", { page }) as any;
			if (page === 1) {
				merchanList.value = list
			} else {
				merchanList.value = [...merchanList.value, ...list]
			}
			totalPages.value = pagination.totalPages
			currentPage.value = pagination.current
		} catch (error) {
			console.error("获取失败")
		}
	}
	onReachBottom(()=>{
		if(currentPage.value<totalPages.value){
			getMerchanList(currentPage.value+1)
		}
	})
</script>

<style lang="scss">
	.index-container {
		background-color: #f7f7f7;

		.content {
			padding: 0 10rpx;

			.banner-list {
				width: 100%;
				height: 350rpx;
				margin-top: 20rpx;


				.swiper-item-content {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
						border-radius: 16rpx;

					}
				}
			}

			.part-list {
				background-color: #fff;
				margin-top: 20rpx;
				margin-bottom: 24rpx;
				border-radius: 16rpx;
				padding: 30rpx;

				.part-item {
					text-align: center;

					.part-image {
						width: 90rpx;
						height: 90rpx;
						box-sizing: border-box;
						margin: 0 20rpx;
					}

					.part-title {
						font-size: 24rpx;
						color: $uni-text-color;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.box-image {
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}

			}

			.exchange-section {
				background-color: #fff;
				border-radius: 16rpx;
				padding: 30rpx;
				margin-bottom: 24rpx;

				.section-title-area {
					display: flex;
					align-items: center;
					margin-bottom: 24rpx;

					.section-title {
						font-size: 32rpx;
						font-weight: bold;
						color: #000;
						margin-right: 16rpx;
					}

					.section-subtitle {
						font-size: 24rpx;
						color: $uni-text-color-grey ;
						flex: 1
					}

					.go-btn {
						background-color: #ff6b81;
						border-radius: 22rpx;
						font-size: 24rpx;
						color: #fff;
						padding: 4rpx 20rpx;
					}
				}

				.promo-cards {
					display: flex;
					justify-content: space-between;

					.promo-card {
						width: 330rpx;
						background-color: #f9f9f9;
						border-radius: 16rpx;
						padding: 20rpx;
						position: relative;

						.img-placeholder {
							width: 100%;
							height: 160rpx;
							border-radius: 8rpx;
							margin-bottom: 16px;
						}

						.promo-title {
							font-size: 28rpx;
							color: $uni-text-color;
							line-height: 40rpx;
							display: block;
						}

						.promo-desc {
							font-size: 24rpx;
							color: #999;
							line-height: 34rpx;
							display: block;
						}

						.samll-go {
							position: absolute;
							right: 20rpx;
							bottom: 20rpx;
							background-color: #ff6b81;
							border-radius: 16rpx;
							font-size: 20rpx;
							color: #fff;
							padding: 2rpx 16rpx;
						}
					}
				}

			}
		}

	}
</style>
