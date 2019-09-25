import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models/user.model';
import { Vacation } from '../../shared/models/vacation.model';

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

  	getUserByUserName(usersArray: User[]){
  		return usersArray.find(user => user.username === JSON.parse(window.localStorage.getItem('user')).username); 
  	}

  	getUserByUserNameFromDB(username: string): Observable<User>{
  		return this.http.get<User>(`${this.uri}/system/employee/${username}`);
  	}

	updateUser(user: User): Observable<User>{
		return this.http.post<User>(`${this.uri}/system/employee/${user.username}`, user);
	}

	deleteVacation(user: User, idVacation: number):Observable<void> {
		return this.http.delete<void>(`${this.uri}/system/employee/${user.username}/${idVacation}`);
	}

	editVacation(id: number, username: string, vacation: Vacation): Observable<Vacation>{
		return this.http.put<Vacation>(`${this.uri}/system/employee/${username}/${id}`, vacation);
	}

	getIndexOfArrayByIdElement(id: number, vacationsArray: Vacation []) {
		for (let i = 0; i < vacationsArray.length; i++) {
			if (vacationsArray[i].id === id) {
				return i;
			}
		}
	}

	getVacationById(id: number, listOfVacations: Vacation []){
		for(let i = 0; i < listOfVacations.length; i++){
			if(listOfVacations[i].id === id){
				return listOfVacations[i];
			}
		}
	}
}