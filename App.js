import './global.css'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import HomeScreen from './src/screens/HomeScreen'

export default function App() {
  return (
    <View className='flex-1'>
      <StatusBar style='light' />
      <HomeScreen />
    </View>
  )
}
