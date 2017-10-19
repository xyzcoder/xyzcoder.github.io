/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Navigation from './Navigation';
import Link from '../Link';
import s from './Header.css';

import backgroundimage from '../../assets/img/home-bg.jpg';

class Header extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {

    return (

      <div>
        <nav className="navbar navbar-default navbar-custom navbar-fixed-top">
         <div className="container-fluid">
            <div className="navbar-header page-scroll">
               <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
               <span className="sr-only">Toggle navigation</span>
               Menu <i className="fa fa-bars"></i>
               </button>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
               <ul className="nav navbar-nav navbar-right">
                  <li>
                     <a href="/index">Home</a>
                  </li>
                  <li>
                     <a href="/about">About</a>
                  </li>
                  <li>
                     <a href="/postslist">Posts</a>
                  </li>
                  <li>
                     <a className="subscribe" href="#">Subscribe</a>
                  </li>
                  <li>
                     <a href="/privacypolicy">Privacy Policy</a>
                  </li>
               </ul>
            </div>
         </div>
      </nav>

      <header className="intro-header" style={{ backgroundImage: `url(${backgroundimage})` }}>
         <div className="container">
            <div className="row">
               <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                  <div className="site-heading">
                     <span className="subheading">Collection of my learnings - Pavan Kumar Aryasomayajulu</span>
                     <span className="subheading">Contact Me - pavan.aryasomayajulugmail.com</span>
                  </div>
               </div>
            </div>
         </div>
      </header>
      </div>

    );
  }

}

export default Header;
