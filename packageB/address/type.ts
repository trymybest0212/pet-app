export interface IAddressItem{
	city:string;
	detail:string;
	district:string;
	id:number;
	is_default:1|0;
	name:string;
	phone:string;
	province:string;
	user_id?:number
}

export interface IAddressForm{
	name:string;
	phone:string;
	region:string[];
	detail:string;
	is_default:1|0
}
