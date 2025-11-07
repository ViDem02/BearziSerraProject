var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var http = require('http');

const { execFile } = require('child_process');

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var initiated = 1;
var bashSummon;
var datoLetto = "";
var data;

if (initiated){
    initiated = 0;

    var port = process.env.PORT || 3000;
    var content = ""
    fs.readFile('actualip.txt', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
    });
    app.listen(port, content);
    console.log("APP LISTEN EXECUTED.");

    var stringaIniziale = "0\n0\n0\n0\n0\n1\n";
    fs.writeFile('instruction1.txt', stringaIniziale, function (err) {
        if (err) throw err;
        console.log('INSTRUCTION 1 - WROTE FILE WITH ALL 0');
    });

    fs.writeFile('outputLettura.txt', '0', function (err) {
        if (err) throw err;
        console.log('AVVENUTA CREAZIONE OUTPUT LETTURA.TXT CON VALORE 0');
    });

    const { exec } = require('child_process');
    exec('./letturaDati.py &');
    console.log("AVVIATO LETTURADATIpy IN BACKGROUND")
}


async function caricaPaginaDati(req, res){
    console.log('CARICA PAGINA DATI -- INIZIO');
    fs.readFile('outputLettura.txt', function read(err, data) {
        if (err) {
            throw err;
            console.log("Not able to read! Why:")
            console.log(err);
            var words = 'Not able to read'
            res.render('index', {state: words});
        }else{
            console.log("Able to read outputLettura.txt in caricaPDati!");
            var words = data;
            console.log("Stampa words.. caricaPDati")
            console.log(words);
            var array = JSON.parse("[" + words + "]"); 
            res.render('index', {state: words}); 
            console.log("Fine else caricaPDati!")
        }
    });
    console.log('CARICA PAGINA DATI -- FINE');
};  


app.get('/home', async function(req,res){
    console.log('GET /HOME -- INIZIO');
    await caricaPaginaDati(req,res);
    console.log('GET /HOME -- FINE');
});


var contenutoLetto = "";
app.post(/*->*/ "/on1", async (req,res, next) => {
        req.nomePostDellaRichiesta = "/on1: ";
        const nomePost = req.nomePostDellaRichiesta;
        console.log();
        console.log();
        console.log();
        console.log();
        console.log(nomePost + 'POST -- INIZIO ----------------------------------------------'); 
        fs.readFile('instruction1.txt', async function read(err, data) {
            if (err) {
                throw err;
            }
            console.log(nomePost + "data in read file = " + data);
            contenutoLetto = data + "";
            next();
        });
    }, async (req,res,next) => { 
        const nomePost = req.nomePostDellaRichiesta;
        var stringa = "";
        stringa = contenutoLetto + '';
        console.log(nomePost + "stringa letta in instruction1.txt: " + stringa);
        let array = stringa.split ('\n');
        console.log(nomePost + "stampa array letto: " + array);
        /*->*/array[3] = 1;
        var comando = array.join("\n");     
        console.log(nomePost + "stampa comando creato: " + comando);   
        fs.writeFile('instruction1.txt', comando, async function (err) {
            if (err) throw err;
            console.log(nomePost + "Creato file instruction1.txt");
            next();
        });
    }, async (req,res,next) => { 
        const nomePost = req.nomePostDellaRichiesta;
        const child = execFile('sudo', ['python','./attuatore1.py'], {}, (error, stdout, stderr) => {
            console.log(nomePost + "Stdout del processo appena creato");
            console.log(stdout);
            if (error) {
                console.log(error);
            }
        });
        await caricaPaginaDati(req,res);
        console.log(nomePost + 'POST -- FINE'); 
        
    }
);


