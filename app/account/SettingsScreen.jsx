import React, { useEffect } from 'react';
import useState from 'react-usestateref';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import {
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider
} from 'firebase/auth';
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection
} from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useStripe } from '@stripe/stripe-react-native';

const SettingsScreen = () => {
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedSubscription, setSelectedSubscription, subsref] = useState('');
  const [subscriptionTiers, setSubscriptionTiers] = useState([]);
  const API_URL = 'https://stripe-backend-w1b2.onrender.com';
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializeUser = () => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName);
      setEmail(user.email);
      console.log(
        'User initialized successfully!',
        user.displayName,
        user.email
      );
    }
  };

  // main code for the stripe integration
  const fetchPaymentSheetParams = async () => {
    try {
      let amount = 0;
      if (subsref.current == 'EdmRMmS6nhRjXSvo5HjF') {
        amount = 1500;
      } else if (subsref.current == 'hQwAZa5f8TUXStJd4Apc') {
        amount = 2000;
      } else {
        amount = 1000;
      }
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount })
      });
      const { clientSecret, customer } = await response.json();

      return {
        clientSecret,
        customer
      };
    } catch (error) {
      console.log(error.message);
    }
  };
  const initializePaymentSheet = async () => {
    const { clientSecret, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Merchant Name'
    });
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log('Success', 'Your order is confirmed!');
      return true;
    }
  };

  const fetchSubscriptionTiers = async () => {
    try {
      const tiersSnapshot = await getDocs(collection(db, 'subscriptiontiers'));
      const tiersData = tiersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubscriptionTiers(tiersData);
      console.log('Subscription tiers fetched successfully!', tiersData);
    } catch (error) {
      console.log('Error fetching subscription tiers:', error);
    }
  };

  useEffect(() => {
    initializeUser();
    fetchSubscriptionTiers();
    initializeSubscription();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const initializeSubscription = async () => {
    const user = auth.currentUser;
    console.log('User ID:', user.uid);
    console.log('db', db);
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setSelectedSubscription(userSnap.data().subscription);
      console.log(
        'Subscription level initialized successfully!',
        userSnap.data().subscription
      );
    }
  };

  const isPasswordValid = password => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSaveChanges = async () => {
    await initializePaymentSheet();
    if (await openPaymentSheet()) {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, {
        subscription: selectedSubscription
      });
      console.log(
        'Subscription level updated successfully!',
        selectedSubscription
      );
      Alert.alert('Success!', 'Subscription level updated successfully!');
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    if (!isPasswordValid(newPassword)) {
      Alert.alert(
        'Invalid Password',
        'Password must be 8 or more characters long, contain at least one number, and one symbol.'
      );
      return;
    }

    reauthenticateWithCredential(user, credentials)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            console.log('Password updated successfully!');
            Alert.alert('Success!', 'Password updated successfully!');
          })
          .catch(error => {
            console.error('Error updating password:', error);
            Alert.alert(
              'Invalid credentials!',
              'Please enter correct current password.'
            );
          });
      })
      .catch(error => {
        console.error('Error reauthenticating user:', error);
        Alert.alert(
          'Invalid credentials!',
          'Please enter correct current password.'
        );
      });
  };
  //this point
  const handleEditSubscription = async subscriptionId => {
    setSelectedSubscription(subscriptionId);
    console.log(subsref.current);
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
    <StripeProvider publishableKey="pk_test_51PFMQoIYp4O0UjLimzhAowRorjwXiN5WOlHM41djAt9hV8UVdzRwsV3sTXSFGkOkjQtyATURujNTju3aHGXu10YL00oCcRPtjH">
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
        <Text style={styles.inlineText}>Change Password</Text>
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
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.modalButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inlineText}>Change Subscription</Text>
        <View style={styles.modalContainer}>
          {subscriptionTiers.map(tier => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.subscriptionCard,
                selectedSubscription === tier.id
                  ? styles.selectedSubscription
                  : null
              ]}
              onPress={() => handleEditSubscription(tier.id)}
            >
              <Text style={styles.subscriptionHeader}>
                {tier.name} - Rs. {tier.price}/month
              </Text>
              {tier.description.split('.').map((text, index) => (
                <Text key={index}>{text.trim()}</Text>
              ))}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.modalButtonText}>Update Subscription</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
            <Text style={styles.modalButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  selectedSubscription: {
    borderColor: '#bf0000', // Red color from the provided color code
    borderWidth: 2
  },
  inlineText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bf0000',
    margin: 10,
    marginLeft: 40
  },
  subscriptionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bf0000',
    marginBottom: 10
  },
  saveButton: {
    backgroundColor: '#bf0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5
  },
  modalButton: {
    backgroundColor: '#bf0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%'
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16
  },
  subscriptionCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 20,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center'
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
    marginBottom: 20
  }
});

export default SettingsScreen;
