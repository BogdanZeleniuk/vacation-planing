import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})  

export class VacationService{

	isBusinessDay(day){
		if(day.getDay() == 6 || day.getDay() == 0){
			return false;
		}
		return true;
	}

	getDaysInPeriod(startDate, endDate){
		const dates = [];

    	let currentDate = new Date(
        	startDate.getFullYear(),
        	startDate.getMonth(),
        	startDate.getDate()
    	);

    	while (currentDate <= endDate) {
        	dates.push(currentDate);

        	currentDate = new Date(
            	currentDate.getFullYear(),
            	currentDate.getMonth(),
            	currentDate.getDate() + 1
        	);
    	}

    	return dates;
	}

	getBusinessDaysInVacation(vacationPeriod){
		let correctedVacation = [];
		vacationPeriod.forEach((vacationsDay) => {
			if(this.isBusinessDay(vacationsDay)){
				correctedVacation.push(vacationsDay);
			}
		});

		return correctedVacation;
	}

	getAmountOfSelectedDays(formFromPage){

		let startDate = new Date(formFromPage.start_vacation.split('-')[0],
				(formFromPage.start_vacation.split('-')[1]-1),
				formFromPage.start_vacation.split('-')[2]);

		let endDate = new Date(formFromPage.end_vacation.split('-')[0],
				(formFromPage.end_vacation.split('-')[1]-1),
				formFromPage.end_vacation.split('-')[2]);
		
  		return this.getBusinessDaysInVacation(this.getDaysInPeriod(startDate, endDate)).length;
  	}

 	 getAvailableVacationDays(user){
  		return +(user.vacationDays[0].previousYearVacationDays - user.vacationDays[0].usedDays) + 
  			+(user.vacationDays[1].currentYearVacationDays - user.vacationDays[1].usedDays)
  	}

	getRestDaysPreviousYear(user){
	  	return +(user.vacationDays[0].previousYearVacationDays - user.vacationDays[0].usedDays);
	}

	changePreviousYearUserDays(user, daysSelect, restDays){
	  	user.vacationDays[0].usedDays += (daysSelect - restDays);
	}

	changeCurrentYearUserDays(user, restDays){
	  	user.vacationDays[1].usedDays += restDays;
	}

	changePreviousYearUserDaysIfAllAvailable(user, restDays){
	  	user.vacationDays[0].usedDays += restDays;
	}

	writeVacationId(vacationsList){
	  	if(vacationsList.length === 0){
	  		return 0;
	  	} else {
	  		return vacationsList[vacationsList.length-1].id+1;
	  	}
	}
}