global.UI_Leftbar = class extends ve.Class {
	constructor () {
		super();
		
		//Declare local instance variables
		let navbar_el = document.querySelector(".ve.navbar");
		this.page_menu = new ve.PageMenu({
			file_explorer: {
				name: "File",
				components_obj: {
					file_explorer: veFileExplorer(__dirname, { name: " " })
				}
			},
			hierarchy: {
				name: "Hierarchy",
				components_obj: {
					hierarchy: new UI_LeftbarHierarchy().value
				}
			},
			undo_redo: {
				name: "Undo/Redo",
				components_obj: {
					undo_redo: new ve.UndoRedo(undefined, { name: " " })
				}
			}
		}, { starting_page: "hierarchy" });
		
		//Open UI
		super.open("instance", {
			anchor: "top_left",
			mode: "static_ui",
			height: `calc(100dvh${(navbar_el) ? " - " + navbar_el.offsetHeight + "px" : ""} - 16px)`,
			width: "24rem",
			x: 8,
			y: ((navbar_el) ? navbar_el.offsetHeight : 0) + 8
		});
	}
};