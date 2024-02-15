const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Users = require('../model/users');

const register = (req, res) => {
  return res.render('users/register', {
    title: 'Регистрация',
    isRegister: true,
    regerror: req.flash('regerror'),
    regsuccess: req.flash('regsuccess'),
  });
};

const transport = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: 'true',
  auth: {
    user: 'galinagus57',
    pass: '',
  },
});

const createUser = async (req, res) => {
  try {
    const { email, pass, login, resetToken, resetExp } = req.body;
    const test = await Users.findOne({ where: { email: email } });
    if (test) {
      req.flash('regerror', 'Пользователь с таким email уже существует!');
      res.redirect('/register');
    } else {
      const hashPass = await bcrypt.hash(pass, 10);

      const user = new Users({
        email,
        login,
        pass: hashPass,
        resetToken,
        resetExp,
      });

      await user.save();

      await transport.sendMail({
        to: email,
        from: 'galinagus57@yandex.ru',
        subject: 'Успешная регистрация',
        html: `
            <h2>Аккаунт создан</h2>
            <p>Добро пожаловать в наш сервис</p>
            <hr />
            <p style="color: green;">Ваш email для входа: ${email}</p>
        `,
      });
      req.flash('regsuccess', 'Вы успешно зарегистрированы!');
      res.redirect('/register');
    }
  } catch (e) {
    console.log(e);
  }
};

const login = (req, res) => {
  if (req.query.pass) {
    req.flash('passsuccess', 'Пароль успешно изменен!');
    return res.render('users/login', {
      title: 'Вход',
      isLogin: true,
      error: req.flash('error'),
      passsuccess: req.flash('passsuccess'),
    });
  }
  if (req.query.err) {
    req.flash('tokenerror', 'Время жизни токена истекло!');
    return res.render('users/login', {
      title: 'Вход',
      isLogin: true,
      error: req.flash('error'),
      tokenerror: req.flash('tokenerror'),
    });
  }
  return res.render('users/login', {
    title: 'Вход',
    isLogin: true,
    error: req.flash('error'),
    passerror: req.flash('passerror'),
  });
};

const signin = async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await Users.findOne({ where: { email: email } });

    if (user) {
      const passcrypt = await bcrypt.compare(pass, user.pass);

      if (passcrypt) {
        req.session.users = user;
        req.session.isAuth = true;

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect('/');
        });
      } else {
        req.flash('passerror', 'Неверный пароль!');
        return res.redirect('/login');
      }
    } else {
      req.flash('error', 'Такого пользователя не существует!');
      return res.redirect('/login');
    }
  } catch (e) {
    console.log(e);
  }
};

const logout = async (req, res) => {
  req.session.destroy(() => {
    return res.redirect('/');
  });
};

const reset = (req, res) => {
  res.render('users/reset', {
    title: 'Восстановление доступа',
    error: req.flash('error'),
  });
};

const resetPass = (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Попробуйте позже!');
        return res.redirect('/reset');
      }

      const token = buffer.toString('hex');
      const exp = new Date(new Date().getTime() + 60 * 60 * 1000);
      const user = await Users.findOne({ where: { email: req.body.email } });
      if (user) {
        user.resetToken = token;
        user.resetExp = exp;
        await user.save();

        await transport.sendMail({
          to: req.body.email,
          from: 'galinagus57@yandex.ru',
          subject: 'Восстановление пароля',
          html: `
                        <h2>Вы забыли пароль?</h2>
                        <p>Если нет, проигнорируйте данное письмо</p>
                        <p>Если да, перейдите по ссылке ниже</p>
                        <hr />
                        <p><a href="http://localhost:3000/password/${token}">Восстановить доступ</a></p>
                    `,
        });
        return res.redirect('/login');
      } else {
        req.flash('error', 'Такого пользователя не существует!');
        return res.redirect('/reset');
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const password = async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/login');
  }

  try {
    const user = await Users.findOne({
      where: {
        resetToken: req.params.token,
        resetExp: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.redirect('/login/?err=true');
    } else {
      res.render('users/password', {
        title: 'Восстановление доступа',
        layout: 'main',
        token: req.params.token,
        passsuccess: req.flash('passsuccess'),
        tokenerror: req.flash('tokenerror'),
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        resetToken: req.body.token,
        resetExp: { [Op.gt]: Date.now() },
      },
    });

    if (user) {
      user.pass = await bcrypt.hash(req.body.pass, 10);
      await user.save();
      user.resetToken = undefined;
      user.resetExp = undefined;
      return res.redirect('/login/?pass=true');
    } else {
      return res.redirect('/login/?err=true');
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  register,
  createUser,
  signin,
  login,
  logout,
  reset,
  resetPass,
  password,
  updatePassword,
};
