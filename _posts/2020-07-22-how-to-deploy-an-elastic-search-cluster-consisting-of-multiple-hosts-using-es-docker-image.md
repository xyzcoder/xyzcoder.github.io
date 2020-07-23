---
layout: post
title: How to deploy an Elastic Search cluster consisting of multiple hosts using
  ES docker image?
comments: true
date: '2020-07-22 11:23:24'
Categories:
- elasticsearch
- docker
tags:
- ''
- ElasticSearch
---

Hi,
In this post I'll discuss on how to deploy Elastic Search docker images as a cluster on multiple hosts ( Note: This is not about single host machine running multiple elastic search containers). This is all about having multiple Linux/Windows machines in a network  and on each machine we will deploy one elastic search docker container as a node.
<br>
<br>
Initially, I want to discuss about various problems that I faced with various solutions and finally working one.
<br><br>
**ElasticSearch 7 start up error - the default discovery settings are unsuitable for production use;**
<br>
**master not discovered yet, this node has not previously joined a bootstrapped (v7+) cluster, and [cluster.initial_master_nodes] is empty on this node**
<br><br>
This is because I didn't actually specify a few env variables required for ES to form the cluster
<br>
<br>
So in order to avoid these errors, we need to consider the following things:<br>
1.  All hosts must be inter-connected
2.  Ports 9200 and 9300 should be open
3.  We need to pass all participating nodes IP address and at the same time specify master nodes IP address

<br><br>
```

# These 2 commands should be executed on my host machine with IP 192.168.0.24
docker network create somenetwork

docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 --name elasticsearch \
-e "discovery.seed_hosts=192.168.0.25,192.168.0.26,192.168.0.27,192.168.0.28" \
-e "node.name=es01" \
-e "cluster.initial_master_nodes=es01,es02,es03,es04,es05" \
-e "network.publish_host=192.168.0.24" \
docker.elastic.co/elasticsearch/elasticsearch:7.8.0


# This commands should be executed on my host machine with IP 192.168.0.25

docker run -p 9200:9200 -p 9300:9300 \
-e "discovery.seed_hosts=192.168.0.24,192.168.0.26,192.168.0.27,192.168.0.28" \
-e "node.name=es02" \
-e "cluster.initial_master_nodes=es01,es02,es03,es04,es05" \
-e "network.publish_host=192.168.0.25" \
docker.elastic.co/elasticsearch/elasticsearch:7.8.0

# This commands should be executed on my host machine with IP 192.168.0.26

docker run -p 9200:9200 -p 9300:9300 \
-e "discovery.seed_hosts=192.168.0.24,192.168.0.25,192.168.0.27,192.168.0.28" \
-e "node.name=es03" \
-e "cluster.initial_master_nodes=es01,es02,es03,es04,es05" \
-e "network.publish_host=192.168.0.26" \
docker.elastic.co/elasticsearch/elasticsearch:7.8.0


# This commands should be executed on my host machine with IP 192.168.0.27

docker run -p 9200:9200 -p 9300:9300 \
-e "discovery.seed_hosts=192.168.0.24,192.168.0.25,192.168.0.26,192.168.0.28" \
-e "node.name=es04" \
-e "cluster.initial_master_nodes=es01,es02,es03,es04,es05" \
-e "network.publish_host=192.168.0.27" \
docker.elastic.co/elasticsearch/elasticsearch:7.8.0

# This commands should be executed on my host machine with IP 192.168.0.28

docker run -p 9200:9200 -p 9300:9300 \
-e "discovery.seed_hosts=192.168.0.24,192.168.0.25,192.168.0.26,192.168.0.27" \
-e "node.name=es05" \
-e "cluster.initial_master_nodes=es01,es02,es03,es04,es05" \
-e "network.publish_host=192.168.0.28" \
docker.elastic.co/elasticsearch/elasticsearch:7.8.0

# This commands should be executed on my host machine with IP 192.168.0.24 where we are planning to install Kibana

docker run -d -p 5601:5601 --network somenetwork -e "ELASTICSEARCH_HOSTS=http://192.168.0.24:9200" kibana:7.8.0

```

So let me explain on what is happening here.<br><br>
1. Initially I am creating a network on which I am actually planning to install docker and also Kibana
2. These are my private IP addresses of my host machines and I am actually planning to have a cluster with 5 nodes
3. **192.168.0.24,192.168.0.25,192.168.0.26,192.168.0.27,192.168.0.28** These are my host machine IP addresses
4. So I have 5 docker run commands and each one should be executed on respective machines.
5. If we closely monitor each of these docker run commands, I am specifying a **node name** to identify the node
6. Next  **cluster.initial_master_nodes**, This is to specify all my master eligible nodes. So even if one goes down then one of the other nodes will act as a master
7. **discovery.seed_hosts** you should use the discovery.seed_hosts setting to provide a list of other nodes in the cluster that are master-eligible and likely to be live and contactable in order to seed the discovery process. This setting should be a list of the addresses of all the master-eligible nodes in the cluster. Each address can be either an IP address or a hostname which resolves to one or more IP addresses via DNS.
8. **network.publish_host** This is to specify that my other nodes in the cluster can connect to this node using this IP address.
9. docker.elastic.co/elasticsearch/elasticsearch:7.8.0 Is my docker image and 7.8.0 is the version of Elastic search

<br><br>
So if you quickly want to play with Elastic search cluster creation, then you can try it on [Docker Playground](https://labs.play-with-docker.com/) where you can try to create docker containers.
<br>
All you need to do is create an account, and then after you login. Create 5 different nodes by using the button **Add New Instances** 5 times. You'll see 5 different instances with different IPs.<br>
Now execute these commands on each of these instances and make sure you'll have appropriate IP addresses.<br>
Also, you need to wait for some time like 2-3mins for ES to start. Finally, you'll see 9200 port open at the top of Docker playground web page and click on that button and it will open a new tab with Elastic search address.<br><br>
Now you can use postman to issue commands to Elastic search or a Curl client.


# Want to try just Single instance of Elastic search On Docker Playground or Docker?

You can use these commands to start Elastic search and also Kibana

```
docker network create somenetwork
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.8.0
docker run -d --name kibana --net somenetwork -p 5601:5601 kibana:7.8.0
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
this.page.identifier = 22072020312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
