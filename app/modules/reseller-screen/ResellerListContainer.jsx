import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ResellerCard from './ResellerCard';

const COLORS = {
  primary: '#2C5282',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const ResellerCardSkeleton = () => (
  <View
    className="bg-white rounded-xl p-3 mb-4 shadow-sm"
    style={{
      width: (SCREEN_WIDTH / 2) - 24,
      marginLeft: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}
  >
    {/* Image placeholder */}
    <View className="w-full h-32 bg-gray-200 rounded-lg mb-3" />
    {/* Text placeholders */}
    <View className="h-4 bg-gray-200 rounded mb-1 w-3/4" />
    <View className="h-4 bg-gray-200 rounded mb-1 w-1/2" />
    <View className="h-4 bg-gray-200 rounded mb-1 w-2/3" />
    <View className="h-4 bg-gray-200 rounded w-1/4" />
  </View>
);

export default function ResellerListContainer({ loading, error, filteredData, loadResellers }) {
  const renderItem = ({ item }) => <ResellerCard item={item} />;

  return (
    <View className="flex-1 bg-white rounded-t-[30px] pt-6 overflow-hidden">
      <Text className="text-xl font-bold px-5 mb-4" style={{ fontFamily: 'Inter' }}>
        Seller
      </Text>

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]} // Dummy data for 4 skeleton cards
          renderItem={() => <ResellerCardSkeleton />}
          keyExtractor={(item) => item.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 40, paddingRight: 16 }}
          showsVerticalScrollIndicator={false}
        />
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
