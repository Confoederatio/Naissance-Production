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
					onuserchange: (v, e) => {
						try {
							naissance.Brush.setSelectedSymbol({ polygonFill: e.getHex() });
						} catch (e) { console.error(e); }
					}
				}),
				opacity: veRange(main.brush.opacity/100, {
					name: "Fill Opacity",
					onuserchange: (v) => {
						try {
							naissance.Brush.setSelectedSymbol({ polygonOpacity: v });
						} catch (e) { console.error(e); }
					}
				}),
				pattern_url: new ve.Text("", {
					name: "Fill Pattern",
					attributes: {
						placeholder: "File path or URL ..."
					},
					onuserchange: (v) => {
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
				colour: veColour(main.brush.stroke_colour, {
					name: "Stroke Colour",
					onuserchange: (v, e) => {
						try {
							naissance.Brush.setSelectedSymbol({ lineColor: e.getHex() });
						} catch (e) { console.error(e); }
					}
				}),
				opacity: veRange(main.brush.stroke_opacity/100, {
					name: "Stroke Opacity",
					onuserchange: (v, e) => {
						try {
							naissance.Brush.setSelectedSymbol({ lineOpacity: e });
						} catch (e) { console.error(e); }
					}
				}),
				width: veNumber(main.brush.stroke_width, {
					name: "Stroke Width",
					onuserchange: (v) => {
						try {
							naissance.Brush.setSelectedSymbol({ lineWidth: v });
						} catch (e) { console.error(e); }
					}
				}),
				
				line_cap: new ve.Select({
					butt: {
						name: "Butt",
						selected: true
					},
					round: {
						name: "Round"
					},
					square: {
						name: "Square"
					}
				}, { 
					name: "Line Cap",
					onuserchange: (v) => {
						try {
							naissance.Brush.setSelectedSymbol({ lineCap: v });
						} catch (e) { console.error(e); }
					}
				}),
				line_join: new ve.Select({
					bevel: {
						name: "Bevel"
					},
					miter: {
						name: "Miter",
						selected: true
					},
					round: {
						name: "Round",
					}
				}, { 
					name: "Line Join",
					onuserchange: (v) => {
						try {
							naissance.Brush.setSelectedSymbol({ lineJoin: v });
						} catch (e) { console.error(e); }
					}
				}),
			}, { name: "Stroke", open: true })
			
			//Row 3: 
		}, { name: "Polygon Symbol" });
		this.line_symbol = new ve.Interface({
			
		}, { name: "Line Symbol" });
		this.point_symbol = new ve.Interface({
			
		}, { name: "Point Symbol" });
		this.label = new ve.Interface({
			
		}, { name: "Label" });
		this.properties = new ve.Interface({
			
		}, { name: "Properties", open: true });
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