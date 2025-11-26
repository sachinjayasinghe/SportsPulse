import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loadFavorites } from '@/store/favoritesSlice';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
    const dispatch = useAppDispatch();
    const { items, isLoading } = useAppSelector((state) => state.favorites);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useFocusEffect(
        useCallback(() => {
            dispatch(loadFavorites());
        }, [dispatch])
    );

    const renderItem = ({ item }: { item: any }) => (
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
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#333333' }]}>My Favorites</Text>
            </View>

            {items.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ color: isDark ? '#888' : '#666', fontSize: 16 }}>No favorites yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.idEvent}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
        paddingTop: 40,
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
        height: 150,
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
    },
});
