# Use a imagem "node" como base
FROM node

# Crie um diretório de trabalho para a aplicação
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Copie o código da aplicação para o diretório de trabalho
COPY ./src .

# Defina a porta que a aplicação irá utilizar
EXPOSE 9080

# Instale as dependências do projeto
RUN npm install

RUN npm install https://github.com/gussXX/appstore.git

RUN npm install -g nodemon

# Inicie a aplicação --> "start"
# CMD ["npm install", "npm install -g nodemon"]
CMD ["npm", "start"]