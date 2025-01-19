import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  Pressable,
  Animated,
  PanResponder,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

interface LoginScreenProps {
  onLogin: () => void;
}

const { height } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = 100;
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.89;

const textInputStyle: TextStyle = {
  textAlignVertical: 'top' as const,
  paddingTop: 12,
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = gestureState.dy;
        if (newY >= 0 && newY <= BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldSnap = gestureState.vy > 0.5 || 
          (gestureState.vy >= 0 && gestureState.dy > BOTTOM_SHEET_MAX_HEIGHT / 2);
        
        Animated.spring(translateY, {
          toValue: shouldSnap ? BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT : 0,
          useNativeDriver: true,
          bounciness: 4
        }).start();
      }
    })
  ).current;

  const handleSubmit = async () => {
    if (!username || !password || (!isLogin && (!email || !name))) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await AsyncStorage.setItem('userToken', 'demo_token');
      onLogin();
    } catch (error: any) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleTestMode = async () => {
    await AsyncStorage.setItem('userToken', 'test_mode_token');
    onLogin();
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header Section */}
      <View className="flex-1">
        <LinearGradient
          colors={['#4c1d95', '#7c3aed', '#8b5cf6']}
          className="absolute w-full h-[70%] rounded-b-[40px]"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row justify-end px-6 pt-14">
            <TouchableOpacity
              onPress={() => setIsDarkMode(!isDarkMode)}
              className="bg-white/20 p-3 rounded-full"
            >
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <View className="items-center justify-center mt-16">
            <View className="bg-white/20 p-5 rounded-2xl mb-6">
              <Ionicons name="cube-outline" size={48} color="white" />
            </View>
            <Text className="text-white text-5xl font-bold mb-3 text-center">
              Template App
            </Text>
            <Text className="text-white/90 text-xl text-center px-8 font-medium">
              Your journey starts here
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: BOTTOM_SHEET_MAX_HEIGHT,
          transform: [{ translateY }],
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10
        }}
      >
        <View {...panResponder.panHandlers} className="w-full items-center pt-3 pb-5">
          <View className="w-16 h-1 rounded-full bg-gray-300" />
        </View>

        <ScrollView
          className="px-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'} text-center tracking-tight`}>
            Welcome Back!
          </Text>

          {/* Input Fields */}
          <View className="space-y-6">
            <View>
              <Text className={`text-base mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {isLogin ? 'Username or Email' : 'Choose a Username'}
              </Text>
              <View className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} rounded-xl flex-row items-center px-4 h-14`}>
                <Ionicons name="person-outline" size={22} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <TextInput
                  className={`flex-1 py-3 px-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  value={username}
                  onChangeText={setUsername}
                  placeholder={isLogin ? "Enter your username" : "Choose a username"}
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                  autoCapitalize="none"
                  style={textInputStyle}
                />
              </View>
            </View>

            {!isLogin && (
              <>
                <View>
                  <Text className={`text-base mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </Text>
                  <View className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} rounded-xl flex-row items-center px-4 h-14`}>
                    <Ionicons name="mail-outline" size={22} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                    <TextInput
                      className={`flex-1 py-3 px-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={textInputStyle}
                    />
                  </View>
                </View>

                <View>
                  <Text className={`text-base mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </Text>
                  <View className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} rounded-xl flex-row items-center px-4 h-14`}>
                    <Ionicons name="person-circle-outline" size={22} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                    <TextInput
                      className={`flex-1 py-3 px-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your name"
                      placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                      style={textInputStyle}
                    />
                  </View>
                </View>
              </>
            )}

            <View>
              <Text className={`text-base mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </Text>
              <View className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} rounded-xl flex-row items-center px-4 h-14`}>
                <Ionicons name="lock-closed-outline" size={22} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <TextInput
                  className={`flex-1 py-3 px-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                  style={textInputStyle}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={isDarkMode ? '#9ca3af' : '#6b7280'}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-4 mt-8">
            <TouchableOpacity
              className={`bg-purple-600 h-14 rounded-xl justify-center ${loading ? 'opacity-70' : ''}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setName('');
              }}
              className="h-14 justify-center"
            >
              <Text className={`text-center text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTestMode}
              className={`h-14 rounded-xl justify-center border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <Text className={`text-center font-semibold text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Enter Test Mode
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text className={`text-center text-sm mt-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};
