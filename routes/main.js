const router = require('express').Router();
const getMain = require('../controllers/main');
const auth = require('../middlewares/auth');
const {
  profile,
  changeProfile,
  admin,
  updateArticle,
} = require('../controllers/admin');

router.get('/', getMain);
router.get('/admin', auth, admin);
router.get('/profile', auth, profile);

router.post('/profile', auth, changeProfile);
router.post('/admin', auth, updateArticle);

module.exports = router;
