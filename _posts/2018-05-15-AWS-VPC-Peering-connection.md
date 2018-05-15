---
title: AWS VPC Peering Connection
layout: post
date: '2018-05-15 22:19:51'
categories: AWS,vpc
---

# **Problem I am trying to solve**: 
Actually I am planning to create a cluster for a spark environment using my AWS free tier account. So I created an account with AWS and was impressed by their free offerings :) 750hrs for an instance ...
I decided to spin up few ubuntu machines as slaves for Spark cluster. I went to Instance creation page in AWS and selected ubuntu machine, there is the first hit, I am able to create a machine with just 1gb Ram.
Next after going through the process I came to know that under free tier I can use maximum of 30gb space. So If I want to deal with decent amount of data to play with Apache Spark, I can create a single machine with 30gb space and 1gb Ram. This will not help me out, All my hopes to create a spark cluster with decent number of ububtu machines at free of cost went down :(
<br>
<br>
But I didnt give up, I decided to create multiple AWS accounts with my personal, office and my other email accounts. I was able to successfull create 3 accounts. So again with a smiling face, I logged into 3 different accounts and I am able to create 3 different ubuntu instances each with 1gb Ram and 30gb harddisk space. As these machines were provided with a external IP, I am also able to communicate with them. But the problem here is, I am able to communicate via internet but not privately. Whenever we create an instance in AWS, we are provided with an option to access via internet and also they provide us with an internal IP address which can be used with in the same VPC. But my 3 accounts will have 3 different VPC's. 
<br><br>
So I cannot use internal IP's to communicate between these 3 machines, As I created my 3 accounts with AWS and my VPC's are in the same region? It is something like 3 different companies created 3 different accounts with AWS but still they wanted to be in same network. I am not sure whether this a common requirement or not, but I have this requirement now.
<br><br>
A big answer to my problem in **"VPC Peering"**.

# **What is VPC Peering:**
VPC Peering is a networking connect that enables network connectivity between to VPC's. In way by enabling VPC Peering, we can treat our machines as if they were in same network.

I can create VPC peering between different VPC's in same account and also it is possible for us to create peering between different VPC's present in different accounts though there are few limitations.

<img src="{{ site.baseurl }}/assets/images/posts/peering-intro-diagram.png"  alt="" />

# **How Do I do VPC Peering**
1. Login into your AWS account. From now lets consider it as Account-1
2.  Go to your VPC dashboard. In Services search for VPC and click on it.

<img src="{{ site.baseurl }}/assets/images/posts/vpc.png"  alt="" style="width: 100%;height: 100%;"/>

3. Make a note of CIDR block present under Ipv4 CIDR column.
4. Click on Peering Connection in side menu present under "Your VPC" and click on create peering connection button.
5. Give  aname for "Peering connection name tag"
6. For VPC (Requester).. Select VPC for which you want to create peering in Account-1. In my case I have only 1 VPC so in the drop down, I'll get only one entry.
7. Now under "Select another VPC to Peer with", Here we need to provide other vpc details and if other vpc is from another account, we need to check "other account: radio button.
8. Now provide accountId, this can be obtained from My Account Menu
9. If your VPC is in same region, we can keep that radio button as it is. In case if you want to connect to a VPC present in someother region, just select that region from drop down.
10. VPC (Accepter) for this field. Login to your other account and navigate to VPC dashboard, navigate to My VPC. There copy the VPCId present under VPC ID column and past it here. Also keep a note of IPv4 CIDR in your other account.

<img src="{{ site.baseurl }}/assets/images/posts/peering-screen.png"  alt="" style="width: 100%;height: 100%;"/>

11. After clicking on save, I got a success message . But unfortunately, In My peering connections table, status is failed. So that means our effort to create vpc peering failed. If we dont get an error it is well and good and we can proceed further, Please follow 13,14,15 steps in below side heading(How Do I solve this Overlapping CIDR ranges issue) .

<img src="{{ site.baseurl }}/assets/images/posts/failed-peer.png"  alt="" style="width: 100%;height: 100%;"/>

12. "Failed due to incorrect VPC-ID, Account ID, or overlapping CIDR rang" Message clearly says that the error was due to invalid VPC-Id or accountid or same CIDR range for both VPC's in different accounts.
13. In our case it is because of overlapping CIDR ranges. We can check these values in My Vpc, under IPv4 CIDR

# **How Do I solve this Overlapping CIDR ranges issue**
1. Go to your other account lets say Account-2. Now Navigate to VPC dashboard.
2. Select the VPC which has same CIDR block and delete it.
3. Now click on Create VPC. 

<img src="{{ site.baseurl }}/assets/images/posts/new-vpc.png"  alt="" style="width: 100%;height: 100%;"/>
4. As we already have CIDR block **172.31.0.0/16** in account-1 VPC, I would like to give someother range. I am giving it as **172.33.0.0/16**
5. Now copy new VPC Id from account-2 which is created in above step.
6. Now get back to Account-1
7. Click on Peering Connection in side menu present under "Your VPC" and click on create peering connection button.
8. Give  aname for "Peering connection name tag"
9. For VPC (Requester).. Select VPC for which you want to create peering in Account-1. In my case I have only 1 VPC so in the drop down, I'll get only one entry.
10. Now under "Select another VPC to Peer with", Here we need to provide other vpc details and if other vpc is from another account(account-2), we need to check "other account: radio button.
11. Now provide accountId, this can be obtained from My Account Menu
12. If your VPC is in same region, we can keep that radio button as it is. In case if you want to connect to a VPC present in someother region, just select that region from drop down.
13. VPC (Accepter) for this field. Login to your other account(account-2) and navigate to VPC dashboard, navigate to My VPC. There copy the VPCId present under VPC ID column and past it here. Also keep a note of IPv4 CIDR in your other account.
14. Now we can see success message and when we navigate to Peering Connection menu, we can see an entry with "Pending Acceptance" status. That means our VPC peering from Account-1 side is perfectly alright.
15. Now navigate to Account-2, Navigate to VPC dahboard and select Peering Connection menu. 
16. There we can see an entry with "Pending Acceptance". Select that item and click on Action menu and accept request.

# **Modify Route Tables**
 By doing above steps, we were able to successfull create VPC peering. But still we will not be able to send traffic between these VPC's. In order to do that, we need to follow few more steps.
 1. Navigate to Route tables present under "Virtual private Cloud" menu item in Account-1
 1. For route table which is associated with the VPC(to which we created vpc peering) in account-1, select it
 2. Click on Routes tab at the bottom section and click on edit
 3. Now Click on Add another route and there for "destination" provide Account-2 VPC's CIDR range
 4. For Target , select peer connection id which we got from above process.

<img src="{{ site.baseurl }}/assets/images/posts/vpc-peer-route.png"  alt="" style="width: 100%;height: 100%;"/>

5. Now navigate to Account-2 , Route tables for the VPC we are trying to peer and add a new route by providing Account-1 VPC CIDR range and then select vpc peering id for destination.
6. Now we can see traffic between these 2 VPC even though they were present in different accounts.


Thanks,
Pavan