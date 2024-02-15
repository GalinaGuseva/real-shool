const router = require('express').Router();
const {
  register,
  createUser,
  login,
  signin,
  logout,
  reset,
  resetPass,
  password,
  updatePassword,
} = require('../controllers/user');

router.get('/register', register);
router.get('/login', login);
router.get('/exit', logout);
router.get('/reset', reset);
router.get('/password/:token', password);

router.post('/register', createUser);
router.post('/login', signin);
router.post('/reset', resetPass);
router.post('/password/:token', updatePassword);

module.exports = router;
