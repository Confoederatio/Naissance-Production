global.Polygon = class extends ve.Class {
	static instances = [];
	
	constructor (arg0_options) {
		//Convert from parameters
		super();
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.name === undefined) options.name = "New Polygon";
		this.options = options;
		
		//Declare local interface variables
		this.interface = new ve.Interface({
			information: new ve.HTML(() => `ID: ${this.id}`),
			edit_nodes: new ve.Checkbox(false, {
				name: "Edit Nodes",
				onchange: (v) => {
					this.edit_nodes = v;
				}
			}),
			selected: new ve.Checkbox(false, { 
				binding: "this.is_selected",
				name: "Select Symbol",
				onuserchange: (v) => {
					this.selected = v;
					if (this.is_geometry_selected && v === false)
						main.brush.selectPolygon();
				}
			}),
			log_polygon: new ve.Button((e) => {
				console.log(this);
				//let local_geometry = this.history.getKeyframe().geometry;
				//this.layer.addGeometry(local_geometry);
			}, { name: "Log Polygon" }),
			
			keyframes: new ve.Interface({
			}, {
				name: "Keyframes", 
				width: 99
			})
		}, { name: "Polygon", open: true });
		
		//Declare local instance variables
		this.history = new History();
		this.id = Class.generateRandomID(Polygon);
		this.is_editing_nodes = false;
		this.layer = main.layers.geometry; //Reference - [WIP] - Move all geometries to a singular geometry_layer
		this.selected_geometry = undefined;
		
		this.geometry = undefined;
		this.properties = {};
		this.symbol = {
			lineColor:(this.options.line_colour) ? 
				Colour.convertRGBToHex(this.options.line_colour) : "#000000",
			lineWidth: Math.returnSafeNumber(this.options.line_width, 2),
			polygonFill: (this.options.colour) ?
				Colour.convertRGBToHex(this.options.colour) : "#1bbc9b",
			polygonOpacity: Math.returnSafeNumber(this.options.opacity, 0.4)
		};
		Polygon.instances.push(this);
		this.updateOwner();
	}
	
	set edit_nodes (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Declare local instance variables
		if (this.geometry)
			if (value === true) {
				main.brush.disabled = true;
				this.geometry.startEdit();
				this.geometry.addEventListener("editrecord editstart", (e) => {
					console.log(e);
				});
			} else {
				main.brush.disabled = false;
				this.geometry.endEdit();
				this.geometry.removeEventListener("editrecord");
				this.update();
			}
	}
	
	get is_geometry_selected () {
		//Return statement
		return (
			main.brush.selected_geometry &&
			main.brush.selected_geometry.id === this.id &&
			main.brush.selected_geometry instanceof Polygon
		);
	}
	
	set selected (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Declare local instance variables
		this.is_selected = value;
		this.updateSelection();
	}
	
	//Brush functions
	
	addToPolygon (arg0_geometry) {
		//Convert from parameters
		let geometry = arg0_geometry;
		
		//Declare local instance variables
		let coords;
		
		//1. Initialise geometry if not already defined
		if (this.geometry === undefined) {
			if (geometry instanceof maptalks.Circle) {
				coords = geometry.getShell();
			} else {
				coords = geometry.getCoordinates();
			}
			
			if (coords) {
				this.geometry = new maptalks.Polygon(coords);
				this.layer.addGeometry(this.geometry);
				this.update();
			} else {
				console.error(`Polygon: coords has an invalid define:`, coords);
			}
			
			//Return statement
			return;
		}
		
		//2. Union with existing geometry if defined
		try {
			let ot_turf_geometry = Geospatiale.convertMaptalksToTurf(geometry);
			let turf_geometry = Geospatiale.convertMaptalksToTurf(this.geometry);
			
			//Replace this.geometry since we might be jumping between Polygon and MultiPolygon
			this.layer.removeGeometry(this.geometry);
			this.geometry = Geospatiale.convertTurfToMaptalks(
				turf.union(turf.featureCollection([turf_geometry, ot_turf_geometry]))
			);
			this.update();
		} catch (e) {
			console.error("Union failed:", e);
		}
	}
	
	removeFromPolygon (arg0_geometry) {
		//Convert from parameters
		let geometry = arg0_geometry;
		
		if (this.geometry === undefined) return; //Internal guard clause if geometry is already undefined
		
		//Difference with existing geometry if defined
		try {
			let ot_turf_geometry = Geospatiale.convertMaptalksToTurf(geometry);
			let turf_geometry = Geospatiale.convertMaptalksToTurf(this.geometry);
			
			let turf_difference = turf.difference(turf.featureCollection([turf_geometry, ot_turf_geometry]));
				if (turf_difference === null) { //Internal guard clause if turf_difference is null
					this.setGeometry(undefined, { is_brush: true });
					return;
				}
			
			//Replace this.geometry since we might be jumping between Polygon and MultiPolygon
			this.layer.removeGeometry(this.geometry);
			this.geometry = Geospatiale.convertTurfToMaptalks(turf_difference);
			this.update();
		} catch (e) {
			console.error("Difference failed:", e);
		}
	}
	
	remove () {
		//Iterate over all instances
		for (let i = 0; i < Polygon.instances.length; i++)
			if (Polygon.instances[i].id === this.id) {
				this.setGeometry(undefined);
				Polygon.instances.splice(i, 1);
			}
	}
	
	//Keyframing functions
	
	/**
	 * Loads the date of the Polygon in question by moving it to the keyframe at hand.
	 * @param arg0_date
	 */
	loadDate (arg0_date) {
		//Convert from parameters
		let date_obj = Date.convertTimestampToDate(arg0_date);
		
		//Declare local instance variables
		let hide_geometry = false;
		let keyframe_obj = this.history.getKeyframe({ date: date_obj });
		
		if (keyframe_obj) {
			//.geometry handling
			if (this.geometry) this.geometry.show();
			if (keyframe_obj.geometry) {
				this.setGeometry(keyframe_obj.geometry);
			} else if (keyframe_obj.geometry === false) { //Handle hidden geometries
				if (this.geometry) hide_geometry = true;
			}
			
			//.properties handling
			if (keyframe_obj.properties)
				this.setProperties(keyframe_obj.properties);
			
			//.symbol handling
			if (keyframe_obj.symbol)
				this.setSymbol(keyframe_obj.symbol);
		}	else {
			//Hide geometry for now
			if (this.geometry) hide_geometry = true;
		}
		
		//Hide geometry if applicable and deselect it
		if (hide_geometry) {
			this.geometry.hide();
			this.selected = false;
		}
	}
	
	setGeometry (arg0_geometry, arg1_options) {
		//Convert from parameters
		let geometry = arg0_geometry;
		let options = (arg1_options) ? arg1_options : {};
		
		//Set this.geometry, update .selected_geometry if applicable
		if (geometry !== undefined) {
			if (this.layer) {
				this.layer.removeGeometry(this.geometry);
				this.geometry = geometry;
				this.layer.addGeometry(this.geometry);
			}
		} else {
			if (this.geometry) {
				this.geometry.remove();
				this.geometry = undefined;
			}
		}
		
		if (options.is_brush)
			if (this.geometry) {
				this.history.addKeyframe(this.geometry.copy(), { date: options.date });
			} else {
				this.history.addKeyframe(false, { date: options.date });
			}
		this.updateBindings();
		this.updateSelection();
	}
	
	/**
	 * Concatenates, then sets {@link Polygon} properties after loading the current relative properties from keyframes. 
	 * @param {Object} arg0_properties_obj
	 * @param {Object} [arg1_options]
	 *  @param {boolean} [arg1_options.is_brush=false]
	 */
	setProperties (arg0_properties_obj, arg1_options) { //[WIP] - Finish function body
		
	}
	
	/**
	 * Concatenates, then sets {@link Polygon} symbol after loading the current relative symbol from keyframes.
	 * @param {Object} arg0_symbol_obj
	 * @param {Object} [arg1_options]
	 *  @param {boolean} [arg1_options.is_brush=false]
	 */
	setSymbol (arg0_symbol_obj, arg1_options) {
		//Convert from parameters
		let symbol_obj = (arg0_symbol_obj) ? arg0_symbol_obj : {};
		let options = (arg1_options) ? arg1_options : {};
		
		//Set geometry symbol
		if (options.is_brush)
			this.history.addKeyframe(undefined, {
				date: options.date,
				symbol: symbol_obj
			});
		
		//Update symbol
		this.symbol = {
			...this.symbol,
			...symbol_obj
		};
		if (this.geometry)
			this.geometry.setSymbol(this.symbol);
	}
	
	//Render update functions
	
	/**
	 * Updates the current Polygon upon a user brush action/change.
	 */
	update () {
		//Declare local instance variables
		let brush_interface_obj = main.brush;
		let optimisation_obj = brush_interface_obj.optimisation;
		
		//Refresh geometry
		this.layer.removeGeometry(this.geometry);
		
		if (!optimisation_obj.simplify_applies_to_brush.v && this.geometry) {
			let turf_geometry = Geospatiale.convertMaptalksToTurf(this.geometry);
			let turf_simplified_geometry = turf.simplify(turf_geometry, {
				tolerance: optimisation_obj.simplify.v,
				highQuality: true
			});
			this.geometry = Geospatiale.convertTurfToMaptalks(turf_simplified_geometry);
		}
		this.setGeometry(this.geometry, { is_brush: true });
		this.updateBindings();
		
		//Update symbol
		this.setSymbol(this.symbol);
	}
	
	updateBindings () {
		//Update bindings
		if (this.geometry)
			this.geometry.addEventListener("click", (e) => {
				super.open("instance", {
					name: this.options.name
				});
				this.interface.keyframes.v = this.history.interface.v;
			});
	}
	
	updateSelection (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let remove_selection = (options.remove_selection);
		
		//Handle this.is_selected
		if (this.is_selected === false) {
			remove_selection = true;
		} else {
			if (this.geometry) {
				main.brush.caret_layer.removeGeometry(this.selected_geometry);
				this.selected_geometry = this.geometry.copy();
				this.selected_geometry.setSymbol({
					lineColor: `rgb(255, 255, 0)`,
					lineDasharray : (!this.is_geometry_selected) ? [10, 10, 10] : undefined,
					lineWidth: 4,
					polygonOpacity: 1
				});
				main.brush.caret_layer.addGeometry(this.selected_geometry);
			} else {
				remove_selection = true;
			}
		}
		
		//Remove selection if applicable
		if (remove_selection)
			if (this.selected_geometry) {
				this.selected_geometry.remove();
				this.selected_geometry = undefined;
			}
		if (this.interface && this.interface.selected.v !== this.is_selected)
			this.interface.selected.v = this.is_selected;
	}
	
	//Class methods
	static getSelected () {
		//Declare local instance variables
		let selected_polygons = [];
		
		//Iterate over all Polygon.instances and return an array of selected Polygons
		for (let i = 0; i < Polygon.instances.length; i++)
			if (Polygon.instances[i].is_selected)
				selected_polygons.push(Polygon.instances[i]);
		
		//Return statement
		return selected_polygons;
	}
	
	static setSelectedSymbol (arg0_symbol) { //[WIP] - Refactor to use keyframes
		//Convert from parameters
		let symbol = (arg0_symbol) ? arg0_symbol : {};
		
		//Declare local instance variables
		let selected_polygons = Polygon.getSelected();
		
		//Iterate over all selected_polygons and set symbol before updating
		for (let i = 0; i < selected_polygons.length; i++) {
			selected_polygons[i].symbol = {
				...selected_polygons[i].symbol,
				...symbol
			};
			selected_polygons[i].history.addKeyframe(undefined, { symbol: symbol });
			selected_polygons[i].update();
		}
	}
};