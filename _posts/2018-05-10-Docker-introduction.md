---
title: Installing Docker On Windows
layout: post
date: '2018-05-09 14:39:00 -0400'
categories: Docker
comments: true
tags:
- Docker
---

<p>Hi,</p><p>In this post, we will see how to install docker on windows and other basic details.</p><p><br></p><p><b>System Requirements:</b></p><p>1. For docker to run, we need to enable virtualization in windows. Windows by default support virtualization using HyperV. <br>Restart your machine and go to boot menu and try to enable Virtualization&nbsp;there. It is mandatory to enable virtualization in the boot menu for installing HyperV.<br>Now go to control panel --&gt; Programs --&gt; Turn Windows Feature On or Off. There we can find HyperV, click on that checkbox on then OK. This will install HyperV.</p><p>2. HyperV is not supported on Home edition of windows.</p><p>3. The current version of Docker for Windows runs on 64bit Windows 10 Pro, Enterprise, and Education.</p><p><br></p><p>Don't worry if you don't&nbsp;have above versions of Windows OS. There is an option to install docker via Docker toolbox to get started.<br><br><b>Downloads:</b></p><p>Download the installer Docker for windows from <a href="https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe">this location</a>&nbsp;</p><p>As I mentioned above, if you don't have supported version of OS, then you can download Docker Toolbox from <a href="https://download.docker.com/win/stable/DockerToolbox.exe">this location</a>.</p><p><br></p><p><b>Installation steps:</b></p><p>After downloading the exe,&nbsp;you can execute it and based on the permissions it may ask you for username and password.</p><p>During installation, It may also prompt you to enable virtualization or install HyperV, there you can click OK and proceed further.</p><p>After going through the steps in the installation wizard, docker is installed on the machine and we can use it.</p><p><br></p><p>In case if you are using Docker toolbox after successful installation, we can see that Oracle Virtual Box is installed on your machine along with docker.</p><p><br></p><p><b>Verifying your installation:<br><br>Docker For windows.exe( Not for Docker toolbox):</b></p><p>Docker will not start by default after installation. We need to search for docker icon on the desktop or in program files and click on it.</p><p><br></p><p></p><p><br></p><p>Make sure that \"Expose daemon on tcp://localhost:2375 without TLS\" is checked.</p><p><br></p><p>Now open command prompt and issue following command</p><pre style="line-height: 1.42857;"><code class="html">docker --version</code></pre><p><br></p><p>Note: If you have any issues still, make sure that your anti-virus or firewall is blocking docker. I had this issue with Kaspersky on my machine and I need to turn off Kaspersky for my docker to work.</p><p><br></p><p><b>Docker Toolbox verification:</b></p><p>On desktop, we can see Docker toolbox icon</p><p><br></p><p><img src="https://docs.docker.com/toolbox/images/icon-set.png" alt="Desktop"></p><p><br></p><p>When we click Docker quick start, it will open a terminal (which is a flavor of bash required by docker).<br><br>Now in the command prompt, you can issue following commands<br></p><pre><code class="html">docker --version</code></pre><p><br>If we get the result, then docker installation is successful.<br></p><p><br></p><p>Thanks,</p><p>Pavan Kumar Aryasomayajulu</p>

{% include /in_article_ads.html %}

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 143900; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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