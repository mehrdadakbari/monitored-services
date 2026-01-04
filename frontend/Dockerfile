FROM node:20-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

FROM node:20-bookworm-slim

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
