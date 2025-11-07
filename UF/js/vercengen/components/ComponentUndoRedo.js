//Work on ve.ComponentUndoRedo as DALS Timelines become available via Naissance
ve.UndoRedo = class extends ve.Component {
	constructor (arg0_value, arg1_options) {
		let value = arg0_value;
		let options = (arg1_options) ? arg1_options : {};
			super(options);
		
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
			
		}
	}
};