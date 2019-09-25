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

router.route('/system/employee/:username/:id').put((req,res) => {
	User.findOneAndUpdate({username: req.params.username, 'vacations.id': req.body.id}, 
		{$set: {'vacations.$.start_vacation': req.body.start_vacation, 
			'vacations.$.end_vacation': req.body.end_vacation, 
			'vacations.$.description': req.body.description}}, 
			{safe: true, new: true}, (err, data) => {
		
			if (err) { console.log(err) }
			else {
				for (let i = 0; i < data.vacations.length; i++) {
					if (data.vacations[i].id === +req.body.id) {
						res.json(data.vacations[i]);
						console.log("edit vacation SUCCESSFULLY");
					}
				}		
			}
		});	
});

router.route('/system/employee/:username').post((req,res) => {
	User.findOneAndUpdate({username: req.body.username}, {$set: {vacations: req.body.vacations, 
			vacationDays: req.body.vacationDays}},
			{safe: true, new: true}, (err, data) => {
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
					vacationsPosition = i;
				} else{
					continue;
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