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
2. **Posts**
3. ** Front Matter**
4. ** Collections**
5. **Data Files**
6. **Assets**
7. **Static Files**


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