---
title: Web Resources axd
layout: post
date: '2011-11-01 00:00:00'
comments: true
categories:
- WebResource.axd
tags:
- WebResource.axd
---

Generally we will be having all the static content files like Java scripts, images, css files at different locations on our machine and we will be importing them in our aspx or html pages by mentioning the path where they exist.
<br/>
For example let us assume that i am having a java script file in a location like c:\Pavan\Proj\Java Script\Example.js and similarly some other static files like images and css at different location on my machine and i will be making use of these files by specifying the exact path in my aspx. Up-to now everything is fine. But i am planning to deploy my application onto a different server. In this there are more chances of me facing the issue with the path of these static files i am making use in my application. We should take care that these static files are placed in the similar location like in my first environment.
<br/><br/>
So in order to over come these type of issues we can make use of WebResources.
<br/><br/>
The main theme of web resources is we can embed all the static files into an assembly(dll) so that we can avoid the problems mentioned in the above scenario. Now let us see how to create Web Resource files and how to make use of them.
<br/><br/>
**Embedding static files into a dll:**
<br/>
1. Create a classlibrary project in visual studio.
<br/>
2. Add static files like js,image,css files
<br/>
3. Select the static files and click on properties.
<br/>
<img src="{{ site.baseurl }}/assets/images/posts/webresource/1.jpg"  alt="" style="width: 354px;height: 479px"/>
<br/>
4. Open the AsseblyInfo.cs file and add the webreference attribute

```
[assembly: WebResource("ClassLibrary1.Testjavascript.js", "text/javascript")]
[assembly: WebResource("ClassLibrary1.testcssfile.js", "text/css")]
```

<br/>
5. We will have Web resource attribute class in System.Web.UI<br/>
The WebResource assembly attribute has three parameters as follows:<br/>
1.**Web Resource: **The name of the resource that is embedded in the assembly<br/>
2.**ContentType:** The MIME file type for the resource<br/>
3.**PerformSubstitution:** A Boolean value that determines whether other Web Resource URLs that are referenced in this resource are parsed and replaced with the full path of the resource<br/>
Now compile the classLibrary project and in the resultant dll we will have these static file embedded.<br/>
We can see these embedded file by using software like Reflector.<br/>

<img src="{{ site.baseurl }}/assets/images/posts/webresource/2.jpg"  alt="" style="width: 700px;height: 300px;"/>
<br/>
Now we are having a dll in which the static files were embedded. So the next step would be to make use of them in our project.
<br/><br/>
The following are the steps to make use of these resources.
<br/><br/>
1. Add the dll(that contains static data) or proj reference to the website we are developing.
<br/>
2. So inorder to access the resource that is present in the dll we should make use of a function called GetWebresourceUrl() which is  a method of the class “ClientScriptManager” which is used to bind the client scripts.

```
string imagepath = Page.ClientScript.GetWebResourceUrl(t, "ClassLibrary1.tig.jpg");
img1.Src = imagepath;
```

So the GetWebResourceUrl() takes 2 parameters.<br/>

i. Type
```
Type t = typeof(Namespace.ClassName);
```
<br/>
ii. Complete name of the resource we are trying to get.
<br/>
3. So the GetWebResourceUrl() returns a string and we can assign that string to the HtmlControl as src.
<br/>

```
Type t = typeof(ClassLibrary1.Class1);
      ClientScript.RegisterClientScriptInclude("test", Page.ClientScript.GetWebResourceUrl(t, "ClassLibrary1.Testjavascript.js"));
      string imagepath = Page.ClientScript.GetWebResourceUrl (t, "ClassLibrary1.tig.jpg");
      img1.Src = imagepath;

```

ClientScript.RegisterClientScriptInclude() is used to register the javascript from the code behind file.

<br/>
Thanks,
Pavan

{% include /in_article_ads.html %}

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 03242019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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