import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (text: string) => {
    console.log('Email changed:', text);
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    console.log('Password changed:', text);
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    console.log('Confirm password changed:', text);
    setConfirmPassword(text);
  };

  const handleRegister = () => {
    console.log('Register button pressed');
    console.log('Current state:', { email, password, confirmPassword });

    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Wrap AsyncStorage operations in a separate async function
    const registerUser = async () => {
      try {
        console.log('Starting registration process...');
        
        // Get existing users
        const usersString = await AsyncStorage.getItem('users');
        console.log('Retrieved users:', usersString);
        
        const users = usersString ? JSON.parse(usersString) : [];
        
        // Check if email exists
        if (users.some((user: any) => user.email === email)) {
          Alert.alert('Error', 'Email already registered');
          return;
        }

        // Add new user
        const newUser = { email, password };
        users.push(newUser);
        
        // Save users
        await AsyncStorage.setItem('users', JSON.stringify(users));
        console.log('Registration successful');
        
        Alert.alert(
          'Success',
          'Registration successful! Please login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert('Error', 'Failed to register. Please try again.');
      }
    };

    registerUser();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          testID="email-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          testID="password-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          testID="confirm-password-input"
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          testID="register-button"
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 15,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
  },
}); 