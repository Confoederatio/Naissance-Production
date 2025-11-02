global.Brush = class extends ve.Class {
	constructor () {
		//Declare local instance variables
		super();
		this.caret_layer = new maptalks.VectorLayer("caret_layer", [], {
			//hitDetect: true,
			//interactive: true,
			zIndex: 98
		}).addTo(map);
		this.cursor_layer = new maptalks.VectorLayer("cursor_layer", [], {
			//hitDetect: true,
			//interactive: true,
			zIndex: 99
		}).addTo(map);
		this.properties = {
			radius: 50000,
			simplify: 0.05
		};
		this.selected_geometry = undefined;
		this.symbol = {};
		this.type = "polygon"; //Either 'none'/'polygon'/'line'/'point'
		
		//Declare local interface variables
		this.brush_options = new ve.Interface({
			//Row 0: Enable/Disable
			disabled: new ve.Toggle(false, {
				binding: "this.disabled",
				onchange: (v) => { //Bidirectionally bound to this.disabled, use .onprogramchange/.onuserchange otherwise
					if (this.cursor)
						if (v) {
							this.cursor.hide();
							map.config("draggable", true);
						} else {
							this.cursor.show();
						}
				}, 
				name: "Disable Brush", x: 0, y: 0
			}),
			
			//Row 1: Colour
			colour: new ve.Colour("#1bbc9b", {
				onchange: (v) => { 
					try {
						Polygon.setSelectedSymbol({ polygonFill: Colour.convertRGBToHex(v) });
					} catch (e) { console.error(e); } 
				},
				x: 0, y: 1 
			}),
			opacity: new ve.Range(0.70, {
				name: "Opacity",
				onchange: (v) => { try { 
					Polygon.setSelectedSymbol({ polygonOpacity: v });
				} catch (e) {} },
				x: 1, y: 1
			})
		}, { name: "Brush Options", open: true });
		this.optimisation = new ve.Interface({
			simplify: new ve.Range(0.05, {
				binding: "this.properties.simplify", 
				name: "Simplify", x: 0, y: 0
			}),
			simplify_applies_to_brush: new ve.Checkbox(false, {
				name: "Applies to Brush [WIP]",
				tooltip: "Whether the simplification should apply to the brush only instead of the selected polygon.",
				x: 1, y: 0
			}),
			persistent_selection: new ve.Checkbox(false, {
				name: "Persistent Selection [WIP]",
				tooltip: "Selections should be persistent, even when jumping between dates.",
				x: 2, y: 0
			})
		}, { name: "Optimisation", open: true, width: 99 });
		
		this.information_display = new ve.HTML((e) => {
			//Declare local instance variables
			let cursor_coordinates = this.cursor.getCoordinates();
			
			//Return HTML
			return `X: ${String.formatNumber(cursor_coordinates.x, 2)}; Y: ${String.formatNumber(cursor_coordinates.y, 2)} | Size: ${String.formatNumber(this.properties.radius/1000, 2)}km`;
		});
		
		//Set brush event handlers
		this.cursor = new maptalks.Circle([0, 0], this.properties.radius, {
			symbol: {
				lineColor: Colour.convertRGBAToHex([0, 0, 0]),
				lineDasharray: [4, 4],
				polygonFill: "transparent",
				lineWidth: 2
			}
		});
		this.cursor_layer.addGeometry(this.cursor);
		this.handleEvents();
		
		//[WIP] - Remove placeholder
		setTimeout(() => {
			this.selectPolygon();
		});
		
		//Open UI
		this.openUI();
	}
	
	//Backend functions
	disableNodeEditing () {
		
	}
	
	enableNodeEditing () {
		
	}
	
	handleEvents () {
		//Map event handlers
		map.on("mousedown", (e) => {
			if ([1, 3].includes(e.domEvent.which))
				map.config("draggable", false);
				
			if (e.domEvent.which === 1) {
				delete this.right_click;
				this.left_click = true;
			} else if (e.domEvent.which === 3) {
				delete this.left_click;
				this.right_click = true;
			} else {
				delete this.left_click;
				delete this.right_click;
			}
		});
		map.on("mouseup", (e) => {
			delete this.left_click;
			delete this.right_click;
			map.config("draggable", true);
		});
		
		map.on("mousemove", (e) => {
			if (this.disabled) return;
			
			//Set coordinates for this.cursor
			this.cursor.setCoordinates(e.coordinate);
			
			if (this.type === "polygon" && (this.left_click || this.right_click)) {
				//Process cursor based on this.optimisation
				let optimisation_obj = this.optimisation;
				let processed_geometry = this.cursor;
				
				{
					if (optimisation_obj.simplify_applies_to_brush.v) {
						let turf_cursor_geometry = Geospatiale.convertMaptalksToTurf(this.cursor);
						let turf_simplified_geometry = turf.simplify(turf_cursor_geometry, {
							tolerance: optimisation_obj.simplify.v,
							highQuality: true
						});
							processed_geometry = Geospatiale.convertTurfToMaptalks(turf_simplified_geometry);
					}
				}
				
				if (this.left_click) {
					this.selected_geometry.addToPolygon(processed_geometry);
				} else if (this.right_click) {
					this.selected_geometry.removeFromPolygon(processed_geometry);
				}
			}
		});
		
		map.getContainer().addEventListener("wheel", (e) => {
			if (this.disabled) return; //Internal guard clause if brush is disabled
			
			//Normalise the wheel delta across different browsers
			let delta_y = e.deltaY*-1;
			
			if (HTML.ctrl_pressed) {
				if (delta_y < 0)
					this.properties.radius *= 1.1;
				if (delta_y > 0)
					this.properties.radius *= 0.9;
				this.cursor.setRadius(this.properties.radius);
			}
		});
	}
	
	selectLine () {
		
	}
	
	selectPoint () {
		
	}
	
	selectPolygon (arg0_polygon) {
		//Convert from parameters
		let polygon = (arg0_polygon) ? arg0_polygon : new Polygon();
		
		//Deal with any extant selected geometry first
		if (this.selected_geometry)
			if (this.selected_geometry instanceof Polygon)
				this.selected_geometry.selected = false;
		
		//Set this.selected_geometry
		this.type = "polygon";
		this.selected_geometry = polygon;
		setTimeout(() => {
			polygon.is_selected = true;
		});
	}
	
	//Tracker functions
	
	//Frontend functions
	closeUI () {
		super.close();
	}
	
	openUI () {
		super.open("instance", {
			anchor: "bottom_right",
			mode: "static_window",
			name: "Brush",
			width: "24rem",
			x: 8,
			y: 8,
		});
	}
};