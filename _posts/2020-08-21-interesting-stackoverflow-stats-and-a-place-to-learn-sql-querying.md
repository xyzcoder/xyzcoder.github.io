---
layout: post
title: Interesting Stackoverflow stats and a place to learn SQL Querying
comments: true
date: '2020-08-21 12:20:58'
Categories:
- Stackoverflow
- Sql
tags:
- ''
- SqlServer
description: "Did you ever think like it would be nice to learn and execute SQL queries
  on  381GB+ data?\ndata.stackexchange.com is the place where you can execute an unlimited
  number of queries and find out interesting stats on the Stackoverflow dataset. \nstack
  exchange data science or stack exchange data explorer"
---

Hi,<br>
Did you ever think like it would be nice to learn and execute SQL queries on  381GB+ data?
<br><br>
[https://data.stackexchange.com/](https://data.stackexchange.com/) is the place where you can execute an unlimited number of queries and find out interesting stats on Stackoverflow dataset?
<br><br>

I did write a few queries to find out interesting stats on users from my city (Visakhapatnam). You can also play with the site and learn SQL querying and at the same time find out nice stats. <br><br>

Some of my queries:
[https://data.stackexchange.com/users/32567/pavan-kumar-aryasomayajulu](https://data.stackexchange.com/users/32567/pavan-kumar-aryasomayajulu)
# 1. How to use this dataset for learning purposes?<br>
[https://data.stackexchange.com/stackoverflow/query/1283225/get-top-questions-by-score](https://data.stackexchange.com/stackoverflow/query/1283225/get-top-questions-by-score)<br>
For example, I want to find out all questions with a particular tag. So how does this help me, So I'll sort this query based on "score" count in desc order. Score count is nothing but a number of upvotes for a question. So Questions with more upvotes are common problems related to that tech stack or they are some must-know basics in that area.
<br><br>
This way for sure I'll try to learn in and outs about these top questions

```
select id,score,title,FavoriteCount,body,viewcount from posts where tags like '%elasticsearch%' and score>1 order by score desc
```

<br>
# 2. I am trying to get active users with more questions/answers in my city.

[https://data.stackexchange.com/stackoverflow/query/1283632/get-top-active-stackoverflow-contributors-in-your-city](https://data.stackexchange.com/stackoverflow/query/1283632/get-top-active-stackoverflow-contributors-in-your-city)

```
Select * from (select (select count(id) from posts where owneruserid=u.id) as TotalPosts,*
from users u where lower(location) like '%visak%' and Year(LastAccessDate)=2020 ) a
where TotalPosts>0
order by TotalPosts desc,LastAccessDate desc

/*
select p.totalPosts,*
from users u inner join ( select distinct owneruserid,count(id) over(partition by owneruserid) as TotalPosts from posts) p
on u.id=p.owneruserid
where p.totalPosts>0 and lower(location) like '%visak%' and Year(LastAccessDate)=2020
order by p.TotalPosts desc,LastAccessDate desc


select * from (select distinct t.*,count(p1.id) over(partition by p1.owneruserid) as totalPosts from users t 
inner join posts p1
on t.Id=p1.owneruserid
where lower(location) like '%visak%' and Year(LastAccessDate)=2020) a
where totalPosts>0 
order by TotalPosts desc,LastAccessDate desc

*/
```
<br>

# 3. What is your current position in terms of number of questions answered in your city
```
with test1 as (select distinct
u.id,DisplayName,reputation, location,
count(p.id) over(partition by u.id) as [questions answered]
from users u left join posts p on u.id=p.owneruserid
where lower(location) like '%visak%'
)


/* Select row_number() over(order by [questions answered] desc) as rownum,*,sum(reputation) over() as [Total Stackoverflow reputation In your City]
from test1 order by [questions answered] desc

*/

select * from (Select row_number() over(order by [questions answered] desc) as [your position],*,sum([questions answered]) over() as [Total Stackoverflow questions answered In your City]
from test1 ) as t1 where id=1415739
```


<br><br>
Apart from these you can also find more queries that are already present and written by others<br><br>


#stack exchange data science <br>
#stack exchange data explorer

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
this.page.identifier = 21082020312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
