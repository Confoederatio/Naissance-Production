global.UI_LeftbarHierarchy = class { //[WIP] - Finish naissance.Feature first
	static instances = [];
	
	constructor () {
		this.groups = {};
		this.hierarchy_obj = {};
		this.items = {};
		this.value = new ve.HTML("Loading ..");
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
		this.hierarchy_obj = {};
		
		//1. Iterate over all naissance.FeatureGroups and render them recursively
		for (let i = 0; i < naissance.Feature.instances.length; i++) {
			let local_feature = naissance.Feature.instances[i];
			
			if (local_feature instanceof naissance.FeatureGroup && !local_feature.parent)
				this.hierarchy_obj[`${local_feature.class_name}-${local_feature.id}`] = local_feature.drawHierarchyDatatype();
		}
		
		//2. Iterate over all naissance.FeatureLayers and render them recursively
		
		//3. Iterate over all naissance.Geometries and render them at base
		for (let i = 0; i < naissance.Geometry.instances.length; i++) {
			let local_geometry = naissance.Geometry.instances[i];
			
			if (local_geometry.drawHierarchyDatatype)
				this.hierarchy_obj[`${local_geometry.class_name}-${local_geometry.id}`] = local_geometry.drawHierarchyDatatype();
		}
		
		let current_hierarchy = new ve.Hierarchy({
			actions_bar: actions_bar,
			...this.hierarchy_obj
		}, {
			onuserchange: (v, e) => {
				let instance = e.on_stop_data.movedNode?.instance?.options?.instance;
				let old_parent = e.on_stop_data.originalParentItem?.instance?.options?.instance;
					if (old_parent && old_parent.entities)
						for (let i = old_parent.entities.length - 1; i >= 0; i--)
							if (
								old_parent.entities[i].class_name === instance.class_name &&
								old_parent.entities[i].id === instance.id
							)
								old_parent.entities.splice(i, 1);
				let new_parent = e.on_stop_data.newParentItem?.instance?.options?.instance;
					if (new_parent && new_parent.entities) {
						instance.parent = new_parent;
						new_parent.entities.push(instance);
					}
			}
		});
		
		this.value.element.innerHTML = "";
		this.value.element.appendChild(current_hierarchy.element);
	}
	
	static refresh () {
		for (let i = 0; i < UI_LeftbarHierarchy.instances.length; i++)
			UI_LeftbarHierarchy.instances[i].refresh();
	}
};