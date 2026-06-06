FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Create directory for temporary uploads
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 5014

ENV NODE_ENV=production

CMD ["npm", "start"]
