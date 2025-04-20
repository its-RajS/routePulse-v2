import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import Map from "@/components/Map";

const Rides = () => {
  return (
    <SafeAreaView>
      <View className="flex flex-row items-center bg-transparent h-screen ">
        <Map />
      </View>
    </SafeAreaView>
  );
};

export default Rides;
