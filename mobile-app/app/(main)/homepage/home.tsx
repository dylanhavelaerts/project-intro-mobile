import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SuggestedClubsSection } from "@/features/homepage/SuggestedClubsSection";
import {
  ImproveLevelSection,
  SuggestedForYouSection,
} from "@/features/homepage/ShowcaseSections";
import { useSuggestedClubs } from "@/features/homepage/useSuggestedClubs";

const Index = () => {
  const [username, setUsername] = useState("");
  const { clubs: suggestedClubs, loading: suggestedClubsLoading } =
    useSuggestedClubs();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    };
    fetchUsername();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.surface}>
      <View style={styles.section1}>
        <Text style={[styles.titleText, styles.topMargin]}>
          The court is calling your name, {username}
        </Text>
        <View style={styles.itemContainer}>
          <Link href="/(noHeaders)/bookCourt" asChild>
            <TouchableOpacity style={styles.iconWrapper}>
              <View style={styles.circleBackground}>
                <Image
                  source={require("../../../assets/images/homepage/court.png")}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.label}>Book a court</Text>
            </TouchableOpacity>
          </Link>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBackground}>
              <Image
                source={require("../../../assets/images/homepage/learn.png")}
                style={styles.icon}
              />
            </View>
            <Text style={styles.label}>Learn</Text>
          </View>
          <View style={styles.iconWrapper}>
            <View style={styles.circleBackground}>
              <Image
                source={require("../../../assets/images/homepage/compete.png")}
                style={styles.icon}
              />
            </View>
            <Text style={styles.label}>Compete</Text>
          </View>
          <Link href="/(noHeaders)/findMatch" asChild>
            <TouchableOpacity>
              <View style={styles.iconWrapper}>
                <View style={styles.circleBackground}>
                  <Image
                    source={require("../../../assets/images/homepage/tennis-ball.png")}
                    style={styles.icon}
                  />
                </View>
                <Text style={styles.label}>Find a match</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <SuggestedClubsSection
          clubs={suggestedClubs}
          loading={suggestedClubsLoading}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.titleText, styles.activitiesTitle]}>
          Activities
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollPadding}
        >
          <View style={styles.activityCard}>
            <Image
              source={require("../../../assets/images/homepage/private-class.png")}
              style={styles.cardIcon}
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Private classes</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <Image
              source={require("../../../assets/images/homepage/public.png")}
              style={styles.cardIcon}
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Private classes</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <Image
              source={require("../../../assets/images/homepage/courses.png")}
              style={styles.cardIcon}
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Courses</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SuggestedForYouSection />
      </View>

      <View style={styles.section}>
        <ImproveLevelSection />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.titleText, styles.sectionHeaderTitle]}>
            Compete with others
          </Text>
          <Text style={styles.sectionHeaderSeeAll}>See all</Text>
        </View>
      </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#335FFF",
  },
  scrollContent: {
    paddingBottom: 28,
  },
  surface: {
    marginTop: 2,
    backgroundColor: "#f2f3f5",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 16,
  },
  section1: {
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  section: {
    marginTop: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System",
    marginBottom: 10,
    color: "#040b27",
  },
  sectionHeaderRow: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderTitle: {
    marginBottom: 0,
  },
  sectionHeaderSeeAll: {
    color: "#335FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  topMargin: {
    marginTop: 18,
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
    fontFamily: "System",
    fontWeight: "500",
    color: "#1f2b37",
  },
  activitiesTitle: {
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  horizontalScrollPadding: {
    paddingLeft: 15,
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
    overflow: "hidden",
  },
  cardIcon: {
    width: 45,
    height: 40,
    resizeMode: "contain",
    tintColor: "black",
  },
  cardTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: "#040b27",
    flexShrink: 1,
    fontFamily: "System",
    fontWeight: "500",
  },
});

export default Index;
