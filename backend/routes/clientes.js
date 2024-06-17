const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: 'minimal' });
const bcrypt = require('bcryptjs');
const { exceptionHandler } = require('../utils/ajuda');
const { generateAccessToken, authenticateToken } = require('../utils/auth');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// Rota POST para criar um novo usuário
router.post('/users', async (req, res) => {
  const { nome, email, telefone, cpf, datanascimento, senha, confirmarsenha } = req.body;

  console.log('Received data:', req.body); // Log para depuração

  if (senha !== confirmarsenha) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = await prisma.cliente.create({
      data: {
        nome,
        email,
        telefone,
        cpf,
        datanascimento: new Date(datanascimento),
        senha: hashedPassword,
      },
    });
    console.log('New user created:', newUser); // Log para depuração
    res.status(201).redirect('/'); // Redirecionar após o registro bem-sucedido
  } catch (error) {
    console.error('Error creating user:', error); // Log para depuração
    res.status(400).json({ error: error.message });
  }
});

/* GET /api/users/{id} - Obtem usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cliente = await prisma.cliente.findUniqueOrThrow({
      where: {
        id: id
      }
    });
    res.json(cliente);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const token = req.accessToken;

    const checkCliente = await prisma.cliente.findUnique({
      where: {
        id: id
      }
    });

    if (!checkCliente || checkCliente.email !== token.email) {
      return res.sendStatus(403);
    }

    if ('senha' in data) {
      if (data.senha.length < 8) {
        return res.status(400).json({
          error: "A senha deve ter no mínimo 8 caracteres"
        });
      }
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    const cliente = await prisma.cliente.update({
      where: {
        id: id
      },
      data: data,
      select: {
        id: true,
        nome: true,
        email: true
      }
    });

    res.json(cliente);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cliente = await prisma.cliente.delete({
      where: {
        id: id
      }
    });
    res.status(204).end();
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// Rotas que não existem resposta
router.all('*', (req, res) => {
  res.status(501).end();
});

module.exports = router;
