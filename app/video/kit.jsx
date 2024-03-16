import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image
} from 'react-native';

const App = () => {
  const handleHomeKitPress = () => {
    console.log('Home Kit Selected');
  };

  const handleAwayKitPress = () => {
    console.log('Away Kit Selected');
  };

  return (
    <ImageBackground
      source={require('./../../assets/stadiumimage.jpg')}
      style={styles.background}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select your kit</Text>
      </View>
      <Image
        source={require('./../../assets/kit.png')}
        style={styles.kitImage}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          onPress={handleHomeKitPress}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.button, styles.awayButton]}
          onPress={handleAwayKitPress}
        >
          <Text style={[styles.buttonText, styles.awayButtonText]}>Away</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center'
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white'
  },
  kitImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginTop: 200
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginVertical: 10,
    margin: 30
  },
  homeButton: {
    backgroundColor: '#cc0000'
  },
  awayButton: {
    backgroundColor: 'white'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  awayButtonText: {
    color: 'black'
  }
});

export default App;
