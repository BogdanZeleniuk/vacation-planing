import { CanActivate, 
	CanActivateChild, 
	ActivatedRouteSnapshot, 
	RouterStateSnapshot,
	Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';	

import { AuthService } from '../services/auth.service';	


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild{

	constructor(private authService: AuthService, private router: Router){}

	canActivate(
			next: ActivatedRouteSnapshot, 
			state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if(this.authService.isLoggedIn()){
			return true;
		}
		else{
			this.router.navigate(['/login']);
			return false;	
		}
    	return true;
    }

    canActivateChild(
    		route: ActivatedRouteSnapshot, 
    		state: RouterStateSnapshot): any {
    	return this.canActivate(route, state);
    }
}