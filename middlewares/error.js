module.exports = function (req, res, next) {
  res.status(404).render('notfound', {
    title: '404',
  });
};
