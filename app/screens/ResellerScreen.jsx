import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

export default function ResellerScreen() {
    const auth = getAuth();
    const firestore = getFirestore();
    const database = getDatabase();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        
        <ScrollView className="flex-1 bg-white">
            <View className="px-4 py-4 flex-row items-center justify-end">
                <TouchableOpacity 
                    onPress={() => setMenuOpen(!menuOpen)}
                    className="p-2"
                >
                    <MaterialCommunityIcons 
                        name="menu" 
                        size={28} 
                        color="#1E40AF" 
                    />
                </TouchableOpacity>
            </View>
            <View className="px-4 py-2">
                <Text className="text-2xl font-bold text-gray-900 mb-4">
                    Reseller Dashboard
                </Text>
                
                <View className="bg-gray-50 rounded-lg p-4 mb-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Welcome
                    </Text>
                    <Text className="text-gray-600">
                        Add your content here
                    </Text>
                </View>
            </View>
            </ScrollView>
    );
    
}