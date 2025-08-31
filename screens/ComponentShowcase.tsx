import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function ComponentShowcase() {
  const cards = [
    {
      id: 1,
      title: "Forg",
      image: require("../assets/image1.jpg"),
      alertMsg: "Frogs go kokak !!!🚀",
      user: "froglover",
      avatar: require("../assets/frogpfp.jpg"),
    },
    {
      id: 2,
      title: "pika",
      image: require("../assets/image2.jpg"),
      alertMsg: "PIKAAAAAA ",
      user: "pikachu",
      avatar: null, // no pfp yet
    },
    {
      id: 3,
      title: "shroomie",
      image: require("../assets/image3.jpg"),
      alertMsg: "Mushroomm!! 🍄✨",
      user: "mushlife",
      avatar: null,
    },
    {
      id: 4,
      title: "grootie",
      image: require("../assets/image4.jpg"),
      alertMsg: "I AM GROOT",
      user: "iamgroot",
      avatar: null,
    },
    {
      id: 5,
      title: "octie",
      image: require("../assets/image5.jpg"),
      alertMsg: "octopus 🐙",
      user: "octopus8",
      avatar: null,
    },
    {
      id: 6,
      title: "santa",
      image: require("../assets/image6.jpg"),
      alertMsg: "christmas 🎅🎄",
      user: "xmasvibes",
      avatar: null,
    },
  ];

  const [liked, setLiked] = useState({});

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.header}>✨ For You Page ✨</Text>

      {cards.map((card) => (
        <View key={card.id} style={styles.card}>
          {/* top bar like instagram */}
          <View style={styles.userRow}>
            {card.avatar ? (
              <Image source={card.avatar} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <Text style={styles.username}>{card.user}</Text>
          </View>

          {/* image */}
          <Image source={card.image} style={styles.image} resizeMode="cover" />

          {/* actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={() => toggleLike(card.id)}>
              <Text style={styles.actionIcon}>
                {liked[card.id] ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert("HI", card.alertMsg)}>
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.actionIcon}>🔄️</Text>
            </TouchableOpacity>
          </View>

          {/* likes */}
          <Text style={styles.likes}>
            {liked[card.id] ? "You and others liked this" : "0 likes"}
          </Text>

          {/* caption */}
          <Text style={styles.caption}>
            <Text style={styles.username}>{card.user}</Text> {card.title} 🌿
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatarImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
  },
  image: {
    width: "100%",
    height: 400, // more square proportion
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 15,
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 15,
  },
  likes: {
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  caption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
