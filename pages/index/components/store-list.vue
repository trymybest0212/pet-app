<template>
	<view class="store-list">
		<view class="store-item" v-for="item in merchanList" :key="item.merchant_id">
			<image class="store-img" mode="aspectFill" :src="item.pic"></image>
			<view class="store-info">
				<text class="store-name">{{item.merchant_name}}</text>
				<view class="rate-area">
					<up-rate v-model="item.rating" readonly inactive-color="#b2b2b2" active-color="#ffce2c"></up-rate>
					<text class="rate-text">{{item.rating}}</text>
				</view>
				<text class="store-detail">{{item.address}}</text>
				<view class="tag-area">
					<view class="tag-item" v-for="tag in item.service.split(',')" :key="tag">{{tag}}</view>
				</view>
				<view class="price-area">
					<view>惠</view>【新客福利】<text>￥19.9</text>代金券可领
				</view>
			</view>
		</view>
		<up-divider text="我是有底线的"></up-divider>

	</view>
</template>

<script setup lang="ts">
	import { IMerchantItem } from '../type';

	const props = defineProps<{merchanList: IMerchantItem[]}>()

</script>

<style lang="scss">
	.store-list {
		background-color: #fff;
		.store-item {
			display: flex;
			background-color: #fff;
			border-radius: 16rpx;
			margin: 10rpx 0 10rpx 0;
			padding: 20rpx;
			.store-img {
				width: 160rpx;
				height: 160rpx;
				background-color: #ddd;
				border-radius: 8rpx;
				margin-right: 20rpx;
				margin-top: 8rpx;
			}

			.store-info {
				flex: 1;

				.store-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #000;
					line-height: 44rpx;
					display: block;
					margin-bottom: 8rpx;
				}

				.rate-area {
					display: flex;
					align-items: center;
					margin-bottom: 8rpx;

					.rate-text {
						color: $uni-color-primary;
						font-size: 28rpx;
						margin-left: 10rpx;
					}

				}

				.service-detail {
					font-size: 24rpx;
					color: #999;
					line-height: 34rpx;
					display: block;
					margin-bottom: 20rpx;
				}

				.tag-area {
					display: flex;
					align-items: center;
					margin: 12rpx 0;

					.tag-item {
						font-size: 18rpx;
						padding: 4rpx 14rpx;
						border-radius: 20rpx;
						margin-right: 16rpx;
						border: 1px solid;

						&:nth-child(1) {
							color: #ff6b81;
							border-color: #ff6b81;
							background-color: rgba(255, 107, 129, 0.1);
						}

						&:nth-child(2) {
							color: #ffce2c;
							border-color: #ffce2c;
							background-color: rgba(255, 206, 44, 0.1);
						}

						&:nth-child(3) {
							color: #19be6b;
							border-color: #19be6b;
							background-color: rgba(25, 190, 107, 0.1);
						}

						&:nth-child(4) {
							color: #ff9900;
							border-color: #ff9900;
							background-color: rgba(255, 153, 0, 0.1);
						}

						&:last-child {
							margin-right: 0;
						}
					}
				}

				.price-area {
					display: flex;
					align-items: center;
					margin-top: 16rpx;
					font-size: 24rpx;
					color: #666;

					view {
						background-color: $uni-color-primary;
						color: #fff;
						font-size: 20rpx;
						padding: 2rpx 8rpx;
						border-radius: 4rpx;
						margin-right: 8rpx;
					}

					text {
						color: #ff6b81;
						font-size: 24rpx;
						margin: 0 4rpx;
					}
				}

			}
		}

	}
</style>
