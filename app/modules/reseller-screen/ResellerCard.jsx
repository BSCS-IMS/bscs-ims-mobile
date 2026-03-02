import { View, Text, Dimensions, Image } from 'react-native';

const COLORS = {
  primary: '#1E40AF',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ResellerCard({ item }) {
  return (
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
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-32 rounded-lg mb-3"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-32 bg-gray-100 rounded-lg mb-3 border border-gray-100" />
      )}
      {/* Business name from Firebase */}
      <Text
        className="font-bold text-base mb-1"
        style={{ color: COLORS.primary, fontFamily: 'Inter' }}
        numberOfLines={1}
      >
        {item.businessName || item.ownerName || 'N/A'}
      </Text>
      {/* Product count */}
      <Text
        className="text-xs text-gray-500 mb-1"
        style={{ fontFamily: 'Inter' }}
        numberOfLines={1}
      >
        Products: {item.productCount ?? 0}
      </Text>
      {/* Contact information */}
      <Text
        className="text-xs text-gray-500 mb-1"
        style={{ fontFamily: 'Inter' }}
        numberOfLines={1}
      >
        {item.contactNumber || 'No contact'}
      </Text>
      {/* Status badge */}
      <View className="w-full flex-row items-center justify-between">
        <Text
          className="text-xs text-gray-600"
          style={{ fontFamily: 'Inter' }}
          numberOfLines={1}
        >
          {item.email || 'No email'}
        </Text>
        <View
          className="px-2 py-1 rounded-full"
          style={{
            backgroundColor:
              item.status === 'active'
                ? '#D1FAE5'
                : item.status === 'inactive'
                ? '#FEE2E2'
                : '#FEF3C7',
          }}
        >
          <Text
            className="text-xs font-semibold"
            style={{
              color:
                item.status === 'active'
                  ? '#065F46'
                  : item.status === 'inactive'
                  ? '#991B1B'
                  : '#92400E',
              fontFamily: 'Inter',
            }}
          >
            {item.status || 'pending'}
          </Text>
        </View>
      </View>
    </View>
  );
}
