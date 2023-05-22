import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Logo from "../src/assets/nlw-spacetime-logo.svg";

import Icon from "@expo/vector-icons/Feather";

import * as SecureStore from "expo-secure-store";
import { api } from "../src/server/api";

import dayjs from "dayjs";
import prBr from "dayjs/locale/pt-br";

dayjs.locale(prBr);

interface Memory {
  id: string;
  excerpt: string;
  coverUrl: string;
  createdAt: string;
}

const Memories = () => {
  const { top, bottom } = useSafeAreaInsets();

  const [memories, setMemories] = useState<Memory[]>([]);

  const router = useRouter();

  async function signOut() {
    await SecureStore.deleteItemAsync("token");

    router.push("/");
  }

  async function getMemories() {
    try {
      const { data } = await api.get("/memories", {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
        },
      });

      setMemories(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMemories();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className=" mt-4 flex-row items-center justify-between px-8">
        <Logo />

        <View className="flex-row gap-4">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color="#fff" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {memories.map((memory) => (
        <View className="mt-6 space-y-10" key={memory.id}>
          <View className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50"></View>
              <Text className=" font-body text-xs text-gray-100">
                {dayjs(memory.createdAt).format("D [ de ] MMMM[,] YYYY")}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{ uri: memory.coverUrl }}
                className="aspect-video w-full rounded-lg"
                alt={""}
              />

              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <Link href={"/memories/id"} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Memories;
