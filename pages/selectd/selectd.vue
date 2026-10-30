<template>
	<view class="selected-container">
		<view class="header">
			<view class="nav-content">
				<uni-search-bar radius="100" placeholder="猫粮狗粮、宠物零食" clearButton="none" cancelButton="none"
					style="width: 100%;">
				</uni-search-bar>
			</view>
		</view>
		<view class="content">
			<view class="category-section">
				<!--左侧分类-->
				<scroll-view class="category-left" scroll-y>
					<view v-for="(item,index) in categories" :key="item.id" class="category-item"
						:class="{active:currentCategory===item.id}" @click="swtichCategory(index,item.id)">
						{{item.category_name}}
					</view>
				</scroll-view>
			</view>
			<ShopList :title="shopTitle" :products="products"></ShopList>
		</view>
		<view class="float-cart">
			<up-icon name="shopping-cart" color="#ffce2c" size="80rpx"></up-icon>
			<view class="cart-badge" v-if="cartCount>0">{{cartCount}}</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { ICategoryItem, IProductItem } from './type'
	import {
		get
	} from '../../http/index.js'
	import {
		onLoad,
		onReachBottom

	} from "@dcloudio/uni-app"

	import ShopList from './components/shop-list.vue'

	onLoad(() => {
		getCategories()
	})
	const shopTitle = computed(() => {

		return categories.value?.[currentIndex.value]?.category_name || '暂无数据'
	})

	const currentCategory = ref<number>(0)
	const currentIndex = ref(0)
	const categories = ref<ICategoryItem[]>([])
	const getCategories = async () => {
		try {
			const data : any = await get("/sel/tag");
			categories.value = data.tag;
			swtichCategory(0, categories.value[0].id)
		} catch (error) {
			console.error("获取失败")
		}
	}
	const products = ref<IProductItem[]>([])
	const currentPage = ref<number>(1);
	const totalPages = ref<number>(0)
	const getProducts = async (page : number, category_id : number) => {
		try {
			const data : any = await get("/sel/products", { page, category_id })
			if (page == 1) {
				products.value = data.list;
			} else {
				products.value = [...products.value, ...data.list]
			}
			totalPages.value = data.pagination.totalPages
			currentPage.value = page
		} catch (error) {
			console.error(error)
		}
	}
	//设置高亮效果

	const swtichCategory = (index : number, category_id : number) => {
		currentCategory.value = category_id;
		currentPage.value = 1;
		products.value = []
		currentIndex.value = index
		getProducts(currentPage.value, category_id)
	}

	const cartCount = ref(0)
</script>

<style lang="scss" scoped>
	.selected-container {
		background-color: #f7f7f7;

		.header {
			background-color: $uni-color-primary;
			width: 100%;

			.nav-content {
				height: 88rpx;
				display: flex;
				align-items: center;
				padding: 30rpx 50rpx;
			}
		}

		.content {
			display: flex;

			.category-section {
				background-color: #fff;
				border-radius: 16rpx;
				height: calc(100vh - 150rpx);
				display: flex;

				.category-left {
					width: 180rpx;
					height: 100%;
					background-color: #f7f7f7;

					.category-item {
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						font-size: 28rpx;
						color: $uni-text-color;
						border-bottom: 1px solid #eee;
						position: relative;

						&.active {
							background-color: #fff;
							color: $uni-color-primary;
							font-weight: bold;

							&::before {
								content: "";
								position: absolute;
								width: 6rpx;
								height: 36rpx;
								left: 0;
								top: 50%;
								transform: translateY(-50%);
								background-color: $uni-color-primary ;
								border-radius: 0 4rpx 4rpx 0;
							}

						}
					}
				}


			}
		}

		.float-cart {
			position: fixed;
			right: 30rpx;
			bottom: 100rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background-color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
			z-index: 999;

			.cart-badge {
				position: absolute;
				top: -6rpx;
				right: -6rpx;
				background-color: #ff4d4f;
				color: #fff;
				font-size: 24rpx;
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
				line-height: 36rpx;
				text-align: center;
				padding: 6rpx;
			}
		}
	}
</style>
