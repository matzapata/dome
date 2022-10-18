import React from "react";
import { FlatList, Text, TouchableOpacity, View, Modal } from "react-native";
import { Header } from "../components/Headers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-root-toast";
import Screen from "../components/Screen";
import { DomeMember } from "../redux/slices/dome";
import {
  deleteMember,
  makeAdmin,
  removeAdmin,
} from "../redux/slices/domeThunk";

export default function MembersScreen() {
  const members = useAppSelector((state) => state.dome.members);
  const userUid = useAppSelector((state) => state.dome.user.uid);
  const isAdmin = useAppSelector((state) => state.dome.user.isAdmin);
  const [shareDomeModalVisible, setShareDomeModalVisible] =
    React.useState(false);
  const [memberMenuVisible, setMemberMenuVisible] = React.useState(false);
  const [memberMenu, setMemberMenu] = React.useState<DomeMember | null>(null);

  return (
    <Screen>
      <View className="bg-white">
        <Header title="Members" />

        {members.length === 0 ? (
          <View className="px-6 py-5 border-b border-gray-200">
            <Text className="text-lg font-semibold text-center text-gray-900">
              You haven&apos;t add any pearson to this dome
            </Text>
            <Text className="text-center text-gray-800">
              Anyone with access to your dome is in full control of your
              devices. To remove access you&apos;ll have to reset your dome.
            </Text>
          </View>
        ) : (
          <FlatList
            className="border-b border-gray-200"
            data={members}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="px-6 py-4"
                onPress={() => {
                  if (userUid !== item.id && isAdmin) {
                    setMemberMenu(item);
                    setMemberMenuVisible(true);
                  }
                }}
              >
                <Text className="text-base font-medium">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.email}</Text>
                {item.isAdmin && (
                  <Text className="text-sm text-gray-500">admin</Text>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(m) => m.id}
          />
        )}

        <TouchableOpacity
          className="flex flex-row items-center px-6 py-4"
          onPress={() => {
            if (!isAdmin) {
              Toast.show("Only admin can add members");
            } else setShareDomeModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#3182CE" />
          <Text className="ml-4 font-medium text-blue-500">Add member</Text>
        </TouchableOpacity>
        <AddMemberModal
          isVisible={shareDomeModalVisible}
          setIsVisible={setShareDomeModalVisible}
        />
        <MemberMenu
          member={memberMenu}
          isVisible={memberMenuVisible}
          setIsVisible={setMemberMenuVisible}
        />
      </View>
    </Screen>
  );
}

function AddMemberModal({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const domeId = useAppSelector((state) => state.dome.id);
  const userName = useAppSelector((state) => state.dome.user.name);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <View
        className="flex justify-end h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="m-2 space-y-4 bg-white rounded-2xl">
          <Text className="p-6 text-lg font-bold text-center text-gray-900">
            Share access to dome
          </Text>
          <View className="flex flex-row justify-center my-4">
            <QRCode
              value={`${domeId}-${userName}`}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>
          <Text className="px-6 text-base leading-5 text-center text-gray-800">
            Anyone who scans this code will have access to your devices
          </Text>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Text className="p-6 text-sm font-medium text-center text-blue-500 uppercase">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function MemberMenu({
  member,
  isVisible,
  setIsVisible,
}: {
  member: DomeMember | null;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();

  if (member === null) return null;
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <View
        className="flex justify-end h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="m-2 bg-white rounded-2xl">
          <Text className="px-6 pt-6 pb-2 text-lg font-bold text-gray-900">
            {member.name}
          </Text>

          {member.isAdmin ? (
            <TouchableOpacity
              className="px-6 py-4"
              onPress={async () => {
                await dispatch(removeAdmin({ uid: member.id })).unwrap();
                setIsVisible(false);
              }}
            >
              <Text className="text-base font-medium">
                Remove admin permissions
              </Text>
              <Text className="text-sm text-gray-500">
                Remove member admin permissions
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="px-6 py-4"
              onPress={async () => {
                await dispatch(makeAdmin({ uid: member.id })).unwrap();
                setIsVisible(false);
              }}
            >
              <Text className="text-base font-medium">Make admin</Text>
              <Text className="text-sm text-gray-500">
                Give member admin permissions
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="px-6 py-4"
            onPress={async () => {
              await dispatch(deleteMember({ uid: member.id })).unwrap();
              setIsVisible(false);
            }}
          >
            <Text className="text-base font-medium">Delete</Text>
            <Text className="text-sm text-gray-500">
              Remove member from dome
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Text className="p-6 text-sm font-medium text-center text-blue-500 uppercase">
              cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
