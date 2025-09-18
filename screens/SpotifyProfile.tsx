import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import * as ImagePicker from "react-native-image-picker";

import AnimatedInput from "../components/AnimatedInput";
import FadeInView from "../components/FadeInView";
import Shakeable, { ShakeableRef } from "../components/Shakeable";

type ProfileNav = NativeStackNavigationProp<
  RootStackParamList,
  "SpotifyProfile"
>;

const GENRES = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"] as const;
type Genre = (typeof GENRES)[number];

const STORAGE_KEY = "@spotify_profile_form";

// --- validators ---
const validateUsername = (s: string) => {
  const re = /^[A-Za-z0-9_]{3,20}$/;
  if (s.length === 0) return "Username is required.";
  if (!re.test(s)) return "3–20 chars — letters, numbers, underscores only.";
  return "";
};

const validateEmail = (s: string) => {
  if (s.length === 0) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(s)) return "Please enter a valid email.";
  return "";
};

const validateGenre = (genres: string[]) => {
  if (genres.length === 0) return "Please select at least one genre.";
  return "";
};

// --- profile preview card ---
const ProfilePreview = React.memo(function ProfilePreview({
  username,
  email,
  genres,
  photoUri,
  visible,
}: {
  username: string;
  email: string;
  genres: string[];
  photoUri?: string;
  visible: boolean;
}) {
  const fallbackUri = useMemo(() => {
    return `https://via.placeholder.com/150/1DB954/ffffff?text=${encodeURIComponent(
      username || "User"
    )}`;
  }, [username]);

  if (!visible) return null;

  return (
    <FadeInView visible={visible} style={styles.previewCard}>
      <Image
        source={{ uri: photoUri || fallbackUri }}
        style={styles.previewImage}
      />
      <Text style={styles.previewName}>{username || "Username"}</Text>
      <Text style={styles.previewEmail}>{email || "email@example.com"}</Text>
      <View style={styles.genrePill}>
        <Text style={styles.genreText}>
          {genres.length > 0 ? genres.join(", ") : "Genre"}
        </Text>
      </View>
    </FadeInView>
  );
});


const SpotifyProfile: React.FC = () => {
  const navigation = useNavigation<ProfileNav>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const [errUser, setErrUser] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errGenre, setErrGenre] = useState("");

  const previewVisible = useMemo(
    () => username.length > 0 || email.length > 0 || genres.length > 0 || !!photoUri,
    [username, email, genres, photoUri]
  );

  // shake refs
  const userRef = useRef<ShakeableRef>(null);
  const emailRef = useRef<ShakeableRef>(null);
  const genreRef = useRef<ShakeableRef>(null);

  // real-time validation
  useEffect(() => setErrUser(validateUsername(username)), [username]);
  useEffect(() => setErrEmail(validateEmail(email)), [email]);
  useEffect(() => setErrGenre(validateGenre(genres)), [genres]);

  // load cached form
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.username) setUsername(parsed.username);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.genres) setGenres(parsed.genres);
          if (parsed.photoUri) setPhotoUri(parsed.photoUri);
        }
      } catch (e) {
        console.warn("Could not load cached form", e);
      }
    })();
  }, []);

  // save to cache (debounced)
  useEffect(() => {
    const toSave = { username, email, genres, photoUri };
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => null);
    }, 300);
    return () => clearTimeout(id);
  }, [username, email, genres, photoUri]);

  const attemptSubmit = useCallback(() => {
    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    const gErr = validateGenre(genres);

    setErrUser(uErr);
    setErrEmail(eErr);
    setErrGenre(gErr);

    if (!uErr && !eErr && !gErr) {
      AsyncStorage.removeItem(STORAGE_KEY)
        .catch(() => null)
        .finally(() => {
          setUsername("");
          setEmail("");
          setGenres([]);
          setPhotoUri(undefined);
        });
    } else {
      if (uErr) userRef.current?.shake();
      if (eErr) emailRef.current?.shake();
      if (gErr) genreRef.current?.shake();
    }
  }, [username, email, genres]);

  const toggleGenre = (g: string) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", selectionLimit: 1 },
      (res) => {
        if (res.assets && res.assets.length > 0) {
          setPhotoUri(res.assets[0].uri);
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#000" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate("SpotifyHome")}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Create Profile 🎤</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* live preview */}
        <ProfilePreview
          username={username}
          email={email}
          genres={genres}
          photoUri={photoUri}
          visible={previewVisible}
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Text style={styles.uploadBtnText}>
            {photoUri ? "Change Photo" : "Upload Photo"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <Shakeable ref={userRef}>
          <AnimatedInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            autoCapitalize="none"
            autoCorrect={false}
            hasError={!!errUser}
          />
        </Shakeable>
        <FadeInView visible={!!errUser}>
          <Text style={styles.errText}>{errUser}</Text>
        </FadeInView>

        <View style={{ height: 12 }} />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <Shakeable ref={emailRef}>
          <AnimatedInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            hasError={!!errEmail}
          />
        </Shakeable>
        <FadeInView visible={!!errEmail}>
          <Text style={styles.errText}>{errEmail}</Text>
        </FadeInView>

        <View style={{ height: 12 }} />

        {/* Genre */}
        <Text style={styles.label}>Favorite Genres</Text>
        <Shakeable ref={genreRef}>
          <View style={styles.genreRow}>
            {GENRES.map((g) => {
              const selected = genres.includes(g);
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => toggleGenre(g)}
                  style={[
                    styles.genreButton,
                    selected ? styles.genreButtonSelected : undefined,
                  ]}
                >
                  <Text
                    style={
                      selected
                        ? styles.genreButtonTextSelected
                        : styles.genreButtonText
                    }
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Shakeable>
        <FadeInView visible={!!errGenre}>
          <Text style={styles.errText}>{errGenre}</Text>
        </FadeInView>

        <View style={{ height: 30 }} />

        <TouchableOpacity style={styles.submitBtn} onPress={attemptSubmit}>
          <Text style={styles.submitBtnText}>Save Profile</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SpotifyProfile;

// --- styles ---
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "#000",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  backBtn: {
    color: "#1DB954",
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // --- Profile Preview ---
  previewCard: {
    width: "100%",
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    alignItems: "center", // centers content
    marginVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#222",
  },
  previewImage: {
    width: 120, // bigger circle
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1DB954",
    marginBottom: 14,
    shadowColor: "#1DB954",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  previewName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  previewEmail: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 15,
    textAlign: "center",
  },
  genrePill: {
    marginTop: 12,
    backgroundColor: "rgba(29,185,84,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "center",
  },
  genreText: {
    color: "#1DB954",
    fontWeight: "600",
    fontSize: 13,
  },

  // --- Labels & Errors ---
  label: {
    alignSelf: "flex-start",
    color: "#bbb",
    marginBottom: 6,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  errText: {
    color: "#ff6b6b",
    marginTop: 6,
    alignSelf: "flex-start",
  },

  // --- Genres ---
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  genreButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
    marginTop: 8,
  },
  genreButtonSelected: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  genreButtonText: {
    color: "#eee",
    fontWeight: "500",
  },
  genreButtonTextSelected: {
    color: "#000",
    fontWeight: "700",
  },

  // --- Buttons ---
  submitBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#1DB954",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  uploadBtn: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "transparent",
    borderColor: "#1DB954",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  uploadBtnText: {
    color: "#1DB954",
    fontWeight: "600",
  },
});


