const { Quiz, Tag, } = require('../models');

const quizzController = {

  quizzPage: async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await Quiz.findByPk(quizId,{
        include: [
          { association: 'author'},
          { association: 'questions', include: ['answers', 'level']},
          { association: 'tags'}
        ]
      });
      if (!req.session.user) {
        res.render('quiz', {quiz});
      } else {
        res.render('play_quiz', {quiz});
      }
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  playQuiz: async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await Quiz.findByPk(quizId,{
        include: [
          { association: 'author'},
          { association: 'questions', include: ['answers', 'level', 'good_answer']},
          { association: 'tags'}
        ]
      });
      let score = 0;
      for(const question of quiz.questions){
        if(req.body[question.id]){
          if(question.id === Number(req.body[question.id])){
            console.log('Bonne question répondue')
            score++;
            console.log('score :', score);
          } else {
            console.log('mauvaise réponse');
          }
        }
      }

      res.render('quiz_result', {
        quiz, 
        score,
        submitedQuiz : req.body
      });

    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  listByTag: async (req, res) => {
    try {
      const tagId = parseInt(req.params.id);
      const tag = await Tag.findByPk(tagId,{
        include: [{
          association: 'quizzes',
          include: ['author']
        }]
      });
      const quizzes = tag.quizzes;
      res.render('index', { quizzes });
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

};

module.exports = quizzController;