import { Vacation } from './vacation.model'

export class User{
	constructor(
		public username: string,
		public password: string,
		public name: string,
		public employment_date: string,
		public vacationDays: [{previousYearVacationDays: number, usedDays: number}, 
								{currentYearVacationDays: number, usedDays: number}],
		public vacations: Vacation []
	){}
}