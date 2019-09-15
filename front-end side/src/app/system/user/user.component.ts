import { Component, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { Vacation } from '../../shared/models/vacation.model';
import { UserService } from '../../shared/services/user.service';
import { VacationService } from '../shared/vacation.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	isOpen: boolean = false;

  constructor(
  			private userService: UserService,
  			private vacationService: VacationService,
  			private router: Router
  			){}
	
	@Output() users: User[] = [];
	user: User;
	@Output() vacations: Vacation[];

	ngOnInit(){
		Observable.combineLatest(
			this.userService.getUsers(),
			this.userService.getUserByUserNameFromDB(JSON.parse(window.localStorage.getItem('user')).username)
			).subscribe((data: [User[], User]) => {
				console.log(data);
			this.users = data[0];
			this.user = data[1][0];
			this.vacations = this.user.vacations;
		});		
	}

	addVacation(){
		this.isOpen = !this.isOpen;
	}

	newVacationAdded(vacation: Vacation){
		this.vacations.push(vacation);
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
					.subscribe((data) => {
						console.log(data);
				});
			this.userService
					.updateUser(this.user)
					.subscribe((data) => {
						console.log(data);
					});

		} else {
			console.log("Delete rejection");
		}
	}

	editVacation(id){
		this.router.navigate(['/system', 'employee', `${this.user.username}`, `${id}`]);
	}
}
