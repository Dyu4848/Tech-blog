const router = require('express').Router();
const{ Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

// Get all comments
router.get('/', async (req, res) => {
    try {
      // Find all comments in the database
      const allComments = await Comment.findAll({
        // Include the user associated with each comment
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ]
      });
  
      res.status(200).json(allComments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// Get comments by id
  router.get('/:id', async (req, res) => {
    try {
      // Find the comment with the specified id
      const commentData = await Comment.findByPk({
        where: {
          id: req.params.id
        },
        // Include the user associated with the comment
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ]
      });
  
      if (!commentData) {
        // If no comment was found, return a 404 error
        return res.status(404).json({ message: 'No comment found with this id' });
      }
  
      res.status(200).json(commentData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// Create new comment
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newComment);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Delete a comment
router.delete(':/id', withAuth, async (req, res) => {
    try {
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!deleteComment) {
            res.status(404).json({ message: 'No comment found with this id!'});
                return;
            }

            res.status(200).json(deleteComment);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
});

module.exports = router;