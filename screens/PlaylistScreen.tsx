import React, { useReducer, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation, useRoute } from "@react-navigation/native";

// ✅ redux theme
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { themes } from "../theme/themes";

type Song = {
  id: string;
  title: string;
  url: string;
};

type State = {
  past: Song[][];
  present: Song[];
  future: Song[][];
};

type Action =
  | { type: "ADD"; song: Song }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; songs: Song[] };

function playlistReducer(state: State, action: Action): State {
  const { past, present, future } = state;
  switch (action.type) {
    case "ADD":
      return {
        past: [...past, present],
        present: [...present, action.song],
        future: [],
      };
    case "REMOVE":
      return {
        past: [...past, present],
        present: present.filter((s) => s.id !== action.id),
        future: [],
      };
    case "CLEAR":
      return { past: [...past, present], present: [], future: [] };
    case "UNDO":
      if (!past.length) return state;
      return {
        past: past.slice(0, -1),
        present: past[past.length - 1],
        future: [present, ...future],
      };
    case "REDO":
      if (!future.length) return state;
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };
    case "SET":
      return { past: [], present: action.songs, future: [] };
    default:
      return state;
  }
}

const PlaylistScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { playlist } = route.params;

  // ✅ theme
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = themes[mode];

  const [state, dispatch] = useReducer(playlistReducer, {
    past: [],
    present: [],
    future: [],
  });

  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const storageKey = `playlist_${playlist.id}_songs`;

  // Load from storage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        dispatch({ type: "SET", songs: JSON.parse(saved) });
      }
    })();
  }, [storageKey]);

  // Save whenever present changes
  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(state.present));
  }, [state.present]);

  const addSong = () => {
    if (!newSongTitle.trim() || !newSongUrl.trim()) return;
    const newSong: Song = {
      id: Date.now().toString(),
      title: newSongTitle.trim(),
      url: newSongUrl.trim(),
    };
    dispatch({ type: "ADD", song: newSong });
    setNewSongTitle("");
    setNewSongUrl("");
    setModalVisible(false);
  };

  // ✅ improved regex for all YouTube URL formats
  const extractVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const playSong = (url: string) => {
    const videoId = extractVideoId(url);
    console.log("🎵 Extracted VideoId:", videoId); // ✅ debug
    if (videoId) {
      setPlayingVideoId(videoId);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* HEADER with cover */}
      <View style={styles.header}>
        {/* ✅ Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: theme.colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Image
          source={playlist.image || require("../assets/spotify.jpg")}
          style={styles.coverImage}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {playlist.title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {state.present.length} songs
        </Text>

        {/* Controls: Play, Undo/Redo */}
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              if (state.present[0]) playSong(state.present[0].url);
            }}
          >
            <Text style={styles.playBtnText}>▶ Play</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch({ type: "UNDO" })}>
            <Text style={[styles.controlText, { color: theme.colors.primary }]}>
              ⟲
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch({ type: "REDO" })}>
            <Text style={[styles.controlText, { color: theme.colors.primary }]}>
              ⟳
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
            <Text style={[styles.controlText, { color: "#E74C3C" }]}>✖</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Song List */}
      <FlatList
        data={state.present}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.songItem, { backgroundColor: theme.colors.card }]}
            onPress={() => playSong(item.url)}
          >
            <View>
              <Text style={[styles.songTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.songSub, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.url}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => dispatch({ type: "REMOVE", id: item.id })}
            >
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
            No songs yet. Add one!
          </Text>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Modal for adding a song */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.colors.card }]}
          >
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Song Title"
              placeholderTextColor={theme.colors.placeholder}
              value={newSongTitle}
              onChangeText={setNewSongTitle}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="YouTube Link"
              placeholderTextColor={theme.colors.placeholder}
              value={newSongUrl}
              onChangeText={setNewSongUrl}
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
              onPress={addSong}
            >
              <Text style={styles.addBtnText}>Add Song</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={[styles.cancelText, { color: theme.colors.primary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sticky YouTube Player */}
      {playingVideoId && (
        <View
          style={[
            styles.playerContainer,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
          ]}
        >
          <YoutubePlayer
            height={220} // ✅ taller so video is visible
            play={true}
            videoId={playingVideoId}
            onChangeState={(state) => {
              if (state === "ended") setPlayingVideoId(null);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", padding: 20 },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
  coverImage: { width: 180, height: 180, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, marginBottom: 15 },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },
  playBtn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
  },
  playBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  controlText: { fontSize: 20 },

  // Songs
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  songTitle: { fontSize: 16, fontWeight: "600" },
  songSub: { fontSize: 12 },
  deleteBtn: { fontSize: 18, color: "#E74C3C" },
  emptyText: { textAlign: "center", marginTop: 20 },

  // FAB
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { fontSize: 28, color: "#fff" },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 16,
  },
  addBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  cancelText: { textAlign: "center", fontSize: 16 },

  // Player
  playerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    height: 220, // ✅ make video visible
  },
});
