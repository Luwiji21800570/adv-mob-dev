import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function ProfilePage() {
  const user = {
    username: "froglover",
    bio: "Just a frog enjoying life 🐸✨",
    profilePic: require("../assets/frogpfp.jpg"),
    posts: [
      {
        id: 1,
        image: require("../assets/image1.jpg"),
        caption: "Forg 🌿",
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={user.profilePic} style={styles.profilePic} />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      {/* Posts Section */}
      <Text style={styles.sectionTitle}>Posts</Text>
      <View style={styles.postsContainer}>
        {user.posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Image source={post.image} style={styles.postImage} />
            <Text style={styles.caption}>{post.caption}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    alignItems: "center",
    padding: 25,
    backgroundColor: "#FFF0CE",
    marginBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#fff",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A3C1A",
  },
  bio: {
    fontSize: 15,
    color: "#5C4B24",
    marginTop: 6,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 18,
    marginVertical: 12,
    color: "#333",
  },
  postsContainer: {
    paddingHorizontal: 18,
  },
  postCard: {
    backgroundColor: "#fff",
    marginBottom: 18,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  postImage: {
    width: "100%",
    height: 280,
  },
  caption: {
    padding: 12,
    fontSize: 15,
    color: "#444",
  },
});
