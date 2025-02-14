var playerUpSpeedFactor = 2;
var sound = [true, true];
var clearEnemies = false;
var DEV = false;
var centrel;
var timeouts = {
  popup: null,
  timer: null,
  bgmusic: null,
  switchShip: null,
  newWorld: null
};
var pauseGameStuff = false;
var isAWorldActive = false;
var shipNames = ["TRAINEE", "GUNSHIP", "GUNSHIP+", "ENTERPRISE D", "KLINGON", "STAR DESTROYER", "LASERMAN", "LASERMAN+", "DEEP SPACE 9", "SQUADRON BASE"];
var weaponNames = ["NO WEAPON", "GUN", "TORPEDO", "LASER", "BASE 1", "BASE 2", "BASE 2+"];
var worldMeterTime = 200;
var planetDistances = [200, 300, 400, 500, 600, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];
var squadronLives = 5;
var worldNumber = 1;
var remainingDistanceToPlanet = 200;
var weaponDamage = [0, 1, 3, 5, 0, 0];
var originalDimensions = [];
var currentDimensions = [];
var playersUnlocked = [1,0,0,0,0,0,0,0,0,0];
var playersIReallyUnlocked = [1,0,0,0,0,0,0,0,0,0];
var selectedShip = 0;
var gameWidth;
var gameHeight;
var barHeight;
var barWidth;
var playerHeight;
var playerWidth;
var refreshRate = 15;
var parallaxSpeed = 3; 
var enemySpawnRates = [200]; //0 = asteroid
var missileSpeeds = [0,13,17,20];
var background;
var playerSpeed = 15;
var playerHealths = [5,5,5,5,5,5,5,5,5,5];
var playerShields = [0,0,5,0,5,10,0,5,0,10];
var playerOriginalLives = playerHealths.slice();
var playerOriginalShields = playerShields.slice();
var enemySpeeds = [3]; //0 = asteroid
var shipWeaponTypes = [0,1,1,2,2,3,3,3,5,6]; //0 = none 1 = gun 2 = torpedo 3 = laser 4= BASE 1, 5= BASE 2, 6 = BASE 2+
var playerTotalHeight;
var weaponAmountsMax = [0,20,20,10,10,500,500,500,0,0];
var enemyWidths = []; // 0 = asteroid
var enemyHeights = []; // 0 = asteroid
var healthBarHeight;
var shieldBarHeight;
var weaponAmounts = weaponAmountsMax.slice();
var barBorders;
var shieldWidths = [];
var healthWidths = [];
var healthBars = [];
var shieldBars = [];
var shieldsActive = [];
var shieldRespawnTime = 7000;
var squadronShips = [];
var squadronElements = [];
var weaponRespawnTime = 500;
var noOfShips = 6;
var storySlide = 1;

for(var i = 0; i < playerShields.length; i++){
  if(playerShields[i] == 0){
    shieldsActive[i] = false;
  }else{
    shieldsActive[i] = true;
  }
}

function playBgMusic(){
  if(sound[0]){
    var rand = 'bg' + Math.floor(Math.random() * 3);
    document.getElementById(rand).volume = 0.2;
    document.getElementById(rand).currentTime = 0.000000000000000000000000000000000000000000000000000000000000000;
    document.getElementById(rand).play();
    timeouts.bgmusic = setTimeout(function(){
      playBgMusic();
    }, (document.getElementById(rand).duration*1000));
  }
}

function stopBgMusic(){
  window.clearTimeout(timeouts.bgmusic);
  for(var i = 0; i < 3; i++){
    document.getElementById("bg" + i).pause();
    document.getElementById("bg" + i).currentTime = 0.000000000000000000000000000000000000000000000000000000000000000;
  }
}

