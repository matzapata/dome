/*************************************************************************************************
 **                                          INCLUDES
 *************************************************************************************************/
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <ArduinoJson.h>  // @5.13.5
#include "Secrets.h"
#include <Firebase_ESP_Client.h> // 4.1.0
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

/*************************************************************************************************
 **                                          DEFINES
 *************************************************************************************************/
#define DEBUG true

#define SSID_ADDR 0
#define PASS_ADDR 50
#define HOME_ID_ADDR 100
#define DEVICE_ID_ADDR 150
#define ACCESS_POINT_SSID "DOME"
#define ACCESS_POINT_PASS ""
#define EEPROM_BLOCK_SIZE 50

#define NODE0_BTN D1
#define NODE1_BTN D2
#define NODE2_BTN D4
#define NODE0_PIN D6
#define NODE1_PIN D7
#define NODE2_PIN D8

#define CONFIG_BTN D1  // NODE1_BTN

/*************************************************************************************************
 **                                      GLOBAL VARIABLES
 *************************************************************************************************/
ESP8266WebServer server(80);

#if DEBUG
char ssid[EEPROM_BLOCK_SIZE] = { "Fibertel Wifi 2.4GHz" };
char pass[EEPROM_BLOCK_SIZE] = { "00416584453" };
char homeId[EEPROM_BLOCK_SIZE] = { "home" };
char deviceId[EEPROM_BLOCK_SIZE] = { "dev" };
#else
char ssid[EEPROM_BLOCK_SIZE];
char pass[EEPROM_BLOCK_SIZE];
char homeId[EEPROM_BLOCK_SIZE];
char deviceId[EEPROM_BLOCK_SIZE];
#endif

char pathBuffer[100];
char serialBuffer[100];
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

FirebaseData stream1;
bool nodeStates[3] = { false };
short nodePinout[3] = { NODE0_PIN, NODE1_PIN, NODE2_PIN };
volatile bool nodeDataChanged[3] = { false };

/*************************************************************************************************
 **                                    FUNCTION PROTOTYPES
 *************************************************************************************************/

void setup();
void loop();
void getConfig();
void setConfig();
void configurationMode();
void connectionMode();
void writeEepromString(int addr, String data);
String readEepromString(int addr);
void scanNetworks();

/*************************************************************************************************
 **                                    FUNCTIONS IMPLEMENTATIONS
 *************************************************************************************************/
void getConfig() {
  readEepromString(SSID_ADDR).toCharArray(ssid, EEPROM_BLOCK_SIZE);
  readEepromString(PASS_ADDR).toCharArray(pass, EEPROM_BLOCK_SIZE);
  readEepromString(HOME_ID_ADDR).toCharArray(homeId, EEPROM_BLOCK_SIZE);
  readEepromString(DEVICE_ID_ADDR).toCharArray(deviceId, EEPROM_BLOCK_SIZE);

  Serial.println(ssid);
  Serial.println(pass);
  Serial.println(homeId);
  Serial.println(deviceId);
}

void setConfig() {
  String data = server.arg("plain");
  StaticJsonBuffer<200> jBuffer;
  JsonObject& jObject = jBuffer.parseObject(data);
  String ssid = jObject["ssid"];
  String pass = jObject["pass"];
  String home_id = jObject["home_id"];
  String device_id = jObject["device_id"];

  writeEepromString(SSID_ADDR, ssid);
  writeEepromString(PASS_ADDR, pass);
  writeEepromString(HOME_ID_ADDR, home_id);
  writeEepromString(DEVICE_ID_ADDR, device_id);

  serverSendOk();
}

void writeEepromString(int addr, String data) {
  int size = data.length();
  char inchar[50];
  data.toCharArray(inchar, size + 1);

  for (int i = 0; i < size; i++) {
    EEPROM.write(addr + i, inchar[i]);
  }
  for (int i = size; i < 50; i++) {
    EEPROM.write(addr + i, 255);
  }

  EEPROM.commit();
}

String readEepromString(int addr) {
  byte readByte;
  String retVal;

  for (int i = addr; i < addr + 50; i++) {
    readByte = EEPROM.read(i);
    if (readByte != 255) {
      retVal += (char)readByte;
    }
  }

  return retVal;
}

void scanNetworks() {
  short scannedNetworks = WiFi.scanNetworks();

  if (scannedNetworks == 0) {
    Serial.println("No networks found");
    server.send(404, "text/json", "{\"networks\": []}");
  } else {
    Serial.print(scannedNetworks);
    Serial.println(" networks found");
    String networksJson = "{\"networks\": [";

    for (int i = 0; i < scannedNetworks; ++i) {
      // Add networks to message
      // WiFi.encryptionType 5:WEP 2:WPA/PSK 4:WPA2/PSK 7:open network 8:WPA/WPA2/PSK
      networksJson += "\"" + String(i + 1) + ": " + WiFi.SSID(i) + " (" + WiFi.RSSI(i) + ") Ch: " + WiFi.channel(i) + " Enc: " + WiFi.encryptionType(i) + "\"";
      if (i < scannedNetworks) {
        networksJson += ",";
      }
      delay(10);
    }

    networksJson += "]}";
    Serial.println(networksJson);
    server.send(200, "text/json", networksJson);
  }
}

