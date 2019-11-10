---
title: How I successfully created my Blog and maintaining at free of cost using Jekyll
  and Github Pages-- Part 2
layout: post
date: '2019-11-10 21:42:12'
comments: true
Categories:
- Jekyll
tags:
- Jekyll
---

Hello Everyone,
In this post, I would like to continue on how I built my blog using GithubPages and Jekyll at free of cost and maintenance. 
<br>
[Here is the link to my previous article](https://xyzcoder.github.io/2019/11/10/how-i-successfully-created-my-blog-and-maintaining-at-free-of-cost-using-jekyll-and-github-pages.html) 

<br>
[In my previous post](https://xyzcoder.github.io/2019/11/10/how-i-successfully-created-my-blog-and-maintaining-at-free-of-cost-using-jekyll-and-github-pages.html)  we saw what Static file generators are and how they help us, creating a site with Jekyll. In this post we will dig deep into some basic concepts of Jekyll.

# Basic Building Blocks Of Jekyll
1. **Pages**
2. **Liquid Template Language**
3. **Posts**
4. ** Front Matter**
5. ** Collections**
6. **Data Files**
7. **Assets**
8. **Static Files**

These are the key aspects of jekyll for building a static site. Lets see each of them in detail.

# Pages
Pages are basic building blocks for content. Some examples of Pages in blogging perspective are "About Me", "Contact Us", "Areas Of Interest". If you see these pages are independent and doesnt actually deal with actual blog content like posts.
<br>
A simple way to create Pages is to add "Name_Of_the_file.md" in root directory
<br>
In the default template created, we can see "about.md" and "index.md"
<br>
In my blog, I use "posts_by_tags.md", "posts_by_date.md", "contact.md"

<br>
# Posts
You write blog posts as text files and Jekyll provides everything you need to turn it into a blog.
<br>
The _posts folder is where your blog posts live. You typically write posts in Markdown, HTML is also supported.
<br>
Usually a post file name starts in this format ```YEAR-MONTH-DAY-title.md```  where year is 4 digit year, Month,Day are 2 digit. A sample post looks something like this

<br>
File Name: 2019-01-01-Welcome-Post.md
```
---
layout: post
title:  "Welcome to Xyzcoder.github.io"
---

# Hello Welcome To xyzcoder.github.io

**This is a sample blog post**,  in Jekyll.
```

# Front Matter
Front matter is the  section present in the starting of a file and this will be processed by Jekyll. This is the YAML syntax and it should be present in the starting and between 3 dashes as opening and closing.
<br>
For example
```

---
layout: post
title:  "Welcome to Jekyll!"
date:   2019-11-10 17:34:24 +0530
categories: jekyll update
---

```

We can have predefined variables and also custom variables that can be accessed in the file's liquid tags or even in pages and also include files.
<br>
I'll show a sample Front Matter code which I use in almost all my blog posts<br>

```

---
title: AWS VPC Peering Connection
layout: post
date: '2018-05-15 22:19:51'
comments: true
categories:
- AWS
- VPC
- VPC-Peering
author: Pavan Kumar Aryasomayajulu
---

```

**title**: Specifies the title of the page<br>
**layout**: For specifying which layout file to be used. We will see details of a layout file shortly.<br>
**comments**: This is a custom variable which i am using and In my case, I accept true and false for this and based on the value provided, I'll display comments section in my post.<br>
**categories**: This is how an array is declared in YAML and here I have 3 categories AWS, VPC and VPC-Peering

**How do we use these variables**: All variables declared in a 
```
<h1>{{ page.author }}</h1>

{% for category in page.categories %}
		<span class="tag">#{{category}}</span>
{% endfor %}
```

**Important Point**: It is important to note that the title, date and categories will have impact on the url of the post which is generated.
<br>
For example for the above configuration, this is how the url of my post looks like because when Jekyll generates a static html page using above configuration, it creates folder structure based on the data provided.

<img src="{{ site.baseurl }}/jekyll1.jpg"  alt="" style="width: 80%;height: 80%;"/>
# Assets




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
this.page.identifier = 11102019312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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