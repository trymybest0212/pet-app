<template>
	<view class="product-detail">
		<swiper class="swiper" circular indicator-dots autoplay :interval="3000" :duration="1000">
			<swiper-item v-for="(item) in productImages" :key="item.id">
				<image :src="item.img_url" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!--商品信息-->
		<view class="product-info">
			<view class="price-box">
				<text class="price">￥{{productInfo?.price}}</text>
				<text class="original-price">￥{{productInfo?.o_price}}</text>
			</view>
			<view class="title">{{productInfo?.name}}</view>
			<view class="desc">{{productInfo?.desc}}</view>
		</view>
		<!--规格选择-->
		<view class="spec-section" @click="showSpecPopup">
			<text class="label">规格</text>
			<view class="selected-spec">
				<text>{{specInfo.selectedSpecText || "请选择规格"}}</text>
				<up-icon name="arrow-right" size="20" color="#999"></up-icon>
			</view>
		</view>
		<!--商品详情-->
		<view class="detail-section">
			<view class="section-title">商品详情</view>
			<view class="detail-content">
				<image v-for="item in productImages" :key="item.id" mode="widthFix" class="detail-image"
					:src="item.img_url"></image>
			</view>
		</view>
		<!--底部操作区域-->
		<view class="bottom-bar">
			<view class="left-btns">
				<view class="icon-btn" @click="goHome">
					<up-icon name="home" size="40" color="#666"></up-icon>
					<text>首页</text>
				</view>
				<view class="icon-btn" @click="goCart">
					<up-icon name="shopping-cart" size="40" color="#666"></up-icon>
					<text>购物车</text>
				</view>
			</view>
			<view class="right-btns">
				<view class="cart-btn" @click="addCart">加入购物车</view>
				<view class="buy-btn" @click="buyNow">立即购买</view>
			</view>
		</view>
		<ProductSpec :show="show" :product="productInfo" @close="handleClose" :showOk="true"
			@confirm="handleConfirm"></ProductSpec>
	</view>
</template>

<script setup lang="ts">
	import { onLoad,onShow } from "@dcloudio/uni-app"
	import { ref } from 'vue'
	import { IProductItem } from "../../pages/selectd/type";
	import { IProductImage } from './type'
	import { get,post } from '../../http/index'
	import ProductSpec from '../../components/product-spec/product-spec.vue'
	const productInfo = ref<IProductItem>()
	onLoad((options) => {
		productInfo.value = JSON.parse(options.product)
		getImages();
	})
	const productImages = ref<IProductImage[]>([])
	const getImages = async () => {
		try {
			const res : any = await get("/sel/detail", { id: productInfo.value.id })
			productImages.value = res
			console.log(productImages.value,'111')
		} catch (error) {
			console.error("失败")
		}
	}
	const show = ref<boolean>(false)
	const showSpecPopup = () => {
		show.value = true
	}
	const handleClose = () => {
		show.value = false
	}
	const specInfo = ref({} as any)
	const handleConfirm = (data) => {
		specInfo.value = data
	}
	const addCart=async ()=>{
		if(specInfo.value?.quantity){
			try {
				const res=await post("/cart/addCart",{
					product_id:productInfo.value.id,
					name:productInfo.value.name,
					price:productInfo.value.price,
					count:specInfo.value.quantity,
					spec:specInfo.value.selectedSpecText,
					main_pic:productInfo.value.main_pic
				})
				uni.showToast({
					title:"加购成功",
					icon:"success"
				})
				handleClose()
			} catch (error) {
				//TODO handle the exception
				console.error(error)
			}
		}else{
			showSpecPopup()
		}
	}
	const goHome = () => {
		uni.switchTab({
			url: "/pages/index/index"
		})
	}
	const goCart = () => {

		const token = uni.getStorageSync("token");
		if (!token) {
			uni.navigateTo({
				url: "/pages/login/login"
			})
			return
		}
		uni.navigateTo({
			url: "/pages/cart/cart"
		})
	}
</script>

<style lang="scss" scoped>
	.product-detail {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 120rpx;

		.swiper {
			width: 100%;
			height: 750rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.product-info {
			background-color: #fff;
			padding: 30rpx;
			margin-bottom: 20rpx;

			.price-box {
				margin-bottom: 20rpx;

				.price {
					color: #ff6b81;
					font-size: 40rpx;
					font-weight: bold;
					margin-right: 20rpx;
				}

				.original-price {
					color: #999;
					font-size: 28rpx;
					text-decoration: line-through;
				}
			}

			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 16rpx;
			}

			.desc {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
			}
		}

		.spec-section {
			display: flex;
			align-items: center;
			background-color: #fff;
			padding: 30rpx;
			margin-bottom: 20rpx;
			justify-content: space-between;

			.label {
				font-size: 28rpx;
				color: #333;
			}

			.selected-spec {
				display: flex;
				align-items: center;
				color: #666;
				font-size: 28rpx;

				text {
					margin-right: 10rpx;
				}
			}
		}

		.detail-section {
			background-color: #fff;
			padding: 30rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 30rpx;
			}

			.detail-content {
				padding: 20rpx;

				.detail-image {
					width: 100%;
					margin-bottom: 20rpx;
					border-radius: 12rpx;
				}
			}
		}

		.bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 60rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			padding: 30rpx;
			box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

			.left-btns {
				display: flex;
				margin-right: 30rpx;

				.icon-btn {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-right: 30rpx;

					text {
						font-size: 24rpx;
						color: #666;
						margin-top: 4rpx;
					}
				}
			}

			.right-btns {
				display: flex;
				flex: 1;

				.cart-btn,
				.buy-btn {
					flex: 1;
					height: 80rpx;
					border-radius: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					font-weight: bold;
				}

				.cart-btn {
					background-color: #fff8e6;
					color: #ffce2c;
					margin-right: 20rpx;
				}

				.buy-btn {
					background-color: #ffce2c;
					color: #fff;
				}
			}
		}

	}
</style>
