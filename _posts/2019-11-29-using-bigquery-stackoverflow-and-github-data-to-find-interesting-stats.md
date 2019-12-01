---
layout: post
title: Using BigQuery Stackoverflow and Github Data To Find Interesting Stats
date: '2019-11-29 13:28:40'
comments: true
Categories:
- BigQuery
- Stackoverflow
- Github
- PublicDataSet
tags:
- BigQuery
- Stackoverflow
- Github
- PublicDataSet
---

<style type="text/css"> .gist {max-height:250px; overflow:auto}  .gist .file-data {max-height: 500px;max-width: 500px;} </style>


Hello Everyone,
As a developer, I use Stackoverflow and Github everyday. So I know these sites play a vital role in almost every software developers day to day life.<br>

So In this post, I would like to find some interesting stats like how many .cs(C# files) have stackoverflow question as a comment and then which answer or question they are actually refering to. I'll be making use of Google's BigQuery and open datasets provided by them to find out these relationships.<br>

# BigQuery
"BigQuery is an enterprise data warehouse that solves this problem by enabling super-fast SQL queries using the processing power of Google's infrastructure. ... You can control access to both the project and your data based on your business needs, such as giving others the ability to view or query your data" -- Google's definition<br><br>

So Google provides us ability to query in sql format by uploading large datasets or even we can [public datasets](https://console.cloud.google.com/marketplace/browse?filter=solution-type:dataset&_ga=2.36387364.-58570473.1575000853) <br>
<br>
Google has almost 124 different public datasets available in the market place from various domains.
<br>


# Getting Started With BigQuery
Navigate to [https://console.cloud.google.com/bigquery] (https://console.cloud.google.com/bigquery) <br>
<br>
Login with your gmail account
<br>
<img src="{{ site.baseurl }}/assets/images/posts/bigquery/bigquery1.JPG"  alt="" style="width: 80%;height: 80%;"/>
<br>
Click on select project and add a new project if you dont have one or the quota got expired for existing one. Once we are done with the project creation, following screen appears.<br>
<img src="{{ site.baseurl }}/assets/images/posts/bigquery/bigquery2.JPG"  alt="" style="width: 80%;height: 80%;"/><br>
At the bottom we can see **bigquery-public-data** and there we can see different public datasets. I am more interested in **github_repos** and **stackoverflow** datasets.
<br>
When we expand **github_repos** we can see different tables available and when we click on a table name we can see schema. If we click on preview, we can see sample data.
# Finding Languages Used In Repos
<br>

```
SELECT distinct(lang.name) as lang FROM `bigquery-public-data.github_repos.languages`, UNNEST(language) as lang
```

<script src="https://gist.github.com/pavanarya/3766b5bdbb833c6ad906539375cd37ec.js"></script>

# How many times a language is used in different repos
```
Select lang,count(lang) as count FROM (
SELECT lang.name as lang FROM `bigquery-public-data.github_repos.languages`, UNNEST(language) as lang) a group by lang order by count(lang) desc
```

<br>
**Explore with DataStudio**
<br>
Google also provides us with the ability to plot various graphs and visualizations based on the data which we got. Once we get the query result, there is an option called "Explore with Datastudio". We can assiociate our account to make use of that feature and there we can plot different graphs.<br><br>


<img src="{{ site.baseurl }}/assets/images/posts/bigquery/bigquery3.JPG"  alt="" style="width: 80%;height: 80%;"/><br><br><br>
**Note:** In my case, I need to set **Metric** as **"count"** instead of the default value **"Record Count"** uder data or else we will not get appropriate results.


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
this.page.identifier = 29102019312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
