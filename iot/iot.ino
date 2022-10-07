/*************************************************************************************************
 **                                          INCLUDES
 *************************************************************************************************/
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <ArduinoJson.h>  // @5.13.5

/*************************************************************************************************
 **                                          DEFINES
 *************************************************************************************************/
#define SSID_ADDR 0
#define PASS_ADDR 50
#define CONFIG_BTN D5
#define WIFI_LED_STATUS LED_BUILTIN
#define ACCESS_POINT_SSID "iot"
#define ACCESS_POINT_PASS "12345678"
#define EEPROM_BLOCK_SIZE 50

/*************************************************************************************************
 **                                      GLOBAL VARIABLES
 *************************************************************************************************/
ESP8266WebServer server(80);
char ssid[EEPROM_BLOCK_SIZE];
char pass[EEPROM_BLOCK_SIZE];
bool savedConfig = false;

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
}

void setConfig() {
  String data = server.arg("plain");
  StaticJsonBuffer<200> jBuffer;
  JsonObject& jObject = jBuffer.parseObject(data);
  String ssid = jObject["ssid"];
  String pass = jObject["pass"];

  writeEepromString(SSID_ADDR, ssid);
  writeEepromString(PASS_ADDR, pass);

  server.send(200, "text/plain", "OK");
  server.close();
  savedConfig = true;
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

void sendOk() {
  server.send(200, "text/plain", "OK");
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

  server.on("/", sendOk);
  server.on("/set", setConfig);
  server.on("/scan", scanNetworks);
  server.begin();

  while (!savedConfig) {
    server.handleClient();
  }
}

/*************************************************************************************************
 **                                          MAIN
 *************************************************************************************************/

void setup() {
  EEPROM.begin(512);
  Serial.begin(115200);

  pinMode(CONFIG_BTN, INPUT);

  if (digitalRead(CONFIG_BTN) == LOW) {
    configurationMode();
  }
  getConfig();
  connectionMode();
}

void loop() {

}