var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var clientesRouter = require('./routes/clientes');
var funcionariosRouter = require('./routes/funcionarios');
var ingressosRouter = require('./routes/ingressos');
var pedidosRouter = require('./routes/pedidos');

var app = express();
app.use(cors({origin: process.env.CLIENT_ORIGIN_URL}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/funcionarios', funcionariosRouter);
app.use('/api/ingressos', ingressosRouter);
app.use('/api/pedidos', pedidosRouter);

module.exports = app;
