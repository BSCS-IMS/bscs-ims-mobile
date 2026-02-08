import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  SafeAreaView,
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StatusBar, 
  Animated,
  Image,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const ICONS = {
  'icon-home.png': require('../../assets/icon-home.png'),
  'icon-seller.png': require('../../assets/icon-seller.png'),
  'icon-notif.png': require('../../assets/icon-notif.png'),
};

if (Text && Text.defaultProps == null) Text.defaultProps = {};
if (Text) Text.defaultProps.style = { ...(Text.defaultProps.style || {}), fontFamily: 'Inter' };
if (TextInput && TextInput.defaultProps == null) TextInput.defaultProps = {};
if (TextInput) TextInput.defaultProps.style = { ...(TextInput.defaultProps.style || {}), fontFamily: 'Inter' };

export default function ResellerScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const auth = getAuth();
  const firestore = getFirestore();
  const database = getDatabase();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  const [asc, setAsc] = useState(true);

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;

  const MENU_WIDTH = isSmallScreen ? 240 : isMediumScreen ? 260 : 280;
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  const numColumns = isSmallScreen ? 2 : 3;
  const cardWidth = ((width - 24) / numColumns) - 6;
  const cardHeight = isSmallScreen ? 160 : isMediumScreen ? 180 : 200;

  const logoSize = isSmallScreen ? 44 : 56;
  const menuIconSize = isSmallScreen ? 24 : 28;
  const searchIconSize = isSmallScreen ? 18 : 20;

  const FONT_SIZES = {
    header: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
    caption: isSmallScreen ? 9 : 11,
    input: isSmallScreen ? 13 : 14,
    label: isSmallScreen ? 12 : 14,
    button: isSmallScreen ? 12 : 14,
    option: isSmallScreen ? 12 : 14,
    itemTitle: isSmallScreen ? 10 : 12,
    itemMeta: isSmallScreen ? 8 : 10,
    menuItem: isSmallScreen ? 12 : 14,
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 0 : 1000,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const sampleData = useMemo(() => (
    Array.from({ length: 1 }).map((_, i) => ({
      id: i.toString(),
      name: `Sample Name`,
      products: Math.floor(Math.random() * 20),
    }))
  ), []);

  const filtered = useMemo(() => {
    let data = sampleData.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
    data.sort((a, b) =>
      sortBy === 'Name'
        ? (asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
        : (asc ? a.products - b.products : b.products - a.products)
    );
    return data;
  }, [search, sortBy, asc, sampleData]);

  const onMenuPress = (key) => {
    setMenuOpen(false);
    if (key === 'HOME') {
      router.push('/');
    } else if (key === 'SELLER') {
      Alert.alert('Seller pressed');
    } else if (key === 'NOTIFICATION') {
      Alert.alert('Notification pressed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <StatusBar barStyle="dark-content" />

      <View className="bg-white px-4 pt-4">
        <View className="flex-row items-center justify-between">
          <View style={{ width: isSmallScreen ? 28 : 36 }} />

          <View className="items-center flex-1">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
            />
            <Text className="text-[#1E40AF] font-bold mt-1" style={{ fontSize: FONT_SIZES.header }}>
              MURANG BIGAS
            </Text>
            <Text className="text-gray-500" style={{ fontSize: FONT_SIZES.caption }}>
              L I V E L I H O O D
            </Text>
          </View>

          <TouchableOpacity onPress={() => setMenuOpen(true)} className="p-2">
            <MaterialCommunityIcons name="menu" size={menuIconSize} color="#1E40AF" />
          </TouchableOpacity>
        </View>

        <View className="mt-4 bg-gray-50 rounded-full px-4 py-2 flex-row items-center">
          <MaterialCommunityIcons name="magnify" size={searchIconSize} color="#6B7280" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="ml-3 flex-1"
            style={{ fontSize: FONT_SIZES.input }}
          />
        </View>

        <View className={`mt-2 flex-row items-center flex-wrap ${isSmallScreen ? 'gap-1' : ''}`}>
          <Text className="text-[#1E40AF] mr-2" style={{ fontSize: FONT_SIZES.label }}>
            Filter by:
          </Text>
          <TouchableOpacity
            onPress={() => setFilterOpen(!filterOpen)}
            className="px-3 py-1 rounded-full bg-blue-100"
          >
            <Text className="text-[#1E40AF] font-semibold" style={{ fontSize: FONT_SIZES.button }}>
              {sortBy} {asc ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
        </View>

        {filterOpen && (
          <View className="bg-white border mt-2 rounded-lg p-3 shadow">
            <TouchableOpacity onPress={() => { setSortBy('Name'); setFilterOpen(false); }} className="py-1">
              <Text style={{ fontSize: FONT_SIZES.option }}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortBy('Products'); setFilterOpen(false); }} className="py-1">
              <Text style={{ fontSize: FONT_SIZES.option }}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAsc(!asc)} className="py-1">
              <Text style={{ fontSize: FONT_SIZES.option }}>
                {asc ? 'Ascending' : 'Descending'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="font-bold text-gray-900 mt-4" style={{ fontSize: FONT_SIZES.header }}>
          Seller
        </Text>
      </View>

      <ScrollView className="flex-1 bg-gray-100 px-3 pt-3" showsVerticalScrollIndicator>
        <View className="flex-row flex-wrap justify-between">
          {filtered.map(item => (
            <View
              key={item.id}
              style={{ width: cardWidth, marginBottom: 12, minHeight: cardHeight }}
              className="bg-white rounded-xl p-2 shadow"
            >
              <View
                style={{ height: isSmallScreen ? 100 : isMediumScreen ? 120 : 140 }}
                className="bg-gray-100 rounded mb-2"
              />
              <Text className="text-[#1E40AF] font-semibold" style={{ fontSize: FONT_SIZES.itemTitle }}>
                {item.name}
              </Text>
              <Text className="text-gray-500 mt-1" style={{ fontSize: FONT_SIZES.itemMeta }}>
                Products: {item.products}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>

      {menuOpen && (
        <TouchableOpacity
          activeOpacity={1}
          className="absolute inset-0 bg-black/30 z-30"
          onPress={() => setMenuOpen(false)}
        />
      )}

      <Animated.View
        className="absolute right-0 top-0 bg-white z-40"
        style={{
          width: MENU_WIDTH,
          height: '100%',
          marginTop: Platform.OS === 'android' ? 50 : 16,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <View className="px-4 pt-4 pb-2 border-b border-gray-200 flex-row justify-end">
          <TouchableOpacity onPress={() => setMenuOpen(false)}>
            <Image
              source={require('../../assets/icon-close.png')}
              style={{ width: isSmallScreen ? 18 : 22, height: isSmallScreen ? 18 : 22, tintColor: '#1E40AF' }}
            />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4">
          {[
            { key: 'HOME', icon: 'icon-home.png' },
            { key: 'SELLER', icon: 'icon-seller.png' },
            { key: 'NOTIFICATION', icon: 'icon-notif.png' },
          ].map(item => (
            <TouchableOpacity
              key={item.key}
              onPress={() => onMenuPress(item.key)}
              className={`flex-row items-center border-b border-gray-200 ${isSmallScreen ? 'py-3' : 'py-4'}`}
            >
              <Image
                source={ICONS[item.icon]}
                style={{ width: isSmallScreen ? 18 : 22, height: isSmallScreen ? 18 : 22, tintColor: '#1E40AF' }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flexShrink: 1, fontSize: FONT_SIZES.menuItem }}
                className="ml-3 text-[#1E40AF] font-semibold"
              >
                {item.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
