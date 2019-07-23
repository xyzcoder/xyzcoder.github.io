---
title: Auditing In SQL Server Using CDC Approach
layout: post
date: '2019-07-17 08:57:27'
comments: true
categories:
- Audit_SqlServer
- CDC
- Tracking_Changes_In_SqlServer
tags:
- CDC
---

Hi, 
In this post I would like to explain how we can audit tables in SQL server using Change data capture ( CDC) approach.

# Requirement:
In the world of transactional databases, It is always required to audit our changes to track changes like what was changed and when it was changed especially with sensitve data. For example If we are dealing with some pharmacy or someother key domains related data, then as per govt regulations it is mandatory to audit certain data. 

# Traditional approaches to Audit Data
There many ways to audit data in Sql server, some traditional approaches are as follow:
1. **Using C# code itself**
     Where ever we have insert and update statements , there we need to have some extra logic to insert into our tracking tables for changes.

			For example: Lets say I am trying to update "FirstName" field and In order to audit it I need to take following approach

					 -- Select FirstName From User where Id=10
					 -- Store this value in a variable
					 -- Update User set Firstname='New Value' where Id=10
					-- Insert into User_Audit (Column,OldValue,NewValue,DateValue) Values ('FirstName','Old Value stored in variable','New Value',GetDate()

	 So just to audit this change we need to write few extra lines of code and as the number of places to audit increases, this extra logic also increases which is a pain for maintaining.

2. **Using Triggers**
     By making use of triggers, we can avoid this extra logic but there are few scenarios where triggers dont actually fire and we need some extra configuration.
		 By default, the BULK INSERT statement do not execute triggers. However, you can enable triggers by using FIRE_TRIGGERS qualifiers.
		 Also It is a manual process to write these triggers.

So, In these cases we can make use of SQL Server inbuilt feature for auditing.

# Feature Availability:
CDC approach was indroduced in MS Sql 2008 but restricted only to developer and Enterprise editions. But from Sql server 2017, It is present in Standard Edition too.


# Getting Started:
As CDC is specific to certain versions, initially lets check the version of sql server

```
 select @@version
 ---Output
Microsoft SQL Server 2017 (RTM) - 14.0.1000.169 (X64)   Aug 22 2017 17:04:49   Copyright (C) 2017 Microsoft Corporation  Express Edition (64-bit) on Windows 10 Pro 10.0 <X64> (Build 17134: ) (Hypervisor) 
```

I can see that my version of sql server in 2017 and Express Edition. So as per my understanding CDC feature is avaibale for Standard, Developer and Enterprise version of 2017 but not Express edition. But lets try

<br><br>
# Check If CDC Is Enabled:

```
USE master 
GO 
SELECT [name], database_id, is_cdc_enabled  FROM sys.databases       
GO  
```

<img src="{{ site.baseurl }}/assets/images/posts/cdc/1.PNG" style="max-width: 100%;height: auto;"  alt=""/>
<br><br>
As you can see None of my databases have cdc enabled.
<br><br>

**Enabling CDC**:
  You can run this stored procedure in the context of each database to enable CDC at database level
	
	
```
	USE Pavan 
	GO 
	EXEC sys.sp_cdc_enable_db 
	GO  
```


When I ran this command, I got following error

<p style="color: red !important;">Msg 22988, Level 16, State 1, Procedure sys.spcdcenabledb, Line 13 [Batch Start Line 2]
This instance of SQL Server is the Express Edition (64-bit). Change data capture is only available in the Enterprise, Developer, Enterprise Evaluation, and Standard editions.</p>

<br>
So only option I have now is to install standard or developer editions and I'll go with developer edition for now because standard edition costs me.

After Installing Sql server devloper edition let me check the version

```
 select @@version
 ---Output
Microsoft SQL Server 2017 (RTM) - 14.0.1000.169 (X64)   Aug 22 2017 17:04:49   Copyright (C) 2017 Microsoft Corporation  Developer Edition (64-bit) on Windows 10 Pro 10.0 <X64> (Build 17134: ) (Hypervisor) 
```

**Note**: When we have 2 different versions installed, Please make sure that we connect to appropriate server

Now lets try to enable CDC by running following proc and this time it is successful.
```
	USE Pavan 
	GO 
	EXEC sys.sp_cdc_enable_db 
	GO  

	USE master 
	GO 
	SELECT [name], database_id, is_cdc_enabled  FROM sys.databases       
	GO  
```

Also we can see a new schema and few system level tables were created for cdc.<br>
<img src="{{ site.baseurl }}/assets/images/posts/cdc/2.PNG" style="max-width: 100%;height: auto;"  alt=""/>
<br>
<img src="{{ site.baseurl }}/assets/images/posts/cdc/3.PNG" style="max-width: 100%;height: auto;"  alt=""/>

<br>
<br>

**Check List Of Tables Having CDC**
<br>
```
select is_tracked_by_cdc,* from sys.tables where is_ms_shipped=0
```

I have one table in my DB and we can see is_tracked_by_cdc is set to 0 ie cdc is not enabled on this table
<br>
<img src="{{ site.baseurl }}/assets/images/posts/cdc/4.PNG" style="max-width: 100%;height: auto;" alt=""/>

# Enable CDC
```
EXEC sys.sp_cdc_enable_table 
@source_schema = N'dbo', 
@source_name   = N'Test', 
@role_name     = NULL 

select is_tracked_by_cdc,* from sys.tables where is_ms_shipped=0
```

Here we need to pass schema and then source table name.
**role_name** is used to restrict querying cdc tables based on roles and if we want this data to be accessible for everyone, we need to pass null for this value.

<br>

# Enabling CDC for certain columns:

<br> In case if we want to track only certain columns, then we need to pass them in the parameter <br>
@captured_column_list = '[Firstname]'  to the proc sys.sp_cdc_enable_table 

```
EXEC sys.sp_cdc_enable_table 
@source_schema = N'dbo', 
@source_name   = N'Test', 
@role_name     = NULL ,
@captured_column_list = '[Firstname]'

select is_tracked_by_cdc,* from sys.tables where is_ms_shipped=0
```

<br>
Now we can see few extra tables created in the system table

<img src="{{ site.baseurl }}/assets/images/posts/cdc/5.PNG" style="max-width: 100%;height: auto;"  alt=""/>

<br><br>
**Testing CDC**:

As we enabled CDC for our test table, now lets try to test how it is actually working. I'll insert few records into Test table and see the result.

```
INSERT INTO [dbo].[Test] 
       (Id,Value) 
VALUES (1,'pavan') 


SELECT * FROM [Pavan].[cdc].[dbo_Test_CT]
select * from test
SELECT * FROM [Pavan].[cdc].[change_tables]
```

Unfortunately, I am not seeing any data in my CDC table which is opposite to my expectations

<img src="{{ site.baseurl }}/assets/images/posts/cdc/6.PNG" style="max-width: 100%;height: auto;"  alt=""/>

<br><br>
By looking at last query results, I can see that CDC is enabled on my "Test" table but still dbo_Test_CT table is not populated with any data.

I tried to identify errors by using these queries

```
exec sys.sp_cdc_help_change_data_capture
exec sys.sp_cdc_help_jobs
select * from sys.dm_cdc_errors
```

<img src="{{ site.baseurl }}/assets/images/posts/cdc/8.PNG" style="max-width: 100%;height: auto;"  alt=""/>
<br><br>
I see that there were no jobs for capture. And unfortunately I forgot to turn on my sql server agent.
# Missing CDC capture Job when enabling CDC on table in SQL Server
The reason behind missing data in CDC tables is because this feature depends on Sql Jobs and by default sql jobs are in stopped state and we need to enable them.

<img src="{{ site.baseurl }}/assets/images/posts/cdc/7.PNG" style="max-width: 100%;height: auto;"  alt=""/>

Now to create these missging jobs, I need to run following statements and ultimately we can see these jobs created

```
EXEC sys.sp_cdc_add_job @job_type = N'capture';
EXEC sys.sp_cdc_add_job @job_type = N'cleanup';
```

<img src="{{ site.baseurl }}/assets/images/posts/cdc/9.PNG" style="max-width: 100%;height: auto;"  alt=""/>

**Note** By default if we have sql server agent running at the time of enabling cdc on a table, it will create these jobs and it is not required to run above scripts.

** Now lets test CDC again**

**Insert**

```
INSERT INTO [dbo].[Test] 
       (Id,Value) 
VALUES (3,'Satish') 

SELECT * FROM [Pavan].[cdc].[dbo_Test_CT]
select * from test
```

<img src="{{ site.baseurl }}/assets/images/posts/cdc/10.PNG" style="max-width: 100%;height: auto;"  alt=""/>

So I can see my inserted values in dbo_Test_CT table but not the latest inserted one... The reason for that is there is a slight deelay of 1 sec for the change to appear and here we are querying it along with insert.
<br><br>

There are two values which are very important to us is **__$operation and __$update_mask**.

Column **_$operation** contains value which corresponds to DML Operations. Following is quick list of value and its corresponding meaning.
<br><br>
Delete Statement = 1<br>
Insert Statement = 2<br>
Value before Update Statement = 3<br>
Value after Update Statement = 4<br>
<br><br><br>

**Update**

```
update test set value='Sai satish' where id=3

SELECT * FROM [Pavan].[cdc].[dbo_Test_CT]
select * from test
```

<img src="{{ site.baseurl }}/assets/images/posts/cdc/11.PNG" style="max-width: 100%;height: auto;"  alt=""/>

<br>
Row1 corresponds to insert (__operation=2) and we can see values for Id, Firstname,lastname<br>
Row2,3 corresponds to update... row 2 has previous values and row 3 has updated values.. There I update firstname and lastname<br>
Row 4,5 corresponds to update... Here we can see that  Lastname in row 4 is null because, I am not updating it and only I updated Firstname<br>
<br>

**Understanding __update_mask**:
<br><br>
In the above image for rows 2,3 we have update mask value as "0x06" and the binary equivalent of this is "0110"... So from this I can say that columns 2,3 were updated which are nothing but Firstname and Lastname
<br>
In the same way for rows 4,5 we have a value "0x02" and the binary equivalent is "0100"... So I can say column 1 is updated.

<br><br>

# Identifying Records Modified In a Specific Transaction
Basically in tracking table we have data in the column __$start_lsn which is nothing but a transaction log sequence number
<br>
```
SELECT * FROM cdc.lsn_time_mapping 
```
<br>
This has info related to all transactions and it has date time
<br>

So In order to detect the time frame and group transactions in tracking table, we can use this query

```
select Id,Firstname,Lastname,t.* from  cdc.dbo_Users_CT u inner join
cdc.lsn_time_mapping t on u.__$start_lsn=t.start_lsn
```

# Disabling CDC On Table:
<br>
```
USE Pavan; 
GO 
EXEC sys.sp_cdc_help_change_data_capture 
GO
```

<br>
By using above query, we will get different parameters required for disabling the CDC

```
USE Pavan;
GO
EXECUTE sys.sp_cdc_disable_table 
    @source_schema = N'dbo', 
    @source_name = N'Test',
    @capture_instance = N'dbo_Test';
GO
```

<br>
Once the CDC is disabled, It will delete all tracking tables too.

<br>
# Deleting CDC on Database
```
USE Pavan 
GO 
EXEC sys.sp_cdc_disable_db 
GO 
```

# Data Cleanup From CDC Tables
In a transactional database with good load, If we have this Change tracking enabled, there are chances of the database growing exponentially. So keeping that in mind, **SQL server itself will clean these logs every 3 days** but this is configurable.

```

SELECT ([retention])/((60*24)) AS Default_Retention_days ,*
FROM msdb.dbo.cdc_jobs
```

<br>
Initally when we created CDC on a table, it created 2 jobs. One for capture and the other for cleanup. 
So it is the responsibility of cleanup job to clean the data
<br>
**sys.sp_cdc_cleanup_change_table**

<br>
**Updating this default 3 day value**:
```
EXEC Pavan.sys.sp_cdc_change_job 
@job_type=N'Cleanup'
,@retention=20160 -- <60 min *24 hrs * 14 days >
go

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
this.page.identifier = 07172019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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