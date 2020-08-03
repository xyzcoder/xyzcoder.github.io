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
In my previous posts, we saw how we can leverage the Docker playground to install Elastic Search and then creating clusters and also indexing data into  Elastic cluster. You can find these links here<br><br>

1. [Starting Elastic Search cluster using Docker and Docker Play ground]( https://xyzcoder.github.io/2020/07/22/how-to-deploy-an-elastic-search-cluster-consisting-of-multiple-hosts-using-es-docker-image.html)
2. [Cluster, Nodes and Shards in Elastic Search](https://xyzcoder.github.io/2020/07/23/elastic-search-cheetsheet.html)
3. [Indexing Documents using Logstash and Python High level client](https://xyzcoder.github.io/2020/07/29/indexing-documents-using-logstash-and-python.html)

<br><br>
Now in this post, we will see how to create a schema for an index
<br>

# Auto Index Creation Setting
There is a property defined in elasticsearch and if it is turned on, we can automatically create indices without predefining any schema for that index(Mapping). By default, it is set to true and if you want to turn it off, you can try this

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
If the value is set to true, then it will automatically create an index for us when trying to insert a document into an index that doesn't exist previously.
<br><br>
Apart from true and false values, we can also specify wild card entries to allow or disable certain index names

```
PUT _cluster/settings
{
    "persistent": {
        "action.auto_create_index": "twitter,index10,-index1*,+ind*" 
    }
}

```
Here we are allowing **twitter,index10**, and anything that starts with **ind** and some values next to it. Also, anything that starts with **index1** is not allowed.

# So why did we go through this Auto index creation before actually getting started with Mapping?
The only reason why we discussed that setting is, we are more interested in auto create index value true.<br>
So, In  RDBMS schema is very important and without schema, it is not even possible to insert data into that particular table. But in case of Elastic search, especially when **auto_create_index** is set to true, we are able to insert data and create an index without specifying schema (Mapping). <br><br>

**So what's the miracle behind this ?**<br>
The answer is very simple, Elastic search is smart enough to predict datatypes based on the document inserted and it will take care of creating mapping(schema) and index creation along with new document insertion.<br><br>
So let's try to add a document into an index that doesn't exist. Make sure that "auto_create_index" is set to true here.

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
So in this case, we didn't create any mapping /index explicit before inserting the document. But Elastic Search itself took care of these steps and added mapping. So if we observe mapping that was created, we can see that field1 is created as a string, and field2 is created as afloat. So to some extent, Elastic search is able to guess datatypes ( I am saying to some extent because My intention for field2 is just an integer but it took long which is ok to some extent)

# So can I try to update mapping for an existing field? 
The answer is no. As I mentioned in the above case, I wanted to have integer type to field2 but it took longer. So let me try to update that properties mapping and see what the result is.

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
So it is saying that I'll not be able to change datatype from long to an integer.

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

# That is Cool but still do I need to update this mapping manually whenever I want to add a new column. or Is it possible for Elastic search to guess the type and add it to mapping?
Yes of course Elastic search can guess the datatype and simply add the new property to mapping when we add a new column at the time of document update or document insertion. Let's see how it does that.<br><br>

Make sure that the new field you are trying to add is not present in existing mapping by issuing Get mapping command

```
Get testindex1/_mapping
```

Ok field5 is not present in mapping. Now lets try to add it to a new document

```
Post testindex1/_doc
{
  "field1":"aa",
  "field5":"This is newly added field and Lets see if ES add it to mapping?"
}
```

Now If we see the mapping, we can see our new field5 is automatically added to mapping without us giving any mapping update command.

# Though we see few benefits of automatic mapping there are few cons too:
Yes, that is correct. Even though the feature auto mapping looks fancy,  it has problems too. Let's take a small example, previously I already have a field with the name "field1" but unfortunately, when adding a document, I gave my field name as "**Field1**" and the only difference there is **F** capital. Let's try to index it and see what the mapping looks like.

```
Post testindex1/_doc
{
  "Field1":"aa"
}
```

And lets observe mapping now

```
Get testindex1/_mapping

\\\\\\\\\\\\\\\\\\    Result \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
{
  "testindex1" : {
    "mappings" : {
      "properties" : {
        "Field1" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "field1" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    }
  }
}

```

So if we observe we have 2 fields created, **field1** and also **Field1**. Though it is a one time mistake, it is costly over a period of time because people usually get confused on what is the right field.<br>
<br>
In the same way, if the dynamic mapping is allowed, over a period of time there are chances of mapping getting polluted.

# A solution to the above problem is to have the strict mapping
So strict mapping comes to our rescue for the above problem. Usually, when we have the mapping set to strict, we will not be able to add new fields via an update or insert document.
<br><br>
**How to set mapping as strict **:<br>
So the same update mapping can be used to set mapping as strict

```
Put testindex1/_mapping
{
  "dynamic":"strict"
}
```

Now lets try to add a new document with a new field

```
Post testindex1/_doc
{
  "field10":"aa"
}
```

Result after executing this

```
{
  "error" : {
    "root_cause" : [
      {
        "type" : "strict_dynamic_mapping_exception",
        "reason" : "mapping set to strict, dynamic introduction of [field10] within [_doc] is not allowed"
      }
    ],
    "type" : "strict_dynamic_mapping_exception",
    "reason" : "mapping set to strict, dynamic introduction of [field10] within [_doc] is not allowed"
  },
  "status" : 400
}

```
It is throwing an error

# Options for Dynamic Mapping
```
Put testindex1/_mapping
{
  "dynamic":"strict"
}
```
With strict, we will not be able to add new fields via an update or insert

```
Put testindex1/_mapping
{
  "dynamic":"true"
}
```
With dynamic=true, we will be able to add new fields via an update or insert and mapping will be automatically updated and in this case, ES will infer field type unless we specify it using update/insert mapping

```
Put testindex1/_mapping
{
  "dynamic":"false"
}
```
When we set dynamic=false, we will we able to add fields to document, but they will not be indexed and we will not be able to search documents based on these fields.

# Elastic search supported Datatypes
```
text and keyword
long, integer, short, byte, double, float, half_float, scaled_float
date
boolean
binary
integer_range, float_range, long_range, double_range, date_range, ip_range
object
Nested
```
These are the datatypes supported by ES and there are few more but lets discuss them in future posts.

# Finally, it's time to create an index by creating mapping
Till now the majority of the time, we saw about the index that was created automatically. Now let's see how we can create an index by specifying mapping at the time of the creation

```
Put stackoverflow_top1/
{
  "mappings":
  {
    "properties":
    {
      "name":{
        "type":"text",
        "fields":{
          "keyword":
          {
            "type":"keyword"
          }
        }
      },
      "age":{
        "type":"integer"
      },
      "address":
      {
        "properties":
        {
          "address1":
          {
            "type":"text"
          },
          "state_code":
          {
            "type":"keyword"
          },
          "country":
          {
            "type":"keyword"
          }
        }
      }
    }
  }
}

```

So my mapping above represent an object of this type

```
{
  "name":"Pavan",
  "age":23,
  "address":[
    {
      "address1":"Prasanthi Nagar",
      "state_code":"AP",
      "country":"India"
    }]
}

```

Here apart from **keyword** and **text** , it is pretty straight forward.
<br>
<br>
When we use **Keyword** , ES will not analyze field data but with **text**, it will analyze data. So we will see it in the future. But for now, any field which is declared as **keyword** can only be searched by exact data that we inserted.
<br><br>
For example, "This is Pavan" and if this is indexed as **keyword**, we can only search by specifying "This is Pavan" <br><br>
But If we specify a field as **text**, I can search the same doc with values like **this, is, pavan,This,Is,Pavan,THIS,IS,PAVAN**. <br>
For now, this info should be fine related to **keyword** and **text**

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
