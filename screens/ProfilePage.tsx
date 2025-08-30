import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function ProfilePage() {
  // Static profile for froglover
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
    backgroundColor: "#f8f8f8",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  postsContainer: {
    paddingHorizontal: 15,
  },
  postCard: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  caption: {
    padding: 10,
  },
});
