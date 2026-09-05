import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);
    else router.replace('/(tabs)');
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);
    else {
      Alert.alert('Success', 'Check your email to verify your account!');
      if (data.session) router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <Text className="text-3xl font-bold text-white mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
      <Text className="text-gray-400 mb-8">Sign in to sync your preferences and profile.</Text>

      <View className="space-y-4 gap-4">
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          className="w-full px-4 py-4 rounded-xl bg-surface border border-white/10 text-white"
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          className="w-full px-4 py-4 rounded-xl bg-surface border border-white/10 text-white"
        />

        <TouchableOpacity 
          onPress={() => isSignUp ? signUpWithEmail() : signInWithEmail()}
          disabled={loading}
          className="w-full bg-primary py-4 rounded-xl items-center mt-2"
        >
          <Text className="text-white font-bold">{loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} className="items-center mt-4">
          <Text className="text-primary font-medium">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
        
        {/* Temporary bypass button for dev */}
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="items-center mt-8">
          <Text className="text-gray-500 underline text-xs">Skip for now (Demo)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
