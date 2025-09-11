import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";

import type { RootStackParamList } from "../App";

type PlaylistRouteProp = RouteProp<RootStackParamList, "Playlist">;

const PlaylistScreen: React.FC = () => {
  const route = useRoute<PlaylistRouteProp>();
  const navigation = useNavigation();
  const { playlist } = route.params;

  const [playingSong, setPlayingSong] = useState<string | null>(null);

  // Songs with YouTube video IDs
  const songs = [
    {
      id: "1",
      title: "Multo",
      artist: "Cup of Joe",
      image: require("../assets/multo.jpg"),
      videoId: "Rht8rS4cR1s",
    },
    {
      id: "2",
      title: "Old Love",
      artist: "Yuji & Putri Dahlia",
      image: require("../assets/old.jpg"),
      videoId: "SctrVF37GAQ",
    },
    {
      id: "3",
      title: "Chill Song 3",
      artist: "Artist C",
      // No image/video
    },
  ];

  const toggleSong = (id: string) => {
    setPlayingSong((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SpotifyHome" as never)}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Playlist Cover */}
      <Image source={playlist.image} style={styles.cover} resizeMode="cover" />

      {/* Playlist Title */}
      <Text style={styles.title}>{playlist.title}</Text>

      {/* Songs List */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songRow}>
            {/* Song image with press-to-play */}
            {item.image && (
              <TouchableOpacity onPress={() => toggleSong(item.id)}>
                <Image source={item.image} style={styles.songImage} />
              </TouchableOpacity>
            )}

            {/* Song details */}
            <View>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songArtist}>{item.artist}</Text>
            </View>

            {/* YouTube player */}
            {playingSong === item.id && item.videoId && (
              <View style={{ marginTop: 10, flex: 1 }}>
                <YoutubePlayer height={200} play={true} videoId={item.videoId} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    backgroundColor: "#1DB954",
    borderRadius: 6,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cover: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  songRow: {
    flexDirection: "column",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  songTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  songArtist: {
    color: "#888",
    fontSize: 14,
  },
});
