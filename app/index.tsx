import React, { useEffect } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import * as SecureStore from "expo-secure-store";

import Logo from "../src/assets/nlw-spacetime-logo.svg";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { api } from "../src/server/api";
import { useRouter } from "expo-router";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/53a31693a8a7f2dec898",
};

export default function App() {
  const router = useRouter();

  const [, response, signinWithGithub] = useAuthRequest(
    {
      clientId: "53a31693a8a7f2dec898",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetimemobile",
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post("/register", { code });

    const { token } = response.data;

    await SecureStore.setItemAsync("token", token).catch((error) => {
      console.log(error);
    });

    router.push("/memories");
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubOAuthCode(code);
    }
  }, [response]);

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <Logo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>

          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signinWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}
