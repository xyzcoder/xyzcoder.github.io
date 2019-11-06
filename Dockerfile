FROM ubuntu:latest

ARG GIT_USERNAME=''
ARG GIT_Password=''

# Installing Ruby

RUN apt-get update
RUN apt-get install ruby-full make gcc nodejs build-essential patch -y

# Setting Jekyll

RUN gem install jekyll bundler
RUN useradd jekyll


# Install Git

RUN apt-get update
RUN apt-get install git-core -y
RUN echo git --version

RUN mkdir pavan
WORKDIR /pavan

# Copy Entry Point

COPY entrypoint.sh /

RUN git clone https://github.com/xyzcoder/xyzcoder.github.io.git

WORKDIR /pavan/xyzcoder.github.io

RUN bundle install

CMD bundle exec jekyll serve
