import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})  

export class VacationService{

	getAmountOfSelectedDays(formFromPage){
  		return +(Date.parse(formFromPage.end_vacation) - Date.parse(formFromPage.start_vacation))/(1000*60*60*24);
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