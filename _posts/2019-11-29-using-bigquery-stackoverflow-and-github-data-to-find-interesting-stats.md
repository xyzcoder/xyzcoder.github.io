---
title: Using BigQuery Stackoverflow and Github Data To Find Interesting Stats
layout: post
date: '2019-11-29 13:28:40'
comments: true
Categories:
- BigQuery
- Stackoverflow
- Github
- PublicDataSet
tags:
- BigQuery
- Stackoverflow
- Github
- PublicDataSet
---

Hello Everyone,
As a developer, I use Stackoverflow and Github everyday. So I know these sites play a vital role in almost every software developers day to day life.<br>

So In this post, I would like to find some interesting stats like how many .cs(C# files) have stackoverflow question as a comment and then which answer or question they are actually refering to. I'll be making use of Google's BigQuery and open datasets provided by them to find out these relationships.<br>

# BigQuery
"BigQuery is an enterprise data warehouse that solves this problem by enabling super-fast SQL queries using the processing power of Google's infrastructure. ... You can control access to both the project and your data based on your business needs, such as giving others the ability to view or query your data" -- Google's definition<br><br>

So Google provides us ability to query in sql format by uploading large datasets or even we can [public datasets](https://console.cloud.google.com/marketplace/browse?filter=solution-type:dataset&_ga=2.36387364.-58570473.1575000853) <br>
<br>
Google has almost 124 different public datasets available in the market place from various domains.
<br>


# Getting Started With BigQuery
Navigate to [https://console.cloud.google.com/bigquery] (https://console.cloud.google.com/bigquery) <br>
<br>
Login with your gmail account
<br>
<img src="{{ site.baseurl }}/bigquery1.JPG"  alt="" style="width: 80%;height: 80%;"/>
<br>
Click on select project and add a new project if you dont have one or the quota got expired for existing one. Once we are done with the project creation, following screen appears.<br>
<img src="{{ site.baseurl }}/bigquery2.JPG"  alt="" style="width: 80%;height: 80%;"/><br>
At the bottom we can see **bigquery-public-data** and there we can see different public datasets. I am more interested in **github_repos** and **stackoverflow** datasets.
<br>
When we expand **github_repos** we can see different tables available and when we click on a table name we can see schema. If we click on preview, we can see sample data.
# Finding Languages Used In Repos
You write blog posts as text files and Jekyll provides everything you need to turn it into a blog.
<br>
**Distinct list of languages used in repos**
```
SELECT distinct(lang.name) as lang FROM `bigquery-public-data.github_repos.languages`, UNNEST(language) as lang
```


<table>
<thead>
<tr>
<th>Row</th>
<th>lang</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>
<div>C</div>
</td>
</tr>
<tr>
<td>2</td>
<td>
<div>D</div>
</td>
</tr>
<tr>
<td>3</td>
<td>
<div>M4</div>
</td>
</tr>
<tr>
<td>4</td>
<td>
<div>Makefile</div>
</td>
</tr>
<tr>
<td>5</td>
<td>
<div>Objective-C</div>
</td>
</tr>
<tr>
<td>6</td>
<td>
<div>Roff</div>
</td>
</tr>
<tr>
<td>7</td>
<td>
<div>Shell</div>
</td>
</tr>
<tr>
<td>8</td>
<td>
<div>PHP</div>
</td>
</tr>
<tr>
<td>9</td>
<td>
<div>Perl</div>
</td>
</tr>
<tr>
<td>10</td>
<td>
<div>Java</div>
</td>
</tr>
<tr>
<td>11</td>
<td>
<div>JavaScript</div>
</td>
</tr>
<tr>
<td>12</td>
<td>
<div>Python</div>
</td>
</tr>
<tr>
<td>13</td>
<td>
<div>Ruby</div>
</td>
</tr>
<tr>
<td>14</td>
<td>
<div>Tcl</div>
</td>
</tr>
<tr>
<td>15</td>
<td>
<div>OCaml</div>
</td>
</tr>
<tr>
<td>16</td>
<td>
<div>XSLT</div>
</td>
</tr>
<tr>
<td>17</td>
<td>
<div>VimL</div>
</td>
</tr>
<tr>
<td>18</td>
<td>
<div>Elixir</div>
</td>
</tr>
<tr>
<td>19</td>
<td>
<div>Groovy</div>
</td>
</tr>
<tr>
<td>20</td>
<td>
<div>Racket</div>
</td>
</tr>
<tr>
<td>21</td>
<td>
<div>Vala</div>
</td>
</tr>
<tr>
<td>22</td>
<td>
<div>Scheme</div>
</td>
</tr>
<tr>
<td>23</td>
<td>
<div>Verilog</div>
</td>
</tr>
<tr>
<td>24</td>
<td>
<div>Emacs Lisp</div>
</td>
</tr>
<tr>
<td>25</td>
<td>
<div>E</div>
</td>
</tr>
<tr>
<td>26</td>
<td>
<div>HTML</div>
</td>
</tr>
<tr>
<td>27</td>
<td>
<div>Matlab</div>
</td>
</tr>
<tr>
<td>28</td>
<td>
<div>PostScript</div>
</td>
</tr>
<tr>
<td>29</td>
<td>
<div>VHDL</div>
</td>
</tr>
<tr>
<td>30</td>
<td>
<div>J</div>
</td>
</tr>
<tr>
<td>31</td>
<td>
<div>M</div>
</td>
</tr>
<tr>
<td>32</td>
<td>
<div>MATLAB</div>
</td>
</tr>
<tr>
<td>33</td>
<td>
<div>TeX</div>
</td>
</tr>
<tr>
<td>34</td>
<td>
<div>Mercury</div>
</td>
</tr>
<tr>
<td>35</td>
<td>
<div>mupad</div>
</td>
</tr>
<tr>
<td>36</td>
<td>
<div>OpenEdge ABL</div>
</td>
</tr>
<tr>
<td>37</td>
<td>
<div>Rebol</div>
</td>
</tr>
<tr>
<td>38</td>
<td>
<div>Objective-C++</div>
</td>
</tr>
<tr>
<td>39</td>
<td>
<div>Swift</div>
</td>
</tr>
<tr>
<td>40</td>
<td>
<div>R</div>
</td>
</tr>
<tr>
<td>41</td>
<td>
<div>Scala</div>
</td>
</tr>
<tr>
<td>42</td>
<td>
<div>C#</div>
</td>
</tr>
<tr>
<td>43</td>
<td>
<div>F#</div>
</td>
</tr>
<tr>
<td>44</td>
<td>
<div>Go</div>
</td>
</tr>
<tr>
<td>45</td>
<td>
<div>Rust</div>
</td>
</tr>
<tr>
<td>46</td>
<td>
<div>Pascal</div>
</td>
</tr>
<tr>
<td>47</td>
<td>
<div>Inno Setup</div>
</td>
</tr>
<tr>
<td>48</td>
<td>
<div>PowerShell</div>
</td>
</tr>
<tr>
<td>49</td>
<td>
<div>Smalltalk</div>
</td>
</tr>
<tr>
<td>50</td>
<td>
<div>NSIS</div>
</td>
</tr>
<tr>
<td>51</td>
<td>
<div>TSQL</div>
</td>
</tr>
<tr>
<td>52</td>
<td>
<div>C++</div>
</td>
</tr>
<tr>
<td>53</td>
<td>
<div>Groff</div>
</td>
</tr>
<tr>
<td>54</td>
<td>
<div>Lua</div>
</td>
</tr>
<tr>
<td>55</td>
<td>
<div>NewLisp</div>
</td>
</tr>
<tr>
<td>56</td>
<td>
<div>Perl6</div>
</td>
</tr>
<tr>
<td>57</td>
<td>
<div>Dart</div>
</td>
</tr>
<tr>
<td>58</td>
<td>
<div>Erlang</div>
</td>
</tr>
<tr>
<td>59</td>
<td>
<div>Haskell</div>
</td>
</tr>
<tr>
<td>60</td>
<td>
<div>Hack</div>
</td>
</tr>
<tr>
<td>61</td>
<td>
<div>LLVM</div>
</td>
</tr>
<tr>
<td>62</td>
<td>
<div>Protocol Buffer</div>
</td>
</tr>
<tr>
<td>63</td>
<td>
<div>Thrift</div>
</td>
</tr>
<tr>
<td>64</td>
<td>
<div>Yacc</div>
</td>
</tr>
<tr>
<td>65</td>
<td>
<div>Prolog</div>
</td>
</tr>
<tr>
<td>66</td>
<td>
<div>Puppet</div>
</td>
</tr>
<tr>
<td>67</td>
<td>
<div>Scilab</div>
</td>
</tr>
<tr>
<td>68</td>
<td>
<div>Forth</div>
</td>
</tr>
<tr>
<td>69</td>
<td>
<div>GLSL</div>
</td>
</tr>
<tr>
<td>70</td>
<td>
<div>Mask</div>
</td>
</tr>
<tr>
<td>71</td>
<td>
<div>Jupyter Notebook</div>
</td>
</tr>
<tr>
<td>72</td>
<td>
<div>Logos</div>
</td>
</tr>
<tr>
<td>73</td>
<td>
<div>Gnuplot</div>
</td>
</tr>
<tr>
<td>74</td>
<td>
<div>Mathematica</div>
</td>
</tr>
<tr>
<td>75</td>
<td>
<div>TypeScript</div>
</td>
</tr>
<tr>
<td>76</td>
<td>
<div>Visual Basic</div>
</td>
</tr>
<tr>
<td>77</td>
<td>
<div>QMake</div>
</td>
</tr>
<tr>
<td>78</td>
<td>
<div>Kotlin</div>
</td>
</tr>
<tr>
<td>79</td>
<td>
<div>CSS</div>
</td>
</tr>
<tr>
<td>80</td>
<td>
<div>EQ</div>
</td>
</tr>
<tr>
<td>81</td>
<td>
<div>IDL</div>
</td>
</tr>
<tr>
<td>82</td>
<td>
<div>FLUX</div>
</td>
</tr>
<tr>
<td>83</td>
<td>
<div>Pure Data</div>
</td>
</tr>
<tr>
<td>84</td>
<td>
<div>HLSL</div>
</td>
</tr>
<tr>
<td>85</td>
<td>
<div>QML</div>
</td>
</tr>
<tr>
<td>86</td>
<td>
<div>PLSQL</div>
</td>
</tr>
<tr>
<td>87</td>
<td>
<div>SQLPL</div>
</td>
</tr>
<tr>
<td>88</td>
<td>
<div>Processing</div>
</td>
</tr>
<tr>
<td>89</td>
<td>
<div>Lex</div>
</td>
</tr>
<tr>
<td>90</td>
<td>
<div>Idris</div>
</td>
</tr>
<tr>
<td>91</td>
<td>
<div>PureScript</div>
</td>
</tr>
<tr>
<td>92</td>
<td>
<div>Clojure</div>
</td>
</tr>
<tr>
<td>93</td>
<td>
<div>CoffeeScript</div>
</td>
</tr>
<tr>
<td>94</td>
<td>
<div>FORTRAN</div>
</td>
</tr>
<tr>
<td>95</td>
<td>
<div>Crystal</div>
</td>
</tr>
<tr>
<td>96</td>
<td>
<div>Factor</div>
</td>
</tr>
<tr>
<td>97</td>
<td>
<div>Julia</div>
</td>
</tr>
<tr>
<td>98</td>
<td>
<div>Nimrod</div>
</td>
</tr>
<tr>
<td>99</td>
<td>
<div>Vim script</div>
</td>
</tr>
<tr>
<td>100</td>
<td>
<div>PureBasic</div>
</td>
</tr>
</tbody>
</table>




<br>
**Please download the sample blog content I am using from this zip file and make use of it** {{ site.url }}/download.zip
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
this.page.identifier = 29102019312; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
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