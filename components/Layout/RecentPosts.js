
import React from 'react';
import cx from 'classnames';

class RecentPosts extends React.Component {

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  render() {
    return (
      <div>
        <div className="brand">Recent Posts</div>
        <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>
                      
        <div className="menu-list">
            <ul id="menu-content" className="menu-content collapse out">
              <li>
                  <a href="/post/">Test1</a>
                  <a href="/post/">Test2</a>
              </li>
            </ul>
        </div>
      </div>
    );
  }
}

export default RecentPosts;
