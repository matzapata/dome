
![Cover](/assets/cover.png)

# DOME IOT

IOT modular system to control electrical connections over Wi-Fi.
The projects consists of:
- Modular hardware built with Esp8266 and programmed with C++ that will be placed in electrical sockets
- Phone application built with React Native and expo to connect devices, control them and add family members to it. 

The figma designs are already built and can be found here: 
-  https://www.figma.com/file/vcR1ODs3bJzUiS0fuz7EVW/DOME?node-id=1102%3A9203

## Device setup

1. Create `dome-device/Secrets.h` and fill with firebase credentials

```
#define FIREBASE_HOST "..."
#define FIREBASE_RTDB_SECRET "..." 
```

2. Upload code

3. Make electrical connections and power device on

4. Reset device and keep setup button pressed

5. Connect to "DOME" network initiated by device

6. Make a `POST` to `http://192.168.4.1/set` with `ssid`, `pass`, `home_id` and `device_id` on the body of the request.

```curl
curl --location --request POST 'http://192.168.4.1/set' \
--header 'Content-Type: application/json' \
--data-raw '{
    "ssid": "...",
    "pass": "...",
    "home_id": "...",
    "device_id": "..."
}'
```

If everything is ok, device will respond with `200 "OK"`

7. That's all. Reconect your phone to your wifi and interact with the device