void serverSendOk() {
  server.sendHeader("Connection", "close");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "OK\r\n");
}

void connectionMode() {
  short connectionAttemps = 0;

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED && connectionAttemps < 50) {
    connectionAttemps++;
    Serial.println(".");
    delay(250);
  }
  if (connectionAttemps < 50) {
    Serial.println("WiFi connected");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Error in connection");
    while (true) {}
  }
}

void configurationMode() {
  WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASS);

  Serial.print("Access point ip: ");
  Serial.println(WiFi.softAPIP());

  server.on("/", serverSendOk);
  server.on("/set", setConfig);
  server.on("/scan", scanNetworks);
  server.begin();

  while (true) {
    server.handleClient();
  }
}


#define STREAM_CALLBACK(NODE) \
  void streamCallback##NODE(FirebaseStream data) { \
    printResult(data); \
    Serial.printf("Received stream payload size: %d (Max. %d)\n\n", data.payloadLength(), data.maxPayloadLength()); \
    nodeDataChanged[NODE] = true; \
  }

#define BEGIN_NODE_FB_STREAM(NODE, NODE_STR) \
  Serial.println("Listening on: /domes/dome_id/devices/device_id/switches/" NODE_STR "/state"); \
  if (!Firebase.RTDB.beginStream(&stream##NODE, "/domes/dome_id/devices/device_id/switches/" NODE_STR "/state")) { \
    Serial.printf("stream begin error, %s\n\n", stream##NODE.errorReason().c_str()); \
  } \
  Firebase.RTDB.setStreamCallback(&stream##NODE, streamCallback##NODE, streamTimeoutCallback);

STREAM_CALLBACK(1)

// Generic function that informs a network error on firebase rtdb listening
void streamTimeoutCallback(bool timeout) {
  if (timeout)
    Serial.println("stream timed out, resuming...\n");

  if (!stream1.httpConnected())
    Serial.printf("error code: %d, reason: %s\n\n", stream1.httpCode(), stream1.errorReason().c_str());
}

void firebaseBegin() {
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;

  // Assign the callback function for the long running token generation task. addons/TokenHelper.h
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Begin stream and set stream callback
  BEGIN_NODE_FB_STREAM(1, "2")
}

#define FB_GPIO_UPDATE(NODE) \
  if (stream1.dataTypeEnum() == fb_esp_rtdb_data_type_boolean) { \
    bool state = stream1.boolData(); \
    nodeStates[NODE] = state; \
    Serial.print("NODE: 0 STATE:"); \
    Serial.println(state); \
  }

/*************************************************************************************************
 **                                          MAIN
 *************************************************************************************************/

void setup() {
  EEPROM.begin(512);
  Serial.begin(115200);

  pinMode(NODE0_BTN, INPUT);
  pinMode(NODE1_BTN, INPUT);
  pinMode(NODE2_BTN, INPUT);

  pinMode(NODE0_PIN, OUTPUT);
  pinMode(NODE1_PIN, OUTPUT);
  pinMode(NODE2_PIN, OUTPUT);

#if !DEBUG
  if (digitalRead(CONFIG_BTN)) {
    Serial.println("Config mode");
    configurationMode();
  }
  getConfig();
#endif

  connectionMode();
  firebaseBegin();
}

void loop() {
//  if (Firebase.ready()) {
//    if (digitalRead(NODE1_BTN)) {
//      node1State = !node1State;
//      sprintf(pathBuffer, "/%s/%s/1", homeId, deviceId);
//      Firebase.RTDB.setInt(&fbdo, pathBuffer, (int)node1State);
//      delay(200);
//    } else if (digitalRead(NODE2_BTN)) {
//      node2State = !node2State;
//      sprintf(pathBuffer, "/%s/%s/2", homeId, deviceId);
//      Firebase.RTDB.setInt(&fbdo, pathBuffer, (int)node2State);
//      delay(200);
//    } else if (digitalRead(NODE3_BTN)) {
//      node3State = !node3State;
//      sprintf(pathBuffer, "/%s/%s/3", homeId, deviceId);
//      Firebase.RTDB.setInt(&fbdo, pathBuffer, (int)node3State);
//      delay(200);
//    }
//  }

  if (nodeDataChanged[1]) {
    nodeDataChanged[1] = false;
    if (stream1.dataTypeEnum() == fb_esp_rtdb_data_type_boolean) { 
      bool state = stream1.boolData(); 
      nodeStates[1] = state; 
      Serial.print("NODE: 0 STATE:"); 
      Serial.println(state); 
    }
  }

  digitalWrite(NODE0_PIN, nodeStates[0]);
  digitalWrite(NODE1_PIN, nodeStates[1]);
  digitalWrite(NODE2_PIN, nodeStates[2]);
}