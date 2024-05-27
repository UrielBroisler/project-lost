var express = require('express');
var router = express.Router();

const { PrismaClient} = require ('@prisma/client');

const prisma = new PrismaClient({errorFormat: "minimal"});
const bcrypt = require('bcryptjs');
const {exceptionHandler} = require('../utils/ajuda');
const { generateAccessToken, authenticateToken} = require('../utils/auth')

/* GET users listing. */
router.get('/', async function(req, res, next) {
 try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
 }
 catch (exception){
  exceptionHandler(exception, res);

 }
});

router.post('/' , async (req, res) => {
  const data = req.body;

  if (!data.password  || data.password.length < 8){
    return res.status(400).json({
      error: "A senha é obrigatória e deve ter no mínimo 8 caracteres"
    });
  }

  data.password = await bcrypt.hash(data.password, 10);
  try{
    const cliente = await prisma.cliente.create({
      data: data,
      select : {
        id: true,
        nome: true,
        email: true
      }

    });
    const jwt = generateAccessToken(cliente);
    cliente.accessToken = jwt;
    res.status(201).json(cliente);
  
  }
  catch(exception ){
    exceptionHandler(exception, res);
  }
});

/* get / api/users/{id} - obtem usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cliente = await prisma.cliente.findUniqueOrThrow({
      where: {
        id: id
      }
    });
    res.json(cliente);
  }
  catch (exception) {
    exceptionHandler(exception, res);
  }
});

router.patch('/:id' , authenticateToken , async (req, res) =>{
  try{
    const id = Number(req.params.id);
    const data = req.body;
    const token = req.accessToken;
    const checkCliente = await prisma.cliente.update({
      where: {
        id: id,
        email: token.email
      }
     
    });
    if(checkCliente === null || id !== token.id){
      return res.sendStatus(403);
    }
    if ('password' in data){
      if (data.password.length < 8){
          return res.status(400).json({
            error: "A senha deve ter no mínimo 8 caracteres"
          });
      }
      data.password = await bcrypt.hash(data.password, 10);

    }
    const cliente = await prisma.cliente.update({
      where: {
        id: id
      },
      data: data,
      select:{
        id: true,
        nome: true,
        email: true
      }
    });

    res.json(cliente);
  }
  catch(exception){
    exceptionHandler(exception, res)
  }
});

router.delete('/:id' , async (req, res) => {
  try{
    const id = Number(req.params.id);
    const cliente = await prisma.cliente.delete({
      where: {
        id: id
      }
    });
    res.status(204).end(); 
  }
  catch(exception){
    exceptionHandler(exception, res)
  }
});

//rotas que nao existem resposta 

router.all('*', (req, res) => {
  res.status(501).end();
})

module.exports = router;