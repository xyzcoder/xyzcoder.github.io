---
title: Backspace In Visual Studio Not Working
layout: post
date: '2019-03-28 19:08:32'
comments: true
categories:
- VisualStudio
tags:
- VisualStudio
---

Recently I am getting a weird issue in my Visual Studio. **Backspace** is not working and it is so irritating.

# Solution
1. Go to "Tools" -- "Options" <br/>
2. In Options windows, under the menu "Environment"... Click on "Keyboard".
3. Now Search For "Edit.DeleteBackwards" and select it.
4. Now for the option "Use New Shortcut In" select "Text Editor"
5. Now for the option "Press Shortcut Key" text box... Go and click Backsapce and it should fill text box with "Bkspce".
6. Click Ok

<img src="{{ site.baseurl }}/assets/images/posts/errors/1.PNG"  alt="" style="width: 100%;height: 100%;"/>

{% include /in_article_ads.html %}

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
this.page.identifier = 03282019319; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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