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
		this.class_name = "GeometryPolygon";
		
		//Declare UI
		this.interface = veInterface({
			information: veHTML(() => `ID: ${this.id}`, { x: 0, y: 0 }),
			move_to_brush: veButton(() => DALS.Timeline.parseAction({
				options: { name: "Select Geometry" },
				value: [{ type: "Brush", selected_geometry_id: this.id }]
			}), { name: "Move To Brush", x: 0, y: 1 }),
			selected: veCheckbox(this.selected, {
				onuserchange: (v) => this.selected = v,
				x: 1, y: 1
			}),
		}, { is_folder: false });
		this.keyframes_ui = veInterface({}, {
			name: "Keyframes", open: true
		});
		
		//Add keyframe with default brush symbol upon instantiation
		let brush_symbol = main.brush.getBrushSymbol();
		if (brush_symbol)
			this.addKeyframe(main.date, undefined, brush_symbol);
		
		//KEEP AT BOTTOM!
		this.updateOwner();
	}
	
	get selected () {
		//Declare local instance variables
		let is_selected;
		
		//Fetch is_selected
		if (main.brush && main.brush.selected_geometry && main.brush.selected_geometry.id === this.id) {
			is_selected = true;
		} else {
			is_selected = this._selected;
		}
		if (this.interface && this.interface.selected)
			this.interface.selected.v = is_selected;
		
		//Return statement
		return is_selected;
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
		//if (coords !== undefined) coords = coords;
		this.history.addKeyframe(date, coords, symbol, data);
		this.draw();
	}
	
	draw () {
		//Declare local instance variables
		let derender_geometry = false;
		
		//1. Set this.value from current relative keyframe
		this.value = this.history.getKeyframe({ date: main.date }).value;
		if (this.value === undefined || this.value.length === 0) derender_geometry = true;
			
		//2. Draw this.geometry, this.label from this.value onto map
		if (this.value && this.value[0] === null) derender_geometry = true; //Coords are null, derender geometry
		try {
			//console.log(`naissance.GeometryPolygon, render keyframe:`, this.value);
			if (this.geometry) this.geometry.remove();
			if (this.value[0]) {
				this.geometry = maptalks.Geometry.fromJSON(this.value[0]);
				if (this.value[1] && this.geometry) this.geometry.setSymbol(this.value[1]);
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
			
			if (this.geometry && this.selected) {
				this.selected_geometry = this.geometry.copy();
				this.selected_geometry.setSymbol({
					lineColor: `rgb(255, 255, 0)`,
					lineDasharray : (main.brush.selected_geometry.id !== this.id) ? [10, 10, 10] : undefined,
					lineOpacity: 0.5,
					lineWidth: 4,
				});
				main.layers.selection_layer.addGeometry(this.selected_geometry);
			}
		} catch (e) { console.error(e); }
		
		//4. Add bindings
		if (this.geometry) {
			this.keyframes_ui.v = this.history.interface.v;
			this.geometry.addEventListener("click", (e) => {
				super.open("instance", { name: "Polygon", width: "20rem" });
			});
		}
		
		//5. Derender geometry handler
		if (derender_geometry) {
			if (this.geometry) this.geometry.remove();
			if (this.label) this.label.remove();
			if (this.selected_geometry) this.selected_geometry.remove();
		}
	}
	
	drawHierarchyDatatype () {
		//Return statement
		return new ve.HierarchyDatatype({
			icon: new veHTML(`<icon>pentagon</icon>`, {
				style: { padding: 0 }, tooltip: "GeometryPolygon"
			})
		},  {
			name: this.name,
			name_options: {
				onprogramchange: () => {
					this.drawHierarchyDatatype();
				},
				onuserchange: (v) => {
					this.name = v;
				}
			}
		});
	}
	
	removeKeyframe (arg0_date) {
		//Convert from parameters
		let date = (arg0_date) ? arg0_date : main.date;
		
		//Remove keyframe and update value
		this.history.removeKeyframe(date);
		this.draw();
	}
	
	/**
	 * Parses a JSON action for a target polygon.
	 * - Static method of: {@link naissance.GeometryPolygon}
	 * 
	 * `arg0_json`: {@link Object|string}
	 * - `.geometry_id`: {@link string} - Identifier. The {@link naissance.Geometry ID} to target changes for.
	 * - 
	 * - `.add_to_polygon`: {@link Object}
	 *   - `.geometry`: {@link string}
	 * - `.create_polygon`: {@link Object}
	 *   - `.id`: {@link string}
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
		//Convert from parameters
		let json = (typeof arg0_json === "string") ? JSON.parse(arg0_json) : arg0_json;
		
		//Declare local instance variables
		let polygon_obj = naissance.Geometry.instances.filter((v) => v.id === json.geometry_id)[0];
		
		//Parse extraneous commands
		//create_polygon
		if (json.create_polygon)
			if (json.create_polygon.id) {
				let new_polygon = new naissance.GeometryPolygon();
				new_polygon.id = json.create_polygon.id;
			}
		
		//Parse commands for polygon_obj
		if (polygon_obj) {
			//add_to_polygon
			if (json.add_to_polygon) {
				let geometry = polygon_obj.geometry;
				let ot_geometry = maptalks.Geometry.fromJSON(json.add_to_polygon.geometry);
				
				//Union with existing geometry if defined, if undefined replace geometry
				if (polygon_obj.geometry) {
					geometry = Geospatiale.convertMaptalksToTurf(geometry);
					ot_geometry = Geospatiale.convertMaptalksToTurf(ot_geometry);
					polygon_obj.addKeyframe(main.date, Geospatiale.convertTurfToMaptalks(
						turf.union(turf.featureCollection([geometry, ot_geometry]))
					).toJSON());
				} else {
					polygon_obj.addKeyframe(main.date, ot_geometry.toJSON());
				}
			}
			
			//remove_from_polygon
			if (json.remove_from_polygon) {
				let geometry = polygon_obj.geometry;
				let ot_geometry = maptalks.Geometry.fromJSON(json.remove_from_polygon.geometry);
				
				//Difference with existing geometry, if return value is null replace geometry
				if (polygon_obj.geometry) {
					let turf_difference = turf.difference(turf.featureCollection([
						Geospatiale.convertMaptalksToTurf(geometry),
						Geospatiale.convertMaptalksToTurf(ot_geometry)
					]));
					polygon_obj.addKeyframe(main.date, (turf_difference) ? 
						Geospatiale.convertTurfToMaptalks(turf_difference).toJSON() : null);
				}
			}
			
			//set_symbol
			if (json.set_symbol) {
				polygon_obj.addKeyframe(main.date, undefined, json.set_symbol);
			} else if (json.set_symbol === null) { //[WIP] - Implement clear symbol ability later
				
			}
			
			//set_data
			if (json.set_data) {
				polygon_obj.addKeyframe(main.date, undefined, undefined, json.set_data);
			} else if (json.set_data === null) { //[WIP] - Implement clear data ability later
				
			}
		}
	}
};