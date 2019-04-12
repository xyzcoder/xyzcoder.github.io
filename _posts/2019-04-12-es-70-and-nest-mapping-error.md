---
title: 'Failed to parse mapping [_doc]: Root mapping definition has unsupported parameters'
layout: post
date: '2019-04-12 14:11:58'
comments: true
categories:
- ElasticSearch
- Nest
- C#
tags:
- Nest
- ElasticSearch
---

Hi,
Recently I installed Elastic search 7.0 on one of my machines and I am using NEST C#(6.6.0) Client for interacting with it.<br/>

I started getting an exception when trying to create an index from C#.<br/>

Failed to parse mapping [_doc]: Root mapping definition has unsupported parameters:  [employee : {properties={office_hours={type=text}, last_name={type=text}, isManager={null_value=false, store=true, type=boolean}, empl={type=nested, properties={}}, salary={coerce=true, ignore_malformed=true, type=float, doc_values=false}, first_name={norms=false, similarity=LMDirichlet, type=text}}}]<br/>

```
Failed to parse mapping [_doc]: Root mapping definition has unsupported parameters:  [employee : {properties={office_hours={type=text}, last_name={type=text}, isManager={null_value=false, store=true, type=boolean}, empl={type=nested, properties={}}, salary={coerce=true, ignore_malformed=true, type=float, doc_values=false}, first_name={norms=false, similarity=LMDirichlet, type=text}}}]
```

</br>
</br>

Class I am trying to automap using Nest

```
		public class Employee
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

    }
```


**My auto indexing code:**

```
					
					var nodes = new[]
            {
                new Uri(ConfigurationManager.ConnectionStrings["elasticConnection"].ConnectionString)
            };

            var connectionPool = new StaticConnectionPool(nodes);
            var connectionSettings = new ConnectionSettings(connectionPool);
            var client = new ElasticClient(connectionSettings);
            
            var isIndexExists = client.IndexExists(new IndexExistsRequest("pavan"));
            if (!isIndexExists.Exists)
            {
                var createIndexResponse = client.CreateIndex("pavan", c => c
                    .Mappings(ms => ms.Map<Employee>(m => m.AutoMap())));
            }
```

# Reason For Error:

With Elastic search 7.0 , types were removed and when creating a mapping it no longer accepts types which is a breaking change<br/>

Previous syntax for creating a mapping:<br/>
```


PUT wverrors1
{
  "mappings": {
    "_doc": {
      "properties": {
        "date": {
          "type":   "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        }
      }
    }
  }
}

```

But this no longer work's and we need to remove _doc which is the type.<br/>

This is working syntax<br/>

```
PUT wverrors1
{
  "mappings": {
      "properties": {
        "date": {
          "type":   "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        }
      }
  }
}
```

Reference Urls: https://www.elastic.co/guide/en/elasticsearch/reference/master/removal-of-types.html<br/>

# Fix From Nest side:
As of now,from Nest side there is no alternative ( You can make use of the beta package available at https://ci.appveyor.com/nuget/elasticsearch-net) and I hope they will release a new version soon i Nugent to fix this issue and other breaking changes<br/>

There is an open issue from Nest side <br/>

https://github.com/elastic/elasticsearch-net/issues/3663<br/>

# Installing 7.0 Beta Nest Package 
If you still want to try Elastic search 7.0 with with Nest then you can try beta package available at 
https://ci.appveyor.com/nuget/elasticsearch-net<br/>

Below are steps for installing the beta version from appveyor<br/>

**Step 1:**: In Visual Studio Nuget packages window you can see a gear icon next to Package Source dropdown. Click that gear icon<br/>

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/EsMappingError/1.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>
{% include /in_article_ads.html %}
**Step2: **In the option popup there is a menu item "Nuget Package Manager"... Under that we can see "Package Source"<br/>


**Step3:** Click on Plus icon (+)... Now in the source for new item give this url https://ci.appveyor.com/nuget/elasticsearch-net and click on ok<br/>

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/EsMappingError/2.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>

**Step4 : **Now In Nugent Package window for package source select the newly added one from dropdown<br/>

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/EsMappingError/3.PNG"  alt="" style="width:80%;height: 80%;"/>
<br/>

**Step5:**: Now when we try to install Nest package, we will see "7.1.0-ci20190412T075554" prerelease version. and we can install it now.<br/>

<br/>
Thanks,<br/>
Pavan Kumar Aryasomayajulu
<br/>

{% include /in_article_ads.html %}
**Keywords:** Nest C# Client, Elastic search 7.0

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 04122019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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