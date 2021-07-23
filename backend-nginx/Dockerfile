FROM phpearth/php:7.3-nginx

RUN apk update && apk upgrade
RUN apk add curl-dev openssl-dev
RUN apk add --no-cache  \
        git   \
        nano  \
        wget  \
        php7-pear \
        php-dev   \
        php7-gd   \ 
        php7-pdo_pgsql \
        && pecl install mongodb 

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    ln -s /root/.composer/vendor/bin/drush /usr/local/bin/drush

# Install Drush
RUN composer global require drush/drush && \
    composer global update 
    
RUN wget https://ftp.drupal.org/files/projects/drupal-9.1.0.tar.gz \
&& tar zxvpf drupal-9.1.0.tar.gz && rm drupal-9.1.0.tar.gz

RUN cp -r drupal-9.1.0/. /var/www/html
RUN rm -R drupal-9.1.0

WORKDIR /var/www/html

RUN mkdir sites/default/modules && \
    chmod 777 sites/default/modules

RUN mkdir sites/default/files && \
    chmod 777 sites/default/files

RUN mkdir sites/default/files/sync && \
    chmod 777 sites/default/files/sync
    
# COPY modules sites/default/modules
RUN composer install

# libmongoc SSL
COPY php.ini /etc/php/7.3/php.ini
RUN pecl config-set php_ini /etc/php.ini

# CMD /etc/init.d/php7.3-fpm start && nginx -g 'daemon off;'