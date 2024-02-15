require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize');
const sequelize = require('./model/connect');
const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const routes = require('./routes');
const variable = require('./middlewares/variables');
const fileDownl = require('./middlewares/file');
const { PORT, BASE_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const app = express();

const hbs = exphbs.create({
  layoutsDir: 'views/layouts',
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    paginate: require('./middlewares/paginate'),
  },
});

const options = {
  host: BASE_HOST,
  port: 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore(options);

app.use(
  session({
    key: 'session_cookie_name',
    secret: 'secret value',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(fileDownl.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(variable);
app.use(routes);

app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

async function start() {
  try {
    await sequelize.sync();
    app.listen(3306);
  } catch (e) {
    console.log(e);
  }
}

start();

app.listen(PORT, () => {
  console.log('Server is working');
});
