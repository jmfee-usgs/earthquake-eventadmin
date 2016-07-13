## Docker file to build eventadmin container

# NOTE: This container includes a configuration that is enough to get started.
# Production users should modify their configuration using "docker cp".

FROM debian:jessie
MAINTAINER "Jeremy Fee" <jmfee@usgs.gov>
LABEL dockerfile_version="v0.1.0"


# install dependencies
RUN apt-get update -y \
    && apt-get install -y \
        bzip2 \
        curl \
        git \
        openjdk-7-jre-headless \
        php5-cgi \
        php5-curl \
        ruby-compass \
    && curl -o- \
        https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh \
        | /bin/bash \
    && /bin/bash --login -c "nvm install 4.2.4"


# install, configure, and build eventadmin
RUN /bin/bash --login -c "\
    git clone \
        https://github.com/usgs/earthquake-eventadmin.git \
        /earthquake-eventadmin \
    && cd /earthquake-eventadmin \
    && npm install -g grunt-cli \
    && npm install \
    && php ./src/lib/pre-install.php --non-interactive \
    && grunt build clean:dist concurrent:dist" \
# clean up unused large files
    && rm -r \
        /earthquake-eventadmin/dist/lib/ProductClient.jar \
        /earthquake-eventadmin/node_modules/grunt-mocha-phantomjs \
        /root/.npm \
        /tmp/npm*


WORKDIR /earthquake-eventadmin
EXPOSE 8112
CMD /bin/bash --login -c "grunt eventadmin"
