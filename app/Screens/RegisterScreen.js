import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import Header from '../../Components/Header';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const handleRegister = () => {
    // Implement your registration logic here
  };

  const handleSelectSubscription = subscription => {
    setSelectedSubscription(
      subscription === selectedSubscription ? null : subscription
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.registerText}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.subscriptionText}>Subscription Plan:</Text>
        {/* Subscription Plan A */}
        <TouchableOpacity
          style={[
            styles.subscriptionCard,
            selectedSubscription === 'A' && styles.selectedCard
          ]}
          onPress={() => handleSelectSubscription('A')}
        >
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionName}>Subscription A</Text>
          </View>
          <View style={styles.featuresContainer}>
            <Text style={styles.featureTitle}>Access to:</Text>
            <View>
              <Text>Feature 1</Text>
              <Text>Feature 2</Text>
              <Text>Feature 3</Text>
            </View>
          </View>
          <Text style={styles.subscriptionPrice}>Free</Text>
        </TouchableOpacity>
        {/* Subscription Plan B */}
        <TouchableOpacity
          style={[
            styles.subscriptionCard,
            selectedSubscription === 'B' && styles.selectedCard
          ]}
          onPress={() => handleSelectSubscription('B')}
        >
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionName}>Subscription B</Text>
          </View>
          <View style={styles.featuresContainer}>
            <Text style={styles.featureTitle}>Access to:</Text>
            <View>
              <Text>Feature 1</Text>
              <Text>Feature 2</Text>
              <Text>Feature 3</Text>
            </View>
          </View>
          <Text style={styles.subscriptionPrice}>Free</Text>
        </TouchableOpacity>
        {/* Subscription Plan C */}
        <TouchableOpacity
          style={[
            styles.subscriptionCard,
            selectedSubscription === 'C' && styles.selectedCard
          ]}
          onPress={() => handleSelectSubscription('C')}
        >
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionName}>Subscription C</Text>
          </View>
          <View style={styles.featuresContainer}>
            <Text style={styles.featureTitle}>Access to:</Text>
            <View>
              <Text>Feature 1</Text>
              <Text>Feature 2</Text>
              <Text>Feature 3</Text>
            </View>
          </View>
          <Text style={styles.subscriptionPrice}>Free</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  registerText: {
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    padding: 10,
    borderRadius: 20 // Rounded text fields
  },
  subscriptionText: {
    fontSize: 20,
    marginBottom: 10
  },
  subscriptionCard: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 10,
    borderRadius: 20, // Rounded edges for cards
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white'
  },
  selectedCard: {
    borderColor: '#cc0000',
    borderWidth: 2,
    borderStyle: 'dotted'
  },
  subscriptionHeader: {
    backgroundColor: '#cc0000',
    padding: 10,
    borderRadius: 20, // Rounded header
    marginBottom: 10
  },
  subscriptionName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  featuresContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  subscriptionPrice: {
    backgroundColor: '#cc0000',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20 // Rounded price
  },
  registerButton: {
    backgroundColor: '#cc0000',
    padding: 10,
    borderRadius: 20, // Rounded button
    marginTop: 20
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default RegisterScreen;
