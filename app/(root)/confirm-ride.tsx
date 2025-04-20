import { CustomButton } from "@/components/CustomButton";
import DriversCard from "@/components/DriversCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore } from "@/store";
import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  return (
    <RideLayout title="Choose a ride" snapPoints={["60%", "80%"]}>
      <FlatList
        data={drivers}
        renderItem={({ item, index }) => (
          <DriversCard
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item.id)!)}
            item={item}
          />
        )}
        ListFooterComponent={() => (
          <View>
            <CustomButton
              title="Select Ride"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};
export default ConfirmRide;
