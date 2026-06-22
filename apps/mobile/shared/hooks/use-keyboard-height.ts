import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, type KeyboardEvent, Platform } from 'react-native';

// Pixels the on-screen keyboard overlaps the bottom of the screen (0 when
// hidden). Measured as `screenHeight − keyboard top` (endCoordinates.screenY)
// rather than reading endCoordinates.height directly: the reported height is
// inconsistent across platforms about whether it includes the navigation bar
// (Android edge-to-edge) or the home indicator (iOS), whereas the keyboard's
// top edge is unambiguous. A full-screen sheet pads its bottom by this to sit
// the composer exactly on top of the keyboard — no per-device fudge factor.
export function useKeyboardHeight(): number {
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const onShow = (event: KeyboardEvent) => {
      const screenHeight = Dimensions.get('screen').height;
      setOverlap(Math.max(0, screenHeight - event.endCoordinates.screenY));
    };
    const onHide = () => setOverlap(0);

    // iOS gets the smoother will* events; Android only fires did*.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, onShow);
    const hide = Keyboard.addListener(hideEvent, onHide);
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return overlap;
}
