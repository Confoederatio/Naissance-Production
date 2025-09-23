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
				components_obj = ve.Interface.assignComponentCoordinates(components_obj);
				this.dimensions = ve.Interface.getDefinedComponentDimensions(components_obj);
				this.resize(this.dimensions[0] + 1, this.dimensions[1] + 1);
				
				//Populate x-y with individual Vercengen components in mutated components_obj
				Object.iterate(components_obj, (local_key, local_value) => {
					try {
						if (local_value.is_vercengen_component) {
							let target_cell_el = this.element.querySelector(`table td[id"=${local_value.x}-${local_value.y}"]`);
							
							target_cell_el.innerHTML = "";
							target_cell_el.appendChild(local_value.element);
						}
					} catch (e) { console.error(e); }
				});
			}
			
			/**
			 * Iterates over al components and assigns their coordinates.
			 * @param {Object} arg0_components_obj
			 */
			static assignComponentCoordinates (arg0_components_obj) {
				//Convert from parameters
				let components_obj = arg0_components_obj;
				
				//Declare local instance variables
				let defined_dimensions = ve.Interface.getDefinedComponentDimensions(components_obj);
				
				//2. Append undefined coordinates vertically to their relevant X or Y axis, depending on which is defined. Vertical stacking with X = 0 defined by default
				Object.iterate(components_obj, (local_key, local_value) => {
					try {
						if (local_value.is_vercengen_component) {
							let has_x = (typeof local_value.x === "number");
							let has_y = (typeof local_value.y === "number");
							
							if (has_x && has_y) return;
							
							if (!has_x && has_y) {
								defined_dimensions[0]++;
								local_value.x = defined_dimensions[0];
							} else if (has_x && !has_y) {
								defined_dimensions[1]++;
								local_value.y = defined_dimensions[1];
							} else {
								local_value.x = 0;
								
								defined_dimensions[1]++;
								local_value.y = defined_dimensions[1];
							}
						}
					} catch (e) { console.error(e); }
				});
				
				//Return statement
				return components_obj;
			}
			
			static getDefinedComponentDimensions (arg0_components_obj) {
				//Convert from parameters
				let components_obj = arg0_components_obj;
				
				//Declare local instance variables
				let defined_dimensions = [0, 0];
				
				//Fetch defined dimensions [width, height] by iterating over components_obj
				Object.iterate(components_obj, (local_key, local_value) => {
					try {
						if (local_value.is_vercengen_component)
							if (typeof local_value.x === "number" && typeof local_value.y === "number") {
								defined_dimensions[0] = Math.max(defined_dimensions[0], local_value.x);
								defined_dimensions[1] = Math.max(defined_dimensions[1], local_value.y);
							}
					} catch (e) { console.error(e); }
				});
				
				//Return statement
				return defined_dimensions;
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