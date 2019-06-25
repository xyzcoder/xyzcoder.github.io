---
title: Making Use Of SQL Rest API In Elastic Search To Write Queries Easily
layout: post
date: '2019-06-25 17:06:47'
comments: true
categories:
- ElasticSearch
tags:
- ElasticSearch
---

Hello Everyone,
In this post I would like to discuss on how we can make use of **SQL Rest API In Elastic Search** to learn and write better queries and understand different aspects of a native elastic search query.
<br><br>

Coming from SQL background , I always felt like writing queries in Elastic search is bit complex(syntax) even when we want to achieve a minor thing compared to SQL.
<br><br>

Before actually going deep into my thoughts, First of all I want to create my test data including index creation and data insertion, So that I can demo my code easily. Here I am actually trying to create an index with name **customer** and adding 3 docs.

```
Post /customer/_doc
{
  "Name":"Arya Kumar",
  "Age":21,
  "address":{
    "Street": "21st March",
    "Area": "Pendurthy"
  }
}

Post /customer/_doc
{
  "Name":"Pavan Kumar",
  "Age":22,
  "address":{
    "Street": "21st March",
    "Area": "Pendurthy"
  }
}

Post /customer/_doc
{
  "Name":"Pavan Kumar",
  "Age":22,
  "address":{
    "Street": "JanaChaitanya Layout",
    "Area": "Pendurthy"
  }
}
```

<br><br>
# Querying Customer Index based on Name
**Elastic Search Query**: I want to query all customers with **Name = "Pavan Kumar"**
```
Get /customer/_search
{
  "query":
  {
    "match_phrase": {
      "Name": "Pavan Kumar"
    }
  }
}
```

{% include /in_article_ads.html %}

<br> It looks simple and easy right, lets try to add a filter where I want customers with name **'Pavan Kumar'** and also **StreetName = 'JanaChaitanya Layout'**

**Query 1**
```
Request:
=========================

Get /customer/_search
{
    "query" : {
    "bool" : {
      "must" : [
        {
          "term" : {
            "address.Street.keyword" : {
              "value" : "JanaChaitanya Layout",
              "boost" : 1.0
            }
          }
        },
        {
          "term" : {
            "Name.keyword" : {
              "value" : "Pavan Kumar",
              "boost" : 1.0
            }
          }
        }
      ]
    }
  }
}

Response:
===============

{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.4508328,
    "hits" : [
      {
        "_index" : "customer",
        "_type" : "_doc",
        "_id" : "JEF_jmsBbbFQFY4ft0JX",
        "_score" : 1.4508328,
        "_source" : {
          "Name" : "Pavan Kumar",
          "Age" : 22,
          "address" : {
            "Street" : "JanaChaitanya Layout",
            "Area" : "Pendurthy"
          }
        }
      }
    ]
  }
}

```

<br>
So coming from SQL background, I feel like this is bit complex, because I can achieve the same using a single line query
```
SELECT * FROM customer where address.Street='JanaChaitanya Layout' and Name='Pavan Kumar'
```
<br>
So comparitively SQL syntax is far better and cleaner right :)
<br>

**So do we have a way to use SQL syntax in Elastic Search..... And the answer is "YESSSSSSS"**

<br>
**Using Sql Rest API**: Sql Rest API comes to our rescue and it makes life of a developer with past SQL experience easy. An Equivalent of above Json based query is

**Query 2**
```
Request:
================

POST /_sql?format=json
{
    "query": "SELECT * FROM customer where address.Street='JanaChaitanya Layout' and Name='Pavan Kumar'"
}

Response:
===============

{"columns":[{"name":"Age","type":"long"},{"name":"Name","type":"text"},{"name":"address.Area","type":"text"},{"name":"address.Street","type":"text"}],"rows":[[22,"Pavan Kumar","Pendurthy","JanaChaitanya Layout"]]}
```

<br>

{% include /in_article_ads.html %}
# Getting Json based syntax from an Sql Rest API
Even though we got our desired response, It is slightly different in both scenarios and I would like to write queries with my sql knowledge and convert them to Json based queries. **translate** api comes to our rescue in this case

**Query 3**
```
Request:
========================

POST /_sql/translate
{
    "query": "SELECT * FROM customer where address.Street='JanaChaitanya Layout' and Name='Pavan Kumar'"
}

Response:
========================

{
  "size" : 1000,
  "query" : {
    "bool" : {
      "must" : [
        {
          "term" : {
            "address.Street.keyword" : {
              "value" : "JanaChaitanya Layout",
              "boost" : 1.0
            }
          }
        },
        {
          "term" : {
            "Name.keyword" : {
              "value" : "Pavan Kumar",
              "boost" : 1.0
            }
          }
        }
      ],
      "adjust_pure_negative" : true,
      "boost" : 1.0
    }
  },
  "_source" : {
    "includes" : [
      "Name",
      "address.Area",
      "address.Street"
    ],
    "excludes" : [ ]
  },
  "docvalue_fields" : [
    {
      "field" : "Age"
    }
  ],
  "sort" : [
    {
      "_doc" : {
        "order" : "asc"
      }
    }
  ]
}
```

