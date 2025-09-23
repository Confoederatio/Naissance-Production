setTimeout(() => {
	ve.Interface = class veInterface extends ve.Component {
		constructor (arg0_components_obj, arg1_options) {
			super();
			
			//Convert from parameters
			let components_obj = arg0_components_obj;
			let options = (arg1_options) ? arg1_options : {};
			
			//Declare local instance variables
			this.dimensions = [0, 0]; //Populate this.dimensions to [width, height];
			this.element = document.createElement("span");
			
			let html_string = [];
			html_string.push(`<table></table>`);
			
			this.element.innerHTML = html_string.join("");
			
			//Iterate over all keys in components_obj that .is_vercengen_component to find max dimensions needed for the table before invoking this.resize()
		}
		
		/**
		 * Iterates over al components and assigns their coordinates.
		 * @param {Object} arg0_components_obj
		 */
		static assignComponentCoordinates (arg0_components_obj) {
			//Convert from parameters
			let components_obj = arg0_components_obj;
			
			//Declare local instance variables
			
			//1. Fetch defined_dimensions [width, height]
			
			//2. Append undefined coordinates vertically to their relevant X or Y axis, depending on which is defined. Vertical stacking with X = 0 defined by default
		}
		
		resize (arg0_width, arg1_height) {
			//Convert from parameters
			let width = parseInt(arg0_width);
			let height = parseInt(arg1_height);
			
			//Declare local instance variables
			let table_el = this.element.querySelector("table");
			
			//Adjust height
			{
				//1. Add missing rows
				let current_height = table_el.rows.length;
				
				//Iterate over height to insert missing rows
				for (let i = current_height; i < height; i++) {
					let local_row = table_el.insertRow();
					
					//Iterate over width to populate the given row
					for (let x = 0; x < width; x++)
						local_row.insertCell();
				}
				
				//2. Remove extra rows
				for (let i = table_el.rows.length - 1; i >= height; i--)
					table_el.deleteRow(i);
			}
			
			//Adjust width
			{
				//1. Add missing columns
				let current_height = Math.min(height, table_el.rows.length); //Bound current_height so that we never go out of bounds
				
				for (let i = 0; i < current_height; i++) {
					let local_row = table_el.rows[i];
					
					let current_width = local_row.cells.length;
					
					for (let x = current_width; x < width; x++)
						local_row.insertCell();
					
					//2. Remove missing columns
					for (let x = current_width - 1; x >= width; x--)
						table_el.deleteCell(x);
				}
			}
			
			//Assign x, y IDs to each cell
			for (let i = 0; i < table_el.rows.length; i++)
				for (let x = 0; x < table_el.rows[i].cells.length; x++)
					table_el.rows[i].cells[x].id = `${x}-${i}`;
		}
	};
}, 0);