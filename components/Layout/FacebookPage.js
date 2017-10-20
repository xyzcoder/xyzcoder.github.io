
import React from 'react';
import cx from 'classnames';


class FacebookPage extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    return (
      <div className="fb-page" data-href="https://www.facebook.com/paryasomayajulu/" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
          <blockquote cite="https://www.facebook.com/paryasomayajulu/" className="fb-xfbml-parse-ignore">
              <a href="https://www.facebook.com/paryasomayajulu/">xyzcoder.github.io</a>
          </blockquote>
      </div>
    );
  }
}

export default FacebookPage;
