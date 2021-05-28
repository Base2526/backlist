# build environment
FROM node:alpine as build
WORKDIR /app
COPY . .
# RUN yarn
RUN yarn install

# dev
# EXPOSE 3000 < Is defualt post not setup
CMD yarn run start

# production
# RUN yarn build

# production environment
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]