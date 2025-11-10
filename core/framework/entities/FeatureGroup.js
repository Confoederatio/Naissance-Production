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
		
		//Declare UI; attached to UI_LeftbarHierarchy
		this.interface = undefined;
		this.draw(); //Declares this.interface
	}
	
	addEntity (arg0_naissance_obj) {
		//Convert from parameters
		let naissance_obj = arg0_naissance_obj;
		
		//Declare local instance variables
		let has_entity = this.hasEntity(naissance_obj);
		
		if (!has_entity) {
			this.entities.push(naissance_obj);
			this.draw();
		}
	}
	
	draw () { //[WIP] - Finish function body
		//Declare local instance variables
		let hierarchy_obj = {};
		
		//Iterate over this.entities, if naissance.FeatureGroup/naissance.FeatureLayer, call .draw() recursively
		for (let i = 0; i < this.entities.length; i++) {
			let local_entity = this.entities[i];
			let local_key = `${local_entity.class_name}-${local_entity.id}`;
			
			//naissance.FeatureGroup, naissance.FeatureLayer handling
			if (local_entity instanceof naissance.FeatureGroup || local_entity instanceof naissance.FeatureLayer) {
				hierarchy_obj[local_key] = local_entity.draw();
			} else {
				//naissance.Feature generic handling
				if (local_entity instanceof naissance.Feature) {
					
				}
				//naissance.Geometry generic handling
				if (local_entity instanceof naissance.Geometry)
					/*if (local_entity instanceof naissance.GeometryPolygon) {
						
					} else*/ { //[WIP] - Implement naissance.Geometry.name accessor
						hierarchy_obj[local_key] = new ve.HierarchyDatatype({
							icon: new ve.HTML(`<icon>shapes</icon>`, { 
								style: { padding: 0 }, tooltip: local_entity.class_name } )
						}, { name: local_entity.name });
					}
			}
		}
		
		//Set this.interface
		this.interface = new ve.HierarchyDatatype({
			icon: new ve.HTML(`<icon>folder</icon>`, { style: { padding: 0 } } ),
			...hierarchy_obj
		}, {
			name: (this.options.name) ? this.options.name : "New Group",
			type: "group"
		});
		
		//Return statement
		return this.interface;
	}
	
	hasEntity (arg0_naissance_obj) {
		//Convert from parameters
		let naissance_obj = arg0_naissance_obj;
		
		//Iterate over this.entities and flag anything with the same .id
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
				this.entities.splice(i, 1);
				break;
			}
	}
	
	static parseAction (arg0_json) {
		//Convert from parameters
		let json = (typeof arg0_json === "string") ? JSON.parse(arg0_json) : arg0_json;
	}
};