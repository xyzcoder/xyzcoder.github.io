---
title: Javascript Code Snippet For Getting List Of Modified Files In A Github PullRequest
layout: post
date: '2019-03-14 11:32:21'
comments: true
categories:
- CodeSnippets
- Github_Pull_request_files_list
tags:
- CodeSnippets
- Github
---

Hi,
In this post I would like to share a small js code snippet which I use from Console of a browser to list all the files that were changed with the pull request. 
My usecase is usually I review pull request created my team mates and sometimes we will have 100's of files changed and when reviewing in the web and finding what all files changed , In that process I usually get confused. So I am planning to get all files changed and planning to copy them to an excel file and when I am done with my review of particular file, I can mark it as completed.

```
var elems = document.getElementsByClassName("link-gray-dark");
for (var i = 0; i < elems.length; i++) {
  var link = elems[i].innerText;
  console.log(link);
}
```

Note: This might have some junk output but that is very minimal and it helps me solve my purpose

{% include /in_article_ads.html %}

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 03042019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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