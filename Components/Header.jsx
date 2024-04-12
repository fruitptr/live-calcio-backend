import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import { router } from 'expo-router';

export default function Header() {
  const gotoProfileScreen = () => {
    router.push('../app/account/SettingsScreen')
    console.log("Profile Screen")
  }
  return (
    <View style={styles.headerContainer}>
      {/* Hamburger icon on the left */}
      {/* <TouchableOpacity style={styles.leftContent}>
        <Ionicons name="menu-outline" size={30} color="white" />
      </TouchableOpacity> */}
      <View style={styles.centerContent}>
        <Image
          source={require('./../assets/LiveCalcioLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Account icon on the right */}
      <View style={styles.rightContent}>
        <Ionicons name="person-circle-outline" size={30} color="white" onPress={gotoProfileScreen}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60, // Adjust height as needed
    backgroundColor: '#cc0000',
    paddingHorizontal: 10 // Adjust padding as neededs
  },
  centerContent: {
    // Flex 1 to allow it to take up remaining space
    flex: 1,
    alignItems: 'center'
  },
  logo: {
    width: 400,
    height: 200
  }
});
