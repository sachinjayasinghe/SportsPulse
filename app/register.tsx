import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginUser } from '@/store/authSlice';
import { Link, useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required').min(3, 'Too short!'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Too short!'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

export default function RegisterScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleRegister = async (values: any) => {
        // For this assignment, we'll just log the user in directly after "registration"
        // In a real app, you'd call a register API endpoint first
        const resultAction = await dispatch(loginUser({ username: values.username, password: values.password }));
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
            marginBottom: 30,
            textAlign: 'center',
            color: isDark ? '#ffffff' : '#333333',
        },
        inputContainer: {
            marginBottom: 15,
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
            backgroundColor: '#34C759', // Green for register
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
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ backgroundColor: isDark ? '#121212' : '#f5f5f5' }}>
                <View style={styles.container}>
                    <Text style={styles.header}>Create Account</Text>

                    <Formik
                        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={RegisterSchema}
                        onSubmit={handleRegister}
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
                                        placeholder="Email"
                                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.errorText}>{errors.email}</Text>
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

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        value={values.confirmPassword}
                                        secureTextEntry
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
                                    onPress={() => handleSubmit()}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Link href="/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Already have an account? Login</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
