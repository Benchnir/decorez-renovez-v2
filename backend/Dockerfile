FROM php:8.2-apache

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY . .

RUN chown -R www-data:www-data /var/www/html

# Create a simple test PHP file
RUN echo '<?php phpinfo(); ?>' > /var/www/html/index.php

EXPOSE 80

CMD ["apache2-foreground"]