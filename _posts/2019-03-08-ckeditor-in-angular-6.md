---
title: CKEditor In Angular 6
layout: post
date: '2019-03-08 09:02:47'
comments: true
categories:
- ckeditor_angular6
- ckeditor
tags: Angular6
---

Hi,
In this post we will see how to get started with CKEditor in Angular6

<br/>

# ng2-ckeditor:
I decided to make use of ng2-ckeditor because of the community support and number of download in nuget packages

<br/>
We can download it from [ng2-ckeditor](https://www.npmjs.com/package/ng2-ckeditor).

<br/>
Steps:
<br/>
1. Add ng2-ckeditor to package.json file "ng2-ckeditor": "^1.2.2", under dependencies section
2. Now include ckeditor related js file in the head section of index.html
			
		<script src="https://cdn.ckeditor.com/4.5.11/full/ckeditor.js"></script>

3. Include CKEditor Module in the main module where you are planning to use

			
					import { CKEditorModule } from 'ng2-ckeditor';

								@NgModule({
									imports: [
										//......
										CKEditorModule
									],
									declarations: [//.....],
									bootstrap:    [ //....... ]
								})
								export class YourModule { }

4. Using it in the component
  
				your.component.ts
				
				import { Component, OnInit } from '@angular/core';

				@Component({
					selector: 'app-your-selector',
					templateUrl: './your.component.html'
				})

				export class AdminDashboardComponent implements OnInit {

						constructor() {
						}

						ngOnInit() {
							ckeditorContent: string = '<p>This is Pavan Kumar Aryasomayajulu</p>';
						}
				}
				
				

5. Including ckeditor in template file
		
			
					<ckeditor
						[(ngModel)]="ckeditorContent"
						[config]="{uiColor: '#99000'}"
						[readonly]="false"
						(change)="onChange($event)"
						(editorChange)="onEditorChange($event)" <!-- CKEditor change event -->
						(ready)="onReady($event)"
						(focus)="onFocus($event)"
						(blur)="onBlur($event)"
						(contentDom)="onContentDom($event)"
						(fileUploadRequest)="onFileUploadRequest($event)"
						(fileUploadResponse)="onFileUploadResponse($event)"
						(paste)="onPaste($event)"
						(drop)="onDrop($event)"
						debounce="500">
					</ckeditor>
					
	
<br/>
	This is how our editor looks like
<img src="{{ site.baseurl }}/assets/images/posts/ckeditor/1.png"  alt="" style="width: 100%;height: 100%;"/>

{% include /in_article_ads.html %}

# Configuring CKEditor
CKEditor is a powerful tool and it provides a lot of flexibility to end user to configure it. lets see some basic configurations



-- your.component.html

		<ckeditor [config]="config" ></ckeditor>


-- your.component.ts


		import { Component, OnInit } from '@angular/core';

		 @Component({
			 selector: 'app-your-selector',
			 templateUrl: './your.component.html'
		 })

		 export class AdminDashboardComponent implements OnInit {
				 config: any;
				 constructor() {
					this.config = {
					  uiColor: '#CCEAEE', // This is to set editor color https://ckeditor.com/docs/ckeditor4/latest/examples/uicolor.html
					  toolbarGroups: [ // Configure Different elements present in Editor
						{ name: 'clipboard', groups: ['clipboard', 'undo'] },
						{ name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
						{ name: 'links' },
						{ name: 'insert' },
						{ name: 'document', groups: ['mode', 'document', 'doctools'] },
						{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
						{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
						{ name: 'styles' },
						{ name: 'colors' }
					  ],
					  resize_enabled: false,
					  height: 500 // Setting height
					};
				 }

				 ngOnInit() {
				 }
		 }

So basically for ckeditor component we are passing configuration using [config]="config".
<br/>
If we see configurations, uiColor is used to define the color of the editor this can be used to match your company theme color
<br/>
**toolbarGroup** is basically an array of objects used to configure different items in the editor toolbar and we can add or remove them based on our requirement. Each object in the array has a name and groups which is again an array containing different sections. We can also add these sections to other groups too.

<br/>
For example:
<br/>
Here I am trying to group spellchecker and undo together and removed other items
```
toolbarGroups: [ // Configure Different elements present in Editor
        { name: 'clipboard', groups: ['undo', 'spellchecker'] },
        { name: 'editing', groups: ['find', 'selection'] }
      ]
```
This is how my editor looks like now.

<img src="{{ site.baseurl }}/assets/images/posts/ckeditor/2.png"  alt="" style="width: 100%;height:50%;"/>

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
this.page.identifier = 03082019318; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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