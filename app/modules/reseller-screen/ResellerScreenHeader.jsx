import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#1F384C',
};

export default function ResellerScreenHeader({ setMenuOpen, search, setSearch, filterOpen, setFilterOpen, sortBy, setSortBy, asc, setAsc }) {
  return (
    <View className="px-5 pb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6 pt-2">
        <View style={{ width: 28 }} />

        <View className="items-center">
          <View className="w-16 h-16 rounded-full items-center justify-center mb-1" style={{ backgroundColor: COLORS.primary }}>
            <Text className="text-white font-extrabold text-4xl" style={{ fontFamily: 'Inter' }}>M</Text>
          </View>
          <Text className="font-bold text-lg" style={{ color: COLORS.primary, fontFamily: 'Inter' }}>
            MURANG BIGAS
          </Text>
          <Text className="text-[10px] tracking-[4px] text-gray-500 uppercase" style={{ fontFamily: 'Inter' }}>
            Livelihood
          </Text>
        </View>

        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <MaterialCommunityIcons name="menu" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="bg-white rounded-full flex-row items-center px-4 py-3 shadow-sm border border-gray-200">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          className="flex-1 ml-2 text-base text-black"
          style={{ fontFamily: 'Inter' }}
        />
      </View>

      {/* Filter */}
      <View className="mt-4 z-20 relative">
        <View className="flex-row items-center">
          <Text className="mr-2 italic text-sm" style={{ color: COLORS.primary, fontFamily: 'Inter' }}>
            Filter by:
          </Text>
          <TouchableOpacity
            onPress={() => setFilterOpen(!filterOpen)}
            className="flex-row items-center bg-[#DBEAFE] px-3 py-1 rounded-full"
          >
            <Text className="font-semibold mr-1" style={{ color: COLORS.primary, fontFamily: 'Inter' }}>
              {sortBy} {asc ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
        </View>

        {filterOpen && (
          <View className="absolute top-8 left-16 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-40">
            <TouchableOpacity onPress={() => { setSortBy('Name'); setFilterOpen(false); }} className="py-2 px-2 border-b border-gray-100">
              <Text style={{ fontFamily: 'Inter' }}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortBy('Products'); setFilterOpen(false); }} className="py-2 px-2 border-b border-gray-100">
              <Text style={{ fontFamily: 'Inter' }}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setAsc(!asc); setFilterOpen(false); }} className="py-2 px-2">
              <Text style={{ fontFamily: 'Inter' }}>{asc ? 'Descending' : 'Ascending'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
