import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#1F384C',
};

export default function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 px-6 border-b border-gray-200 bg-[#E0E7FF] mb-[1px] w-full"
    >
      <View className="w-8 items-center justify-center mr-2">
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <Text
        className="font-bold text-sm"
        style={{ color: COLORS.primary, fontFamily: 'Inter', flex: 1 }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
