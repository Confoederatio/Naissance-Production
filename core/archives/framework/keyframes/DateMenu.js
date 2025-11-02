global.DateMenu = class extends ve.Class {
	constructor () {
		super();
		this.interface = new ve.Interface({
			date: new ve.Date(undefined, {
				onchange: (e) => {
					History.loadDate(e.v);
				}
			})
		}, { name: "Date", open: true });
		this.openUI();
	}
	
	openUI () {
		super.open("instance", {
			anchor: "top_right",
			mode: "static_window",
			name: "Date",
			width: "24rem",
			x: 8,
			y: document.querySelector(".ve.navbar").offsetHeight + 8
		});
	}
};