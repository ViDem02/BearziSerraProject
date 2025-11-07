#include <Servo.h>
#include <Wire.h>

Servo Attuatore;

int arrivo[1]={0};

void esegui(){
  int b=0;
  while(Wire.available()) {
    b *= 10;
    b += Wire.read();
    
    
    Serial.println(b);
  }
  arrivo [0]=b;
}


void setup() {
  Wire.begin(4);
  Wire.onReceive(esegui);
  Attuatore.attach(9);
}

void loop() {
  delay(100);
  Attuatore.write(arrivo[0]);

}
