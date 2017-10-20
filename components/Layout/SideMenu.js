
import React from 'react';
import cx from 'classnames';
import SocialMediaList from './SocialMediaList';
import FacebookPage from './FacebookPage';
import RecentPosts from './RecentPosts';
import GoogleAdsenseUnit2 from './GoogleAdsenseUnit2';

class SideMenu extends React.Component {

  componentDidMount() {
    console.log("sidemenu component loaded");
    
  }

  componentWillUnmount() {
    
  }

  render() {
    return (
      <div className="col-lg-2 col-md-10 sideMenuSocialMedia">
          <SocialMediaList />

          <div className="nav-side-menu col-lg-2 col-md-2">
              
              <RecentPosts />

              <br/>
              <GoogleAdsenseUnit2 />
              <br/>
              <br/>

              <FacebookPage />

          </div>
      </div>
    );
  }
}

export default SideMenu;
