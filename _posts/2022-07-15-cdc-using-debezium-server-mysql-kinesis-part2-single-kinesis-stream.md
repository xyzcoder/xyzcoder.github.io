---
layout: post
title: CDC Using Debezium Server, MySql, Kinesis - Part2 (Single Kinesis Stream)
comments: true
date: '2022-07-15 18:15:27'
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
- SingleStreamMultipleTables
description: In my previous post, we saw how we can stream Mysql table changes to
  Kinesis using Debezium. But the problem there is, that we need to configure 1 kinesis
  stream for 1 table. So the number of streams are going to increase and maintainability
  decreases. So in this post, we will see how we can address that problem and stream
  multiple tables data into a single stream.
---

# CDC Using Debezium Server, MySql, Kinesis - Using Single Kinesis Stream for Multiple tables<br>
In my previous post, we saw how we can stream Mysql table changes to Kinesis using Debezium. But the problem there is, that we need to configure 1 kinesis stream for 1 table. So the number of streams are going to increase and maintainability decreases. So in this post, we will see how we can address that problem and stream multiple tables data into a single stream.
<br><br>
So in this post, we are going to inject our custom class mapper and also any additional changes when writing to the Kinesis stream.
<br><br>
Reference to previous article where we have debezium configured on a ubuntu docker container and set up MySQL to connect to debezium and then send events to Kinesis. 
[https://xyzcoder.github.io/2021/02/19/cdc-using-debezium-server-mysql-kinesis.html](https://xyzcoder.github.io/2021/02/19/cdc-using-debezium-server-mysql-kinesis.html)

<br><br>
In this post, we don't download debezium server but we use maven to build our custom mapper class and inject debezium dependency using pom.xml

# Code structure to inject our custom mapper class
BaseFolder
		|
		|--->src\main\java\io\debezium\pavan\server\mapper\PavanAryaKinesisConsumer.java
    |--->src\main\java\io\debezium\pavan\server\mapper\PrefixingNameMapper.java
		|-->src\resources
		|-->pom.xml
		
		<br><br>
# **Sample code for this in github:**
[https://github.com/pavanarya/BlogSampleCode/tree/master/Debezium/Debezium-Server-Overwriting-TopicName](https://github.com/pavanarya/BlogSampleCode/tree/master/Debezium/Debezium-Server-Overwriting-TopicName)

## **PavanAryaKinesisConsumer.java**:
```
/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.server.kinesis;

import java.util.List;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;

import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.debezium.engine.DebeziumEngine.RecordCommitter;
import io.debezium.server.BaseChangeConsumer;
import io.debezium.server.CustomConsumerBuilder;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.kinesis.KinesisClient;
import software.amazon.awssdk.services.kinesis.model.PutRecordRequest;

/**
 * Implementation of the consumer that delivers the messages into Amazon Kinesis destination.
 *
 * @author Pavan Kumar Aryasomayajulu
 *
 */
@Named("pavankinesis")
@Dependent
public class PavanAryaKinesisConsumer extends BaseChangeConsumer implements DebeziumEngine.ChangeConsumer<ChangeEvent<Object, Object>> {

    private static final Logger LOGGER = LoggerFactory.getLogger(PavanAryaKinesisConsumer.class);

    private static final String PROP_PREFIX = "debezium.sink.kinesis.";
    private static final String PROP_REGION_NAME = PROP_PREFIX + "region";

    private String region;

    @ConfigProperty(name = PROP_PREFIX + "credentials.profile", defaultValue = "default")
    String credentialsProfile;

    @ConfigProperty(name = PROP_PREFIX + "null.key", defaultValue = "default")
    String nullKey;
	
	@ConfigProperty(name = PROP_PREFIX + "kinesis.error.log", defaultValue = "kinesis_error.txt")
    String errorLogFile;

    private KinesisClient client = null;

    @Inject
    @CustomConsumerBuilder
    Instance<KinesisClient> customClient;

    @PostConstruct
    void connect() {
        if (customClient.isResolvable()) {
            client = customClient.get();
            LOGGER.info("Obtained custom configured KinesisClient '{}'", client);
            return;
        }

        final Config config = ConfigProvider.getConfig();
        region = config.getValue(PROP_REGION_NAME, String.class);
        client = KinesisClient.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        LOGGER.info("Using default KinesisClient_Pavan '{}'", client);
    }

    @PreDestroy
    void close() {
        try {
            client.close();
        }
        catch (Exception e) {
            LOGGER.warn("Exception while closing Kinesis client: {}", e);
        }
    }

    @Override
    public void handleBatch(List<ChangeEvent<Object, Object>> records, RecordCommitter<ChangeEvent<Object, Object>> committer)
            throws InterruptedException {
        for (ChangeEvent<Object, Object> record : records) {
			try{
				LOGGER.trace("Received event '{}'", record);
				final PutRecordRequest putRecord = PutRecordRequest.builder()
						.partitionKey((record.key() != null) ? getString(record.key()) : nullKey)
						.streamName(streamNameMapper.map(record.destination()))
						.data(SdkBytes.fromByteArray(getBytes(record.value())))
						.build();
				client.putRecord(putRecord);
			}
			catch (Exception e) {
				LOGGER.info("Received event '{}'", record);
				LOGGER.warn("Exception while putting Kinesis record: {}", e);
				appendUsingFileWriter(errorLogFile,"Received event "+record.toString());
				appendUsingFileWriter(errorLogFile,"Exception while putting Kinesis record: "+e.toString());
				appendUsingFileWriter(errorLogFile,"=======================================");
			}
			try{
				committer.markProcessed(record);
			}
			catch (Exception e) {
				LOGGER.warn("Exception while comitting Kinesis record: {}", e);
			}
        }
        committer.markBatchFinished();
    }
	
	private void appendUsingFileWriter(String filePath, String text) {
		File file = new File(filePath);
		FileWriter fr = null;
		try {
			if (file.exists())
			{
			   fr = new FileWriter(file,true);//if file exists append to file. Works fine.
			}
			else
			{
			   file.createNewFile();
			   fr = new FileWriter(file);
			}
			// Below constructor argument decides whether to append or override
			//fr = new FileWriter(file, true);
			fr.write(text);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				fr.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
```
<br><br>
This class extends **BaseChangeConsumer** and implements **DebeziumEngine.ChangeConsumer<ChangeEvent<Object, Object>>**
<br><br>
We annotate this class **@Named("pavankinesis")**. This "pavankinesis" is actually the key thing that lets Debezium server pick  this injected class instead of the default implementation at<br>
[https://github.com/debezium/debezium/blob/95a4576df422d14199c61aacb6ea971888015910/debezium-server/debezium-server-kinesis/src/main/java/io/debezium/server/kinesis/KinesisChangeConsumer.java#L44](https://github.com/debezium/debezium/blob/95a4576df422d14199c61aacb6ea971888015910/debezium-server/debezium-server-kinesis/src/main/java/io/debezium/server/kinesis/KinesisChangeConsumer.java#L44)
<br><br>
usually this **@Named("kinesis")** which is the default sink type for kinesis. We provided that value in application.properties, **debezium.sink.type=kinesis**. Refer to my previous article.
<br>
<br>

**So how is Debezium server identifying our class with this @named annotation?**<br>
In the class [ **DebeziumServer.java**](https://github.com/debezium/debezium/blob/f8d4307155a208aeb151c46f6faa1cfe1e8ab151/debezium-server/debezium-server-core/src/main/java/io/debezium/server/DebeziumServer.java#L102), **PROP_SINK_TYPE** is nothing but **debezium.sink.type** which we are passing this via application.properties.

Now we are overriding the default Kinesis implementation with our custom implementation **PavanAryaKinesisConsumer.java** and instructing Debezium server to pick our new class  in application.properties as
**debezium.sink.type=pavankinesis**
<br><br>

```
final PutRecordRequest putRecord = PutRecordRequest.builder()
						.partitionKey((record.key() != null) ? getString(record.key()) : nullKey)
						.streamName(streamNameMapper.map(record.destination()))
						.data(SdkBytes.fromByteArray(getBytes(record.value())))
						.build();
				client.putRecord(putRecord);
```
In the above code, we are sending our record into the Kinesis stream. We are getting stream name from **streamNameMapper.map()** by passing topic details.
<br><br>
Also, I added a little bit of sample code to write to logs. You can compare code between the original code **KinesisChangeConsumer.java and  PavanAryaKinesisConsumer.java**

## PrefixingNameMapper.java
```
/*
 * Copyright Debezium Authors.
 *
 * Licensed under the Apache Software License version 2.0, available at http://www.apache.org/licenses/LICENSE-2.0
 */
package io.debezium.pavan.server.mapper;

import javax.enterprise.context.Dependent;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.debezium.server.StreamNameMapper;

@Dependent
public class PrefixingNameMapper implements StreamNameMapper {

    @ConfigProperty(name = "mapper.streamname")
    String streamname;

    @Override
    public String map(String topic) {
        return streamname;
    }

}

```

In my case since I want to push all my records into a single stream, I am not using topic details and simply reading my stream name from application.properties and reading it in the above code.<br>
**mapper.streamname=pavan.sample.stream**
<br><br>
For the original Debezium implementation for stream name, you can see this class<br>

[https://github.com/debezium/debezium/blob/5d09c3c0440274a0de4c6f6b1fea79685d2d6a02/debezium-server/debezium-server-core/src/main/java/io/debezium/server/BaseChangeConsumer.java](https://github.com/debezium/debezium/blob/5d09c3c0440274a0de4c6f6b1fea79685d2d6a02/debezium-server/debezium-server-core/src/main/java/io/debezium/server/BaseChangeConsumer.java)

# Done with our custom code, So how do we use this code along with Debezium
In order to use our custom code(you can download it from my GitHub link provided above), we need to have java, and maven installed on our machine. In **pom.xml** we specify dependencies for the quarkus server, debezium. I am using **1.9.5.Final** version of Debezium.
<br><br>
```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>io.debezium.pavan</groupId>
    <artifactId>debezium-server-custom-topic-name-mapper</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>

        <version.debezium>1.9.5.Final</version.debezium>
		<version.debezium.tag>1.8</version.debezium.tag>
        <version.quarkus>2.9.2.Final</version.quarkus>
        <version.jandex>1.1.0</version.jandex>
    </properties>

    <dependencyManagement>
        <dependencies>
			<dependency>
                <groupId>io.quarkus</groupId>
                <artifactId>quarkus-bom</artifactId>
                <version>${version.quarkus}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>io.debezium</groupId>
                <artifactId>debezium-server-kinesis</artifactId>
                <version>${version.debezium}</version>
            </dependency>
            <dependency>
                <groupId>io.debezium</groupId>
                <artifactId>debezium-connector-mysql</artifactId>
                <version>${version.debezium}</version>
            </dependency>
			<dependency>
                <groupId>io.debezium</groupId>
                <artifactId>debezium-connector-postgres</artifactId>
                <version>${version.debezium}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
            <dependency>
                <groupId>io.debezium</groupId>
                <artifactId>debezium-server-kinesis</artifactId>
            </dependency>
            <dependency>
                <groupId>io.debezium</groupId>
                <artifactId>debezium-connector-mysql</artifactId>
            </dependency>
			<dependency>
                <groupId>io.debezium</groupId>
                <artifactId>debezium-connector-postgres</artifactId>
            </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>io.quarkus</groupId>
                <artifactId>quarkus-maven-plugin</artifactId>
                <version>${version.quarkus}</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>build</goal>
							<goal>generate-code</goal>
                            <goal>generate-code-tests</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.jboss.jandex</groupId>
                <artifactId>jandex-maven-plugin</artifactId>
                <version>${version.jandex}</version>
                <executions>
                    <execution>
                        <id>make-index</id>
                        <goals>
                            <goal>jandex</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

Once we have everything ready, we need to do maven install <br>
```
mvn clean install -e
```

This will build the code on your local machine into **target** folder. Now we need to add our config files like
1. **application.properties** -- target\config\application.properties
2.  target\data\offsets.dat
3.  target\history.dat
<br>
Files 2,3 are used by Debezium to track offsets read from Mysql DB.
<br><br>
Now copy this target folder to the ubuntu container or if you are on an ubuntu machine, then you can run debezium on your host machine itself. In my case, I would like to copy these files to the docker ubuntu container and run debezium inside the container.
<br><br>
```
docker cp target/. 6039ae3a3d62:/debezium-pavan-custom
```
I am copying the target folder to my container folder debezium-pavan-custom.

# Running Debezium Server using Quarkus
Inside the container navigate to /debezium-pavan-custom/ and run the following command. This will start the Quarkus server and which in turn will start the Debezium server.

```
java -jar quarkus-app/quarkus-run.jar
```
<br>
This will make use of application.properties for invoking our custom class.

## Application.properties

```
debezium.sink.type=pavankinesis
debezium.sink.kinesis.region=ap-southeast-1
debezium.source.connector.class=io.debezium.connector.mysql.MySqlConnector
debezium.source.offset.storage.file.filename=data/offsets.dat
debezium.source.offset.flush.interval.ms=0
debezium.source.database.port=3306
debezium.source.database.user=root
debezium.source.database.hostname=some-mysql
debezium.source.database.password=my-secret-pw
debezium.source.database.dbname=TestDB
debezium.source.database.server.name=localhost
debezium.source.schema.include=TestDB
debezium.source.database.history=io.debezium.relational.history.FileDatabaseHistory
debezium.source.database.history.file.filename=history.dat
quarkus.http.port=8089
quarkus.index-dependency.kinesis.group-id=io.debezium
quarkus.index-dependency.kinesis.artifact-id=debezium-server-custom-topic-name-mapper
mapper.streamname=pavan.sample.stream
debezium.sink.kinesis.kinesis.error.log=/home/ubuntu/Debezium/target/kinesis_errors.txt
debezium.source.snapshot.new.tables=parallel
snapshot.new.tables=parallel
debezium.snapshot.new.tables=parallel
debezium.tombstones.on.delete=true
debezium.decimal.handling.mode=double
decimal.handling.mode=double
debezium.source.decimal.handling.mode=double
debezium.source.table.include=TestDB.Orders
snapshot.locking.mode=none
debezium.snapshot.locking.mode=none
debezium.source.snapshot.locking.mode=none
```
**Some important items here:**
1. **debezium.sink.type** this value should match @Named property in our custom class **PavanAryaKinesisConsumer.java**
2. **debezium.source.schema.include** this will whitelist the DB for which we want to stream CDC events.
3. All quarkus related entries are for Quarkus server
4. **debezium.source.table.include** tables we want to stream. Let's say I have 10 tables and I want to stream only a few then I can proved them as a comma seperated values.
5. **mapper.streamname** this is the stream name to which we want to push events. We read this value in **PrefixingNameMapper.java**

<br><br>
If you would like to dig deep into Debezium code on how default stream name is formed, you can refer to these link in Debezium source code


[https://github.com/debezium/debezium/blob/9f7ede0e0695f012c6c4e715e96aed85eecf6b5f/debezium-connector-mysql/src/main/java/io/debezium/connector/mysql/MySqlTopicSelector.java](https://github.com/debezium/debezium/blob/9f7ede0e0695f012c6c4e715e96aed85eecf6b5f/debezium-connector-mysql/src/main/java/io/debezium/connector/mysql/MySqlTopicSelector.java)<br><br>

[https://github.com/debezium/debezium/blob/a900ababcd6d66da98978994f6181839098a7fd3/debezium-connector-mysql/src/main/java/io/debezium/connector/mysql/MySqlConnectorTask.java](https://github.com/debezium/debezium/blob/a900ababcd6d66da98978994f6181839098a7fd3/debezium-connector-mysql/src/main/java/io/debezium/connector/mysql/MySqlConnectorTask.java)<br><br>

[https://github.com/debezium/debezium/blob/9f7ede0e0695f012c6c4e715e96aed85eecf6b5f/debezium-core/src/main/java/io/debezium/schema/TopicSelector.java](https://github.com/debezium/debezium/blob/9f7ede0e0695f012c6c4e715e96aed85eecf6b5f/debezium-core/src/main/java/io/debezium/schema/TopicSelector.java)<br><br>


[https://github.com/debezium/debezium/blob/68a78f73bb323fe8e781f00cbb7626a9290df47a/debezium-core/src/main/java/io/debezium/pipeline/EventDispatcher.java](https://github.com/debezium/debezium/blob/68a78f73bb323fe8e781f00cbb7626a9290df47a/debezium-core/src/main/java/io/debezium/pipeline/EventDispatcher.java)<br><br>

[https://github.com/debezium/debezium/blob/9f7ede0e0695f012c6c4e715e96aed85eecf6b5f/debezium-core/src/main/java/io/debezium/schema/TopicSelector.java](https://github.com/debezium/debezium/blob/9f7ede0e0695f012c6c4e715e96aed85eecf6b5f/debezium-core/src/main/java/io/debezium/schema/TopicSelector.java)<br><br>


[https://github.com/debezium/debezium/blob/d7f08a2656654e94dcb95ca75ca2a0743d326a1f/debezium-embedded/src/main/java/io/debezium/embedded/ConvertingEngineBuilder.java](https://github.com/debezium/debezium/blob/d7f08a2656654e94dcb95ca75ca2a0743d326a1f/debezium-embedded/src/main/java/io/debezium/embedded/ConvertingEngineBuilder.java)<br><br>


[https://github.com/debezium/debezium/blob/f8d4307155a208aeb151c46f6faa1cfe1e8ab151/debezium-server/debezium-server-core/src/main/java/io/debezium/server/DebeziumServer.java](https://github.com/debezium/debezium/blob/f8d4307155a208aeb151c46f6faa1cfe1e8ab151/debezium-server/debezium-server-core/src/main/java/io/debezium/server/DebeziumServer.java)<br><br>


[https://github.com/debezium/debezium/blob/main/debezium-server/debezium-server-kinesis/src/main/java/io/debezium/server/kinesis/KinesisChangeConsumer.java](https://github.com/debezium/debezium/blob/main/debezium-server/debezium-server-kinesis/src/main/java/io/debezium/server/kinesis/KinesisChangeConsumer.java)<br><br>

[https://github.com/debezium/debezium/blob/04941330c3e0141ab89589229fdaf7168f5db150/debezium-embedded/src/main/java/io/debezium/embedded/EmbeddedEngineChangeEvent.java#L41](https://github.com/debezium/debezium/blob/04941330c3e0141ab89589229fdaf7168f5db150/debezium-embedded/src/main/java/io/debezium/embedded/EmbeddedEngineChangeEvent.java#L41)<br><br>

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
this.page.identifier = 15072022312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
