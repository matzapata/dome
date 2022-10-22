/*************************************************************************************************
 **                                          INCLUDES
 *************************************************************************************************/

#include "Secrets.h"
#include <Firebase_ESP_Client.h> // 4.1.0
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include "ConnectionManager.h"
#include "Config.h"

/*************************************************************************************************
 **                                          DEFINES
 *************************************************************************************************/
#define NODE0_BTN D1
#define NODE1_BTN D2
#define NODE2_BTN D4
#define NODE0_PIN D6
#define NODE1_PIN D7
#define NODE2_PIN D8
#define CONFIG_BTN NODE0_BTN

/*************************************************************************************************
 **                                      GLOBAL VARIABLES
 *************************************************************************************************/
char pathBuffer[100];
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

FirebaseData stream0;
bool nodeStates[3] = { false };
short nodePinout[3] = { NODE0_PIN, NODE1_PIN, NODE2_PIN };
volatile bool nodeDataChanged[3] = { false };

/*************************************************************************************************
 **                                    FUNCTION PROTOTYPES
 *************************************************************************************************/

void setup();
void loop();

/*************************************************************************************************
 **                                    FUNCTIONS IMPLEMENTATIONS
 *************************************************************************************************/

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

STREAM_CALLBACK(0)

// Generic function that informs a network error on firebase rtdb listening
void streamTimeoutCallback(bool timeout) {
  if (timeout)
    Serial.println("stream timed out, resuming...\n");

  if (!stream0.httpConnected())
    Serial.printf("error code: %d, reason: %s\n\n", stream0.httpCode(), stream0.errorReason().c_str());
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
  BEGIN_NODE_FB_STREAM(0, "0")
}

#define SYNC_GPIO(NODE) \
  if (nodeDataChanged[NODE]) { \
    nodeDataChanged[NODE] = false; \
    if (stream##NODE.dataTypeEnum() == fb_esp_rtdb_data_type_boolean) { \
      bool state = stream##NODE.boolData(); \
      nodeStates[NODE] = state; \
      Serial.print("NODE: "); \
      Serial.print(NODE); \
      Serial.print("STATE: "); \
      Serial.println(state); \
    } \
  }

/*************************************************************************************************
 **                                          MAIN
 *************************************************************************************************/

void setup() {
  Serial.begin(115200);

  pinMode(NODE0_BTN, INPUT);
  pinMode(NODE1_BTN, INPUT);
  pinMode(NODE2_BTN, INPUT);

  pinMode(NODE0_PIN, OUTPUT);
  pinMode(NODE1_PIN, OUTPUT);
  pinMode(NODE2_PIN, OUTPUT);

  connectionBegin(CONFIG_BTN);

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

  SYNC_GPIO(0)

  digitalWrite(NODE0_PIN, nodeStates[0]);
  digitalWrite(NODE1_PIN, nodeStates[1]);
  digitalWrite(NODE2_PIN, nodeStates[2]);
}