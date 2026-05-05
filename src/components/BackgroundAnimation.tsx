import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Orb = ({ color, size, delay, duration }: { color: string, size: number, delay: number, duration: number }) => {
  const translateX = useSharedValue(Math.random() * width);
  const translateY = useSharedValue(Math.random() * height);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(Math.random() * width, { duration: duration * 1.5, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(Math.random() * height, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.5, { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: duration / 2 }),
        withTiming(0.1, { duration: duration / 2 })
      ),
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
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.orb, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, animatedStyle]} />
  );
};

export default function BackgroundAnimation() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#050510', '#0a0a20']}
        style={StyleSheet.absoluteFill}
      />
      <Orb color="#4f46e5" size={width * 0.8} delay={0} duration={8000} />
      <Orb color="#7c3aed" size={width * 0.6} delay={1000} duration={10000} />
      <Orb color="#2563eb" size={width * 0.7} delay={2000} duration={12000} />
      <Orb color="#db2777" size={width * 0.5} delay={3000} duration={9000} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  orb: {
    position: 'absolute',
    top: -width * 0.4,
    left: -width * 0.4,
  },
});
