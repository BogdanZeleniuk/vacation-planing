import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthComponent } from './auth.component';

const authRoutes: Routes = [
	{path: '', component: AuthComponent, children:[
		{path: 'login', component: LoginComponent},
		{path: 'registration', component: RegistrationComponent}
	]}
];

@NgModule({
	imports: [RouterModule.forChild(authRoutes)],
	exports: [RouterModule]
})
export class AuthRoutingModule{}