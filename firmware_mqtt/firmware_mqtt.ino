#include <WiFi.h>
const char ssid[] = "HASAN_wifi";
const char pass[] = "kulonprogo";
WiFiClient net;

#include <MQTT.h>
const char* clientId = "Client982983125423";
const char*  broker = "broker.emqx.io";
const char*  topicSuhu = "/h8s81h2191/smartdevice/suhu";
const char*  topicKelembaban = "/h8s81h2191/smartdevice/kelembaban";
const char*  topicLampu = "/h8s81h2191/smartdevice/lampu";
MQTTClient client;
unsigned const long jeda = 1000;
unsigned long zero, timer = 0;

int lamp = 5;

void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.print("\nconnecting...");
  while (!client.connect(clientId, "", "")) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nconnected!");
  client.subscribe(topicLampu);
}

void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
  if (topic == topicLampu){
    Serial.println("topic cocok");
    if (payload == "on"){
        digitalWrite(lamp, HIGH);
    } else {
        digitalWrite(lamp, LOW);
    }
  }

}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, pass);
  client.begin(broker, net);
  client.onMessage(messageReceived);
  pinMode(lamp, OUTPUT);
  connect();
}

void loop() {
  client.loop();
  if (!client.connected()) {
    connect();
  }

  if (millis() - zero >= jeda) {
    timer++;
    client.publish(topicSuhu, String(timer));
    client.publish(topicKelembaban, String(timer));
    Serial.println(String() + "Publish Pesan:" + timer);
    zero = millis();
  }
}
