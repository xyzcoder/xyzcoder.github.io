---
title: A firewall is blocking file Sharing between Windows and the containers
layout: post
date: '2019-07-08 19:33:17'
comments: true
categories:
- Docker
- DockerWindows
tags: Docker
---

**Error:** <b>Docker: A firewall is blocking file Sharing between Windows and the containers. See documentation for more info</b>
<br><br>
<b>Shared drives require port 445 to be open between the host machine and the virtual machine that runs Linux containers. Docker detects if port 445 is closed and shows the following message when you try to add a shared drive:</b>
<br><br>
**Description:** This is the error I am getting when I actually try to share C:\ and D:\ of my PC in Docker. 

<br>
<img src="{{ site.baseurl }}/assets/images/posts/docker_share/1.png"  alt="" style="width:80%;height: 80%;"/>
<br>

<br>
**Fix:**
<br>
1. I verified windows firewall settings and I didnt actually find an issue over there and my kaspersky is also not a culprit nor my VPN.<br>
2. Go to Hyper-V Manager -> Virtual Switch Manager -> DockerNAT -> Connection Type: change from internal to private, apply, change back to internal, apply
3. Restart MobyLinuxVM<br>
4. Restart Docker<br>
5. Set Docker network profile to 'Private' ( Below command is supposed to be executed in powershell in admin mode <br>
`Set-NetConnectionProfile -interfacealias "vEthernet (DockerNAT)" -NetworkCategory Private`
<br>
7. Navigate to  **Control Panel\Network and Internet\Network Connections**... Right click on "vEthernet (DockerNAT)" and click on Properties
6. Reset File and Printer Sharing for Microsoft Networks on DockerNAT connection by unchecking it<br>
7. Go to Docker -> Settings -> Shared Drives and share C: <br>

<br><br>
Thanks,<br>
Pavan Kumar Aryasomayajulu

{% include /in_article_ads.html %}
**Keywords:**  Docker, DockerForWindows

{% if page.comments %}
<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
this.page.identifier = 07082019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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