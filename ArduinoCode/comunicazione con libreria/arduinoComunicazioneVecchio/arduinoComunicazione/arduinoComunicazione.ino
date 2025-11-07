
#include <SoftwareSerial.h>
#include "comunication.h"

SoftwareSerial* com1 = new SoftwareSerial(13,12);
SoftwareSerial* com2 = new SoftwareSerial(7,6);
SoftwareSerial* com3 = new SoftwareSerial(4,3);

Comunication* iot1 = new Comunication("Plant Humidity1", com1);
Comunication* iot2 = new Comunication("Plant Humidity2", com2);
Comunication* iot3 = new Comunication("Plant Humidity3", com3);



void setup() {
  
   com1->begin(9600);
   com2->begin(9600);
   com3->begin(9600);
   Serial.begin(9600);
}


void loop() {
  //com1->listen();
  if (iot1->isDataAvaiable()) {
        delay(1000);
        Command payload = iot1->read();
        Serial.print(payload.nameOfCommand + ": ");
        Serial.println(payload.command);
  }
  //com2->listen();
  if (iot2->isDataAvaiable()) {
        delay(1000);
        Command payload = iot2->read();
        Serial.print(payload.nameOfCommand + ": ");
        Serial.println(payload.command);
  }
  
  //com3->listen();
  if (iot3->isDataAvaiable()) {
        delay(1000);
        Command payload = iot3->read();
        Serial.print(payload.nameOfCommand + ": ");
        Serial.println(payload.command);
  }
  delay(100);
  
}
