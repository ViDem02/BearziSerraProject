#!/usr/bin/python
import serial
import time
import os
from serial import Serial
connected = False
ser = serial.Serial('/dev/ttyACM0', 9600)
ser.close()
ser.open()
exists = os.path.isfile('/home/pi/sitoInternet/instruction1.txt')
if exists:
    fp = open('instruction1.txt','r')
    lettura = fp.read()
    print("LETTURA PYTHON = " + lettura)
    if lettura != "N":
        time.sleep(2)
        while ser.in_waiting:  # Or: while ser.inWaiting():
            print ser.readline()
        print('connected')
        print(lettura)
        ser.write(lettura)
        fp.close()
        print('operazione temrinata ')
    else:
        print('file does not contain anything!')
else:
    print('The file doesnt exsist')
ser.close()
ser.open()