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
			
			let maptalks_union = Geospatiale.convertTurfToMaptalks(
				turf.union(turf.featureCollection([turf_geometry, ot_turf_geometry]))
			);
			
			//Replace this.geometry since we might be jumping between Polygon and MultiPolygon
			this.layer.removeGeometry(this.geometry);
			this.geometry = maptalks_union;
			this.layer.addGeometry(this.geometry);
			this.update();
		} catch (e) {
			console.error("Union failed:", e);
		}
	}
	
	removeFromPolygon (arg0_geometry) {
		//Convert from parameters
		
		//1. Remove feature if this.geometry is already undefined
		
		//2. Difference with existing geometry if defined
	}
	
	update () {
		//Update bindings
		
		//Update symbol
		this.geometry.setSymbol(this.symbol);
	}
};