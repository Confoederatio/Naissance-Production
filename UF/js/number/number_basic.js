//Initialise methods
{
	/**
	 * Generates a random number between [arg0_min, arg1_max].
	 *
	 * @param {number} arg0_min
	 * @param {number} arg1_max
	 * @param {Object} [arg2_options]
	 *  @param {boolean} [arg2_options.do_not_round]
	 *
	 * @returns {number}
	 */
	Math.randomNumber = function (arg0_min, arg1_max, arg2_options) {
		//Convert from parameters
		let min = arg0_min;
		let max = arg1_max;
		let options = (arg2_options) ? arg2_options : {
			do_not_round: false
		};
		
		//Declare local instance variables
		let random_number = Math.random()*(max - min) + min;
		
		//Return statement
		return (!options.do_not_round) ? Math.round(random_number) : random_number;
	};
}