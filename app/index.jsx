import React from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        <Text style={styles.title}>Home</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>
      </View>

      {/* Announcements */}
      <View style={styles.announcements}>
        <Text style={styles.sectionTitle}>Announcements</Text>

        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.announcementItem} />
        ))}
      </View>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: "700",
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  /* Buttons */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  button: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

  /* Announcements */
  announcements: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  announcementItem: {
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 10,
  },
})
