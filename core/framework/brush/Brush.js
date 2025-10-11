global.Brush = class extends ve.Class {
	constructor () {
		//Declare local instance variables
		super();
		this.cursor_layer = new maptalks.VectorLayer("cursor_layer", [], {
			hitDetect: true,
			interactive: true
		}).addTo(map);
		this.radius = 50000;
		this.type = "none"; //Either 'none'/'polygon'/'line'/'point'
		
		//Declare local symbol variables
		this.colour = new ve.Colour([255, 255, 255]);
		
		//Declare local interface variables
		this.information_display = new ve.HTML((e) => {
			//Declare local instance variables
			let cursor_coordinates = this.cursor.getCoordinates();
			
			//Return HTML
			return `${cursor_coordinates.x}, ${cursor_coordinates.y} | Size: ${this.radius}`;
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
		
		//Map event handlers
		map.on("mousemove", (e) => {
			if (this.disabled) return;
			this.mouse_dragged = true;
			
			//Set coordinates for this.cursor
			this.cursor.setCoordinates(e.coordinate);
		});
		
		map.getContainer().addEventListener("wheel", (e) => {
			if (this.disabled) return; //Internal guard clause if brush is disabled
			
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