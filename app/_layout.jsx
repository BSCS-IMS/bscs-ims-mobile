import '../global.css'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

const NAVY = '#1F384C'
const INACTIVE = '#94A3B8'

export default function Layout() {
  return (
    <>
      <StatusBar style='dark' />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: NAVY,
          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E5E7EB',
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home-outline' size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='products'
          options={{
            title: 'Products',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='package-variant-closed' size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='resellers'
          options={{
            title: 'Resellers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='people-outline' size={size} color={color} />
            ),
          }}
        />

      </Tabs>
    </>
  )
}
