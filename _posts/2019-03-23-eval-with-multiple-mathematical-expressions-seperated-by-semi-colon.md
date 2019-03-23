---
title: Eval with multiple mathematical expressions seperated by semi-colon
layout: post
date: '2019-03-23 10:49:55'
comments: true
categories:
- javascript
tags:
- javascript
---

Hi,
Came across an interesting thing today.
<br /><br />
eval('25;(100/10);40;30+40') 
<br/>
What will be the output of this javascript statement.
<br /><br />The output of above statement is 70. So point here is if we pass semi-colon separated mathematical expressions to eval function in javascript then it would return the value of the last evaluated expression . So in our case the answer would be 30+40 ie 70.
<br /><br />
Isn't it  really cool........:)

<br/>
Thanks,
Pavan

{% include /in_article_ads.html %}

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 03232019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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