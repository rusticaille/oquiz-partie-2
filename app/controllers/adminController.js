const { Quiz, Tag } = require('../models/');

const adminController = {

  adminPage: async (req, res) => {
    try {
      const quizzes = await Quiz.findAll ({
        include: ['tags']
      });
      const alltags= await Tag.findAll();
      console.log('alltags:', alltags);
      res.render('admin', {quizzes, alltags});
    }catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  associateTagQuiz : async (req, res) => {
    try {
      const quizzes = await Quiz.findAll ({
        include: ['tags']
      });

      const alltags= await Tag.findAll();

      const quizIdFromForm = req.body['titre du quiz'];
      const matchingQuiz = await Quiz.findByPk(quizIdFromForm,{
        include: ['tags']
      });
      console.log('matchingQuiz:', matchingQuiz);

      const tagIdFromForm = req.body['id du tag'];
      const matchingTag = await Tag.findByPk(tagIdFromForm);
      console.log('matchingTag:', matchingTag);

      for(const tag of matchingQuiz.tags){
        console.log('je suis ici');
        console.log('tag.id: ', tag.id);
        console.log('tagIdFromForm: ', tagIdFromForm);
        if(tag.id === Number(tagIdFromForm)){
          console.log('Cette association existe déjà');
          res.render('admin', {quizzes, alltags, error: "Cette association existe déjà", result: ""} );
          return;
        }
      }

      matchingQuiz.addTag(matchingTag);
      await matchingQuiz.save();
      res.render('admin', {quizzes, alltags, error:"", result: "la catégorie a bien été associée au quizz"});

    }catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

};

module.exports = adminController;