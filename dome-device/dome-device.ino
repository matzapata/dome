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
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseData stream0;
FirebaseData stream1;
FirebaseData stream2;

char pathBuffer[100];
bool nodeStates[3] = { false };
short nodePinMapout[3] = { NODE0_PIN, NODE1_PIN, NODE2_PIN };
short nodeBtnMapout[3] = { NODE0_BTN, NODE1_BTN, NODE2_BTN };
volatile bool nodeDataChanged[3] = { false };

/*************************************************************************************************
 **                                    MACROS
 *************************************************************************************************/
#define BEGIN_NODE_FB_STREAM(NODE, NODE_STR) \
  sprintf(pathBuffer, "/domes/%s/devices/%s/switches/" NODE_STR "/state", homeId, deviceId); \
  Serial.printf("Listening on: %s\n", pathBuffer); \
  if (!Firebase.RTDB.beginStream(&stream##NODE, pathBuffer)) { \
    Serial.printf("stream begin error, %s\n\n", stream##NODE.errorReason().c_str()); \
  } \
  Firebase.RTDB.setStreamCallback(&stream##NODE, streamCallback##NODE, streamTimeoutCallback##NODE);

#define STREAM_CALLBACK(NODE) \
  void streamCallback##NODE(FirebaseStream data) { \
    printResult(data); \
    Serial.printf("Received stream payload size: %d (Max. %d)\n\n", data.payloadLength(), data.maxPayloadLength()); \
    nodeDataChanged[NODE] = true; \
  }

#define STREAM_TIMEOUT_CALLBACK(NODE) \
  void streamTimeoutCallback##NODE(bool timeout) { \
    if (timeout) \
      Serial.println("stream timed out, resuming...\n"); \
    if (!stream##NODE.httpConnected()) \
      Serial.printf("error code: %d, reason: %s\n\n", stream##NODE.httpCode(), stream##NODE.errorReason().c_str()); \
  }

#define SYNC_NODE(NODE, NODE_STR) \
  if (Firebase.ready()) { \
    if (digitalRead(nodeBtnMapout[NODE])) { \
      nodeStates[NODE] = !nodeStates[NODE]; \
      sprintf(pathBuffer, "/domes/%s/devices/%s/switches/" NODE_STR "/state", homeId, deviceId); \
      Serial.printf("Update state: %s\n", pathBuffer); \
      Firebase.RTDB.setBool(&fbdo, pathBuffer, (bool)nodeStates[NODE]); \
      delay(200); \
    } \
  } \
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
 **                                    FUNCTION PROTOTYPES
 *************************************************************************************************/


/*************************************************************************************************
 **                                    FUNCTIONS IMPLEMENTATIONS
 *************************************************************************************************/
STREAM_TIMEOUT_CALLBACK(0)
STREAM_CALLBACK(0)
STREAM_TIMEOUT_CALLBACK(1)
STREAM_CALLBACK(1)
STREAM_TIMEOUT_CALLBACK(2)
STREAM_CALLBACK(2)

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

  // Initiate wifi access point if no credentials stored or connect to wifi
  connectionBegin(CONFIG_BTN);

  // Initiate fb connection
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  BEGIN_NODE_FB_STREAM(0, "0")
  BEGIN_NODE_FB_STREAM(1, "1")
  BEGIN_NODE_FB_STREAM(2, "2")
}

void loop() {
  SYNC_NODE(0, "0")
  SYNC_NODE(1, "1")
  SYNC_NODE(2, "2")

  digitalWrite(NODE0_PIN, nodeStates[0]);
  digitalWrite(NODE1_PIN, nodeStates[1]);
  digitalWrite(NODE2_PIN, nodeStates[2]);
}