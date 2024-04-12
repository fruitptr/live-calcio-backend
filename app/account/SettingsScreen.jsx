import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can choose the appropriate icon set
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signOut, onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import {FIRESTORE_DB} from '../../firebaseConfig';
import { router } from 'expo-router';

const SettingsScreen = () => {
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(0);

  const initializeUser = () => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName);
      setEmail(user.email);
      console.log("User initialized successfully!", user.displayName, user.email);
    }
  };

  useEffect(() => {
    initializeUser();
    initializeSubscription();
  }, []);

  const initializeSubscription = async () => {
    const user = auth.currentUser;
    console.log('User ID:', user.uid);
    console.log('db', db)
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setSelectedSubscription(userSnap.data().subscription);
      console.log('Subscription level initialized successfully!', userSnap.data().subscription);
    }
  };

  const handleSaveChanges = async () => {
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDoc, {
      subscription: selectedSubscription
    });
    console.log('Subscription level updated successfully!', selectedSubscription);
    Alert.alert('Success!', 'Subscription level updated successfully!');
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user.email, currentPassword);
    reauthenticateWithCredential(user, credentials).then(() => {
      updatePassword(user, newPassword).then(() => {
        console.log('Password updated successfully!');
        Alert.alert('Success!', 'Password updated successfully!');
      }).catch((error) => {
        console.error('Error updating password:', error);
        Alert.alert('Invalid credentials!', 'Please enter correct current password.');
      });
    }
    ).catch((error) => {
      console.error('Error reauthenticating user:', error);
      Alert.alert('Invalid credentials!', 'Please enter correct current password.');
    });
  };

  const handleEditSubscription = (subscriptionId) => {
    setSelectedSubscription(subscriptionId);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
      router.push('./../auth/Login');
      Alert.alert('Success!', 'User logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error logging out', 'An error occurred. Please try again!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="account-circle"
          size={100}
          color="white"
          style={styles.profilePic}
        />
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Text style={styles.inlineText}>
        Change Password
      </Text>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
            <Text style={styles.modalButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      <Text style={styles.inlineText}>
        Change Subscription
      </Text>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={[
              styles.subscriptionCard,
              selectedSubscription === 0 ? styles.selectedSubscription : null
            ]}
            onPress={() => handleEditSubscription(0)}
          >
            <Text style={styles.subscriptionHeader}>Free Tier</Text>
            <Text>Access to goals, assists, shots, passes.</Text>
            <Text>No access to stats tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subscriptionCard,
              selectedSubscription === 1 ? styles.selectedSubscription : null
            ]}
            onPress={() => handleEditSubscription(1)}
          >
            <Text style={styles.subscriptionHeader}>B Tier - Rs. 1,500/month</Text>
            <Text>Access to goals, assists, shots, passes.</Text>
            <Text>Access to stats tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subscriptionCard,
              selectedSubscription === 2 ? styles.selectedSubscription : null
            ]}
            onPress={() => handleEditSubscription(2)}
          >
            <Text style={styles.subscriptionHeader}>A Tier - Rs. 2,000/month</Text>
            <Text>Access to goals, assists, shots, passes.</Text>
            <Text>Access to advanced statistics.</Text>
            <Text>Access to stats tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleSaveChanges}>
        <Text style={styles.modalButtonText}>Update Subscription</Text>
      </TouchableOpacity>
        </View>
      
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
          <Text style={styles.modalButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  selectedSubscription: {
    borderColor: '#bf0000', // Red color from the provided color code
    borderWidth: 2,
  },
  inlineText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bf0000',
    margin: 10,
    marginLeft: 40,
  },
  subscriptionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bf0000',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#bf0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#bf0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  subscriptionCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 20,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white' // This is a placeholder color; replace with your preferred background color
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#bf0000' // Red color from the provided color code
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 3
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  email: {
    fontSize: 16,
    color: 'white'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10
  },
  buttonText: {
    fontSize: 18,
    color: '#bf0000', // Red color from the provided color code
    fontWeight: '600',
    marginLeft: 10 // Add some spacing between icon and text
  },
  logoutContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default SettingsScreen;
