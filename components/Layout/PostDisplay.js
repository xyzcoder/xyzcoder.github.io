
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
                               <div dangerouslySetInnerHTML={{ __html: this.props.post.content }} />
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
