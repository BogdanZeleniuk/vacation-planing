import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService{

	private uri = 'http://localhost:3000';

	constructor(public http: HttpClient){}

	getUsers(): Observable<User []>{
		return this.http.get<User []>(`${this.uri}/system/employee`);
	};

	getUserNameByUser(username: string): Observable<User>{
		return this.http.get<User>(`${this.uri}/login?username=${username}`)
		.pipe(map((user:User) => {
			if(user[0]) {return user[0]}
			else { return undefined} }));
	}

	addUser(username, password, name, employment_date): Observable<any>{
		const user = {
			username: username,
			password: password,
			name: name,
			employment_date: employment_date
		};
		return this.http.post(`${this.uri}/system/employee/add`, user);
	}

  	getUserByUserName(usersArray){
  		return usersArray.find(user => user.username === JSON.parse(window.localStorage.getItem('user')).username); 
  	}

  	getUserByUserNameFromDB(username: string): Observable<User>{
  		return this.http.get<User>(`${this.uri}/system/employee/${username}`);
  	}

	updateUser(user: User): Observable<User>{
		return this.http.post<User>(`${this.uri}/system/employee/${user.username}`, user);
	}

	deleteVacation(user, idVacation):Observable<void> {
		return this.http.delete<void>(`${this.uri}/system/employee/${user.username}/${idVacation}`);
	}

	getIndexOfArrayByIdElement(id, vacationsArray) {
		for (let i = 0; i < vacationsArray.length; i++) {
			if (vacationsArray[i].id === id) {
				return i;
			}
		}
	}

	getVacationById(id, listOfVacations){
		for(let i = 0; i < listOfVacations.length; i++){
			if(listOfVacations[i].id === id){
				return listOfVacations[i];
			}
		}
	}
}