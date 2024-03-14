import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can choose the appropriate icon set

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="account-circle"
          size={100}
          color="white"
          style={styles.profilePic}
        />
        <Text style={styles.name}>Mirza Abdullah</Text>
        <Text style={styles.email}>mirzaabdullah@gmail.com</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Icon name="person" size={24} color="#cc0000" />
        <Text style={styles.buttonText}>My Information</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="lock" size={24} color="#cc0000" />
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="subscriptions" size={24} color="#cc0000" />
        <Text style={styles.buttonText}>Edit Subscription</Text>
      </TouchableOpacity>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA' // This is a placeholder color; replace with your preferred background color
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#cc0000' // Red color from the provided color code
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
    color: '#cc0000', // Red color from the provided color code
    fontWeight: '600',
    marginLeft: 10 // Add some spacing between icon and text
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#cc0000', // Red color from the provided color code
    padding: 15,
    borderRadius: 10
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default SettingsScreen;
