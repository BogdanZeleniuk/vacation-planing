import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

	today: Date = new Date();
	user: User;

  constructor(
          private authService: AuthService, 
          private router: Router, 
          private userService: UserService) { }

  ngOnInit() {

  	this.userService
              .getUserByUserNameFromDB(JSON.parse(window.localStorage.getItem('user')).username)
              .subscribe((user: User) => {
                  this.user = user[0];
    });
  }

  onLogout(){
  	this.authService.logout();
  	this.router.navigate(['/login']);
  }
}
