<template>
	<scroll-view scroll-y class="category-right">
		<view class="category-title">{{ title }}</view>
		<view class="product-list">
			<view class="product-item" v-for="item in products" :key="item.id">
				<image :src="item.main_pic" mode="aspectFill" class="product-image" @click="goProductDetail(item)">
				</image>
				<view class="product-info">
					<text class="product-name">{{item.name}}</text>
					<view class="price-row">
						<text class="product-price">￥{{item.price}}</text>

						<view class="add-cart">
							<up-icon name="shopping-cart" color="#fff" size="18"></up-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { IProductItem } from '../type';
	interface IProps {
		title : string,
		products : IProductItem[]
	}

	const props = defineProps<IProps>()
</script>

<style lang="scss" scoped>
	.category-right {
		flex: 1;
		height: 100%;
		padding: 20rpx;

		.category-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			padding: 0 10rpx;
		}

		.product-list {
			display: flex;
			flex-wrap: wrap;

			.product-item {
				width: calc(50% - 20rpx);
				margin: 10rpx;
				padding: 10rpx;
				box-sizing: border-box;
				border-radius: 12rpx;
				overflow: hidden;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.2);

				.product-image {
					width: 100%;
					height: 200rpx;
				}

				.product-info {
					padding: 16rpx;

					.product-name {
						font-size: 24rpx;
						color: #333;
						display: block;
						margin-bottom: 8rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 100%;
						line-height: 1.4;
					}

					.price-row {
						display: flex;
						justify-content: space-around;
						align-items: center;

						.product-price {
							font-size: 26rpx;
							color: $uni-color-primary;
							font-weight: bold;

						}

						.add-cart {
							width: 48rpx;
							height: 48rpx;
							background-color: $uni-color-primary ;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}
</style>
