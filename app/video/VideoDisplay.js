import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Video, ResizeMode } from 'expo-av';
import Header from '../Header';
import PlayerCard from './PlayerCard';
import axios from 'axios';
import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  const [videoURI, setVideoURI] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [origVideoWidth, setVideoWidth] = useState(0);
  const [origVideoHeight, setVideoHeight] = useState(0);
  const [orientation, setOrientation] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const video = useRef(null);
  const [timezoneData, setTimezoneData] = useState(null);
  const [fixtureId, setFixtureId] = useState(null);
  const [playersData, setPlayersData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [jerseyNumber, setJerseyNumber] = useState(10);
  const [playerImageSource, setPlayerImageSource] = useState(require('./../../assets/playerDemo.png'));
  const [displayPlayerCard, setDisplayPlayerCard] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(0);
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
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const [recordsData, setRecordsData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const lockOrientation = async () => {
        if (!videoURI) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } else {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          );
        }
      };
  
      lockOrientation();
  
      return () => {
        ScreenOrientation.unlockAsync();
      };
    }, [videoURI])
  );

  useEffect(() => {
    if (!videoURI) {
      lockPortraitOrientation();
    } else {
      lockLandscapeOrientation();
    }

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [videoURI]);

  const lockPortraitOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  const lockLandscapeOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  };

  useEffect(() => {
    initializeSubscription();
  }, []);

  // useEffect(() => {
  //   if (videoURI) {
  //     lockOrientation();
  //   }
  // }, [videoURI]);

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const video = result.assets[0];
      setVideoURI(video.uri);
      const aspectRatio = video.width / video.height;
      setVideoWidth(video.width);
      setVideoHeight(video.height);
      setAspectRatio(aspectRatio);
      console.log(video.uri);
    }
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
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_RAPID_API_KEY,
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
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_RAPID_API_KEY,
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

  const closePlayerCard = () => {
    setDisplayPlayerCard(false);
  };

  const handlePlayerTapped = async (event) => {
    const storage = FIREBASE_STORAGE;
    const auth = FIREBASE_AUTH;
    const user = auth.currentUser;
    let XCoordOfOrigVideo = 0;
    let YCoordOfOrigVideo = 0;
    if (!user) {
      Alert.alert('You need to be logged in!');
      return;
    }
    if (!isLocked)
    {
      return;
    }
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const { width, height } = Dimensions.get('window');
    const deviceAspectRatio = width / height;
    if (deviceAspectRatio < aspectRatio) {
      const expectedVideoHeight = width / aspectRatio;
      const blackBarHeight = (height - expectedVideoHeight) / 2;
      const tapX = locationX;
      const tapY = locationY - blackBarHeight;
      if (tapX < 0 || tapY < 0 || tapX > width || tapY > expectedVideoHeight) {
        return;
      }
      XCoordOfOrigVideo = tapX * (origVideoWidth / width);
      YCoordOfOrigVideo = tapY * (origVideoHeight / expectedVideoHeight);
    } else {
      const expectedVideoWidth = height * aspectRatio;
      const blackBarWidth = (width - expectedVideoWidth) / 2;
      const tapX = locationX - blackBarWidth;
      const tapY = locationY;
      if (tapX < 0 || tapY < 0 || tapX > expectedVideoWidth || tapY > height) {
        console.log("Tapped outside the video area!");
        return;
      }
      XCoordOfOrigVideo = tapX * (origVideoWidth / expectedVideoWidth);
      YCoordOfOrigVideo = tapY * (origVideoHeight / height);
      console.log("Original Video X Coordinate:", XCoordOfOrigVideo);
      console.log("Original Video Y Coordinate:", YCoordOfOrigVideo);
    }
    const currentTime = new Date();
    const timestamp = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentTime
      .getDate()
      .toString()
      .padStart(2, '0')}_${currentTime
      .getHours()
      .toString()
      .padStart(2, '0')}-${currentTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}-${currentTime.getSeconds().toString().padStart(2, '0')}`;

    const fileName = `video_${timestamp}.mp4`;
    const storageRef = ref(storage, `media/${user.uid}/${fileName}`);
    // REMOVE THESE 3 LINES BEFORE PRODUCTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    fetchTimezoneData();
    setDisplayPlayerCard(true);
    setIsLocked(false);
    return;
    try {
      const response = await fetch(videoURI);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const upload = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        upload.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        }, reject, async () => {
          const downloadURL = await getDownloadURL(upload.snapshot.ref);
          console.log('File available at', downloadURL);
          const xInt = Math.round(XCoordOfOrigVideo);
          const yInt = Math.round(YCoordOfOrigVideo);
          console.log("X Coordinate:", xInt);
          console.log("Y Coordinate:", yInt);
          const requestData = {
            video: downloadURL,
            x: xInt,
            y: yInt,
          };
          console.log("REQUEST DATA: ", requestData)
          try {
            //IF YOU ENCOUNTER ISSUE, IT MAY BE DUE TO THE MAGIC STRING BELOW. JUST PASTE THE URL INSTEAD AS A STRING
            const response = await fetch(`${process.env.EXPO_PUBLIC_MODEL_API_URL}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            });
        
            if (!response.ok) {
              throw new Error(`Failed to send data: ${response.statusText}`);
            }
        
            const responseData = await response.json();
            console.log(responseData)
        
            if (responseData.jersey_number !== 'Not a player') {
              const jerseyNumberResponse = responseData.jersey_number;
              console.log(jerseyNumberResponse);
              setJerseyNumber(jerseyNumberResponse);
              fetchTimezoneData();
            } else {
              console.log('Response is "Not a player"');
            }
            
            setDisplayPlayerCard(true);
            setIsLocked(false);
            resolve(downloadURL);
        
          } catch (error) {
            console.error('Error sending data:', error);
            Alert.alert('Error', error.message);
          }
        });
      });
    }
    catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Could not send file to server for processing!');
    }
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
          onTouchStart={handlePlayerTapped}
        />
        <TouchableOpacity style={styles.button}
            onPress={toggleLock}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="info-outline" style={styles.icon} />

                <Text style={styles.buttonText}>
                  {isLocked ? 'Tap here to go back' : 'Tap here to start'}
                </Text>
              </View>
            </TouchableOpacity>
            {displayPlayerCard && (
              <TouchableOpacity style={styles.closeButton} onPress={closePlayerCard}>
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="close" style={styles.icon} />
                    <Text style={styles.closeButtonText}>Close card</Text>
                  </View>
              </TouchableOpacity>
            )}
        {!isLocked && (
          <View style={styles.overlay}>
            <Header />
            <View style={styles.PlayerCardStyles}>
              { displayPlayerCard && (
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
                subscription={selectedSubscription}
              />
              )}
            </View>
          </View>
        )}
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
          <Text style={styles.UuploadText}>Upload Video</Text>
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
          <Text style={styles.UbuttonText}>Browse Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
};

const styles = StyleSheet.create({
  Ucontainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  UcontentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#001000',
    backgroundColor: '#bf0000',
    width: '70%',
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  UbuttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
  UuploadText: {
    fontSize: 38,
    color: '#bf0000',
    fontWeight: 'bold'
  },

  uploadTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#bf0000',
    marginRight: 7,
  },
  closeButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bf0000',
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bf0000',
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
