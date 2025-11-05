global.UI_Leftbar = class extends ve.Class {
	constructor () {
		super();
		
		//Declare local instance variables
		let navbar_el = document.querySelector(".ve.navbar");
		this.page_menu = new ve.PageMenu({
			hierarchy: {
				name: "Hierarchy",
				components_obj: {
					hierarchy: veHierarchy({
						layer: new ve.HierarchyDatatype(undefined, { name: "Test" })
					})
				}
			},
			undo_redo: {
				name: "Undo/Redo",
				components_obj: {
					html: veHTML("This is a test")
				}
			}
		});
		
		//Open UI
		super.open("instance", {
			anchor: "top_left",
			mode: "static_window",
			name: "Project",
			height: `calc(100dvh${(navbar_el) ? " - " + navbar_el.offsetHeight + "px" : ""} - 16px)`,
			width: "24rem",
			x: 8,
			y: ((navbar_el) ? navbar_el.offsetHeight : 0) + 8
		});
	}
};