import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logoutUser } from '@/store/authSlice';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Profile</Text>
            {user && (
                <View style={styles.userInfo}>
                    <Text style={[styles.label, { color: isDark ? '#ccc' : '#666' }]}>Username:</Text>
                    <Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>{user.username}</Text>

                    <Text style={[styles.label, { color: isDark ? '#ccc' : '#666', marginTop: 10 }]}>Email:</Text>
                    <Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>{user.email}</Text>
                </View>
            )}

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, { color: isDark ? '#fff' : '#000' }]}>Dark Mode</Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    userInfo: {
        marginBottom: 40,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 40,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
