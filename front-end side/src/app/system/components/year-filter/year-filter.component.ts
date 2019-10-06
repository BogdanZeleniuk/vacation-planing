import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Vacation } from '../../../shared/models/vacation.model';

@Component({
  selector: 'app-year-filter',
  templateUrl: './year-filter.component.html',
  styleUrls: ['./year-filter.component.css']
})
export class YearFilterComponent {

	@Output()onFilterCancel = new EventEmitter<any>();
	@Output()onFilterApply = new EventEmitter<any>();

	selectedPeriod = '2019';
	timePeriods = [{
		year: '2017',
		label: '2017'
	},
	{
		year: '2018',
		label: '2018'
	},
	{
		year: '2019',
		label: '2019'
	}];

	@Input() vacations: Vacation [] = [];

  	closeFilter(){
  		this.selectedPeriod = '2019';
  		this.onFilterCancel.emit();
  	}
  	applyFilter(){
  		this.onFilterApply.emit({
  			period: this.selectedPeriod
  		});
  	}
}
