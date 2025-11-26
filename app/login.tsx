import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginUser } from '@/store/authSlice';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleLogin = async (values: any) => {
        const resultAction = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(resultAction)) {
            router.replace('/(tabs)');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            backgroundColor: isDark ? '#121212' : '#f5f5f5',
        },
        header: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 40,
            textAlign: 'center',
            color: isDark ? '#ffffff' : '#333333',
        },
        inputContainer: {
            marginBottom: 20,
        },
        input: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            padding: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? '#333333' : '#ddd',
            color: isDark ? '#ffffff' : '#333',
            fontSize: 16,
        },
        errorText: {
            color: '#ff4444',
            fontSize: 12,
            marginTop: 5,
            marginLeft: 5,
        },
        button: {
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10,
        },
        buttonText: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '600',
        },
        linkText: {
            marginTop: 20,
            textAlign: 'center',
            color: '#007AFF',
            fontSize: 16,
        },
        apiError: {
            color: '#ff4444',
            textAlign: 'center',
            marginBottom: 15,
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ backgroundColor: isDark ? '#121212' : '#f5f5f5' }}>
                <View style={styles.container}>
                    <Text style={styles.header}>SportsPulse</Text>

                    {error && <Text style={styles.apiError}>{error}</Text>}

                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                        value={values.username}
                                        autoCapitalize="none"
                                    />
                                    {touched.username && errors.username && (
                                        <Text style={styles.errorText}>{errors.username}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry
                                    />
                                    {touched.password && errors.password && (
                                        <Text style={styles.errorText}>{errors.password}</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
                                    onPress={() => handleSubmit()}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
