FROM node:20.2.0 AS develop-stage
WORKDIR /app

ARG VITE_APP_ENV
ARG VITE_BASE_URL
ARG VITE_API_URL

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json yarn.lock ./
RUN yarn install
COPY . .

FROM develop-stage AS build-stage
RUN yarn build

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

#COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
