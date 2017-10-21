
import React, { PropTypes } from 'react';
import PostTitle from './PostTitle';
import PostDisplay from './PostDisplay';

class Post extends React.Component {

  componentDidMount() {
    console.log("sidemenu component loaded");
    
  }

  componentWillUnmount() {
    
  }

  render() {

    const displaystyle = {
      left: '2%'
    };

    const ad_unit_3 = {
      width: '100%',
      height: '90px'
    };

    return (
      <div className="col-lg-8 col-md-10" style={displaystyle}>
          <PostTitle />
          <PostDisplay />
          <GoogleAd client="ca-pub-3300393120826046" slot="7931356610" format="auto" wrapperDivStyle={ad_unit_3} />
      </div>
    );
  }
}

export default Post;
