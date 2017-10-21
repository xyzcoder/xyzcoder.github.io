/**
 * xyzcoder.github.io
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';

class Layout extends React.Component {

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  render() {

    const ad_style = {
      width: '336px',
      height: '280px'
    };

    return (
      <div>
          <Header />
                <div className="container">
                  <div className="row">
                    <div className="col-xs-12">
                      <div id="photo-header" className="text-center">
                        <div id="text-header">
                          <h1>Hello,<br> my name is <span>Pavan Kumar Aryasomayajulu</span><sup>27yo</sup> and this is a gist of my work</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12 col-sm-7">
                      <!-- ABOUT ME -->

                      <div className="box" style={{max-width:300px;left: 30%;position: relative}}>
                        <div className="circle-avatar" style={{background-image:url(/dist/assets/img/MyImage.jpg)}}></div>
                      </div>

                      <div className="box">
                        <h2>About Me</h2>
                        <p>I am passionate programmer with good experience in building various application both enterprise level and small scale. I mainly work on Microsoft Technologies but never confined to them. I also work on various open source technologies like Node.js, Python.
                        I mainly work on end-end application development which includes writing application logic in front end using technologies like Angular.js, Jquery. Building UI screens with technologies like Bootstrap, Jquery UI.
                        Building business logic and server side coding using various technologies like ASP.NET, MVC, Python, Node.js
                        Implementing service in Soap based services, Com+ components, WCF, WebApi, Restful services, Python Flask.
                        Proficient in databases like Microsoft Sql Server and having knowledge on NoSql Databases like Couchbase.

                        Apart from technology i like to travel. I visited many places in India and can help people choosing travel destinations. 
                        </p>
                      </div>
                      <div className="box">
                        <h2>About This Blog</h2>
                        <p>As a developer with 6+ years of experience in the industry, in the past I used to work predominantly on Microsoft Technologies. But since a year and a half , I am concentrating and working on other major technologies like Python, Node.js, AngularJs, ReactJs, Docker, Java, Bootstrap, Apache Spark and many open stack technologies. And of course my favourite Microsoft Stack 
                        </p>
                        <p>So you can expect posts from me on these technologies regularly.</p>
                        <p>I have decided to build a blog of my own from scratch with technologies that i work and learn. I started coding using open source technologies like <b>Python, Flask Framework, MySQL, Bootstrap,Jquery,JavaScript</b>. I bought a Ubuntu server on Vultr.com 
                        <a href="https://www.vultr.com/?ref=6998467-3B"><img src="https://www.vultr.com/media/banner_1.png" width="100%" height="90"></a> and I am deploying my blog on this Ubuntu machine using Docker containers.</p>
                        <p>Outcome of the above process is my new blog <a href="http://xyzcoder.com">http://xyzcoder.com</a> and you can expect me to post about all my learnings in this journery</p>
                        <p>So all you need to do is <a className="subscribe" href="#">subscribe</a> to my new blog and I am pretty sure that together we all will learn good things.</p>

                  <p>Happy Learning :)</p>
                      </div>
                      <!-- EDUCATION -->
                      <div className="box">
                        <h2>Education</h2>
                        <ul id="education" className="clearfix">
                          <li>
                            <div className="year pull-left">2006 - 2010</div>
                            <div className="description pull-right">
                              <h3>B.Tech Information Technology</h3>
                              <p>I graduated from Jawaharlal Nehru Technical University in the stream of Information Technology.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <!-- EXPERIENCES -->
                      <div className="box">
                        <h2>Experiences</h2>
                        <div className="job clearfix">
                          <div className="col-xs-3">
                            <div className="where">XyzCoder.com</div>
                            <div className="year">2016</div>
                          </div>
                          <div className="col-xs-9">
                            <div className="profession">End to End Developer</div>
                            <div className="description">This is the website that i built, deployed, maintain.
                            </div>
                          </div>
                        </div>
                        <div className="job clearfix">
                          <div className="col-xs-3">
                            <div className="where">Sails Software Solutions</div>
                            <div className="year">2016</div>
                          </div>
                          <div className="col-xs-9">
                            <div className="profession">Senior Application Developer</div>
                            <div className="description">This is the startup where we are built a HR based product. As a software engineer i'll be working on technologies like WebApi for building services and Python for BigData tasks. For searching our huge resume database we are using Elastic search. 
                            </div>
                          </div>
                        </div>
                        <div className="job clearfix">
                          <div className="col-xs-3">
                            <div className="where">United Health Group</div>
                            <div className="year">2015 - 2016</div>
                          </div>
                          <div className="col-xs-9">
                            <div className="profession">.Net Developer</div>
                            <div className="description">Knowledge Components is a proprietary product of UHG which consists of various modules like Reimbursment, Search and mapping ICD9, ICD10 code, adding patient demographics. This is used by doctors in United States to 
                            search for ICD9, ICD10 codes and then initialize the claim process.
                            </div>
                          </div>
                        </div>
                        <div className="job clearfix">
                          <div className="col-xs-3">
                            <div className="where">IBM India Pvt Ltd (IBM Software Labs)</div>
                            <div className="year">2010 - 2015</div>
                          </div>
                          <div className="col-xs-9">
                            <div className="profession">.Net Developer</div>
                            <div className="description">As a developer at Kenexa(IBM), I worked in various areas like 
                              Application development, 
                              Application maintainace, 
                              Migration of code from VB.Net to C#,
                              Implementing client requirements after analyzing them.

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-5">
                      <!-- CONTACT -->
                      <div className="box clearfix">
                        <h2>Contact</h2>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-phone fa-fw"></span></div>
                          <div className="title only pull-right">+91 9030401024</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-envelope fa-fw"></span></div>
                          <div className="title only pull-right">pavan.aryasomayajulu@gmail.com , xyzcoder1989@gmail.com</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-facebook fa-fw"></span></div>
                          <div className="title pull-right">Facebook</div>
                          <div className="description pull-right">https://www.facebook.com/xyzcoder</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-facebook fa-fw"></span></div>
                          <div className="title pull-right">Facebook</div>
                          <div className="description pull-right">https://www.facebook.com/paryasomayajulu</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-skype fa-fw"></span></div>
                          <div className="title pull-right">Skype</div>
                          <div className="description pull-right">paryasomayajulu</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-linkedin fa-fw"></span></div>
                          <div className="title pull-right">LinkedIn</div>
                          <div className="description pull-right">https://in.linkedin.com/in/pavankumararya</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-github fa-fw"></span></div>
                          <div className="title pull-right">Github</div>
                          <div className="description pull-right">https://github.com/paryasomayajulu</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-stack-overflow fa-fw"></span></div>
                          <div className="title pull-right">Stackoverflow</div>
                          <div className="description pull-right">http://stackoverflow.com/users/1415739/pavan-kumar-aryasomayajulu</div>
                        </div>
                        <div className="contact-item">
                          <div className="icon pull-left text-center"><span className="fa fa-wordpress fa-fw"></span></div>
                          <div className="title pull-right">Tech Blog(Old)</div>
                          <div className="description pull-right">http://pavanarya.wordpress.com</div>
                        </div>
                      </div>
                      <!-- SKILLS -->
                      <div className="box">
                        <h2>Skills</h2>
                          <div className="skills">
                          <div className="item-skills" data-percent="1.00">C#</div>
                          <div className="item-skills" data-percent="1.00">ASP.NET</div>
                          <div className="item-skills" data-percent="1.00">MVC</div>
                          <div className="item-skills" data-percent="1.00">WCF</div>
                          <div className="item-skills" data-percent="1.00">WEBApi</div>
                          <div className="item-skills" data-percent="1.00">Entity Framework</div>
                          <div className="item-skills" data-percent="1.00">RestFul Services</div>
                          <div className="item-skills" data-percent="1.00">HTML</div>
                          <div className="item-skills" data-percent="1.00">CSS</div>
                          <div className="item-skills" data-percent="1.00">jQuery</div>
                          <div className="item-skills" data-percent="0.90">SQL Server</div>
                          <div className="item-skills" data-percent="0.80">Javascript</div>
                          <div className="item-skills" data-percent="0.80">Bootstrap</div>
                          <div className="item-skills" data-percent="0.80">AngularJs</div>
                          <div className="item-skills" data-percent="0.70">Node.Js</div>
                          <div className="item-skills" data-percent="0.80">Python</div>
                          <div className="item-skills" data-percent="0.60">MySql</div>
                          <div className="item-skills" data-percent="0.50">Web Scrapping</div>
                          <div className="item-skills" data-percent="0.30">Phonegap</div>
                          <div className="item-skills" data-percent="0.30">Apache Spark</div>
                          <div className="skills-legend clearfix">
                            <div className="legend-left legend">Beginner</div>
                            <div className="legend-left legend"><span>Proficient</span></div>
                            <div className="legend-right legend"><span>Expert</span></div>
                          </div>
                        </div>
                      </div>
                      <!-- LANGUAGES -->
                      <div className="box">
                        <h2>Languages</h2>
                        <div id="language-skills">
                          <div className="skill">English <div className="icons pull-right"><div style={{width: 60%;}} className="icons-red"></div></div></div>
                          <div className="skill">Telugu <div className="icons pull-right"><div style={{width: 80%;}}  className="icons-red"></div></div></div>
                          <div className="skill">Hindi <div className="icons pull-right"><div style={{width: 60%;}}  className="icons-red"></div></div></div>
                        </div>
                      </div>
                      <!-- HOBBIES -->
                      <div className="box">
                        <h2>Hobbies</h2>
                        <div className="hobby">Programming</div>
                        <div className="hobby">Movies</div>
                        <div className="hobby">Travelling</div>
                      </div>

                      <GoogleAd client="ca-pub-3300393120826046" slot="3501157019" format="auto" wrapperDivStyle={ad_style} />
                    </div>
                  </div>
          <Footer />
      </div>
    );
  }
}

export default Layout;
