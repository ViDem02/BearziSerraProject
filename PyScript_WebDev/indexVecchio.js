var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var Chart = require('chart.js');
     // to support JSON-encoded bodies

const { execFile } = require('child_process');

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var procEx = 0;
var bashSummon;
var datoLetto = "";
var data;

//link wit

var stringaIniziale = "0\n0\n0\n0\n0";
fs.writeFile('instruction1.txt', stringaIniziale, function (err) {
    if (err) throw err;
    console.log('INSTRUCTION 1 - WROTE FILE WITH ALL 0');
});

/*
function leggiDati() {
    return new Promise(function (resolve, reject) {
        const child = execFile('sudo', ['python','./letturaDati.py'], {}, (error, stdout, stderr) => {
          if (error) {
              console.log(error);
            return reject('AA Non è stato possibile leggere nella funzione checkExist');
          }
           return resolve(stdout);
        });
    });
}
*/

function leggiDati(){
    console.log('ESEGUITA FUNZIONE LEGGI DATI -- INIZIO');
    var contenuto = "";
    fs.readFile('outputLettura.txt', function read(err, data) {
        if (err) {
            throw err;
        }
        return data;
    });
    console.log('ESEGUITA FUNZIONE LEGGI DATI -- FINE');
}

require.extensions['.txt'] = function (module, filename) {
    console.log('REQ EXTENSIONS -- INIZIO');
    module.exports = fs.readFileSync(filename, 'utf8');
    console.log('REQ EXTENSIONS -- FINE');
};

async function caricaPaginaDati(req, res){
    console.log('CARICA PAGINA DATI -- INIZIO');
    fs.readFile('outputLettura.txt', function read(err, data) {
        if (err) {
            throw err;
            console.log(err);
            var words = 'Not able to read'
            res.render('index', {state: words});
        }
        console.log("File exsists!");
        var words = data;
        console.log("Stampa words..")
        console.log(words);
        var array = JSON.parse("[" + words + "]"); 
        res.render('index', {state: words}); 
    });
    console.log('CARICA PAGINA DATI -- FINE');
};  


async function actionButton(comando, req, res){
    try{
        console.log('ACTION BUTTON -- INIZIO');
        fs.writeFile('instruction1.txt', comando, function (err) {
            if (err) throw err;
            console.log('Created instructions1 in post on actionComando');
            console.log(comando)
        });
        const child = execFile('sudo', ['python','./attuatore1.py'], {}, (error, stdout, stderr) => {
        console.log(stdout);
            if (error) {
                console.log(error);
            }
        });
        await caricaPaginaDati(req,res);
        console.log('ACTION BUTTON -- FINE');
    }catch (err){
        throw err;
    }  
};




app.post("/on1", async (req,res) => {
    console.log('POST /ON1 -- INIZIO'); 
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        var stringa = data + '';
        console.log(stringa);
        let array = stringa.split ('\n');
        console.log(array);
        array[3] = 1;
        var comando = array[0] + "\n" + array[1] + "\n"  + array[2] + "\n"  + array[3] + "\n" + array[4];
        await actionButton(comando, req, res);
    });
    console.log('POST /ON1 -- FINE');
});

app.post("/on2", async (req,res) => {
    console.log("Ricevuto una richiesta POST /on2");  
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        istruzioneLetta = data;
    });
    var stringa = content + '';
    let array = stringa.split('\n');
    console.log(array);
    array[4] = 1;
    var comando = array[0] + "\n" + array[1] + "\n"  + array[2] + "\n"  + array[3] + "\n" + array[4];
    await actionButton(comando, req, res);
});

app.post("/off1", async (req,res) => {
    console.log("Ricevuto una richiesta POST /off1");  
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
    });
    var stringa = content + '';
    let array = stringa.split('\n');
    console.log(array);
    array[3] = 0;
    var comando = array[0] + "\n" + array[1] + "\n"  + array[2] + "\n"  + array[3] + "\n" + array[4];
    await actionButton(comando, req, res);
});


app.post("/off2", async (req,res) => {
    console.log("Ricevuto una richiesta POST /off2");  
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
    });
    var stringa = content + '';
    let array = stringa.split('\n');
    console.log(array);
    array[4] = 0;
    var comando = array[0] + "\n" + array[1] + "\n"  + array[2] + "\n"  + array[3] + "\n" + array[4];
    await actionButton(comando, req, res);
});

 


app.post("/writeRGB", async (req,res) => {
    console.log('WRITE RGB -- INIZIO');
    var l1 = req.body.led1;
        l2 = req.body.led2;
        l3 = req.body.led3;
    console.log("Ricevuto una richiesta POST");
    console.log("RICEVUTO LED1,LED2,LED3 = " + l1 + l2 + l3);
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        var stringa = data + '';
        let array = stringa.split(',');
        var comando = l1 + "\n" + l2 + "\n" + l3 +"\n" + array[3] + "\n" + array[4];
        fs.writeFile('instruction1.txt', comando, function (err) {
        if (err) throw err;
        console.log('Created instructions1 in post');
        });
        const child = execFile('sudo', ['python','./attuatore1.py'], {}, (error, stdout, stderr) => {
            console.log(stdout);
            if (error) {
                console.log(error);
                }
        });
        await caricaPaginaDati(req,res);
        console.log('WRITE RGB -- FINE');
    });
});



app.get('/home', async function(req,res){
    console.log('GET /HOME -- INIZIO');
    await caricaPaginaDati(req,res);
    console.log('GET /HOME -- FINE');
});

/*
app.get('/', function(req,res){
    caricaPaginaDati(req,res);
});
*/

const { exec } = require('child_process');
exec('./letturaDati.py &');

fs.writeFile('outputLettura.txt', '0', function (err) {
    if (err) throw err;
    console.log('AVVENUTA CREAZIONE OUTPUT LETTURA.TXT CON VALORE 0');
});


var port = process.env.PORT || 3000;
var content = ""
fs.readFile('/home/pi/sitoInternet/actualip.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;
});
app.listen(port, content);




//DEPOSITO FUNZIONI NON UTILIZZATE

async function funzioneAsincrona(req, res){
    const { execFile } = require('child_process');
    const child = execFile('letturaDati.py', {}, (error, stdout, stderr) => {
      if (error) {
        reject('BB Non è stato possibile leggere nella funzione checkExist');
      }
        res.pipe(child.stdout);
    });
};
