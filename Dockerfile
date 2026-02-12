# Dockerfile for MySQL Database only
# Usage: docker-compose up -d

FROM mysql:8.0

# Set root password (change this in production!)
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=u469241017_heronusa

# Create a database user
COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1

CMD ["--default-authentication-plugin=mysql_native_password"]
