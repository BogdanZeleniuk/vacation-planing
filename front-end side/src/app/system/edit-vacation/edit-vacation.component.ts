import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { Observable, Subscription } from 'rxjs/Rx';

import { Vacation } from '../../shared/models/vacation.model';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { VacationService } from '../shared/vacation.service';

@Component({
  selector: 'app-edit-vacation',
  templateUrl: './edit-vacation.component.html',
  styleUrls: ['./edit-vacation.component.css']
})
export class EditVacationComponent implements OnInit {

	@Input() users: User[];
	@Input() vacations: Vacation[];
	@Input() vacation: Vacation;
	user: User;
	subscription: Subscription;

	@Output() onVacationEdit = new EventEmitter<User>();

	private form: FormGroup;

  constructor(
  			private userService: UserService,
  			private vacationService: VacationService
  			) { }

  ngOnInit() {
  	this.form = new FormGroup({
  		'start_vacation': new FormControl(null, [Validators.required]),
  		'end_vacation': new FormControl(null, [Validators.required]),
  		'description': new FormControl(null, [Validators.required]),
  	});
  	this.user = this.userService.getUserByUserName(this.users);
  }

  onSubmit(){
  	const formData = this.form.value;
  	let editedVacation = {
  		id: this.vacation.id, 
  		start_vacation: formData.start_vacation, 
  		end_vacation: formData.end_vacation, 
  		description: formData.description};

  	let daysDifference = this.vacationService.getAmountOfSelectedDays(this.vacation) - 
				this.vacationService.getAmountOfSelectedDays(formData);
		if(daysDifference > 0){
			if((this.user.vacationDays[1].usedDays - daysDifference) > 0){
				this.user.vacationDays[1].usedDays = (this.user.vacationDays[1].usedDays - daysDifference);
			}
			else{
				this.user.vacationDays[1].usedDays = 0;
				this.user.vacationDays[0].usedDays = this.user.vacationDays[0].usedDays + 
									(this.user.vacationDays[1].usedDays - daysDifference);
			}
		}
		else if(daysDifference < 0){
			if((this.user.vacationDays[1].currentYearVacationDays - this.user.vacationDays[1].usedDays) + 
				(this.user.vacationDays[0].previousYearVacationDays - this.user.vacationDays[0].usedDays) > (-1*daysDifference)){
				if((this.user.vacationDays[0].usedDays - this.user.vacationDays[0].previousYearVacationDays) === 0){
					this.user.vacationDays[1].usedDays = this.user.vacationDays[1].usedDays - daysDifference;
				}
				else{
					let restDaysFromLastYear = this.user.vacationDays[0].usedDays - this.user.vacationDays[0].previousYearVacationDays; 
					this.user.vacationDays[0].usedDays = this.user.vacationDays[0].previousYearVacationDays;
					this.user.vacationDays[1].usedDays = daysDifference - restDaysFromLastYear;
				}
			}
			else{
				console.log('Too many days for vacation');
			}
		}
		else{
			console.log("no changes!");
		}

	this.subscription = this.userService
  			.editVacation(this.vacation.id, this.user.username, editedVacation)
  			.subscribe((vacation) => {
  				this.vacation.start_vacation = vacation.start_vacation;
  				this.vacation.end_vacation = vacation.end_vacation;
  				this.vacation.description = vacation.description;
  				this.onVacationEdit.emit(this.user);
  		});
	}

	ngOnDestroy(){
  		if(this.subscription) this.subscription.unsubscribe();
  	}
}
