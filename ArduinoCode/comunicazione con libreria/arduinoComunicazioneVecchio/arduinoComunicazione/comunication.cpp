/*
  comunication.h - Library that implements serial comunication between Arduino and Rasperry Pi
  Copyright (c) 2019 Michele Della Mea. All right reserved.
*/


// include this library's description file
#include "comunication.h"




Comunication::Comunication( char* arduinoName, SoftwareSerial *com = nullptr, int baudRate = Comunication::DEFAULT_BAUDRATE, char divider = Comunication::DEFAULT_DIVIDER, char endOfPayload = Comunication::DEFAULT_ENDOFPAYLOAD): SerialCom(0, 0) {



  this->SerialCom = com;

  this->serialType = com == nullptr ? true : false;

  this->waitForSerialReady();

  this->arduinoName = arduinoName;
  this->baudRate = baudRate;
  this->divider = divider;
  this->endOfPayload = endOfPayload;
};

void Comunication::waitForSerialReady() {

  while(!Serial) {
    delay(400);
  }
}

void Comunication::send(char* dataName, double payload) {

  const char* type = "double";
  const String message = String(this->arduinoName) + String(this->divider) + String(dataName) + String(this->divider) + String(type) + String(this->divider) + String(payload) + String(this->divider) + String(this->endOfPayload);

  //Serial.println("Messagge: " + message);

  if(serialType) Serial.print(message);
  else this->SerialCom->print(message);

};

void Comunication::send(char* dataName, int payload) {

  const char* type = "int";
  const String message = String(this->arduinoName) + String(this->divider) + String(dataName) + String(this->divider) + String(type) + String(this->divider) + String(payload) + String(this->divider) + String(this->endOfPayload);

  if(serialType) Serial.print(message);
  else this->SerialCom->print(message);
};

void Comunication::send(char* dataName, String payload) {

  const char* type = "string";
  const String message = String(this->arduinoName) + String(this->divider) + String(dataName) + String(this->divider) + String(type) + String(this->divider) + String(payload) + String(this->divider) + String(this->endOfPayload);

  if(serialType) Serial.print(message);
  else this->SerialCom->print(message);
};

Command Comunication::read() {
  String input = "";

  int readed;

  while (1) {
    readed = serialType ? Serial.read() : this->SerialCom->read();

    if ((char)readed == this->endOfPayload) break;

    else {
      input = input + String((char)readed);
    }
  }

  Serial.println("In : " + input);

  const bool validity = this->isValidCommand(input);

  const String arduinoName = this->parseInput(&input);

  const String nameOfCommand = this->parseInput(&input);

  const String commandType = this->parseInput(&input);

  const String command = this->parseInput(&input);

  //Serial.println("Validity: " + String(validity ? 1 : 0) + " Name: " + arduinoName + " Command Name: " + nameOfCommand + " Command: " + command);

  if ( validity )
    return
    {
      nameOfCommand: nameOfCommand,
      command: command.toFloat()
    };
  else
    return
    {
      nameOfCommand: "error",
      command: -1
    };

}
bool Comunication::isValidCommand(String toBeValidated) {
  const int index1 = toBeValidated.indexOf(this->divider)+ 1;
  if(index1 <= 0) return false;

  const int index2 = toBeValidated.indexOf(this->divider, index1) + 1;
  if(index2 <= 0) return false;

  const int index3 = toBeValidated.indexOf(this->divider, index2) + 1;
  if(index3 <= 0) return false;

  return true;
}

String Comunication::parseInput(String* in) {

  int i = 0;
  String out;
  while(1) {
    if(in->c_str()[i] == '|'){
      i++;

      break;
    }
    push(&out, in->c_str()[i]);

    i++;
  }


  in->remove(0, i);

  return out;
}

bool Comunication::isDataAvaiable() {
  if(serialType) {
    return Serial.available() ? true : false;
  } else {
    this->SerialCom->listen();
    delay(100);
    return this->SerialCom->available() ? true : false;
  }
}

void Comunication::push(String* in, char toBePushed) {
  in->concat(toBePushed);
}

bool Comunication::getSerialType() {
  return serialType;
}
