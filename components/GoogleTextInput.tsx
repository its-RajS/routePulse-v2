import { GoogleInputProps } from "@/types/type";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Image, Text, View } from "react-native";
import Constants from "expo-constants";
import { icons } from "@/constants";

const googleApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_API_KEY;
console.log("Google API Key:", googleApiKey);

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  if (!googleApiKey) {
    console.error("Google API Key is missing or invalid");
    return <Text>API Key Error</Text>;
  }

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            handlePress({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              address: data.description,
            });
          } else {
            console.warn("No location details returned:", data, details);
          }
        }}
        query={{
          key: googleApiKey,
          language: "en",
        }}
        onFail={(error) =>
          console.error("GooglePlacesAutocomplete failed:", error)
        }
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
