/**
 * Represents a Window Feature that contains a set of components which are wrapped inside an Interface.
 * @type {ve.Window}
 *
 * ##### DOM:
 * - `.instance`: this:{@link ve.Window}
 *
 * ##### Options:
 * - `arg0_components_obj`: {@link Object}<{@link ve.Component}>
 * - `arg1_options`: {@link Object}
 *   - `anchor="top_left"` - Either 'bottom_left'/'bottom_right'/'top_left'/'top_right'.
 *   - `height="12rem"`: {@link number}
 *   - `width="12rem"`: {@link number}
 *   - `x=HTML.mouse_x`: {@link number}
 *   - `y=HTML.mouse_y`: {@link number}
 *   -
 *   - `mode="window"`: {@link string} - Either 'static_ui'/'static_window'/'window'.
 *   - `name=""`: {@link string} - Auto-resolves to 'Window' instead if `.can_rename=true`.
 *   - `theme`: {@link string} - The CSS theme to apply to the Feature.
 *   -
 *   - `can_close`: {@link boolean}
 *   - `can_rename`: {@link boolean}
 *   - `draggable`: {@link boolean}
 *   - `headless`: {@link boolean}
 *   - `resizeable`: {@link boolean}
 */
ve.Window = class {
	//Declare local static variables
	static instances = [];
	
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		let is_coords_well_defined = (typeof options.x === "number" && typeof options.y === "number");
		if (options.mode === undefined)
			options.mode = (is_coords_well_defined) ? "static_ui" : "window";
		
		options.anchor = (options.anchor) ? options.anchor : "top_left";
		options.height = (options.height !== undefined) ? options.height : "12rem";
		options.width = (options.width !== undefined) ? options.width : "12rem";
		options.x = (options.x !== undefined) ? options.x : HTML.mouse_x;
		options.y = (options.y !== undefined) ? options.y : HTML.mouse_y;
		
		//Parse options
		let mode_behaviour = {
			static_ui: {
				can_close: false,
				can_rename: false,
				draggable: false,
				resizeable: false,
				headless: true,
				is_static: true
			},
			static_window: {
				can_close: false,
				can_rename: false,
				draggable: false,
				resizeable: false,
				headless: false,
				is_static: true
			},
			window: {
				can_close: true,
				can_rename: true,
				draggable: true,
				resizeable: true,
				headless: false,
				is_static: false
			}
		};
		options = {
			...mode_behaviour[options.mode],
			...options
		};
		
		options.name = (options.name) ? options.name : "";
			if (options.can_rename && options.name === "") options.name = `Window`;
			this.name = options.name;
			
		//Declare local instance variables
		this.options = options;
		
		this.components_obj = components_obj;
		this.element = document.createElement("div");
		this.id = Class.generateRandomID(ve.Window);
		this.x = options.x;
		this.y = options.y;
		
		//Adjust height/width, position
		{
			setTimeout(() => {
				this.setCoords(this.x, this.y);
				this.setSize(this.width, this.height);
			});
		}
		
		//Populate Window element
		this.element.instance = this;
		this.element.setAttribute("class", `ve window`);
		this.element.id = this.id;
		this.element.innerHTML = `
			${(!options.headless) ? `<div id = "feature-header" class = "feature-header">
				<span id = "window-name"${(this.options.can_rename) ? ` contenteditable = "plaintext-only"` : ""}>${this.name}</span>
			</div>` : ""}
			<div id = "feature-body" class = "feature-body"></div>
		`;
		this.element.style.zIndex = ve.Window.instances.length.toString();
		
		//Instantiate element handlers
		if (this.options.can_close && !this.options.headless) {
			let close_button = document.createElement("img");
				close_button.id = "close-button";
				close_button.src = `./UF/gfx/close_icon_dark.png`;
			this.element.querySelector(`#feature-header`).appendChild(close_button);
			
			close_button.onclick = () => {
				this.remove();
			};
		}
		if (!this.options.headless)
			HTML.createSection({
				selector: `.ve.window[id="${this.id}"] #feature-header, .ve.window[id="${this.id}"] #feature-body`
			});
		if (this.options.draggable) {
			this.element.classList.add("draggable");
			HTML.elementDragHandler(this.element, {
				is_resizable: (this.options.resizeable)
			});
		}
		
		//Push Window instance to ve.Window.instances
		this.refresh(this.components_obj);
		ve.window_overlay_el.appendChild(this.element);
		ve.Window.instances.push(this);
	}
	
	get v () {
		//Return statement
		return this.components_obj;
	}
	
	set v (arg0_components_obj) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		
		//Refresh local instance
		this.refresh(components_obj);
	}
	
	/**
	 * Returns the highest z-index over the set of all Windows in {@link ve.Window.instances}.
	 * @param {Object} [arg0_options]
	 *  @param {boolean} [arg0_options.return_object=false] - Whether to return a ve.Window instance.
	 *
	 * @returns {number|ve.Window}
	 */
	static getHighestZIndex (arg0_options) {
		//Convert from parameters
		let options= (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let highest_z_index = [-Infinity, undefined];
		
		//Iterate over all ve.Window.instances
		for (let i = 0; i < ve.Window.instances.length; i++) {
			let local_instance = ve.Window.instances[i];
			
			if (local_instance.getZIndex() > highest_z_index[0])
				highest_z_index = [local_instance.getZIndex(), local_instance];
		}
		
		//Return statement
		return (!options.return_object) ? highest_z_index[0] : highest_z_index[1];
	}
	
	/**
	 * Returns the current z-index of this {@link ve.Window}.
	 *
	 * @returns {number}
	 */
	getZIndex () {
		//Return statement
		return parseInt(getComputedStyle(this.element)["z-index"]);
	}
	
	/**
	 * Selects the current {@link ve.Window} instance, raising its z-index above all other Windows.
	 */
	select () {
		//Declare local instance variables
		let current_highest_z_index = ve.Window.getHighestZIndex() + 1;
		
		//Swap z-indices
		this.element.style.zIndex = current_highest_z_index.toString();
		ve.Window.normaliseZIndexes();
	}
	
	setCoords (arg0_x, arg1_y) {
		//Convert from parameters
		let x = parseInt(arg0_x);
		let y = parseInt(arg1_y);
		
		//Set element X, Y position
		this.element.style.position = "absolute";
		this.element.style.bottom = "";
		this.element.style.left = "";
		this.element.style.right = "";
		this.element.style.top = "";
		HTML.applyCSSStyleObject(this.element, {
			...HTML.getCSSPosition(this.options.anchor, x, y)
		});
	}
	
	setSize (arg0_width, arg1_height) {
		//Convert from parameters
		let width = parseInt(arg0_width);
		let height = parseInt(arg1_height);
		
		//Apply style
		HTML.applyCSSStyleObject({
			...HTML.getCSSSize(this.options.height, this.options.width)
		});
	}
	
	refresh (arg0_components_obj) {
		//Convert from parameters
		this.components_obj = arg0_components_obj;
		
		//Append all components in components_obj to this.element.querySelector("#feature-body")
		Object.iterate(this.components_obj, (local_key, local_value) => {
			let feature_body_el = this.element.querySelector(`#feature-body`);
			
			if (local_value.element) {
				local_value.element.id = local_key;
				feature_body_el.appendChild(local_value.element);
			}
		});
	}
	
	remove () {
		//Iterate over all instances in ve.Window.instances
		for (let i = 0; i < ve.Window.instances.length; i++)
			if (ve.Window.instances[i].id === this.id) {
				ve.Window.instances.splice(i, 1);
				break;
			}
		
		this.element.remove();
	}
};