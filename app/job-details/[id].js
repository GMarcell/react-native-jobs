import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter, Stack, useGlobalSearchParams } from "expo-router";
import useFetch from "../../hook/useFetch";
import { COLORS, icons, SIZES } from "../../constants";
import ScreenHeaderBtn from "../../components/common/header/ScreenHeaderBtn";
import Company from "../../components/jobdetails/company/Company";
import Tabs from "../../components/jobdetails/tabs/Tabs";
import Specifics from "../../components/jobdetails/specifics/Specifics";
import About from "../../components/jobdetails/about/About";
import Footer from "../../components/jobdetails/footer/Footer";

const tabs = ["About", "Qualification", "Responsibilities"];

const JobDetail = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const params = useGlobalSearchParams();

  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch()
    setRefreshing(false)
  }, [])

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualification":
        return (
          <Specifics
            title="Qualification"
            points={data[0].job_highlights?.Qualifications ?? ["N/A"]}
          />
        );
      case "About":
        return <About info={data[0].job_description ?? "No Data Provided"} />;
      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: "",
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something Went Wrong</Text>
          ) : data.length === 0 ? (
            <Text>No Data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                Location={data[0].job_country}
              />
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        <Footer
          url={
            data[0]?.job_google_link ??
            "https://carreers.google.com/jobs/result"
          }
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetail;
