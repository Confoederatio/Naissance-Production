if (!global.naissance) global.naissance = {};
/**
 * @type {naissance.FeatureLayer}
 */
naissance.FeatureSketchMap = class extends naissance.Feature {
	constructor (arg0_entities, arg1_options) {
		super();
		this.class_name = "FeatureSketchMap";
		this.options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		this._entities = [];
		this._is_visible = true;
		this._name = "New Sketch Map";
		this.toolbar = undefined;
		
		//Declare UI, attached to UI_LeftbarHierarchy
		this.interface = undefined;
		this.handleToolbar();
	}
	
	addGeometry (arg0_geometry) {
		//Convert from parameters
		let geometry = arg0_geometry;
		
		//Add geometry to layer
		geometry.addTo(main.layers.overlay_layer);
		this._entities.push(geometry);
	}
	
	clearLayer () {
		for (let i = 0; i < this._entities.length; i++)
			this._entities[i].remove();
		this.draw_tool.disable();
	}
	
	draw () {
		/*
		if (main.brush.selected_feature?.id === this.id)
			if (!document.querySelector(`.ve.window[id="${this.id}"]`))
				//Open UI
				super.open("instance", {
					id: this.id,
					name: this._name,
					width: "24rem"
				});
		 */
	}
	
	drawHierarchyDatatype () {
		//Declare local instance variables
		this.interface = new ve.HierarchyDatatype({
			icon: new ve.HTML(`<icon>app_registration</icon>`),
			edit: veButton(() => {
				super.open("instance", {
					id: this.id,
					name: this._name,
					width: "24rem"
				});
			}, {
				name: "<icon>more_vert</icon>",
				tooltip: "Edit Sketch Map",
				style: {
					marginLeft: "auto", order: 99, padding: 0,
					"button": {
						marginLeft: "1rem"
					}
				}
			})
		}, {
			ignore_component: true,
			instance: this,
			name: this.name,
			name_options: {
				onchange: (v) => {
					this.name = v;
					this.drawHierarchyDatatype();
				}
			},
			type: "item",
			style: {
				".nst-content": {
					paddingRight: 0
				},
				"[component='ve-button'] > button": {
					border: 0
				}
			}
		});
		
		//Return statement
		return this.interface;
	}
	
	fromJSON (arg0_json) {
		//Declare local instance variables
		let json = (typeof arg0_json !== "object") ? JSON.parse(arg0_json) : arg0_json;
		
		//Declare local instance variables
		this.id = json.id;
		this._name = json.name;
		this._entities = [];
		
		//Populate this._entities
		for (let i = 0; i < json._entities.length; i++)
			this.addGeometry(maptalks.Geometry.fromJSON(json._entities[i]));
		
		//Draw HierarchyDatatype if possible
		this.drawHierarchyDatatype();
	}
	
	handleToolbar () {
		//Declare local instance variables
		if (!this.draw_tool) {
			this.draw_tool = new maptalks.DrawTool({ mode: "Polygon" }).addTo(map).disable();
			
			this.draw_tool.on("drawend", (e) => {
				DALS.Timeline.parseAction({
					options: { name: "Create SketchMap Geometry", key: "create_sketch_map_geometry" },
					value: [{ type: "FeatureSketchMap", feature_id: this.id, add_geometry: e.geometry.toJSON() }]
				});
				//console.log(e);
				//this.addGeometry(e.geometry);
			});
		}
		
		//Populate UI
		this.entity_items = ["Polygon", "LineString", "Point", "Circle", "Ellipse", "Rectangle", "FreeHandLineString", "FreeHandPolygon"].map((local_value) => {
			//Return statement
			return veButton(() => this.draw_tool.setMode(local_value).enable(), { name: local_value }); 
		});
		this.entity_items_interface = new ve.RawInterface({
			...this.entity_items
		}, { name: " " });
		
		this.brush_interface = new ve.Interface({
			clear_brush: new ve.Button(() => {
				this.draw_tool.disable();
			}, { name: "<icon>edit_off</icon> Clear Brush&nbsp;&nbsp;", x: 0, y: 0 }),
			clear_layer: new ve.Button(() => {
				this.clearLayer();
			}, { name: "<icon>delete</icon> Clear Layer&nbsp;&nbsp;", x: 1, y: 0 }),
		}, { 
			is_folder: false,
			style: { marginLeft: "auto", marginRight: "auto" }
		});
	}
	
	hide () {
		
	}
	
	remove () {
		
	}
	
	show () {
		
	}
	
	toJSON () {
		//Declare local instance variables
		let json_obj = {
			id: this.id,
			name: this._name,
			_entities: []
		};
		
		//Iterate over all this._entities
		for (let i = 0; i < this._entities.length; i++)
			json_obj._entities.push(this._entities[i].toJSON());
		
		//Return statement
		return JSON.stringify(json_obj);
	}
	
	/**
	 * Parses a JSON action for a target FeatureLayer.
	 * - Static method of: {@link naissance.FeatureLayer}
	 *
	 * `arg0_json`: {@link Object|string}
	 * - `.feature_id`: {@link string} - Identifier. The {@link naissance.Feature} ID to target changes for.
	 * <br>
	 * - #### Extraneous Commands:
	 * - `.create_sketch_map`: {@link Object}
	 *   - `.do_not_refresh=false`: {@link boolean}
	 *   - `.id`: {@link string}
	 */
	static parseAction (arg0_json) {
		//Convert from parameters
		let json = (typeof arg0_json === "string") ? JSON.parse(arg0_json) : arg0_json;
		
		//Declare local instance variables
		let sketch_map_obj = naissance.Feature.instances.filter((v) => v.id === json.feature_id)[0];
		
		//Parse extraneous commands
		//create_sketch_map
		if (json.create_sketch_map)
			if (json.create_sketch_map.id) {
				let new_sketch_map = new naissance.FeatureSketchMap();
				new_sketch_map.id = json.create_sketch_map.id;
				
				if (!json.create_sketch_map.do_not_refresh)
					UI_LeftbarHierarchy.refresh();
			}
		
		//Parse commands for sketch_map_obj
		if (sketch_map_obj instanceof naissance.FeatureSketchMap) {
			//add_geometry
			if (json.add_geometry)
				sketch_map_obj.addGeometry(maptalks.Geometry.fromJSON(json.add_geometry));
		}
	}
};