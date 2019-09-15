import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemComponent } from './system.component';
import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from '../system/user/user.component';
import { VacationComponent } from '../system/vacation/vacation.component';
import { VacationService } from '../system/shared/vacation.service';
import { EditVacationComponent } from './edit-vacation/edit-vacation.component';

@NgModule({
	imports: [CommonModule, SystemRoutingModule, SharedModule],
	declarations: [SystemComponent, UserComponent, VacationComponent, EditVacationComponent],
	providers: [VacationService]
})
export class SystemModule{}