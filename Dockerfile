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

RUN git clone https://github.com/xyzcoder/xyzcoder.github.io.git

WORKDIR /pavan/xyzcoder.github.io

# Copy Entry Point
#COPY entrypoint.sh /pavan/xyzcoder.github.io

# Rerun to run everytime
RUN apt-get install rerun -y
# COPY gitpush.sh /pavan/xyzcoder.github.io

 RUN chmod 777 /pavan/xyzcoder.github.io/entrypoint.sh \
     && ln -s /pavan/xyzcoder.github.io/entrypoint.sh /

 RUN chmod 777 /pavan/xyzcoder.github.io/gitpush.sh \
     && ln -s /pavan/xyzcoder.github.io/gitpush.sh /

ENTRYPOINT ["/pavan/xyzcoder.github.io/entrypoint.sh"]

