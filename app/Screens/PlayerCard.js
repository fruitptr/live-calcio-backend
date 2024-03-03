import React from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  ScrollView
} from 'react-native';

const PlayerCard = ({ name, imageSource, stats, onToggleSwitch }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.statsText}>Stats Tracker</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={stats ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggleSwitch}
          value={stats}
        />
      </View>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.separator} />
      <View style={styles.stats}>
        <Text style={styles.stat}>Goals: {stats && stats.goals}</Text>
        <Text style={styles.stat}>Assists: {stats && stats.assists}</Text>
        <Text style={styles.stat}>Shots: {stats && stats.shots}</Text>
        <Text style={styles.stat}>Passes: {stats && stats.passes}</Text>
        <Text style={styles.stat}>Tackles: {stats && stats.tackles}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black with 50% opacity
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#fff', // White border color
    borderWidth: 3 // Border width
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align to the right
    alignItems: 'center'
  },
  statsText: {
    marginRight: 10,
    fontSize: 16,
    color: '#fff' // White text color
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    alignSelf: 'center'
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff' // White text color
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 4
  },
  stats: {},
  stat: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff' // White text color
  }
});

export default PlayerCard;
