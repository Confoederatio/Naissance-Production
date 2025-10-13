//Initialise functions
{
	if (!global.Map) global.Map = {};
	
	Map.initialise = function () {
		Map.initialiseKeyboardHandlers();
		Map.initialiseMouseHandlers();
		
		//Add main.layers.geometry
		main.layers.geometry = new maptalks.VectorLayer("geometry_layer", [], {
			hitDetect: true,
			interactive: true
		}).addTo(map);
	};
}