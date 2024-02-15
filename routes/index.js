const router = require('express').Router();
const error = require('../middlewares/error');
const main = require('./main');
const user = require('./user');

router.use(main);
router.use(user);

router.use(error);

module.exports = router;
