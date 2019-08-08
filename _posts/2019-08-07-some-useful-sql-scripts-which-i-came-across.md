---
title: Some Useful SQL Scripts Which I Came Across
layout: post
date: '2019-08-07 11:34:55'
comments: true
Categories:
- SQL Server
tags:
- SQLServer
---

1. List Of all Tables and their columns along with datatypes

	```
SELECT	o.Name as TableName,c.Name as ColumnName,t.name as DataType,t.length as [DataLength]
	FROM sysobjects o JOIN syscolumns c ON o.id = c.id JOIN systypes t
	ON c.xtype = t.xtype
	WHERE o.xtype = 'u'
	ORDER By o.name
```

<br>
2. Search for a string accross all procedures

```
SELECT name
FROM   sys.procedures
WHERE  Object_definition(object_id) LIKE '%EmployeeBenefits%'
```

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
this.page.identifier = 08072019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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