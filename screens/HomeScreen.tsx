import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

// Match your App.tsx stack key exactly → 'HomeScreen'
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to my app</Text>

      <Button
        title="Go to Component Showcase"
        onPress={() => navigation.navigate('Spotify')} // ✅ Updated to an existing screen
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Go to Spotify Screen"
          onPress={() => navigation.navigate('Spotify')}
        />
      </View>

      {/* 👇 NEW BUTTON for the Pokémon List */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Go to Pokémon List"
          onPress={() => navigation.navigate('PokemonList')}
          color="#EF5350" // Pokémon red accent
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});
