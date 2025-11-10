global.UI_LeftbarHierarchy = class { //[WIP] - Finish naissance.Feature first
	constructor () {
		this.groups = {};
		this.items = {};
		this.value = veHierarchy({
			layer: new ve.HierarchyDatatype({
				sample_button: veButton(() => { console.trace("Clicked!"); }, { name: `<icon>close</icon>` })
			}, { name: "Test" })
		});
	}
};