#include <Wire.h>
int letto=0;

void setup() {
  Wire.begin(1);
  Wire.onRequest(manda);
  Serial.begin(9600);
}

void loop() {
  delay(100);
  //letto = map(analogRead(0), 0, 1023, 0, 150);
  
  letto = 50;
  
}

void manda() {
  Wire.write(letto);
  Serial.println("mandato 50");
}
  
  
  
