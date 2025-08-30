import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.headerTitle}>🚀 My App</Text>
        <Text style={styles.headerSubtitle}>
          Your journey starts here
        </Text>
      </View>

      {/* Auth Buttons (placeholders for now) */}
      <View style={styles.authContainer}>
        <TouchableOpacity style={[styles.authButton, { backgroundColor: '#4a90e2' }]}>
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.authButton, { backgroundColor: '#27ae60' }]}>
          <Text style={styles.authButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ComponentShowcase')}
      >
        <Text style={styles.buttonText}>Go to Component Showcase</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#27ae60' }]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Go to My Profile</Text>
      </TouchableOpacity>

      {/* Features Card */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ Features</Text>
        <Text style={styles.feature}>• </Text>
        <Text style={styles.feature}>• </Text>
        <Text style={styles.feature}>• </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f0f4f8',
  },
  headerBanner: {
    width: '100%',
    paddingVertical: 60,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#34495e',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#dfe6e9',
    marginTop: 8,
    textAlign: 'center',
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 25,
  },
  authButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    width: '85%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  featuresCard: {
    backgroundColor: '#fff',
    marginTop: 25,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#34495e',
  },
  feature: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
});
