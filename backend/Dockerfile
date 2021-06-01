# FROM drupal:9.0-apache-buster
FROM drupal:9.0

# WORKDIR /var/www/html

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git && \
    apt-get install nano && \
    apt-get -y install cron && \
    apt-get install wget

RUN apt-get update -y && \
    pecl install mongodb && \
    echo "extension=mongodb.so" >> /usr/local/etc/php/conf.d/mongodb.ini

# install phpredis extension
# ENV PHPREDIS_VERSION 5.3.2
# RUN curl -L -o /tmp/redis.tar.gz https://github.com/phpredis/phpredis/archive/$PHPREDIS_VERSION.tar.gz \
#     && tar xfz /tmp/redis.tar.gz \
#     && rm -r /tmp/redis.tar.gz \
#     && mkdir /usr/src/php/ext -p \
#     && mv phpredis-$PHPREDIS_VERSION /usr/src/php/ext/redis \
#     && docker-php-ext-install redis

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    ln -s /root/.composer/vendor/bin/drush /usr/local/bin/drush

# install certbot
RUN apt-get update && \
    apt-get install nano -y && \
    apt-get install certbot -y && \
    openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048


USER root

RUN a2enmod ssl

RUN mkdir web/sites/default/modules && \
    chmod 777 web/sites/default/modules

RUN mkdir web/sites/default/files && \
    chmod 777 web/sites/default/files

RUN mkdir  -p web/.well-known/acme-challenge && \
    chmod 777 web/.well-known/acme-challenge

COPY modules web/sites/default/modules

# prod
# COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# dev
COPY 000-default.conf.org /etc/apache2/sites-available/000-default.conf

EXPOSE 80 443