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
		//Return statement
		return this._selected;
	}
	set selected (v) {
		//Set selected, then update draw
		this._selected = v;
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
		//Declare local instance variables
		let derender_geometry = false;
		
		//1. Set this.value from current relative keyframe
		this.value = this.history.getKeyframe({ date; main.date });
		if (this.value === undefined) derender_geometry = true;
			
		//2. Draw this.geometry, this.label from this.value onto map
		if (this.value && this.value[0] === null) derender_geometry = true; //Coords are null, derender geometry
		try {
			if (this.geometry) this.geometry.remove();
			if (this.value[0]) {
				this.geometry = maptalks.Geometry.fromJSON(this.value[0]);
				if (this.value[1]) this.geometry.setSymbol(this.value[1]);
				main.layers.entity_layer.addGeometry(this.geometry);
			}
			if (this.value[2]) { //[WIP] - Finish backend for label rendering
				//Fetch this.value[2].label_geometry, this.value[2].label_name, this.value[2].label_symbol
			}
		} catch (e) { console.error(e); }
		
		//3. Draw this.selected_geometry
		try {
			if (this.selected_geometry) this.selected_geometry.remove();
			this.selected_geometry = undefined;
			
			if (this._selected) {
				this.selected_geometry = this.geometry.copy();
				this.selected_geometry.setSymbol({
					lineColor: `rgb(255, 255, 0)`,
					lineDasharray : (!this.is_geometry_selected) ? [10, 10, 10] : undefined,
					lineWidth: 4,
					polygonOpacity: 1
				});
				main.layers.selection_layer.addGeometry(this.selected_geometry);
			}
		} catch (e) { console.error(e); }
		
		//4. Derender geometry handler
		if (derender_geometry) {
			if (this.geometry) this.geometry.remove();
			if (this.label) this.label.remove();
			if (this.selected_geometry) this.selected_geometry.remove();
		}
	}
	
	removeKeyframe (arg0_date) {
		//Convert from parameters
		let date = (arg0_date) ? arg0_date : main.date;
		
		//Remove keyframe and update value
		this.history.removeKeyframe(date);
		this.draw();
	}
	
	/**
	 * `arg0_json`: {@link Object|string}
	 * - `.add_to_polygon`: {@link Object}
	 *   - `.geometry`: {@link string}
	 * - `.remove_from_polygon`: {@link Object}
	 *   - `.geometry`: {@link string}
	 * - `.set_symbol`: {@link Object}
	 *   - `<symbol_key>`: {@link any}
	 * 
	 * - Associated data:
	 * - `.set_data`: {@link Object}
	 *   - `<data_key>`: {@link any}
	 */
	static parseAction (arg0_json) {
		//add_to_polygon
		//remove_from_polygon
		//set_symbol
		
		//set_data
	}
};