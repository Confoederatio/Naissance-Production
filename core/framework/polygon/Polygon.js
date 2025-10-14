global.Polygon = class extends ve.Class {
	constructor (arg0_options) {
		//Convert from parameters
		super();
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.name === undefined) options.name = "New Polygon";
		this.options = options;
		
		//Declare local instance variables
		this.layer = main.layers.geometry; //Reference - [WIP] - Move all geometries to a singular geometry_layer
		
		this.geometry = undefined;
		this.symbol = {
			lineColor:(this.options.line_colour) ? 
				Colour.convertRGBToHex(this.options.line_colour) : "#000000",
			lineWidth: Math.returnSafeNumber(this.options.line_width, 2),
			polygonFill: (this.options.colour) ?
				Colour.convertRGBToHex(this.options.colour) : "#1bbc9b",
			polygonOpacity: Math.returnSafeNumber(this.options.opacity, 0.4)
		};
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
					this.geometry.remove();
					this.geometry = undefined;
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
	
	update () {
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
		
		this.layer.addGeometry(this.geometry);
		
		//Update bindings
		
		//Update symbol
		this.symbol.polygonFill = Colour.convertRGBToHex(brush_interface_obj.colour.v);
		this.symbol.polygonOpacity = brush_interface_obj.opacity.v;
		this.geometry.setSymbol(this.symbol);
	}
};