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
app.use(cors({origin: process.env.CLIENT_ORIGIN_URL}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api/clientes', clientesRouter);
// app.use('/api/funcionarios', funcionariosRouter);
// app.use('/api/ingressos', ingressosRouter);
// app.use('/api/pedidos', pedidosRouter);

app.listen(8000);