<br>
So we can use above response and get the results.
<br> For example:

**Query 4**
```
Get /customer/_search
{
  "size" : 1000,
  "query" : {
    "bool" : {
      "must" : [
        {
          "term" : {
            "address.Street.keyword" : {
              "value" : "JanaChaitanya Layout",
              "boost" : 1.0
            }
          }
        },
        {
          "term" : {
            "Name.keyword" : {
              "value" : "Pavan Kumar",
              "boost" : 1.0
            }
          }
        }
      ],
      "adjust_pure_negative" : true,
      "boost" : 1.0
    }
  },
  "_source" : {
    "includes" : [
      "Name",
      "address.Area",
      "address.Street"
    ],
    "excludes" : [ ]
  },
  "docvalue_fields" : [
    {
      "field" : "Age"
    }
  ],
  "sort" : [
    {
      "_doc" : {
        "order" : "asc"
      }
    }
  ]
}
```

<br>
So my query in **Query 1** looks different from **Query 4**... And I was actually expecting that... Yes both of them are same but here Elastic search is making some true translations from SQL query to json based query
<br>
For example:

```
"_source" : {
    "includes" : [
      "Name",
      "address.Area",
      "address.Street"
    ],
    "excludes" : [ ]
  },
```

It is to indicate that we need to include all columns and It can be ignored when we whant to get whole document.
<br>

**docvalue_fields** tag can be ignored because it can be used when we want to specify custom formats on integers and Date fields and even this can be ignored if we dont want.
<br>
So basically what I liked here is, by using simple Sql statements which I am familiar with, I am able to easily translate my sql querying knowledge to Elastic search.
<br>

# Gist:
1. Write a SQL query in Elastic Search
2. Use Translate API to get actual json based query
3. Use the Json based query which we got from step 2.
<br><br>
# Some Samples: GroupBy Query Alias Aggregations
```

1. Write Sql query and check data:
=======================================

Request:
--------------

POST /_sql?format=json&pretty
{
    "query": "SELECT count(*),Name FROM customer group by Name,Age"
}

Response:
--------------

{"columns":[{"name":"count(*)","type":"long"},{"name":"Name","type":"text"}],"rows":[[1,"Arya Kumar"],[2,"Pavan Kumar"]],"cursor":"o6CrAwFjAQhjdXN0b21lcogBAQEJY29tcG9zaXRlB2dyb3VwYnkAAP8CAAM3MjEBDE5hbWUua2V5d29yZAAAAQAAAAM3MjABA0FnZQAAAQAA6AcBCgIDNzIxAAtQYXZhbiBLdW1hcgM3MjACAAAAAAAAABYAAgEAAAAAAQD/////DwAAAAAAAAAAAAAAAAFaAwACAgAAAAAAAP3///8PAgFrAzcyMAEBWgABawM3MjEAAVoAAQM="}

2. Write Translate query:
=======================================
Request:
--------------

POST /_sql/translate
{
    "query": "SELECT count(*),Name FROM customer group by Name,Age"
}

Response:
--------------

{
  "size" : 0,
  "_source" : false,
  "stored_fields" : "_none_",
  "aggregations" : {
    "groupby" : {
      "composite" : {
        "size" : 1000,
        "sources" : [
          {
            "737" : {
              "terms" : {
                "field" : "Name.keyword",
                "missing_bucket" : true,
                "order" : "asc"
              }
            }
          },
          {
            "736" : {
              "terms" : {
                "field" : "Age",
                "missing_bucket" : true,
                "order" : "asc"
              }
            }
          }
        ]
      }
    }
  }
}

3. Copy Output from Above one and Use that In Get Query:
=================================================

Request:
--------------

Get /customer/_search
{
  "size" : 0,
  "_source" : false,
  "stored_fields" : "_none_",
  "aggregations" : {
    "groupby" : {
      "composite" : {
        "size" : 1000,
        "sources" : [
          {
            "705" : {
              "terms" : {
                "field" : "Name.keyword",
                "missing_bucket" : true,
                "order" : "asc"
              }
            }
          },
          {
            "704" : {
              "terms" : {
                "field" : "Age",
                "missing_bucket" : true,
                "order" : "asc"
              }
            }
          }
        ]
      }
    }
  }
}
```


<br><br>
Thanks,<br>
Pavan Kumar Aryasomayajulu

{% include /in_article_ads.html %}
**Keywords:**  Elastic search 7.0, Elastic search Rest API

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 06252019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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