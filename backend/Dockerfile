FROM node:22-alpine
WORKDIR /app
# The dot below means "Copy from the build context (the backend folder)"
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]