global.UI_Navbar = class {
	constructor () {
		//Declare local instance variables
		this.navbar_el = new ve.Navbar({
			file: {
				name: "Project"
			},
			edit: {
				name: "Edit",
				
				undo: {
					name: "Undo",
					keybind: "ctrl+z",
					onclick: () => DALS.Timeline.undo()
				},
				redo: {
					name: "Redo",
					keybind: "ctrl+y",
					onclick: () => DALS.Timeline.redo()
				}
			},
			view: {
				name: "View"
			},
			settings: {
				name: "Settings"
			}
		}, { name: "Naissance HGIS" });
	}
};