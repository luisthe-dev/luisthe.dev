FROM node:26-alpine

RUN apk add libc6-compat

WORKDIR /app

# Copy package management files to leverage Docker caching
COPY package.json package-lock.json
RUN npm ci

RUN npm install

COPY . .

EXPOSE 3000

# Run the standalone Node.js server entry point
CMD ["node", "server.js"]