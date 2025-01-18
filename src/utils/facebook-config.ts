// The app ID is already configured in the project
export const FACEBOOK_APP_ID = '1602291440389010';

export const initFacebookSDK = () => {
  return new Promise<void>((resolve) => {
    // Add Facebook SDK
    if ((window as any).FB) {
      resolve();
      return;
    }

    // Load the SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    document.head.appendChild(script);
  });
};