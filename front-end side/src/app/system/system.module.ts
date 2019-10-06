import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemComponent } from './system.component';
import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from '../system/components/user/user.component';
import { VacationComponent } from '../system/components/vacation/vacation.component';
import { VacationService } from '../system/shared/vacation.service';
import { EditVacationComponent } from './components/edit-vacation/edit-vacation.component';
import { YearFilterComponent } from './components/year-filter/year-filter.component';

@NgModule({
	imports: [CommonModule, SystemRoutingModule, SharedModule],
	declarations: [SystemComponent, UserComponent, VacationComponent, EditVacationComponent, YearFilterComponent],
	providers: [VacationService]
})
export class SystemModule{}