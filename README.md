# SecretSanta
Aplikacija Secret Santa omogućava online organizaciju igre razmjene poklona unutar kompanije. Korisnici mogu da se registruju u sistem kao zaposleni ili administrator. Sve korisnike (osim prvog admina) mogu da odobre ili odbiju postojeći odobreni admini, tako da samo odobrenim korisnicima je omogućena prijava u sistem. Admini mogu da generišu parove (za tekuću godinu) za Secret Santa igru, tako da svaka osoba dobija nekoga kome će darovati poklon. Adminima je takođe omogućeno da, osim prikaza parova za tekuću godinu, imaju uvid i u parove za prethodne godine kada je igra organizovana. Zaposleni mogu da vide samo svoj dodijeljeni par za tekuću godinu, odnosno osobu kojoj će da kupe/daruju poklon, kao i listu ličnih parova za prethodne godine (u kojima su učestvovali).

## Tehnologije
*Backend*: .NET (C#)  
*Frontend*: React (TypeScript)  
*Autentifikacija*: JWT   
*Obavještenja*: Toastify  
*Baza podataka*: SQL Server  

## Ključne funkcionalnosti  
### Registracija
- Svi korisnici kreiraju naloge unoseći osnovne tražene podatke.
- Pristup sistemu nije omogućen prije nego se korisnički nalog odobri od strane administratora.

###Pregled i upravljanje korisničkim zahtjevima
- Administrator ima prikaz liste korisničkih zahtjeva koji čekaju odobrenje.
- Administrator ima mogućnost odbijanja ili odobravanja naloga.

###Parovi za igru Secret Santa 
- Administrator može generisati parove u igri Secret Santa za tekuću godinu.
- Administratoru je omogućen prikaz liste parova za tekuću godinu, kao i za sve prethodne u kojima je igra realizovana.
- Zaposleni može da vidi svoj nasumično dodijeljeni par (osobu kojoj će kupiti/darovati poklon), kao i listu njegovih ličnih parova u prethodnim godinama u kojima je učestvovao.
- Generisani parovi se čuvaju u bazi, i može da postoji jedna godišnja aktivna lista parova.
  
### Notifikacije
- Implementirana su Toatify obavještenja.
 
### Autentifikacija 
- Autentifikacija je realizovana koristeći JWT tokene (access i refresh).
- Access token se šalje u zaglavlju HTTP zahtjeva za pristup resursima, dok refresh token služi za obnavljanje access tokena, kako bi se produžila prijava korisnika u sistemu.
 
## Pokretanje  
### Baza:
- Potrebno je importovati sql bazu, tj. pokrenuti skriptu (fajl *secretSanta_script.sql*) u SQL Server Management Studio.
- Kredencijali za pristup nakon popunjavanja baze su:
  email: ivana@test.com   password: sifra123 (administratorski nalog)
  email: ivan@test.com    password: sifra123 (nalog zaposlenog)
  
### Backend:  
- Nakon otvaranja aplikacije u Visual Studio Code-u, potrebno je u terminal ukucati komandu *dotnet watch run*.  Ukoliko je to neophodno, prije pokretanja je potrebno promijeniti konekcioni string tako da on odgovara instanci SQL Servera koju imate instaliranu na vašem računaru.
 
### Frontend:
- Potrebno je otvoriti frontend direktorijum, pa instalirati zavisnosti pomoću komande *npm install*. Zatim možete pokrenuti aplikaciju koristeći komandu *npm start*.
 
## Autor
Ivana Jugović – *jugovicivana12@gmail.com*  

