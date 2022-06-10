const Sauce = require('../models/sauce');
const fs = require('fs');

//Creation d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	console.log(sauceObject);
	const sauce = new Sauce({
		...sauceObject,
		//...req.body.sauce,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
	});
	console.log(sauceObject);
	sauce
		.save()
		.then(() => {
			res.status(201).json({
				message: 'Sauce saved successfully!',
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
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
	//
	Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifier' }))
		.catch((error) => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		if (!sauce) {
			res.status(404).json({ error: new Error('Pas de sauce') });
		}
		if (sauce.userId !== req.auth.userId) {
			res.status(400).json({ error: new Error('Suppression non autorisé') });
		}
	});
	Sauce.findOne({ _id: req.params.id }).then((thing) => {
		const filename = thing.imageUrl.split('/images/')[1];
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
				.catch((error) => res.status(400).json({ error }));
		});
	});
};

//Evaluation de sauce (like /dislike)
exports.evaluateSauce = (req, res, next) => {
	const like = req.body.like;
	const userId = req.body.userId;

	//on prend la sauce avec findOne
	Sauce.findOne({ _id: req.params.id })
		//Pour la sauce on fait un switch de cas
		.then((sauce) => {
			//un switch avec comme parametre le nombre de like
			switch (like) {
				//cas d'un dislike
				case -1:
					//on incremente le dislike
					sauce.dislikes++;
					//on sauvegard user qui dislike
					sauce.usersDisliked.push(userId);
					//on sauvegarde
					sauce
						.save()
						.then(() =>
							res
								.status(201)
								.json({ message: ' Vous avez dislike cette sauce !' })
						)
						.catch((error) => res.status(400).json({ error }));
					break;
				case 0:
					// si l'user a liker , on annule le like
					if (sauce.usersLiked.includes(userId)) {
						const index = sauce.usersLiked.indexOf(userId);
						sauce.usersLiked.splice(index, 1);
						sauce.likes--;
						sauce
							.save()
							.then(() =>
								res
									.status(201)
									.json({ message: ' Vous avez annulé votre like !' })
							)
							.catch((error) => res.status(400).json({ error }));
						// si l'user a dislike , on annule le dislike
					} else if (sauce.usersDisliked.includes(userId)) {
						const index = sauce.usersDisliked.indexOf(userId);
						sauce.usersDisliked.splice(index, 1);
						sauce.dislikes--;
						sauce
							.save()
							.then(() =>
								res
									.status(201)
									.json({ message: ' Vous avez annulé votre dislike !' })
							)
							.catch((error) => res.status(400).json({ error }));
					}
					break;

				case 1:
					sauce.likes++;
					sauce.usersLiked.push(userId);
					console.log(sauce.usersLiked);
					sauce
						.save()
						.then(() =>
							res
								.status(201)
								.json({ message: ' Vous avez liker cette sauce !' })
						)
						.catch((error) => res.status(400).json({ error }));
					break;

				default:
					console.log(error);
			}
		});
};
