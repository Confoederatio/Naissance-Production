if (!global.naissance) global.naissance = {};
/**
 * @type {naissance.FeatureGroup}
 */
naissance.FeatureGroup = class extends naissance.Feature {
	constructor (arg0_entities, arg1_options) {
		//Convert from parameters
		super();
		this.class_name = "FeatureGroup";
		this.entities = (arg0_entities) ? arg0_entities : [];
		this.options = (arg1_options) ? arg1_options : {};
		
		//Initialise this.options
		if (this.options.name === undefined) this.options.name = "New Group";
		
		//Declare UI; attached to UI_LeftbarHierarchy
		this.interface = undefined;
		this.drawHierarchyDatatype(); //Declares this.interface
	}
	
	addEntity (arg0_naissance_obj, arg1_do_not_refresh) {
		//Convert from parameters
		let naissance_obj = arg0_naissance_obj;
		let do_not_refresh = arg1_do_not_refresh;
		
		//Declare local instance variables
		let has_entity = this.hasEntity(naissance_obj);
		
		if (!has_entity) {
			this.entities.push(naissance_obj);
			if (!do_not_refresh) this.drawHierarchyDatatype();
		}
	}
	
	drawHierarchyDatatype () { //[WIP] - Finish function body
		//Declare local instance variables
		let hierarchy_obj = {};
		
		//Iterate over this.entities, if naissance.FeatureGroup/naissance.FeatureLayer, call .draw() recursively
		for (let i = 0; i < this.entities.length; i++) {
			let local_entity = this.entities[i];
			let local_key = `${local_entity.class_name}-${local_entity.id}`;
			
			//naissance.FeatureGroup, naissance.FeatureLayer handling
			if (local_entity instanceof naissance.FeatureGroup || local_entity instanceof naissance.FeatureLayer) {
				hierarchy_obj[local_key] = local_entity.drawHierarchyDatatype();
			} else {
				//naissance.Feature generic handling
				if (local_entity instanceof naissance.Feature) {
					hierarchy_obj[local_key] = new ve.HierarchyDatatype({
						icon: new ve.HTML(`<icon>inventory_2</icon>`, {
							style: { padding: 0 }, tooltip: local_entity.class_name } )
					});
				}
				//naissance.Geometry generic handling
				if (local_entity instanceof naissance.Geometry) {
					let geometry_name_options = () => {
						return {
							onprogramchange: () => {
								this.drawHierarchyDatatype();
							},
							onuserchange: (v) => {
								local_entity.name = v;
							}
						};
					};
					
					if (local_entity instanceof naissance.GeometryPolygon) {
						hierarchy_obj[local_key] = new ve.HierarchyDatatype({
							icon: new ve.HTML(`<icon>pentagon</icon>`, {
								style: { padding: 0 }, tooltip: local_entity.class_name } )
						}, {
							name: local_entity.name,
							name_options: geometry_name_options()
						});
					} else { //[WIP] - Implement naissance.Geometry.name accessor
						hierarchy_obj[local_key] = new ve.HierarchyDatatype({
							icon: new ve.HTML(`<icon>shapes</icon>`, {
								style: { padding: 0 }, tooltip: local_entity.class_name } )
						}, {
							name: local_entity.name,
							name_options: geometry_name_options()
						});
					}
				}
			}
		}
		
		//Set this.interface
		this.interface = new ve.HierarchyDatatype({
			icon: new ve.HTML(`<icon>folder</icon>`, { style: { padding: 0 } }),
			...hierarchy_obj
		}, {
			name: this.options.name,
			name_options: {
				onchange: (v) => {
					this.options.name = v;
					this.drawHierarchyDatatype();
				}
			},
			type: "group"
		});
		
		//Return statement
		return this.interface;
	}
	
	fromJSON (arg0_json) {
		//Convert from parameters
		let json = (typeof arg0_json !== "object") ? JSON.parse(arg0_json) : arg0_json;
		
		//Declare local instance variables
		this.id = json.id;
		this.options = json.options;
		
		//Iterate over json.entities and restore them
		for (let i = 0; i < naissance.Feature.instances.length; i++) {
			let local_feature = naissance.Feature.instances[i];
			
			for (let x = 0; x < json.entities.length; x++)
				if (
					json.entities[x].class_name === local_feature.class_name &&
					json.entities[x].id === local_feature.id
				)
					this.addEntity(local_feature, true);
		}
		for (let i = 0; i < naissance.Geometry.instances.length; i++) {
			let local_geometry = naissance.Geometry.instances[i];
			
			for (let x = 0; x < json.entities.length; x++)
				if (
					json.entities[x].class_name === local_geometry.class_name &&
					json.entities[x].id === local_geometry.id
				)
					this.addEntity(local_geometry, true);
		}
		
		//Draw HierarchyDatatype if possible
		this.drawHierarchyDatatype();
	}
	
	hasEntity (arg0_naissance_obj) {
		//Convert from parameters
		let naissance_obj = arg0_naissance_obj;
		
		//Iteiiiiiirate over this.entities and flag anything with the same .id
		for (let i = 0; i < this.entities.length; i++)
			if (
				this.entities[i].class_name === naissance_obj.class_name &&
				this.entities[i].id === naissance_obj.id
			)
				//Return statement
				return true;
	}
	
	removeEntity (arg0_naissance_obj) {
		//Convert from parameters
		let naissance_obj = arg0_naissance_obj;
		
		//Declare local instance variables
		for (let i = 0; i < this.entities.length; i++)
			if (
				this.entities[i].class_name === naissance_obj.class_name &&
				this.entities[i].id === naissance_obj.id
			) {
				this.drawHierarchyDatatype();
				this.entities.splice(i, 1);
				break;
			}
	}
	
	toJSON () {
		//Declare local instance variables
		let entity_ids = [];
		
		//Iterate over all this.entities
		for (let i = 0; i < this.entities.length; i++)
			entity_ids.push({
				class_name: this.entities[i].class_name,
				id: this.entities[i].id
			});
		
		//Return statement
		return JSON.stringify({
			id: this.id,
			entities: entity_ids,
			options: this.options
		});
	}
	
	static parseAction (arg0_json) {
		//Convert from parameters
		let json = (typeof arg0_json === "string") ? JSON.parse(arg0_json) : arg0_json;
	}
};