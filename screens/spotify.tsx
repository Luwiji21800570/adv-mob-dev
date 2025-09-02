import LinearGradient from 'react-native-linear-gradient';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

export default function Spotify() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <LinearGradient
      colors={['#222222', '#000000']} 
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/spotify.jpg')}
          style={styles.logo}
          accessibilityLabel="Spotify logo"
        />
        <Text style={styles.title} accessibilityRole="header">
          Spotify
        </Text>

        <View style={styles.form}>
          {isSignUp ? (
            <>
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#888"
                style={styles.input}
                accessibilityLabel="Enter your email address"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#888"
                style={styles.input}
                accessibilityLabel="Enter your full name"
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
                accessibilityLabel="Enter your password"
              />

              <View style={styles.row}>
                <Text style={styles.labelGreen}>Date of Birth:</Text>
                <TextInput
                  placeholder="DD"
                  placeholderTextColor="#888"
                  style={[styles.input, styles.dateInput]}
                  accessibilityLabel="Day of birth"
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="MM"
                  placeholderTextColor="#888"
                  style={[styles.input, styles.dateInput]}
                  accessibilityLabel="Month of birth"
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="YY"
                  placeholderTextColor="#888"
                  style={[styles.input, styles.dateInput]}
                  accessibilityLabel="Year of birth"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.genderBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Select Male gender"
                >
                  <Text style={styles.genderTextGreen}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.genderBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Select Female gender"
                >
                  <Text style={styles.genderTextGreen}>Female</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#888"
                style={styles.input}
                accessibilityLabel="Enter your username"
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
                accessibilityLabel="Enter your password"
              />
              <Text style={styles.forgot} accessibilityRole="link">
                Forgot password?
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.mainButton}
            accessibilityRole="button"
            accessibilityLabel={isSignUp ? 'Sign Up to Spotify' : 'Sign In to Spotify'}
          >
            <Text style={styles.mainButtonText}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <Text
            style={[styles.or, styles.orGreen]}
            accessibilityLabel={
              isSignUp
                ? 'Sign up with social accounts'
                : 'Be correct with social accounts'
            }
          >
            {isSignUp ? 'Sign up with' : 'Be Correct With'}
          </Text>

          <View
            style={styles.socialRow}
            accessible={true}
            accessibilityLabel="Sign in with social accounts"
          >
            <TouchableOpacity
              style={styles.socialBtn}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Facebook"
            >
              <Text style={styles.socialText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Google"
            >
              <Text style={styles.socialText}>G</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={{ marginTop: 20 }}
            accessibilityRole="button"
            accessibilityLabel={
              isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"
            }
          >
            {isSignUp ? (
              <Text style={{ textAlign: 'center', color: '#888' }}>
                Already have an account?{' '}
                <Text style={{ color: '#1DB954', fontWeight: 'bold' }}>Sign In</Text>
              </Text>
            ) : (
              <Text style={{ textAlign: 'center', color: '#888' }}>
                Don’t have an account?{' '}
                <Text style={{ color: '#1DB954', fontWeight: 'bold' }}>Sign Up</Text>
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 15,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  genderTextGreen: {
    color: '#1DB954',
  },
  forgot: {
    color: '#888',
    textAlign: 'right',
    marginBottom: 12,
  },
  mainButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
  },
  mainButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  or: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 15,
  },
  orGreen: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialBtn: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: '#fff',
    fontSize: 20,
  },
  labelGreen: {
    color: '#1DB954',
    marginTop: 10,
    marginBottom: 5,
  },
});
