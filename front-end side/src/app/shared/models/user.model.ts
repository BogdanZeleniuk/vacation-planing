import { Vacation } from './vacation.model'

export class User{
	constructor(
		public username: string,
		public password: string,
		public name: string,
		public employment_date: string,
		public vacationDays: [],
		public vacations: Vacation []
	){}
}