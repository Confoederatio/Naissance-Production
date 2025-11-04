if (!global.naissance) global.naissance = {};
naissance.Brush = class extends ve.Class {
	constructor () {
		super();
		
		//Declare local instance variables
		this.radius = 50000;
		this.selected_geometry = undefined;
		this.symbol = {};
		
		//Draw
		this.cursor = new maptalks.Circle([0, 0], this.radius, {
			symbol: {
				lineColor: Colour.convertRGBAToHex([0, 0, 0]),
				lineDasharray: [4, 4],
				polygonFill: "transparent",
				lineWidth: 2
			}
		});
		main.layers.cursor_layer.addGeometry(this.cursor);
		
		//Declare brush UI
		this.brush_options = new ve.Interface({
			disabled: veToggle(false, {
				binding: "this.disabled",
				onchange: (v) => {
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
			colour: veColour("#1bbc9b", {
				onchange: (v) => {
					try { naissance.Brush.setSelectedSymbol({ polygonFill: v.getHex() }); } 
						catch (e) { console.error(e); }
				},
				x: 0, y: 1
			}),
			opacity: veRange(0.70, {
				name: "Opacity",
				onchange: (v) => {
					try { naissance.Brush.setSelectedSymbol({ polygonOpacity: v }); }
						catch (e) { console.error(e); }
				},
				x: 1, y: 1
			})
		}, { name: "Brush Options:", open: true });
		this.optimisation = veInterface({
			simplify: veRange(0.05, {
				binding: "this.simplify",
				name: "Simplify", x: 0, y: 0
			}),
			simplify_applies_to_brush: veCheckbox(false, {
				binding: "this.simplify_applies_to_brush",
				name: "Applies to Brush [WIP]",
				tooltip: "Whether the simplification should apply to the brush only instead of the selected polygon.",
				x: 1, y: 0
			}),
			persistent_selection: veCheckbox(true, {
				binding: "this.persistent_selection",
				name: "Persistent Selection [WIP]",
				tooltip: "Selections should be persistent, even when jumping between dates.",
				x: 2, y: 0
			})
		});
		this.information_display = veHTML(() => {
			let cursor_coordinates = this.cursor.getCoordinates();
			
			return `X: ${String.formatNumber(cursor_coordinates.x, 2)}; Y: ${String.formatNumber(cursor_coordinates.y, 2)} | Size: ${String.formatNumber(this.radius/1000, 2)}km`;
		});
		super.open("instance", {
			anchor: "bottom_right",
			mode: "static_window",
			name: "Brush",
			width: "24rem",
			x: 8,
			y: 8
		});
		this.handleEvents();
	}
	
	handleEvents () {
		//Map event handlers
		map.on("mousedown", () => {
			setTimeout(() =>{
				if (HTML.left_click || HTML.right_click) map.config("draggable", false);
			});			
		});
		map.on("mouseup", () => {
			map.config("draggable", true);
		});
		
		//Cursor handler
		map.on("mousemove", (e) => {
			if (this.disabled) return;
			
			this.cursor.setCoordinates(e.coordinate);
		});
		map.getContainer().addEventListener("wheel", (e) => {
			if (this.disabled) return;
			
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
	
	static setSelectedSymbol (arg0_symbol_obj) {
		//Convert from parameters
		let symbol_obj = (arg0_symbol_obj) ? arg0_symbol_obj : {};
		
		//Declare local instance variables
		let json_obj = {
			options: { name: "Set Selected Symbol" },
			value: []
		};
		
		//Iterate over naissance.Geometry.instances and check for .selected
		for (let i = 0; i < naissance.Geometry.instances.length; i++)
			if (naissance.Geometry.instances[i].selected)
				json_obj.value.push({
					type: naissance.Geometry.instances[i].class_name,
					
					geometry_id: naissance.Geometry.instances[i].id,
					set_symbol: symbol_obj
				});
		DALS.Timeline.parseAction(json_obj);
	}
};