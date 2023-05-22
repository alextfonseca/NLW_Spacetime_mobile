import React, { useState } from "react";

import Logo from "../src/assets/nlw-spacetime-logo.svg";

import Icon from "@expo/vector-icons/Feather";

import * as SecureStore from "expo-secure-store";

import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import { api } from "../src/server/api";

const NewMemories = () => {
  const router = useRouter();

  const { top, bottom } = useSafeAreaInsets();

  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<string>(null);

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.assets[0]) {
        setCover(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCreateMemories() {
    const token = await SecureStore.getItemAsync("token");

    let coverUrl = "";

    if (cover) {
      const uploadFormData = new FormData();

      uploadFormData.append("file", {
        uri: cover,
        name: "cover",
        type: "image/jpg",
      } as any);

      const { data } = await api.post("/upload", uploadFormData);

      coverUrl = data.url;
    }

    await api.post(
      "/memories",
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/memories");
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className=" mt-4 flex flex-row items-center justify-between">
        <Logo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? "#9b79ea" : "#9e7ea0"}
            trackColor={{ false: "#767577", true: "#372560" }}
          />

          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          activeOpacity={0.7}
          onPress={openImagePicker}
        >
          {cover ? (
            <Image
              source={{ uri: cover }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" size={24} color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor={"#56565a"}
          placeholder="Fique livre para adicionar foto, vídeos e relatos sobre sua experiência que você quer lembrar para sempre."
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className=" items-center self-end rounded-full bg-green-500 px-5 py-2"
          onPress={handleCreateMemories}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default NewMemories;
