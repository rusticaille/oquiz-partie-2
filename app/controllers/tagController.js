const { Tag, Quiz } = require('../models');

const tagController = {
  tagList: async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.render('tags', {tags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  addTagPage: async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.render('add_tag', {tags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  addTag : async (req, res) => {
    const newTagFromForm = req.body;
    console.log(newTagFromForm);
    try  {
      const newTag = await Tag.findOrCreate({
        where: {name : newTagFromForm.newtag}
      });
      const quizzes = await Quiz.findAll ({
        include: ['tags']
      });
      const alltags= await Tag.findAll();
      console.log('la catégorie a bien été créée');
      console.log('newTag :', newTag);
      res.render('admin', {newTag, quizzes, alltags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  deleteTagPage: async (req, res) => {
    try {
      const tags = await Tag.findAll();
      
      res.render('delete_tag', {tags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  deleteTag : async (req, res) => {
    const tagToDelete = req.body;
    try {
      const tagByName = await Tag.findOne({ 
        where : {name : tagToDelete.name}
      })
      const quizzes = await Quiz.findAll ({
        include: ['tags']
      });
      const alltags= await Tag.findAll();
      console.log('tagByName: ', tagByName);
      if(tagByName){
        console.log('il y a bien une categorie de ce nom là')
        await tagByName.destroy();
      }  else {
        console.log('il ny a personne de ce nom là');
      }
    res.render('admin', {tagByName, quizzes, alltags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  updateTagPage: async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.render('update_tag', {tags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  updateTag : async (req, res) => {
    const tagToUpdate = req.body;
    try {
      const UpdateTagByName = await Tag.findOne({ 
        where : {name : tagToUpdate.name}
      })
      const quizzes = await Quiz.findAll ({
        include: ['tags']
      });
      const alltags= await Tag.findAll();
      if(UpdateTagByName){
        console.log('il y a bien une categorie de ce nom là, je vais la modifier')
        UpdateTagByName.name = tagToUpdate.newName;
        await UpdateTagByName.save();
        console.log('je mappelle :', tagToUpdate.newName )
      }  else {
        console.log('il ny a personne de ce nom là');
      }
    res.render('admin', {UpdateTagByName, quizzes, alltags});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },
}

module.exports = tagController;