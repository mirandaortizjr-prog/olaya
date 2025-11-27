import { useState, useEffect } from 'react';

export interface PlatformInfo {
  isDespia: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
}

export const usePlatform = (): PlatformInfo => {
  const [platform, setPlatform] = useState<PlatformInfo>({
    isDespia: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isDespia = userAgent.includes('despia');
    const isIOS = isDespia && (userAgent.includes('iphone') || userAgent.includes('ipad'));
    const isAndroid = isDespia && userAgent.includes('android');
    
    setPlatform({
      isDespia,
      isIOS,
      isAndroid,
      isWeb: !isDespia,
    });
  }, []);

  return platform;
};
