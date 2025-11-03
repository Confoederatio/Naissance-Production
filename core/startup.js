//Import modules
global.child_process = require("child_process");
global.electron = require("electron");
global.fs = require("fs");
global.path = require("path");

//Initialise functions
{
  global.initialiseGlobal = function () {
		//Initialise global.scene
		global.scene = new ve.Scene({
			map_component: new ve.Map()
		});
			global.map = scene.map_component.map;
		
    //Declare global variables
    global.main = {
			date: Date.getCurrentDate(),
			hierarchy: {},
			interfaces: {
				//Topbar
				date_ui: new UI_DateMenu()
			},
			layers: {
				//Foreground layers
				overlay_layer: new maptalks.VectorLayer("overlay_layer", [], { zIndex: 99 }),
				cursor_layer: new maptalks.VectorLayer("cursor_layer", [], { zIndex: 98 }),
				label_layer: new maptalks.VectorLayer("label_layer", [], { zIndex: 97 }),
				
				//Background layers
				selection_layer: new maptalks.VectorLayer("selection_layer", [], { zIndex: 2 }),
				entity_layer: new maptalks.VectorLayer("entity_layer", [], {
					hitDetect: true,
					interactive: true,
					zIndex: 1 
				})
			},
			map: map,
			user: {
				
			},
			
			//Aliases
			brush: undefined,
    };
		if (!global.naissance)
			global.naissance = {};
		
		//1.1. Append all layers to map
		Object.iterate(main.layers, (local_key, local_value) => local_value.addTo(map));
		
		//1.2. Add event handlers to map
		//onleftclick
		/*
		map.addEventListener("click", (e) => {
			if (Map.brush_context_menu)
				Map.brush_context_menu.remove();
		});
		 */
		
		//onrightclick
		/*
		map.addEventListener("contextmenu", (e) => {
			if (Map.brush_context_menu)
				Map.brush_context_menu.remove();
			Map.brush_context_menu = new MapContextMenu();
		});
		 */
		
		//2. Set aliases
		main.brush = main.user.brush;
  }

  function trackPerformance () {
    //Declare local instance variables
		let { ipcRenderer } = require('electron');
    let frame_count = 0;
		let last_time = performance.now();

		//Track FPS
    function trackFPS() {
      frame_count++;
			let now = performance.now();

      //Report back to the main process once per second
      if (now - last_time >= 1000) {
        ipcRenderer.send('update-fps', frame_count);
        frame_count = 0;
        last_time = now;
      }

      //Keep the loop going
      requestAnimationFrame(trackFPS);
    }

    //Start the counter
    trackFPS();
  }
}

//Startup process
{
	global.is_naissance = true;
	ve.start({
		//Accepts wildcards (*), exclusionary patterns (!), and folders/file paths
		load_files: [
			"!core/startup.js",
			"!core/archives",
			"core"
		],
		special_function: function () {
			try {
				initialiseGlobal();	
			} catch (e) {
				console.error(e);
			}	
		}
	});

  trackPerformance();
}