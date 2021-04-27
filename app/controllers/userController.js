const { User } = require('../models/');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const userController = {

  signupPage: (req, res) => {
    res.render('signup');
  },

  signupAction: async (req, res) => {
    try {
      // les vérifs à faire : 

      // - 1: l'utilisateur existe déjà
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (user) {
        return res.render('signup', {
          error: "Cet email est déjà utilisé par un utilisateur."
        });
      }
      // - 2: format d'email valide
      if (!emailValidator.validate(req.body.email)) {
        return res.render('signup', {
          error: "Cet email n'est pas valide."
        });
      }

      if (req.body.password !== req.body.passwordConfirm) {
        return res.render('signup', {
          error: "La confirmation du mot de passe ne correspond pas."
        });
      }

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: encryptedPassword
      });

      await newUser.save();
      res.redirect('/login');
    }catch(err){
      console.trace(err);
      res.status(500).send(err);
    }
  },

  loginPage: (req, res) => {
    res.render('login');
  },

  loginAction: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (!user) {
        return res.render('login', {
          error: "Cet email n'existe pas."
        });
      }

      const validPwd = await bcrypt.compare(req.body.password, user.password);
      console.log(req.body.password);
      console.log(user.password);
      if (!validPwd) {
        return res.render('login', {
          error: "Ce n'est pas le bon mot de passe."
        });
      }

      req.session.user = user;
      delete req.session.user.password;
      return res.redirect('/');

    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  disconnect: (req, res) => {
    req.session.user = false;
    return res.redirect('/');
  },

  profilePage: (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    res.render('profile', {
      user: req.session.user
    });
  }

};

module.exports = userController;