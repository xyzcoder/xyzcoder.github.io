---
title: Exposing My API Hosted On Localhost To External World Through Internet
layout: post
date: '2016-09-04 09:12:43'
comments: true
categories:
- ngrok
tags:
- ngrok
---

Hi,
I Just want to share details about  a very useful tool, I really liked it and may be you'll also like it.
<br/><br/>
Lets say i have a Restful service(example webapi code) in my PC , i am running it on port 4000.
<br/><br/>
So something like http://localhost:4000/getEmployeeDetails
will display my employee details.
<br/><br/>
Now I want these services to be used instantly by some mobile app or someone through the internet for testing.
<br/><br/>
First of all, I don't have a domain or server to host my service and expose it over the internet even for testing.
<br/><br/>
Now what I can do is I can download an exe provided by ngrok
[https://ngrok.com/](https://ngrok.com/)
<br/><br/>
You can simply download the zip file and unzip where ever we want in our file system.<br/>
Let's say I unzipped it in C:\Sotwares folder
<br/><br/>
And now from command prompt execute the following command.<br/>
Now follow these steps:
<br/><br/>
1. Open the command prompt and execute the following command.
2. So let's say our API is exposed through port 4000. That is when I browse http://localhost:4000/getEmployeeDetails,
3. I'll get employee details.
4. I need to execute below commands

```
cd C:\Softwares
ngrok http 4000
```

<img src="{{ site.baseurl }}/assets/images/posts/ngrok/1.jpg"  alt="" style="width: 649px;height: 282px;"/>

4. Now it will provide you with an URL like http://abcfdd.ngrok.io
Now I can give this URL to someone and they can access it through the internet.

So to access my Employee service hosted on my local machine I need to simply give
http://abcfdd.ngrok.io/getEmployeeDetails

This really helps us to quickly do some testing.

{% include /in_article_ads.html %}


**Keywords:** Ngrok, Tunnelling

<br/>
<br/>
Thanks,
Pavan

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 03212019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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