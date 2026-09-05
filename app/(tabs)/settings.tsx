import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Save, LogOut, KeyRound, UserX, Moon, Sun } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [birthdate, setBirthdate] = useState('');

  // Fetch current profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, birthdate')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setAvatarUrl(data.avatar_url);
        setBirthdate(data.birthdate || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setAvatarUrl(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        avatar_url: avatarUrl,
        birthdate: birthdate,
        updated_at: new Date(),
      });

      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error updating profile', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) return;

      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;
      Alert.alert('Check your email', 'Password reset instructions have been sent.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Notice', 'Account deletion must be handled via a secure backend function.');
          }
        }
      ]
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-background' : 'bg-white'}`} contentContainerStyle={{ padding: 20, paddingBottom: 100, paddingTop: 48 }}>
      <View className="mb-8 flex-row justify-between items-center">
        <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</Text>
        <View className="flex-row items-center gap-2">
          {isDark ? <Moon color="#73C0FC" size={20} /> : <Sun color="#f59e0b" size={20} />}
          <Switch 
            value={isDark} 
            onValueChange={setIsDark} 
            trackColor={{ false: '#d1d5db', true: '#183153' }}
            thumbColor={isDark ? '#73C0FC' : '#f3f4f6'}
          />
        </View>
      </View>

      <View className={`p-4 rounded-2xl mb-6 ${isDark ? 'bg-surface border border-white/10' : 'bg-white shadow-sm border border-gray-200'}`}>
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage} className="relative">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="w-24 h-24 rounded-full" />
            ) : (
              <View className={`w-24 h-24 rounded-full items-center justify-center ${isDark ? 'bg-surface' : 'bg-gray-100'}`}>
                <UserX color={isDark ? '#9ca3af' : '#6b7280'} size={40} />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-lg">
              <Camera color="#fff" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Birthdate (YYYY-MM-DD)</Text>
          <TextInput
            value={birthdate}
            onChangeText={setBirthdate}
            placeholder="e.g. 1990-01-01"
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-background border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
          />
        </View>

        <TouchableOpacity 
          onPress={handleSaveProfile}
          disabled={loading}
          className="bg-primary py-3 rounded-xl flex-row justify-center items-center gap-2 mt-2"
        >
          <Save color="#fff" size={20} />
          <Text className="text-white font-semibold">{loading ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </View>

      <Text className={`text-sm font-bold mb-3 mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ACCOUNT SECURITY</Text>
      
      <View className={`rounded-2xl overflow-hidden mb-6 ${isDark ? 'bg-surface border border-white/10' : 'bg-white shadow-sm border border-gray-200'}`}>
        <TouchableOpacity onPress={handleResetPassword} className={`flex-row items-center justify-between p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <View className="flex-row items-center gap-3">
            <View className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <KeyRound color={isDark ? '#e5e7eb' : '#374151'} size={20} />
            </View>
            <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Reset Password</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignOut} className={`flex-row items-center justify-between p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <View className="flex-row items-center gap-3">
            <View className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <LogOut color={isDark ? '#e5e7eb' : '#374151'} size={20} />
            </View>
            <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center gap-3">
            <View className="p-2 rounded-lg bg-danger/10">
              <UserX color="#ef4444" size={20} />
            </View>
            <Text className="font-medium text-danger">Delete Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
