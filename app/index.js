import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />
      {/* Linear gradient */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0)",
          "rgba(255,255,255,0.5)",
          "white",
          "white",
        ]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      />
      {/* content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>AuraWalls</Text>
        <Text style={styles.punchline}>Every Image Tells a Story</Text>
        <View>
          <Pressable
            onPress={() => router.push("/home")}
            style={styles.startButton}
          >
            <Text style={styles.startText}>Start Exploring</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(220),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(150),
    bottom: 0,
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
  },
  title: {
    fontSize: hp(10),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  punchline: {
    fontSize: hp(4),
    letterSpacing: 1,
    marginBottom: 20,
    fontWeight: theme.fontWeights.medium,
  },
  startButton: {
    marginBottom: 70,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(5),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
