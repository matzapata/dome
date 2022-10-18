export type DomeDbPayload = {
  devices: {
    [device_id: string]: {
      name: string;
      switches: {
        [switch_id: string | number]: {
          name: string;
          room: string;
          state: boolean;
        };
      };
    };
  };
  members: {
    [user_id: string]: {
      name: string;
      email: string;
      isAdmin: boolean;
    };
  };
};
