global.UI_DateMenu = class extends ve.Class {
	constructor () {
		super();
		
		//Declare local instance variables
		let navbar_el = document.querySelector(".ve.navbar");
		this.date = veDate(undefined, {
			from_binding: "main.date",
			onuserchange: (v) => {
				DALS.Timeline.parseAction({
					options: { name: "Load Date", key: "load_date" },
					value: [{ type: "global", load_date: v }]
				});
			}
		});
		
		//Open UI
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