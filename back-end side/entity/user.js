import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		reqired: true
	},
	employment_date: {
		type: String,
		reqired: true
	},
	vacationDays: {
		type: Array,
		reqired: true
	},
	vacations: {
		type: Array
	}
});

export default mongoose.model('User', User);