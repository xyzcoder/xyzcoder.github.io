---
layout: post
title: Indexing Documents Using Logstash  SQL Server and also Python HighLevel Client
comments: true
date: '2020-07-29 14:06:18'
Categories:
- ElasticSearch
tags:
- ''
- ElasticSearch
---

Hi,
In my previous posts, we saw how we can create an Elastic search cluster using Docker. Please refer to that post  [https://xyzcoder.github.io/2020/07/23/elastic-search-cheetsheet.html](https://xyzcoder.github.io/2020/07/23/elastic-search-cheetsheet.html).

I also have a video recorded for that and you can visit it at 
[https://www.youtube.com/watch?v=v1s3bUcN3E4](https://www.youtube.com/watch?v=v1s3bUcN3E4)
<br><br>

Now in this post, we will see how we can add data to elastic search using various options. So that we can play with our Elastic Search indexed data in the next posts.
<br><br>
There are multiple ways of ingesting data into Elastic search. But in this post, I'll focus on **Logstash** and **Python** high-level client.
# Dataset for indexing
So in order to index data, I choose the StackOverflow data dump. Brent Ozar is a SQL Server guy who usually takes these StackOverflow dumps and converts it into SqlServer backup. So for this demo, I'll download (1GB compressed torrent)10GB of StackOverflow data dump and I'll extract it into SQL Server and then I'll index that into Elastic search using logstash.
<br><br>
Also to just show an example, I'll also create a JSON file with 500 Posts and then I'll index that Json file into Elastic search using Python's high-level client.

# Using Logstash docker conatiner For Indexing Data From Sql Server

Logstash is a server‑side data processing pipeline that ingests data from multiple sources simultaneously, transforms it, and then sends it to a "stash" like Elasticsearch. Apart from that, it can also be used to read data from ES and push that data to somewhere else.
<br><br>
Logstash mainly works by making use of   **Even processing Pipelines** . A pipeline is a configuration file, which consists of 3 stages
inputs → filters → outputs <br><br>
**Inputs** is used to specify the source of data. Logstash supports plugins related to various formats like JDBC plugin for Databases. Streaming and queuing platforms like Kafka, Azure Even hub, Kinesis. A list of supported input plugins can be found here 
[https://www.elastic.co/guide/en/logstash/current/input-plugins.html](https://www.elastic.co/guide/en/logstash/current/input-plugins.html) <br><br>


As I already mentioned, In this post I'll deal with Sql server as my input and Elastic Search as my destination.
<br><br>
Please do follow these steps:<br>
1.  Download SQL JDBC driver zip [https://go.microsoft.com/fwlink/?linkid=2122433](https://go.microsoft.com/fwlink/?linkid=2122433)
2.  Now extract the content of this jar to a folder called a **lib** somewhere in your drives. In my case, I am extracting it to "D:\LogstashSample\lib". So you should see **mssql-jdbc-8.2.2.jre11**
3.  Now create a file called **logstash.conf** in another folder called **pipeline** in the same level as **lib** folder.
4.  So our file structure looks like <br>
       D: <br>
         |-----LogstashSample <br>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-------lib <br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |-------mssql-jdbc-8.2.2.jre11 <br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-------pipeline <br>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |-------logstash.conf <br>
					
<br><br>

logstash.conf

```
input {
    jdbc {
           jdbc_driver_library => "/usr/share/logstash/javalib/mssql-jdbc-8.2.2.jre11.jar"
           jdbc_driver_class => "com.microsoft.sqlserver.jdbc.SQLServerDriver"
           jdbc_connection_string => "jdbc:sqlserver://host.docker.internal;database=StackOverflow2010;user=pavan;password=pavankumar@123"
           jdbc_user => "pavan"
           jdbc_password => "pavankumar@123"
           statement => "select top 500 * from StackOverflow2010.dbo.Posts"
        }
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200", "http://elasticsearch:9200"]
		index => "stackoverflow_top"
    }
    stdout {
        codec => rubydebug
    }
}
```
																	 
So, in the input plugin, we are specifying the path to our jar file. Note, this is the path in container. Don't get confused with D:\LogstashSamples\lib\mssql-jdbc-8.2.2.jre11.jar. We will map do that volume mounting in next steps.<br>
Next, as I am connecting to SqlServer I am using SQLServerDriver.<br><br>
Now I am passing the JDBC connection string. As I am connecting to SQL Server that was hosted on my host machine(My windows machine) from logstash container, I can connect using **host.docker.internal** and this will resolve to my local ip address. In case, if you would like to connect to remote SQL Server, please do specify that IP address.<br><br>

Finally, I am giving a SQL Statement and results of that query will get ingested into my ES index which is specified in output.<br><br>
Now as the last step, I need to run my Logstash Docker container and at the same time mount my folders **lib** and **pipeline** to respective folders in a container, so that my logstash container will pick them.<br><br>

```
docker run -it --net somenetwork -v $PWD/lib:/usr/share/logstash/javalib -v $PWD/pipeline/:/usr/share/logstash/pipeline/ docker.elastic.co/logstash/logstash:7.8.0
```

Open Powershell and command prompt and execute this command in the folder which contains **lib** and **plugin** folders. In my case, it is **D:\LogstashSample**. So in this docker command, we are mounting folders on my host machine to logstash container and starting logstash.<br><br>

Watch the output and also you can see records inserted into Elastic Search

```
GET /stackoverflow/_count
{
  "query": {
    "match_all": {}
  }
}
```

So this is simple and straight forward. Now let's try to add a bit of complexity to our problem.

# Nested document to elasticsearch using logstash
 In the above example, we saw how we can stream Posts table data into Elastic search. Now I also wanted to have users data added to the same ES document.<br><br>

The relation between Posts tables and Users table is OwnerUserId in the Posts table refers to Id in Users table

```
select top 500 * from StackOverflow2010.dbo.Posts p inner join StackOverflow2010.dbo.Users u
on p.OwnerUserId=u.Id
```

If I give this query in the above logstash pipeline, I'll be able to copy data but user data will be in the same level and the document looks something like this.

```
{
        "_index" : "stackoverflow_top",
        "_type" : "_doc",
        "_id" : "58UEmnMBrXsRTNbKoRrK",
        "_score" : 1.0,
        "_source" : {
          "title" : "Percentage width child element in absolutely positioned parent on Internet Explorer 7",
          "acceptedanswerid" : 31,
          "location" : "Oakland, CA",
          "aboutme" : """<p>Independent software engineer</p>
""",
          "displayname" : "Kevin Dente",
          "@timestamp" : "2020-07-29T10:00:58.900Z",
          "closeddate" : null,
          "accountid" : 7,
          "favoritecount" : 10,
          "upvotes" : 46,
          "downvotes" : 4,
          "websiteurl" : "http://weblogs.asp.net/kdente",
          "id" : 9,
          "lasteditordisplayname" : "Rich B",
          "reputation" : 14337,
          "viewcount" : 16306,
          "@version" : "1",
          "creationdate" : "2008-07-31T21:35:26.517Z",
          "commentcount" : 0,
          "body" : """<p>I have an absolutely positioned <code>div</code> containing several children, one of which is a relatively positioned <code>div</code>. When I use a <strong>percentage-based width</strong> on the child <code>div</code>, it collapses to '0' width on <a href="http://en.wikipedia.org/wiki/Internet_Explorer_7" rel="noreferrer">Internet&nbsp;Explorer&nbsp;7</a>, but not on Firefox or Safari.</p>
""",
          "score" : 256,
          "parentid" : 0,
          "age" : null,
          "communityowneddate" : null,
          "lasteditdate" : "2016-03-19T06:05:48.487Z",
          "views" : 4949,
          "lastactivitydate" : "2016-03-19T06:10:52.170Z",
          "emailhash" : null,
          "lasteditoruserid" : 63550,
          "answercount" : 5,
          "posttypeid" : 1,
          "lastaccessdate" : "2018-08-30T18:18:03.423Z",
          "owneruserid" : 9,
          "tags" : "<html><css><css3><internet-explorer-7>"
        }
      }
```

But I am expecting user data to be part of a nested object and not like above one.<br><br>

My new logstash.conf plugin file would be

```
input {
    jdbc {
           jdbc_driver_library => "/usr/share/logstash/javalib/mssql-jdbc-8.2.2.jre11.jar"
           jdbc_driver_class => "com.microsoft.sqlserver.jdbc.SQLServerDriver"
           jdbc_connection_string => "jdbc:sqlserver://host.docker.internal;database=StackOverflow2010;user=pavan;password=pavankumar@123"
           jdbc_user => "pavan"
           jdbc_password => "pavankumar@123"
           statement => "select top 500 * from StackOverflow2010.dbo.Posts p "
        }
}

filter{
	jdbc_streaming {
	jdbc_driver_library => "/usr/share/logstash/javalib/mssql-jdbc-8.2.2.jre11.jar"
	jdbc_driver_class => "com.microsoft.sqlserver.jdbc.SQLServerDriver"
	jdbc_connection_string => "jdbc:sqlserver://host.docker.internal;database=StackOverflow2010;user=pavan;password=pavankumar@123"
	jdbc_user => "pavan"
    jdbc_password => "pavankumar@123"
	statement => "select * from StackOverflow2010.dbo.Users u where u.Id = :owneruserid"
	parameters => {"owneruserid" => "owneruserid"}
	target => "user_details"
	}
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200", "http://elasticsearch:9200"]
		index => "stackoverflow_top_user"
    }
    stdout {
        codec => rubydebug
    }
}
```

So I am making use of filters component and for each record, I am getting corresponding User details and I am making use of **jdbc_streaming**

# Logstash Nested document Mapping Using Aggregate

```
input {
    jdbc {
           jdbc_driver_library => "/usr/share/logstash/javalib/mssql-jdbc-8.2.2.jre11.jar"
           jdbc_driver_class => "com.microsoft.sqlserver.jdbc.SQLServerDriver"
           jdbc_connection_string => "jdbc:sqlserver://host.docker.internal;database=StackOverflow2010;user=pavan;password=pavankumar@123"
           jdbc_user => "pavan"
           jdbc_password => "pavankumar@123"
           statement => "select top 500 p.Id as PostId,p.AcceptedAnswerId,p.AnswerCount,p.Body,u.Id as userid,u.DisplayName,u.Location
						from StackOverflow2010.dbo.Posts p inner join StackOverflow2010.dbo.Users u
						on p.OwnerUserId=u.Id"
        }
}

filter {
    aggregate {
        task_id => "%{postid}"
        code => "
            map['postid'] = event.get('postid')
            map['accepted_answer_id'] = event.get('acceptedanswerid')
            map['answer_count'] = event.get('answercount')
            map['body'] = event.get('body')
			map['user'] ||= []
            map['user'] << {
                'id' => event.get('userid'),
                'displayname' => event.get('displayname'),
                'location' => event.get('location')
            }
        event.cancel()"
        push_previous_map_as_event => true
        timeout => 30
    }
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200", "http://elasticsearch:9200"]
		index => "stackoverflow_top"
    }
    stdout {
        codec => rubydebug
    }
}
```
So in the above example we are trying to using joins in sql and then trying to map the data accordingly. 

# Logstash Single Nested Object instead of an array
So in the above example we can see that we have an array of user object but I am 200% sure that there will be only one item. In that case we can use this config

```
input {
    jdbc {
           jdbc_driver_library => "/usr/share/logstash/javalib/mssql-jdbc-8.2.2.jre11.jar"
           jdbc_driver_class => "com.microsoft.sqlserver.jdbc.SQLServerDriver"
           jdbc_connection_string => "jdbc:sqlserver://host.docker.internal;database=StackOverflow2010;user=pavan;password=pavankumar@123"
           jdbc_user => "pavan"
           jdbc_password => "pavankumar@123"
           statement => "select top 500 p.Id as PostId,p.AcceptedAnswerId,p.AnswerCount,p.Body,u.Id as userid,u.DisplayName,u.Location
						from StackOverflow2010.dbo.Posts p inner join StackOverflow2010.dbo.Users u
						on p.OwnerUserId=u.Id"
        }
}

filter {
    aggregate {
        task_id => "%{postid}"
        code => "
            map['postid'] = event.get('postid')
            map['accepted_answer_id'] = event.get('acceptedanswerid')
            map['answer_count'] = event.get('answercount')
            map['body'] = event.get('body')
            map['user'] = {
                'id' => event.get('userid'),
                'displayname' => event.get('displayname'),
                'location' => event.get('location')
            }
        event.cancel()"
        push_previous_map_as_event => true
        timeout => 30
    }
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200", "http://elasticsearch:9200"]
		index => "stackoverflow_top"
    }
    stdout {
        codec => rubydebug
    }
}
```

# Indexing Data with Python Highlevel client
I know Logstash is powerful and we can have multiple transformations. But In my case, as a developer, I feel comfortable with programming languages and I prefer C# or Python which are my fav programming languages. If I want to make complex transformations, then I prefer these instead of logstash and it is all choice.
<br><br>
Before executing the python file, you need to install an elastic search package

```
pip3 install elasticsearch
```

Now let's see how we can index data using Python and you need to have JSON file in the same directory where this python file is present in my sample.

```
from datetime import datetime
from elasticsearch import Elasticsearch
import json 
import os

es = Elasticsearch(['<es ip address>'])

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'test.json')
#f = open(my_file,'r') 
#data = json.load(f, strict=False) 

file1 = open(my_file, 'r',  encoding="utf8") 
Lines = file1.readlines() 

ii=0
for i in Lines:
    doc = json.loads(i.rstrip("\n"))
    res = es.index(index="test-index", id=ii, body=doc)
    print(res['result'])
    ii=ii+1
  
# Closing file 
file1.close()
```

In this example, I am trying to read data from a JSON file and trying to index it. We can also replace reading from Json with many things that logstash input is doing like Streams, PubSub queues, Databases, and many more.
<br>
If you want to try this, you can download this python file and also sample 500 StackOverflow records from my google drive

[https://drive.google.com/file/d/1AH_oK9Gmj7_IUjA0TVa4zD4iXURMWbwx/view](https://drive.google.com/file/d/1AH_oK9Gmj7_IUjA0TVa4zD4iXURMWbwx/view)


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
this.page.identifier = 29072020312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
