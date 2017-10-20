
import React, { PropTypes } from 'react';
import cx from 'classnames';


class SocialMediaList extends React.Component {

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  render() {
    return (
      <ul className="list-inline text-center">
          <li>
              <a href="https://www.facebook.com/xyzcoder">
                  <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
                  </span>
              </a>
          </li>
          <li>
              <a href="https://www.facebook.com/paryasomayajulu">
                  <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
                  </span>
              </a>
          </li>
          <li>
              <a href="https://github.com/paryasomayajulu">
                  <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i className="fa fa-github fa-stack-1x fa-inverse"></i>
                  </span>
              </a>
          </li>
      </ul>
    );
  }
}

export default SocialMediaList;
