const Users = require('../model/users');
const Db = require('../model/articles');

const admin = (req, res) => {
  res.render('admin', {
    isAdmin: true,
    title: 'Админка',
    login: req.session.users.login,
  });
};

const profile = async (req, res) => {
  const user = await Users.findOne({ where: { id: req.session.users.id } });
  res.render('./profile', {
    title: 'Профиль пользователя',
    user,
  });
};

const changeProfile = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.session.users.id } });

    const toChange = {
      name: req.body.login,
    };

    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }

    Object.assign(user, toChange);

    await user.save();
    res.redirect('/profile');
  } catch (e) {
    console.log(e);
  }
};

const updateArticle = async (req, res) => {
  try {
    await Db.create({
      img: req.body.img,
      title: req.body.title,
      description: req.body.description,
      text: req.body.text,
    });
  } catch (e) {
    console.log(e);
  }

  res.redirect('/');
};

module.exports = { profile, changeProfile, admin, updateArticle };
