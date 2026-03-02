import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

const COLORS = {
  primary: '#1F384C'
}

export default function ResellerScreenHeader({
  setMenuOpen,
  search,
  setSearch,
  filterOpen,
  setFilterOpen,
  sortBy, // Reverted to no default here
  setSortBy,
  asc,
  setAsc
}) {
  return (
    <View className='px-5 pb-4'>
      {/* Header */}
      <View className='flex-row items-center justify-between mb-6 pt-2'>
        <View style={{ width: 28 }} />

        <View className='items-center'>
          <Image
            source={require('../../../assets/LOGO_CLEAR.png')}
            className='w-16 h-16 rounded-full mb-1'
            resizeMode='contain'
          />
          <Text className='font-bold text-lg' style={{ color: COLORS.primary, fontFamily: 'Inter' }}>
            MURANG BIGAS
          </Text>
          <Text className='text-[10px] tracking-[4px] text-gray-500 uppercase' style={{ fontFamily: 'Inter' }}>
            Livelihood
          </Text>
        </View>

        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <MaterialCommunityIcons name='menu' size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className='bg-white rounded-full flex-row items-center px-4 py-2 shadow-sm border border-gray-200'>
        <Ionicons name='search' size={20} color='#9CA3AF' className='ml-2' />
        <TextInput
          placeholder='Search'
          value={search}
          onChangeText={setSearch}
          multiline={false}
          scrollEnabled={false}
          className='flex-1 text-sm text-gray-700'
        />
      </View>

      {/* Filter */}
      <View className='mt-4 z-20 relative flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          {['Name', 'Products'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSortBy(option)}
              className={`px-4 py-1.5 rounded-full border ${
                sortBy === option
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  sortBy === option ? 'text-[#1F384C]' : 'text-gray-500'
                }`}
                style={{ fontFamily: 'Inter' }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Asc/Desc dropdown pill */}
          <TouchableOpacity
            onPress={() => setFilterOpen(!filterOpen)}
            className={`flex-row items-center px-3 py-1.5 rounded-full border ${
              sortBy ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-300'
            }`}
          >
            <MaterialCommunityIcons name={asc ? 'sort-ascending' : 'sort-descending'} size={14} color={COLORS.primary} />
            <Text
              className={`ml-1 text-sm font-semibold ${sortBy ? 'text-[#1F384C]' : 'text-gray-500'}`}
              style={{ fontFamily: 'Inter' }}
            >
              {asc ? 'Asc' : 'Desc'}
            </Text>
            <MaterialCommunityIcons name={filterOpen ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {filterOpen && (
          <View className='absolute top-9 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-36'>
            <TouchableOpacity
              onPress={() => {
                setAsc(true)
                setFilterOpen(false)
              }}
              className={`py-2 px-3 rounded-md ${sortBy && asc ? 'bg-blue-50' : ''}`}
            >
              <Text
                className={`text-sm font-semibold ${sortBy && asc ? 'text-[#1F384C]' : 'text-gray-600'}`}
                style={{ fontFamily: 'Inter' }}
              >
                Ascending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAsc(false)
                setFilterOpen(false)
              }}
              className={`py-2 px-3 rounded-md ${sortBy && !asc ? 'bg-blue-50' : ''}`}
            >
              <Text
                className={`text-sm font-semibold ${sortBy && !asc ? 'text-[#1F384C]' : 'text-gray-600'}`}
                style={{ fontFamily: 'Inter' }}
              >
                Descending
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {sortBy && (
          <TouchableOpacity
            onPress={() => {
              setSortBy(null)
              setAsc(true)
              setFilterOpen(false)
            }}
            className='px-4 py-1.5 rounded-md border border-gray-300 bg-white'
          >
            <Text className='text-sm font-semibold text-gray-500' style={{ fontFamily: 'Inter' }}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
