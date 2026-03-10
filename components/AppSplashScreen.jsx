import React, { useEffect, useRef } from 'react';
import { Text, Image, StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync().catch(() => {

});

export default function AppSplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    SplashScreen.hideAsync().catch(() => { });


    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Image
        source={require('../assets/LOGO_CLEAR.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Murang Bigas</Text>
      <Text style={styles.copyright}>© {new Date().getFullYear()} All Rights Reserved.</Text>
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
    marginBottom: 20,
  },
  text: {
    color: '#1E40AF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  copyright: {
    position: 'absolute',
    bottom: 30,
    color: '#64748B',
    fontSize: 12,
  },
});
