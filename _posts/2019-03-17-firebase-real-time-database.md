---
title: Firebase Real time Database For My Static Website
layout: post
date: '2019-03-17 12:02:33'
comments: true
categories:
- Firebase
tags:
- firebase
---

Hi,
In this post I'll explain how I am making use of firebase real time database / firebase database for storing my subscribers list of my blog.

Firebase is a realtime database and also provides many more functionalities like Hosting, Functions(Serverless Architecture) where data is stored in the form of a json document. So my plan is to make use firebase database and firebase functions.

# Registering With Firebase:
1. Go to [https://firebase.google.com/](https://firebase.google.com/) and click on " Go to Console" and register your self with your email.
2. Click on "Add Project" and give an appropriate name for your project

<br/>
<img src="{{ site.baseurl }}/assets/images/posts/firebase/1.PNG"  alt="" style="width: 100%;height: 100%;"/>

# Plans Provided By Firebase:
For now I am planning to make use of spark plan which is a free option for unlimited number of days. I hope this is ok for me as of now.
It provides me 1GB data and 100 Simultaneous connections etc 

<img src="{{ site.baseurl }}/assets/images/posts/firebase/2.PNG"  alt="" style="width: 100%;height: 100%;"/>


# Getting Started with Database Setup:
1. Click on Databases on the left side menu item
<br/>

<img src="{{ site.baseurl }}/assets/images/posts/firebase/3.PNG"  alt="" style="width: 100%;height: 100%;"/>

<br/>
As we can see , here we can add or edit data on the fly here and also can make these changes programatically.
<br/>
Also we can see that there is an option to called "Rules", there we can edit different security rules on who can add data and others.
<br/>
For example, I wanted to add data only when I am authenticated with my email address. So that no one else can modify or alter my data.

```
{
  "rules": {
    ".read": true,
    ".write": "auth.token.email.matches(/xyzcoder1989@gmail.com$/)"
  }
}
```

And If I dont want anyone to read or write data, then I can simply have following rule.

```
// These rules don't allow anyone read or write access to your database
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

**Rule Types**
<br/>
**.read**	Describes if and when data is allowed to be read by users.
<br/>
**.write**	Describes if and when data is allowed to be written.
<br/>
**.validate**	Defines what a correctly formatted value will look like, whether it has child attributes, and the data type.

So In my case I wanted to write data but it is not required by others to read that data. So I am going to set read as false and write true.

```
{
  "rules": {
      ".read": false,
      ".write": true,
      "$unknownKey": {       
        ".validate": "newData.val().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)"
			}
  }
}
```

<br/>
For more details you can check his url
<br/>
[https://firebase.google.com/docs/database/security/?authuser=2](https://firebase.google.com/docs/database/security/?authuser=2)

# Getting started with changes in web application
Before actually getting started with coding, we need to initialize firebase app. Place this code in head tag

<br/>

```
<script src="https://www.gstatic.com/firebasejs/5.9.0/firebase.js"></script>
<script>
  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    projectId: "<PROJECT_ID>",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  };
  firebase.initializeApp(config);
</script>
```

<br/>
To get actual values, in Firebase console go to , click on gear icon next to "Project Overview", click on "Project Settings"
<br/>
Click on 3rd icon and copy code.

<img src="{{ site.baseurl }}/assets/images/posts/firebase/4.PNG"  alt="" style="width: 100%;height: 100%;"/>

# Saving Data to My Firebase DB:
Now In my Html code, I am trying to save this data to firebase using update method

<br/>

```

	     <div id="myModal" class="modal fade" role="dialog">
            <div class="modal-dialog">
          
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title" style="color: white;">Thank you for reading this article</h4>
                </div>
                <div class="modal-body">
                  <p>Please Enter your email</p>
                  <input type="text" id="email" style="width:100%">
                  <br/>
                  <div class="adsense-inject">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" onclick="saveSubscribe()">Subscribe</button>
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
          
            </div>
        </div>

    function saveSubscribe(){
        var id = $("#email").val();

        if(!validateEmail(id)){
            alert("Enter valid email");
        }
        else{
            var timestamp = new Date().valueOf();
            var obj = {};
            obj[timestamp] = id;

            firebase.database().ref('/').update(obj, function(error) {
                if (error) {
                    alert("Invalid email");
                } else {
                    $("#myModal").modal("hide");
                    alert("Thank you for subscribing and happy learning");
                }
            });
           
        }
    }
```

Note: Here I am using  "firebase.database().ref('/').update" instead of "firebase.database().ref('/').set".
<br/>
This is because set will overwrite data where as update will add new item if we dont find an existing item with key else it will update the record.


<br/>
**Keywords:** firebase, firebase console, firebase database, firebase cloud messaging, firebase analytics

<br/>
<br/>
Thanks,
Pavan

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 03172019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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