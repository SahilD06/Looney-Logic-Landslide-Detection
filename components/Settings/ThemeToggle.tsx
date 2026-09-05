import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { Sun, Moon } from 'lucide-react-native';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  const progress = useSharedValue(isDark ? 1 : 0);
  const sunRotation = useSharedValue(0);
  const moonTilt = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, {
      duration: 400,
    });
  }, [isDark]);

  useEffect(() => {
    sunRotation.value = withRepeat(
      withTiming(360, {
        duration: 15000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    moonTilt.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1250, easing: Easing.linear }),
        withTiming(10, { duration: 2500, easing: Easing.linear }),
        withTiming(0, { duration: 1250, easing: Easing.linear })
      ),
      -1,
      false
    );
  }, []);

  const animatedBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#73C0FC', '#183153']
      ),
    };
  });

  const animatedThumb = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * 30 }],
    };
  });

  const animatedSun = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: sunRotation.value + 'deg' }],
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  const animatedMoon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: moonTilt.value + 'deg' }],
      opacity: progress.value,
    };
  });

  return (
    <Pressable onPress={onToggle}>
      <Animated.View style={[styles.switch, animatedBackground]}>
        <Animated.View style={[styles.sunContainer, animatedSun]}>
          <Sun fill="#FFD43B" color="#FFD43B" size={24} />
        </Animated.View>
        <Animated.View style={[styles.moonContainer, animatedMoon]}>
          <Moon fill="#73C0FC" color="#73C0FC" size={24} />
        </Animated.View>
        <Animated.View style={[styles.thumb, animatedThumb]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 64,
    height: 34,
    borderRadius: 30,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
    position: 'absolute',
    left: 2,
    zIndex: 2,
  },
  sunContainer: {
    position: 'absolute',
    right: 4,
    zIndex: 1,
  },
  moonContainer: {
    position: 'absolute',
    left: 5,
    zIndex: 1,
  },
});
