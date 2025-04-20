import { icons, images } from "@/constants";
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import { InputField } from "@/components/InputField";
import { useState } from "react";
import { CustomButton } from "@/components/CustomButton";
import { Link, router, useRouter } from "expo-router";
import { OAuth } from "@/components/OAuth";
import * as React from "react";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { TouchableOpacity } from "react-native";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  // const router = useRouter();

  const [successModel, setSuccessModel] = useState(false);

  //decalre a form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  //to use clerk we need to get the verifcation state too
  const [verificationState, setVerificationState] = useState({
    status: "default",
    error: "",
    code: "",
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      if (!form.email || !form.password) {
        Alert.alert("Missing Fields", "Please enter email and password.");
        return;
      }
      console.log("FORM VALUES", form);

      const signUpResponse = await signUp.create({
        emailAddress: form.email,
        password: form.password,
        username: form.name.toLowerCase().replace(/\s+/g, "_"),
      });
      console.log("signUp response:", signUpResponse);

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      console.log("Prepared verification, setting status to pending...");
      setVerificationState({
        ...verificationState,
        status: "pending",
      });
    } catch (err: any) {
      console.log("Sign-up error:", JSON.stringify(err, null, 2));
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Unknown error";
      Alert.alert("Sign Up Failed", msg);

      setVerificationState({
        ...verificationState,
        error: msg,
        status: "failed",
      });
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      console.log("Attempting verification with code:", verificationState.code);

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationState.code.trim(),
      });

      console.log(
        "Verification Attempt Response:",
        JSON.stringify(signUpAttempt, null, 2)
      );

      if (signUpAttempt.status === "complete") {
        //Create database of users
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });

        console.log("Verification complete. Setting session...");
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerificationState({ ...verificationState, status: "success" });
      } else {
        console.warn("Verification status not complete:", signUpAttempt.status);
        setVerificationState({
          ...verificationState,
          error: "Verification Failed",
          status: "failed",
        });
      }
    } catch (err: any) {
      console.error("Verification Error:", JSON.stringify(err, null, 2));
      setVerificationState({
        ...verificationState,
        error: err?.errors?.[0]?.longMessage || "Verification failed",
        status: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* <TouchableOpacity
        onPress={() => {
          router.replace("/(root)/(tabs)/home");
        }}
        className="top-0 right-0 flex justify-end items-end"
      >
        <Text className="text-black text-base font-JakartaBold ">Skip</Text>
      </TouchableOpacity> */}
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[200px]">
          <Image source={images.signinbus} className="z-0 w-full h-[200px]  " />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/(auth)/sign-in"
            className="text-lg text-center text-general-200 mt-5"
          >
            <Text>Already have an account?</Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        <ReactNativeModal
          isVisible={verificationState.status === "pending"}
          onModalHide={() => {
            if (verificationState.status === "success") setSuccessModel(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] ">
            <Text className="text-2xl font-JakartaExtraBold mb-2  ">
              Verfication
            </Text>
            <Text className="font-Jakarta mb-5 ">
              Verifiaction code send on {form.email}
            </Text>

            <InputField
              label="Code"
              placeholder="12345"
              icon={icons.lock}
              value={verificationState.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerificationState({
                  ...verificationState,
                  code: code.trim(),
                })
              }
            />

            {verificationState.error && (
              <Text className="text-red-500 text-sm mt-1 ">
                {verificationState.error}
              </Text>
            )}

            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className=" bg-success-500 mt-5 "
            />
          </View>
        </ReactNativeModal>

        {/* For the USer who's got an account/Verfied */}
        <ReactNativeModal isVisible={successModel}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] ">
            <Image
              source={images.check}
              className="w-[110px]  h-[110px] mx-auto my-5  "
            />
            <Text className="text-3xl font-JakartaBold text-center  ">
              Verified
            </Text>
            <Text className="text-base text-gray-40 font-Jakarta text-center mt-2 ">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Button"
              onPress={() => {
                setSuccessModel(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
