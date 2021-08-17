# build environment
FROM node:alpine as build
WORKDIR /app
COPY . .

# yarn cache clean
RUN yarn cache clean
# RUN yarn
RUN yarn install 

# dev
# EXPOSE 3000 < Is defualt post not setup
# CMD yarn run start

# production
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf.dev /etc/nginx/conf.d/default.conf

# COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]