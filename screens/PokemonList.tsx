import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { RootStackParamList } from "../App";

interface Pokemon {
  id: number | null;
  name: string;
  image: string | null;
  types: string[];
}

type NavProp = NativeStackNavigationProp<RootStackParamList, "PokemonList">;

const PAGE_LIMIT = 20;
const CACHE_KEY = "pokemon_cache_v1";
const CACHE_TS_KEY = "pokemon_cache_ts_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const PokemonList: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    (async () => {
      const cached = await loadCacheIfValid();
      if (cached) {
        setPokemon(cached);
        setOffset(cached.length);
        setHasMore(true);
      } else {
        loadPage(0, true);
      }
    })();
  }, []);

  const loadCacheIfValid = async (): Promise<Pokemon[] | null> => {
    try {
      const tsStr = await AsyncStorage.getItem(CACHE_TS_KEY);
      const dataStr = await AsyncStorage.getItem(CACHE_KEY);
      if (!tsStr || !dataStr) return null;

      const ts = Number(tsStr);
      if (Number.isNaN(ts)) return null;
      if (Date.now() - ts > CACHE_TTL_MS) return null; // expired

      return JSON.parse(dataStr) as Pokemon[];
    } catch {
      return null;
    }
  };

  const saveCache = async (fullList: Pokemon[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fullList));
      await AsyncStorage.setItem(CACHE_TS_KEY, String(Date.now()));
    } catch (err) {
      console.warn("Cache save failed", err);
    }
  };

  const fetchPokemonPage = async (pageOffset = 0, limit = PAGE_LIMIT): Promise<Pokemon[]> => {
    const listUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${pageOffset}`;
    const listResp = await axios.get(listUrl);
    const results = listResp.data.results as { name: string; url: string }[];

    const detailed = await Promise.all(
      results.map(async (r) => {
        try {
          const d = await axios.get(r.url);
          const id = d.data.id;
          const name = d.data.name;
          const image =
            d.data.sprites?.other?.["official-artwork"]?.front_default ||
            d.data.sprites?.front_default ||
            null;
          const types = d.data.types.map((t: any) => t.type.name);
          return { id, name, image, types };
        } catch {
          return { id: null, name: r.name, image: null, types: [] };
        }
      })
    );

    return detailed;
  };

  const loadPage = async (pageOffset = 0, reset = false): Promise<void> => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const page = await fetchPokemonPage(pageOffset, PAGE_LIMIT);
      const newList = reset ? page : [...pokemon, ...page];
      setPokemon(newList);
      setOffset(newList.length);
      setHasMore(page.length === PAGE_LIMIT);
      await saveCache(newList);
    } catch (err) {
      setError("Failed to fetch Pokémon. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const page = await fetchPokemonPage(0, PAGE_LIMIT);
      setPokemon(page);
      setOffset(page.length);
      setHasMore(page.length === PAGE_LIMIT);
      await saveCache(page);
    } catch {
      setError("Refresh failed. Showing cached data if available.");
      Alert.alert("Refresh failed", "Could not update data — showing cached list.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onEndReached = () => {
    if (loading || !hasMore) return;
    loadPage(offset, false);
  };

  const renderItem = ({ item }: { item: Pokemon }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.sprite} resizeMode="contain" />
      ) : (
        <View style={[styles.sprite, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{capitalize(item.name)}</Text>
      <View style={styles.typeRow}>
        {item.types.map((t) => (
          <View key={t} style={styles.typeBadge}>
            <Text style={styles.typeText}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* 🌈 Gradient Header */}
      <LinearGradient colors={["#FF5252", "#FFCA28"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pokémon List</Text>
      </LinearGradient>

      {/* ⚠️ Error Message */}
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* 🐾 Pokémon Grid */}
      <FlatList
        data={pokemon}
        keyExtractor={(item, idx) => String(item.id ?? item.name ?? idx)}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#F57C00" />
            </View>
          ) : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

const capitalize = (s: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 22,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    alignItems: "center",
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  sprite: {
    width: 100,
    height: 100,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  placeholderText: { color: "#888" },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textTransform: "capitalize",
  },
  typeRow: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    margin: 2,
  },
  typeText: { fontSize: 12, color: "#555" },
  footer: { padding: 12, alignItems: "center" },
  center: { padding: 16, alignItems: "center" },
  errorText: { color: "crimson" },
});

export default PokemonList;
