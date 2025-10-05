global.Test = class Test extends ve.Class {
	constructor () {
		super();
		
		this.interface = new ve.Interface({
			confirm: veButton(),
			test: new ve.Number(5, { name: "Test Number" }),
			date_test: new ve.Date(),
			date_length: new ve.DateLength(),
			datalist: veDatalist({
				one: "1",
				two: "2",
				three: "3",
				selected: "three"
			}),
			more_interface: new ve.Interface({
				help: new ve.Number(1),
				 
				hierarchy: veHierarchy({
					test_one: veHierarchyDatatype({}, { name: "Test 1" }),
					test_two: veHierarchyDatatype({}, { name: "Test 2" }),
					test_three: veHierarchyDatatype({}, { name: "Test 3" }),
					subgroup: veHierarchyDatatype({
						test_four: veHierarchyDatatype({}, { name: "Test 4" })
					}, { name: "Subgroup", type: "group" } )
				}),
				
				colour: new ve.Colour([230, 20, 20], { name: "Colour" }),
				checkbox_land: new ve.Checkbox({
					"Checkbox 1": true,
					"Checkbox 2": false,
					"Checkbox 3": false,
					"Checkbox 4": {
						name: "Nested Checkboxes",
						checkbox_five: true,
						checkbox_six: false
					}
				})
			}, { name: "More UI", open: true })
		}, { open: true })
		super.open("instance", { name: "Help" });
		
		setInterval(() => {
			console.log(this.interface.test.v);
		}, 3000);
	}
}

setTimeout(() => {
	global.test = new Test();
}, 500);