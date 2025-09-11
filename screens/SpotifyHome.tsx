import React, { useState } from "react";
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
import type { RootStackParamList } from "../App"; // 👈 adjust if needed

const playlists = [
  { id: 1, title: "Top Hits", image: require("../assets/spotifyTopHits.jpg") },
  { id: 2, title: "Chill Vibes", image: require("../assets/spotifyChill.jpg") },
  { id: 3, title: "Workout Mix", image: require("../assets/spotifyWorkout.jpg") },
  { id: 4, title: "Party Time", image: require("../assets/spotifyParty.jpg") },
];

type HomeScreenNav = NativeStackNavigationProp<
  RootStackParamList,
  "SpotifyHome"
>;

const SCREEN_WIDTH = Dimensions.get("window").width;

const SpotifyHome: React.FC = () => {
  const navigation = useNavigation<HomeScreenNav>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn} onPress={toggleDrawer}>
          <Text style={styles.navBtnText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Good Evening 🎶</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Your Playlists</Text>
        <View style={styles.playlistGrid}>
          {playlists.map((pl) => (
            <TouchableOpacity key={pl.id} style={styles.playlistCard}>
              <Image source={pl.image} style={styles.playlistImage} />
              <Text style={styles.playlistTitle}>{pl.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.player}>
        <Image
          source={require("../assets/spotify.jpg")}
          style={styles.playerImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.songTitle}>Song Name</Text>
          <Text style={styles.songArtist}>Artist</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.playBtn}>▶️</Text>
        </TouchableOpacity>
      </View>

      {drawerOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require("../assets/rin.jpg")}
            style={styles.drawerProfilePic}
          />
          <Text style={styles.drawerName}>Looweji</Text>
        </View>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("SpotifyProfile");
          }}
        >
          <Text style={styles.drawerText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("SpotifySettings");
          }}
        >
          <Text style={styles.drawerText}>Settings</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SpotifyHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },

  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  navBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  navBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold"
  },

  scroll: {
    paddingHorizontal: 15,
    paddingBottom: 100
  },
  sectionTitle: {
    color: "#1DB954",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },

  playlistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  playlistCard: {
    width: "48%",
    backgroundColor: "#111",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  playlistImage: {
    width: "100%",
    height: 120
  },
  playlistTitle: {
    color: "#fff",
    padding: 10,
    fontWeight: "600",
    fontSize: 14,
  },

  player: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10
  },
  songTitle: {
    color: "#fff",
    fontWeight: "bold"
  },
  songArtist: {
    color: "#888",
    fontSize: 12
  },
  playBtn: {
    fontSize: 28,
    color: "#1DB954",
    marginLeft: 10
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: "#111",
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

  // Drawer Profile
  drawerHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  drawerProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  drawerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Drawer Items
  drawerItem: {
    paddingVertical: 12
  },
  drawerText: {
    color: "#fff",
    fontSize: 16
  },
});
