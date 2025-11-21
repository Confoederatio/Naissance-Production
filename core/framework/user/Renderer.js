if (!global.naissance) global.naissance = {};
naissance.Renderer = class extends ve.Class {
	constructor () {
		super();
		
		this.handleEvents();
	}
	
	handleEvents () {
		map.on("zoomend", (e) => {
			//Iterate over all geometries and draw them
			for (let i = 0; i < naissance.Geometry.instances.length; i++) {
				let local_geometry = naissance.Geometry.instances[i];
				
				local_geometry.draw();
			}
		});
	}
	
	update () {
		
	}
};