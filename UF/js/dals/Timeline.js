//Initialise class
if (!global.DALS) global.DALS = {};
if (!global.main) global.main = {};

DALS.Timeline = class {
	//Declare local static variables
	static current_timeline;
	static instances = [];
	
	//Constructor/getter/setter
	constructor (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		if (dals.Timeline.instances.length === 0) {
			this.initial_timeline = true;
			dals.Timeline.current_timeline = this;
		}
		this.setName(options.name);
		this.parent_timeline = options.parent_timeline;
		this.value = [JSON.parse(JSON.stringify(global.main))];
		dals.Timeline.instances.push(this);
	}
	
	get () {
		return this.value;
	}
	
	set (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Interpret options
		if (Array.isArray(options)) {
			this.value = options;
		} else {
			if (options.id) this.id = options.id;
			if (options.parent_timeline) this.parent_timeline = options.parent_timeline;
			
			if (options.actions) this.value = options.actions;
			if (options.value) this.value = options.value;
		}
	}
	
	//Class methods
	delete () {
	
	}
	
	getTimeline (arg0_timeline_id) {
		//Convert from parameters
		let timeline_id = arg0_timeline_id;
		
		//Internal guard clause if timeline_id is of type object
		if (typeof timeline_id === "object") return timeline_id;
		
		//Return statement
	}
	
	getName () {
	
	}
	
	jumpToAction (arg0_action_index) {
	
	}
	
	jumpToEnd () {
	
	}
	
	jumpToStart () {
	
	}
	
	jumpToTimeline (arg0_timeline_id) {
	
	}
	
	setName () {
	
	}
};