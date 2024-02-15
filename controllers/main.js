const Db = require('../model/articles');

const getMain = async (req, res) => {
  if (req.query.del == 'yes') {
    try {
      const article = await Db.destroy({ where: { id: req.query.id } });
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  } else if (req.query.artid) {
    try {
      const article = await Db.findAll({
        where: { id: req.query.artid },
      });
      res.render('./article', {
        title: 'Статья',
        article: article,
      });
    } catch (e) {
      console.log(e);
    }
  } else if (req.query.id) {
    try {
      const article = await Db.findAll({ where: { id: req.query.id } });
      res.render('./update', {
        title: 'Редактировать',
        article: article,
      });
    } catch (e) {
      console.log(e);
    }
  } else if (req.query.page) {
    try {
      var page = req.query.page || 1; //номер страницы
      const limit = 6; //максимальное число записей на странице
      const offset = (page - 1) * limit; //смещение
      const order = { field: 'id', direction: 'DESC' };

      const { count, rows } = await Db.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[order.field, order.direction]],
      });

      const pageCount = Math.ceil(count / limit);

      const slideArticles = await Db.findAll({
        limit,
        offset: 0,
        order: [[order.field, order.direction]],
      });

      res.render('mainPage', {
        title: 'Главная страница',
        layout: 'main',
        articles: rows,
        slideArticles: slideArticles,
        pagination: {
          page: req.query.page, // номер страницы,
          pageCount: pageCount, // число страниц
        },
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      const order = { field: 'id', direction: 'DESC' };
      const slideArticles = await Db.findAll({
        limit: 6,
        offset: 0,
        order: [[order.field, order.direction]],
      });

      res.render('mainPage', {
        title: 'Главная страница',
        layout: 'main',
        articles: slideArticles,
        slideArticles: slideArticles,
        pagination: {
          page: 1, // номер страницы,
          pageCount: 2, // число страниц
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports = getMain;
