<template>
	<view class="address-container">
		<view class="address-list" v-if="addressList.length">
			<view class="address-item" v-for="item in addressList" :key="item.id" @click="selectAddress(item)">
				<view class="address-info">
					<view class="contact-info">
						<text class="name">{{item.name}}</text>
						<text class="phone">{{item.phone}}</text>
						<text class="default-tag" v-if="item.is_default">默认</text>
					</view>
					<view class="address-detail">
						{{item.province}}{{item.city}}{{item.district}}{{item.detail}}
					</view>
				</view>
				<view class="address-actions">
					<view class="action-btn" @click.stop="editAddress(item)">
						<up-icon name="edit-pen" size="20" color="#666"></up-icon>
					</view>
					<view class="action-btn" @click.stop="deleteAddress(item.id)">
						<up-icon name="trash" size="20" color="#666"></up-icon>
					</view>
				</view>

			</view>
		</view>
		<view class="empty-state" v-else>
			<up-icon name="map" size="60" color="#ccc"></up-icon>
			<text class="empty-text">您还未添加收货地址哦~</text>
		</view>
		<view class="add-btn" @click="addAddress">
			<up-icon name="plus" size="20" color="#fff"></up-icon>
			<text>新增收货地址</text>
		</view>
		<AddressForm :isShow="isShow" :address="address" @close="handleClose" @updateList="handleUpdateList">
		</AddressForm>

	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		reactive
	} from "vue"
	import {
		get,
		post
	} from "../../http/index"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		IAddressItem,
		IAddressForm
	} from './type'
	import AddressForm from './components/addess-form.vue'
	const flag = ref()
	onLoad((options) => {
		getAddressList()
		flag.value = options.flag
	})
	const handleClose = () => {
		isShow.value = false
	}

	const addressList = ref<IAddressItem[]>([])
	const getAddressList = async () => {
		try {
			const result : any = await get("/cart/address");
			addressList.value = result
		} catch (error) {
			console.log(error)
		}
	}
	const isShow = ref(false)
	const address = ref({})
	const editAddress = (item : any) => {
		isShow.value = true
		address.value = item
	}
	const addAddress = () => {
		isShow.value = true
		address.value = {} as IAddressForm
	}
	const deleteAddress = (id : number) => {
		uni.showModal({
			title: "提示",
			content: "确认要删除这个地址吗？",
			success: async (res) => {
				if (res.confirm) {
					try {
						await post("/cart/deleteAddress", {
							id
						});
						uni.showToast({
							title: "删除成功",
							icon: "success"
						})
						getAddressList()
					} catch (error) {
						console.log(error)
					}
				}
			}
		})
	}
	const handleUpdateList = () => {
		getAddressList()
	}
	const selectAddress = (item : IAddressItem) => {
		if (flag.value) {
			uni.$emit("addressSelected", item) //触发由 uni.$on监听的全局自定义事件
			uni.navigateBack()
		}
	}
</script>

<style lang="scss" scoped>
	.address-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 120rpx;

		.address-list {
			.address-item {
				background-color: #fff;
				margin-bottom: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;

				.address-info {
					flex: 1;

					.contact-info {
						margin-bottom: 10rpx;

						.name {
							font-size: 32rpx;
							font-weight: bold;
							color: #333;
							margin-right: 20rpx;
						}

						.phone {
							font-size: 28rpx;
							color: #666;
							margin-right: 20rpx;
						}

						.default-tag {
							background-color: #ffce2c;
							color: #fff;
							font-size: 24rpx;
							padding: 4rpx 12rpx;
							border-radius: 6rpx;
						}
					}

					.address-detail {
						font-size: 28rpx;
						color: #666;
						line-height: 1.4;
					}
				}

				.address-actions {
					display: flex;

					.action-btn {
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background-color: #f5f5f5;
						border-radius: 50%;
						margin-right: 16rpx;
					}
				}
			}
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100rpx 0;

			.empty-text {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #999;
			}
		}

		.add-btn {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 120rpx;
			background-color: #ffce2c;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: bold;

			text {
				margin-left: 16rpx;
			}
		}

	}
</style>
