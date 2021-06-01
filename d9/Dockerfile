FROM drupal:9.0-apache-buster

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    ln -s /root/.composer/vendor/bin/drush /usr/local/bin/drush

# Install Drush
# RUN composer global require drush/drush && \
#     composer global update

# # Clean repository
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir web/sites/default/files && \
    chmod 777 web/sites/default/files

RUN mkdir web/sites/default/files/sync && \
    chmod 777 web/sites/default/files/sync

EXPOSE 80 443