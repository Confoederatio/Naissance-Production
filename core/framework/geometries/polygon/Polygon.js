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
			information: new ve.HTML((e) => `ID: ${this.id}`),
			edit_nodes: new ve.Checkbox(false, {
				name: "Edit Nodes",
				onchange: (e) => {
					this.edit_nodes = e.v;
				}
			}),
			selected: new ve.Checkbox(false, { 
				name: "Select Symbol",
				onchange: (e) => {
					this.selected = e.v;
					if (this.is_geometry_selected && e.v === false)
						main.brush.selectPolygon();
				}
			}),
			log_polygon: new ve.Button((e) => {
				console.log(this);
			}, { name: "Log Polygon" }),
			
			keyframes: new ve.Interface({
			}, {
				name: "Keyframes", 
				width: 99
			})
		}, { name: "Polygon", open: true })
		
		//Declare local instance variables
		this.id = Class.generateRandomID(Polygon);
		this.is_editing_nodes = false;
		this.history = {};
		this.layer = main.layers.geometry; //Reference - [WIP] - Move all geometries to a singular geometry_layer
		this.selected_geometry = undefined;
		
		this.geometry = undefined;
		this.symbol = {
			lineColor:(this.options.line_colour) ? 
				Colour.convertRGBToHex(this.options.line_colour) : "#000000",
			lineWidth: Math.returnSafeNumber(this.options.line_width, 2),
			polygonFill: (this.options.colour) ?
				Colour.convertRGBToHex(this.options.colour) : "#1bbc9b",
			polygonOpacity: Math.returnSafeNumber(this.options.opacity, 0.4)
		};
		Polygon.instances.push(this);	
	}
	
	set edit_nodes (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Declare local instance variables
		if (this.geometry)
			if (value === true) {
				this.geometry.startEdit();
			} else {
				this.geometry.endEdit();
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
	
	//Coords/symbol; keyframe functions
	
	/**
	 * Adds a keyframe at the given date.
	 * 
	 * @param arg0_geometry
	 * @param {Object} [arg1_options]
	 *  @param {Date} [arg1_options.date=main.date]
	 *  @param {Object} [arg1_options.geometry]
	 *  @param {Object} [arg1_options.properties]
	 *  @param {Object} [arg1_options.symbol]
	 *  
	 * @returns {PolygonKeyframe}
	 */
	addKeyframe (arg0_geometry, arg1_options) { 
		//Convert from parameters
		let geometry = arg0_geometry;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		if (options.date === undefined) options.date = main.date;
		
		//Declare local instance variables
		let timestamp = Date.getTimestamp(options.date);
		
		//Create a new keyframe, otherwise concatenate with existing options if history is already defined
		if (this.history[timestamp] === undefined) {
			this.history[timestamp] = new PolygonKeyframe(options.date, {
				geometry: geometry,
				...options
			});
		} else {
			this.history[timestamp].setOptions(options);
		}
		
		//Return statement
		return this.history[timestamp];
	}
	
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
	
	/**
	 * Fetches the keyframe at the selected date.
	 * 
	 * @param {Object} [arg0_options]
	 *  @param {boolean} [arg0_options.absolute_keyframe=false] - Whether to fetch the absolute keyframe instead of the relative keyframe as concatenated.
	 *  @param {Object} [arg0_options.date=main.date] - The date at which to fetch the keyframe. User-selected date by default.
	 *  
	 * @returns {{geometry: Object, properties: Object, symbol: Object}}
	 */
	getKeyframe (arg0_options) { //[WIP] - Finish function body
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.date === undefined) options.date = main.date;
		
		//Declare local instance variables
		let current_keyframe = {
			geometry: {},
			properties: {},
			symbol: {}
		};
		let timestamp = Date.getTimestamp(options.date);
		
		//Iterate over all keyframes in this.history
		Object.iterate(this.history, (local_key, local_value) => {
			local_value = local_value.options;
			
			if (Math.numerise(local_key) <= Math.numerise(timestamp))
				if (!options.absolute_keyframe) {
					if (local_value.geometry)
						current_keyframe.geometry = local_value.geometry;
					if (local_value.properties)
						current_keyframe.properties = {
							...current_keyframe.properties,
							...local_value.properties
						};
					if (local_value.symbol)
						current_keyframe.symbol = {
							...current_keyframe.symbol,
							...local_value.symbol
						};
				} else {
					current_keyframe = local_value;
				}
		});
		
		//Return statement
		return current_keyframe;
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
					this.setGeometry(undefined);
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
	
	remove () { //[WIP] - Refactor to handle keyframes
		//Iterate over all instances
		for (let i = 0; i < Polygon.instances.length; i++)
			if (Polygon.instances[i].id === this.id) {
				this.setGeometry(undefined);
				Polygon.instances.splice(i, 1);
			}
	}
	
	/**
	 * Deletes a keyframe at the given date.
	 *
	 * @param {Object} [arg0_options]
	 *  @param {Date} [arg0_options.date=main.date]
	 */
	removeKeyframe (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.date === undefined) options.date = main.date;
		
		//Declare local instance variables
		let timestamp = Date.getTimestamp(options.date);
		
		//Remove keyframe if defined
		delete this.history[timestamp];
	}
	
	updateKeyframesUI () { //[WIP] - Finish function body
		//Declare local instance variables
	}
	
	//Present keyframe functions
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
		
		if (this.geometry) {
			this.addKeyframe(this.geometry.copy(), { date: options.date });
		} else {
			this.addKeyframe(undefined, { date: options.date });
		}
		this.updateSelection();
	}
	
	/**
	 * Updates the current Polygon for the present Date and redraws it.
	 */
	update (arg0_options) { //[WIP] - Refactor to load from relative keyframe
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let brush_interface_obj = main.brush.interface;
		let optimisation_obj = brush_interface_obj.optimisation;
		
		//Refresh geometry
		this.layer.removeGeometry(this.geometry);
		
		if (!optimisation_obj.simplify_applies_to_brush.v) {
			let turf_geometry = Geospatiale.convertMaptalksToTurf(this.geometry);
			let turf_simplified_geometry = turf.simplify(turf_geometry, {
				tolerance: optimisation_obj.simplify.v,
				highQuality: true
			});
			this.geometry = Geospatiale.convertTurfToMaptalks(turf_simplified_geometry);
		}
		this.setGeometry(this.geometry, options);
		
		//Update bindings
		this.geometry.addEventListener("click", (e) => {
			super.open("instance", {
				name: this.options.name
			});
		});
		
		//Update symbol
		this.geometry.setSymbol(this.symbol);
	}
	
	updateSelection () {
		//Declare local instance variables
		let remove_selection = false;
		
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
			selected_polygons[i].update();
		}
	}
};