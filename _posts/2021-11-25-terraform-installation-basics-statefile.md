---
layout: post
title: 1. Terraform Installation, Basics, Statefile
comments: true
date: '2021-11-25 13:08:08'
Categories:
- Terraform
- InfrastructureAsCode
- AWS
tags:
- ''
- Terraform
- InfrastructureAsCode
- AWS
description: |-
  In this series of posts, we will see how to use Terraform to help us in provisioning cloud services by using the Hashicorp language.
  Infrastructure as a code helps us in automating infrastructure creation and also reduces manual errors while provisioning to a great extent
---

# Infrastructure As A Code
Redhat's definition
> Infrastructure as Code (IaC) is the managing and provisioning of infrastructure through code instead of through manual processes. With IaC, configuration files are created that contain your infrastructure specifications, which makes it easier to edit and distribute configurations.

So **Terraform** is one of the tools which helps us in automating Infrastructure provisioning by writing code in HCL(Hashicorp Language)
<br><br>
In Terraform basic building blocks are **Resources**. Each Resource block can be used to define one or more infrastructure elements like EC2 instances or VPC or Subnet
<br><br>
The Basic syntax of a Resource:
```
recource resource_type localname {
        parameter_name = parameter_value
    }
		
		# Note: resourcetype = provider_resourceType
    # Example:  aws_instance (this will create an instance in aws and AWS is provider here)
```
<br>
Example:** main.tf**
```
resource "local_file" "samplefile" {
  filename = "C:\\sample.txt"
  content = "This is a sample file"
}
```

So in the above example, we are trying to create a local file and the provider we are using in this example is **local** and resource type is **file**
<br><br>
There are 3 basic commands which we use most of the time and they are<br>
* `terraform init`
* `terraform plan`
* `terraform apply`
<br><br>

1.  `terraform init`

	   * This will download any providers from terraform registry that are needed for creating resources
     * We can observe `hashicorp/local v2.1.0` is downloaded and installed
     * [https://registry.terraform.io/providers/hashicorp/local/latest](https://registry.terraform.io/providers/hashicorp/local/latest)

     So Terraform registry is a place where we can find Terraform authorized, 3rd Party modules related to various providers and helps us in creating resources.

2. `terraform plan`

    -- This will give us the plan that Terraform is going to use to create our resource

    -- `+` create
       `-` destroy
       `-/+` replace (destroy and then create, or vice-versa if create-before-destroy is used)
       `~` update in-place
       `<=` read

3. `terraform apply`
    -- This will create a resource. In this case, it is a local file

4. `terraform.tfstate`
    -- Whenever a resource is created, terraform stores the state of the resource created in this statefile.

    -- **How is this useful?** So it helps in maintaining the state of all resources that were created.

      -- So If we make a change to the created resource outside of terraform, then terraform will use this state file to identify the change and act accordingly.

5. `terraform destroy` This will destroy resources that were created. We can observe destroy operation in the plan. Also, observe the statefile, text file resource is deleted from statefile when we run destroy command

# Playing with this:
1. Initially run `terraform apply` and we can see the resource is created.
			** main.tf**
		```
			resource "local_file" "samplefile" {
				filename = "C:\\sample.txt"
				content = "This is a sample file"
			}
		```
			
2. Re-run `terraform apply`  and we can observe no changes are made. This is because it is using statefile  that was created in 1st step and the resource in .tf file. Since both of them match no changes are made.

3. Modify resource in tf file and run `terraform apply`. So in this case, it is destroying the existing file and recreating a new one with updated text content ("This is a sample file changed"). For example in `main.tf` change content to "This is a sample file changed"

4. Change the content of resource and content in statefile to match (But already created resource has a different value).. Old file on disk,statefile has text content "This is a sample file changed". But I am changing statefile content and .tf content to a new value ("Making changes to tf resource in both statefile and resource")<br>
So here we are cheating :) Terraform to think like the content on file(disk) and content in .tf resource is same using statefile, though the text in file(disk) is different. So It doesn't physically check for file content but it is depending on statefile as proof for truth. And hence there is no change when we did apply.

5. Delete the statefile and run `terraform apply`. We observe a new resource is created. Since in this case, it is a physical file. It is overwritten but we can see the plan and observe it as a add operation. In case, if it is a AWS EC2 resource, It will create a duplicate resource

<br><br>
# My Session recording
<iframe width="100%" height="500" allowFullScreen='allowFullScreen' src="https://www.youtube.com/embed/t1LKi7fhkF8">
</iframe>

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
this.page.identifier = 251120211509; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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
