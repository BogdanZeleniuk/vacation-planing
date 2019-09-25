import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { SystemComponent } from './system.component';
import { EditVacationComponent } from './edit-vacation/edit-vacation.component';
import { AuthGuard } from '../shared/services/auth.guard';

const routes: Routes = [{
	path: '', component: SystemComponent, canActivate: [AuthGuard], children: [
		{path: 'employee/:username', component: UserComponent},
		{path: 'employee/:username/:vacationId', component: EditVacationComponent}
	]
}]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SystemRoutingModule{}