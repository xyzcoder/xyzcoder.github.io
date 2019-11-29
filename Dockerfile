FROM ubuntu:latest

# Installing Ruby

RUN apt-get update
RUN apt-get install ruby-full make gcc nodejs build-essential patch -y

# Setting Jekyll

RUN gem install jekyll bundler
RUN useradd jekyll

RUN mkdir pavan/
RUN mkdir xyzcoder.github.io
WORKDIR /pavan/xyzcoder.github.io

ADD  entrypoint.sh /pavan/xyzcoder.github.io/

# COPY gitpush.sh /pavan/xyzcoder.github.io

 RUN chmod 777 /pavan/xyzcoder.github.io/entrypoint.sh \
     && ln -s /pavan/xyzcoder.github.io/entrypoint.sh /

ENTRYPOINT ["/pavan/xyzcoder.github.io/entrypoint.sh"]

