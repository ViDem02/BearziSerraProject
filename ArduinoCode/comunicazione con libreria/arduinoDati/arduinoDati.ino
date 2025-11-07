#include <DHT.h>
#include <SoftwareSerial.h>
#include "comunication.h"

SoftwareSerial* com = new SoftwareSerial(11,10);

Comunication* iot = new Comunication("Plant Humidity", com);

void setup() {
   com->begin(9600);
   Serial.begin(9600);  
}


void loop() {
  iot->send("Sensor Data2", 13.1);
  Serial.println("Sensor data2");
  delay(50);  
}
