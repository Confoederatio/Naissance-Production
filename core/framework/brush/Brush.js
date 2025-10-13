global.Brush = class extends ve.Class {
	constructor () {
		//Declare local instance variables
		super();
		this.cursor_layer = new maptalks.VectorLayer("cursor_layer", [], {
			hitDetect: true,
			interactive: true
		}).addTo(map);
		this.radius = 50000;
		this.selected_geometry = undefined;
		this.type = "polygon"; //Either 'none'/'polygon'/'line'/'point'
		
		//Declare local symbol variables
		this.interface = new ve.Interface({
			//Row 0: Enable/Disable
			disabled: new ve.Checkbox(false, { 
				onchange: (e) => {
					if (this.cursor)
						(e.v) ? this.cursor.hide() : this.cursor.show();
				}, 
				name: "Disable Brush", x: 0, y: 0
			}),
			
			//Row 1: Colour
			colour: new ve.Colour([255, 255, 255], { x: 0, y: 1 }),
			opacity: new ve.Range(0.70, {
				name: "Opacity", x: 1, y: 1
			}),
			
			//Row 2: Simplification
			simplify: new ve.Range(0.5, { 
				name: "Simplify", x: 0, y: 2
			}),
			simplify_applies_to_polygon: new ve.Checkbox(false, {
				name: "Applies to Polygon", x: 1, y: 2
			})
		}, { name: "Brush Options", open: true });
		
		//Declare local interface variables
		this.information_display = new ve.HTML((e) => {
			//Declare local instance variables
			let cursor_coordinates = this.cursor.getCoordinates();
			
			//Return HTML
			return `X: ${String.formatNumber(cursor_coordinates.x, 2)}; Y: ${String.formatNumber(cursor_coordinates.y, 2)} | Size: ${String.formatNumber(this.radius/1000, 2)}km`;
		});
		
		//Set brush event handlers
		this.cursor = new maptalks.Circle([0, 0], this.radius, {
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
			if (this.interface.disabled.v) return;
			
			//Set coordinates for this.cursor
			this.cursor.setCoordinates(e.coordinate);
			
			if (this.type === "polygon" && (this.left_click || this.right_click)) {
				map.config("draggable", false);
				
				if (this.left_click) {
					this.selected_geometry.addToPolygon(this.cursor);
				} else if (this.right_click) {
					this.selected_geometry.removeFromPolygon(this.cursor);
				}
			}
		});
		
		map.getContainer().addEventListener("wheel", (e) => {
			if (this.interface.disabled.v) return; //Internal guard clause if brush is disabled
			
			//Normalise the wheel delta across different browsers
			let delta_y = e.deltaY*-1;
			
			if (HTML.ctrl_pressed) {
				if (delta_y < 0)
					this.radius *= 1.1;
				if (delta_y > 0)
					this.radius *= 0.9;
				this.cursor.setRadius(this.radius);
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
		
		//Set this.selected_geometry
		this.type = "polygon";
		this.selected_geometry = polygon;
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
	
	//Symbol functions
	setColour (arg0_rgb) {
		//Convert from parameters
		let rgb = Colour.convertHexToRGBA(arg0_rgb);
		
		//Declare local instance variables
		this.colour.v = rgb;
	}
	
	setSimplify (arg0_tolerance, arg1_options) {
		
	}
};