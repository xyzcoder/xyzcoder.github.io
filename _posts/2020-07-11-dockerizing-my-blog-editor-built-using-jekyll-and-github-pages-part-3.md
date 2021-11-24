---
layout: post
title: Dockerizing My Blog Editor Built Using Jekyll and Github Pages-- Part 3
comments: true
date: '2020-07-11 15:55:33'
Categories:
- Jekyll
- Docker
---

# Running Jekyll Anywhere Using Docker My Custom Image:
Before actually going through this post, I hope you got a chance to go through my previous 2 blog posts on how I am making using Jekyll (Static Site Generator and Github Pages) for hosting my blog.
<br>
<br>
Part 1: [How I successfully created my Blog and maintaining at free of cost using Jekyll and Github Pages -- Part1](https://xyzcoder.github.io/2019/11/10/how-i-successfully-created-my-blog-and-maintaining-at-free-of-cost-using-jekyll-and-github-pages.html)
<br>

Part 2: [How I successfully created my Blog and maintaining at free of cost using Jekyll and Github Pages-- Part 2](https://xyzcoder.github.io/2019/11/10/how-i-successfully-created-my-blog-and-maintaining-at-free-of-cost-using-jekyll-and-github-pages-part-2.html)
<br>
<br>
So in these 2 parts, I discussed how to make use of various technologies like Github pages, Jekyll, Ruby, and Firebase for hosting your website and giving some dynamic behavior to my blog.
<br>

Previously I used to blog using Wordpress and my blog address is [https://pavanarya.wordpress.com/](https://pavanarya.wordpress.com/).<br>
One thing that I liked with WordPress, is the admin portal where I can simply log in, and using the interface provided by them, I can add new posts and moderate comments. It's like an all in one place where I can create content for my blog. I loved it.
<br><br>

But the drawback is with the free edition, we have limited choice and control on the blog. So the developer in me wanted to take that control.
I want to customize and create my blog in the way I wanted to.<br>
That is when I opted for Github pages and Jekyll. But still, I have a few concerns when compared to WordPress. And they are
<br><br>

1. **Software installation:  I cannot log in from any random system and edit my blogs or create new posts. The reason for that is, I need to have a complete setup of Jekyll on that machine and for that, I need to install Ruby and other required pieces of software. This might not be possible all the time. And moreover Ruby is not something I work on regularly.**
<br><br>

This is a major concern for me and the solution for that is my fav piece of technology "**Docker**" is my saviour.
<br><br>
Now we will see how I leveraged Docker to handle my problem discussed above.

# Step1: Setting up Jekyll using Docker Containers (One time Step)
As a part of solving the above problem, my first step is to create a docker image.
<br><br>
Here is my docker file

```
FROM ubuntu:latest

# Installing Ruby

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install ruby-full make gcc nodejs build-essential patch -y

# Setting Jekyll

RUN gem install jekyll bundler
RUN useradd jekyll

RUN mkdir pavan/
RUN mkdir xyzcoder.github.io
WORKDIR /pavan/xyzcoder.github.io

ADD  entrypoint.sh /pavan/xyzcoder.github.io/

 RUN chmod 777 /pavan/xyzcoder.github.io/entrypoint.sh \
     && ln -s /pavan/xyzcoder.github.io/entrypoint.sh /

ENTRYPOINT ["/pavan/xyzcoder.github.io/entrypoint.sh"]

```

<br><br>
entrypoint.sh
<br>
```
#!/bin/bash

cd /pavan/xyzcoder.github.io

ls

chmod u+x /pavan/xyzcoder.github.io/entrypoint.sh

bundle install

bundle exec jekyll serve --watch --host 0.0.0.0

```

Let me explain each step, I am having in the docker file.<br><br>
1. I took the ubuntu image as my base image
2. Then I am executing some Linux commands to update and then installing Ruby
3. Here I am trying to install Jekyll package 
4. I am creating a few folders in my ubuntu container and that is the place, where I would like to have my blog code.
5. I copied a sh file where I have a few commands to install required Jekyll packages and start the Jekyll server. Note: This file is copied to my image and we are not running anything yet.
6. Finally, we are specifying that entrypoint.sh as an entry point when we run that image. An entry point is nothing but we are specifying docker that we want to execute that command when docker container starts.


# Step 2: Creating Image and pushing it to docker hub (One time step)
Once we are done with docker file creation, we can create a docker image from that docker file. For that, we need to execute the following command.

```
docker build . -t paryasomayajulu/xyzcoderjekyll
```

"docker build" is the command used to build a docker image. "**.**" is used to specify the path and I have my docker file present in the same path so I am using a dot. And -t is used to specify a tag for our image.<br>
Once we run this command, it will execute each of the steps mentioned in our docker file.

```
docker images
```
The above command is used to list all images present on our machine and make sure that we have our newly created image in the list.

# Step 3: Create an account with Docker hub and push our image to docker hub repository.
Create an account in [https://hub.docker.com/](https://hub.docker.com/)
<br>
<br>
Now login into docker hub from your console
```
docker login
```
<br>
Now create an alias for your image and to list your images use the command

```
docker images

# Above command will list all images... Copy Image Id

 docker tag <ImageIdFromAboveList> <dockerhub_user_name>/<name_of_image>
 
 ```
 
 Once tag is created use this command to push the image to docker hub
 
 ```
 docker push <dockerhub_user_name>/<name_of_image>
 ```

Once this is successful, you can login to [https://hub.docker.com/](https://hub.docker.com/) and see your image.

# Step 4: Using your docker image anywhere where you have internet and browser.
There is a nice tool called "Docker Playgroud". As the name suggests this is where you can play like anything with docker. So I am going to use this website as a host to blog.
<br>
<br>
Login into [https://labs.play-with-docker.com/](https://labs.play-with-docker.com/) using your docker hub credentials. And you'll get a session where you can create an instance and play with docker.

<br>
<br>
Now I'll use git commands to fetch my blog code on to this instance( In this example I am getting my code)

```
git config --global user.email "YOUR_EMAIL"
git config --global user.name "YOUR_USERNAME"
git clone https://github.com/xyzcoder/xyzcoder.github.io.git
```

Once code is cloned(It will take hardly 1min) Now I'll run the image that i created in previous steps( One uploaded to docker hub).

```
docker run -it -d -p 4000:4000 -v $PWD/xyzcoder.github.io:/pavan/xyzcoder.github.io paryasomayajulu/jekyll
```

Here I am saying that I want to run docker container in backgroud (-it d) options and exposing port 4000 that is where Jekyll runs.<br>
I am mounting my blog code to docker container using <br>
-v $PWD/xyzcoder.github.io:/pavan/xyzcoder.github.io
<br>
<br>
It is something like I am saying docker that please mount my folder current_directory/xyzcoder.github.io to pavan/xyzcoder.github.io folder in the Docker container. The reason why I am copying it to pavan/xyzcoder.github.io folder is, that is my working directory which I specified in the docker file in step1.
<br>
<br>

Once this command is executed, we can see port 4000 is hyperlinked at the top on the page. Once we click on it, we can run our blog admin part.
<br>
<br>
For example , I my case this is the url created
```
http://ip172-18-0-15-bs4qvgroudsg00d9isig-4000.direct.labs.play-with-docker.com/
```

I can browse http://ip172-18-0-15-bs4qvgroudsg00d9isig-4000.direct.labs.play-with-docker.com/admin and edit my posts successfully.
<br>
We can repeat Step4 any number of times and where ever we want.
<br><br>
Finally after making any changes to posts from the UI screen, we need to commit changed files so that these posts reflect on your blog

```
git add -A
git commit -m "Automatic update of modified files" && git push

```

<br>
# Note: Step 4 can be used even on windows machines where we have docker installed and this reduces the burden of installing Ruby and other required software for editing our blog posts 


<br>
<br>
Thanks,<br>
Pavan Kumar Aryasomayajulu

<br><br><br>
{% if page.comments %}
<div id="disqus_thread"></div>
<script>
	
/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 11072020312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://xyzcoder1.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
{% endif %}
