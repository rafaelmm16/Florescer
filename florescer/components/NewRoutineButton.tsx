import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './ThemeContext';

const PlusIcon = () => (
  <SvgXml
    width={28}
    height={28}
    xml={`<svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>`}
  />
);

export default function NewRoutineButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    router.push('/new');
  };
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const containerAnimatedStyle = { transform: [{ scale: scaleValue }] };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={styles.container}
    >
      <Animated.View style={[styles.buttonContainer, containerAnimatedStyle, { shadowColor: theme.colors.primary }]}>
        <LinearGradient 
          colors={[theme.colors.primary, theme.colors.primaryContainer]} 
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        >
          <PlusIcon />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 90,
  },
  buttonContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});