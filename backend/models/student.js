const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	transport: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});
studentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Student', studentSchema);