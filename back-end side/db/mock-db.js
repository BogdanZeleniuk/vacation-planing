class MockDb{

	addEntitiesIntoMongoDb(){
		let firstUser = {username: "user@gmail.com", password: "123456789", name: "user_1", employment_date: "01.01.2019", vacationDays: [
			{previousYearVacationDays: 0, usedDays: 0},
			{currentYearVacationDays: 21, usedDays: 0},
		], vacations: []};
		let secondUser = {username: "user@mail.ru", password: "123456789", name: "user_2", employment_date: "01.05.2018", vacationDays: [
			{previousYearVacationDays: 0, usedDays: 10},
			{currentYearVacationDays: 21, usedDays: 5},
		], vacations: []};
		let thirstUser = {username: "user@ukr.net", password: "123456789", name: "user_3", employment_date: "01.05.2019", vacationDays: [
			{previousYearVacationDays: 0, usedDays: 0},
			{currentYearVacationDays: 21, usedDays: 0},
		], vacations: []};
		let fourstUser = {username: "user@i.ua", password: "123456789", name: "user_4", employment_date: "01.03.2018", vacationDays: [
			{previousYearVacationDays: 0, usedDays: 18},
			{currentYearVacationDays: 21, usedDays: 0},
		], vacations: []};
		let fifthUser = {username: "user@ms.ua", password: "123456789", name: "user_5", employment_date: "01.01.2018", vacationDays: [
			{previousYearVacationDays: 0, usedDays: 0},
			{currentYearVacationDays: 21, usedDays: 0},
		], vacations: []};

		let usersList = [firstUser, secondUser, thirstUser, fourstUser, fifthUser];

		return this.addVacationDaysForPreviousYearIntoObject(usersList);
	}

	countBasicVacationDaysForPreviousYear(date){

  		 let currentDate = new Date();

  		 if ((currentDate.getFullYear() - +date.split('.')[2]) > 0) {

  		 	if (12 - +date.split('.')[1] >= 6 && 
  		 		12 - +date.split('.')[1] <= 8) {
  		 		return 10;
  		 	}
  		 	if (12 - +date.split('.')[1] > 8){
  		 		return 21;
  		 	}
  		 	return 0;
		}
		return 0;
	}

	addVacationDaysForPreviousYearIntoObject(users){
		for (let i = 0; i < users.length; i++) {
			users[i].vacationDays[0].previousYearVacationDays = this.countBasicVacationDaysForPreviousYear(users[i].employment_date);
		}
		return users;
	}
}

module.exports = MockDb;