import { useColorScheme } from '@/hooks/use-color-scheme';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SportEvent } from '@/constants/data';

export default function HomeScreen() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Using TheSportsDB API (Free Tier) - Next 15 Events for English Premier League (id 4328)
      // If this fails due to key issues, we'll fall back to dummy data
      const response = await axios.get('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328');

      if (response.data && response.data.events) {
        setEvents(response.data.events);
      } else {
        // Fallback dummy data if API returns null (common with free tier limits)
        setEvents(dummyEvents);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setEvents(dummyEvents);
    } finally {
      setLoading(false);
    }
  };


  const renderItem = ({ item }: { item: SportEvent }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}
      onPress={() => router.push(`/details/${item.idEvent}`)}
    >
      <Image
        source={{ uri: item.strThumb || 'https://via.placeholder.com/300x150?text=No+Image' }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#333333' }]}>{item.strEvent}</Text>
        <Text style={[styles.cardSubtitle, { color: isDark ? '#bbbbbb' : '#666666' }]}>{item.strLeague}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.dateEvent}</Text>
          <Text style={[styles.statusBadge, { color: '#007AFF' }]}>{item.strStatus || 'Upcoming'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#333333' }]}>Upcoming Matches</Text>
      </View>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.idEvent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40, // Adjust for status bar
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
});
