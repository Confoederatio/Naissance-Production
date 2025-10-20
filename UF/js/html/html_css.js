//[WIP] - Refactor contents
//Initialise functions
{
	HTML.applyCSSStyle = function (arg0_el, arg1_style) {
		//Convert from parameters
		let el = (typeof arg0_el === "object") ? arg0_el : document.querySelector(arg0_el);
		let style = arg1_style;
		
		//Apply CSS style to el
		if (typeof style === "object") {
			HTML.applyCSSStyleObject(el, style);
		} else if (typeof style === "string") {
			el.setAttribute("style", style);
		}
	};
	
	/**
	 * Main function API
	 */
	HTML.applyCSSStyleObject = function (arg0_el, arg1_style_obj, arg2_options) {
		//Convert from parameters
		let el = (typeof arg0_el === "object") ? arg0_el : document.querySelector(arg0_el);
		let style_obj = (arg1_style_obj) ? arg1_style_obj : {};
		let options = (arg2_options) ? arg2_options : {};
		
		//Internal guard clause if el is not defined
		if (!el) return;
		
		//Declare local instance variables
		let mutated_style_obj = structuredClone(style_obj);
		let { static: staticStyles, dynamic: dynamicStyles } = splitStaticDynamic(mutated_style_obj);
		let registry = HTML.ve_css_registry;
		
		//Apply static styles once immediately; register or update in global registry
		HTML.applyStaticStyles(el, staticStyles);
		registry.set(el, { mutated_style_obj, dynamic: dynamicStyles });
	};
	
	/**
	 * Applies dynamic (function-based) styles recursively each frame.
	 */
	HTML.applyDynamicStyles = function (arg0_el, arg1_dynamic_obj) {
		//Convert from parameters
		let el = arg0_el;
		let dynamic_obj = arg1_dynamic_obj;
		
		//Iterate over all entries in style_obj
		Object.iterate(dynamic_obj, (local_key, local_value) => {
			if (typeof local_value === "object" && !Array.isArray(local_value)) {
				//Recursively invoke applyDynamicStyles
				let targets = resolveSelector(el, local_key);
				
				for (let local_target of targets) 
					HTML.applyDynamicStyles(local_target, local_value);
			} else if (typeof local_value === "function") {
				//Resolve computed_style from function, since this is a dynamic style
				let computed_style = local_value(el);
				
				if (computed_style !== undefined && computed_style !== null)
					el.style[local_key] = computed_style.toString();
			}
		});
	};
	
	/**
	 * Applies static (non-function) styles recursively, once.
	 */
	HTML.applyStaticStyles = function (arg0_el, arg1_style_obj) {
		//Convert from parameters
		let el = arg0_el;
		let style_obj = arg1_style_obj;
		
		//Iterate over all entries in style_obj
		Object.iterate(style_obj, (local_key, local_value) => {
			if (typeof local_value === "object" && !Array.isArray(local_value)) {
				let targets = resolveSelector(el, local_key);
				
				//Iterate over all targets to apply any static styles that might exist
				for (let local_target of targets) 
					HTML.applyStaticStyles(local_target, local_value);
			} else if (typeof local_value !== "function") {
				el.style[local_key] = local_value.toString();
			}
		});
	};
	
	/**
	 * Resolves a selector relative to an element.
	 * Supports :nth-parent(n) and normal query selectors.
	 */
	function resolveSelector(element, selector) {
		const parentMatch = selector.match(/^:nth-parent\((\d+)\)$/);
		if (parentMatch) {
			let n = parseInt(parentMatch[1]);
			let target = element;
			while (n-- > 0 && target.parentElement) target = target.parentElement;
			return target ? [target] : [];
		}
		
		// Normal descendant selectors
		try {
			return Array.from(element.querySelectorAll(selector));
		} catch (e) {
			console.warn("Invalid selector:", selector);
			return [];
		}
	}
	
	/**
	 * Splits static and dynamic properties into two trees.
	 */
	function splitStaticDynamic(obj) {
		const staticObj = {};
		const dynamicObj = {};
		
		for (const [key, val] of Object.entries(obj)) {
			if (typeof val === "object" && !Array.isArray(val)) {
				const nested = splitStaticDynamic(val);
				staticObj[key] = nested.static;
				dynamicObj[key] = nested.dynamic;
			} else if (typeof val === "function") {
				dynamicObj[key] = val;
			} else {
				staticObj[key] = val;
			}
		}
		
		return { static: staticObj, dynamic: dynamicObj };
	}
}
