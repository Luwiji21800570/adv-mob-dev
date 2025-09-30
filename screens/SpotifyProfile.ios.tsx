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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { PermissionsAndroid } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import * as ImagePicker from "react-native-image-picker";

// 🟢 Redux + Themes
import { useSelector } from "react-redux";
import { RootState } from "../src/store";
import { themes } from "../theme/themes";

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
  theme,
}: {
  username: string;
  email: string;
  genres: string[];
  photoUri?: string;
  visible: boolean;
  theme: typeof themes["light"];
}) {
  const fallbackUri = useMemo(() => {
    return `https://via.placeholder.com/150/${theme.colors.primary.replace(
      "#",
      ""
    )}/ffffff?text=${encodeURIComponent(username || "User")}`;
  }, [username, theme.colors.primary]);

  if (!visible) return null;

  return (
    <FadeInView
      visible={visible}
      style={[
        styles.previewCard,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Image
        source={{ uri: photoUri || fallbackUri }}
        style={[styles.previewImage, { borderColor: theme.colors.primary }]}
      />
      <Text style={[styles.previewName, { color: theme.colors.text }]}>
        {username || "Username"}
      </Text>
      <Text
        style={[styles.previewEmail, { color: theme.colors.textSecondary }]}
      >
        {email || "email@example.com"}
      </Text>
      <View
        style={[
          styles.genrePill,
          { backgroundColor: theme.colors.accentPill },
        ]}
      >
        <Text style={[styles.genreText, { color: theme.colors.primary }]}>
          {genres.length > 0 ? genres.join(", ") : "Genre"}
        </Text>
      </View>
    </FadeInView>
  );
});

const SpotifyProfile: React.FC = () => {
  const navigation = useNavigation<ProfileNav>();

  // 🟢 get theme from Redux
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = themes[mode];

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const [errUser, setErrUser] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errGenre, setErrGenre] = useState("");

  const previewVisible = useMemo(
    () =>
      username.length > 0 ||
      email.length > 0 ||
      genres.length > 0 ||
      !!photoUri,
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
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(
        () => null
      );
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
  console.log("📸 pickImage called");
  Alert.alert("Upload Photo", "Choose an option", [
    {
      text: "Camera",
      onPress: () => {
        console.log("📷 Camera pressed");
        openCamera();
      },
    },
    {
      text: "Gallery",
      onPress: () => {
        console.log("🖼️ Gallery pressed");
        openGallery();
      },
    },
    { text: "Cancel", style: "cancel", onPress: () => console.log("❌ Cancel pressed") },
  ]);
};

const openCamera = async () => {
  console.log("🚀 openCamera start");
  try {
    const result = await ImagePicker.launchCamera({
      mediaType: "photo",
      includeBase64: false,
      saveToPhotos: true,
    });
    console.log("📷 Camera result:", result);
    if (result?.assets?.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  } catch (err) {
    console.warn("Camera error:", err);
  }
};

const openGallery = async () => {
  console.log("🚀 openGallery start");
  try {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: false,
    });
    console.log("🖼️ Gallery result:", result);
    if (result?.assets?.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  } catch (err) {
    console.warn("Gallery error:", err);
  }
};


return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.colors.background }}
    behavior={Platform.select({ ios: "padding", android: undefined })}
  >
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("SpotifyHome")}>
          <Text style={[styles.backBtn, { color: theme.colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.colors.text }]}>
          Create Profile 🎤
        </Text>
        <View style={{ width: 60 }} />
      </View>


      {/* Live Preview */}
      <ProfilePreview
        username={username}
        email={email}
        genres={genres}
        photoUri={photoUri}
        visible={previewVisible}
        theme={theme}
      />

      <View style={{ alignItems: "center", marginVertical: 20 }}>
             <TouchableOpacity
               style={[styles.uploadBtn, { borderColor: theme.colors.primary }]}
               onPress={pickImage}
             >
               <Text style={[styles.uploadBtnText, { color: theme.colors.primary }]}>
                 {photoUri ? "Change Photo" : "Upload Photo"}
               </Text>
             </TouchableOpacity>
           </View>

      <View style={{ height: 20 }} />

      {/* Username */}
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        Username
      </Text>
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
        <Text style={[styles.errText, { color: theme.colors.error }]}>
          {errUser}
        </Text>
      </FadeInView>

      <View style={{ height: 12 }} />

      {/* Email */}
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        Email
      </Text>
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
        <Text style={[styles.errText, { color: theme.colors.error }]}>
          {errEmail}
        </Text>
      </FadeInView>

      <View style={{ height: 12 }} />

      {/* Genre */}
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        Favorite Genres
      </Text>
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
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                  selected && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={
                    selected
                      ? [styles.genreButtonTextSelected, { color: "#000" }]
                      : [styles.genreButtonText, { color: theme.colors.text }]
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
        <Text style={[styles.errText, { color: theme.colors.error }]}>
          {errGenre}
        </Text>
      </FadeInView>

      <View style={{ height: 30 }} />

      {/* Save Profile */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
        onPress={attemptSubmit}
      >
        <Text style={styles.submitBtnText}>Save Profile</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  </KeyboardAvoidingView>
);
};

export default SpotifyProfile;

// --- styles (mostly static, colors replaced dynamically via theme) ---
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  backBtn: {
    top: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // --- Profile Preview ---
  previewCard: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    marginBottom: 14,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  previewName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  previewEmail: {
    marginTop: 6,
    fontSize: 15,
    textAlign: "center",
  },
  genrePill: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "center",
  },
  genreText: {
    fontWeight: "600",
    fontSize: 13,
  },

  // --- Labels & Errors ---
  label: {
    alignSelf: "flex-start",
    marginBottom: 6,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  errText: {
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
    borderWidth: 1,
    marginRight: 8,
    marginTop: 8,
  },
  genreButtonText: {
    fontWeight: "500",
  },
  genreButtonTextSelected: {
    fontWeight: "700",
  },

  // --- Buttons ---
  submitBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
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
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  uploadBtnText: {
    fontWeight: "600",
  },
});
