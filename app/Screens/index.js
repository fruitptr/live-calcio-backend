import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import Header from '../../Components/Header';
import PlayerCard from './PlayerCard';

export default function App() {
  const [orientation, setOrientation] = useState(1);
  const video = useRef(null);
  useEffect(() => {
    lockOrientation();
  }, []);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
    const o = await ScreenOrientation.getOrientationAsync();
    setOrientation(o);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
        <View style={styles.overlay}>
          <Header />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Tap on a player</Text>
          </TouchableOpacity>
          <View style={styles.PlayerCardStyles}>
            <PlayerCard
              name="Mirza Abdullah"
              imageSource={require('./../../assets/playerDemo.png')}
              stats={{
                goals: 10,
                assists: 5,
                shots: 50,
                passes: 200,
                tackles: 30
              }}
              onToggleSwitch={() => {}} // Placeholder for the onToggleSwitch function
            />
          </View>
        </View>
      </View>
      <StatusBar style="auto" hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start' // Align header and button to top of overlay
  },
  button: {
    position: 'absolute', // Position the button absolutely
    top: 70, // Adjust as needed
    right: 20, // Adjust as needed
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold'
  },
  PlayerCardStyles: {
    width: 300,
    height: 270,
    margin: 10,
    marginLeft: 40,
    borderRadius: 10
  }
});
