setTimeout(() => {
	global.Test = class Test extends ve.Class {
		constructor () {
			super();
			
			this.number = new ve.Number(5);
			super.open("instance");
			
			setInterval(() => {
				console.log(this.number.v);
			}, 3000);
		}
	}
});
