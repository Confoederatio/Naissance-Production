global.UI_EditSelectedGeometries = class extends ve.Class {
	constructor () {
		super();
	}
	
	draw () {
		/**
		 * maptalks.Polygon symbol:
		 * 
		 */
		this.polygon_symbol = new ve.Interface({
			//Row 1: Fill
			fill_options: new ve.Interface({
				colour: veColour(main.brush.colour, {
					name: "Fill Colour",
					binding: "main.brush.colour",
					onchange: (v, e) => {
						try {
							naissance.Brush.setSelectedSymbol({ polygonFill: e.getHex() });
						} catch (e) { console.error(e); }
					}
				}),
				opacity: veRange(main.brush.opacity, {
					name: "Opacity",
					binding: "this.opacity",
					onchange: (v) => {
						try {
							naissance.Brush.setSelectedSymbol({ polygonOpacity: v });
						} catch (e) { console.error(e); }
					}
				}),
				pattern_url: new ve.Text("", {
					name: "Fill pattern",
					attributes: {
						placeholder: "File path or URL ..."
					},
					onchange: (v) => {
						if (v.length === 0) {
							veToast("Reset fill pattern!");
						} else {
							try {
								naissance.Brush.setSelectedSymbol({ polygonPatternFile: v });
							} catch (e) { console.error(e); }
						}
					}
				})
			}, { name: "Fill", open: true }),
			
			//Row 2: Stroke
			stroke_options: new ve.Interface({
				
			}, { name: "Stroke", open: true })
			
			//Row 3: 
		}, { name: "Polygon Symbol" });
		this.line_symbol = new ve.Interface({
			
		}, { name: "Line Symbol" });
		this.point_symbol = new ve.Interface({
			
		}, { name: "Point Symbol" });
		this.label = new ve.Interface({
			
		}, { name: "Label" });
	}
	
	open () {
		this.draw();
		
		//Open UI
		super.open("instance", {
			can_rename: false,
			name: "Edit Selected Geometries",
			width: "24rem" 
		});
	}
};