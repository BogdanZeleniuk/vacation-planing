import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';


import { User } from '../../../shared/models/user.model';
import { Vacation } from '../../../shared/models/vacation.model';
import { UserService } from '../../../shared/services/user.service';
import { VacationService } from '../../shared/vacation.service';
import { Message } from '../../../shared/models/message.model';

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
  message: Message;

  ngOnInit() {
    this.message = new Message('danger', '');
  	this.form = new FormGroup({
  		'start_vacation': new FormControl(null, [Validators.required]),
  		'end_vacation': new FormControl(null, [Validators.required]),
  		'description': new FormControl(null, [Validators.required]),
  	});
  }

  private showMessage(message: Message){
    this.message = message;
    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
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

        this.user.vacationDays[0].usedDays = this.user.vacationDays[0].previousYearVacationDays;
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
      this.showMessage({
        text: 'Too many days for vacation',
        type: 'danger'
      });
  	}
  }

  ngOnDestroy(){
  		if(this.subscription) this.subscription.unsubscribe();
  	}

}
