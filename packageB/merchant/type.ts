export interface MerchantListParams {
	keyword : string;
	merchantName : string;
	sortBy : "rating" | "rating_asc" | ""
}

export interface IFilterItem {
	name : string,
	key : string,
	columns : any[]
}
