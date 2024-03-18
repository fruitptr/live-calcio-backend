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

const PlayerCard = ({ name, imageSource, stats, minutesPlayed, rating, records, jerseyNumber, position, onToggleSwitch }) => {
  const replaceNullWithZero = value => {
    return value !== null ? value : 0;
  };

  const getAdditionalText = (key, value) => {
    const record = records.find(record => record.stat === key);
    if (record && replaceNullWithZero(value) >= record.value - record.threshold) {
      return `${replaceNullWithZero(value)}/${record.value} OFF THE RECORD`;
    }
    return '';
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* First Section */}
        <View style={styles.firstSection}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.position}>{position}</Text>
            <Text style={styles.jerseyNumber}>{jerseyNumber}</Text>
          </View>
          {/* Right Column */}
          <View style={styles.rightColumn}>
            <Image source={imageSource} style={styles.image} />
          </View>
        </View>

        {/* Second Section */}
        <View style={styles.secondSection}>
          <Text style={styles.minutesPlayed}>Minutes Played: {minutesPlayed}'</Text>
          <Text style={styles.rating}>Rating: {rating}</Text>
        </View>

        {/* Third Section */}
        <View style={styles.thirdSection}>
          {stats &&
            Object.entries(stats).map(([key, value]) => (
              <View key={key} style={styles.statRow}>
                <Text style={styles.statText}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {replaceNullWithZero(value)}
                </Text>
                <Text style={styles.additionalText}>
                  {getAdditionalText(key, value)}
                </Text>
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
    marginBottom: 10,
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
    marginTop: 10,
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
});

export default PlayerCard;
