const router = require('express').Router();
const{ Comment, Post, User } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

// Get all users
router.get('/', async (req, res) => {
    try {
      const userData = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.status(200).json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(userData);
    }
  });

  // Get a specific user by id
router.get('/:id', async (req, res) => {
    try {
      const userData = await User.findByPk({
        where: {
          id: req.params.id
        },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at'],
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title'],
                }
            },
            {
                model: Post,
                attributes: ['title'],
            }

        ]
      });
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.status(200).json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  // Create a new user
router.post('/', async (req, res) => {
    try {
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });
  
  module.exports = router;