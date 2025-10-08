//[WIP] - Restructure documentation at a later date
/**
 * Represents a ContextMenu Feature that contains a set of components. {@link ve.Window} instances are stored in `.windows`. Recursive.
 * 
 * The immediate {@link ve.Button} element bound to the ContextMenu instance is contained in `.element`.
 * @type {ve.ContextMenu}
 * 
 * ##### DOM:
 * - `.instance`: this:{@link ve.ContextMenu} - Applies to `this.element` only.
 */
ve.ContextMenu = class { //[WIP] - Finish class body
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		options.anchor = (options.anchor) ? options.anchor : "left";
		options.button_options = (options.button_options) ? options.button_options : {};
		options.mode = (options.mode) ? options.mode : "static_ui";
		options.x = (options.x !== undefined) ? options.x : HTML.mouse_x;
		options.y = (options.y !== undefined) ? options.y : HTML.mouse_y;
		
		//Declare local instance variables
		this.button = new ve.Button((e) => {
			this.close();
			this.open();
		}, options.button_options);
		this.components_obj = components_obj;
		this.element = this.button.element;
		this.options = options;
		this.windows = [];
	}
	
	addContextMenu (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		let options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		let actual_x;
			//Populate actual_x
			if (this.windows.length > 0) {
				actual_x = this.windows[0].element.offsetLeft;
			} else {
				actual_x = this.options.x;
			}
		let actual_y;
			//Populate actual_y
			if (this.windows.length > 0) {
				actual_y = this.windows[0].element.offsetTop;
			} else {
				actual_y = this.options.y;
			}
		let current_x_offset = this.getCurrentOffset();
			
		//Modify actual_x, actual_y
		if (this.options.anchor === "left") {
			actual_x += current_x_offset;
		} else if (this.options.anchor === "right") {
			actual_x -= current_x_offset;
		}
		
		//Create new ve.Window to represent the current context menu
		this.windows.push(new ve.Window(components_obj, {
			mode: this.options.mode,
			x: actual_x,
			y: actual_y,
			...options
		}));
	}
	
	close () {
		//Iterate over all open context menus to close them in this.windows
		for (let i = 0; i < this.windows.length; i++)
			this.windows[i].remove();
		this.windows = [];
	}
	
	getCurrentOffset () {
		//Declare local instance variables
		let offset_x = 0;
		
		//Iterate over all current windows in the context menu 
		for (let i = 0; i < this.windows.length; i++)
			offset_x += this.windows[i].element.offsetWidth;
		
		//Return statement
		return offset_x;
	}
	
	open () {
		//Open current context menu with bound this.components_obj
		this.addContextMenu(this.components_obj);
	}
	
	removeContextMenu (arg0_index) {
		//Convert from parameters
		let index = parseInt(arg0_index);
		
		//Attempt to remove the context menu from ve.Windows at the current index
		try {
			this.windows[index].remove();
			this.windows.splice(index, 1);
		} catch (e) {
			console.error(`ve.ContextMenu: The present index ${index} does not exist in this.windows:`, this.windows);
		}
	}
};