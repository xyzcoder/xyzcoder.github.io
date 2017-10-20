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

class CustomSearch extends React.Component {

  componentDidMount() {

    const embedcode = `<script>
                    (function() {
                      var cx = '012995809310011669402:cqc1yd_gv8y';
                      var gcse = document.createElement('script');
                      gcse.type = 'text/javascript';
                      gcse.async = true;
                      gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;

                      var s = document.getElementsByTagName('script')[0];
                      s.parentNode.insertBefore(gcse, s);

                    })();
                  </script>
                  <gcse:search></gcse:search>`
    $('#gsearch').html(embedcode);
    
  }

  componentWillUnmount() {
    
  }

  render() {

    return (
        <div class="row">
          <div class="col-lg-3 col-lg-offset-9 col-md-10 col-md-offset-1">
                <div id='gsearch'>
                </div>
          </div>
        </div>
    );
  }

}

export default CustomSearch;
