global.Brush = class {
	constructor () {
		//Declare local instance variables
		this.cursor_layer = new maptalks.VectorLayer("cursor_layer", [], {
			hitDetect: true,
			interactive: true
		}).addTo(map);
		this.radius = 50000;
		this.type = "none"; //Either 'none'/'polygon'/'line'/'point'
		
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
	}
	
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
};