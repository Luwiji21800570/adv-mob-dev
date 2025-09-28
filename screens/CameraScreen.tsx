import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import Slider from "@react-native-community/slider";

export default function CameraScreen() {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [filter, setFilter] = useState<"none" | "grayscale" | "sepia">("none");
  const [intensity, setIntensity] = useState(1);

  // ask for permissions
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  const takePhoto = async () => {
    if (camera.current == null) return;
    const photo = await camera.current.takePhoto({});
    setPhotoUri("file://" + photo.path);
  };

  const cycleFilter = () => {
    setFilter((prev) =>
      prev === "none" ? "grayscale" : prev === "grayscale" ? "sepia" : "none"
    );
  };

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const renderPreview = () => {
    if (!photoUri) return null;

    if (filter === "grayscale") {
      return (
        <Grayscale amount={intensity}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
        </Grayscale>
      );
    }

    if (filter === "sepia") {
      return (
        <Sepia amount={intensity}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
        </Sepia>
      );
    }

    return <Image source={{ uri: photoUri }} style={styles.preview} />;
  };

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        renderPreview()
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text}>📸</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={cycleFilter}>
          <Text style={styles.text}>🎨</Text>
        </TouchableOpacity>

        <Slider
          style={{ width: 150, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={intensity}
          onValueChange={setIntensity}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: { flex: 1, resizeMode: "cover" },
  controls: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
  },
  button: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 50,
  },
  text: { color: "white", fontSize: 20 },
});
