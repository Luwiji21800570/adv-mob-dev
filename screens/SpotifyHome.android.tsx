import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

// 🟢 Redux + Themes
import { useSelector } from "react-redux";
import { RootState } from "../src/store";
import { themes } from "../theme/themes";

// Mock playlists
const playlists = [
  { id: 1, title: "Top Hits", type: "music", image: require("../assets/spotifyTopHits.jpg") },
  { id: 2, title: "Chill Vibes", type: "music", image: require("../assets/spotifyChill.jpg") },
  { id: 3, title: "Workout Mix", type: "music", image: require("../assets/spotifyWorkout.jpg") },
  { id: 4, title: "Party Time", type: "music", image: require("../assets/spotifyParty.jpg") },
  { id: 5, title: "Daily News", type: "podcasts", image: require("../assets/spotifyPodcast1.jpg") },
  { id: 6, title: "Motivation Talks", type: "podcasts", image: require("../assets/spotifyPodcast2.jpg") },
  { id: 7, title: "Jazz Classics", type: "music", image: require("../assets/spotifyJazz.jpg") },
  { id: 8, title: "Indie Essentials", type: "music", image: require("../assets/spotifyIndie.jpg") },
];

type HomeScreenNav = NativeStackNavigationProp<RootStackParamList, "SpotifyHome">;

const SCREEN_WIDTH = Dimensions.get("window").width;

const SpotifyHome: React.FC = () => {
  const navigation = useNavigation<HomeScreenNav>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  // 🟢 Get theme from Redux
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = themes[mode];

  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>
          Good Evening
          
        </Text>
          {/* Floating Drawer Button */}
      </View>
          <TouchableOpacity
            style={[styles.drawerFloatingBtn, { backgroundColor: theme.colors.primary }]}
            onPress={toggleDrawer}
          >
            <Text style={styles.navBtnText}>☰</Text>
          </TouchableOpacity>

      <ScrollView>
        {/* RECENTLY PLAYED GRID */}
        <View style={styles.quickGrid}>
          {playlists.slice(0, 6).map((pl) => (
            <TouchableOpacity
              key={pl.id}
              style={[styles.quickCard, { backgroundColor: theme.colors.card }]}
              onPress={() => navigation.navigate("Playlist", { playlist: pl })}
            >
              <Image source={pl.image} style={styles.quickImage} />
              <Text
                numberOfLines={1}
                style={[styles.quickTitle, { color: theme.colors.text }]}
              >
                {pl.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION: MADE FOR YOU */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Made for You
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {playlists.map((pl) => (
            <TouchableOpacity
              key={pl.id}
              style={styles.carouselCard}
              onPress={() => navigation.navigate("Playlist", { playlist: pl })}
            >
              <Image source={pl.image} style={styles.carouselImage} />
              <Text
                numberOfLines={1}
                style={[styles.carouselText, { color: theme.colors.text }]}
              >
                {pl.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SECTION: RECOMMENDED */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recommended for Today
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {playlists.reverse().map((pl) => (
            <TouchableOpacity
              key={pl.id}
              style={styles.carouselCard}
              onPress={() => navigation.navigate("Playlist", { playlist: pl })}
            >
              <Image source={pl.image} style={styles.carouselImage} />
              <Text
                numberOfLines={1}
                style={[styles.carouselText, { color: theme.colors.text }]}
              >
                {pl.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* MINI PLAYER */}
      <View style={[styles.player, { backgroundColor: theme.colors.card }]}>
        <Image
          source={require("../assets/spotify.jpg")}
          style={styles.playerImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.songTitle, { color: theme.colors.text }]}>
            Song Name
          </Text>
          <Text style={[styles.songArtist, { color: theme.colors.textSecondary }]}>
            Artist
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.icon}>⏯</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>⏭</Text>
        </TouchableOpacity>
      </View>

      {/* BACKDROP */}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}

      {/* DRAWER */}
      <Animated.View
        style={[
          styles.drawer,
          { backgroundColor: theme.colors.card, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require("../assets/rin.jpg")}
            style={[styles.drawerProfilePic, { borderColor: theme.colors.primary }]}
          />
          <Text style={[styles.drawerName, { color: theme.colors.text }]}>
            Looweji
          </Text>
          <Text style={[styles.drawerSubtitle, { color: theme.colors.textSecondary }]}>
            Premium User
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("SpotifyProfile");
          }}
        >
          <Text style={styles.drawerIcon}>👤</Text>
          <Text style={[styles.drawerText, { color: theme.colors.text }]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("SpotifySettings");
          }}
        >
          <Text style={styles.drawerIcon}>⚙️</Text>
          <Text style={[styles.drawerText, { color: theme.colors.text }]}>
            Settings
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <TouchableOpacity
          style={[styles.drawerItem, { marginTop: "auto" }]}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("Spotify");
          }}
        >
          <Text style={styles.drawerIcon}>🚪</Text>
          <Text style={[styles.drawerText, { color: theme.colors.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SpotifyHome;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  navBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
  },

  // Quick grid
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  quickCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 10,
    width: "48%",
    overflow: "hidden",
  },
  quickImage: { width: 50, height: 50 },
  quickTitle: { marginLeft: 10, fontWeight: "600", flexShrink: 1 },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
  },
  carousel: { paddingHorizontal: 15 },
  carouselCard: { marginRight: 15, width: 140 },
  carouselImage: { width: 140, height: 140, borderRadius: 8 },
  carouselText: { marginTop: 5, fontWeight: "500" },

  // Player
  player: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songTitle: { fontWeight: "bold" },
  songArtist: { fontSize: 12 },
  icon: { fontSize: 20, marginLeft: 10 },

  // Drawer
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.7,
    padding: 20,
    zIndex: 10,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
  drawerHeader: { alignItems: "center", marginBottom: 30 },
  drawerProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
  },
  drawerName: { fontSize: 18, fontWeight: "bold" },
  drawerSubtitle: { fontSize: 12 },
  divider: { height: 1, marginVertical: 15 },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  drawerIcon: { fontSize: 18, marginRight: 10 },
  drawerText: { fontSize: 16 },
    
    
});
