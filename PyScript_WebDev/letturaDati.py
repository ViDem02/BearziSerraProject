#!/usr/bin/python
import serial
from serial import Serial
import time
import os
connected = False
ser = serial.Serial('/dev/ttyACM0', 9600)

while 1:
    while not connected:
        serin = ser.read()
        connected = True
    stringaRisultato = ""
    x=ser.read()
    while x is not '<':
        x=ser.read()
    while 1:
        if ser.in_waiting:
            x=ser.read()
            stringaRisultato = stringaRisultato + x
            if x==">":
                break;
    stringaRisultato = stringaRisultato.replace('<','')
    stringaRisultato = stringaRisultato.replace('>','')
    print(stringaRisultato)
    fp = open('outputLettura.txt','w')
    fp.write(stringaRisultato)
    fp.close()
    fp = open('instruction1.txt','r')
    lettura = fp.read();
    print(lettura)
    ser.write(lettura)
    fp.close()