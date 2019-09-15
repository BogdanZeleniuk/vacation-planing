import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { VacationComponent } from '../vacation/vacation.component';

@NgModule({
	declarations: [
	    UserComponent, VacationComponent
	],
	imports: [
		CommonModule
	],
	exports: [VacationComponent]

})
export class UserModule{

}