import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';

const PlayerCard = ({ name, imageSource, stats, minutesPlayed, rating, records, jerseyNumber, position, subscription }) => {
  const replaceNullWithZero = value => {
    return value !== null ? value : 0;
  };

  const [isStatsTrackerOn, setIsStatsTrackerOn] = useState(false);
  const isSubscriptionTwo = subscription === 'hQwAZa5f8TUXStJd4Apc';

  // If stats tracker is on, check if the player is close to breaking a record (based on threshold value)
  const getAdditionalText = (key, value) => {
    const record = records.find(record => record.stat === key);
    if (isStatsTrackerOn && record && replaceNullWithZero(value) >= record.value - record.threshold) {
      return `${replaceNullWithZero(value)}/${record.value} OFF THE RECORD`;
    }
    return '';
  };

  // Add a space before each capital letter in the stat name 
  const beautifyStatName = (statName) => {
    const firstLetter = statName.charAt(0).toUpperCase();
    let restOfTheName = statName.slice(1);

    for (let i = 0; i < restOfTheName.length; i++) {
      if (restOfTheName[i] === restOfTheName[i].toUpperCase()) {
          restOfTheName = restOfTheName.slice(0, i) + ' ' + restOfTheName.slice(i);
          i++;
      }
    }
    return firstLetter + restOfTheName;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.firstSection}>
          <View style={styles.leftColumn}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.position}>{position}</Text>
            <Text style={styles.jerseyNumber}>{jerseyNumber}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Image source={imageSource} style={styles.image} />
          </View>
        </View>

        <View style={styles.secondSection}>
          <Text style={styles.minutesPlayed}>Minutes Played: {minutesPlayed}'</Text>
          <Text style={styles.rating}>Rating: {rating}</Text>
        </View>

        <View style={styles.thirdSection}>
          <View style={styles.statRow}>
          <Text style={isSubscriptionTwo ? styles.statText : styles.disabledStatText}>Stats Tracker</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#cc0000' }}
              thumbColor={isStatsTrackerOn ? '#fff' : '#fff'}
              value={isStatsTrackerOn}
              onValueChange={value => setIsStatsTrackerOn(value)}
              disabled={!isSubscriptionTwo}
              style={isSubscriptionTwo ? null : styles.disabledSwitch}
            />
          </View>
          {stats &&
            Object.entries(stats).map(([key, value]) => {
              if (
                (subscription === 'Kf10mVUVZ2yeNL4VOYbR' && ['goals', 'assists', 'shots', 'passes'].includes(key)) ||
                (subscription === 'EdmRMmS6nhRjXSvo5HjF') || 
                (subscription === 'hQwAZa5f8TUXStJd4Apc')
              ) {
                return (
                  <View key={key} style={styles.statRow}>
                    <Text style={styles.statText}>
                      {beautifyStatName(key)}: {replaceNullWithZero(value)}
                    </Text>
                    <Text style={styles.additionalText}>
                      {getAdditionalText(key, value)}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#cc0000',
  },
  firstSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cc0000',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  position: {
    color: '#fff',
    fontSize: 10,
  },
  jerseyNumber: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 40,
    borderColor: '#cc0000',
    borderWidth: 2,
  },
  secondSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cc0000',
  },
  minutesPlayed: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
  },
  rating: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
  },
  thirdSection: {
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  additionalText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledStatText: {
    color: '#767577',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledSwitch: {
    opacity: 0.5,
  },
});

export default PlayerCard;
