---
title: dnSpy- All In One Tool For Decompiling and Debugging .Net Dlls
layout: post
date: '2018-06-07 15:18:06'
comments: true
categories:
- Dll_Decompiling
- Decompiled_Dll_Debugging
- dnSpy
tags:
- Debugging_3rd_Party_Code
- DnSpy
---

DnSpy is a c# reverse engineering tool which helped me to decompile a c# assembly and debug it
# **Problem I am trying to solve**: 
I Was having an issue with a .Net Windows Application exe throughing error message when trying to open it. I have an exe, and all dll's related to the project and a local database instance whose connectionstring is specified in a ini file. Unfortunately I dont have access to code base so that I can debug it using Visual Studio.
So I was searching for options to actually find out what the issue was.

I tried following approaches:
1. Decompile the dll's using dotPeek( jetbrains dotpeek), JustCompile  and then create the project in visual studio but that failed.
2. Another option can be using Visual Studio + dotPeek( as symbol server), Even this is not successful because I am not able to attach process in visual studio, because it is failing in the load it self.

So I am actually looking for a reverse enginerring tool which can acts as a c# disassembler

Then I came accross a called **"dnSpy"**.

# **dnSpy - A Fantastic Decompiler, Debugger and Editor**: 
What? does this tool does all these things?

Yes I am able to decompile my .Net dlls and then debug them and finally I am also able to edit decompiled Dll's and run them. 

This is a list of capabilities that were mentioned in their website [https://github.com/0xd4d/dnSpy](https://github.com/0xd4d/dnSpy)

So I can say that **"dnSpy"** is a must have tool in a .Net developers toolkit.

# **Debugger**: 
* Debug .NET Framework, .NET Core and Unity game assemblies, no source code required
* Set breakpoints and step into any assembly
* Locals, watch, autos windows
* Variables windows supports saving variables (eg. decrypted byte arrays) to disk or view them in the hex editor (memory window)
* Object IDs
* Multiple processes can be debugged at the same time
* Break on module load
* Tracepoints and conditional breakpoints
* Export/import breakpoints and tracepoints
* Call stack, threads, modules, processes windows
* Break on thrown exceptions (1st chance)
* Variables windows support evaluating C# / Visual Basic expressions
* Dynamic modules can be debugged (but not dynamic methods due to CLR limitations)
* Output window logs various debugging events, and it shows timestamps by default :)
* Assemblies that decrypt themselves at runtime can be debugged, dnSpy will use the in-memory image. You can also force dnSpy to always use in-memory images instead of disk files.
* Public API, you can write an extension or use the C# Interactive window to control the debugger

# **Assembly Editor**: 
* All metadata can be edited
* Edit methods and classes in C# or Visual Basic with IntelliSense, no source code required
* Add new methods, classes or members in C# or Visual Basic
* IL editor for low level IL method body editing
* Low level metadata tables can be edited. This uses the hex editor internally.

# **Hex Editor**: 
* Click on an address in the decompiled code to go to its IL code in the hex editor
* Reverse of above, press F12 in an IL body in the hex editor to go to the decompiled code or other high level representation of the bits. It's great to find out which statement a patch modified.
* Highlights .NET metadata structures and PE structures
* Tooltips shows more info about the selected .NET metadata / PE field
* Go to position, file, RVA
* Go to .NET metadata token, method body, #Blob / #Strings / #US heap offset or #GUID heap index
* Follow references (Ctrl+F12)

# **Others**: 
* BAML decompiler
* Blue, light and dark themes (and a dark high contrast theme)
* Bookmarks
* C# Interactive window can be used to script dnSpy
* Search assemblies for classes, methods, strings etc
* Analyze class and method usage, find callers etc
* Multiple tabs and tab groups
* References are highlighted, use Tab / Shift+Tab to move to next reference
* Go to entry point and module initializer commands
* Go to metadata token or metadata row commands
* Code tooltips (C# and Visual Basic)
* Export to project

<br/>

{% include /in_article_ads.html %}
# **Debugging a simple application using dnSpy**: 

Download latest release of dnSpy zip file from [https://github.com/0xd4d/dnSpy/releases](https://github.com/0xd4d/dnSpy/releases)
<br/>
<br/>
Once it is downloaded, unzip it and go to the folder and there we have an exe with name "dnSpy". Double click and open it
<br/>
<br/>
I am trying to debug a small console application exe.
<br/>
<br/>
<img src="{{ site.baseurl }}/assets/images/posts/dnspy_1.gif"  alt="" style="width: 100%;height: 100%;"/>

<br/>
<br/>

# **Editing a simple application dll/exe using dnSpy**: 

<img src="{{ site.baseurl }}/assets/images/posts/dnspy_2.gif"  alt="" style="width: 100%;height: 100%;"/>

<br/>
<br/>

**Keywords**: reverse engineering tools, c# decompiler, dot net decompiler, c# disassembler, c# reverse engineering

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
this.page.identifier = 07062018318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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