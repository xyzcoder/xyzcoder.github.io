
import React, { PropTypes } from 'react';

class PostDisplay extends React.Component {

  componentDidMount() {
    console.log("sidemenu component loaded");
    
  }

  componentWillUnmount() {
    
  }

  render() {

    return (
      <div>
          <article>
              <div className="container-fluid">

                  <div className="row">
                      <div className="col-lg-12 col-md-10 ">
                          <div className="row">
                            <div className="col-lg-12 col-md-10 tags">
                                <h3>Tags:
                                      <button type="button" className="btn btn-primary tags">C#</button>
                                      <button type="button" className="btn btn-primary tags">JAVA</button>
                                </h3>
                            </div>
                          </div>
                          <div className="row">
                              <div className="col-lg-12 col-md-10 postData">
                              The topic of blogging seems to come up a lot in our social media training workshops. The benefits of a quality blog are obvious – fresh content is good for your readers and your rankings. Blogs are easy to set up and even easier to update. We often tell people that if they can use Microsoft Word… they can update a blog.
As easy as they are to set up, they can be difficult to maintain. A good blog is filled with relevant, timely content that is updated on a regular basis. New bloggers often start out with a bang but then fizzle out when they realize that creating content can be challenging.
Let’s look at a couple of good blogs and see how they keep the quality content flowing.
                              </div>
                          </div>
                      </div>

                      <div className="col-md-12">
                          <div className="addthis_inline_share_toolbox"></div>
                      </div>
                  </div>

              </div>
          </article>
      </div>
    );
  }
}

export default PostDisplay;
