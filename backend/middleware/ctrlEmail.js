const validator = require('validator');

module.exports = (req, res, next) => {
	const { email } = req.body;

	if (validator.isEmail(email)) {
		next;
		//console.log('-->Validator is email');
		//console.log(`email valide ${validator.isEmail(email)}`);
	} else {
		return res.status(400).json({ error: `L'email ${email} n'est pas valide` });
	}
};
