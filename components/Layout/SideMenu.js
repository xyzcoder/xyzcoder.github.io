
import React, { PropTypes } from 'react';
import cx from 'classnames';
import SocialMediaList from './SocialMediaList';
import FacebookPage from './FacebookPage';
import RecentPosts from './RecentPosts';
import GoogleAd from './GoogleAd';

class SideMenu extends React.Component {

  componentDidMount() {
    console.log("sidemenu component loaded");
    
  }

  componentWillUnmount() {
    
  }

  render() {

    const style = {
      marginTop: '15px',
      marginBottom: '20px'
    };

    return (
      <div className="col-lg-3 col-md-10 sideMenuSocialMedia">
          <SocialMediaList />

          <div className="nav-side-menu col-lg-2 col-md-2">
              
              <RecentPosts />

              <br/>
              <GoogleAd client="ca-pub-3300393120826046" slot="3501157019" format="auto" wrapperDivStyle={style} />
              <br/>
              <br/>

              <FacebookPage />

          </div>
      </div>
    );
  }
}

export default SideMenu;
