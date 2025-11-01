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

//[WIP] - Finished most scaffolding, refer to AI for logic errors/double checking
DALS.Timeline = class {
	//Declare local static variables
	static current_index = 0;
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
		DALS.Timeline.current_index++;
		this.value.push(new_action);
	}
	
	branch (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let new_timeline = new DALS.Timeline(options);
			new_timeline.parent_timeline = [this.id, this.value.length - 1];
		
		//Return statement
		return new_timeline;
	}
	
	delete () {
		if (DALS.Timeline.instances.length <= 1) {
			//Simply clear the entire state since the last timeline is being removed
			this.value = [];
			delete DALS.Timeline.current_timeline;
			DALS.Timeline.instances = [];
			DALS.Timeline.loadState({});
		} else {
			//1. Reassign all branched timelines to this timeline's .parent_timeline
			for (let i = 0; i < DALS.Timeline.instances.length; i++) {
				let local_timeline = DALS.Timeline.instances[i];
				
				if (local_timeline.parent_timeline === this.id)
					local_timeline.parent_timeline = this.parent_timeline;
			}
			
			//2. If the current timeline is being removed, jump to this.parent_timeline index
			if (DALS.Timeline.current_timeline === this.id) {
				let parent_timeline_obj = DALS.Timeline.getTimeline(this.parent_timeline[0]);
					parent_timeline_obj.jumpToAction(this.parent_timeline[1]);
			}
			
			//3. Iterate over DALS.Timeline.instances; delete from DALS.Timeline.instances
			for (let i = 0; i < DALS.Timeline.instances.length; i++)
				if (DALS.Timeline.instances[i].id === this.id) {
					DALS.Timeline.instances.splice(i, 1);
					break;
				}
		}
	}
	
	/**
	 * Jumps to a specific action ID in the timeline, starting from its head, utilising .parseAction()
	 * 
	 * @param {number|string} arg0_action_id
	 */
	jumpToAction (arg0_action_id) {
		//Convert from parameters
		let action_id = arg0_action_id;
		
		//1. Cast index to action_id if typeof number, assuming that it is valid
		if (typeof action_id === "number")
			if (action_id <= this.value.length - 1)
				action_id = this.value[action_id].id;
		
		//2. Load initial state at head
		this.jumpToStart();
		
		//3. Redo actions starting from the state head using DALS.Timeline.parseAction() until we hit the target action ID
		for (let i = 1; i < this.value.length; i++) {
			DALS.Timeline.parseAction(this.value[i].value);
			if (this.value[i].id === action_id) break;
		}
	}
	
	jumpToEnd () {
		//Jump to action if there are actions to jump to, otherwise load state head
		if (this.value.length > 1) {
			this.jumpToAction(this.value[this.value.length - 1].id);
		} else {
			this.jumpToStart();
		}
	}
	
	jumpToStart () {
		//Load initial state
		DALS.Timeline.loadState(this.value[0]);
	}
	
	removeAction (arg0_action_id) {
		//Convert from parameters
		let action_id = arg0_action_id;
		
		//Declare local instance variables
		let action_index = -1;
		
		//1. Cast action_id to index, assuming that it is valid
		if (typeof action_id === "string") {
			//Iterate over all actions in this.value
			for (let i = 1; i < this.value.length; i++)
				if (this.value[i].id === action_id) {
					action_index = i;
					break;
				}
		} else {
			action_index = action_id;
		}
		
		//2. Go over all DALS.Timeline instances that branch from this timeline at an index greater or equal to the action being removed and set their new .parent_timeline to the end of the present timeline
		for (let i = 0; i < DALS.Timeline.instances.length; i++) {
			let local_timeline = DALS.Timeline.instances[i];
			
			if (local_timeline.parent_timeline && local_timeline.parent_timeline[0] === this.id)
				if (local_timeline.parent_timeline[1] >= action_index)
					local_timeline.parent_timeline[1] = action_index - 1;
		}
		
		//3. Splice all actions at and after the index from the current timeline
		if (action_index >= 1)
			for (let i = this.value.length - 1; i >= action_index; i--)
				this.value.splice(i, 1);
	}
	
	static getTimeline (arg0_timeline_id) {
		//Convert from parameters
		let timeline_id = arg0_timeline_id;
		
		//Internal guard clause if timeline_id is of type object
		if (typeof timeline_id === "object") return timeline_id;
		
		//Iterate over all .instances otherwise and return if the timeline ID is a match
		for (let i = 0; i < DALS.Timeline.instances.length; i++)
			if (DALS.Timeline.instances[i].id === timeline_id)
				//Return statement
				return DALS.Timeline.instances[i];
	}
	
	static load (arg0_file_path) {
		//Convert from parameters
		let file_path = arg0_file_path.toString();
		
		//Read file, then attempt to call DALS.Timeline.loadState() with it
		fs.readFile(file_path, "utf8", (err, data) => {
			if (err) {
				console.log(err);
				return;
			}
			DALS.Timeline.loadState(data);
		})
	}
	
	static loadState (arg0_json) {
		
	}
	
	static jumpToTimeline (arg0_timeline_id) {
		//Convert from parameters
		let timeline_id = arg0_timeline_id;
		
		//jumpToStart of target timeline
		DALS.Timeline.getTimeline(timeline_id).jumpTo();
	}
	
	static parseAction (arg0_json) {
		
	}
	
	static save (arg0_file_path) {
		//Convert from parameters
		let file_path = arg0_file_path.toString();
		
		//Declare local instance variables
		fs.writeFile(file_path, JSON.stringify(DALS.Timeline.saveState()), (err) => {
			if (err) console.error(err);
		});
	}
	
	static saveState () {
		
	}
};