global.map = new maptalks.Map("map", {
	center: [51.505, -0.09],
	zoom: 5,
	/*spatialReference: {
		projection: 'EPSG:3857' // Ensure that both Maptalks and Leaflet use the same projection
	},*/
	baseLayer: new maptalks.TileLayer("base", {
		spatialReference: {
			projection:'EPSG:3857'
		},
		urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		subdomains: ["a", "b", "c"],
		repeatWorld: false
	})
});