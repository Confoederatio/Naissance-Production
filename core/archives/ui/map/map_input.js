if (!global.Map) global.Map = {};

//Keyboard handling
{
	Map.initialiseKeyboardHandlers = function () {
		
	};
}

//Mouse handling
{
	Map.initialiseMouseHandlers = function () {
		map.addEventListener("click", (e) => {
			if (Map.brush_context_menu)
				Map.brush_context_menu.remove();
		});
		
		map.addEventListener("contextmenu", (e) => {
			if (Map.brush_context_menu)
				Map.brush_context_menu.remove();
			Map.brush_context_menu = new MapContextMenu();
		});
	};
}