<template>
	<view class="custom-dropdown">
		<view class="dropdown-header">
			<view class="dropdown-item" @click="changeSort">
				<!-- 	<text
					class="dropdown-text">{{(!sortText || sortText === '默认') ? props.filterItem.name :`${props.filterItem.name}:${sortText}` }}
					</text> -->
				<text class="dropdown-text">{{props.filterItem.name }}
				</text>
				<up-icon name="arrow-down" size="16" color="#999"></up-icon>
			</view>
		</view>
		<up-picker :show="show" :columns="props.filterItem.columns" @cancel="close" @confirm="confirm"></up-picker>
	</view>

</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { IFilterItem } from '../type';
	const props = defineProps<{ filterItem : IFilterItem }>()
	const emit = defineEmits(['sort'])
	const show = ref(false)
	const changeSort = () => {
		show.value = true
	}
	const close = () => {
		show.value = false
	}

	const sortText = ref('')
	const confirm = (e) => {
		sortText.value = e.value[0]
		let res = ''
		if (e.value[0] === "默认") {
			res = ""
		} else if (e.value[0] === "由高到低") {
			res = "rating"
		} else if (e.value[0] === "由低到高") {
			res = "rating_asc"
		}

		close()
		emit('sort', { key: props.filterItem.key, res })
	}
</script>

<style lang="scss" scoped>
	.custom-dropdown {
		background-color: #fff;


		.dropdown-header {
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #f0f0f0;
		}

		.dropdown-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 30rpx 20rpx;

			.dropdown-text {
				font-size: 28rpx;
				color: #333;
				margin-right: 10rpx;
			}
		}

	}
</style>
