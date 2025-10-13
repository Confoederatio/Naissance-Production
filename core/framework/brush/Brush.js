global.Brush = class extends ve.Class {
	constructor () {
		//Declare local instance variables
		super();
		this.cursor_layer = new maptalks.VectorLayer("cursor_layer", [], {
			hitDetect: true,
			interactive: true
		}).addTo(map);
		this.radius = 50000;
		setTimeout(() => {
			this.selected_polygon = new Polygon();
		});
		this.type = "none"; //Either 'none'/'polygon'/'line'/'point'
		
		//Declare local symbol variables
		this.interface = new ve.Interface({
			colour: new ve.Colour([255, 255, 255], { x: 0, y: 0 }),
			disabled: new ve.Checkbox(false, { 
				onchange: (e) => {
					if (this.cursor)
						(e.v) ? this.cursor.hide() : this.cursor.show();
				}, 
				name: "Disabled", 
				x: 1, y: 0 
			}),
			opacity: new ve.Range(0.70, { name: "Opacity" })
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
		//this.cursor_layer.addGeometry(this.cursor);
		
		//Map event handlers
		map.on("mousemove", (e) => {
			if (this.interface.disabled.v) return;
			this.mouse_dragged = true;
			
			//Set coordinates for this.cursor
			this.cursor.setCoordinates(e.coordinate);
			this.selected_polygon.addToPolygon(this.cursor);
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
		
		//Open UI
		this.openUI();
	}
	
	//Backend functions
	addToBrush () {
		
	}
	
	disableNodeEditing () {
		
	}
	
	enableNodeEditing () {
		
	}
	
	selectLine () {
		
	}
	
	selectPoint () {
		
	}
	
	selectPolygon () {
		
	}
	
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
};