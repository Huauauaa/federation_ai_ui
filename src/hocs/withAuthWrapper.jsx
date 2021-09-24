import React from 'react';
import '../assets/styles/auth-wrapper.less';
import authBanner from '../assets/images/auth-banner.jpg';

export default function withAuthWrapper(WrappedComponent) {
  const WithWrapper = (props) => {
    return (
      <div className="auth-wrapper">
        <div className="main">
          <img src={authBanner} className="banner" alt="auth banner" />
          <div className="wrapped-component">
            <WrappedComponent {...props} />
          </div>
        </div>
      </div>
    );
  };

  const wrappedComponentName = WrappedComponent.name || 'Component';

  WithWrapper.displayName = `withAuthWrapper(${wrappedComponentName})`;
  return WithWrapper;
}
