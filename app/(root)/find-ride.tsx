import { useLocationStore } from "@/store";
import { Text, View } from "react-native";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { CustomButton } from "@/components/CustomButton";
import { router } from "expo-router";

const FindRide = () => {
  const {
    setUserLocation,
    setDestinationLocation,
    userAddress,
    destinationAddress,
  } = useLocationStore();

  return (
    <RideLayout title="Ride" snapPoints={["45%", "80%"]}>
      <View className="my-1 ">
        <Text className="text-lg font-JakartaSemiBold mb-3 ">From</Text>
        <GoogleTextInput
          initialLocation={userAddress!}
          icon={icons.target}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>
      <View className="my-1 ">
        <Text className="text-lg font-JakartaSemiBold mb-3 ">To</Text>
        <GoogleTextInput
          initialLocation={destinationAddress!}
          icon={icons.map}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>
      <CustomButton
        title="Find Now"
        onPress={() => router.push("/(root)/confirm-ride")}
        className="mt-2"
      />
    </RideLayout>
  );
};

export default FindRide;
