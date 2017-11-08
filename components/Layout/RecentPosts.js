
import React from 'react';
import cx from 'classnames';
import fire from './fire';

class RecentPosts extends React.Component {

  constructor(props) {
      super(props);
      
      this.state = {
        recentPosts:[]
      }
   };

  componentWillMount(){
      var that = this;
      let blogsRef = fire.database().ref('blog/posts/published').limitToFirst(10);
      blogsRef.on('value', function(post) {
         for (var key in post.val()) {
              if (post.val().hasOwnProperty(key)) {
                  that.setState({
                    recentPosts: that.state.recentPosts.concat([ {id:post.val()[key].id,title:post.val()[key].title}   ])
                  }) ;
              }
          }
      }, function (error) {
         console.log("Error: " + error.code);
      });
  }

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

              {
                this.state.recentPosts.map(function(post) {
                    return <li><a href={'/post/' + post.id} key={post.id}> {post.title}</a></li>
                })
              }

            </ul>
        </div>
      </div>
    );
  }
}

export default RecentPosts;
