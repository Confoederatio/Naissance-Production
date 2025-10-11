global.topbar = new ve.Navbar(
	{
		File: {
			name: "File",
			New: {
				name: "New Project",
				active: false,
				onclick: (el) => {
					console.log("New Project clicked", el);
					alert("New Project created!");
				},
				keybind: "ctrl+n"
			},
			Open: {
				name: "Open...",
				onclick: (el) => {
					console.log("Open clicked", el);
					alert("Open File Dialog");
				},
				keybind: "ctrl+o"
			},
			Recent: {
				name: "Recent",
				Document1: {
					name: "Recent Document 1",
					onclick: (el) => {
						alert("Opened: Recent Document 1");
					}
				},
				Document2: {
					name: "Recent Document 2",
					onclick: (el) => {
						alert("Opened: Recent Document 2");
					}
				}
			},
			Exit: {
				name: "Exit",
				onclick: (el) => {
					console.log("Exit clicked");
					window.close();
				}
			}
		},
		
		undo_redo: {
			name: "Undo/Redo",
			Undo: {
				name: "Undo",
				keybind: "ctrl+z",
				onclick: (el) => alert("Undo")
			},
			Redo: {
				name: "Redo",
				keybind: "ctrl+y",
				onclick: (el) => alert("Redo")
			},
			switch_timeline: {
				name: "Switch/Timeline"
			}
		},
		
		View: {
			name: "View",
			Zoom: {
				name: "Zoom",
				In: {
					name: "Zoom In",
					keybind: "ctrl+plus",
					onclick: (el) => alert("Zoomed In")
				},
				Out: {
					name: "Zoom Out",
					keybind: "ctrl+-",
					onclick: (el) => alert("Zoomed Out")
				},
				Reset: {
					name: "Reset Zoom",
					onclick: (el) => alert("Zoom Reset")
				}
			},
			ToggleTheme: {
				name: "Dark Mode",
				keybind: "ctrl+t",
				onclick: (el) => {
					document.body.classList.toggle("dark-theme");
					alert("Theme toggled!");
				}
			}
		},
		
		settings: {
			name: "Settings",
			active: true
		}
	},
	{
		name: "Global Navbar Example"
	}
);