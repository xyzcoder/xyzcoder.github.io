---
layout: post
title: Elastic Search -- Clusters, Nodes, and Shards
comments: true
date: '2020-07-23 15:00:32'
Categories:
- ElasticSearch
tags:
- ''
- ElasticSearch
---

In this post I am actually writing all queries that we use day to day as a cheatsheet.<br><br>

**Are you thinking of trying Elastic Search from long time and didnt get a chance or proper infrastructure. Then you can try creating elastic search in Docker Play ground and play with it.**
<br>

```
Login to https://labs.play-with-docker.com/ and create an instance and excute following single cluster commands.
 If you have Docker installed on your developer machine well just ignore Docker Playground

docker network create somenetwork
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.8.0
docker run -d --name kibana --net somenetwork -p 5601:5601 kibana:7.8.0
```

If you want to try multi cluster setup visit by other blog post [How to deploy an Elastic Search cluster consisting of multiple hosts using ES docker image?](https://xyzcoder.github.io/2020/07/22/how-to-deploy-an-elastic-search-cluster-consisting-of-multiple-hosts-using-es-docker-image.html)

<br><br>
# Cluster and node status<br>
An Elastic search cluster is a combination of multiple node(Can be pysical Machines or VM's or multiple docker container on same host or multiple docker containers on different hosts).

Usually In Production environment, we will have a cluster with more than 1 shard. But usually in Dev environment we can go with a cluster with 1 Node.<br><br>
**Index** is a collection of documents of same type and **Shard** is a Lucene index which contains documentsof a specific index.<br>

**Replica Shard** is a copy of Primary Shard. The main reason for having a replica shard is to make sure that even if primary shard /node  is down, but still we want our application to run.
Now Lets see when we need to go with Multinode cluster or single node cluster and also when we should do sharding.
<br><br>
**Example 1: We are expecting to store documents realted to a Q&A site . I am expecting that overall load of my site will never  exceed 50GB. My machine size is around 1TB and I gave good amount of RAM. I am not worried even If my site is down for certain time(even hrs) and I can restore data from somewhere or ok to loose data during downtime or ok even if the data is completely lost because of an hardware failure. ---  1Node 1shard 0Replica Shards** <br><br>
That is because, our index data will easily fit in this machine. Even if my node is down I am sure it will not impact my business and I can run some tools or scripts  to copy data from other DB's like RDBMS(Only if we have the data stored in RDBMS) or If we dont have this data at other places, even then I am ok to loose complete data.<br><br>
<img src="{{ site.baseurl }}/assets/images/posts/ES_Cheatsheet/1.png"  alt="" style="width: 100%;height: 100%;"/>

**Example 2: We are expecting to store documents realted to a Q&A site . I am expecting that overall load of my site will never  exceed 50GB. My machine size is around 1TB and I gave good amount of RAM. I am not worried even If my site is down for certain time(even hrs) and I can restore data from snapshot and It is ok to loose data during downtime but not complete data. ---  1Node 1shard 0Replica Shards** <br><br>
That is because, our index data will easily fit in this machine. Even if my node is down I am sure it will not impact my business and I can run some tools or scripts  to copy data from other DB's like RDBMS(Only if we have the data stored in RDBMS) and also I can get to previous state using snapshot and it is ok to loose latest data that is not present in the snapshot. <br><br>

**Example 3: We are expecting to store documents realted to a Q&A site . I am expecting that overall load of my site will never  exceed 50GB. My machine size is around 1TB and I gave good amount of RAM. I want to make sure that we will  not have any downtime but I am ok to take minimal chance of downtime. ---  2Node 1shard 1 or more Replica Shards** <br><br>
In this case, I am sure that all my data will fit into my single node but I need to have another node(or multiple nodes based on number of replica shards we want). This is because, In order to have replication(copy of primary shard) to minimize downtime we need another node. Ideally we cannot have Primary shard and replication shard on same node and that will not solve the purpose of replication because lets assume the node is down, then both primary and replica shards will be down and there is no point in replication. But if we distribute primary and replica shards between 2 nodes, then even though 1st node with primary shard is down, we can still serve results from replica shard present in 2nd node. But in unfortunate conditions where both the nodes go down then no one can save us :(<br><br>
<img src="{{ site.baseurl }}/assets/images/posts/ES_Cheatsheet/2.png"  alt="" style="width: 100%;height: 100%;"/>

**Example 4: We are expecting to store documents realted to a Q&A site . I am expecting that overall load of my site might be around 1.5TB. My machine size is around 1TB and I gave good amount of RAM. I want to make sure that we will  not have any downtime but I am ok to take minimal chance of downtime. ---  Now read below section and decide :)** <br><br>
In this case, I am sure that my data will not fit into single machine, so i need to divide data. <br><br>
Lets say I want to go with 2 shards(750GB each) and 2 nodes. So I'll have S1,S2(each 750GB) and I also want to have replication and I want to have 1 replica for each shard. So this will add another 2 shards(replica shards) each with 750GB. So in total we will have 4 shards(S1,S2,P1,P2) and total size is 750*4=3TB but I have only 2TB and **this will not workout.** <br><br>
<img src="{{ site.baseurl }}/assets/images/posts/ES_Cheatsheet/3.png"  alt="" style="width: 100%;height: 100%;"/>

Now lets say we want to go with 3Nodes and 2 shards. So I'll have S1,S2(each 750GB) and I also want to have replication and I want to have 1 replica for each shard. So this will add another 2 shards(replica shards) each with 750GB. So in total we will have 4 shards(S1,S2,P1,P2) and total size is 750*4=3TB, and I have 3 nodes each with 1TB. **So is this going to workout?**  Lets see,Node1 will take Shard1(Shard1 will occupy 750GB out of 1TB, so we cannot accomidate any replica or primary shard here.). Next, Shard2 gets allocated  on Node2(so this will ocuupy 750GB and 250GB freespace left unused and I cannot accomidate Replica1 or 2). Now we are left with Node3 (with 1TB). But here I cannot accomidate my 2 replicas(750GB+750GB != 1TB). **SO THIS WILL FAIL**.<br><br>
<img src="{{ site.baseurl }}/assets/images/posts/ES_Cheatsheet/4.png"  alt="" style="width: 100%;height: 100%;"/>

Now lets say we want to go with 4Nodes and 2 shards. So I'll have S1,S2(each 750GB) and I also want to have replication and I want to have 1 replica for each shard. So this will add another 2 shards(replica shards) each with 750GB. So in total we will have 4 shards(S1,S2,P1,P2) and total size is 750*4=3TB, and I have 4 nodes each with 1TB. **So is this going to workout?** Lets see,Node1 will take Shard1(Shard1 will occupy 750GB out of 1TB, so we cannot accomidate any replica or primary shard here.). Next, Shard2 gets allocated  on Node2(so this will ocuupy 750GB and 250GB freespace left unused and I cannot accomidate Replica1 or 2). Now we are left with Node3  and Node4(with 1TB each). So i can add these 2 replicas on to these 2 nodes(Node3 and Node4).<br><br>
<img src="{{ site.baseurl }}/assets/images/posts/ES_Cheatsheet/5.png"  alt="" style="width: 100%;height: 100%;"/>

<br>
**But No I want to go with only 3 Nodes. Can I some how accommodate my data?**<br>
Let me try to reduce shard size to 500GB. So to accommodate 1.5TB, I need to have 3 primary shards(p1,p2,p3) and also as I want to have replication, I need to have another 3 replicas for each primary shard(R1,R2,R3). So lets assume that Node1 take P1+R2(1TB)(We cannot have Primary and Replica shard on same node because, If that node is down we will loose all data). Now Node2 will take P2+R3(1TB) and Node3 will take P3+R1(1TB). So this way by increasing number of shards, I am able to adjust all data in 3 nodes. <br><br>
Lets say my Node1 is down, So I can still fetch data Shard1 data from R1 present in Node3 and the downtime is zero.<br><br>
<img src="{{ site.baseurl }}/assets/images/posts/ES_Cheatsheet/6.png"  alt="" style="width: 100%;height: 100%;"/>
<br><br>
These are the commands to get information related to cluster and nodes.

```
GET /_cluster/health?pretty
GET /_cluster/health?wait_for_status=yellow&timeout=50s
GET /_cluster/state
GET /_cluster/stats?human&pretty
GET /_cluster/pending_tasks
GET /_nodes
GET /_nodes/stats
GET /_nodes/nodeId1,nodeId2/stats
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
this.page.identifier = 23072020312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
