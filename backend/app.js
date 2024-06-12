const dotenv = require('dotenv');
dotenv.config()

var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');


var clientesRouter = require('./routes/clientes');
var funcionariosRouter = require('./routes/funcionarios');
var ingressosRouter = require('./routes/ingressos');
var pedidosRouter = require('./routes/pedidos');

var app = express();
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(cors({origin: process.env.CLIENT_ORIGIN_URL}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.get('/', (req, res) => {
  res.render("index")
});

app.get('/contatos', (req, res) => {
  res.render("contatos")
});

app.get('/galeria', (req, res) => {
  res.render("galeria")
});

app.get('/ingressos', (req, res) => {
  res.render("ingressos")
});

app.get('/login', (req, res) => {
  res.render("login")
});

app.get('/signup', (req, res) => {
  res.render("signup")
});


app.use('/api/clientes', clientesRouter);
// app.use('/api/funcionarios', funcionariosRouter);
// app.use('/api/ingressos', ingressosRouter);
// app.use('/api/pedidos', pedidosRouter);

app.listen(8000, () => {
  console.log("Servidor rodando no endereco http://localhost:8000")
});
