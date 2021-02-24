---
layout: post
title: CDC Using Debezium Server, MySql, Kinesis
comments: true
date: '2021-02-19 17:16:51'
Categories:
- Change Date Capture
- CDC
- Mysql
- Kinesis
- DataPipeline
tags:
- ''
- CDC
- Kinesis
- Debezium
- DataPipeline
---

# What is  CDC/ Change Data Capture<br>
*As per Wikipedia In databases, change data capture is a set of software design patterns used to determine and track the data that has changed so that action can be taken using the changed data*
<br><br>
So usually let's take an example of Microservices, One of the basic principles of Microservices is to have Microservice specific Databases. For example, I have an Orders Microservices and Shipping Microservice and whenever a new order is placed, I need to create a record in the Order Microservice database and at the same time, I need to publish this event to Shipping Microservice for further processing.
<br>
Now there is a change in order details and I'll update these details in the Order Microservices database and at the same time, I need to push these details to Shipping Microservice.
<br>
One way to do this is to have code-related changes in each microservices to publish events and subscribe to an event by passing payloads. So this requires a lot of code changes in the publishing microservice.

<br>
# Using Debezium For Tracking DB changes and Publishing them

[https://debezium.io/](https://debezium.io/)

<b>Definition from Debezium </b>:  *Debezium is an open source distributed platform for change data capture. Start it up, point it at your databases, and your apps can start responding to all of the inserts, updates, and deletes that other apps commit to your databases. Debezium is durable and fast, so your apps can respond quickly and never miss an event, even when things go wrong.*
<br><br>

Debezium is a CDC tool that captures any changes to Databases as events and sends these events to various sources like Kafka, Kinesis, Apache Pulsar, Google Pubsub. It supports a wide variety of Databases like Mysql, SQL Server, PostgreSQL.

<br>
# Architecture Of Debezium Server:
In this post, we will see how we can use Debezium to send CDC events into Kinesis by making use of <b>Debezium Server</b>. This is a variant of Debezium deployment which makes use of Kinesis/Apache Pulsar/Google Pubsub
<br>
<img src="{{ site.baseurl }}/assets/images/posts/debezium-server-architecture.png" style="max-width: 100%;height: auto;" alt=""/>

On a high level, the Debezium server is configured to use one of the Debezium source connectors to capture changes from the source database. Change events can be serialized to different formats like JSON or Apache Avro and then will be sent to one of a variety of messaging infrastructures such as Amazon Kinesis, Google Cloud Pub/Sub, or Apache Pulsar.


# Mysql Configuration
1. Before actually getting started with CDC in Mysql, make sure that we have CDC enabled in MySQL
2. In this example, I'll be using the Mysql docker container to spin up the MySql instance with the latest version of Mysql

```

docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw  -p 3308:3306 -d mysql:latest

SHOW VARIABLES LIKE 'log_bin';  -- Value should be ON
SHOW VARIABLES -- Display information about various config values
SHOW VARIABLES like '%binlog_format%' -- This should be set to ROW or Mixed
```

With this, we are all set with the Mysql configuration.
<br><br>

1. Create a test database called "TestDB"
2. Create a test table called "Orders"
```
CREATE TABLE `TestDB`.`Orders` (
  `Id` INT NOT NULL,
  `ProductName` VARCHAR(150) NULL,
  `OrderDate` DATETIME NULL,
  PRIMARY KEY (`Id`));
```


# Create an EC2 instance or Ubuntu Docker Conatiner for Installing Debezium:

I am creating a docker ubuntu container on my Windows machine and I'll use that to run Debezium Server. Also, I am linking my MySQL container ( some-MySQL is my container name of MySql)
<br><br>

```
docker run -it  --link some-mysql ubuntu bash
```

<b> Install AWS CLI:</b>

[https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

```
apt-get update
apt-get  install awscli

apt-get install wget

aws configure 
// Provide AWS Access keys and Secret keys
```

<br><br>

# Installing Debezium Server
To get started with Debezium Server( This is a bit different from actual Debezium deployment), download content from this URL

[https://oss.sonatype.org/service/local/artifact/maven/redirect?r=snapshots&g=io.debezium&a=debezium-server-dist&v=LATEST&e=tar.gz](https://oss.sonatype.org/service/local/artifact/maven/redirect?r=snapshots&g=io.debezium&a=debezium-server-dist&v=LATEST&e=tar.gz)
<br><br>
To download latest version you can browse to [https://debezium.io/documentation/reference/operations/debezium-server.html](https://debezium.io/documentation/reference/operations/debezium-server.html)

```
wget -O debezium.tar.gz  "https://repo1.maven.org/maven2/io/debezium/debezium-server-dist/1.5.0.Alpha1/debezium-server-dist-1.5.0.Alpha1.tar.gz"

tar -xf debezium.tar.gz
```

1. Unzip the content of the above file onto the disk
2. Make sure you have Java installed. If not install Java 
```
apt-get install openjdk-8-jre
```
3. Once we unzip content, create a config file called application.properties in conf\ folder, For example <b>'/home/ubuntu/debezium-server/conf'</b>

```
touch conf/application.properties
mkdir data
touch data/offsets.dat
```

```
debezium.sink.type=kinesis
debezium.sink.kinesis.region=ap-south-1
debezium.sink.kinesis.credentials.profile=default
debezium.source.connector.class=io.debezium.connector.mysql.MySqlConnector
debezium.source.offset.storage.file.filename=data/offsets.dat
debezium.source.offset.flush.interval.ms=0
debezium.source.database.hostname=some-mysql
debezium.source.database.port=3306
debezium.source.database.user=root
debezium.source.database.password=my-secret-pw
debezium.source.database.dbname=TestDB
debezium.source.database.server.name=debezium-tutorial
debezium.source.database.history=io.debezium.relational.history.FileDatabaseHistory
debezium.source.database.history.file.filename=history.dat
```

4. Create a file called offsets.dat in the data folder ( Create data folder too)
5.  Make sure you create required streams in Kinesis 

	 i. debezium-tutorial (this is the name that we got from 'debezium.source.database.server.name' prop)
	 
6. Now create Kinesis Streams for each table in this format (<<debezium.source.database.server.name>>.<<debezium.source.database.dbname>>.<<tablename>>)
For example:  debezium-tutorial.TestDB.Orders

Note: For each table you need to have one stream created by default but we can override this by injecting our custom code which I'll show in other blog post

6.  Now run the file <b>run.sh</b> present in Debezium-server folder

```
sh run.sh
```
<br><br>
Unfortunately, I am getting an exception when running this command

```
2021-02-23 17:43:49,551 INFO  [io.deb.ser.BaseChangeConsumer] (main) Using 'io.debezium.server.BaseChangeConsumer$$Lambda$72/1809194904@73e9cf30' stream name mapper
2021-02-23 17:43:49,755 ERROR [io.qua.run.Application] (main) Failed to start application (with profile prod): java.lang.ClassNotFoundException: org.apache.commons.logging.LogFactory
        at java.net.URLClassLoader.findClass(URLClassLoader.java:382)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:352)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
        at org.apache.http.conn.ssl.AbstractVerifier.<init>(AbstractVerifier.java:61)
        at org.apache.http.conn.ssl.AllowAllHostnameVerifier.<init>(AllowAllHostnameVerifier.java:44)
        at org.apache.http.conn.ssl.AllowAllHostnameVerifier.<clinit>(AllowAllHostnameVerifier.java:46)
        at org.apache.http.conn.ssl.SSLConnectionSocketFactory.<clinit>(SSLConnectionSocketFactory.java:151)
        at software.amazon.awssdk.http.apache.ApacheHttpClient$ApacheConnectionManagerFactory.getPreferredSocketFactory(ApacheHttpClient.java:615)
        at software.amazon.awssdk.http.apache.ApacheHttpClient$ApacheConnectionManagerFactory.create(ApacheHttpClient.java:594)
        at software.amazon.awssdk.http.apache.ApacheHttpClient.createClient(ApacheHttpClient.java:153)
        at software.amazon.awssdk.http.apache.ApacheHttpClient.<init>(ApacheHttpClient.java:127)
        at software.amazon.awssdk.http.apache.ApacheHttpClient.<init>(ApacheHttpClient.java:106)
        at software.amazon.awssdk.http.apache.ApacheHttpClient$DefaultBuilder.buildWithDefaults(ApacheHttpClient.java:586)
        at software.amazon.awssdk.core.internal.http.loader.DefaultSdkHttpClientBuilder.lambda$buildWithDefaults$0(DefaultSdkHttpClientBuilder.java:42)
        at java.util.Optional.map(Optional.java:215)
        at software.amazon.awssdk.core.internal.http.loader.DefaultSdkHttpClientBuilder.buildWithDefaults(DefaultSdkHttpClientBuilder.java:42)
        at software.amazon.awssdk.core.client.builder.SdkDefaultClientBuilder.lambda$resolveSyncHttpClient$5(SdkDefaultClientBuilder.java:274)
        at java.util.Optional.orElseGet(Optional.java:267)
        at software.amazon.awssdk.core.client.builder.SdkDefaultClientBuilder.resolveSyncHttpClient(SdkDefaultClientBuilder.java:274)
        at software.amazon.awssdk.core.client.builder.SdkDefaultClientBuilder.finalizeSyncConfiguration(SdkDefaultClientBuilder.java:225)
        at software.amazon.awssdk.core.client.builder.SdkDefaultClientBuilder.syncClientConfiguration(SdkDefaultClientBuilder.java:158)
        at software.amazon.awssdk.services.kinesis.DefaultKinesisClientBuilder.buildClient(DefaultKinesisClientBuilder.java:28)
        at software.amazon.awssdk.services.kinesis.DefaultKinesisClientBuilder.buildClient(DefaultKinesisClientBuilder.java:22)
        at software.amazon.awssdk.core.client.builder.SdkDefaultClientBuilder.build(SdkDefaultClientBuilder.java:129)
        at io.debezium.server.kinesis.KinesisChangeConsumer.connect(KinesisChangeConsumer.java:77)
        at io.debezium.server.kinesis.KinesisChangeConsumer_Bean.create(KinesisChangeConsumer_Bean.zig:835)
        at io.debezium.server.kinesis.KinesisChangeConsumer_Bean.create(KinesisChangeConsumer_Bean.zig:851)
        at io.debezium.server.DebeziumServer.start(DebeziumServer.java:111)
        at io.debezium.server.DebeziumServer_Bean.create(DebeziumServer_Bean.zig:256)
        at io.debezium.server.DebeziumServer_Bean.create(DebeziumServer_Bean.zig:272)
        at io.quarkus.arc.impl.AbstractSharedContext.createInstanceHandle(AbstractSharedContext.java:96)
        at io.quarkus.arc.impl.AbstractSharedContext.access$000(AbstractSharedContext.java:14)
        at io.quarkus.arc.impl.AbstractSharedContext$1.get(AbstractSharedContext.java:29)
        at io.quarkus.arc.impl.AbstractSharedContext$1.get(AbstractSharedContext.java:26)
        at io.quarkus.arc.impl.LazyValue.get(LazyValue.java:26)
        at io.quarkus.arc.impl.ComputingCache.computeIfAbsent(ComputingCache.java:69)
        at io.quarkus.arc.impl.AbstractSharedContext.get(AbstractSharedContext.java:26)
        at io.quarkus.arc.impl.ClientProxies.getApplicationScopedDelegate(ClientProxies.java:17)
        at io.debezium.server.DebeziumServer_ClientProxy.arc$delegate(DebeziumServer_ClientProxy.zig:67)
        at io.debezium.server.DebeziumServer_ClientProxy.arc_contextualInstance(DebeziumServer_ClientProxy.zig:82)
        at io.debezium.server.DebeziumServer_Observer_Synthetic_d70cd75bf32ab6598217b9a64a8473d65e248c05.notify(DebeziumServer_Observer_Synthetic_d70cd75bf32ab6598217b9a64a8473d65e248c05.zig:94)
        at io.quarkus.arc.impl.EventImpl$Notifier.notifyObservers(EventImpl.java:282)
        at io.quarkus.arc.impl.EventImpl$Notifier.notify(EventImpl.java:267)
        at io.quarkus.arc.impl.EventImpl.fire(EventImpl.java:69)
        at io.quarkus.arc.runtime.LifecycleEventRunner.fireStartupEvent(LifecycleEventRunner.java:23)
        at io.quarkus.arc.runtime.ArcRecorder.handleLifecycleEvents(ArcRecorder.java:60)
        at io.quarkus.deployment.steps.LifecycleEventsBuildStep$startupEvent-858218658.deploy_0(LifecycleEventsBuildStep$startupEvent-858218658.zig:81)
        at io.quarkus.deployment.steps.LifecycleEventsBuildStep$startupEvent-858218658.deploy(LifecycleEventsBuildStep$startupEvent-858218658.zig:40)
        at io.quarkus.runner.ApplicationImpl.doStart(ApplicationImpl.zig:521)
        at io.quarkus.runtime.Application.start(Application.java:90)
        at io.quarkus.runtime.ApplicationLifecycleManager.run(ApplicationLifecycleManager.java:97)
        at io.quarkus.runtime.Quarkus.run(Quarkus.java:66)
        at io.quarkus.runtime.Quarkus.run(Quarkus.java:42)
        at io.quarkus.runtime.Quarkus.run(Quarkus.java:119)
        at io.debezium.server.Main.main(Main.java:15)
```

This is because some how this version is missing some jar files related to <b>Apache Commons Logging 1.2</b>, Now download(commons-logging-1.2-bin.tar.gz) them from [http://commons.apache.org/proper/commons-logging/download_logging.cgi](http://commons.apache.org/proper/commons-logging/download_logging.cgi)

```
 root@1f791b7db475:/debezium-server#wget -O apache.common.log.tar.gz https://downloads.apache.org//commons/logging/binaries/commons-logging-1.2-bin.tar.gz
 
 root@1f791b7db475:/debezium-server#tar -xvf apache.common.log.tar.gz
 
 root@1f791b7db475:/debezium-server#cp commons-logging-1.2/commons-logging-1.2.jar lib
```
<br><br>
So, we are all set to stream our changes in DB to Kinesis. Debezium runs in the background and pushes events into Stream and we can have a sample python script to capture data from these streams.
<br><br>
Here is the sample Python file to read data from Kinesis Stream

```
pip install boto3
```

```
from __future__ import print_function
import boto3
from datetime import datetime
import time

def main():

    my_stream_name="debezium-tutorial.TestDB.Orders"

    kinesis_client = boto3.client("kinesis", region_name='ap-south-1',
                         aws_access_key_id="<<your_access_key>>", 
                      aws_secret_access_key="<<your_secret_key>>")

    response = kinesis_client.describe_stream(StreamName=my_stream_name)

    my_shard_id = response['StreamDescription']['Shards'][0]['ShardId']

    # We use ShardIteratorType of LATEST which means that we start to look
    # at the end of the stream for new incoming data. Note that this means
    # you should be running the this lambda before running any write lambdas
    #
    shard_iterator = kinesis_client.get_shard_iterator(StreamName=my_stream_name,
                                                      ShardId=my_shard_id,
                                                      ShardIteratorType='TRIM_HORIZON')

    # get your shard number and set up iterator
    my_shard_iterator = shard_iterator['ShardIterator']

    record_response = kinesis_client.get_records(ShardIterator=my_shard_iterator,Limit=100)
 
    while 'NextShardIterator' in record_response:
        # read up to 100 records at a time from the shard number
        record_response = kinesis_client.get_records(ShardIterator=record_response['NextShardIterator'],Limit=100)
        # Print only if we have something
        if(record_response['Records']):
            print (record_response)

        # wait for 1 seconds before looping back around to see if there is any more data to read
        time.sleep(1)

if __name__ == "__main__":
   main()
```
<br><br>
Here is a sample json that we get for each event
<br><br>
<b>Insert Record equivalent Payload:</b>
```
Insert into Orders values (6,'Test',CurDate())


{
    "schema": {
        "type": "struct",
        "fields": [{
                "type": "struct",
                "fields": [{
                        "type": "int32",
                        "optional": false,
                        "field": "Id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "ProductName"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "name": "io.debezium.time.Timestamp",
                        "version": 1,
                        "field": "OrderDate"
                    }
                ],
                "optional": true,
                "name": "debezium_tutorial.TestDB.Orders.Value",
                "field": "before"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "int32",
                        "optional": false,
                        "field": "Id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "ProductName"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "name": "io.debezium.time.Timestamp",
                        "version": 1,
                        "field": "OrderDate"
                    }
                ],
                "optional": true,
                "name": "debezium_tutorial.TestDB.Orders.Value",
                "field": "after"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "string",
                        "optional": false,
                        "field": "version"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "connector"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "name"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "ts_ms"
                    }, {
                        "type": "string",
                        "optional": true,
                        "name": "io.debezium.data.Enum",
                        "version": 1,
                        "parameters": {
                            "allowed": "true,last,false"
                        },
                        "default": "false",
                        "field": "snapshot"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "db"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "table"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "server_id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "gtid"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "file"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "pos"
                    }, {
                        "type": "int32",
                        "optional": false,
                        "field": "row"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "field": "thread"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "query"
                    }
                ],
                "optional": false,
                "name": "io.debezium.connector.mysql.Source",
                "field": "source"
            }, {
                "type": "string",
                "optional": false,
                "field": "op"
            }, {
                "type": "int64",
                "optional": true,
                "field": "ts_ms"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "string",
                        "optional": false,
                        "field": "id"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "total_order"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "data_collection_order"
                    }
                ],
                "optional": true,
                "field": "transaction"
            }
        ],
        "optional": false,
        "name": "debezium_tutorial.TestDB.Orders.Envelope"
    },
    "payload": {
        "before": null,
        "after": {
            "Id": 6,
            "ProductName": "Test",
            "OrderDate": 1614124800000
        },
        "source": {
            "version": "1.5.0.Alpha1",
            "connector": "mysql",
            "name": "debezium-tutorial",
            "ts_ms": 1614149085000,
            "snapshot": "false",
            "db": "TestDB",
            "table": "Orders",
            "server_id": 1,
            "gtid": null,
            "file": "binlog.000003",
            "pos": 384,
            "row": 0,
            "thread": 9,
            "query": null
        },
        "op": "c",
        "ts_ms": 1614149085256,
        "transaction": null
    }
}

```
<br><br>
<b>Update record payload and we can see before and after values too</b><br>
```
update Orders set Productname='UpdatedProctuctName' where Id=6


{
    "schema": {
        "type": "struct",
        "fields": [{
                "type": "struct",
                "fields": [{
                        "type": "int32",
                        "optional": false,
                        "field": "Id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "ProductName"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "name": "io.debezium.time.Timestamp",
                        "version": 1,
                        "field": "OrderDate"
                    }
                ],
                "optional": true,
                "name": "debezium_tutorial.TestDB.Orders.Value",
                "field": "before"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "int32",
                        "optional": false,
                        "field": "Id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "ProductName"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "name": "io.debezium.time.Timestamp",
                        "version": 1,
                        "field": "OrderDate"
                    }
                ],
                "optional": true,
                "name": "debezium_tutorial.TestDB.Orders.Value",
                "field": "after"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "string",
                        "optional": false,
                        "field": "version"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "connector"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "name"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "ts_ms"
                    }, {
                        "type": "string",
                        "optional": true,
                        "name": "io.debezium.data.Enum",
                        "version": 1,
                        "parameters": {
                            "allowed": "true,last,false"
                        },
                        "default": "false",
                        "field": "snapshot"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "db"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "table"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "server_id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "gtid"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "file"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "pos"
                    }, {
                        "type": "int32",
                        "optional": false,
                        "field": "row"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "field": "thread"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "query"
                    }
                ],
                "optional": false,
                "name": "io.debezium.connector.mysql.Source",
                "field": "source"
            }, {
                "type": "string",
                "optional": false,
                "field": "op"
            }, {
                "type": "int64",
                "optional": true,
                "field": "ts_ms"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "string",
                        "optional": false,
                        "field": "id"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "total_order"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "data_collection_order"
                    }
                ],
                "optional": true,
                "field": "transaction"
            }
        ],
        "optional": false,
        "name": "debezium_tutorial.TestDB.Orders.Envelope"
    },
    "payload": {
        "before": {
            "Id": 6,
            "ProductName": "Test",
            "OrderDate": 1614124800000
        },
        "after": {
            "Id": 6,
            "ProductName": "UpdatedProctuctName",
            "OrderDate": 1614124800000
        },
        "source": {
            "version": "1.5.0.Alpha1",
            "connector": "mysql",
            "name": "debezium-tutorial",
            "ts_ms": 1614149449000,
            "snapshot": "false",
            "db": "TestDB",
            "table": "Orders",
            "server_id": 1,
            "gtid": null,
            "file": "binlog.000003",
            "pos": 695,
            "row": 0,
            "thread": 9,
            "query": null
        },
        "op": "u",
        "ts_ms": 1614149449810,
        "transaction": null
    }
}

```

<br><br>
<b>Delete record payload. We can see type of operation as 'd'</b><br>
```

delete from Orders where Id=6


{
    "schema": {
        "type": "struct",
        "fields": [{
                "type": "struct",
                "fields": [{
                        "type": "int32",
                        "optional": false,
                        "field": "Id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "ProductName"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "name": "io.debezium.time.Timestamp",
                        "version": 1,
                        "field": "OrderDate"
                    }
                ],
                "optional": true,
                "name": "debezium_tutorial.TestDB.Orders.Value",
                "field": "before"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "int32",
                        "optional": false,
                        "field": "Id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "ProductName"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "name": "io.debezium.time.Timestamp",
                        "version": 1,
                        "field": "OrderDate"
                    }
                ],
                "optional": true,
                "name": "debezium_tutorial.TestDB.Orders.Value",
                "field": "after"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "string",
                        "optional": false,
                        "field": "version"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "connector"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "name"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "ts_ms"
                    }, {
                        "type": "string",
                        "optional": true,
                        "name": "io.debezium.data.Enum",
                        "version": 1,
                        "parameters": {
                            "allowed": "true,last,false"
                        },
                        "default": "false",
                        "field": "snapshot"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "db"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "table"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "server_id"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "gtid"
                    }, {
                        "type": "string",
                        "optional": false,
                        "field": "file"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "pos"
                    }, {
                        "type": "int32",
                        "optional": false,
                        "field": "row"
                    }, {
                        "type": "int64",
                        "optional": true,
                        "field": "thread"
                    }, {
                        "type": "string",
                        "optional": true,
                        "field": "query"
                    }
                ],
                "optional": false,
                "name": "io.debezium.connector.mysql.Source",
                "field": "source"
            }, {
                "type": "string",
                "optional": false,
                "field": "op"
            }, {
                "type": "int64",
                "optional": true,
                "field": "ts_ms"
            }, {
                "type": "struct",
                "fields": [{
                        "type": "string",
                        "optional": false,
                        "field": "id"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "total_order"
                    }, {
                        "type": "int64",
                        "optional": false,
                        "field": "data_collection_order"
                    }
                ],
                "optional": true,
                "field": "transaction"
            }
        ],
        "optional": false,
        "name": "debezium_tutorial.TestDB.Orders.Envelope"
    },
    "payload": {
        "before": {
            "Id": 6,
            "ProductName": "UpdatedProctuctName",
            "OrderDate": 1614124800000
        },
        "after": null,
        "source": {
            "version": "1.5.0.Alpha1",
            "connector": "mysql",
            "name": "debezium-tutorial",
            "ts_ms": 1614149647000,
            "snapshot": "false",
            "db": "TestDB",
            "table": "Orders",
            "server_id": 1,
            "gtid": null,
            "file": "binlog.000003",
            "pos": 1029,
            "row": 0,
            "thread": 9,
            "query": null
        },
        "op": "d",
        "ts_ms": 1614149647433,
        "transaction": null
    }
}

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