function mainMenu(option){
  document.getElementById("mainMenu").style.display = "none";
  switch(option){
    case 0:
      document.getElementById("story").style.display = "block";
      break;
    case 1:
      document.getElementById("settingsMenu").style.display = "block";
      break;
    case 2:
      document.getElementById("creditsMenu").style.display = "block";
      break;
  }
}
function settingsMenu(option){
  switch(option){
    case 0:
      if(sound[0]){
        sound[0] = false;
        document.getElementById("music").innerHTML = "MUSIC - OFF";
        document.getElementById("music2").innerHTML = "MUSIC - OFF";
      }else{
        sound[0] = true;
        document.getElementById("music").innerHTML = "MUSIC - ON";
        document.getElementById("music2").innerHTML = "MUSIC - ON";
      }
      break;
    case 1:
      if(sound[1]){
        sound[1] = false;
        document.getElementById("sfx").innerHTML = "SFX - OFF";
        document.getElementById("sfx2").innerHTML = "SFX - OFF";
      }else{
        sound[1] = true;
        document.getElementById("sfx").innerHTML = "SFX - ON";
        document.getElementById("sfx2").innerHTML = "SFX - ON";
      }
      break;
    case 2:
      document.getElementById("settingsMenu").style.display = "none";
      document.getElementById("mainMenu").style.display = "block";
      break;
  }
}
function inGameSettingsMenu(option){
  switch(option){
    case 0:
      if(sound[0]){
        sound[0] = false;
        stopBgMusic();
        document.getElementById("music").innerHTML = "MUSIC - OFF";
        document.getElementById("music2").innerHTML = "MUSIC - OFF";
      }else{
        sound[0] = true;
        playBgMusic();
        document.getElementById("music").innerHTML = "MUSIC - ON";
        document.getElementById("music2").innerHTML = "MUSIC - ON";
      }
      break;
    case 1:
      if(sound[1]){
        sound[1] = false;
        document.getElementById("sfx").innerHTML = "SFX - OFF";
        document.getElementById("sfx2").innerHTML = "SFX - OFF";
      }else{
        sound[1] = true;
        document.getElementById("sfx").innerHTML = "SFX - ON";
        document.getElementById("sfx2").innerHTML = "SFX - ON";
      }
      break;
    case 2:
      document.getElementById("inGameSettingsMenu").style.display = "none";
      document.getElementById("pauseMenu").style.display = "block";
      break;
  }
}
function credits(option){
  switch(option){
    case 0:
      document.getElementById("creditsMenu").style.display = "none";
      document.getElementById("mainMenu").style.display = "block";
      break;
  }
}
function story(option){
  switch(option){
    case 0:
      document.getElementById("story").style.display = "none";
      document.getElementById("mainMenu").style.display = "block";
      break;
    case 1:
      if(storySlide < 5){
        document.getElementById("story-" + storySlide).style.display = "none";
        storySlide += 1;
        document.getElementById("story-" + storySlide).style.display = "block";
      }else{
        startGame();
      }
      break;
    case 2:
      if(storySlide > 1){
        document.getElementById("story-" + storySlide).style.display = "none";
        storySlide -= 1;
        document.getElementById("story-" + storySlide).style.display = "block";
      }
      break;
  }
}

function init() {
  if (!createjs.Sound.initializeDefaultPlugins()) {
  } else {
    try {
      createjs.Sound.addEventListener("fileload",soundLoad);
      createjs.Sound.alternateExtensions = ["mp3", "wav", "ogg"];
      createjs.Sound.registerSounds(
        [{ id: "shipHit", src: "/shipHit.wav" },
         { id: "lose", src: "/gameOver.mp3" },
         { id: "win0", src: "/gameWin.mp3" },
         { id: "gun", src: "/laser.mp3" },
         { id: "laser", src: "/torpedo.wav" },
         { id: "newWorld", src: "/newWorld.wav" },
         { id: "shipDead", src: "/shipBoom.wav" },
          { id: "squadronDead", src: "/squadronDeath.mp3" },        
          { id: "torpedo", src: "/gun.wav" },
        ],
        "./sound",
      );
    } catch (err) {}
  }
}

