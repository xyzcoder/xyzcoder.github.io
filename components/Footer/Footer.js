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
import Link from '../Link';
import SocialMediaList from '../Layout/SocialMediaList'

function Footer() {
  return (
        <footer>
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <SocialMediaList />
                    <p className="copyright text-muted">Copyright &copy; XyzCoder.github.io 2016</p>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    googleAdsenseAdUnit_3.html
                </div>
            </div>
        </div>
    </footer>
  );
}

export default Footer;
