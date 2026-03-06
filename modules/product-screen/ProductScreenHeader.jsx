import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

const NAVY = '#1F384C'

export default function ProductScreenHeader({
  search, setSearch,
  filterOpen, setFilterOpen,
  sortBy, setSortBy,
  asc, setAsc,
  statusFilter, setStatusFilter,
}) {
  return (
    <View style={s.root}>
      {/* Logo block */}
      <View style={s.logoBlock}>
        <Image source={require('../../assets/LOGO_CLEAR.png')} style={s.logo} resizeMode='contain' />
        <Text style={s.logoTitle}>MURANG BIGAS</Text>
        <Text style={s.logoSub}>PRODUCTS</Text>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        <Ionicons name='search' size={18} color='#94A3B8' />
        <TextInput
          placeholder='Search products…'
          placeholderTextColor='#94A3B8'
          value={search}
          onChangeText={setSearch}
          style={s.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name='close-circle' size={16} color='#CBD5E1' />
          </TouchableOpacity>
        )}
      </View>

      {/* Status + sort row */}
      <View style={s.filterRow}>
        <View style={s.pillGroup}>
          {/* Status */}
          {['all', 'active', 'inactive'].map((sf) => (
            <TouchableOpacity
              key={sf}
              onPress={() => setStatusFilter(sf)}
              style={[s.pill, statusFilter === sf && s.pillActive]}
            >
              <Text style={[s.pillText, statusFilter === sf && s.pillTextActive]}>
                {sf.charAt(0).toUpperCase() + sf.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Sort */}
          {['Name', 'Price', 'Qty'].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setSortBy(sortBy === opt ? null : opt)}
              style={[s.pill, sortBy === opt && s.pillActive]}
            >
              <Text style={[s.pillText, sortBy === opt && s.pillTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}

          {/* Asc/Desc */}
          <TouchableOpacity
            onPress={() => setFilterOpen(!filterOpen)}
            style={[s.pill, s.pillRow, sortBy && s.pillActive]}
          >
            <MaterialCommunityIcons
              name={asc ? 'sort-ascending' : 'sort-descending'}
              size={13}
              color={sortBy ? NAVY : '#94A3B8'}
            />
            <Text style={[s.pillText, sortBy && s.pillTextActive, { marginLeft: 4 }]}>
              {asc ? 'Asc' : 'Desc'}
            </Text>
            <MaterialCommunityIcons
              name={filterOpen ? 'chevron-up' : 'chevron-down'}
              size={13}
              color={sortBy ? NAVY : '#94A3B8'}
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Asc/Desc dropdown */}
      {filterOpen && (
        <View style={s.dropdown}>
          {[{ label: 'Ascending', val: true }, { label: 'Descending', val: false }].map(({ label, val }) => (
            <TouchableOpacity
              key={label}
              onPress={() => { setAsc(val); setFilterOpen(false) }}
              style={[s.dropdownItem, asc === val && s.dropdownItemActive]}
            >
              <Text style={[s.dropdownText, asc === val && s.dropdownTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
    letterSpacing: 0.5,
  },
  logoSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 3,
    marginTop: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#E8EEF4',
    borderColor: '#B6C8D9',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  pillTextActive: {
    color: NAVY,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownItemActive: {
    backgroundColor: '#E8EEF4',
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  dropdownTextActive: {
    color: NAVY,
    fontWeight: '600',
  },
})
