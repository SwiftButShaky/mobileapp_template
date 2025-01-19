import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#4c1d95', '#7c3aed', '#8b5cf6']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-8 pt-16 pb-8">
          <View>
            <Text className="text-white text-3xl font-bold">
              Welcome Back!
            </Text>
            <Text className="text-white/80 text-lg mt-1">
              Template App Dashboard
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-white/20 p-3 rounded-full"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="px-8 py-6">
          {/* Quick Actions */}
          <Text className="text-white text-xl font-semibold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {['Profile', 'Settings', 'Messages', 'Help'].map((item) => (
              <TouchableOpacity
                key={item}
                className="bg-white/20 rounded-2xl p-4 mb-4 w-[48%] h-32 justify-center items-center"
              >
                <Ionicons
                  name={
                    item === 'Profile' ? 'person-outline' :
                    item === 'Settings' ? 'settings-outline' :
                    item === 'Messages' ? 'chatbubble-outline' :
                    'help-circle-outline'
                  }
                  size={32}
                  color="white"
                />
                <Text className="text-white text-lg mt-2">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity */}
          <Text className="text-white text-xl font-semibold mb-4 mt-6">
            Recent Activity
          </Text>
          <View className="space-y-4">
            {[
              { title: 'Profile Updated', time: '2 hours ago', icon: 'person-outline' },
              { title: 'Settings Changed', time: 'Yesterday', icon: 'settings-outline' },
              { title: 'New Message', time: '2 days ago', icon: 'mail-outline' },
            ].map((item, index) => (
              <View
                key={index}
                className="bg-white/20 rounded-xl p-4 flex-row items-center"
              >
                <View className="bg-white/20 rounded-full p-2 mr-4">
                  <Ionicons name={item.icon} size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg">{item.title}</Text>
                  <Text className="text-white/60">{item.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