function soundLoad(ev){
  if(ev.id == "torpedo"){
    originalDimensions[0] = window.innerWidth;
      originalDimensions[1] = window.innerHeight;
      currentDimensions = originalDimensions.slice();
      gameWidth = window.innerWidth;
      gameHeight = window.innerHeight * 0.8;
      playerHeight = gameHeight * 0.1;
      playerWidth = playerHeight;
      enemyHeights[0] = gameHeight * 0.08;
      enemyWidths[0] = enemyHeights[0];
      healthBarHeight = gameHeight * 0.02;
      shieldBarHeight = gameHeight * 0.02;
      barBorders = gameHeight / 879;
      playerTotalHeight = playerHeight + shieldBarHeight + healthBarHeight + barBorders * 30;
      centrel = playerWidth * 5 / 2  - playerWidth / 2;
     background = new $.gQ.Animation({imageURL: "scroll2.png"});

      $("#playground").playground({height: gameHeight, width: gameWidth, keyTracker: true});

      $.playground().addGroup("background", {width: gameWidth, height: gameHeight})
      .addSprite("background1", {animation: background, width: gameWidth, height: gameHeight})
      .addSprite("background2", {animation: background, width: gameWidth, height: gameHeight, posy: gameHeight / 2})
        .addSprite("background3", {animation: background, width: gameWidth, height: gameHeight, posy: gameHeight})
      .end()
      .addGroup("enemies", {width: gameWidth, height: gameHeight})
      .end()
      .addGroup("squadron", {animation:'', posx: gameWidth/2 - playerWidth * 5 / 2, posy: gameHeight - playerTotalHeight * 3, width: playerWidth * 5, height: playerTotalHeight * 3})
      .addGroup("ship1", {animation:'', posx: centrel, posy: 0, width: playerWidth, height: playerTotalHeight, width: playerWidth})
      .addSprite("ship1Body",{animation: '', posx: 0, posy: 0, width: playerWidth, height: playerHeight})
        .addSprite("ship1HealthBar", {posx: 0, posy: playerHeight + healthBarHeight - barBorders *2, width: playerWidth, height: healthBarHeight})
        .addSprite("ship1ShieldBar", {posx: 0, posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, width: playerWidth, height: shieldBarHeight})
      .end()
        .addGroup("ship2", {animation:'', posx: centrel - playerWidth, posy: playerTotalHeight, width: playerWidth, height: playerTotalHeight, width: playerWidth})
        .addSprite("ship2Body",{animation: '', posx: 0, posy: 0, width: playerWidth, height: playerHeight})
        .addSprite("ship2HealthBar", {posx: 0, posy: playerHeight + healthBarHeight - barBorders *2, width: playerWidth, height: healthBarHeight})
        .addSprite("ship2ShieldBar", {posx: 0, posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, width: playerWidth, height: shieldBarHeight})
        .end()
        .addGroup("ship3", {animation:'', posx: centrel + playerWidth, posy: playerTotalHeight, width: playerWidth, height: playerTotalHeight, width: playerWidth})
        .addSprite("ship3Body",{animation: '', posx: 0, posy: 0, width: playerWidth, height: playerHeight})
        .addSprite("ship3HealthBar", {posx: 0, posy: playerHeight + healthBarHeight - barBorders *2, width: playerWidth, height: healthBarHeight})
        .addSprite("ship3ShieldBar", {posx: 0, posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, width: playerWidth, height: shieldBarHeight})
        .end()
        .addGroup("ship4", {animation:'', posx: centrel - 2 * playerWidth, posy: 2 * playerTotalHeight, width: playerWidth, height: playerTotalHeight, width: playerWidth})
        .addSprite("ship4Body",{animation: '', posx: 0, posy: 0, width: playerWidth, height: playerHeight})
        .addSprite("ship4HealthBar", {posx: 0, posy: playerHeight + healthBarHeight - barBorders *2, width: playerWidth, height: healthBarHeight})
        .addSprite("ship4ShieldBar", {posx: 0, posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, width: playerWidth, height: shieldBarHeight})
        .end()
        .addGroup("ship5", {animation:'', posx: centrel, posy: 2 * playerTotalHeight, width: playerWidth, height: playerTotalHeight, width: playerWidth})
        .addSprite("ship5Body",{animation: '', posx: 0, posy: 0, width: playerWidth, height: playerHeight})
          .addSprite("ship5HealthBar", {posx: 0, posy: playerHeight + healthBarHeight - barBorders *2, width: playerWidth, height: healthBarHeight})
        .addSprite("ship5ShieldBar", {posx: 0, posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, width: playerWidth, height: shieldBarHeight})
        .end()
        .addGroup("ship6", {animation:'', posx: centrel + 2* playerWidth, posy: 2 * playerTotalHeight, width: playerWidth, height: playerTotalHeight, width: playerWidth})
        .addSprite("ship6Body",{animation: '', posx: 0, posy: 0, width: playerWidth, height: playerHeight})
          .addSprite("ship6HealthBar", {posx: 0, posy: playerHeight + healthBarHeight - barBorders *2, width: playerWidth, height: healthBarHeight})
        .addSprite("ship6ShieldBar", {posx: 0, posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, width: playerWidth, height: shieldBarHeight})
        .end()
      .end()
        .addGroup("playerMissileLayer",{width: gameWidth, height: gameHeight})
        .end();
      for(var i = 0; i < noOfShips; i++){
        var ip = i+1;
        var bsElement = $(`#ship${ip}`);
        bsElement.addClass("player");
        squadronElements[i] = $(`#ship${ip}Body`);
        squadronElements[i].addClass("shipBody");
        if(playersUnlocked[i] == 1){
          bsElement.addClass("unlockedShip");
        }
        if(i == selectedShip){
          squadronElements[i].addClass("selectedShip");
          bsElement.addClass("selectedShip");
        }
        squadronElements[i][0].player = new Player(squadronElements[i]);
        $(`#ship${ip}HealthBar`).addClass("healthBar generalStatusBar");
        $(`#ship${ip}ShieldBar`).addClass("shieldBar generalStatusBar");
        if(!shieldsActive[i]){
          document.getElementById(`ship${ip}ShieldBar`).style.width = "0px";
        }
      }
      $.playground().registerCallback(function(){
        $("#background1").y(($("#background1").y() + parallaxSpeed + gameHeight) % (2 * gameHeight) - gameHeight);
        $("#background2").y(($("#background2").y() + parallaxSpeed + gameHeight) % (2 * gameHeight) - gameHeight);
        $("#background3").y(($("#background3").y() + parallaxSpeed + gameHeight) % (2 * gameHeight) - gameHeight);
        $(".asteroid").each(function(){
          this.asteroid.update();
          if(($(this).y()) > gameHeight || clearEnemies){
            $(this).remove();
          } else {
            var collided = $(this).collision(".selectedShip,."+$.gQ.groupCssClass);
            if(collided.length > 0){
              var me = $(this)[0].asteroid;
              for(var i = 0; i < me.dmg; i++){
                if(playerShields[selectedShip] != 0){
                  playerShields[selectedShip] --;
                }else{
                  playerHealths[selectedShip] --;
                }
              }
              updateHealthbar();
              updateShieldBar();
              if(sound[1]){
                playSound("shipHit");
              }
              $(this).remove();
            }
            try{
            collided = $(this).collision(".asteroid,."+$.gQ.groupCssClass);
            if(collided.length > 0){
              $(this).remove();
            }
            }catch{

            }
          }
        });
        $(".playerMissiles").each(function(){
          var posy = $(this).y();
          if(posy < 0){
            $(this).remove();
          }else{
            $(this).y(-missileSpeeds[shipWeaponTypes[selectedShip]], true);
            var collided = $(this).collision(".asteroid,."+$.gQ.groupCssClass);
            if(collided.length > 0){
              collided.each(function(){
                var asteroid = $(this)[0].asteroid;
                if(asteroid.lives - weaponDamage[shipWeaponTypes[selectedShip]] < 1){
                  $(asteroid.node[0]).remove();
                }else{
                  asteroid.lives -= weaponDamage[shipWeaponTypes[selectedShip]];
                }
              });
              createjs.Sound.stop();
              if(sound[1]){
                playSound("shipHit");
              }
              $(this).remove();
            }
          }
        });
        if(jQuery.gameQuery.keyTracker[37] && !pauseGameStuff){ 
          for(var i = 0; i < noOfShips; i++){
            var ip = i+1;
            document.getElementById(`ship${ip}Body`).style.backgroundImage = `url('ship${ip}l.png')`;
          }
          var nextpos = $("#squadron").x()-playerSpeed;
          if(nextpos > 0){
            $("#squadron").x(nextpos);
          }
        }
        if(jQuery.gameQuery.keyTracker[39] && !pauseGameStuff){
          for(var i = 0; i < noOfShips; i++){
            var ip = i+1;
            document.getElementById(`ship${ip}Body`).style.backgroundImage = `url('ship${ip}r.png')`;
          }
          var nextpos = $("#squadron").x()+playerSpeed;
          if(nextpos < gameWidth - playerWidth * 5){
            $("#squadron").x(nextpos);
          }
        }
        if(jQuery.gameQuery.keyTracker[13] && !pauseGameStuff){
          isAWorldActive = false;
          changeTitle("Paused");
          $.playground().pauseGame();
          document.getElementById("pauseMenu").style.display = "block";
          document.getElementById("upScroller").style.display = "none";
        }
        if(!jQuery.gameQuery.keyTracker[37] && !jQuery.gameQuery.keyTracker[39]){
          for(var i = 0; i < noOfShips; i++){
            var ip = i+1;
          document.getElementById(`ship${ip}Body`).style.backgroundImage = `url('ship${ip}t.png')`;
          }
        }
      }, refreshRate);

      $.playground().registerCallback(function(){
        if(!clearEnemies && !pauseGameStuff){
        var name = "asteroid_"+(new Date).getTime();
        $("#enemies").addSprite(name, {animation: '', posx: Math.random()*gameWidth*0.9, posy: 0,width: enemyWidths[0], height: enemyHeights[0]});
        var asteroidElement = $("#"+name);
        asteroidElement.addClass("asteroid");
        asteroidElement.addClass("enemy");
        asteroidElement[0].asteroid = new Asteroid(asteroidElement, null, 5, 3);
        }
      }, enemySpawnRates[0]); 
      $(document).keyup(function(e){
        if(e.keyCode == 40 && !pauseGameStuff){
          changeShip();
        }
      });
      $(document).keydown(function(e){
        if(e.keyCode === 32){
          var ssp = selectedShip+1;
          var weaponType = shipWeaponTypes[selectedShip];
          var wn;
          switch(weaponType){
            case 1:
              wn = "gun";
              break;
            case 2:
              wn = "torpedo";
              break;
            case 3:
              wn = "laser";
              break;
          }
          if(weaponAmounts[selectedShip] > 0 && !pauseGameStuff){
            if(sound[1]){
              playSound(wn);
            }
            weaponAmounts[selectedShip]--;
            updateWeaponAmmunition();
            var playerposx = $("#squadron").x() + $(`#ship${ssp}`).x();
            var playerposy = $("#squadron").y() + $(`#ship${ssp}`).y();
            var name = "playerMissile_" + (new Date()).getTime();
            $("#playerMissileLayer").addSprite(name, {posx: playerposx + playerWidth/3, posy: playerposy, width: playerWidth/3,height: playerHeight/3});
            $("#"+name).addClass("playerMissiles " + wn);
          }else{

          }
        }else{

        }
      });

      $.playground().startGame();
      for(var i = 0; i < noOfShips; i++){
        var ip = i+1;
        shieldBars[i] = document.getElementById(`ship${ip}ShieldBar`);
        healthBars[i] = document.getElementById(`ship${ip}HealthBar`);
        healthWidths[i] = Number(healthBars[i].style.width.split("px")[0]);
        shieldWidths[i] = Number(shieldBars[i].style.width.split("px")[0]);
      }
      setInterval(function(){
        if(!jQuery.gameQuery.keyTracker[32] && weaponAmounts[selectedShip] != weaponAmountsMax[selectedShip]){
         weaponAmounts[selectedShip]++;
          if(DEV) console.debug(weaponAmounts[selectedShip]);
          updateWeaponAmmunition();
        }
      }, weaponRespawnTime);
      setInterval(function(){
        if(playerShields[selectedShip] < playerOriginalShields[selectedShip] && shieldsActive[selectedShip]){
          playerShields[selectedShip]++;
          updateShieldBar();
        }
      }, shieldRespawnTime);
      setInterval(function(){
        if(isAWorldActive){
          remainingDistanceToPlanet--;
          updatePlanetDistance();
        }
      }, worldMeterTime);
      updateShipDetails();
      $.loadCallback(function(ev){
        if(ev == 100){
          setTimeout(function(){
            changeTitle("Main Menu");
            $.playground().pauseGame();
            document.getElementById("loading").style.display = "none";
            document.getElementById("mainMenu").style.display = "block";
          }, 500);
        }
      });
  }
}

