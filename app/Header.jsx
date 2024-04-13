import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Header() {
  const gotoProfileScreen = () => {
    router.push('./../account/SettingsScreen')
    console.log("Profile Screen")
  }
  return (
    <View style={styles.headerContainer}>
      <View style={styles.centerContent}>
        <Image
          source={require('./../assets/LiveCalcioLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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
    height: 60,
    backgroundColor: '#cc0000',
    paddingHorizontal: 10
  },
  centerContent: {
    flex: 1,
    alignItems: 'center'
  },
  logo: {
    width: 400,
    height: 200
  }
});
