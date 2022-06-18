//const passwordSchema = require('../models/password');
const passwordValidator = require('password-validator');

// création du schéma
const passwordSchema = new passwordValidator();

passwordSchema
	.is()
	.min(8)
	.is()
	.max(20)
	.has()
	.not()
	.spaces()
	.has()
	.lowercase()
	.has()
	.uppercase();

//comparaison avec le schema
module.exports = (req, res, next) => {
	if (passwordSchema.validate(req.body.password)) {
		console.log('MdP valide');
		next();
	} else {
		return res.status(400).json({
			error: 'Le MDP doit faire 8 caractère au moins, 20 au plus avec une maj.',
		});
	}
};
