import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.75;
const LASER_HEIGHT = 2;

export default function ScanningOverlay() {
  const laserPosition = useSharedValue(0);

  useEffect(() => {
    laserPosition.value = withRepeat(
      withTiming(SCAN_FRAME_SIZE - LASER_HEIGHT, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [laserPosition]);

  const animatedLaserStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: laserPosition.value }],
    };
  });

  return (
    <View style={styles.overlayContainer}>
      {/* Top Overlay */}
      <View style={[styles.backdrop, { height: (height - SCAN_FRAME_SIZE) / 2 }]} />
      
      <View style={styles.middleRow}>
        {/* Left Overlay */}
        <View style={styles.backdrop} />
        
        {/* Transparent Scan Area */}
        <View style={styles.scanFrame}>
          {/* Frame Corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Animated Laser */}
          <Animated.View style={[styles.laser, animatedLaserStyle]} />
        </View>
        
        {/* Right Overlay */}
        <View style={styles.backdrop} />
      </View>
      
      {/* Bottom Overlay */}
      <View style={[styles.backdrop, { flex: 1 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 14, 0.65)',
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_FRAME_SIZE,
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 20,
  },
  laser: {
    width: '100%',
    height: LASER_HEIGHT,
    backgroundColor: COLORS.primaryLight,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
});
