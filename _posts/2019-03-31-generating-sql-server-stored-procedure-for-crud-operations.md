---
title: Automatically Generate Sql Server Stored Procedure for CRUD Operations
layout: post
date: '2019-03-31 19:01:40'
comments: true
categories:
- SqlServer
- VisualStudio
tags:
- SqlServer
- Visualstudio
---

Hi,
In this post I would like to share details on how to generate Stored Procedures for performing CRUD operations. I'll be using visual studio for this accomplishing this task.

# Step1:
Right click on the project name in Visual studio. Add a **new item**. Now under **visual c#** ---> **Data** --->**Dataset** and then add the file.

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/1.PNG"  alt="" style="width: 80%;height: 80%;"/>
<br/>
# Step2:
Right click on the xsd window and click on **Add** ---> **Table Adapter**

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/2.png"  alt="" style="width:80%;height: 80%;"/>
<br/>

# Step 3:
Now choose **data connection** window appears  and if we already have a connection string defined in web.config, It appears in the drop down. If not, click on **Add New Connection** and click next.

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/3.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>
{% include /in_article_ads.html %}

# Step 4:
Now choose comand type window appears  and there select **Create New Stored Procedures ** and click on next

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/4.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>

# Step 5:
Now in the new window, please provide your sql statement for a single table.<br/>
**Note: We cannot use joins or multiple select statements here for generating code for Crud operations on multiple tables**

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/5.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>

# Step 6:
Now in the **Create Stored Procedure ** window, please provide name for the proc we want to create.<br/>

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/6.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>

# Step 7:
Click on the Preview SQL Script.<br/>

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/7.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>
{% include /in_article_ads.html %}

# Step 8:
It generates a big sql file with all crud operations on that table.<br/>

<br/>

If you are only interested on the queries, just copy queries that you need and execute them in Sql server.

Note we need to customize this procedure code, If we want any enhancements.
<br/>

# Step 9:
Click on finish and then go back to Sql server and under stored procedures, we can our procedures created<br/>
Also we can delete xsd file which we added

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/sptemplate/7.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>
{% include /in_article_ads.html %}

But this really helped me in generating multiple procedure quickly instead of manually typing each param.

<br/>
Thanks,<br/>
Pavan Kumar Aryasomayajulu
<br/>
**Keywords:** sql, sql server, stored procedures, Generating Sql Procedures for Crud, Visual Studio

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 03312019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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