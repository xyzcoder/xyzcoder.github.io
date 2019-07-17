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

**Check If CDC Is Enabled:**

```
USE master 
GO 
SELECT [name], database_id, is_cdc_enabled  FROM sys.databases       
GO  
```

<img src="{{ site.baseurl }}/assets/images/posts/cdc/1.png" style="width:50%"  alt=""/>
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