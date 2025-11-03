if (!global.naissance) global.naissance = {};
naissance.Geometry = class extends ve.Class {
	static instances = [];
	
	constructor () {
		//Convert from parameters
		super();
		this.history = new naissance.History();
		this.id = Class.generateRandomID(naissance.Geometry);
		
		//Define naissance.Geometry contract
		
		/** @type {maptalks.Geometry|undefined} */
		this.geometry = undefined;
		/** @type {maptalks.Label|undefined} */
		this.label = undefined;
		this.selected = false;
		/**
		 * Mirror of: {@link this.geometry}
		 * @type {maptalks.Geometry|undefined} 
		 */
		this.selected_geometry = undefined;
		/**
		 * Holds the currently rendered keyframe at this date.
		 * @type {naissance.HistoryKeyframe.value|undefined}
		 */
		this.value = undefined;
		
		//Push to naissance.Geometry.instances
		naissance.Geometry.instances.push(this);
	}
	
	static linter () {
		
	}
};