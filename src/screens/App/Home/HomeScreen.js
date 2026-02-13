import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import UserContext from "../../../context/UserContext";
import { getLatestSensorData } from "../../../apis/sensor";

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const [sensorData, setSensorData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Construct the full image URL for your backend
  const getImageUrl = () => {
    if (user?.user?.ProfileImage) {
      return `http://192.168.8.87:10000/media/${user.user.ProfileImage}`;
    }
    return null;
  };

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const data = await getLatestSensorData();

      if (data && data.data) {
        setSensorData(data.data);
      } else if (data) {
        setSensorData(data);
      } else {
        // Use default data if no sensor data available
        setSensorData({
          temperature: 24.5,
          humidity: 45,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.log("Error fetching sensor data:", error.message);
      // Use fallback data
      setSensorData({
        temperature: 23.8,
        humidity: 52,
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSensorData();
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    console.log("Notification icon pressed");
    // Add navigation to notifications screen here
  };

  useEffect(() => {
    fetchSensorData();

    // Set up interval to fetch data every 30 seconds
    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simple circular progress component without SVG
  const CircularProgress = ({ progress, size = 80 }) => {
    return (
      <View
        style={[
          styles.circularProgressContainer,
          { width: size, height: size },
        ]}
      >
        {/* Background circle */}
        <View style={[styles.circleBase, styles.circleBackground]} />

        {/* Progress circle - we'll use a clever trick with borders */}
        <View
          style={[
            styles.circleBase,
            styles.circleProgress,
            {
              borderColor: "#2667FF",
              transform: [{ rotate: `${-90 + (360 * progress) / 100}deg` }],
            },
          ]}
        />

        {/* Center text */}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header with profile image and greeting */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              getImageUrl()
                ? { uri: getImageUrl() }
                : require("../../../../assets/icon.png")
            }
            style={styles.profileImage}
            resizeMode="cover"
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi, {user?.user?.name || "Guest"}</Text>
          <Text style={styles.healthQuestion}>How is your foot health?</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={handleNotificationPress}
        >
          <Image
            source={require("../../../../assets/Home-Screen/notification-bell.png")}
            style={styles.notificationImage}
            resizeMode="contain"
          />
          {/* Notification badge */}
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Section */}
      <View style={styles.mainSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Foot Pressure</Text>
        </View>

        {/* Insoles Container */}
        <View style={styles.insolesContainer}>
          {/* Left Insole */}
          <View style={styles.insoleCard}>
            <Text style={styles.insoleTitle}>L</Text>
            <View style={styles.footDiagram}>
              <View style={styles.footOutline}>
                <View style={styles.pressurePoint}></View>
                <View
                  style={[styles.pressurePoint, styles.pressurePointActive]}
                ></View>
                <View style={styles.pressurePoint}></View>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Battery</Text>
                <Text style={styles.statusValue}>85%</Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Status</Text>
                <View style={styles.connectedStatus}>
                  <View style={styles.connectedDot}></View>
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Insole */}
          <View style={styles.insoleCard}>
            <Text style={styles.insoleTitle}>R</Text>
            <View style={styles.footDiagram}>
              <View style={styles.footOutline}>
                <View style={styles.pressurePoint}></View>
                <View style={styles.pressurePoint}></View>
                <View
                  style={[styles.pressurePoint, styles.pressurePointActive]}
                ></View>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Battery</Text>
                <Text style={styles.statusValue}>78%</Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Status</Text>
                <View style={styles.connectedStatus}>
                  <View style={styles.connectedDot}></View>
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Pressure and Environment Boxes */}
        <View style={styles.dataBoxesContainer}>
          {/* Pressure Box */}
          <View style={styles.dataBox}>
            <Text style={styles.dataBoxTitle}>Live Pressure</Text>
            <Text style={styles.dataBoxValue}>30 PSI</Text>
            <Text style={styles.dataBoxSubtitle}>Current Reading</Text>
          </View>

          {/* Environment Box with Real Data */}
          <View style={styles.dataBox}>
            <Text style={styles.dataBoxTitle}>Environment</Text>
            {loading ? (
              <Text style={styles.dataBoxValue}>...</Text>
            ) : (
              <Text style={styles.dataBoxValue}>
                {sensorData?.temperature?.toFixed(1) || "0"}°C
              </Text>
            )}
            <Text style={styles.dataBoxSubtitle}>
              Humidity: {sensorData?.humidity?.toFixed(1) || "0"}%
            </Text>
          </View>
        </View>

        {/* Last Updated Time */}
        {sensorData?.timestamp && (
          <Text style={styles.updateTime}>
            Updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
          </Text>
        )}

        {/* Gait Analysis Box */}
        <View style={styles.gaitAnalysisContainer}>
          <View style={styles.gaitAnalysisContent}>
            <View style={styles.gaitAnalysisText}>
              <Text style={styles.gaitAnalysisTitle}>Gait Analysis</Text>
              <Text style={styles.gaitAnalysisSubtitle}>
                Your walking pattern is good with balanced pressure distribution
              </Text>
            </View>
            <CircularProgress progress={80} />
          </View>
        </View>

        {/* Pressure Text */}
        <Text style={styles.pressureText}>Real-time pressure: 2.4 kg/cm²</Text>

        {/* Add some extra space at the bottom for better scrolling */}
        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    marginRight: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  healthQuestion: {
    fontSize: 14,
    color: "#718096",
    fontStyle: "italic",
  },
  notificationIcon: {
    padding: 8,
    position: "relative",
  },
  notificationImage: {
    width: 24,
    height: 24,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#E53E3E",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  mainSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "left",
  },
  insolesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  insoleCard: {
    flex: 1,
    backgroundColor: "#EBF8FF",
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#BEE3F8",
  },
  insoleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B6CB0",
    marginBottom: 10,
  },
  footDiagram: {
    width: 120,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  footOutline: {
    width: 80,
    height: 150,
    backgroundColor: "#BEE3F8",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  pressurePoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#90CDF4",
    marginVertical: 4,
  },
  pressurePointActive: {
    backgroundColor: "#3182CE",
    transform: [{ scale: 1.3 }],
  },
  statusContainer: {
    width: "100%",
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "#4A5568",
    fontWeight: "500",
  },
  statusValue: {
    fontSize: 12,
    color: "#2D3748",
    fontWeight: "bold",
  },
  connectedStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#48BB78",
    marginRight: 6,
  },
  connectedText: {
    fontSize: 12,
    color: "#48BB78",
    fontWeight: "500",
  },
  dataBoxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dataBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: "center",
    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Shadow properties for Android
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F7FAFC",
  },
  dataBoxTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
    textAlign: "center",
  },
  dataBoxValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
    textAlign: "center",
  },
  dataBoxSubtitle: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
  },
  updateTime: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  gaitAnalysisContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Shadow properties for Android
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F7FAFC",
  },
  gaitAnalysisContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gaitAnalysisText: {
    flex: 1,
    marginRight: 20,
  },
  gaitAnalysisTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 8,
  },
  gaitAnalysisSubtitle: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
  // Circular progress styles
  circularProgressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  circleBase: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
  },
  circleBackground: {
    borderColor: "#E2E8F0",
  },
  circleProgress: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#2667FF", // Using the primary blue color
  },
  progressTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
  },
  pressureText: {
    fontSize: 16,
    color: "#4A5568",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
  bottomSpacer: {
    height: 30,
  },
});
