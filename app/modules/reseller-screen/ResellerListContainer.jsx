import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ResellerCard from './ResellerCard';

const COLORS = {
  primary: '#2C5282',
};

export default function ResellerListContainer({ loading, error, filteredData, loadResellers }) {
  const renderItem = ({ item }) => <ResellerCard item={item} />;

  return (
    <View className="flex-1 bg-white rounded-t-[30px] pt-6 overflow-hidden">
      <Text className="text-xl font-bold px-5 mb-4" style={{ fontFamily: 'Inter' }}>
        Seller
      </Text>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-4 text-gray-600" style={{ fontFamily: 'Inter' }}>
            Loading resellers...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-5">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
          <Text className="mt-4 text-center text-red-600 font-semibold" style={{ fontFamily: 'Inter' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadResellers}
            className="mt-6 px-6 py-3 rounded-lg"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="text-white font-semibold" style={{ fontFamily: 'Inter' }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : filteredData.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <MaterialCommunityIcons name="inbox-outline" size={48} color="#9CA3AF" />
          <Text className="mt-4 text-gray-600" style={{ fontFamily: 'Inter' }}>
            No resellers found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 40, paddingRight: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