app.post(/*->*/ "/off1", async (req,res, next) => {
    req.nomePostDellaRichiesta = "/off1: ";
    const nomePost = req.nomePostDellaRichiesta;
    console.log();
    console.log();
    console.log();
    console.log();
    console.log(nomePost + 'POST -- INIZIO ----------------------------------------------'); 
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        console.log(nomePost + "data in read file = " + data);
        contenutoLetto = data + "";
        next();
    });
}, async (req,res,next) => { 
    const nomePost = req.nomePostDellaRichiesta;
    var stringa = "";
    stringa = contenutoLetto + '';
    console.log(nomePost + "stringa letta in instruction1.txt: " + stringa);
    let array = stringa.split ('\n');
    console.log(nomePost + "stampa array letto: " + array);
    /*->*/array[3] = 0;
    var comando = array.join("\n");     
    console.log(nomePost + "stampa comando creato: " + comando);   
    fs.writeFile('instruction1.txt', comando, async function (err) {
        if (err) throw err;
        console.log(nomePost + "Creato file instruction1.txt");
        next();
    });
}, async (req,res,next) => { 
    const nomePost = req.nomePostDellaRichiesta;
    const child = execFile('sudo', ['python','./attuatore1.py'], {}, (error, stdout, stderr) => {
        console.log(nomePost + "Stdout del processo appena creato");
        console.log(stdout);
        if (error) {
            console.log(error);
        }
    });
    await caricaPaginaDati(req,res);
    console.log(nomePost + 'POST -- FINE'); 
}
);

app.post(/*->*/ "/on2", async (req,res, next) => {
    req.nomePostDellaRichiesta = "/on2 ";
    const nomePost = req.nomePostDellaRichiesta;
    console.log();
    console.log();
    console.log();
    console.log();
    console.log(nomePost + 'POST -- INIZIO ----------------------------------------------'); 
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        console.log(nomePost + "data in read file = " + data);
        contenutoLetto = data + "";
        next();
    });
}, async (req,res,next) => { 
    const nomePost = req.nomePostDellaRichiesta;
    var stringa = "";
    stringa = contenutoLetto + '';
    console.log(nomePost + "stringa letta in instruction1.txt: " + stringa);
    let array = stringa.split ('\n');
    console.log(nomePost + "stampa array letto: " + array);
    /*->*/array[4] = 1;
    var comando = array.join("\n");     
    console.log(nomePost + "stampa comando creato: " + comando);   
    fs.writeFile('instruction1.txt', comando, async function (err) {
        if (err) throw err;
        console.log(nomePost + "Creato file instruction1.txt");
        next();
    });
}, async (req,res,next) => { 
    const nomePost = req.nomePostDellaRichiesta;
    const child = execFile('sudo', ['python','./attuatore1.py'], {}, (error, stdout, stderr) => {
        console.log(nomePost + "Stdout del processo appena creato");
        console.log(stdout);
        if (error) {
            console.log(error);
        }
    });
    await caricaPaginaDati(req,res);
    console.log(nomePost + 'POST -- FINE'); 
}
);

app.post(/*->*/ "/off2", async (req,res, next) => {
    req.nomePostDellaRichiesta = "/off2: ";
    const nomePost = req.nomePostDellaRichiesta;
    console.log();
    console.log();
    console.log();
    console.log();
    console.log(nomePost + 'POST -- INIZIO ----------------------------------------------'); 
    fs.readFile('instruction1.txt', async function read(err, data) {
        if (err) {
            throw err;
        }
        console.log(nomePost + "data in read file = " + data);
        contenutoLetto = data + "";
        next();
    });
}, async (req,res,next) => { 
    const nomePost = req.nomePostDellaRichiesta;
    var stringa = "";
    stringa = contenutoLetto + '';
    console.log(nomePost + "stringa letta in instruction1.txt: " + stringa);
    let array = stringa.split ('\n');
    console.log(nomePost + "stampa array letto: " + array);
    /*->*/array[4] = 0;
    var comando = array.join("\n");     
    console.log(nomePost + "stampa comando creato: " + comando);   
    fs.writeFile('instruction1.txt', comando, async function (err) {
        if (err) throw err;
        console.log(nomePost + "Creato file instruction1.txt");
        next();
    });
}, async (req,res,next) => { 
    const nomePost = req.nomePostDellaRichiesta;
    const child = execFile('sudo', ['python','./attuatore1.py'], {}, (error, stdout, stderr) => {
        console.log(nomePost + "Stdout del processo appena creato");
        console.log(stdout);
        if (error) {
            console.log(error);
        }
    });
    await caricaPaginaDati(req,res);
    console.log(nomePost + 'POST -- FINE'); 
}
);


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
        let array = stringa.split('\n');
        array[0] = l1;
        array[1] = l2;
        array[2] = l3;
        var comando = array.join("\n");     
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
