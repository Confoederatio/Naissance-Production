global.HistoryKeyframe = class extends ve.Class {
	constructor (arg0_date, arg1_options) {
		//Convert from parameters
		super();
		let date = arg0_date;
		let options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		this.date = Date.convertTimestampToDate(date);
		this.options = {
			geometry: {},
			properties: {},
			symbol: {},
			...options
		}
		this.timestamp = Date.getTimestamp(date);
	}
	
	setOptions (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Set this.options
		if (options.geometry) this.options.geometry = options.geometry;
		if (options.properties) this.options.properties = {
			...this.options.properties,
			...options.properties
		};
		if (options.symbol) this.options.symbol = {
			...this.options.symbol,
			...options.symbol
		};
	}
};