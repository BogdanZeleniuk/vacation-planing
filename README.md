# ExistekNewTest

   To start ***Node.js server*** print "npm run dev" in your command line.   
   To start ***Angular*** print "ng serve" in your second command line.   
   The list of users in data base Mongo is:   
   * user - **user@gmail.com** (password **123456789**)   
   * user - **user@mail.ru** (password **123456789**)   
   * user - **user@ukr.net** (password **123456789**)   
   * user - **user@i.ua** (password **123456789**)   
   * user - **user@ms.ua** (password **123456789**)


Functional description 
It should consist of following pages:
   Login page - a page where employees can log in using username and password. It should also have “Remember me” checkbox and “Forgot password” link.
   Employee page - page where employee adds his vacations and see his/her vacation balance.
   Employee page should have the following elements:
   Available yearly balance (initial balance for now can be hardcoded to 21) - which displays how many days of vacation is available.
   Add vacation button - when pressed allows employee to set start and end date (using calendar control), text description and add new vacation. When vacation is added - it should be calculated how many business days is in it and if it is more than available balance - it should not allow to save vacation and show a warning message to a user.
   List of vacations with year filter - displays all vacations within specified year. Next to each vacation there should be “edit” and “remove” button. When you click remove button - confirmation message is shown and vacation is deleted. When edit button is pressed - it allows you to edit start, end date and description.
   Logout button.
Additional information
   No need to implement admin panel for adding users and so on. Just add a few test users directly into database.
   Vacation balance from previous year is added to the next year. Each employee record has “employment date” field which specifies when an employee was hired. Example: if an employee was hired in 2016 and had only 11 days of vacation in 2016 - 2017 his balance is 21+(21-11) = 31 days.
   Source code need to contain set up instructions so we can deploy and test it on our servers.
   Markup should be responsive (so it is possible to use website on a mobile device)
