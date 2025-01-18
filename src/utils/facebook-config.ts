const FB_APP_ID = '1602291440389010';

export const initFacebookSDK = () => {
  return new Promise<void>((resolve) => {
    // Load Facebook SDK
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FB_APP_ID,
        version: 'v18.0',
        xfbml: true,
        cookie: true
      });
      resolve();
    };
  });
};

export { FB_APP_ID };