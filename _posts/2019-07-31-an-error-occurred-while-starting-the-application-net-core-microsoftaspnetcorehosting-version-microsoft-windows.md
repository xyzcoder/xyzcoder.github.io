---
title: An error occurred while starting the application. .NET Core  | Microsoft.AspNetCore.Hosting
  version  | Microsoft Windows
layout: post
date: '2019-07-31 10:15:10'
comments: true
Categories:
- Asp.netCore
tags:
- Asp.netCore
---

Hi, 
In this post, I would like to explain how we can handle the following error that we usually get when hosting Asp.Net core application using IIS.

<br>
** An error occurred while starting the application. .NET Core  | Microsoft.AspNetCore.Hosting version  | Microsoft Windows **

<br>
```
An error occurred while starting the application.

.NET Core X86 v4.1.1.0    |   Microsoft.AspNetCore.Hosting version 1.1.1    |    Microsoft Windows 6.2.9200    |   Need help?
```

I was getting above error after publishing my code to a remote server and hosting it using IIS.
<br>
I was actually clueless and tried to find out what was the actual error, this particular message looks generic and there might be something that is actually causing this issue.

<br><br>
I tried looking at EventLogs but still, I don't see any error message logging over there.

# How to log error message in Asp.Net Core
1. Go to Projects Web.Config file and try to enable error by setting true to "stdoutLogEnabled" property

```
<aspNetCore processPath="%LAUNCHER_PATH%" arguments="%LAUNCHER_ARGS%" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout">
      <environmentVariables />
    </aspNetCore>
```

<br>

2. Also in the config file, we see the location where errors are supposed to be written.
3. So by default Asp.Net core doesn't create these folders, In our case ** "logs\stdout"**. So go and create a folder by name **"logs"**
4. Go to Visual studio proj and add a folder by name "logs" at the root level and add a sample.txt file(this can be an empty one.. Just because if the content is empty then we will not get this folder in Published files)
5. Now publish the project and make sure that we have logs folder present.
6. Now when we run the application and if there are any errors, It will be logged in logs folder in server and that helps us in identifying  what the actual error is.

<br>
<br>
In my case the error was something related to Entityframework and sqllite DB

```
Application startup exception: Microsoft.Data.Sqlite.SqliteException (0x80004005): SQLite Error 14: 'unable to open database file'.
   at Microsoft.Data.Sqlite.SqliteException.ThrowExceptionForRC(Int32 rc, sqlite3 db)
   at Microsoft.Data.Sqlite.SqliteConnection.Open()
   at Microsoft.EntityFrameworkCore.Storage.RelationalConnection.OpenDbConnection(Boolean errorsExpected)
   at Microsoft.EntityFrameworkCore.Storage.RelationalConnection.Open(Boolean errorsExpected)
   at Microsoft.EntityFrameworkCore.Sqlite.Storage.Internal.SqliteRelationalConnection.Open(Boolean errorsExpected)
   at Microsoft.EntityFrameworkCore.Sqlite.Storage.Internal.SqliteDatabaseCreator.Create()
   at Microsoft.EntityFrameworkCore.Storage.RelationalDatabaseCreator.EnsureCreated()
   at Microsoft.EntityFrameworkCore.Infrastructure.DatabaseFacade.EnsureCreated()
```

I was getting this error because  I am trying to create a SqLite DB in a subfolder and again ASP.Net core was not able to create subfolder. So I manually created the folder and it was resolved.

```
optionsBuilder.UseSqlite(@"Data Source=C:\Pavan\MyDatabase.db");
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
this.page.identifier = 08012019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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