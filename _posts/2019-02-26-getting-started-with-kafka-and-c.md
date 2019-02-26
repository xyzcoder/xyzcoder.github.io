---
title: Getting Started With Kafka and C#
---

Hi,
In this post we will see how to get started with Apache Kafka and C#. In this article I'll be using Kafka as Message Broker. So basically I'll have 2 different systems. One is Producer and the Other is Consumer. Basically a producer pushes message to Kafka Queue as a topic and it is consumed by my consumer.

Here I'll basically focus on Installation and a sample C# console applications. One acts as a consumer and the other as a Producer.

# Installing Kafka on Windows:
Download from this url [http://kafka.apache.org/downloads](http://kafka.apache.org/downloads)

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/kafka/1.png"  alt="" style="width: 100%;height: 100%;"/>

<br/>
<br/>
Now download Kafka  from this http url

<img src="{{ site.baseurl }}/assets/images/posts/kafka/2.png"  alt="" style="width: 100%;height: 100%;"/>
<br/>
<br/>

After downloading the file, unzip into a location on your machine.
Now navigate to ** your_location\kafka_2.11-2.1.1\bin\windows**

**/bin** directory represents all the binary files which are helpful to start Kafka server different operating systems. As we are working with the windows machine, there will be a folder named windows under /bin directory, which has all the windows related stuff.

**/config** directory contains all configuration details about Kafka server, zookeeper, and logs. All configurations have their default values if you wanted to change any config details like port you can freely go an change accordingly.

# Start the Zookeeper:

We can start the server with default configuration

Use the command **"zookeeper-server-start.bat ../../config/zookeeper.properties"**

```
C:\Pavan\Softwares\kafka_2.11-2.1.1\bin\windows>zookeeper-server-start.bat ../../config/zookeeper.properties
[2019-02-26 15:03:16,587] INFO Reading configuration from: ..\..\config\zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
[2019-02-26 15:03:16,592] INFO autopurge.snapRetainCount set to 3 (org.apache.zookeeper.server.DatadirCleanupManager)
[2019-02-26 15:03:16,593] INFO autopurge.purgeInterval set to 0 (org.apache.zookeeper.server.DatadirCleanupManager)
[2019-02-26 15:03:16,593] INFO Purge task is not scheduled. (org.apache.zookeeper.server.DatadirCleanupManager)
[2019-02-26 15:03:16,594] WARN Either no config or no quorum defined in config, running  in standalone mode (org.apache.zookeeper.server.quorum.QuorumPeerMain)
[2019-02-26 15:03:16,617] INFO Reading configuration from: ..\..\config\zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
```

# Start Apache Kafka:
Use the command **"kafka-server-start.bat ../../config/server.properties"**

```
C:\Pavan\Softwares\kafka_2.11-2.1.1\bin\windows>kafka-server-start.bat ../../config/server.properties
[2019-02-26 15:08:42,212] INFO Registered kafka:type=kafka.Log4jController MBean (kafka.utils.Log4jControllerRegistration$)
[2019-02-26 15:08:42,694] INFO starting (kafka.server.KafkaServer)
[2019-02-26 15:08:42,695] INFO Connecting to zookeeper on localhost:2181 (kafka.server.KafkaServer)
[2019-02-26 15:08:42,720] INFO [ZooKeeperClient] Initializing a new session to localhost:2181. (kafka.zookeeper.ZooKeeperClient)
```

Now we can see that both Zookeeper and Kafka servers are running successfully.


# Understanding Basics Of Kafka:
Before actually going into programming. First of all let us try to understand some of the basic terminologies involved in Kafka.

As per the official site

> > Apache Kafka® is a distributed streaming platform. What exactly does that mean?
> >  A streaming platform has three key capabilities:
> > 
> > * Publish and subscribe to streams of records, similar to a message queue or enterprise messaging system.
> > * Store streams of records in a fault-tolerant durable way.
> > * Process streams of records as they occur.

Lets try to decode above statements. 

Process_A(Publisher) sends data( can be multiple messages) under a common name which can be called as topic name. Now Process_B(Consumer) subscribes to the same topic and whenever there is a message or record sent by Process_A (Publisher), it is recieved and processed by Process_B(Consumer).

In this case there are chances of Process_B(consumer) down. So Process_A sends a message but Process_B is down. 
What is going to happen in this case? 
Are we going to loose the message sent by Process_A? 

No, we are not going to loose the message, Kafka takes care of this and it stores this message internally untill the message is consumed by the consumer.

<br/>
<br/>

<img src="{{ site.baseurl }}/assets/images/posts/kafka/3.png"  alt="" style="width: 100%;height: 100%;"/>

# Publisher:
Publishers are applications which send messages to a Topic. For example, I have a topic called "ResumeProcessor" and an application which extracts raw resumes by scrapping. So my application it scrapes resumes from internet and then it posts that data to my "ResumeProcessor" topic.

# Topic:
A topic is like a place where a publisher writes all message and a consumer picks from it. In my above example " ResumeProcessor" is my topic to which different scrapped resumes content is written and from there subscribers pick.

<br/>
<br/>
Structure of a Topic:
<br/>
<img src="{{ site.baseurl }}/assets/images/posts/kafka/4.png"  alt="" style="width: 100%;height: 100%;"/>

* Each topic is divided into configured number of partitions. By default it is based on the number of consumers ina  group.
* Whenever a new message is sent, it is appended to the partition and it is immutable.
* Data in a topic is persisted for a configurable amount of time ( in .properties file). For example if the retension period is set to 1 day, then the record will be stored for the next one day.

# Consumers:
Consumers are applications which listen to a topic and when ever a publisher sends a message, it is picked up by the consumer.
# C# code for consumer and Producers:

Now as we have kafka environment ready, lets try to consume it using C# clients for Kafka.

There are many clients available in the market( Nuget Packages) lets see which one to use.
By querying Nuget site as following [https://www.nuget.org/packages?q=kafka&prerel=false](https://www.nuget.org/packages?q=kafka&prerel=false) I see that there are many packages available. 

But among those, I see 2 predominent ones and I am planning to use **"Confluent.Kafka"** as this seems to be promising and microsft acknowledged it.
[https://www.nuget.org/packages/Confluent.Kafka/0.11.6](https://www.nuget.org/packages/Confluent.Kafka/0.11.6)


As pe