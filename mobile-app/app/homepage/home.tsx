import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const Index = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section1}>
        <Text style={[styles.titleText, styles.topMargin]}>The court is calling your name, user</Text>
        <View style={styles.itemContainer}>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBackground}>
              <Image source={require("../../assets/images/homepage/court.png")} style={styles.icon} />
            </View>
            <Text style={styles.label}>Book a court</Text>
          </View>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBackground}>
              <Image source={require("../../assets/images/homepage/learn.png")} style={styles.icon} />
            </View>
            <Text style={styles.label}>Learn</Text>
          </View>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBackground}>
              <Image source={require("../../assets/images/homepage/compete.png")} style={styles.icon} />
            </View>
            <Text style={styles.label}>Compete</Text>
          </View>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBackground}>
              <Image source={require("../../assets/images/homepage/tennis-ball.png")} style={styles.icon} />
            </View>
            <Text style={styles.label}>Find a match</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.titleText}>Suggested clubs for you</Text>
        <Text style={styles.itemText}>Child component for succested courts</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.titleText}>Activities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
          
          <View style={styles.activityCard}>
            <Image source={require("../../assets/images/homepage/private-class.png")} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Private classes</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <Image source={require("../../assets/images/homepage/public.png")} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Private classes</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <Image source={require("../../assets/images/homepage/courses.png")} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Courses</Text>
            </View>
          </View>

        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.titleText}>Suggested for you</Text>
        <Text style={styles.itemText}>Add friends</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.titleText}>Improve your level</Text>
        <Text style={styles.itemText}>Child component</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.titleText}>Compete with others</Text>
        <Text style={styles.itemText}>Open matches</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F9",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section1: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "System",
    marginBottom: 10,
    color: "#040b27"
  },
  topMargin: {
    marginTop: 25,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  iconWrapper: {
    alignItems: "center",
    width: 80,
  },
  circleBackground: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: "#C8FC2C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#4B5563",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  horizontalScrollPadding: {
    paddingRight: 20,
    gap: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    width: 145,
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardIcon: {
    width: 45,
    height: 40,
    resizeMode: "contain",
    tintColor: "black",
  },
  cardTextContainer: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 14,
    width: 90,
    color: "#040b27",
  },
});

export default Index;