function startGame(){
  playBgMusic();
  changeTitle("Game");
  document.getElementById("upScroller").style.display = "block";
  document.getElementById("story").style.display = "none";
  $.playground().resumeGame();
  $(window).focus(function() {
    if(!DEV){
      document.getElementById("paused").style.display = "none";
      changeTitle("Game");
      isAWorldActive = true;
      $.playground().resumeGame();
    }
  });
  $(window).blur(function() {
    if(!DEV){
      changeTitle("Paused");
     $.playground().pauseGame();
    document.getElementById("paused").style.display = "block";
      isAWorldActive = false;
    }
  });

  setInterval(function(){
    if(!DEV){
    console.info("Welcome to the console!\nIf you are a developer, setting DEV to true would help.\nIf you are trying to hack the game, is it really worth it? Just enjoy the game how it is.");
    }
  }, 10000);
  $(window).resize(function() {
    if(!DEV){
      currentDimensions[0] = $(this).width();
      currentDimensions[1] = $(this).height();
    if(currentDimensions[0] == originalDimensions[0] && currentDimensions[1] == originalDimensions[1]){
      document.getElementById("resized").style.display = "none";
      changeTitle("Game");
      isAWorldActive = true;
      $.playground().resumeGame();
    }else{
      changeTitle("Paused");
      isAWorldActive = false;
      $.playground().pauseGame();
      document.getElementById("resized").style.display = "block";
    }
    }
  });
  isAWorldActive = true;
}

