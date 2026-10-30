import { RequestConfig } from "./type";

const getToken = () => uni.getStorageSync("token") || ""


export const requestInterceptor = (config : RequestConfig) => {
	const token = getToken()
	if (token) {
		config.header = {
			...config.header,
			Authorization: `Bearer ${token}`
		}
	}
	return config

}
export const transformResponse = (res : any) => {
	if (res.statusCode !== 200) {
		uni.showToast({
			title: res.data.message,
			icon: "none"
		})
		return
	}
	if (!res.data.success) {
		uni.showToast({
			title: res.data.message,
			icon: "none"
		})
	}
	return res.data.data

}
