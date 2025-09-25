//Initialise functions
{
	if (!global.HTML) global.HTML = {};
	
	HTML.initialise = function () {
		document.addEventListener("mousemove", (e) => {
			HTML.mouse_x = e.clientX;
			HTML.mouse_y = e.clientY;
		});
	};
}