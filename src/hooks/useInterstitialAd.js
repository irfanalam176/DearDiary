import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import AdContext from './context/context';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';

export default function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false);
  const [interstitial, setInterstitial] = useState(null);
  const onAdClosedRef = useRef(null);
  const { incrementSaveCount, shouldShowAd } = useContext(AdContext); // ✅ Use context functions

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const onLoad = ad.addAdEventListener(AdEventType.LOADED, () => setLoaded(true));
    const onClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      ad.load();
      if (onAdClosedRef.current) onAdClosedRef.current();
    });
    const onError = ad.addAdEventListener(AdEventType.ERROR, error => {
      console.log('Interstitial ad error:', error);
      setLoaded(false);
      if (onAdClosedRef.current) onAdClosedRef.current();
    });

    ad.load();
    setInterstitial(ad);

    return () => {
      onLoad();
      onClose();
      onError();
    };
  }, []);

  const showAd = useCallback(
    (onClose) => {
      onAdClosedRef.current = onClose;
      incrementSaveCount(); // ✅ Increment counter first
      
      if (shouldShowAd()) {
        if (loaded && interstitial) {
          interstitial.show();
        } else {
          console.log('Ad not ready, continuing without ad');
          if (onClose) onClose();
        }
      } else {
        if (onClose) onClose();
      }
    },
    [loaded, interstitial, incrementSaveCount, shouldShowAd]
  );

  return { loaded, showAd };
}