import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;

  // This function would handle the user registration
  const handleRegister = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully!', response);
      await updateProfile(auth.currentUser, { displayName: name});
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDoc, {
        email: email,
        subscription: 0
      });
      console.log('Profile updated successfully!');
      Alert.alert('Success!', 'Account created!');
  }
  catch (error) {
    console.error('Error registering user:', error);
    Alert.alert('Error registering user', error.message);
  }
}

  return (
    <ImageBackground
      source={require('./../../assets/bgImg1.jpg')} // Replace with your background image
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.header}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setName}
          value={name}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Choose Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementText}>8 characters minimum</Text>
          <Text style={styles.requirementText}>
            At least 1 number and special character
          </Text>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginRedirect}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              router.push('./Login');
            }}
          >
            <Text style={styles.loginButton}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#cc0000'
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10
  },
  passwordRequirements: {
    alignSelf: 'flex-start',
    marginBottom: 16
  },
  requirementText: {
    fontSize: 12,
    color: '#888'
  },
  registerButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#cc0000',
    marginBottom: 10
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  loginRedirect: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loginText: {
    fontSize: 14,
    color: '#888'
  },
  loginButton: {
    fontSize: 14,
    color: '#cc0000',
    fontWeight: 'bold'
  }
});

export default RegisterScreen;
