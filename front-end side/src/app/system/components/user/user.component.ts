import { Component, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { Vacation } from '../../../shared/models/vacation.model';
import { UserService } from '../../../shared/services/user.service';
import { VacationService } from '../../shared/vacation.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	isOpen: boolean = false;
	openEditBlock: boolean = false;
	filteredVacations: Vacation [] = [];
	isLoaded = false;	
	subscription: Subscription;
	isFilterVisible: boolean = false;

  constructor(
  			private userService: UserService,
  			private vacationService: VacationService,
  			private router: Router
  			){}
	
	@Output() users: User[] = [];
	user: User;
	@Output() vacations: Vacation[];
	@Output() vacation;

	ngOnInit(){
		this.subscription = Observable.combineLatest(
			this.userService.getUsers(),
			this.userService.getUserByUserNameFromDB(JSON.parse(window.localStorage.getItem('user')).username)
			).subscribe((data: [User[], User]) => {
			
				this.users = data[0] ? data[0] : null;
				this.user = data[1][0] ? data[1][0] : null;
				this.vacations = this.user.vacations;
				this.setOriginalVacations();
		});
		this.isLoaded = true;		
	}

	ngOnDestroy(){
  		if(this.subscription) this.subscription.unsubscribe();
  	}

	addVacation(){
		this.isOpen = !this.isOpen;
	}

	newVacationAdded(vacation: Vacation){
		this.vacations.push(vacation);
		this.setOriginalVacations();
	}

	onVacationUpdate(user: User){
			this.user.vacationDays[0].previousYearVacationDays = user.vacationDays[0].previousYearVacationDays;
			this.user.vacationDays[0].usedDays = user.vacationDays[0].usedDays;
			this.user.vacationDays[1].currentYearVacationDays = user.vacationDays[1].currentYearVacationDays;
			this.user.vacationDays[1].usedDays = user.vacationDays[1].usedDays;	
	}

	removeVacation(id){
		let answer = confirm('Do you wanna delete this vacation?');
		if(answer){

			let vacationElem = this.userService.getVacationById(id, this.user.vacations);
			let daysOfVacation = this.vacationService.getAmountOfSelectedDays(vacationElem);
			let restDays = (this.user.vacationDays[1].usedDays - daysOfVacation);

			this.vacations.splice(this.userService.getIndexOfArrayByIdElement(id, this.vacations), 1);
	
			if((this.user.vacationDays[1].usedDays - daysOfVacation) > 0){
				this.user.vacationDays[1].usedDays = (this.user.vacationDays[1].usedDays - daysOfVacation);
			}
			else {
				this.user.vacationDays[1].usedDays = 0;
				this.user.vacationDays[0].usedDays = this.user.vacationDays[0].usedDays + restDays;
			}

			this.userService
					.deleteVacation(this.user, id)
					.subscribe((data) => {});
			this.userService
					.updateUser(this.user)
					.subscribe((data) => {});

			this.setOriginalVacations();		

		} else {
			return;
		}
	}

	editVacation(id){
		this.openEditBlock = !this.openEditBlock;
		this.vacation = this.userService.getVacationById(id, this.user.vacations);
	}

	onVacationEdit(user: User){

		this.user.vacationDays[0].previousYearVacationDays = user.vacationDays[0].previousYearVacationDays;
		this.user.vacationDays[0].usedDays = user.vacationDays[0].usedDays;
		this.user.vacationDays[1].currentYearVacationDays = user.vacationDays[1].currentYearVacationDays;
		this.user.vacationDays[1].usedDays = user.vacationDays[1].usedDays;

		this.userService
					.updateUser(this.user)
					.subscribe((data) => {});
					
		this.setOriginalVacations();				
	}

	private toogleFilterVisibility(dir: boolean){
    	this.isFilterVisible = dir;
  	}

	setOriginalVacations(){
    	this.filteredVacations = this.vacations.slice();
  	}

  	openFilter(){
    	this.toogleFilterVisibility(true);
 	}

  	onFilterCancel(){
    	this.toogleFilterVisibility(false);
    	this.setOriginalVacations();
  	}

  	onFilterApply(filterData){
    	this.toogleFilterVisibility(false);
    	this.setOriginalVacations();

    	let filteredVacationsUpdated = [];

	    this.filteredVacations.forEach((vac) => {
	    	if(vac.start_vacation.split('-')[0] === filterData.period){
	    		filteredVacationsUpdated.push(vac);
	    	}
	    });
	    this.filteredVacations = filteredVacationsUpdated;
  }
}
