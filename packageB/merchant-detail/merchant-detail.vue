<template>
	<view class="merchant-detail-container">
		<view class="merchant-info">
			<image class="merchant-bg" src="/static/modules/service/cat.jpg" mode="aspectFill"></image>
			<view class="merchant-card">
				<view class="merchant-header">
					<image class="merchant-avatar" :src="merchantInfo.pic" mode="aspectFill"></image>
					<view class="merchant-basic">
						<text class="merchant-name">{{merchantInfo.merchant_name}}</text>
						<view class="rating-info">
							<up-rate readonly allow-half active-color="#ffce2c" inactive-color="#b2b2b2"
								v-model="merchantInfo.rating"></up-rate>
							<text class="rating-text">{{merchantInfo.rating}}</text>
							<text class="review-count" v-if="merchantInfo.rating>4.5">（ 精选商家 ）</text>
						</view>
						<view class="distance-info">
							<text class="distance-text">
								{{merchantInfo.address}}
							</text>
						</view>
					</view>
				</view>
				<view class="merchant-tags">
					<view class="tag-item" v-for="(item,index) in merchantInfo.tag?.split(',')" :key="index">{{item}}
					</view>

				</view>
			</view>
		</view>
		<view class="service-section">
			<view class="section-title">
				<text class="title-text">服务项目</text>
			</view>
			<view class="service-list">
				<view class="service-item" v-for="item in serviceList" :key="item.id">
					<image class="service-icon" src="/static/modules/service/pet1.png" mode="aspectFill"></image>
					<view class="service-info">
						<text class="service-name">{{item.service_name}}</text>
						<view class="service-price">
							<text class="price-symbol">￥</text>
							<text class="price-value">{{item.service_price}}</text>
							<text class="price-unit">/{{item.service_unit}}</text>
						</view>
					</view>
					<view class="service-action">
						<up-button type="primary" size="mini" style="background-color: #ffce2c;border-color: #ffce2c;"
							@click="bookNow(item)">立即预约</up-button>
					</view>
				</view>
			</view>
		</view>
		<view class="info-section">
			<view class="section-title">
				<text class="title-text">商家信息</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<up-icon name="map" size="32rpx" color="#666"></up-icon>
					<text class="info-label">地址：</text>
					<text class="info-value">{{merchantInfo.address}}</text>
				</view>
				<view class="info-item">
					<up-icon name="clock" size="32rpx" color="#666"></up-icon>
					<text class="info-label">营业时间：</text>
					<text class="info-value">{{merchantInfo.business_hours}}</text>
				</view>
				<view class="info-item">
					<up-icon name="phone" size="32rpx" color="#666"></up-icon>
					<text class="info-label">联系电话：</text>
					<text class="info-value" style="color: #ffce2c;">{{merchantInfo.phone}}</text>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="primary-actions">
				<up-button type="primary" :style="item.style" @click="actionClick(item.key)"
					v-for="item in actionBtnList" :key="item.key">{{item.name}}</up-button>
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { IMerchantItem } from '../../pages/index/type'
	import { IServiceItem } from './type'
	import { actionBtnList, actionMap } from './const'
	import { get } from '../../http/index'
	const merchantInfo = ref<IMerchantItem>({} as IMerchantItem)
	onLoad((options : any) => {
		merchantInfo.value = JSON.parse(options.info)
		getService()

	})
	const serviceList = ref<IServiceItem[]>([])
	const getService = async () => {
		const data : any = await get("/home/service", { merchant_id: merchantInfo.value.merchant_id })
		serviceList.value = data
	}
	const actionClick = (key : string) => {
		if (key === 'phone') {
			call()
		} else if (key === 'address') {
			viewLocation()
		}

	}
	const call = () => {
		uni.makePhoneCall({
			phoneNumber: merchantInfo.value.phone
		});
	}
	const viewLocation = () => {
		uni.openLocation({
			latitude: 39.9042,//维度
			longitude: 116.4074,//经度
			name: merchantInfo.value.merchant_name,
			address: merchantInfo.value.address,
			success(res) {
				console.log("打开地图成功", res)
			},
			fail(err) {
				console.log("打开地图失败", err)
			}
		})
	}
	const bookNow=(item:IServiceItem)=>{
		let selPro=[{
			count:1,
			main_pic:"http://localhost:3000/img/part/宠物寄养.png",
			name:item.service_name,
			price:item.service_price,
			product_id:item.merchant_id,
			spec:""
		}]
		uni.navigateTo({
			url:"/packageB/order/order?selPro="+JSON.stringify(selPro) + '&type=service'
		})
	}
