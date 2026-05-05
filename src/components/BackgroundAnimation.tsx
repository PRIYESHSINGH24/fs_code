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

const AuroraStreak = ({ color, top, left, duration, delay }: { color: string, top: number, left: number, duration: number, delay: number }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: duration * 2, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withRepeat(
      withTiming(1.4, { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.3, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[
      styles.streak, 
      { 
        backgroundColor: color, 
        top: top, 
        left: left,
        width: width * 1.5,
        height: height * 0.4,
      }, 
      animatedStyle
    ]} />
  );
};

export default function BackgroundAnimation() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#020617', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Aurora Streaks */}
      <AuroraStreak color="#3b82f6" top={-height * 0.2} left={-width * 0.5} duration={15000} delay={0} />
      <AuroraStreak color="#8b5cf6" top={height * 0.3} left={-width * 0.2} duration={20000} delay={1000} />
      <AuroraStreak color="#ec4899" top={height * 0.6} left={-width * 0.6} duration={18000} delay={2000} />
      <AuroraStreak color="#06b6d4" top={-height * 0.1} left={width * 0.1} duration={22000} delay={3000} />

      {/* Grainy Overlay for texture */}
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  streak: {
    position: 'absolute',
    borderRadius: width,
    filter: 'blur(80px)', // Note: standard blur in CSS/Web, in RN we use blurRadius or just rely on overlap
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  }
});
