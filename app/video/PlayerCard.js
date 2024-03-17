import React from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

const PlayerCard = ({ name, imageSource, stats, onToggleSwitch }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Player Profile</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#4CAF50' }}
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
          {stats &&
            Object.entries(stats).map(([key, value]) => (
              <View key={key} style={styles.statRow}>
                <Text style={styles.statKey}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <Text style={styles.statValue}>{value}</Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderWidth: 2,
    borderColor: '#cc0000'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000'
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: '#cc0000',
    borderWidth: 3
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#cc0000',
    marginTop: 10,
    marginBottom: 10
  },
  separator: {
    height: 2,
    backgroundColor: '#cc0000',
    marginVertical: 10
  },
  stats: {
    alignItems: 'center'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5
  },
  statKey: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statValue: {
    color: '#cc0000',
    fontSize: 16
  }
});

export default PlayerCard;
