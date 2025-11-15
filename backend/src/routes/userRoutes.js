const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, admin, receptionistOrAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, receptionistOrAdmin, getUsers)
  .post(protect, admin, createUser);

router.get('/stats', protect, admin, getUserStats);

router.route('/:id')
  .get(protect, receptionistOrAdmin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
