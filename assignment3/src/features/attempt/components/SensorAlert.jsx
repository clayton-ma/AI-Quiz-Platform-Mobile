import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Vibration,
  TouchableOpacity,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { Icon, Button } from "@rneui/themed";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * StabilityGuard component monitors device acceleration.
 * If the device is moving too much (shaking or in a vehicle),
 * it displays a warning overlay.
 */
export default function StabilityGuard() {
  const { theme } = useTheme();
  const [subscription, setSubscription] = useState(null);
  const [isUnstable, setIsUnstable] = useState(false);
  const lastData = useRef({ x: 0, y: 0, z: 0 });

  // Threshold for "unstable" movement (G-force)
  const STABILITY_THRESHOLD = 2.5;

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const prev = lastData.current;

      // Calculate change in acceleration (delta) to detect shaking specifically
      const delta = Math.sqrt(
        (x - prev.x) ** 2 + (y - prev.y) ** 2 + (z - prev.z) ** 2,
      );

      if (delta > STABILITY_THRESHOLD) {
        setIsUnstable(true);
        Vibration.vibrate(500);
      }

      lastData.current = accelerometerData;
    });
    setSubscription(sub);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <Modal transparent={true} visible={isUnstable} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: theme.colors.card }]}>
          <Icon name="vibration" type="material" size={50} color="#E74C3C" />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Shaking Detected
          </Text>
          <Text
            style={[styles.message, { color: theme.dark ? "#ccc" : "#7F8C8D" }]}
          >
            Please find a stable place to take the quiz. It is better for your
            eyes and ensures the best experience.
          </Text>
          <Button
            title="I am in a stable place"
            onPress={() => {
              setIsUnstable(false);
            }}
            type="clear"
            titleStyle={{ color: "#E74C3C", marginTop: 10 }}
            icon={
              <Icon
                name="close"
                size={15}
                color="#E74C3C"
                style={{ marginRight: 5, marginTop: 10 }}
              />
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertBox: {
    width: "100%",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
