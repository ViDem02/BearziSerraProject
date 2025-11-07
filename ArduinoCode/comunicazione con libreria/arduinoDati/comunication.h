/*
  comunication.h - Library that implements serial comunication between Arduino and Rasperry Pi
  Copyright (c) 2019 Michele Della Mea.  All right reserved.
*/


#ifndef Comunication_h
#define Comunication_h

// include description files for other libraries used (if any)
#include "HardwareSerial.h"
#include "Arduino.h"

#include <SoftwareSerial.h>


typedef struct dato {

} Dato;

typedef struct command {
  String nameOfCommand;
  float command;
} Command;

class Comunication {
  public:
    const static int DEFAULT_BAUDRATE = 9600;
    const static int DEFAULT_DIVIDER = '|';
    const static int DEFAULT_ENDOFPAYLOAD = '$';

    static void push(String*, char);

    Comunication(char*, SoftwareSerial * = nullptr, int = DEFAULT_BAUDRATE, char = DEFAULT_DIVIDER, char = DEFAULT_ENDOFPAYLOAD);

    void send(char* dataName, double);
    void send(char* dataName, int);
    void send(char* dataName, String);

    Command read();
    bool isDataAvaiable();

    int  baudRate;

    bool getSerialType();

    SoftwareSerial* SerialCom;

  private:

    char divider;
    char endOfPayload;
    char* arduinoName;

    bool serialType;
    //SoftwareSerial SerialCom;

    void waitForSerialReady(void);
    bool isValidCommand(String);
    String parseInput(String*);


};


#endif
