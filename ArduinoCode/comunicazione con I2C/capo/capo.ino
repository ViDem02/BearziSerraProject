#include <Wire.h>
#include <string.h>
#define MEM 30

const String ARDUINO_DATI1_STR = "arduinoDati1";
const int ARDUINO_DATI_INT = 1;

typedef struct dato{
  String dato;
  String tipoDiDato;
  String nomeDato;
  String nomeArduino;
}t_data;


typedef struct insiemeDati{
  t_data* dati;
  int qta;
}t_insiemeDati;




String riceviValore(){
  String result = ""; 
  int b=0;
  while(Wire.available()) {
    b = Wire.read();

    result += (char)(b+48);
    
  }
  Serial.println(b);
  Serial.println("OKE : ");
  Serial.println(result);
  return result;
}





void setup() {
  Wire.begin();
  Serial.begin(9600);
}

void createPackage(t_insiemeDati* inDa, String tipoDiDato, String nomeDato,  String arduino, int arduinoNumb){
  inDa->qta++;
  inDa->dati = (t_data*) realloc (inDa->dati, sizeof(t_insiemeDati) * (inDa->qta));
  t_data* datiRiferimento = &(inDa->dati[inDa->qta]);
  Wire.requestFrom(arduinoNumb, 1);
  datiRiferimento->dato = riceviValore();
  datiRiferimento->nomeArduino = arduino;
  datiRiferimento->nomeDato = nomeDato;
  datiRiferimento->tipoDiDato = tipoDiDato;
}

void getAllData(t_insiemeDati* inDa1){

  createPackage(inDa1, "int", "umidità", ARDUINO_DATI1_STR, ARDUINO_DATI_INT);
}

void loop() {

  t_insiemeDati* inDa1 = (t_insiemeDati*) malloc (sizeof(t_insiemeDati));
  inDa1->dati = (t_data*) malloc (sizeof(t_data));
  inDa1->qta = 0;
  getAllData(inDa1);

  String dato = inDa1->dati[0].dato;



  delay(100);
}
