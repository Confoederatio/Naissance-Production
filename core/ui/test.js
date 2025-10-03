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
				html: new ve.HTML(() => {
					//Declare local instance variables
					let html_string = [];
					let nestable_test_list = document.createElement("div");
					
					html_string.push(`<ol id = "test-list" class = "list ve-drag-disabled ve-hierarchy">
						<li data-id="1" data-foo="bar" class="item">Item 1</li>
						<li data-id="2" class="item nst-collapsed">Item 2
							<ol>
								<li data-id="3" class="item">Item 3</li>
								<li data-id="4" class="item nst-collapsed">Item 4
									<ol>
										<li data-id="5" class="item">Item 5</li>
										<li data-id="6" class="item">Item 6</li>
									</ol>
								</li>
							</ol>
						</li>
						<li data-id="7" class="item">Item 7</li>
						<li data-id="8" class="item">Item 8</li>
						<li data-id="9" class="item">Item 9</li>
						<li data-id="10" class="item">Item 10</li>
						<li data-id="11" class="item nst-collapsed">
							Item 11
							<ol>
								<li data-id="12" class="item">Item 12</li>
							</ol>
						</li>
					</ol>`);
					nestable_test_list.innerHTML = html_string.join("");
					setTimeout(() => {
						global.nestable = new Nestable(document.querySelector(`#test-list`), { 
							items: ".item" 
						});
						console.log(nestable);
					}, 500);
					
					//Return statement
					return nestable_test_list;
				}, { do_not_refresh: true }),
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