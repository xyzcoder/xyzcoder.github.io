
import React, { PropTypes } from 'react';
import PostTitle from './PostTitle';
import PostDisplay from './PostDisplay';
import GoogleAd from './GoogleAd';
import fire from './fire';

class Post extends React.Component {

  constructor(props) {
      super(props);
      
      this.state = {
        "post":{
          "title":"",
          "content":"",
          "date":"",
          "id":"",
          "summary":""
        }
      }
   };

  componentDidMount() {
    console.log("sidemenu component loaded");
    
  }

  componentWillMount(){
      var that = this;
      let blogsRef;
      if(this.props.postId){
          blogsRef = fire.database().ref('blog/posts/published/'+this.props.postId);

          blogsRef.on('value', function(post) {
             that.setState({"post":post.val()})
          }, function (error) {
             console.log("Error: " + error.code);
          });
      }
      else{
          blogsRef = fire.database().ref('blog/posts/published').limitToFirst(1);

          blogsRef.on('value', function(post) {
             for (var key in post.val()) {
                  if (post.val().hasOwnProperty(key)) {
                      that.setState({"post":post.val()[key]}) ;
                  }
              }
          }, function (error) {
             console.log("Error: " + error.code);
          });
      }

      

      
  }

  componentWillUnmount() {
    
  }

  render() {

    const ad_unit_3 = {
      width: '100%',
      height: '90px'
    };

    return (
      <div className="col-lg-9 col-md-10">
          <PostTitle post={this.state.post}/>
          <PostDisplay post={this.state.post} />
          <GoogleAd client="ca-pub-3300393120826046" slot="7931356610" format="auto" wrapperDivStyle={ad_unit_3} />
      </div>
    );
  }
}

export default Post;