function playSound(toPlay){
  createjs.Sound.play(toPlay);
}

function changeTitle(title){
  document.title =  `${title} | Squadron`;
}

function pauseMenuDo(option){
  switch(option){
    case 0:
      document.getElementById("pauseMenu").style.display = "none";
      changeTitle("Game");
      document.getElementById("upScroller").style.display = "block";
      isAWorldActive = true;
      $.playground().resumeGame();
      break;
    case 1:
      document.getElementById("pauseMenu").style.display = "none";
      document.getElementById("inGameSettingsMenu").style.display = "block";
      break;
  }
}

function updateShipDetails(){
  var ssp = selectedShip + 1;
  document.getElementById("selectedShipImage").src = `ship${ssp}t.png`;
  document.getElementById("selectedShipNumber").innerHTML = ssp;
  document.getElementById("selectedShipName").innerHTML = shipNames[selectedShip];
  document.getElementById("currentWeaponName").innerHTML = weaponNames[shipWeaponTypes[selectedShip]];
  document.getElementById("currentWeaponName2").innerHTML = weaponNames[shipWeaponTypes[selectedShip]];
  document.getElementById("currentWeaponHP").innerHTML = weaponDamage[shipWeaponTypes[selectedShip]];
  if(weaponAmountsMax[selectedShip] == 0){   
    document.getElementById("weaponReloads").innerHTML = "NO AMMUNITION";
  }else{
    document.getElementById("weaponReloads").innerHTML = weaponAmounts[selectedShip] + " AMMUNITION";
  }
}

