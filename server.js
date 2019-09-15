import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import User from './back-end side/entity/user';
import MockDb from './back-end side/db/mock-db';

const router = express.Router();
const app = express();
const urlEncodedParser = bodyParser.urlencoded({extended: true});

const mockDb = new MockDb();
const urlDb = "mongodb://localhost:27017/userDatabase";
const connection = mongoose.connection;

mongoose.connect(urlDb, { useNewUrlParser: true }).then(() => {
	console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});;

connection.once('open', function () {
    console.log("Connection to MongoDB");
    connection.dropCollection("users", function (err, result) {
        if (err) {
            console.log("Collection was NOT droped");
        } else {
            console.log("Collection was droped successfully");
        }
    });
});

User.collection.insertMany(mockDb.addEntitiesIntoMongoDb(), (err, result) => {
		if(err){
        	return console.log(err);
   		}
   		console.log(JSON.stringify(result.ops));
	});

app.use(bodyParser.json());
app.use(urlEncodedParser);
app.use(cors());
app.use('/', router);

app.set('port', process.env.PORT || 3000);

router.route('/system/employee').get((req,res) => {
	User.find((err, users) => {
		if (err) { console.log(err) }
		else { res.send(users) }	
	});
});

router.route('/system/employee/:username').get((req,res) => {
	User.find({username: req.params.username}, (err, user) => {
		if (err) { console.log(err) }
		else { res.send(user); }	
	});
});

router.route('/system/employee/:username/:id').get((req,res) => {
	User.find({username: req.params.username}, (err, user) => {
		if (err) { console.log(err) }
		else { 
			for (let i = 0; i < user.vacations.length; i++) {
				if (user.vacations[i].id === +req.params.id) {
					console.log("Edit vacation " + user.vacations[i]);
					res.send(user.vacations[i]);
				} else{
					console.log('Can not find vacation in GET method!');
				}
			}
		}	
	});
});

router.route('/system/employee/add').post((req, res) => {
	let user = new User(req.body);
	user.save()
		.then(user => {
			res.status(200).json({'user': 'Added successfully'});
		})
		.catch(err => {
			res.status(400).send('Faild to create new record');
		});
});

router.route('/system/employee/:username').post((req,res) => {
	console.log("INSIDE ROUTERING NODE.JS UPDATE METHOD");
	console.log("REQUEST BODY " + req.body.vacations);
	User.findOneAndUpdate({username: req.body.username}, {$set: {vacations: req.body.vacations, 
			vacationDays: req.body.vacationDays}},
			{safe: true, upsert: true}, (err, data) => {
				if(err){ console.log('Error updating user'); }
				else { 
					res.json(data);
					console.log('User was updated SUCCESSFULLY'); 
				}
			});
});

router.route('/system/employee/:username/:id').delete((req,res) => {
	console.log(req.params.username);
	console.log(req.params.id);
	User.findOne({username: req.params.username}, (err, user) => {
		if (err) {res.json(err)}
		else{

			let vacationsPosition = 0;
			for (let i = 0; i < user.vacations.length; i++) {
				if (user.vacations[i].id === +req.params.id) {
					console.log("position by default 0; current position " + i);
					vacationsPosition = i;
				} else{
					console.log('Can not find vacation!');
				}
			}

			let newVacationList = user.vacations.splice(vacationsPosition, 1);
			User.updateOne({username: req.params.username}, 
					{$set: {vacations: user.vacations}}, ()=>{
						res.json('Removed successfully');
					});		
		}
	});
});

router.route('/login').get((req,res) => {
	User.find({username: req.query.username}, (err, user) => {
		if (err) {
			console.log("ERROR with username " + req.query.username);
			res.json(err)
		}
		else{
			console.log("SUCCESSFULLY with username " + req.query.username);
			res.json(user);
		}
	});
})

app.listen(app.get('port'), () => {
	console.log("Server (Express) is runing on port 3000");
})