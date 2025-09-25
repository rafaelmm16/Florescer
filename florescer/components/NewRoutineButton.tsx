// florescer/components/NewRoutineButton.tsx
import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

// --- SVG Icons ---
const PlusIcon = () => (
  <SvgXml
    width={32}
    height={32}
    xml={`<svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H12V19H11V13H5V12H11V6H12V12H19V13Z"/></svg>`}
  />
);

const CheckIcon = () => (
  <SvgXml
    width={32}
    height={32}
    xml={`<svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 19l-7-7 1.41-1.41L9 16.17l11.29-11.3L22 6l-13 13z"/></svg>`}
  />
);
// --- End of SVG Icons ---


export default function NewRoutineButton() {
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animate the flip
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
        // Navigate after the flip
        router.push('/new');
        // Reset animation after a delay
        setTimeout(() => animatedValue.setValue(0), 500);
    });
  };
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };
  const containerAnimatedStyle = { transform: [{ scale: scaleValue }] };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.container}
    >
      <Animated.View style={[styles.flipContainer, containerAnimatedStyle]}>
        <Animated.View style={[styles.flipper, styles.front, frontAnimatedStyle]}>
          <LinearGradient colors={['#ff6347', '#f76c6c']} style={styles.gradient}>
            <PlusIcon />
          </LinearGradient>
        </Animated.View>
        <Animated.View style={[styles.flipper, styles.back, backAnimatedStyle]}>
          <LinearGradient colors={['#36b54a', '#00c1d4']} style={styles.gradient}>
            <CheckIcon />
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
  flipContainer: {
    width: 60,
    height: 60,
  },
  flipper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 12,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  front: {
    // Initially visible
  },
  back: {
    // Initially hidden
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});