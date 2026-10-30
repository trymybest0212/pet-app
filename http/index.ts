import { RequestConfig } from './type'
import { requestInterceptor, transformResponse } from "./interceptors"

const request = (config : RequestConfig) => {
	const processedConfig = requestInterceptor(config)
	const url = 'https://www.liuliuzhua.cn' + processedConfig.url
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: processedConfig.method || "GET",
			data: processedConfig.data,
			header: {
				...processedConfig.header,
				"x-order-no": "4500000534202610245629518441",
				"x-phone": "18728327730",
				"x-name": "wangjie"
			},
			success(res) {
				try {
					const data = transformResponse(res);
					resolve(data)
				} catch (error) {
					//TODO handle the exception
					reject(error)
				}
			},
			fail() {
				reject("请求失败")
			}
		})
	})
}
export const get=(url:string,data?:any)=>request({url,method:"GET",data})

export const post=(url:string,data?:any)=>request({url,method:"POST",data})
