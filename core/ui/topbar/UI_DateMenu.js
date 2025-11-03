global.UI_DateMenu = class extends ve.Class {
	constructor () {
		super();
		
		//Declare local instance variables
		let navbar_el = document.querySelector(".ve.navbar");
		
		this.interface = new ve.Interface({
			date: new ve.Date(undefined, {
				binding: "global.date",
				onchange: (e) => {
					History.loadDate(e.v);
				}
			})
		}, { name: "Date", open: true });
		super.open("instance", {
			anchor: "top_right",
			mode: "static_window",
			name: "Date",
			width: "24rem",
			x: 8,
			y: ((navbar_el) ? navbar_el.offsetHeight : 0) + 8
		});
	}
};