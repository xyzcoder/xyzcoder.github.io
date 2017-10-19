
import React, { PropTypes } from 'react';
import cx from 'classnames';
import SocialMediaList from '../SocialMediaList'


class SideMenu extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    return (
      <div class="col-lg-2 col-md-10 sideMenuSocialMedia">
              <SocialMediaList />
      </div>
    );
  }
}

export default SideMenu;
