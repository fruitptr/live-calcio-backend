import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ]),
      {
        iterations: 2
      }
    ).start();

    const timeout = setTimeout(() => {
      router.push('./auth/Login');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <ImageBackground
        source={require('./../assets/bgImageStarter.jpg')}
        style={styles.backgroundImage}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundImage: {
    width: '100%',
    height: '100%'
  }
});

export default SplashScreen;
