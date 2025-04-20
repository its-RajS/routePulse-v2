import { InputFieldProps } from "@/types/type";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const InputField = ({
  label,
  labelStyle,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 w-full">
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
          {label}
        </Text>
        <View
          className={`flex flex-row justify-start items-center relative rounded-full bg-neutral-100 border border-neutral-100 focus:border-primary-500 ${containerStyle} `}
        >
          {icon && (
            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
          )}
          <TextInput
            className={` felx-1 rounded-full p-4 font-JakartaSemiBold text-[15px] text-left ${inputStyle}  `}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            {...props}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
