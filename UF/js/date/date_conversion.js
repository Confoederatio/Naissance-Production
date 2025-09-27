//Initialise functions
{
	Date.convertTimestampToDate = function (arg0_timestamp) {
		//Convert from parameters
		let timestamp = arg0_timestamp;
		
		//Internal guard clause if timestamp is already converted to date
		if (typeof timestamp === "object") return timestamp;
		
		//Declare local instance variables
		let date_obj = {};
		
		//Parse timestamp if in string form
		if (typeof timestamp === "string") {
			timestamp = timestamp.toString().replace("t_", "").replace("tz_", "");
			timestamp = parseInt(Math.numerise(timestamp));
		}
		
		//1. Calculate years
		date_obj.year = Math.floor(timestamp/(365.25*24*60));
		timestamp -= Date.convertTimestampToInt(Date.getTimestamp({ year: date_obj.year, month: 0, day: 0, hour: 0, minute: 0 }));
		let leap_years = Date.getLeapYearsBefore(date_obj.year);
		
		//2. Calculate months
		let number_of_days = timestamp/(24*60);
		
		date_obj.month = Date.getMonthsFromDays({ year: date_obj.year, month: 0, day: number_of_days, hour: 0, minute: 0});
		timestamp -= Date.getDaysInMonths({ year: date_obj.year, month: date_obj.month, day: 0, hour: 0, minute: 0});
		
		if (date_obj.month > 12) {
			date_obj.year++;
			date_obj.month = 1;
		}
		
		//3. Calculate days
		date_obj.day = Math.floor(timestamp/(24*60));
		timestamp -= date_obj.day*24*60;
		
		//4. Calculate hours
		date_obj.hour = Math.floor(timestamp/60);
		timestamp -= date_obj.hour*60;
		
		//5. Calculate minutes
		date_obj.minute = timestamp;
		
		//Return statement
		return date_obj;
	};
	
	Date.convertTimestampToInt = function (arg0_timestamp) {
		//Convert from parameters
		let timestamp = arg0_timestamp;
		
		//Return statement
		return parseInt(
			Math.numerise(timestamp.toString().replace("t_", "").replace("tz_", ""))
		);
	};
}