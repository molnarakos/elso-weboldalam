const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// JAVÍTOTT VERZIÓ - a szerver akkor is elindul, ha nincs MongoDB
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';

app.listen(port, '0.0.0.0', () => {
  console.log(`Az oldal fut a porton: ${port}`);
});

// SZERVER INDÍTÁSA ELŐSZÖR
app.listen(port, '0.0.0.0', () => {
  console.log(`Az oldal fut a porton: ${port}`);
});

// MONGODB KAPCSOLAT KÜLÖN (nem blokkolja a szervert)
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log('Sikeresen csatlakoztunk a MongoDB-hez!');
    db = client.db(dbName);
    uzenetekCollection = db.collection('uzenetek');
    jatekAllapotCollection = db.collection('jatek_allapot');
  })
  .catch(error => {
    console.error('MongoDB kapcsolodasi hiba:', error);
    console.log('Az oldal MongoDB nélkül fut.');
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function getStyle() {
  return `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 20px;
      }
      nav {
        background: rgba(255, 255, 255, 0.95);
        padding: 15px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
        text-align: center;
      }
      nav a {
        color: #667eea;
        margin: 10px 15px;
        text-decoration: none;
        font-weight: bold;
        font-size: 18px;
        padding: 10px 20px;
        border-radius: 10px;
        transition: all 0.3s;
        display: inline-block;
      }
      nav a:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      h1 {
        color: #667eea;
        font-size: 48px;
        margin-bottom: 20px;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      }
      p {
        color: #555;
        font-size: 18px;
        line-height: 1.8;
        margin: 15px 0;
      }
      .game-button {
        display: inline-block;
        font-size: 22px;
        padding: 15px 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        border-radius: 15px;
        margin: 15px;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      .game-button:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
      }
      .emoji {
        font-size: 40px;
        display: block;
        margin-bottom: 10px;
      }
    </style>
  `;
}

function getMenu() {
  return '<nav><a href="/">🏠 Főoldal</a><a href="/rolam">👤 Rólam</a><a href="/a_weboldalrol">ℹ️ A weboldalról</a><a href="/jatekok">🎮 Játékok</a><a href="/uzenofal">💬 Üzenőfal</a></nav>';
}

app.get('/', (req, res) => {
  res.send(getStyle() + getMenu() + '<div class="container"><h1>🌟 Üdvözöllek a weboldalamon!</h1><p style="text-align: center; font-size: 20px;">Használd a menüt fent, hogy felfedezd az oldalaimat!</p></div>');
});

app.get('/rolam', (req, res) => {
  res.send(getStyle() + getMenu() + '<div class="container"><h1>👦 Rólam</h1><p>🎂 <strong>Én egy 8 éves gyerek vagyok</strong>, és a kedvenc hobbim a <strong>programozás</strong>!</p><p>💻 Imádok számítógépezni és új dolgokat tanulni. Ez a weboldal az első projektem, amit apukámmal együtt csináltunk.</p><p>🎮 Készítettem játékokat is, próbáld ki őket a Játékok menüpontban!</p><p>😊 Nagyon örülök, hogy meglátogattad a weboldalt! Remélem tetszik!</p></div>');
});

app.get('/a_weboldalrol', (req, res) => {
  res.send(getStyle() + getMenu() + '<div class="container"><h1>ℹ️ A weboldalról</h1><p>🛠️ Ezt a weboldalt <strong>apukámmal</strong> (meg az AI-al) csináltam.</p><p>⏰ <strong>NAGYON</strong> sokat dolgoztunk rajta, úgyhogy remélem, tetszik!</p><p>💡 Használtunk <strong>Node.js</strong>-t, <strong>MongoDB</strong>-t és sok-sok HTML, CSS meg JavaScript kódot.</p><p>🚀 Ez az első weboldalam, de remélem még sok mást is fogok csinálni!</p></div>');
});

app.get('/jatekok', (req, res) => {
  res.send(getStyle() + getMenu() + '<div class="container"><h1>🎮 Játékok</h1><p style="text-align: center;">Válassz egy játékot és jó szórakozást!</p><div style="text-align: center; margin-top: 30px;">' +
    '<a href="/tengerimalac-jatek" class="game-button"><span class="emoji">🐹</span>Tengerimalac Kaland</a>' +
    '<a href="/tetris" class="game-button"><span class="emoji">🟦</span>Tetris</a>' +
    '<a href="/snake" class="game-button"><span class="emoji">🐍</span>Snake</a>' +
    '<a href="/labirintus" class="game-button"><span class="emoji">🎯</span>Labirintus</a></div></div>');
});

app.get('/uzenofal', async (req, res) => {
  try {
    const uzenetek = await uzenetekCollection.find().toArray();
    let uzenetLista = '';
    uzenetek.forEach((uzenet, index) => {
      uzenetLista += '<div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #667eea;"><strong>' + (index + 1) + '.</strong> ' + uzenet.szoveg + '</div>';
    });
    res.send(getStyle() + getMenu() + '<div class="container"><h1>💬 Üzenőfal</h1><h2 style="color: #667eea;">Üzenetek (' + uzenetek.length + ' db):</h2><div>' + uzenetLista + '</div><h2 style="color: #667eea; margin-top: 30px;">Új üzenet:</h2><form action="/uj-uzenet" method="POST" style="margin-top: 20px;"><input type="text" name="uzenet" required style="width: 70%; padding: 15px; font-size: 16px; border: 2px solid #667eea; border-radius: 10px; margin-right: 10px;"><button type="submit" style="padding: 15px 30px; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; font-weight: bold;">Küldés</button></form></div>');
  } catch (error) {
    res.send(getStyle() + getMenu() + '<div class="container"><h1>❌ Hiba!</h1><p>Nem sikerült csatlakozni a MongoDB-hez.</p></div>');
  }
});

app.post('/uj-uzenet', async (req, res) => {
  try {
    const ujUzenet = {
      szoveg: req.body.uzenet,
      datum: new Date()
    };
    await uzenetekCollection.insertOne(ujUzenet);
    console.log('Uj uzenet mentve!');
    res.redirect('/uzenofal');
  } catch (error) {
    res.send('Hiba tortent!');
  }
});

// TENGERIMALAC JÁTÉK - NÉV MENTÉSSEL
app.get('/tengerimalac-jatek', async (req, res) => {
  const sessionId = req.query.session || Date.now().toString();
  
  try {
    let allapot = await jatekAllapotCollection.findOne({ sessionId });
    
    if (!allapot) {
      allapot = {
        sessionId,
        finishek: [],
        gyozelemPontok: 0,
        jatekosNev: ''
      };
      await jatekAllapotCollection.insertOne(allapot);
    }

    const html = `
      ${getMenu()}
      <style>
        body { font-family: Arial; background: #f0f0f0; }
        .jatek-container { max-width: 800px; margin: 20px auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .gomb { padding: 10px 20px; margin: 5px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 5px; font-size: 16px; }
        .gomb:hover { background: #45a049; }
        .vege { color: red; font-weight: bold; }
        .gratula { color: green; font-weight: bold; font-size: 20px; }
        .finish-lista { background: #fffacd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        input[type="text"] { padding: 10px; font-size: 16px; width: 300px; }
      </style>
      <div class="jatek-container">
        <h1>🐹 Tengerimalac Kaland</h1>
        ${allapot.jatekosNev ? '<p><strong>Játékos:</strong> ' + allapot.jatekosNev + '</p>' : ''}
        <div class="finish-lista">
          <strong>Feloldott Finishek:</strong> ${allapot.finishek.join(', ') || 'Meg nincs'}<br>
          <strong>Gyozelem Pontok:</strong> ${allapot.gyozelemPontok}/10
          ${allapot.gyozelemPontok >= 10 ? '<br><span class="gratula">🎉 KIVITTED A JATEKOT! 🎉</span>' : ''}
        </div>
        <div id="jatek-tartalom">
          ${allapot.jatekosNev ? '<p>Egy kertes haz nappalijaban egy ketrecben elsz tengerimalackent.</p><button class="gomb" onclick="ketrec()">Jatek Inditasa</button>' : '<p>Egy kertes haz nappalijaban egy ketrecben elsz tengerimalackent.</p><p><strong>Add meg a neved:</strong></p><form onsubmit="event.preventDefault(); startJatek();"><input type="text" id="nev-input" placeholder="A neved..." required><button type="submit" class="gomb">Jatek Inditasa</button></form>'}
        </div>
      </div>
      <script>
        let sessionId = localStorage.getItem('tengerimalac_session');
        if (!sessionId) {
          sessionId = '${sessionId}';
          localStorage.setItem('tengerimalac_session', sessionId);
        }
        let jatekosNev = '${allapot.jatekosNev}';

        async function startJatek() {
          jatekosNev = document.getElementById('nev-input').value;
          await fetch('/jatek-nev-mentes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, jatekosNev })
          });
          ketrec();
        }

        function ketrec() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Szia ' + (jatekosNev || 'Játékos') + '! A kisfiu aki a gazdad nyitva hagyta a ketrecet etetes kozben veletlenul.</p>' +
            '<button class="gomb" onclick="bentMaradsz()">Bent maradok</button>' +
            '<button class="gomb" onclick="valaszt(\\'nappali\\')">Nappaliba megyek</button>' +
            '<button class="gomb" onclick="valaszt(\\'garazs\\')">Garazsba megyek</button>' +
            '<button class="gomb" onclick="valaszt(\\'wc\\')">WC-be megyek</button>' +
            '<button class="gomb" onclick="valaszt(\\'lift\\')">Liftbe megyek</button>';
        }

        function bentMaradsz() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Osszeverekedtel egy masik malaccal az uborkán!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function valaszt(hely) {
          if (hely === 'nappali') nappali();
          else if (hely === 'garazs') garazs();
          else if (hely === 'wc') wc();
          else if (hely === 'lift') lift();
          else if (hely === 'kert') kert();
          else if (hely === 'vetemenyeshaz') vetemenyeshaz();
          else if (hely === 'kek_szoba') kekSzoba();
          else if (hely === 'rozsaszin_szoba') rozsaszinSzoba();
          else if (hely === 'minel') minusEgyesEmelet();
          else if (hely === 'buszallomas') buszallomas();
          else if (hely === 'repuloter') repuloter();
          else if (hely === 'kinai') kinai();
        }

        function garazs() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A garazsban vagy. Latsz kiszorodott golyokat es egy dolgot amit a gazda vett a boltban.</p>' +
            '<button class="gomb" onclick="golyokEsz()">Megeszel a kiszorodott golyokat</button>' +
            '<button class="gomb" onclick="boltosKajaEsz()">Megeszel a boltos kajat</button>';
        }

        function golyokEsz() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Megetted a patkanymerget!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        async function boltosKajaEsz() {
          await mentFinish('Auchanos malackaja');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULALUNK! Ez a kaja tengerimalac kaja volt ezert jollaktal!</p>' +
            '<p>Feloldottad a finisht: <strong>Auchanos malackaja</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function lift() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A liftben vagy. Hova mesz?</p>' +
            '<button class="gomb" onclick="elsoEmelet()">1. emelet</button>' +
            '<button class="gomb" onclick="valaszt(\\'minel\\')">-1. szint</button>';
        }

        function elsoEmelet() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Az 1. emeleten vagy. Hova mesz?</p>' +
            '<button class="gomb" onclick="valaszt(\\'kek_szoba\\')">Kek szoba</button>' +
            '<button class="gomb" onclick="valaszt(\\'rozsaszin_szoba\\')">Rozsaszin szoba</button>';
        }

        function kekSzoba() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A kek szobaban vagy. Kimehetsz az erkelyre.</p>' +
            '<button class="gomb" onclick="erkely()">Erkely</button>';
        }

        function erkely() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Az erkelyen vagy. Hogyan mesz le a kertbe?</p>' +
            '<button class="gomb" onclick="papirSarkany()">Papirsarkanyon</button>' +
            '<button class="gomb" onclick="letra()">Letran</button>';
        }

        function papirSarkany() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Sikeresen landoltal a kertben!</p>' +
            '<button class="gomb" onclick="valaszt(\\'kert\\')">Tovabb</button>';
        }

        function letra() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Lent nem volt rogzitve a letra! Legkozelebb nezd meg hova lepsz...</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function minusEgyesEmelet() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A -1. szinten vagy. Hallasz egy fura hangot es latsz illatos golyokat a foldon.</p>' +
            '<button class="gomb" onclick="hangFele()">A hang fele megyek</button>' +
            '<button class="gomb" onclick="illatosGolyok()">Megeszel az illatos golyokat</button>';
        }

        function hangFele() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Nem hallottad, hogy FURA hang? Egy patkany radugrott es megharapott!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function illatosGolyok() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Patkanymereg! Gondolkozz mielott cselekszel!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function wc() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A WC-ben talalkozol a Kakimanoval, aki azt mondja: "Kovess!"</p>' +
            '<button class="gomb" onclick="kovet()">Kovetem</button>' +
            '<button class="gomb" onclick="tovabbMegy()">Tovabb megyek</button>';
        }

        function kovet() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Beugrottal a WC lefolyoba!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function tovabbMegy() {
          garazs();
        }

        function kert() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A kertben vagy. Mit teszel?</p>' +
            '<button class="gomb" onclick="utca()">Kimegyek az utcara</button>' +
            '<button class="gomb" onclick="kerites()">Megyek a keriteshez</button>' +
            '<button class="gomb" onclick="valaszt(\\'vetemenyeshaz\\')">Megyek a vetemenyeshez</button>';
        }

        function utca() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Elutott az auto!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function kerites() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! A kutya megharapott!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function vetemenyeshaz() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A vetemenyesnel vagy. Latsz egy hintat.</p>' +
            '<button class="gomb" onclick="hinta()">Felszallok a hintara</button>' +
            '<button class="gomb" onclick="tovabbMegyFugebokur()">Tovabb megyek</button>';
        }

        function hinta() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Atrepultel a gazda kinai szomszedjához, ahol megettek!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        async function tovabbMegyFugebokur() {
          await mentFinish('Finom Fuge');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULALUNK! Megtalaltad a fugebokrot es megetted az osszes fuget!</p>' +
            '<p>Feloldottad a finisht: <strong>Finom Fuge</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function nappali() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A nappaliban talalkozol a Jatek Manoval.</p>' +
            '<button class="gomb" onclick="leutJatekMano()">Leut mert felix tole</button>' +
            '<button class="gomb" onclick="meghallgatJatekMano()">Meghallgatom</button>';
        }

        function leutJatekMano() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! Leutotted Jatek Manot ezert elvarazsolt!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function meghallgatJatekMano() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A Jatek Mano mutat egy titkos atjarot. Atmesz rajta es eljutsz a kinaiakhoz.</p>' +
            '<button class="gomb" onclick="valaszt(\\'kinai\\')">Tovabb</button>';
        }

        function kinai() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VEGE! A kinai szomszedoknal vagy, es megettek teged!</p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        function rozsaszinSzoba() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A rozsaszin szobaban vagy. Van egy jatekrepulo.</p>' +
            '<button class="gomb" onclick="valaszt(\\'buszallomas\\')">Elmegyek a jatekrepulon a buszallomasra</button>';
        }

        function buszallomas() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A buszallomason vagy.</p>' +
            '<button class="gomb" onclick="valaszt(\\'repuloter\\')">Elmegyek a repuloterre</button>';
        }

        function repuloter() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A repuloteren vagy. Hova utazol?</p>' +
            '<button class="gomb" onclick="papuaUjGuinea()">Papua-Uj Guinea</button>' +
            '<button class="gomb" onclick="magyarorszag()">Magyarorszag</button>';
        }

        async function papuaUjGuinea() {
          await mentFinish('Guinea a Guineaban');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULALUNK! Guineakent elmentel Guineaba!</p>' +
            '<p>Feloldottad a finisht: <strong>Guinea a Guineaban</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        async function magyarorszag() {
          await mentFinish('minek pazaroltál erre egymilliot?');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULALUNK! Mondjuk ide autoval is el tudtal volna jonni...</p>' +
            '<p>Feloldottad a finisht: <strong>minek pazaroltál erre egymilliot?</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Uj Jatek</button>';
        }

        async function mentFinish(finishNev) {
          try {
            const response = await fetch('/jatek-mentes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, finishNev })
            });
            const data = await response.json();
            if (data.ujPont) {
              alert('🎉 UJ GYOZELEM PONT! Osszes pont: ' + data.gyozelemPontok + '/10');
            }
          } catch (error) {
            console.error('Mentes hiba:', error);
          }
        }

        function ujJatek() {
          window.location.href = '/tengerimalac-jatek?session=' + sessionId;
        }
      </script>
    `;
    
    res.send(html);
  } catch (error) {
    res.send(getMenu() + '<p>Hiba tortent!</p>');
  }
});

// NÉV MENTÉSE
app.post('/jatek-nev-mentes', async (req, res) => {
  try {
    const { sessionId, jatekosNev } = req.body;
    await jatekAllapotCollection.updateOne(
      { sessionId },
      { $set: { jatekosNev } },
      { upsert: true }
    );
    res.json({ sikeres: true });
  } catch (error) {
    res.json({ sikeres: false });
  }
});

// TETRIS JÁTÉK
app.get('/tetris', (req, res) => {
  const html = `
    ${getMenu()}
    <style>
      body { font-family: Arial; background: #1a1a2e; color: white; text-align: center; }
      #tetris-canvas { border: 3px solid #fff; background: #0f0f1e; margin: 20px auto; display: block; }
      .pontszam { font-size: 24px; margin: 10px; }
    </style>
    <h1>🟦 TETRIS</h1>
    <div class="pontszam">Pontszám: <span id="score">0</span></div>
    <canvas id="tetris-canvas" width="300" height="600"></canvas>
    <p>Irányítás: ← → Mozgás | ↑ Forgatás | ↓ Gyorsítás | Space Ledobás</p>
    <script>
      const canvas = document.getElementById('tetris-canvas');
      const ctx = canvas.getContext('2d');
      const ROWS = 20, COLS = 10, BLOCK = 30;
      let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
      let score = 0;
      let currentPiece, currentX, currentY;
      let gameOver = false;
      let dropCounter = 0;
      let dropInterval = 1000;
      let lastTime = 0;

      const PIECES = [
        [[1,1,1,1]], // I
        [[1,1],[1,1]], // O
        [[0,1,0],[1,1,1]], // T
        [[1,0,0],[1,1,1]], // L
        [[0,0,1],[1,1,1]], // J
        [[0,1,1],[1,1,0]], // S
        [[1,1,0],[0,1,1]]  // Z
      ];
      const COLORS = ['#00f0f0','#f0f000','#a000f0','#f0a000','#0000f0','#00f000','#f00000'];

      function newPiece() {
        const idx = Math.floor(Math.random() * PIECES.length);
        currentPiece = PIECES[idx].map(row => [...row]);
        currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
        currentY = 0;
        if (collision()) { gameOver = true; alert('Game Over! Pontszám: ' + score); location.reload(); }
      }

      function collision() {
        for (let y = 0; y < currentPiece.length; y++) {
          for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] && (board[currentY + y] && board[currentY + y][currentX + x]) !== 0) return true;
            if (currentPiece[y][x] && (currentY + y >= ROWS || currentX + x < 0 || currentX + x >= COLS)) return true;
          }
        }
        return false;
      }

      function merge() {
        for (let y = 0; y < currentPiece.length; y++) {
          for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) board[currentY + y][currentX + x] = 1;
          }
        }
      }

      function rotate() {
        const rotated = currentPiece[0].map((_, i) => currentPiece.map(row => row[i]).reverse());
        const prev = currentPiece;
        currentPiece = rotated;
        if (collision()) currentPiece = prev;
      }

      function clearLines() {
        outer: for (let y = ROWS - 1; y >= 0; y--) {
          for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) continue outer;
          }
          board.splice(y, 1);
          board.unshift(Array(COLS).fill(0));
          score += 100;
          document.getElementById('score').textContent = score;
          y++;
        }
      }

      function drop() {
        currentY++;
        if (collision()) {
          currentY--;
          merge();
          clearLines();
          newPiece();
        }
        dropCounter = 0;
      }

      function hardDrop() {
        while (!collision()) currentY++;
        currentY--;
        merge();
        clearLines();
        newPiece();
      }

      function draw() {
        ctx.fillStyle = '#0f0f1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
              ctx.fillStyle = '#666';
              ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
              ctx.strokeStyle = '#000';
              ctx.strokeRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
            }
          }
        }

        for (let y = 0; y < currentPiece.length; y++) {
          for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
              ctx.fillStyle = '#f0f';
              ctx.fillRect((currentX + x) * BLOCK, (currentY + y) * BLOCK, BLOCK, BLOCK);
              ctx.strokeStyle = '#000';
              ctx.strokeRect((currentX + x) * BLOCK, (currentY + y) * BLOCK, BLOCK, BLOCK);
            }
          }
        }
      }

      function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) drop();
        draw();
        if (!gameOver) requestAnimationFrame(update);
      }

      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { currentX--; if (collision()) currentX++; }
        if (e.key === 'ArrowRight') { currentX++; if (collision()) currentX--; }
        if (e.key === 'ArrowDown') drop();
        if (e.key === 'ArrowUp') rotate();
        if (e.key === ' ') { e.preventDefault(); hardDrop(); }
      });

      newPiece();
      update();
    </script>
  `;
  res.send(html);
});

// SNAKE JÁTÉK - JAVÍTOTT, NEM ÍR KI FOLYAMATOSAN GAME OVERT
app.get('/snake', (req, res) => {
  const html = `
    ${getMenu()}
    <style>
      body { font-family: Arial; background: #1a1a1a; color: white; text-align: center; }
      #snake-canvas { border: 3px solid #4ECDC4; background: #0a0a0a; margin: 20px auto; display: block; }
      .pontszam { font-size: 24px; margin: 10px; }
    </style>
    <h1>🐍 SNAKE</h1>
    <div class="pontszam">Pontszám: <span id="score">0</span></div>
    <canvas id="snake-canvas" width="400" height="400"></canvas>
    <p>Irányítás: ← → ↑ ↓ vagy W A S D</p>
    <script>
      const canvas = document.getElementById('snake-canvas');
      const ctx = canvas.getContext('2d');
      const GRID = 20;
      let snake = [{x: 10, y: 10}];
      let food = {x: 15, y: 15};
      let dx = 0, dy = 0;
      let score = 0;
      let gameRunning = true;
      let gameOverShown = false;

      function randomFood() {
        food = {
          x: Math.floor(Math.random() * (canvas.width / GRID)),
          y: Math.floor(Math.random() * (canvas.height / GRID))
        };
      }

      function draw() {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#4ECDC4';
        snake.forEach((segment, i) => {
          ctx.fillRect(segment.x * GRID, segment.y * GRID, GRID - 2, GRID - 2);
        });
        
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(food.x * GRID, food.y * GRID, GRID - 2, GRID - 2);
      }

      function update() {
        if (!gameRunning) return;
        
        if (dx === 0 && dy === 0) return;
        
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        if (head.x < 0 || head.x >= canvas.width / GRID || 
            head.y < 0 || head.y >= canvas.height / GRID ||
            snake.some(s => s.x === head.x && s.y === head.y)) {
          gameRunning = false;
          if (!gameOverShown) {
            gameOverShown = true;
            alert('Game Over! Pontszám: ' + score);
            location.reload();
          }
          return;
        }
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
          score += 10;
          document.getElementById('score').textContent = score;
          randomFood();
        } else {
          snake.pop();
        }
        
        draw();
      }

      document.addEventListener('keydown', e => {
        if ((e.key === 'ArrowLeft' || e.key === 'a') && dx === 0) { dx = -1; dy = 0; }
        if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) { dx = 1; dy = 0; }
        if ((e.key === 'ArrowUp' || e.key === 'w') && dy === 0) { dx = 0; dy = -1; }
        if ((e.key === 'ArrowDown' || e.key === 's') && dy === 0) { dx = 0; dy = 1; }
      });

      draw();
      setInterval(update, 100);
    </script>
  `;
  res.send(html);
});

// LABIRINTUS JÁTÉK
app.get('/labirintus', (req, res) => {
  const html = `
    ${getMenu()}
    <style>
      body { font-family: Arial; background: #2c3e50; color: white; text-align: center; }
      #maze-canvas { border: 3px solid #FFD93D; background: #1a1a1a; margin: 20px auto; display: block; }
      .info { font-size: 20px; margin: 10px; }
    </style>
    <h1>🎯 LABIRINTUS</h1>
    <div class="info">Szint: <span id="level">1</span> | Lépések: <span id="steps">0</span></div>
    <canvas id="maze-canvas" width="500" height="500"></canvas>
    <p>Irányítás: ← → ↑ ↓ vagy W A S D | Cél: Érj a piros célhoz! 🎯</p>
    <script>
      const canvas = document.getElementById('maze-canvas');
      const ctx = canvas.getContext('2d');
      const SIZE = 25;
      let level = 1;
      let steps = 0;
      let playerX = 1, playerY = 1;
      let maze = [];

      function generateMaze(w, h) {
        const m = Array(h).fill().map(() => Array(w).fill(1));
        
        function carve(x, y) {
          const dirs = [[0,-2],[2,0],[0,2],[-2,0]].sort(() => Math.random() - 0.5);
          for (let [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && m[ny][nx] === 1) {
              m[y + dy/2][x + dx/2] = 0;
              m[ny][nx] = 0;
              carve(nx, ny);
            }
          }
        }
        
        m[1][1] = 0;
        carve(1, 1);
        m[h-2][w-2] = 2;
        return m;
      }

      function newLevel() {
        const size = Math.min(15 + level * 2, 19);
        maze = generateMaze(size, size);
        playerX = 1;
        playerY = 1;
        steps = 0;
        document.getElementById('level').textContent = level;
        document.getElementById('steps').textContent = steps;
      }

      function draw() {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < maze.length; y++) {
          for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
              ctx.fillStyle = '#34495e';
              ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
            } else if (maze[y][x] === 2) {
              ctx.fillStyle = '#e74c3c';
              ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
            }
          }
        }
        
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(playerX * SIZE + SIZE/2, playerY * SIZE + SIZE/2, SIZE/2 - 2, 0, Math.PI * 2);
        ctx.fill();
      }

      function move(dx, dy) {
        const newX = playerX + dx;
        const newY = playerY + dy;
        
        if (newY >= 0 && newY < maze.length && newX >= 0 && newX < maze[0].length && maze[newY][newX] !== 1) {
          playerX = newX;
          playerY = newY;
          steps++;
          document.getElementById('steps').textContent = steps;
          
          if (maze[playerY][playerX] === 2) {
            level++;
            alert('Gratulálok! Szint ' + level + ' teljesítve! Lépések: ' + steps);
            newLevel();
          }
          
          draw();
        }
      }

      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0);
        if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0);
        if (e.key === 'ArrowUp' || e.key === 'w') move(0, -1);
        if (e.key === 'ArrowDown' || e.key === 's') move(0, 1);
      });

      newLevel();
      draw();
    </script>
  `;
  res.send(html);
});

app.post('/jatek-mentes', async (req, res) => {
  try {
    const { sessionId, finishNev } = req.body;
    let allapot = await jatekAllapotCollection.findOne({ sessionId });
    
    if (!allapot) {
      allapot = { sessionId, finishek: [], gyozelemPontok: 0, jatekosNev: '' };
    }
    
    let ujPont = false;
    if (!allapot.finishek.includes(finishNev)) {
      allapot.finishek.push(finishNev);
      
      const osszesFinish = ['Auchanos malackaja', 'Finom Fuge', 'Guinea a Guineaban', 'minek pazaroltál erre egymilliot?'];
      const mindMegvan = osszesFinish.every(f => allapot.finishek.includes(f));
      
      if (mindMegvan && allapot.gyozelemPontok < 10) {
        allapot.gyozelemPontok += 1;
        allapot.finishek = [];
        ujPont = true;
      }
      
      await jatekAllapotCollection.updateOne(
        { sessionId },
        { $set: allapot },
        { upsert: true }
      );
    }
    
    res.json({ sikeres: true, ujPont, gyozelemPontok: allapot.gyozelemPontok });
  } catch (error) {
    res.json({ sikeres: false });
  }
});

app.listen(port, () => {
  console.log('Az oldal fut: http://localhost:3000');
});
