import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LiquidBlob = ({ color, size, duration, xRange, yRange }: { color: string, size: number, duration: number, xRange: [number, number], yRange: [number, number] }) => {
  const translateX = useSharedValue(xRange[0]);
  const translateY = useSharedValue(yRange[0]);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(xRange[1], { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(yRange[1], { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.3, { duration: duration * 0.8, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[
      styles.blob, 
      { 
        backgroundColor: color, 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        top: -size / 4,
        left: -size / 4,
      }, 
      animatedStyle
    ]} />
  );
};

export default function BackgroundAnimation() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#020617', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Liquid Mesh Blobs */}
      <LiquidBlob 
        color="rgba(79, 70, 229, 0.3)" 
        size={width * 1.2} 
        duration={15000} 
        xRange={[-width * 0.2, width * 0.2]} 
        yRange={[-height * 0.1, height * 0.1]} 
      />
      <LiquidBlob 
        color="rgba(124, 58, 237, 0.25)" 
        size={width * 1.5} 
        duration={18000} 
        xRange={[width * 0.1, -width * 0.1]} 
        yRange={[height * 0.2, -height * 0.2]} 
      />
      <LiquidBlob 
        color="rgba(236, 72, 153, 0.15)" 
        size={width * 1.3} 
        duration={20000} 
        xRange={[-width * 0.3, width * 0.3]} 
        yRange={[-height * 0.2, height * 0.2]} 
      />
      
      {/* The Overlay gives it that deep, glassy look */}
      <View style={styles.glassOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  blob: {
    position: 'absolute',
    opacity: 0.4,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
});
