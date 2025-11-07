//Work on ve.ComponentUndoRedo as DALS Timelines become available via Naissance
ve.UndoRedo = class extends ve.Component {
	constructor (arg0_value, arg1_options) { //[WIP] - Finish constructor function
		let value = arg0_value;
		let options = (arg1_options) ? arg1_options : {};
			super(options);
			
		//Initialise options
		if (options.flipped !== false) options.flipped = true;
		
		//Declare local instance variables
		this.element = document.createElement("div");
			this.element.setAttribute("component", "ve-toggle");
			this.element.instance = this;
			HTML.applyTelestyle(this.element, options.style);
		this.options = options;
		this.value = value; //Stores timeline_id
		
		//Add HTML list, canvas
		this.canvas_el = document.createElement("canvas");
		this.html_list_el = document.createElement("div");
		
		//Create a ve.PageMenu with this.html_list_el, this.canvas_el, and mount it to this.element
	}
	
	draw () { //[WIP] - Finish function body
		//Declare local instance variables
		let ctx = this.canvas_el.getContext("2d");
		let timeline_graph;
			if (!options.flipped) {
				timeline_graph = DALS.Timeline.generateGraph();
			} else {
				for (let i = 0; i < DALS.Timeline.instances.length; i++)
					if (DALS.Timeline.instances[i].initial_timeline) {
						timeline_graph = DALS.Timeline.instances[i].generateFlippedGraph();
						break;
					}
			}
		
		let canvas_height = 0;
		let canvas_width = 0;
		let node_height = 14;
		let spacing_x = 140;
		let spacing_y = 60;
		
		//Store node positions for event handling
		let node_positions = {};
		let row_tracker = {};
		
		//Clear previous render
		ctx.clearRect(0, 0, this.canvas_el.width, this.canvas_el.height);
		
		//1. Iterate over timeline_graph keys and render nodes
		Object.iterate(timeline_graph, (local_key, local_value) => {
			let local_x = local_value.x*spacing_x - 50;
			let local_y = local_value.y*spacing_y + 10;
			
			//Initialise row_tracker
			if (!row_tracker[local_value.y]) row_tracker[local_value.y] = [];
				row_tracker[local_value.y].push(local_key);
			
			//Measure text width and define node height
			let is_selected = false;
				if (local_value.timeline_id === DALS.Timeline.current_timeline && local_value.timeline_index === DALS.Timeline.current_index)
					is_selected = true;
			let node_text;
				if (local_value.value.options && local_value.value.options.name)
					node_text = local_value.value.options.name;
				if (node_text === undefined) node_text = "Unlisted";
				if (local_value.child_timelines && local_value.x === 1)
					node_text = "S. Init";
				if (local_value.parent_timeline)
					node_text = "Split From Timeline";
			let text_height = node_text.split("\n").length*node_height;
			let text_width = ctx.measureText(node_text).width;
				
			//Store position for click detection
			node_positions[local_key] = {
				id: `${local_value.x}-${local_value.y}`,
				name: node_text,
				
				is_selected: is_selected,
				timeline_id: local_value.timeline_id,
				timeline_index: local_value.timeline_index,
				value: local_value.value,
				
				height: text_height,
				width: text_width,
				x: local_x,
				y: local_y
			};
		});
		
		//2. Calculate canvas.height, canvas.width
		Object.iterate(node_positions, (local_key, local_value) => {
			canvas_height = Math.max(canvas_height, Math.returnSafeNumber(local_value.y + local_value.height));
			canvas_width = Math.max(canvas_width, Math.returnSafeNumber(local_value.x + local_value.width));
		});
		this.canvas_el.setAttribute("height", canvas_height);
		this.canvas_el.setAttribute("width", canvas_width);
		
		//3. Draw DALS.Action nodes
		Object.iterate(node_positions, (local_key, local_value) => {
			if (local_value.is_selected) {
				ctx.fillStyle = `rgb(235, 235, 235)`;
				ctx.fillRect(local_value.x - local_value.width/2 - local_value.height/2, local_value.y - local_value.height, local_value.width + local_value.height, local_value.height*2);
			}
			ctx.fillStyle = (!local_value.is_selected) ? "white" : "black";
			ctx.font = `${node_height}px Karla Light`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(local_value.name, local_value.x, local_value.y);
		});
		
		//4. Draw horizontal lines
		Object.iterate(row_tracker, (local_key, local_value) => {
			local_value = local_value.sort((a, b) => node_positions[a].x - node_positions[b].x); //Sort nodes by X position
			
			for (let x = 0; x < local_value.length - 1; x++) {
				let local_end_key = local_value[x + 1];
				let local_start_key = local_value[x];
				
				let local_end_node = node_positions[local_end_key];
				let local_end_x = local_end_node.x - local_end_node.width - local_end_node.height;
				let local_end_y = local_end_node.y;
				let local_start_node = node_positions[local_start_key];
				let local_start_x = local_start_node.x + local_start_node.width/2 + local_start_node.height/2;
					if (x >= 1) local_start_x += local_start_node.height*2 + 4;
				let local_start_y = local_start_node.y;
				
				//Check if line should be drawn
				let local_node_timeline = DALS.Timeline.getTimeline(local_end_node.timeline_id);
				
				if (local_node_timeline.parent_timeline) {
					//Draw line between nodes
					ctx.beginPath();
					ctx.moveTo(local_start_x, local_start_y);
					ctx.lineTo(local_end_x, local_end_y);
					ctx.strokeStyle = "white";
					ctx.lineWidth = 2;
					ctx.stroke();
					ctx.closePath();
				}
			}
		});
		
		//5. Draw vertical lines
		
		//6. Add click event listener to detect node clicks
	}
	
	get v () {
		//Return statement
		return DALS.Timeline.getTimeline(this.value);
	}
	
	set v (arg0_value) {
		//Convert from parameters
		let value = (arg0_value) ? arg0_value : DALS.Timeline.current_timeline;
		
		//Declare local instance variables
		let timeline_groups = [];
		let timeline_obj = DALS.Timeline.getTimeline(value);
			if (!timeline_obj) {
				value = DALS.Timeline.current_timeline;
				timeline_obj = DALS.Timeline.getTimeline(value);
			}
		
		//Render HTML list
		{
			this.html_list_el.innerHTML = "";
			
			//Iterate over timeline_obj.value and populate timeline_groups
			let current_group = [];
			
			for (let i = 1; i < timeline_obj.value.length; i++) {
				let is_same_group = false;
				
				if (i > 1 && current_group.length > 1)
					if (current_group[current_group.length - 1].key === timeline_obj.value[i].key)
						is_same_group = true;
				
				//If is_same_group, push to current_group, otherwise reset group
				if (is_same_group) {
					current_group.push(timeline_obj.value[i]);
				} else {
					timeline_groups.push(current_group);
					current_group = [timeline_obj.value[i]];
				}
			}
			
			//Iterate over timeline_groups, and add list items depending on the length
			let ul_el = document.createElement("ul");
			
			for (let i = 0; i < timeline_groups.length; i++) { //[WIP] - Finish header_el
				//Create header_el with Jump To/Branch buttons
				let group_el = document.createElement("li");
				let header_el = new ve.RawInterface({
					action_name: new ve.HTML(`${timeline_groups[i][0].name} (${String.formatNumber(timeline_groups[i].length)})`),
					
					jump_to_button: new ve.Button(() => {
						
					}, { name: `<icon>arrow_right_alt</icon>`, tooltip: `Jump To` }),
					branch: new ve.Button(() => {
						
					}, { name: `<icon>arrow_split</icon>`, tooltip: `Branch Timeline` })
				});
				
				//Append main header in div; don't split it up to prevent DOM lag
				group_el.appendChild(header_el);
				ul_el.appendChild(group_el);
			}
			
			this.html_list_el.appendChild(ul_el);
		}
		
		//Render Canvas list; scavenge code from old Naissance
		{
			this.draw();
		}
	}
};