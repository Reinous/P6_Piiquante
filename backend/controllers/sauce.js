const Sauce = require('../models/sauce');

//Creation d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
	console.log(req.body);
	const sauce = new Sauce({
		...req.body,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce sauvegarder' }))
		.catch((error) => res.status(400).json({ error }));
};

//Liste de toutes les sauces
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

//Pour avoir une seule sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
	Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifier' }))
		.catch((error) => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
		.catch((error) => res.status(400).json({ error }));
};
