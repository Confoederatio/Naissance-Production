//Initialise ve.Scene, ve.Map in background
setTimeout(() => {
	global.scene = new ve.Scene({
		map_component: new ve.Map()
	});
	global.map = scene.map_component.map;
}, 100);