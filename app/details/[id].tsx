import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleFavorite } from '@/store/favoritesSlice';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SportEvent {
    idEvent: string;
    strEvent: string;
    strThumb: string;
    strStatus: string;
    dateEvent: string;
    strLeague: string;
    strDescriptionEN?: string; // Optional description
    strHomeTeam?: string;
    strAwayTeam?: string;
    intHomeScore?: string;
    intAwayScore?: string;
}

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const [event, setEvent] = useState<SportEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dispatch = useAppDispatch();
    const favorites = useAppSelector((state) => state.favorites.items);
    // Ensure strict comparison and handle potential type mismatches if id is array
    const eventId = Array.isArray(id) ? id[0] : id;
    const isFavorite = favorites.some((fav: SportEvent) => String(fav.idEvent) === String(eventId));

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            // Try to fetch details from API
            const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${id}`);
            if (response.data && response.data.events) {
                setEvent(response.data.events[0]);
            } else {
                // Fallback: Try to find in favorites if offline or API fails, or use dummy
                const favItem = favorites.find((f: SportEvent) => f.idEvent === id);
                if (favItem) {
                    setEvent(favItem);
                } else {
                    // Simulate dummy data for the specific ID if not found
                    setEvent({
                        idEvent: id as string,
                        strEvent: 'Event Details Unavailable',
                        strThumb: 'https://via.placeholder.com/300x150?text=No+Details',
                        strStatus: 'Unknown',
                        dateEvent: '2025-01-01',
                        strLeague: 'Unknown League',
                        strDescriptionEN: 'Detailed information for this event could not be fetched from the API.',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        if (event) {
            dispatch(toggleFavorite(event));
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>Event not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <Stack.Screen options={{
                title: event.strEvent,
                headerRight: () => (
                    <TouchableOpacity onPress={handleToggleFavorite} style={{ marginRight: 10 }}>
                        <Feather name="heart" size={24} color={isFavorite ? 'red' : (isDark ? '#fff' : '#000')} fill={isFavorite ? 'red' : 'transparent'} />
                    </TouchableOpacity>
                )
            }} />

            <Image
                source={{ uri: event.strThumb || 'https://via.placeholder.com/300x150?text=No+Image' }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={[styles.title, { color: isDark ? '#ffffff' : '#333333' }]}>{event.strEvent}</Text>
                <Text style={[styles.subtitle, { color: isDark ? '#bbbbbb' : '#666666' }]}>{event.strLeague} - {event.dateEvent}</Text>

                <View style={[styles.statusBadge, { backgroundColor: '#007AFF20' }]}>
                    <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>{event.strStatus}</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#333333' }]}>Description</Text>
                <Text style={[styles.description, { color: isDark ? '#cccccc' : '#444444' }]}>
                    {event.strDescriptionEN || 'No description available for this event.'}
                </Text>

                {/* Example of extra details */}
                {(event.intHomeScore && event.intAwayScore) && (
                    <View style={styles.scoreContainer}>
                        <Text style={[styles.score, { color: isDark ? '#fff' : '#000' }]}>Score: {event.intHomeScore} - {event.intAwayScore}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
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
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    scoreContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
        alignItems: 'center'
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});
