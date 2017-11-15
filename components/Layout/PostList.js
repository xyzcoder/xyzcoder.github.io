/**
 * xyzcoder.github.io
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import fire from './fire';
import PostTitle from './PostTitle';

class PostList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        postTitles:[]
      }
  };

  componentDidMount() {
  }
  componentWillMount(){
    var that = this;
      let postTitles = fire.database().ref('blog/posttitles');

      postTitles.on('value', function(titles) {
         for (var key in titles.val()) {
              if (titles.val().hasOwnProperty(key)) {
                   that.setState({
                    postTitles: that.state.postTitles.concat([ {id:key,title:titles.val()[key].title,summary:titles.val()[key].summary}   ])
                  }) ;
              }
          }
      }, function (error) {
         console.log("Error: " + error.code);
      });

      
  }

  componentWillUnmount() {
    
  }

  render() {

    return (
        <div className="col-lg-9 col-md-10">

        <div className="menu-list">
            <div id="menu-content">

              {
                this.state.postTitles.map(function(title) {
                    return (
                      <div>
                        <div className="post-preview">
                          <a href={'/post/' + title.id}>
                              <h3>
                                  {title.title}
                              </h3>
                          </a>
                        </div>
                        <div className="row">
                              <div className="col-lg-12 col-md-10 postData">
                               <div dangerouslySetInnerHTML={{ __html: title.summary }} />
                              </div>
                          </div>
                      </div>
                    )
                })
              }

            </div>
        </div>

        </div>
    );
  }

}

export default PostList;
