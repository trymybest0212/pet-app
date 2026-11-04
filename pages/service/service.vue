<template>
	<view class="service-container">
		<up-notice-bar text="您有一份宠物大礼包待领取，请及时领取" mode="closable"></up-notice-bar>
		<view class="service-list">
			<view class="service-item" v-for="item in serviceList" :key="item.name">
				<view class="icon" :style="{background:item.bgColor}">
					<image :src="item.icon" mode="aspectFill"></image>
				</view>
				<text class="name">{{item.name}}</text>
			</view>
		</view>
		<view class="pet-images">
			<image v-for="item in specialImg" :src="item" mode="aspectFill" :key="item"></image>
		</view>
		<view class="fish-bone">
			<image src="/static/modules/service/鱼骨头.png" mode="aspectFit"></image>
			<text>宠物领养</text>
		</view>
		<scroll-view scroll-x class="scroll-view">
			<view class="scroll-view-item" v-for="item in adoptList" :key="item.id">
				<image :src="item.pic" mode="aspectFill"></image>
				<text>{{item.location}}</text>
				<text>{{item.name}}</text>
				<text>待领养：{{item.count}}只</text>
				<up-rate v-model="item.rate" readonly inactive-color="#b2b2b2" active-color="#ffce2c"
					activeIcon="heart-fill" inactiveIcon="heart"></up-rate>
			</view>
		</scroll-view>
		<view class="fish-bone">
			<image src="/static/modules/service/鱼骨头.png" mode="aspectFit"></image>
			<text>附近商家</text>
		</view>
		<StoreList :merchan-list="merchanList"></StoreList>

	</view>
</template>

<script setup lang="ts">
	import { serviceList, specialImg } from './const'
	import StoreList from '../index/components/store-list.vue'
	import { onLoad, onReachBottom } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import { get } from '../../http/index'
	import { IAdoptItem } from './type'
	import { IMerchantItem } from '../index/type'

	onLoad(() => {
		getAdoptList()
		getMerchanList(1)
	})
	const adoptList = ref<IAdoptItem[]>([])
	const getAdoptList = async () => {
		try {
			const res : any = await get("/adopt/list");
			adoptList.value = res
		} catch (error) {
			console.log("获取失败")
			//TODO handle the exception
		}
	}
	//商家列表
	const merchanList = ref<IMerchantItem[]>([])
	const currentPage = ref<number>(1)
	const totalPages = ref<number>(0)
	const getMerchanList = async (page : number) => {
		try {
			const data : any = await get("/home/merchants", { page });
			if (page === 1) {
				merchanList.value = data.list
			} else {
				merchanList.value = [...merchanList.value, ...data.list]
			}
			totalPages.value = data.pagination.totalPages
			currentPage.value = data.pagination.current
		} catch (error) {
			console.error("获取失败")
		}
	}

	onReachBottom(() => {
		if (currentPage.value < totalPages.value) {
			getMerchanList(currentPage.value + 1)
		}
	})
</script>

<style lang="scss" scoped>
	.service-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 0 30rpx;

		.service-list {
			display: flex;
			flex-wrap: wrap;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 30rpx;
			margin: 20rpx 0;

			.service-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 40rpx;

				.icon {
					width: 100rpx;
					height: 100rpx;
					border-radius: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 16rpx;

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.name {
					font-size: 24rpx;
					color: #333;
				}
			}
		}

		.pet-images {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;

			image {
				width: 360rpx;
				height: 140rpx;
				border: 4rpx solid #fff;

				&:first-child {
					margin-right: 20rpx;
				}
			}
		}

		.fish-bone {
			display: flex;
			align-items: center;
			margin-top: 20rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				transform: rotate(90deg);
				margin-right: 10rpx;
			}

			text {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}


		.scroll-view {
			white-space: nowrap;

			.scroll-view-item {
				display: inline-block;
				width: 240rpx;
				height: 300rpx;
				background-color: #fff;
				border-radius: 20rpx;
				margin-right: 20rpx;
				position: relative;
				padding: 20rpx;
				margin-top: 80rpx;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					position: absolute;
					left: 50%;
					top: -50rpx;
					transform: translateX(-50%);
					border: 4rpx solid #fff;
					box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
				}

				text {
					display: block;
					text-align: center;

					&:nth-child(2) {
						font-size: 24rpx;
						color: #999;
						margin-top: 80rpx;
					}

					&:nth-child(3) {
						font-size: 32rpx;
						color: #333;
						margin-top: 12rpx;
						font-weight: bold;
					}

					&:nth-child(4) {
						font-size: 26rpx;
						color: #ff6b6b;
						margin: 20rpx 0;

					}
				}

				.up-rate {
					display: flex;
					justify-content: center;
				}
			}
		}
	}
</style>
