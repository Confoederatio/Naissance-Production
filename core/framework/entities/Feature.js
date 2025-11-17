if (!global.naissance) global.naissance = {};
naissance.Feature = class extends ve.Class {
	static instances = [];
	
	constructor () {
		//Convert from parameters
		super();
		this.id = Class.generateRandomID(naissance.Feature);
		this.instance = this;
		this.is_naissance_feature = true;
		
		//Initialise this.options
		if (!this.options) this.options = {};
			this.options.instance = this;
		
		//Push to naissance.Feature.instances
		naissance.Feature.instances.push(this);
		if (main.brush.selected_feature) {
			this.parent = main.brush.selected_feature;
			main.brush.selected_feature.entities.push(this);
		}
	}
};