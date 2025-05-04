FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs redis-server
RUN apt-get upgrade
RUN apt-get install -y nodejs

COPY Backend Backend

RUN cd Backend  && \
    npm install
