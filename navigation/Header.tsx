import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const icons = {
  // recycle: require("../assets/icons/recycle.png"),
  // cafe: require("../assets/icons/cafe.png"),
  // featuring: require("../assets/icons/featuring.png"),
  // wallet: require("../assets/icons/wallet.png"),
};

export default function CustomHeader() {
  return (
    <View style={styles.header}>
      {/* Top Row: Logo + Icons */}
      <View style={styles.topRow}>
        <Image
          source={require("../assets/nonclickable-visual-elements/getthepong-logo.png")}
          style={styles.logo}
        />
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image
              source={require("../assets/icons/notification.png")}
              style={styles.icon}
            />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image
              source={require("../assets/icons/settings.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    paddingBottom: 20,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 107,
    height: 25,
  },
  lightText: {
    fontFamily: "second",
    color: "#ccc",
  },
  iconRow: {
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
    padding: 4,
    borderRadius: 12,
    position: "absolute",
    top: 0,
    right: -30,
    width: "30%",
  },
  iconWrapper: {
    marginLeft: 16,
    height: 24,
    width: 24,
  },
  icon: {
    width: 24,
    height: 25,
    tintColor: "#58595B",
    resizeMode: "contain",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#068CC9",
    position: "absolute",
    top: 1,
    left: -2,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#868788",
    borderRadius: 20,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 40,
    width: "50%",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginBottom: 4,
    resizeMode: "contain",
  },
  navLabel: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "second",
  },
  iconRow2: {
    flexDirection: "row",
    marginTop: 19,
    justifyContent: "space-between",
    width: "45%",
  },
});
