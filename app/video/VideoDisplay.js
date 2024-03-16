import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import Header from '../../Components/Header';
import PlayerCard from './PlayerCard';
import axios from 'axios';

export default function App() {
  const [orientation, setOrientation] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const video = useRef(null);
  const [timezoneData, setTimezoneData] = useState(null);
  const [fixtureId, setFixtureId] = useState(null);
  const [playersData, setPlayersData] = useState(null);

  useEffect(() => {
    lockOrientation();
    fetchTimezoneData();
  }, []);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
    const o = await ScreenOrientation.getOrientationAsync();
    setOrientation(o);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const fetchTimezoneData = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {
          season: '2023',
          team: '33',
          last: '1'
        },
        headers: {
          'X-RapidAPI-Key':
            'e0f48d2c0cmsha8e774e7a2187dep1ed397jsn8c42560af15d',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setTimezoneData(response.data);
      console.log(response.data);

      // Save the fixture ID to state
      if (response.data.response && response.data.response.length > 0) {
        const fixtureId = response.data.response[0].fixture.id;
        setFixtureId(fixtureId);

        // Fetch players' data based on the fixture ID
        const playersOptions = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/players',
          params: {
            fixture: fixtureId,
            team: '33'
          },
          headers: {
            'X-RapidAPI-Key':
              'e0f48d2c0cmsha8e774e7a2187dep1ed397jsn8c42560af15d',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        };

        const playersResponse = await axios.request(playersOptions);
        console.log(playersResponse.data);

        // Extract players' data and set it to state
        if (
          playersResponse.data.response &&
          playersResponse.data.response.length > 0
        ) {
          const playersData = playersResponse.data.response[0].players;
          setPlayersData(playersData);
          console.log(playersData);
        }
      }
    } catch (error) {
      console.error(error);
    }
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
          onTouchStart={
            isLocked
              ? () => {
                  video.current.pauseAsync();
                }
              : null
          }
        />
        {!isLocked && (
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
                onToggleSwitch={() => {}}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          style={[styles.lockButton, { right: 10, top: 10 }]}
          onPress={toggleLock}
        >
          <Text style={styles.lockButtonText}>
            {isLocked ? 'Unlock' : 'Lock'}
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-start'
  },
  button: {
    position: 'absolute',
    top: 70,
    right: 20,
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
  },
  lockButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lockButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  }
});
