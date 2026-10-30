export interface ICategoryItem {
	id : number;
	category_name : string
}
export interface IProductItem{
	id:number;
	name:string;
	price:string;
	o_price:string;
	stock:number;
	category_id:number;
	main_pic:string;
	desc:string
}
