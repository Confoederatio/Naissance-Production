if (!global.naissance) global.naissance = {};
/**
 * {@link naissance.HistoryKeyframe} data structure:
 * - [0]: arg0_coords:{@link Object}<{@link Array}<{@link float}, {@link float}>> - Contains the maptalks coordinates.
 * - [1]: arg1_symbol:{@link Object} - Contains the maptalks symbol.
 * - [2]: arg2_data:{@link Object}
 * 
 * @type {naissance.GeometryPolygon}
 */
naissance.GeometryPolygon = class extends naissance.Geometry {
	constructor () {
		super();
		
	}
	
	get selected () {
		
	}
	set selected (v) {
		this.draw();
	}
	
	addKeyframe (arg0_date, arg1_coords, arg2_symbol, arg3_data) {
		//Convert from parameters
		let date = (arg0_date) ? arg0_date : main.date;
		let coords = arg1_coords;
		let symbol = arg2_symbol;
		let data = arg3_data;
		
		//Declare local instance variables
		this.history.addKeyframe(date, coords, symbol, data);
		this.draw();
	}
	
	draw () {
		//1. Set this.value from current relative keyframe
		//2. Draw this.value on map
	}
	
	removeKeyframe (arg0_date) {
		//Convert from parameters
		let date = (arg0_date) ? arg0_date : main.date;
		
		//Remove keyframe and update value
		this.history.removeKeyframe(date);
		this.draw();
	}
	
	static parseAction (arg0_json) {
		
	}
};