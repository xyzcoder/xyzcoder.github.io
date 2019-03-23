---
title: Jquery optimization tip
layout: post
date: '2019-03-23 10:49:55'
comments: true
categories:
- Jquery
tags:
- Jquery
---

Sometime we write code using Jquery Custom selector to great extent. It works fine with pages that has less amount of data but when the page size is growing I am getting an error in ie (Unresponsive script error).

These are the few things that I did to overcome these kind of messages

# Lesson learnt
 In my opinion using the jquery selector something like this<br/>
$('[customAttribute=someValue]') should be avoided when the dom is huge.<br/><br/>
Reason: This selector searches entire dom content to find the element that has attribute "customAttribute" with value "someValue". This will be a performance hit if the page content is huge.
<br/><br/>
**Tip:**
If you want to make use of Jquery selectors it would be nice if we can cache it using some java script values.
<br/>
For example : 

```
$('[customttribute=someValue]');
$('[customttribute=someValue]').css('border','3px dotted green')
$('[customttribute=someValue]').parent();
```

<br/><br/>

Here we are adding some css and also trying to get parent element  of $('[customttribute=someValue]')<br/>

So what happens here is in the above code it will loop on entire pages dom elements twice to find the element and then it applies the css and to find parent element.
<br/><br/>
So to optimize this we can do something like this.


```
var domElement=$('[customttribute=someValue]');
domElement.css('border','3px dotted green');
domElement.parent();
```

<br/>
So we are doing the same task here but the only difference is we are caching the selector result into js variable . So it loops only once on entire page's dom to get the required element and then apply css and find parent.
<br/>
This has really a great impact on my code
<br/><br/>
**Keywords:** Jquery, Jquery Optimization

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
this.page.identifier = 03232019319; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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