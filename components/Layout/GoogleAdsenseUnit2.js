
import React from 'react';

class GoogleAdsenseUnit2 extends React.Component {

  componentDidMount() {
    (adsbygoogle = window.adsbygoogle || []).push({});
  }

  componentWillUnmount() {
    
  }

  render() {

    var divStyle = {
      display: 'inline-block',
      width: '100%',
      height: '280px'
    };
    return (
        <ins class="adsbygoogle" style={divStyle} data-ad-client="ca-pub-3300393120826046" data-ad-slot="3501157019">
        </ins>
    );
  }

}

export default GoogleAdsenseUnit2;
