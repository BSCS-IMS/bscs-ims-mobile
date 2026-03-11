import React, { useEffect, useRef } from 'react';
import { Text, Image, StyleSheet, Animated, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => { });

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.delay(800 - delay),
        ])
      );

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 267);
    const a3 = pulse(dot3, 534);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.dotsContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { opacity: dot }]}
        />
      ))}
    </View>
  );
}

export default function AppSplashScreen({ onFinish }) {

  const screenOpacity = useRef(new Animated.Value(1)).current;

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => { });

    Animated.sequence([

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.delay(2200),
    ]).start(() => {

      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          marginBottom: 20,
        }}
      >
        <Image
          source={require('../assets/LOGO_CLEAR.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslateY }],
          alignItems: 'center',
        }}
      >
        <Animated.Text style={styles.text}>MURANG BIGAS</Animated.Text>
        <Animated.Text style={styles.subtitle}>Livelihood</Animated.Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={{ opacity: dotsOpacity, marginTop: 32 }}>
        <LoadingDots />
      </Animated.View>

      {/* Copyright */}
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} All Rights Reserved.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  logo: {
    width: 150,
    height: 150,
  },
  text: {
    color: '#1F384C',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1F384C',
  },
  copyright: {
    position: 'absolute',
    bottom: 30,
    color: '#64748B',
    fontSize: 12,
  },
});
