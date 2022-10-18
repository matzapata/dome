import { DomeDbPayload } from "../../types/db";
import { DomeSwitch } from "./dome";

export function extractSwitchesFromDbPayload(dbPayload?: DomeDbPayload) {
  if (dbPayload === undefined) return [];
  const switches: DomeSwitch[] = [];
  Object.keys(dbPayload.devices).forEach((deviceId) => {
    const device = dbPayload.devices[deviceId];
    Object.keys(device.switches).forEach((switchId) => {
      switches.push({
        id: switchId,
        deviceId: deviceId,
        name: device.switches[switchId].name,
        room: device.switches[switchId].room,
        state: device.switches[switchId].state,
      });
    });
  });
  return switches;
}

export function extractDevicesFromDbPayload(dbPayload?: DomeDbPayload) {
  if (dbPayload === undefined) return [];
  return Object.keys(dbPayload.devices).map((deviceId) => {
    const device = dbPayload.devices[deviceId];
    return {
      id: deviceId,
      name: device.name,
    };
  });
}

export function extractMembersFromDbPayload(dbPayload?: DomeDbPayload) {
  if (dbPayload === undefined) return [];
  return Object.keys(dbPayload.members).map((memberId) => ({
    id: memberId,
    email: dbPayload.members[memberId].email,
    name: dbPayload.members[memberId].name,
    isAdmin: dbPayload.members[memberId].isAdmin,
  }));
}
