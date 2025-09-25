setTimeout(() => {
	global.Test = class Test extends ve.Class {
		constructor () {
			super();
			
			this.number = new ve.Number(5, { name: "Test Number" });
			super.open("instance", { name: "Help" });
			
			setInterval(() => {
				console.log(this.number.v);
			}, 3000);
		}
	}
});