function updateWorldCount(){
  document.getElementById("bottomWorldNumber").innerHTML = worldNumber;
}

function continueAfterDeath(){
  playersUnlocked = playersIReallyUnlocked.slice();
  playerHealths = playerOriginalLives.slice();
  playerShields = playerOriginalShields.slice();
  updateShieldBars();
  updateHealthbars();
  updateShieldBar();
  updateHealthbar();
  updateSquadronLives();
  updateShipDetails();
  updateShipsInGame();
  document.getElementById("squadronDeath").style.display = "none";

  isAWorldActive = true;
  $.playground().resumeGame();
}

function updateWeaponAmmunition(){
  if(weaponAmountsMax[selectedShip] == 0){   
    document.getElementById("weaponReloads").innerHTML = "NO AMMUNITION";
  }else{
    document.getElementById("weaponReloads").innerHTML = weaponAmounts[selectedShip] + " AMMUNITION";
  }
}

function updatePlanetDistance(){
  if(remainingDistanceToPlanet == 0){
    isAWorldActive = false;
    newWorld();
  }else{
    document.getElementById("remainingDistanceToPlanet").innerHTML = remainingDistanceToPlanet;
  }
}

function updateSquadronLives(){
  document.getElementById("bottomSquadronNumber").innerHTML = squadronLives;
}

