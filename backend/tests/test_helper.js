const Student = require('../models/student');
const User = require('../models/user');

const initialStudents = [
	{
		name: 'Abraham Lincoln',
		transport: 'Bus'
	},
	{
		name: 'John McClain',
		transport: 'Car'
	}
];

const nonExistingId = async () => {
	const student = new Student({ name: 'Will Remove', transport: 'Car' });
	await student.save();
	await student.remove();

	return student._id.toString();

};

const studentsInDb = async () => {
	const students = await Student.find({});
	return students.map(student => student.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

module.exports = {
	initialStudents,
	nonExistingId,
	studentsInDb,
	usersInDb
};

