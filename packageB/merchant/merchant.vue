<template>
	<view class="merchat-container">
		<view class="search-header">
			<up-search placeholder="搜索商家" v-model="params.merchantName" @search="handleSearch" @custom="handleSearch"
				:clearabled="false"></up-search>
		</view>
		<view class="merchant">
			<MerchantFilter class="filter-item" v-for="item in filterOption" :key="item.key" :filterItem="item"
				@sort="handleSort">
			</MerchantFilter>
		</view>
		<view class="tabs">
			<up-tabs :list="serviceList" v-model:current="currentIndex" @click="handleSelect"></up-tabs>
		</view>
		<StoreList :merchan-list="merchanList"></StoreList>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { get } from '../../http/index'
	import { IMerchantItem } from '../../pages/index/type'
	import { MerchantListParams } from './type'
	import { list, filterOption } from './const'
	import MerchantFilter from './components/merchant-filter.vue'
	import StoreList from '../../pages/index/components/store-list.vue'

	onLoad((options) => {
		const index : number = serviceList.findIndex(item => options.keyword.includes(item.name));
		currentIndex.value = index === -1 ? 0 : index
		params.keyword = index === -1 ? "" : serviceList[index].name
		getMerchanList(1)
	})
	const params = reactive<MerchantListParams>({
		keyword: "",
		merchantName: "",
		sortBy: ""
	})
	const handleSearch = () => {
		// params.merchantName=searchWord.value;
		params.keyword = ""
		currentIndex.value = 0;
		getMerchanList(1)
	}
	const serviceList = reactive(list)
	const currentIndex = ref(0)
	const handleSelect = (item : any, index : number) => {
		params.merchantName = ""
		params.merchantName = ""
		if (index === 0) {
			params.keyword = ""
		} else {
			params.keyword = item.name
		}
		getMerchanList(1)
	}
	const merchanList = ref<IMerchantItem[]>([])
	const currentPage = ref<number>(1)
	const totalPages = ref<number>(0)
	const getMerchanList = async (page : number) => {
		try {
			const data : any = await get("/home/merchants", { page, ...params });
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
	const handleSort = (key : string, str : any) => {
		params.sortBy = str;
		getMerchanList(1)

	}
</script>

<style lang="scss" scoped>
	.merchat-container {
		min-height: 100vh;
		background-color: #f5f5f5;

		.search-header {
			background-color: #fff;
			padding: 30rpx;
		}

		.merchant {
			width: 100%;
			display: flex;

			.filter-item {
				flex: 1;
			}

		}

		.tabs {
			background-color: #fff;
			padding: 30rpx;
		}
	}
</style>
