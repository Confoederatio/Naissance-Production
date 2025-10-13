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
			brush: new Brush(),
			hierarchy: {},
			layers: {},
			map: map
    };
		
		Map.initialise();
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