//State mutation functions
{
	DALS.Timeline.parseAction = function (arg0_json) {
		//Convert from parameters
		let json = (typeof arg0_json === "string") ? JSON.parse(arg0_json) : arg0_json
		
		//Initialise JSON
		if (json.options === undefined) json.options = {};
		if (json.value === undefined) json.value = [];
		
		//Iterate over multi-value packet (MVP) and filter it down to superclass single-value packets (SVPs)
		console.log(json.value);
		for (let i = 0; i < json.value.length; i++) {
			if (json.value[i].type === "global") {
				if (json.value[i].set_date) {
					main.date = json.value[i].set_date;
				} else if (json.value[i].refresh_date === true) {
					naissance.Geometry.instances.forEach((local_geometry) => local_geometry.draw());
				}
				continue;
			}
			if (json.value[i].type)
				naissance[json.value[i].type].parseAction(json.value[i]);
		}
		
		//Save action to current timeline
		new DALS.Action(json);
	};
}

//State save/load functions
{
	DALS.Timeline.loadState = function (arg0_json) {
		//Convert from parameters
		let json = (arg0_json) ? arg0_json : {};
		if (typeof json === "string") json = JSON.parse(json);
		
		//Clear map first
		scene.map_component.clear();
		
		//1. Handle naissance.Geometry classes
		//Iterate over json to load in each class
		Object.iterate(json, (local_key, local_value) => {
			if (local_value.class_name && local_value.type === "geometry") {
				let polygon_obj = new naissance[local_value.class_name]();
				if (local_value.id) polygon_obj.id = local_value.id;
				polygon_obj.history.fromJSON(local_value.history);
				try {
					polygon_obj.draw();
				} catch (e) { console.warn(e); }
			}
		});
		
		//Reload cursor
		main.layers.cursor_layer.addGeometry(main.brush.cursor)
	};
	
	DALS.Timeline.saveState = function () {
		//Declare local instance variables
		let json_obj = {};
		
		//Iterate over all naissance.Geometry.instances and serialise them
		for (let i = 0; i < naissance.Geometry.instances.length; i++) {
			let local_geometry = naissance.Geometry.instances[i];
			json_obj[local_geometry.id] = {
				id: local_geometry.id,
				class_name: local_geometry.class_name,
				history: local_geometry.history.toJSON(),
				type: "geometry"
			};
		}
		
		//Return statement
		return json_obj;
	};
}