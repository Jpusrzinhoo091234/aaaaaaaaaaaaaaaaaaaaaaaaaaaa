const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Cria o servidor express
const app = express();
const port = 3000;

// Configuração do middleware para lidar com JSON e arquivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Função para ler e escrever no arquivo de dados (users.json)
const readUsers = () => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'users.json'));
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));
};

// Rota de cadastro
app.post('/cadastro', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Verificar se as senhas são iguais
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não coincidem!' });
  }

  // Verificar se o usuário já existe
  const users = readUsers();
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Usuário já cadastrado!' });
  }

  // Adicionar novo usuário ao arquivo
  users.push({ email, password });
  writeUsers(users);

  res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Email ou senha incorretos!' });
  }

  res.status(200).json({ message: 'Login bem-sucedido!' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
