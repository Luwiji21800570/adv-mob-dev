import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import haversine from "haversine-distance";

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const geofenceRegion = {
    latitude: 10.3157,
    longitude: 123.8854,
    radius: 100, // meters
  };

  const checkGeofence = (userLoc: { latitude: number; longitude: number }) => {
    const distance = haversine(
      { latitude: userLoc.latitude, longitude: userLoc.longitude },
      { latitude: geofenceRegion.latitude, longitude: geofenceRegion.longitude }
    );

    if (distance <= geofenceRegion.radius) {
      Alert.alert("Inside Geofence ✅", "You entered the region!");
    } else {
      Alert.alert("Outside Geofence ❌", "You left the region!");
    }
  };

  // Request runtime location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

useEffect(() => {
  let watchId: number | null = null;

  const init = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Location access is required.");
      return;
    }

    watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setUserLocation(newLocation);
        checkGeofence(newLocation);
      },
      (error) => console.log("Location error:", error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );
  };

  init();

  // ✅ Proper cleanup
  return () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
    }
  };
}, []);


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}   // 🔹 built-in user location dot
        region={
          userLocation
            ? {
                ...userLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 10.3157,
                longitude: 123.8854,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            description="Your current location"
          />
        )}

        {/* 🔹 Geofence center marker */}
        <Marker
          coordinate={{
            latitude: geofenceRegion.latitude,
            longitude: geofenceRegion.longitude,
          }}
          title="Geofence Center"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
