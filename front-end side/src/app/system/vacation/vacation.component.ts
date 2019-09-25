import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';


import { User } from '../../shared/models/user.model';
import { Vacation } from '../../shared/models/vacation.model';
import { UserService } from '../../shared/services/user.service';
import { VacationService } from '../shared/vacation.service';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css']
})
export class VacationComponent implements OnInit {

	constructor(
  			private router: Router, 
  			private userService: UserService,
  			private vacationService: VacationService
  			) { }

	private form: FormGroup;
	@Input() users: User [] = [];
	@Input() vacations: Vacation [] = [];
	@Output() onVacationAdd = new EventEmitter<Vacation>();
	@Output() onVacationUpdate = new EventEmitter<User>();
	user: User;
	vacation: Vacation;
	subscription: Subscription;

  ngOnInit() {
  	this.form = new FormGroup({
  		'start_vacation': new FormControl(null, [Validators.required]),
  		'end_vacation': new FormControl(null, [Validators.required]),
  		'description': new FormControl(null, [Validators.required]),
  	});
  }

  onSubmit(){
  	const formData = this.form.value;
  	this.user = this.userService.getUserByUserName(this.users);

  	if(this.vacationService.getAvailableVacationDays(this.user) - this.vacationService.getAmountOfSelectedDays(formData) >= 0){
  		this.vacation = new Vacation(
  			this.vacationService.writeVacationId(this.vacations),
  			formData.start_vacation,
  			formData.end_vacation,
  			formData.description
  		);
  		this.user.vacations.push(this.vacation);

  		let restOfDaysToUse = 0;

  		if(this.vacationService.getRestDaysPreviousYear(this.user) < this.vacationService.getAmountOfSelectedDays(formData)){
  			restOfDaysToUse = this.vacationService.getAmountOfSelectedDays(formData) - this.vacationService.getRestDaysPreviousYear(this.user);

  		this.vacationService.changePreviousYearUserDays(this.user, this.vacationService.getAmountOfSelectedDays(formData), restOfDaysToUse);
  		this.vacationService.changeCurrentYearUserDays(this.user, restOfDaysToUse);

  		} else {
  			restOfDaysToUse = this.vacationService.getAmountOfSelectedDays(formData);
  			this.vacationService.changePreviousYearUserDaysIfAllAvailable(this.user, restOfDaysToUse);
  		}
  		this.subscription = this.userService.updateUser(this.user).subscribe((resp) => {
			this.onVacationAdd.emit(this.vacation);
			this.onVacationUpdate.emit(this.user);
			formData.description = '';
		});
  	}
  	else{
  		console.log('You can not add this vacation');
  	}
  }

  ngOnDestroy(){
  		if(this.subscription) this.subscription.unsubscribe();
  	}

}
