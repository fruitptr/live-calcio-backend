import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
const backgroundImage = require('./../../assets/loginbg1.png');

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      console.log('User logged in successfully!', response);
      router.push('./../video/VideoDisplay')
    }
    catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error logging in', 'Invalid credentials. Try again!');
    }
  }

  const handleGoToSignup = () => {
    router.push('./RegisterScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.formContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <Image
              source={require('./../../assets/logintext.png')}
              style={styles.loginImage}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={username}
              onChangeText={setUsername}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoToSignup}>
              <Text style={styles.signUpText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '100%',
    height: '55%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.9,
    shadowRadius: 3.84,
    elevation: 10
  },
  keyboardAvoidingView: {
    width: '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
    elevation: 3
  },
  loginButton: {
    backgroundColor: '#bf0000',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
    elevation: 3
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  signUpText: {
    fontSize: 16,
    color: '#cc0000',
    marginTop: 16
  },
  loginImage: {
    height: 35,
    width: 'auto',
    resizeMode: 'contain',
    marginTop: 50,
    marginBottom: 30,
  }
});
