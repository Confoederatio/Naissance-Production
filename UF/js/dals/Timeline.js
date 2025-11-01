//Initialise class
if (!global.DALS) global.DALS = {
	/**
	 * This is an example of how to declare documentation for a specific variable.
	 *
	 * @type {DALS.Timeline}
	 * @typedef {DALS.timeline}
	 */
	timeline: undefined
};
if (!global.main) global.main = {};

//Define DALS.timeline as DALS.Timeline.current_timeline
Object.defineProperty(DALS, "timeline", {
	get () {
		return DALS.Timeline.current_timeline;
	},
	set (v) {
		DALS.Timeline.current_timeline.v = v;
	}
});

//[WIP] - Place DALS.Timeline on a JSON footing
DALS.Timeline = class {
	//Declare local static variables
	static current_timeline;
	static instances = [];
	
	/**
	 * @param [arg0_options]
	 *  @param {string} [arg0_options.parent_timeline]
	 */
	constructor (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		if (DALS.Timeline.instances.length === 0)
			this.initial_timeline = true;
		this.id = Class.generateRandomID(DALS.Timeline);
		this.name = (options.name) ? options.name : `Timeline ${this.id}`;
		this.parent_timeline = options.parent_timeline;
		this.value = [DALS.Timeline.saveState()];
		
		//Ensure that the current timeline is always the last timeline created/split off
		if (options.current_timeline !== false)
			DALS.Timeline.current_timeline = this;
		DALS.Timeline.instances.push(this);
	}
	
	addAction (arg0_json) {
		//Convert from parameters
		let json = JSON.stringify(arg0_json);
		
		//Declare local instance variables
		let new_action = new DALS.Action(json);
			new_action.timeline = this.id;
		
		//Push action to timeline
		this.value.push(new_action);
	}
	
	branch (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let new_timeline = new DALS.Timeline(options);
			new_timeline.parent_timeline = this.id;
		
		//Return statement
		return new_timeline;
	}
	
	delete () {
		
	}
	
	/**
	 * Jumps to a specific action ID in the timeline, starting from its head, utilising .parseAction()
	 * 
	 * @param arg0_action_id
	 */
	jumpToAction (arg0_action_id) {
		
	}
	
	jumpToEnd () {
		
	}
	
	jumpToStart () {
		
	}
	
	removeAction (arg0_action_id) {
		
	}
	
	static getTimeline (arg0_timeline_id) {
		
	}
	
	static load (arg0_file_path) {
		
	}
	
	static loadState (arg0_json) {
		
	}
	
	static jumpToTimeline (arg0_timeline_id) {
		
	}
	
	static parseAction (arg0_json) {
		
	}
	
	static save (arg0_file_path) {
		
	}
	
	static saveState () {
		
	}
};