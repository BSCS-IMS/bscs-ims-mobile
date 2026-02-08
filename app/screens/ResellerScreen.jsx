import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#1E40AF',
  background: '#F1F2F7',
  black: '#000000',
  white: '#FFFFFF',
  grayText: '#6B7280',
  border: '#E5E7EB',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

const INITIAL_DATA = Array.from({ length: 8 }).map((_, i) => ({
  id: i.toString(),
  name: 'Name Sample',
  productCount: Math.floor(Math.random() * 50) + 5,
}));

export default function ResellerScreen() {
  const router = useRouter();

  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  const [asc, setAsc] = useState(true);

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  const filteredData = useMemo(() => {
    let result = [...data].filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'Name') {
        return asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return asc ? a.productCount - b.productCount : b.productCount - a.productCount;
      }
    });

    return result;
  }, [data, search, sortBy, asc]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: menuOpen ? 0 : SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: menuOpen ? 1 : 0.96,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [menuOpen]);

  const renderItem = ({ item }) => (
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
      <View className="w-full h-32 bg-gray-100 rounded-lg mb-3 border border-gray-100" />
      <Text
        className="font-bold text-base mb-1"
        style={{ color: COLORS.primary, fontFamily: 'Inter' }}
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text
        className="text-xs text-gray-500"
        style={{ fontFamily: 'Inter' }}
      >
        Products: {item.productCount} of prod
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      <View className="flex-1 px-0">
        <View className="px-5 pb-4">
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

        <View className="flex-1 bg-white rounded-t-[30px] pt-6 overflow-hidden">
          <Text className="text-xl font-bold px-5 mb-4" style={{ fontFamily: 'Inter' }}>
            Seller
          </Text>

          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 40, paddingRight: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

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
              <TouchableOpacity onPress={() => setMenuOpen(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
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
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }) {
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