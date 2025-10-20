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
	HTML.applyCSSStyleObject = function (arg0_el, arg1_style_obj) {
		//Convert from parameters
		let el = (typeof arg0_el === "object") ? arg0_el : document.querySelector(arg0_el);
		let style_obj = (arg1_style_obj) ? arg1_style_obj : {};
		
		//Internal guard clause if el is not defined
		if (!el) return;
		
		//Declare local instance variables
		let mutated_style_obj = structuredClone(style_obj);
		let { static: staticStyles, dynamic: dynamicStyles } = HTML.splitStaticDynamic(mutated_style_obj);
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
				let targets = HTML.resolveSelector(el, local_key);
				
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
				let targets = HTML.resolveSelector(el, local_key);
				
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
	HTML.resolveSelector = function (arg0_el, arg1_selector) {
		//Convert from parameters
		let el = arg0_el;
		let selector = arg1_selector;
		
		//Declare local instance variables
		let parent_match = selector.match(/^:nth-parent\((\d+)\)$/);
		
		if (parent_match) {
			let n = parseInt(parent_match[1]);
			let target = el;
			
			//While loop until parent element is found
			while (n-- > 0 && target.parentElement) 
				target = target.parentElement;
			
			//Return statement
			return target ? [target] : [];
		}
		
		//Return statement; normal descendant functions
		try {
			return Array.from(el.querySelectorAll(selector));
		} catch (e) {
			return [];
		}
	}
	
	/**
	 * Splits static and dynamic properties into two trees.
	 */
	HTML.splitStaticDynamic = function (arg0_object) {
		//Convert from parameters
		let object = arg0_object;
		
		//Declare local instance variables
		let static_obj = {};
		let dynamic_obj = {};
		
		//Iterate over all values in object
		Object.iterate(object, (local_key, local_value) => {
			if (typeof local_value === "object" && !Array.isArray(local_value)) {
				let nested = HTML.splitStaticDynamic(local_value);
				
				static_obj[local_key] = nested.static;
				dynamic_obj[local_key] = nested.dynamic;
			} else if (typeof local_value === "function") {
				dynamic_obj[local_key] = local_value;
			} else {
				static_obj[local_key] = local_value;
			}
		});
		
		//Return statement
		return {
			dynamic: dynamic_obj,
			static: static_obj
		};
	}
}
