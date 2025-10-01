global.Test = class Test extends ve.Class {
	constructor () {
		super();
		
		this.interface = new ve.Interface({
			test: new ve.Number(5, { name: "Test Number" }),
			date_test: new ve.Date(),
			date_length: new ve.DateLength(),
			datalist: new ve.Datalist({
				one: "1",
				two: "2",
				three: "3",
				selected: "three"
			}),
			more_interface: new ve.Interface({
				help: new ve.Number(1),
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
			}, { name: "More UI" })
		}, { open: true })
		super.open("instance", { name: "Help" });
		
		setInterval(() => {
			console.log(this.interface.v.test.v);
		}, 3000);
	}
}