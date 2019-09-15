import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	private form: FormGroup;

  constructor(private userService: UserService, 
  			  private authService: AuthService,
  			  private router: Router) { }

  ngOnInit() {
  	this.form = new FormGroup({
  		'username': new FormControl(null, [Validators.required, Validators.email]),
  		'password': new FormControl(null, [Validators.minLength(6), Validators.required])
  	});
  }

  onSubmit(){
  	const formData = this.form.value;

  	this.userService.getUserNameByUser(formData.username)
  					.subscribe((user: User) => {
  						if(user){
  							if(user.password === formData.password){
	  						window.localStorage.setItem('user', JSON.stringify(user));
  							this.authService.login();
			                this.router.navigate(['/system', 'employee', `${formData.username}`]);
			                console.log('You login the system');
  							}
  							else {
  								console.log('Wrong password');
  							}
  						}
  						else {
  							console.log('Wrong username');
  						}
  					});
  }


}
