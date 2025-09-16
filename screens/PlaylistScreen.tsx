import React, { useReducer, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation, useRoute } from "@react-navigation/native";

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

  const [state, dispatch] = useReducer(playlistReducer, {
    past: [],
    present: [],
    future: [],
  });

  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

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
  };

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const playSong = (url: string) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      setPlayingVideoId(videoId);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Playlist Title */}
      <Text style={styles.title}>{playlist.title}</Text>

      {/* Add Song */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Song Title"
          placeholderTextColor="#888"
          value={newSongTitle}
          onChangeText={setNewSongTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="YouTube Link"
          placeholderTextColor="#888"
          value={newSongUrl}
          onChangeText={setNewSongUrl}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addSong}>
          <Text style={styles.addBtnText}>＋ Add Song</Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => dispatch({ type: "UNDO" })}>
          <Text style={styles.controlText}>⟲ Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "REDO" })}>
          <Text style={styles.controlText}>⟳ Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
          <Text style={[styles.controlText, { color: "#E74C3C" }]}>✖ Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Songs */}
      <FlatList
        data={state.present}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => playSong(item.url)}
          >
            <Text style={styles.songText}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => dispatch({ type: "REMOVE", id: item.id })}
            >
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No songs yet. Add one!</Text>
        }
      />

      {/* YouTube Player */}
      {playingVideoId && (
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={230}
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
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  backBtn: { marginBottom: 15 },
  backText: { color: "#1DB954", fontSize: 16, fontWeight: "600" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#fff" },
  inputContainer: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  controlText: { color: "#1DB954", fontSize: 16, fontWeight: "600" },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  songText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  deleteBtn: { fontSize: 18, color: "#E74C3C" },
  emptyText: { textAlign: "center", color: "#888", marginTop: 20 },
  playerContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
});
