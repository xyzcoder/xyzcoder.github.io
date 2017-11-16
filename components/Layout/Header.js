/**
 * xyzcoder.github.io
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
import fire from './fire';
import firebase from 'firebase'

import backgroundimage from '../../assets/img/home-bg.jpg';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        loggedInuserEmail : ""
      }

      this.logout = this.logout.bind(this);
      this.signin = this.signin.bind(this);
  };

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }
  componentWillMount(){

    for (var key in localStorage){
       if(key.indexOf("authUser")>0){
          this.setState({
              loggedInuserEmail : JSON.parse(localStorage[key]).email
          });
       }
    }
    
  }

  componentDidUpdate(){

  }

  logout(){
    var that = this;
        firebase.auth().signOut().then(function() {

            for (var key in localStorage){
               if(key.indexOf("authUser")>0){
                  localStorage.removeItem(key);
               }
            }

            that.setState({
                loggedInuserEmail : ""
            });
        }).catch(function(error) {
          // An error happened.
        });
  }

  loginButton(){
        var loginButton;

        if(this.state.loggedInuserEmail && this.state.loggedInuserEmail!=""){
          loginButton = [<li><a href="#" onClick={this.logout}>Logout</a></li>,<li><a href="/admin">Admin</a></li>]
        }
        else{
          loginButton = <li><a href="#" onClick={this.signin}>Login</a></li>
        }

        return loginButton;
  }

  signin(){
    var that = this;
    var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        that.setState({
              loggedInuserEmail : user.email
          });
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
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
                     <a href="/">Home</a>
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
                    {this.loginButton()}
                  
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
                     <span className="subheading">Contact Me - pavan.aryasomayajulu@gmail.com</span>
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
