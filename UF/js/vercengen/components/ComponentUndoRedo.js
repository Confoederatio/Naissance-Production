//Work on ve.ComponentUndoRedo as DALS Timelines become available via Naissance
ve.UndoRedo = class extends ve.Component {
	constructor (arg0_value, arg1_options) {
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
		
		//3. Draw DALS.Action nodes
		
		//4. Draw horizontal lines
		
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