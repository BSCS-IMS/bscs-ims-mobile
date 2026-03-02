import React from 'react';
import { View, TouchableOpacity, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MenuItem from './MenuItem';

const COLORS = {
  primary: '#1E40AF',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

export default function SideMenu({ menuOpen, setMenuOpen, slideAnim, fadeAnim, scaleAnim }) {
  const router = useRouter();

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-row" pointerEvents={menuOpen ? 'auto' : 'none'}>
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }}
      >
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View className="w-full h-full" />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
          width: MENU_WIDTH,
          backgroundColor: '#F8FAFC',
        }}
        className="absolute right-0 top-0 bottom-0 shadow-2xl pt-12 border-l border-gray-200"
      >
        <View className="items-end px-6 mb-8">
          <TouchableOpacity onPress={() => setMenuOpen(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View className="w-full">
          <MenuItem
            icon="home"
            label="HOME"
            onPress={() => { setMenuOpen(false); router.replace('/'); }}
          />
          <MenuItem
            icon="person"
            label="SELLER"
            onPress={() => { setMenuOpen(false); router.replace('/screens/ResellerScreen'); }}
          />
          <MenuItem
            icon="notifications"
            label="NOTIFICATION"
            onPress={() => { setMenuOpen(false); router.replace('/screens/notifications'); }}
          />
        </View>
      </Animated.View>
    </View>
  );
}
