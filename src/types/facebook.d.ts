interface FacebookInitParams {
  appId: string;
  version: string;
  xfbml: boolean;
  cookie?: boolean;  // Added cookie as optional parameter
}

interface FacebookShareParams {
  method: string;
  href?: string;
  quote?: string;
}

interface Window {
  FB?: {
    init: (params: FacebookInitParams) => void;
    ui: (params: FacebookShareParams, callback?: (response: any) => void) => void;
  };
  fbAsyncInit?: () => void;
}