</script>

<style lang="scss" scoped>
	.merchant-detail-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 120rpx;

		.merchant-info {
			position: relative;

			.merchant-bg {
				width: 100%;
				height: 300rpx;
			}

			.merchant-card {
				position: absolute;
				bottom: -60rpx;
				left: 30rpx;
				right: 30rpx;
				background-color: #fff;
				border-radius: 16rpx;
				padding: 30rpx;
				box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

				.merchant-header {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.merchant-avatar {
						width: 120rpx;
						height: 120rpx;
						border-radius: 12rpx;
						margin-right: 20rpx;
					}

					.merchant-basic {
						flex: 1;

						.merchant-name {
							font-size: 36rpx;
							font-weight: bold;
							color: #000;
							line-height: 50rpx;
							margin-bottom: 12rpx;
							display: block;
						}

						.rating-info {
							display: flex;
							align-items: center;
							margin-bottom: 8rpx;

							.rating-text {
								color: #ffce2c;
								font-size: 28rpx;
								margin-left: 10rpx;
							}

							.review-count {
								color: #999;
								font-size: 24rpx;
								margin-left: 10rpx;
							}
						}

						.distance-info {
							.distance-text {
								color: #666;
								font-size: 24rpx;
								margin-left: 8rpx;
							}
						}
					}
				}

				.merchant-tags {
					display: flex;
					flex-wrap: wrap;

					.tag-item {
						padding: 6rpx 16rpx;
						font-size: 20rpx;
						border-radius: 20rpx;
						margin-right: 12rpx;
						margin-bottom: 8rpx;
						background-color: rgba(255, 206, 44, 0.1);
						color: #ffce2c;
						border: 1px solid rgba(255, 206, 44, 0.3);
					}
				}
			}
		}

		.service-section {
			background-color: #fff;
			margin: 0 30rpx;
			margin-top: 80rpx;
			border-radius: 16rpx;
			padding: 30rpx;

			.section-title {
				margin-bottom: 30rpx;

				.title-text {
					font-size: 32rpx;
					font-weight: bold;
					color: #000;
				}
			}

			.service-list {
				.service-item {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 1px solid #f0f0f0;

					.service-icon {
						width: 80rpx;
						height: 80rpx;
						margin-right: 20rpx;
					}

					.service-info {
						flex: 1;

						.service-name {
							font-size: 28rpx;
							font-weight: bold;
							margin-bottom: 8rpx;
						}

						.service-price {
							.price-symbol {
								color: #ffce2c;
								font-size: 24rpx;
							}

							.price-value {
								color: #ffce2c;
								font-size: 32rpx;
								font-weight: bold;
								margin: 0 4rpx;
							}

							.price-unit {
								color: #999;
								font-size: 24rpx;
							}
						}
					}
				}
			}

		}

		.info-section {
			background-color: #fff;
			margin: 0 30rpx;
			margin-top: 20rpx;
			border-radius: 16rpx;
			padding: 30rpx;

			.section-title {
				margin-bottom: 30rpx;

				.title-text {
					font-size: 32rpx;
					font-weight: bold;
					color: #000;
				}
			}

			.info-list {
				.info-item {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 1px solid #f0f0f0;

					.info-label {
						font-size: 28rpx;
						color: #666;
						margin-left: 16rpx;
						margin-right: 8rpx;
					}

					.info-value {
						flex: 1;
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}

		.bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			border-top: 1px solid #f0f0f0;
			padding: 20rpx 30rpx;

			.primary-actions {
				overflow: hidden;
			}
		}
	}
</style>
