import React from 'react';
import AdSense from 'react-adsense';

const YourComponent = () => {
  return (
    <div>
      {/* Your other content */}
      <AdSense.Google
        client='your-ad-client-id'
        slot='your-ad-slot-id'
        format='auto'
      />
    </div>
  );
};

export default YourComponent;
