FROM node:18-alpine

WORKDIR /app/

# Copy app sources
COPY . .

RUN yarn install

ENV NODE_ENV=production

# Perform build
RUN yarn build

# Expose application port
EXPOSE ${PORT}

CMD yarn start

