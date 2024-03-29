import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';


const routes: Routes = [
	{path: '', redirectTo: 'login', pathMatch: 'full'},
	{path: 'system', loadChildren: './system/system.module#SystemModule'},
	//{path: '**', component: NotFoundComponent} //error 404 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
