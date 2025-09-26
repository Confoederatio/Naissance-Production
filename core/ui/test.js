setTimeout(() => {
	global.Test = class Test extends ve.Class {
		constructor () {
			super();
			
			this.interface = new ve.Interface({
				test: new ve.Number(5, { name: "Test Number" }),
				more_interface: new ve.Interface({
					help: new ve.Number(1),
					colour: new ve.Colour([255, 255, 255], { name: "Colour" })
				}, { name: "More UI" })
			}, { open: true })
			super.open("instance", { name: "Help" });
			
			setInterval(() => {
				console.log(this.interface.v.test.v);
			}, 3000);
		}
	}
});