function newWorld(){
  createjs.Sound.stop();
  clearEnemies = true;
  pauseGameStuff = true;
  timeouts.newWorld = setInterval(function(){
    if($("#squadron").y() < 0){
      window.clearInterval(timeouts.newWorld);
      if(sound[1]){
        playSound("newWorld");
      }
      $.playground().pauseGame();
      worldNumber++;
      if(worldNumber == 7){
        stopBgMusic();
        if(sound[1]){
          playSound("win0");
      }document.getElementById("upScroller").style.display = "none";
        document.getElementById("gameWon").style.display = "block";
      }else{
        var wnm = worldNumber-1;
        remainingDistanceToPlanet = planetDistances[wnm];
      updateWorldCount();
        document.getElementById("rescuedShipName").innerHTML = shipNames[wnm];
        document.getElementById("rescuedWeaponName").innerHTML = weaponNames[shipWeaponTypes[wnm]];
        document.getElementById("rescuedWeaponHP").innerHTML = weaponDamage[shipWeaponTypes[wnm]];
        document.getElementById("newWorld").style.display = "block";
      }
    }else{
      $("#squadron").y($("#squadron").y() - playerSpeed);
    }
  }, refreshRate * playerUpSpeedFactor);
}

function newWorldContinue(){
  $("#squadron").y(gameHeight - playerTotalHeight * 3);
  document.getElementById("newWorld").style.display = "none";
  var wnm = worldNumber-1;
  playersUnlocked[wnm] = 1;
  playersIReallyUnlocked[wnm] = 1;
  playerHealths = playerOriginalLives.slice();
  playerShields = playerOriginalShields.slice();
  pauseGameStuff = false;
  $.playground().resumeGame();
  updatePlanetDistance();
  updateShipsInGame();
  updateHealthbars();
  updateHealthbar();
  updateShieldBars();
  updateShieldBar();
  $("#squadron").x(gameWidth/2 - playerWidth * 5 / 2);
  clearEnemies = true;
  setTimeout(function(){
    clearEnemies = false;
    isAWorldActive = true;
  }, 100);
}

