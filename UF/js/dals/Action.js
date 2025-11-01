//Initialise class
if (!global.DALS) global.DALS = {};

DALS.Action = class {
	//Declare local static variables
	static instances = [];
	
	constructor (arg0_json) {
		//Convert from parameters
		let json = arg0_json;
		
		//Serialise/deserialise to JSON to ensure syntactic correctness
		if (typeof json !== "string") json = JSON.stringify(json);
		if (json === "string") json = JSON.parse(json);
		
		//Declare local instance variables
		this.id = Class.generateRandomID(DALS.Action);
		this.options = (json.options) ? json.options : {};
			this.name = (json.options.name) ? json.options.name : "New Action";
		this.timeline = undefined; //Populated upon .addAction()
		this.value = json;
		
		//Assign Action to DALS.Timeline
		if (!this.options.timeline) {
			//Assign to current_timeline
			DALS.Timeline.current_timeline.addAction(this);
		} else {
			//Assign to specified timeline
			DALS.Timeline.getTimeline(this.options.timeline).addAction(this);
		}
		DALS.Action.instances.push(this);
	}
	
	delete (arg0_options) {
		//Declare local instance variables
		let options = (arg0_options) ? arg0_options : {
			removed_from_timeline: false
		};
		
		//Iterate over DALS.Action.instances; delete rom DALS.Action.instances
		for (let i = 0; i < DALS.Action.instances.length; i++)
			if (DALS.Action.instances[i] === this) {
				DALS.Action.instances.splice(i, 1);
				break;
			}
		if (!options.removed_from_timeline)
			if (this.timeline)
				this.timeline.removeAction(this.id);
	}
	
	jumpTo () {
		this.timeline.jumpToAction(this.id);
	}
};