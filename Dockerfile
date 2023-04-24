# Use a imagem "node" como base
FROM node

# Crie um diretório de trabalho para a aplicação
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Copie o código da aplicação para o diretório de trabalho
COPY ./src .

# Instale as dependências do projeto
RUN npm install

# Defina a porta que a aplicação irá utilizar
EXPOSE 9080

# Inicie a aplicação --> "start"
CMD ["npm"]