function changeShip(){
  var newShip = selectedShip;
  for(var i = selectedShip; i < playersUnlocked.length + selectedShip; i++){
    var sp = i + 1;
    sp = sp % playersUnlocked.length;
    if(playersUnlocked[sp] == 1){
      newShip = sp;
      break;
    }
  }
  selectedShip = newShip;
  updateShipsInGame();
  updateShipDetails();
  updateHealthbars();
  updateHealthbar();
  updateShieldBars();
  updateShieldBar();
}

function gameOver(){
  stopBgMusic();
  createjs.Sound.stop();
  if(sound[1]){
    playSound("lose");
  }
  isAWorldActive = false;
  $.playground().pauseGame();
  document.getElementById("gameOver").style.display = "block";
}

function returnToMainMenu(){
  isAWorldActive = false;
  window.location.reload();
}

function updateHealthbar(){
  if(playerHealths[selectedShip] < 1){
    playersUnlocked[selectedShip] = 0;
    if(playersUnlocked.indexOf(1) == -1){
      if(squadronLives == 1){
        gameOver();
      }else{
        createjs.Sound.stop();
        if(sound[1]){
          playSound("squadronDead");
        }
        squadronLives--;
        isAWorldActive = false;
        $.playground().pauseGame();
        document.getElementById("squadronDeath").style.display = "block";
      }
    }else{
      if(sound[1]){
        playSound("shipDead");
      }
      selectedShip = playersUnlocked.indexOf(1);
      updateShipsInGame();
      updateShipDetails();
    }
  }else{
  healthBars[selectedShip].style.width = ((healthWidths[selectedShip] / playerOriginalLives[selectedShip]) * playerHealths[selectedShip]) + "px";
  if(DEV) console.debug("HEALTH:" + playerHealths[selectedShip]);
  }
}

function updateHealthbars(){
  for(var i = 0; i < healthBars.length; i++){
  healthBars[i].style.width = ((healthWidths[i] / playerOriginalLives[i]) * playerHealths[i]) + "px";
  }
}

function updateShieldBars(){
  for(var i = 0; i < shieldBars.length; i++){
  shieldBars[i].style.width = ((shieldWidths[i] / playerOriginalShields[i]) * playerShields[i]) + "px";
  }
}

function updateShipsInGame(){
  for(var i = 0; i < noOfShips; i++){
    var ip = i+1;
    var bsElement = $(`#ship${ip}`);
    squadronElements[i] = $(`#ship${ip}Body`);
    bsElement.removeClass("unlockedShip");
    squadronElements[i].removeClass("selectedShip");
    bsElement.removeClass("selectedShip");
    if(playersUnlocked[i] == 1){
      bsElement.addClass("unlockedShip");
    }
    if(i == selectedShip){
      squadronElements[i].addClass("selectedShip");
      bsElement.addClass("selectedShip");
    }
    if(!shieldsActive[i]){
      document.getElementById(`ship${ip}ShieldBar`).style.width = "0px";
    }
  }
}

function updateShieldBar(){
  shieldBars[selectedShip].style.width = ((shieldWidths[selectedShip] / playerOriginalShields[selectedShip]) * playerShields[selectedShip]) + "px";
  if(DEV) console.debug("SHIELD:" + playerShields[selectedShip]);
}

function Asteroid(node, value, lives, dmg){
  this.dmg = dmg;
  this.value = value;
  this.speed = enemySpeeds[0];
  this.lives = lives;
  this.node = node;
  this.update = function(){
    this.node.y(this.speed, true);
  };
}
function Player(node){
  this.node = node;
}
