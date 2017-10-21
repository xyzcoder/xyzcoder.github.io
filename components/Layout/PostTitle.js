
import React, { PropTypes } from 'react';

class PostTitle extends React.Component {

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
      <div className="post-preview">
            <a href="/post/">
                <h2 className="post-title">
                    Test Post
                </h2>
            </a>
            <p className="post-meta">Posted by <a href="#">Pavan Kumar Aryasomayajulu</a> on 10-2-2017 10:10:10</p>
        </div>
    );
  }
}

export default PostTitle;
