---
layout: post
title: Elastic Search Mapping and Index Creation
comments: true
date: '2020-08-03 11:45:38'
Categories:
- ElasticSearch
tags:
- ''
- ElasticSearch
---

Hi,
In my previous posts we saw how we can leverage docker playground to install Elastic Search and then creating cluster and also indexing data into  Elastic cluster. You can find these links here<br><br>

1. [Starting Elastic Search cluster using Docker and Docker Play ground]( https://xyzcoder.github.io/2020/07/22/how-to-deploy-an-elastic-search-cluster-consisting-of-multiple-hosts-using-es-docker-image.html)
2. [Cluster, Nodes and Shards in Elastic Search](https://xyzcoder.github.io/2020/07/23/elastic-search-cheetsheet.html)
3. [Indexing Documents using Logstash and Python High level client](https://xyzcoder.github.io/2020/07/29/indexing-documents-using-logstash-and-python.html)

<br><br>
Now in this post, we will see how to create schema for an index
<br>

# Auto Index Creation Setting
There is a property defined in elasticsearch and if it is turned on, we can automatically create indices without predefining any schema for that index(Mapping). By default it is set to true and if you want to turn it off, you can try this

```
PUT _cluster/settings
{
  "persistent": {
    "action.auto_create_index": "false"
  }
}
```

If we make it false and try to index a document without creating mapping(schema) for that index, it will throw an error. For example

```
Post testindex1/_doc
{
  "field1":"aa"
}


/// Error message that we get
{
  "error" : {
    "root_cause" : [
      {
        "type" : "index_not_found_exception",
        "reason" : "no such index [testindex1]",
        "resource.type" : "index_expression",
        "resource.id" : "testindex1",
        "index_uuid" : "_na_",
        "index" : "testindex1"
      }
    ],
    "type" : "index_not_found_exception",
    "reason" : "no such index [testindex1]",
    "resource.type" : "index_expression",
    "resource.id" : "testindex1",
    "index_uuid" : "_na_",
    "index" : "testindex1"
  },
  "status" : 404
}

```
If the value is set to true, then it will automatically create an index for us when trying to insert a document into an index that doesnt exist previously.
<br><br>
Apart from true and false values we can also specify wild card entries to allow or disable certain index names

```
PUT _cluster/settings
{
    "persistent": {
        "action.auto_create_index": "twitter,index10,-index1*,+ind*" 
    }
}

```
Here we are allowing **twitter,index10** and anything that starts with **ind** and some values next to it. Also anything that starts with **index1** is not allowed.

# So why did we go through this Auto index creation before actually getting started with Mapping?
The only reason why we discussed about that setting is , we are more interested in auto create index value true.<br>
So, In  RDBMS schema is very important and without schema, it is not even possible to insert data into that particular table. But in case of Elastic search, especially when **auto_create_index** is set to true, we are able to insert data and create an index without specifying schema (Mapping). <br><br>

**So whats the miracle behind this ?**<br>
The answer is very simple, Elastic search is smart enough to predict datatypes based on the document inserted and it will take care of creating mapping(schema) and index creation along with new document insertion.<br><br>
So lets try to add a document into an index that doesnt exists. Make sure that "auto_create_index" is set to true here.

```
Post testindex1/_doc
{
  "field1":"aa",
  "field2":23
}
```

Now lets see mapping for this index.

```
Get testindex1/_mapping

/////////////////// Result ////////////////////////

{
  "testindex1" : {
    "mappings" : {
      "properties" : {
        "field1" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "field2" : {
          "type" : "long"
        }
      }
    }
  }
}

```
So in this case, we didnt create any mapping /index explicts before inserting the document. But Elastic Search itself took care of these steps and added mapping. So if we observe mapping that was created, we can see that field1 is created as a string and field2 is created as a float. So to some extent Elastic search is able to guess datatypes ( I am saying to some extent because, My intention for field2 is just an integer but it took long which is ok to some extent)

# So can I try to update mapping for an existing field? 
The answer is no. As I mentioned in above case, I wanted to have integer type to field2 but it to took long. So let me try to update that properties mapping and see what the result is.

```
Put testindex1/_mapping
{
  "properties":
  {
    "field2":
    {
      "type":"integer"
    }
  }
}

\\\\\\\\\\\\\\\\\\\\\\\\\\\      Result  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
{
  "error" : {
    "root_cause" : [
      {
        "type" : "illegal_argument_exception",
        "reason" : "mapper [field2] cannot be changed from type [long] to [integer]"
      }
    ],
    "type" : "illegal_argument_exception",
    "reason" : "mapper [field2] cannot be changed from type [long] to [integer]"
  },
  "status" : 400
}


```
So it is saying that I'll not be able to change datatype from long to integer.

# So I am not able to update a field mapping but can I add a new field mapping?
Yes it possible to add a new field via Update mapping command and specify datatype we want Int he below example, I am trying to add a new field (field3)

```
Put testindex1/_mapping
{
  "properties":
  {
    "field3":
    {
      "type":"integer"
    }
  }
}

Get testindex1/_mapping

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\      Result   \\\\\\\\\\\\\\\\\\\\\\\\\

{
  "testindex1" : {
    "mappings" : {
      "properties" : {
        "field1" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "field2" : {
          "type" : "long"
        },
        "field3" : {
          "type" : "integer"
        }
      }
    }
  }
}

```
We can see field3 is added and its datatype is integer.

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
this.page.identifier = 03082020312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
