const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// JAVÍTOTT VERZIÓ - a szerver akkor is elindul, ha nincs MongoDB
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'elso-weboldalam';
let db;
let uzenetekCollection;
let jatekAllapotCollection;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    console.error('MongoDB kapcsolódási hiba:', error);
    console.log('Az oldal MongoDB nélkül fut, néhány funkció nem elérhető.');
  });

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
    console.log('Új üzenet mentve!');
    res.redirect('/uzenofal');
  } catch (error) {
    res.send('Hiba történt!');
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
          <strong>Feloldott Finishek:</strong> ${allapot.finishek.join(', ') || 'Még nincs'}<br>
          <strong>Győzelem Pontok:</strong> ${allapot.gyozelemPontok}/10
          ${allapot.gyozelemPontok >= 10 ? '<br><span class="gratula">🎉 KIVITTED A JÁTÉKOT! 🎉</span>' : ''}
        </div>
        <div id="jatek-tartalom">
          ${allapot.jatekosNev ? '<p>Egy kertes ház nappalijában egy ketrecben élsz tengerimalacként.</p><button class="gomb" onclick="ketrec()">Játék Indítása</button>' : '<p>Egy kertes ház nappalijában egy ketrecben élsz tengerimalacként.</p><p><strong>Add meg a neved:</strong></p><form onsubmit="event.preventDefault(); startJatek();"><input type="text" id="nev-input" placeholder="A neved..." required><button type="submit" class="gomb">Játék Indítása</button></form>'}
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
            '<p>Szia ' + (jatekosNev || 'Játékos') + '! A kisfiú aki a gazdád nyitva hagyta a ketrecet etetés közben véletlenül.</p>' +
            '<button class="gomb" onclick="bentMaradsz()">Bent maradok</button>' +
            '<button class="gomb" onclick="valaszt(\\'nappali\\')">Nappaliba megyek</button>' +
            '<button class="gomb" onclick="valaszt(\\'garazs\\')">Garázsba megyek</button>' +
            '<button class="gomb" onclick="valaszt(\\'wc\\')">WC-be megyek</button>' +
            '<button class="gomb" onclick="valaszt(\\'lift\\')">Liftbe megyek</button>';
        }

        function bentMaradsz() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Összeverekedtél egy másik malaccal az uborkán!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
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
            '<p>A garázsban vagy. Látsz kiszóródott golyókat és egy dolgot amit a gazda vett a boltban.</p>' +
            '<button class="gomb" onclick="golyokEsz()">Megeszel a kiszóródott golyókat</button>' +
            '<button class="gomb" onclick="boltosKajaEsz()">Megeszel a boltos kaját</button>';
        }

        function golyokEsz() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Megetted a patkánymérgét!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        async function boltosKajaEsz() {
          await mentFinish('Auchanos malackája');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULÁLUNK! Ez a kaja tengerimalac kaja volt ezért jóllaktál!</p>' +
            '<p>Feloldottad a finisht: <strong>Auchanos malackája</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function lift() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A liftben vagy. Hova mész?</p>' +
            '<button class="gomb" onclick="elsoEmelet()">1. emelet</button>' +
            '<button class="gomb" onclick="valaszt(\\'minel\\')"">-1. szint</button>';
        }

        function elsoEmelet() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Az 1. emeleten vagy. Hova mész?</p>' +
            '<button class="gomb" onclick="valaszt(\\'kek_szoba\\')">Kék szoba</button>' +
            '<button class="gomb" onclick="valaszt(\\'rozsaszin_szoba\\')">Rózsaszín szoba</button>';
        }

        function kekSzoba() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A kék szobában vagy. Kimehetsz az erkélyre.</p>' +
            '<button class="gomb" onclick="erkely()">Erkély</button>';
        }

        function erkely() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Az erkélyen vagy. Hogyan mész le a kertbe?</p>' +
            '<button class="gomb" onclick="papirSarkany()">Papírsárkányon</button>' +
            '<button class="gomb" onclick="letra()">Létrán</button>';
        }

        function papirSarkany() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>Sikeresen landoltál a kertben!</p>' +
            '<button class="gomb" onclick="valaszt(\\'kert\\')">Tovább</button>';
        }

        function letra() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Lent nem volt rögzítve a létra! Legközelebb nézd meg hova lépsz...</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function minusEgyesEmelet() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A -1. szinten vagy. Hallasz egy fura hangot és látsz illatos golyókat a földön.</p>' +
            '<button class="gomb" onclick="hangFele()">A hang felé megyek</button>' +
            '<button class="gomb" onclick="illatosGolyok()">Megeszel az illatos golyókat</button>';
        }

        function hangFele() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Nem hallottad, hogy FURA hang? Egy patkány ráugrott és megharapott!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function illatosGolyok() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Patkányméreg! Gondolkozz mielőtt cselekszel!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function wc() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A WC-ben találkozol a Kakimanóval, aki azt mondja: "Kövess!"</p>' +
            '<button class="gomb" onclick="kovet()">Követem</button>' +
            '<button class="gomb" onclick="tovabbMegy()">Tovább megyek</button>';
        }

        function kovet() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Beugroltál a WC lefolyóba!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function tovabbMegy() {
          garazs();
        }

        function kert() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A kertben vagy. Mit teszel?</p>' +
            '<button class="gomb" onclick="utca()">Kimegyek az utcára</button>' +
            '<button class="gomb" onclick="kerites()">Megyek a kerítéshez</button>' +
            '<button class="gomb" onclick="valaszt(\\'vetemenyeshaz\\')">Megyek a veteményeshez</button>';
        }

        function utca() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Elütött az autó!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function kerites() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! A kutya megharapott!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function vetemenyeshaz() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A veteményesnél vagy. Látsz egy hintát.</p>' +
            '<button class="gomb" onclick="hinta()">Felszállok a hintára</button>' +
            '<button class="gomb" onclick="tovabbMegyFugebokur()">Tovább megyek</button>';
        }

        function hinta() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Átrepültél a gazda kínai szomszédjához, ahol megettek!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        async function tovabbMegyFugebokur() {
          await mentFinish('Finom Füge');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULÁLUNK! Megtaláltad a fügebokrot és megetted az összes fügét!</p>' +
            '<p>Feloldottad a finisht: <strong>Finom Füge</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function nappali() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A nappaliban találkozol a Játék Manóval.</p>' +
            '<button class="gomb" onclick="leutJatekMano()">Leüt mert félek tőle</button>' +
            '<button class="gomb" onclick="meghallgatJatekMano()">Meghallgatom</button>';
        }

        function leutJatekMano() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! Leütötted Játék Manót ezért elvarázsolt!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function meghallgatJatekMano() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A Játék Manó mutat egy titkos átjárót. Átmész rajta és eljutsz a kínaiakhoz.</p>' +
            '<button class="gomb" onclick="valaszt(\\'kinai\\')">Tovább</button>';
        }

        function kinai() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="vege">VÉGE! A kínai szomszédoknál vagy, és megettek téged!</p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        function rozsaszinSzoba() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A rózsaszín szobában vagy. Van egy játékrepülő.</p>' +
            '<button class="gomb" onclick="valaszt(\\'buszallomas\\')">Elmegyek a játékrepülőn a buszállomásra</button>';
        }

        function buszallomas() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A buszállomáson vagy.</p>' +
            '<button class="gomb" onclick="valaszt(\\'repuloter\\')">Elmegyek a repülőtérre</button>';
        }

        function repuloter() {
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p>A repülőtéren vagy. Hova utazol?</p>' +
            '<button class="gomb" onclick="papuaUjGuinea()">Pápua-Új Guinea</button>' +
            '<button class="gomb" onclick="magyarorszag()">Magyarország</button>';
        }

        async function papuaUjGuinea() {
          await mentFinish('Guinea a Guineában');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULÁLUNK! Guineaként elmentél Guineába!</p>' +
            '<p>Feloldottad a finisht: <strong>Guinea a Guineában</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
        }

        async function magyarorszag() {
          await mentFinish('minek pazaroltál erre egymilliót?');
          document.getElementById('jatek-tartalom').innerHTML = 
            '<p class="gratula">GRATULÁLUNK! Mondjuk ide autóval is el tudtál volna jönni...</p>' +
            '<p>Feloldottad a finisht: <strong>minek pazaroltál erre egymilliót?</strong></p>' +
            '<button class="gomb" onclick="ujJatek()">Új Játék</button>';
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
              alert('🎉 ÚJ GYŐZELEM PONT! Összes pont: ' + data.gyozelemPontok + '/10');
            }
          } catch (error) {
            console.error('Mentés hiba:', error);
          }
        }

        function ujJatek() {
          window.location.href = '/tengerimalac-jatek?session=' + sessionId;
        }
      </script>
    `;
    
    res.send(html);
  } catch (error) {
    res.send(getMenu() + '<p>Hiba történt!</p>');
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
      .pontszam { font-size: 24px;
