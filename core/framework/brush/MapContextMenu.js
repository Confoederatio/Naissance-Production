global.MapContextMenu = class MapContextMenu extends ve.Class {
	constructor () {
		super();
		
		this.interface = new ve.ContextMenu({
			//New Polygon/Line/Point
			new_polygon: veButton(() => {
				let new_polygon_interface = this.interface.addContextMenu({
					name: veText("New Polygon", { name: "Name" }),
					colour: veColour(Colour.convertHexToRGBA(main.brush.interface.colour.v), {
						attributes: { "data-brush-colour": true },
						name: "Colour" 
					}),
					create_polygon: veButton(() => {
						new ve.Toast(`Created ${new_polygon_interface.components_obj.name.v}`);
					}, { name: "Create Polygon" })
				}, { id: "brush_map_context_menu_new_polygon" })
			}, {
				name: "New Polygon"
			}),
			
			new_line: veButton(() => {
				
			}, { name: "New Line" }),
			
			new_point: veButton(() => {
				
			}, { name: "New Point" })
		}, { id: "brush_map_context_menu" });
	}
	
	remove () {
		//Remove this.context_menu
		this.interface.close();
	}
}