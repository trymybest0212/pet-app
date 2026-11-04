<template>
	<up-popup :show="props.isShow" closeable class="wrap" @close="closePopup">
		<view class="address-form">
			<view class="form-title">{{isEdit?"编辑地址":"新增地址"}}</view>
			<uni-forms :modelValue="formData" :label-width="110" ref="formRef" :rules="rules" validate-trigger="submit">
				<uni-forms-item label="收货人" name="name">
					<input type="text" v-model="formData.name" placeholder="请输入收货人姓名" />
				</uni-forms-item>
				<uni-forms-item label="手机号" name="phone">
					<input type="text" v-model="formData.phone" placeholder="请输入手机号" />
				</uni-forms-item>
				<uni-forms-item name="region" label="所在地区">
					<view class="region-display" @click="showRegionPicker">
						<text v-if="formData.region.length">{{formData.region.join(" ")}}</text>
						<text v-else>请选择所在地区</text>
						<up-icon name="arrow-right" size="16" color="#999" class="right"></up-icon>
					</view>
				</uni-forms-item>
				<uni-forms-item label="详细地址" name="detail">
					<textarea v-model="formData.detail" placeholder="请输入详细地址" class="textarea" />
				</uni-forms-item>
				<uni-forms-item label="设为默认地址" name="is_default">
					<switch :checked="formData.is_default" color="#ffce2c" @change="onDefaultChange"></switch>
				</uni-forms-item>
			</uni-forms>
			<view class="form-actions">
				<view class="cancel-btn" @click="closePopup">取消</view>
				<view class="save-btn" @click="saveAddress">保存</view>
			</view>
		</view>
		<up-picker :show="showRegion" ref="uPickerRef" :columns="columns" @confirm="confirm" @change="changeHandler"
			@cancel="cancel"></up-picker>
	</up-popup>
</template>

<script lang="ts" setup>
	import { computed, reactive, ref, watch } from 'vue'
	import { IAddressForm, IAddressItem } from '../type'
	import { district, provice, city, rules } from '../const'
	import { post } from '../../../http/index'
	const props = defineProps<{ isShow : boolean, address : IAddressItem }>()
	const emit = defineEmits(['updateList', 'close'])
	const isEdit = computed(() => {
		return Object.keys(props.address).length
	})
	const formRef = ref(null)
	const formData = ref<IAddressForm>({
		name: "",
		phone: "",
		region: [],
		detail: "",
		is_default: 0
	})
	watch(()=>props.isShow,()=>{
		if(props.isShow && isEdit.value) {
			Object.keys(formData.value).forEach((item) => {
				if(item === 'region') {
				const addressStr =	props.address.province + props.address.city + props.address.district
				 formData.value.region = addressStr.split(',')
				}else {
					formData.value[item] = props.address[item]
				}

			})
		}
	})
	const uPickerRef = ref(null)
	const showRegion = ref(false)
	const showRegionPicker = () => {
		showRegion.value = true
	}
	const cancel = () => {
		showRegion.value = false
		// formData.value.region = []
	}
	const confirm = (e) => {
		showRegion.value = false;
		formData.value.region = e.value
	};
	const districtData = reactive(district)
	const columns = reactive(provice)
	const columnData = reactive(city)
	const changeHandler = (e) => {
		const {
			columnIndex, //操作的那一列的序号 第一列是0
			value,	//每一列所选的数据，结果是个数组
			values,//所有列数据
			index, //当前所操作列所选中数据的角标
		} = e;
		if (columnIndex === 0) {
			uPickerRef.value.setColumnValues(1, columnData[index]);//要修改列的序号，要更新的数据数组
			//更新区域数据  如何查找城市在对应区域数组中的角标/索引
			const cityIndex = getCityIndex(index, 0);
			uPickerRef.value.setColumnValues(2, districtData[cityIndex])
		} else if (columnIndex === 1) {
			const provinceIndex = columns[0].indexOf(value[0])
			const cityIndex = getCityIndex(provinceIndex, index)
			uPickerRef.value.setColumnValues(2, districtData[cityIndex])
		}
	};
	//用来获取城市在对应的区域数组中的角标
	// 所选省份，前面的省份城市总和即我所选的省份的第一个城市的角标
	// 得到省份城市总和 + 所选城市当前的角标 即为当前区域对应的角标
	const getCityIndex = (provinceIndex : number, cityIndex : number) => {
		const cityCountPerProvince = columnData.map(item => item.length) //[4,1,3,3] 获取每个省份对应的城市数量
		let total = 0 //用来存前面一共多少城市
		for (let i = 0; i < provinceIndex; i++) {
			total += cityCountPerProvince[i]
		}
		return total + cityIndex

	}
	const onDefaultChange = (e) => {
		formData.value.is_default = e.detail.value ? 1 : 0
	}
	const closePopup = () => {
		emit('close')
		resetForm()
	}
	const resetForm = () => {
		formData.value.name = ""
		formData.value.phone = ""
		formData.value.region = []
		formData.value.detail = ""
		formData.value.is_default = 0
	}
	const saveAddress = async () => {
		try {
			const data = await formRef.value.validate()

			const newAddress : IAddressItem = {
				...data,
				id: isEdit.value ? props.address.id : null,
				province: data.region[0],
				city: data.region[1],
				district: data.region[2],
				detail: data.detail,
				is_default: data.is_default
			}
			try {
				await post("/cart/addOrUpdate", newAddress);
				uni.showToast({
					title: isEdit.value ? "编辑成功" : "新增成功"
				})
				emit('updateList')
				closePopup()
			} catch (error) {
				console.log(error)
			}
		} catch (error) {
			//TODO handle the exception
		}
	}
</script>

<style lang="scss" scoped>
	.address-form {

		.form-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			text-align: center;
			margin-bottom: 40rpx;
			margin-top: 20rpx;
		}

		.region-display {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			color: #333;

			text {
				color: #666
			}

			.right {
				margin-right: 20rpx;
			}
		}

		.textarea {
			height: 120rpx;
			font-size: 28rpx;
			color: #333;
		}

		.form-actions {
			display: flex;
			margin-top: 40rpx;

			.cancel-btn,
			.save-btn {
				flex: 1;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				font-weight: bold;
				border-radius: 40rpx;
				margin-right: 16rpx;
			}

			.cancel-btn {
				background-color: #f5f5f5;
				color: #666;
			}

			.save-btn {
				background-color: #ffce2c;
				color: #fff;
			}
		}
	}
</style>
