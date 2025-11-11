global.UI_LeftbarHierarchy = class { //[WIP] - Finish naissance.Feature first
	static instances = [];
	
	constructor () {
		this.groups = {};
		this.items = {};
		this.value = undefined;
		this.refresh();
		
		UI_LeftbarHierarchy.instances.push(this);
	}
	
	refresh () { //[WIP] - Finish function body
		//Declare local instance variables
		let actions_bar = new ve.HierarchyDatatype({
			create_new_group: new ve.Button(() => {
				let feature_group = new naissance.FeatureGroup();
				console.log(`Calling redraw!`);
				this.refresh();
			}, { name: "<icon>create_new_folder</icon>", tooltip: "Create New Group" }),
			create_new_layer: new ve.Button(() => {
				
			}, { name: "<icon>layers</icon>", tooltip: "Create New Layer" })
		}, { disabled: true });
		let hierarchy_obj = {};
		
		//1. Iterate over all naissance.FeatureGroups and render them recursively
		for (let i = 0; i < naissance.Feature.instances.length; i++) {
			let local_feature = naissance.Feature.instances[i];
			
			if (local_feature instanceof naissance.FeatureGroup)
				hierarchy_obj[`${local_feature.class_name}-${local_feature.id}`] = local_feature.drawHierarchyDatatype();
		}
		
		//2. Iterate over all naissance.FeatureLayers and render them recursively
		
		//3. Iterate over all naissance.Geometries and render them at base
		for (let i = 0; i < naissance.Geometry.instances.length; i++) {
			let local_geometry = naissance.Geometry.instances[i];
			
			if (local_geometry.drawHierarchyDatatype)
				hierarchy_obj[`${local_geometry.class_name}-${local_geometry.id}`] = local_geometry.drawHierarchyDatatype();
		}
		
		console.log(hierarchy_obj);
		let current_hierarchy = new ve.Hierarchy({
			actions_bar: actions_bar,
			...hierarchy_obj
		});
		
		if (this.value) {
			this.value.v = current_hierarchy.components_obj;
		} else {
			this.value = current_hierarchy;
		}
	}
	
	static refresh () {
		for (let i = 0; i < UI_LeftbarHierarchy.instances.length; i++)
			UI_LeftbarHierarchy.instances[i].refresh();
	}
};