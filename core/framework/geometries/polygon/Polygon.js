global.Polygon = class extends ve.Class {
	static instances = [];
	
	constructor (arg0_options) {
		//Convert from parameters
		super();
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.name === undefined) options.name = "New Polygon";
		this.options = options;
		
		//Declare local instance variables
		this.id = Class.generateRandomID(Polygon);
		this.is_selected = false;
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
	
	get selected () {
		//Return statement
		return this.is_selected;
	}
	
	set selected (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Declare local instance variables
		if (value === true) {
			this.is_selected = value;
		} else {
			this.is_selected = undefined;
		}
		this.setGeometry(this.geometry);
	}
	
	//Coords/symbol; keyframe functions
	
	/**
	 * Adds a keyframe at the given date.
	 * 
	 * @param arg0_geometry
	 * @param {Object} [arg1_options]
	 *  @param {Date} [arg1_options.date=main.date]
	 *  @param {Object} [arg1_options.properties]
	 *  @param {Object} [arg1_options.symbol]
	 */
	addKeyframe (arg0_geometry, arg1_options) {
		//Convert from parameters
		let geometry = arg0_geometry;
		let options = (arg1_options) ? arg1_options : {};
		
		//Concatenate with existing options if history is already defined
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
	
	removeKeyframe (arg0_options) {
		//Convert from parameters
	}
	
	//Present keyframe functions
	setGeometry (arg0_geometry, arg1_options) { //[WIP] - Refactor to use keyframes
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
			
			if (this.is_selected === true) {
				//Refresh this.selected_geometry
				main.brush.caret_layer.removeGeometry(this.selected_geometry);
				this.selected_geometry = geometry.copy();
				main.brush.caret_layer.addGeometry(this.selected_geometry);
				
				//Add this.selected_geometry
				let is_geometry_selected = (
					main.brush.selected_geometry && 
					main.brush.selected_geometry.id === this.id &&
					main.brush.selected_geometry instanceof Polygon
				);
				if (options.remove_geometry_selection)
					is_geometry_selected = false;
				
				this.selected_geometry.setSymbol({
					lineColor: `rgb(255, 255, 0)`,
					lineDasharray : (!is_geometry_selected) ? [10, 10, 10] : undefined,
					lineWidth: 4,
					polygonOpacity: 1
				});
			}
		} else {
			if (this.geometry) {
				this.geometry.remove();
				this.geometry = undefined;
			}
			if (this.selected_geometry) {
				this.selected_geometry.remove();
				this.selected_geometry = undefined;
			}
		}
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
		
		//Update symbol
		this.geometry.setSymbol(this.symbol);
		this.geometry.addEventListener("click", (e) => {
			super.open("instance", { name: "Test" });
		});
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