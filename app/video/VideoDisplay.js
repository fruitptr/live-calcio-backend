import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import Header from '../../Components/Header';
import PlayerCard from './PlayerCard';
import axios from 'axios';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function App() {
  const [videoURI, setVideoURI] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [orientation, setOrientation] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const video = useRef(null);
  const [timezoneData, setTimezoneData] = useState(null);
  const [fixtureId, setFixtureId] = useState(null);
  const [playersData, setPlayersData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [jerseyNumber, setJerseyNumber] = useState(10);
  const [playerImageSource, setPlayerImageSource] = useState(require('./../../assets/playerDemo.png'));
  const positionsDict = {
    "G": "Goalkeeper",
    "D": "Defender",
    "M": "Midfielder",
    "F": "Forward"
  };
  const playerDict = {
    24: 526,
    20: 886,
    2: 889,
    19: 742,
    29: 18846,
    39: 903,
    37: 284322,
    17: 284324,
    8: 1485,
    10: 909,
    11: 288006,
    5: 2935,
    21: 9971,
    14: 174,
    16: 15799,
    7: 19220,
    22: 2931,
    53: 288112,
    4: 74,
    62: 284242,
    6: 2467,
    12: 37145,
    23: 891,
    35: 18772,
    18: 747,
    9: 908,
    47: 163054,
  };
  const db = FIRESTORE_DB;
  const [recordsData, setRecordsData] = useState(null);

  useEffect(() => {
    // lockOrientation();
    // fetchTimezoneData();
  }, []);

  useEffect(() => {
    if (videoURI) {
      lockOrientation();
    }
  }, [videoURI]);

  const pickVideo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your videos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const video = result.assets[0];
      setVideoURI(video.uri);
      const aspectRatio = video.width / video.height;
      setAspectRatio(aspectRatio);
      console.log(video.uri);
    }
  };

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
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: { season: '2023', team: '33', last: '1' },
      headers: {
        'X-RapidAPI-Key': 'e048552a78msh52ac7abb72eaaacp1b80f8jsn1b5155fdbf5f',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setTimezoneData(response.data);
      if (response.data.response && response.data.response.length > 0) {
        const fixtureId = response.data.response[0].fixture.id;
        setFixtureId(fixtureId);
        fetchPlayersData(fixtureId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlayersData = async fixtureId => {
    const playersOptions = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/players',
      params: { fixture: fixtureId, team: '33' },
      headers: {
        'X-RapidAPI-Key': 'e048552a78msh52ac7abb72eaaacp1b80f8jsn1b5155fdbf5f',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    };

    try {
      const playersResponse = await axios.request(playersOptions);
      if (
        playersResponse.data.response &&
        playersResponse.data.response.length > 0
      ) {
        const playersData = playersResponse.data.response[0].players;
        console.log(playersData)
        setPlayersData(playersData);
        findPlayerData(playersData, jerseyNumber);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const findPlayerData = async (playersData, jerseyNumber) => {
    const playerId = playerDict[jerseyNumber];
    console.log("Player ID: ", playerId)
    console.log(playersData)
    const player = playersData.find(player => player.player.id === playerId);
    console.log("Player stats: ", player.statistics[0])
    setPlayerData(player);
    setPlayerImageSource({ uri: player.player.photo });
    fetchRecordsData();
  };

  const fetchRecordsData = async () => {
    const recordsCollection = collection(db, 'records');
    const recordsSnapshot = await getDocs(recordsCollection);
    const recordsData = recordsSnapshot.docs.map(doc => doc.data());
    setRecordsData(recordsData);
    console.log(recordsData)
  }

  if (videoURI) {
  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: videoURI }}
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
            <TouchableOpacity style={styles.button}
            onPress={handlePlayerTapped}>
              <Text style={styles.buttonText}>Tap on a player</Text>
            </TouchableOpacity>
            <View style={styles.PlayerCardStyles}>
              <PlayerCard
                name= {playerData ? playerData.player.name : "Player Name"}
                imageSource={ playerImageSource }
                stats={{
                  goals: playerData ? playerData.statistics[0].goals.total : 0,
                  assists: playerData ? playerData.statistics[0].goals.assists : 0,
                  shots: playerData ? playerData.statistics[0].shots.total : 0,
                  passes: playerData ? playerData.statistics[0].passes.total : 0,
                  tackles: playerData ? playerData.statistics[0].tackles.total : 0,
                  fouls: playerData ? playerData.statistics[0].fouls.committed : 0,
                  duelsWon: playerData ? playerData.statistics[0].duels.won : 0,
                  offsides: playerData ? playerData.statistics[0].offsides : 0,
                  foulsDrawn: playerData ? playerData.statistics[0].fouls.drawn : 0,
                }}
                minutesPlayed={playerData ? playerData.statistics[0].games.minutes : 0}
                rating={playerData ? playerData.statistics[0].games.rating : 0}
                records = {recordsData ? recordsData : []}
                jerseyNumber={jerseyNumber}
                position= { playerData ? positionsDict[playerData.statistics[0].games.position] : "Position"}
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
} else {
  return (
    <View style={styles.Ucontainer}>
      <Header />
      <View style={styles.UcontentContainer}>
        <View style={styles.uploadTextContainer}>
          <Text style={styles.UuploadText}>Upload</Text>
          <Text style={styles.UuploadText}>Video</Text>
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
          <Text style={styles.UbuttonText}>Browse</Text>
          <Text style={styles.UbuttonText}>Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
};

const styles = StyleSheet.create({
  Ucontainer: {
    flex: 1,
    alignItems: 'center'
  },
  UcontentContainer: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%' // Take full width
  },
  uploadButton: {
    borderWidth: 2,
    backgroundColor: '#cc0000',
    width: 150,
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  UbuttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
  UuploadText: {
    fontSize: 38,
    color: '#cc0000',
    fontWeight: 'bold'
  },

  uploadTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30 // Add margin for better spacing
  },
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
