
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
            <a href={'/post/' + this.props.post.id}>
                <h2 className="post-title">
                    {this.props.post.title}
                </h2>
            </a>
            <p className="post-meta">Posted by <a href="#">Pavan Kumar Aryasomayajulu</a> on {this.props.post.date}</p>
        </div>
    );
  }
}

export default PostTitle;
