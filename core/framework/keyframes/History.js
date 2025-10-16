global.History = class extends ve.Class { //[WIP] - Finish class body
	constructor (arg0_keyframes_obj, arg1_options) {
		//Convert from parameters
		super();
		this.keyframes = (arg0_keyframes_obj) ? arg0_keyframes_obj : {};
		this.options = {
			components_obj: {},
			...arg1_options
		};
		
		//Declare local instance variables
		this.interface = new ve.Interface({}, { name: "Keyframes", width: 99 });
	}
	
	/**
	 * Adds a keyframe at the given date.
	 *
	 * @param {boolean|maptalks.Geometry} arg0_geometry - If of a boolean type false, geometry is resolved as being hidden for that keyframe.
	 * @param {Object} [arg1_options]
	 *  @param {Date} [arg1_options.date=main.date]
	 *  @param {Object} [arg1_options.geometry]
	 *  @param {Object} [arg1_options.properties]
	 *  @param {Object} [arg1_options.symbol]
	 *
	 * @returns {HistoryKeyframe}
	 */
	addKeyframe (arg0_geometry, arg1_options) {
		//Convert from parameters
		let geometry = (arg0_geometry) ? arg0_geometry : undefined;
			try { geometry = geometry.toJSON(); } catch (e) {}
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		if (options.date === undefined) options.date = structuredClone(main.date);
		
		//Declare local instance variables
		let timestamp = Date.getTimestamp(options.date);
		
		//Create a new keyframe, otherwise concatenate with existing options if history is already defined
		if (this.keyframes[timestamp] === undefined) {
			this.keyframes[timestamp] = new HistoryKeyframe(options.date, {
				geometry: geometry,
				...options
			});
		} else {
			let local_keyframe = this.keyframes[timestamp];
			
			//Handle geometry manually since it replaces the .geometry field
			if (geometry) 
				local_keyframe.setOptions({ geometry: geometry });
			local_keyframe.setOptions(options);
		}
		this.refresh();
		
		//Return statement
		return this.keyframes[timestamp];
	}
	
	cleanKeyframes () { //[WIP] - Finish function body, cleans un-necessary/duplicate keyframes
		
	}
	
	/**
	 * Fetches the keyframe at the selected date.
	 *
	 * @param {Object} [arg0_options]
	 *  @param {boolean} [arg0_options.absolute_keyframe=false] - Whether to fetch the absolute keyframe instead of the relative keyframe as concatenated.
	 *  @param {Object} [arg0_options.date=main.date] - The date at which to fetch the keyframe. User-selected date by default.
	 *
	 * @returns {{geometry: Object, properties: Object, symbol: Object}}
	 */
	getKeyframe (arg0_options) { //[WIP] - Finish function body, both .symbol and .properties should use the only available keyframe if only one keyframe is available for them
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.date === undefined) options.date = main.date;
		
		//Declare local instance variables
		let current_keyframe = {
			geometry: false,
			properties: {},
			symbol: {}
		};
		let timestamp = Date.getTimestamp(options.date);
		
		//1. Iterate over all keyframes in this.keyframes
		let all_keyframes = Object.keys(this.keyframes).sort().reverse();
		let property_override = [0, undefined];
		let symbol_override = [0, undefined];
		
		for (let i = 0; i < all_keyframes.length; i++) {
			let local_key = all_keyframes[i];
			let local_value = this.keyframes[all_keyframes[i]].options;
			
			if (Date.convertTimestampToInt(local_key) <= Date.convertTimestampToInt(timestamp))
				if (!options.absolute_keyframe) {
					if (local_value.geometry)
						current_keyframe.geometry = maptalks.Geometry.fromJSON(local_value.geometry);
					if (local_value.properties)
						current_keyframe.properties = {
							...current_keyframe.properties,
							...local_value.properties
						};
					if (local_value.symbol)
						current_keyframe.symbol = {
							...current_keyframe.symbol,
							...local_value.symbol
						};
				} else {
					current_keyframe = local_value;
				}
		}
		
		//2. Iterate over all keyframes in this.keyframes to assess if either current_keyframe.properties or current_keyframe.symbol should be overridden
		for (let i = 0; i < all_keyframes.length; i++) {
			let local_key = all_keyframes[i];
			let local_value = this.keyframes[all_keyframes[i]].options;
			
			if (local_value.properties) {
				if (Object.keys(local_value.properties) > 1)
					property_override[0]++;
				property_override[1] = local_value.properties;
			}
			if (local_value.symbol) {
				if (Object.keys(local_value.properties) > 1)
					symbol_override[0]++;
				symbol_override[1] = local_value.symbol;
			}
		}
		
		//Assign overrides where appropriate
		if (property_override[0] === 1) current_keyframe.properties = property_override[1];
		if (symbol_override[0] === 1) current_keyframe.symbol = symbol_override[1];
		
		//Return statement
		return current_keyframe;
	}
	
	/**
	 * Deletes a keyframe at the given date.
	 *
	 * @param {Object} [arg0_options]
	 *  @param {Date} [arg0_options.date=main.date]
	 */
	removeKeyframe (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.date === undefined) options.date = structuredClone(main.date);
		
		//Declare local instance variables
		let timestamp = Date.getTimestamp(options.date);
		
		//Remove keyframe if defined
		delete this.keyframes[timestamp];
		this.refresh();
	}
	
	//Date
	
	static loadDate (arg0_date_obj) {
		//Convert from parameters
		let date_obj = (arg0_date_obj) ? arg0_date_obj : main.date;
		
		//Declare local instance variables
		date_obj = Date.convertTimestampToDate(Date.getTimestamp(date_obj));
		
		//Handle Polygon, Line, Point
		Polygon.instances.forEach((local_polygon) => local_polygon.loadDate(date_obj));
	}
	
	//Deserialisation/Serialisation
	
	fromJSON (arg0_json) {
		
	}
	
	toJSON () {
		
	}
	
	//UI
	
	refresh () {
		//Declare local instance variables
		let components_obj = {};
		
		//Iterate over all this.keyframes
		let all_keyframes = Object.keys(this.keyframes).sort().reverse();
		
		for (let i = 0; i < all_keyframes.length; i++) {
			let local_key = all_keyframes[i];
			let local_value = this.keyframes[all_keyframes[i]];
			
			//Set components_obj
			components_obj[local_key] = new ve.RawInterface({
				date_info: new ve.HTML((e) => `${local_value.timestamp}`, { x: 0, y: 0 }),
				jump_to_date: new ve.HTML((e) => {
					let icon_el = document.createElement("icon");
						icon_el.innerHTML = `arrow_forward`;
						icon_el.addEventListener("click", (e) => {
							console.log(e);
						});
					return icon_el;
				}, { tooltip: "Jump to Date", style: { cursor: "pointer" } })
			}, { 
				name: String.formatDate(local_value.date),
				style: {
					display: "flex"
				}
			});
		}
		this.interface.v = components_obj;
	}
};