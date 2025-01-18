const FB_APP_ID = '1602291440389010';

export const initFacebookSDK = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Wait for FB SDK to be loaded
      if (window.FB) {
        window.FB.init({
          appId: FB_APP_ID,
          version: 'v18.0',
          xfbml: true,
          cookie: true,
          status: true // Enable status checking
        });
        resolve();
      } else {
        // If FB SDK is not loaded yet, wait for it
        window.fbAsyncInit = () => {
          window.FB?.init({
            appId: FB_APP_ID,
            version: 'v18.0',
            xfbml: true,
            cookie: true,
            status: true // Enable status checking
          });
          resolve();
        };
      }
    } catch (error) {
      console.error('Failed to initialize Facebook SDK:', error);
      reject(error);
    }
  });
};

export { FB_APP_ID };