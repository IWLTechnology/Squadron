/* vars */
var musStopCount;
var gamepadDeadzone = 0.5;
var flashTime = 100;
var oldMenuSelected;
var powerupHeight;
var powerupWidth;
var shipToCollectHeight;
var shipToCollectWidth;
var powerupNames = ["life", "refillammo", "shield", "squadlife", "invincibility", "clear"];
var controls = sessionStorage.getItem("controls");
if (controls == null || controls == undefined) {
  controls = {
    flyleft: 37,
    flyright: 39,
    down: 40,
    up: 38,
    weapon: 32,
    pause: 13,
    menuenter: 16
  };
} else {
  controls = JSON.parse(controls);
}
var gamePadControls = sessionStorage.getItem("gcontrols");
if (gamePadControls == null || gamePadControls == undefined) {
  gamePadControls = {
    flyleft: 100,
    flyright: 101,
    down: 103,
    up: 102,
    weapon: 1,
    pause: 9,
    menuenter: 0
  };
} else {
  gamePadControls = JSON.parse(gamePadControls);
}
var menuSelectMax = [3, 6, 2, 1, 2, 1, 1, 1, 3, 4, 13, 2, 1, 1, 8, 8];
var sound = [sessionStorage.getItem("sound0"), sessionStorage.getItem("sound1")];
switch (sound[0]) {
  case "false":
    sound[0] = false;
    break;
  default:
    sound[0] = true;
    break;
}
switch (sound[1]) {
  case "false":
    sound[1] = false;
    break;
  default:
    sound[1] = true;
    break;
}

var te;
if (sound[0] && sound[1]) {
  te = "SOUND - ON";
} else if (sound[0] && !sound[1]) {
  te = "SOUND - MUSIC ONLY";
} else if (!sound[0] && sound[1]) {
  te = "SOUND - SFX ONLY";
} else {
  te = "SOUND - OFF";
}
document.getElementById("sound").innerHTML = te;
document.getElementById("sound2").innerHTML = te;
var DEV = false;
var LOGGING = false;
var CONTNMW = false;
var centrel;
var sCentrel;
var shipNames = [
  "TRAINEE",
  "GUNSHIP",
  "GUNSHIP+",
  "ENTERPRISE D",
  "KLINGON",
  "LASERMAN",
  "STAR DESTROYER",
  "LASERMAN+",
  "DEEP SPACE 9",
  "SQUADRON BASE"
];
var weaponNames = ["NO WEAPON", "GUN", "TORPEDO", "LASER", "BASE 1", "BASE 2", "BASE 3"];
var weaponNamesDescriptive = [
  "NO WEAPON",
  "EQUIPPED WITH GUNS",
  "EQUIPPED WITH TORPEDOES",
  "EQUIPPED WITH LASERS",
  "BASE #1",
  "BASE #2",
  "BASE #3"
];
var planetDistances = [150, 300, 400, 500, 600, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];
var initialSquadronLives = sessionStorage.getItem("insql");
if (initialSquadronLives == null || initialSquadronLives == undefined) {
  initialSquadronLives = "5";
}
initialSquadronLives = Number(initialSquadronLives);
switch (initialSquadronLives) {
  case 10:
    document.getElementById("difficulty").innerHTML = "DIFFICULTY - EASY";
    break;
  case 1:
    document.getElementById("difficulty").innerHTML = "DIFFICULTY - HARD";
    break;
  case 5:
    document.getElementById("difficulty").innerHTML = "DIFFICULTY - NORMAL";
    break;
}
var weaponDamage = [0, 1, 3, 5, 0, 0, 0];
var gameWidth;
var gameHeight;
var barHeight;
var barWidth;
var playerHeight;
var playerWidth;
var spawnBeforeSize;
var sPlayerHeight;
var sPlayerWidth;
var powerupSpawnChance = [41, 63, 89, 91, 92, 100]; //0 = health, ammo, shield, sql, inv, bomb
var background;
var playerHealths = [5, 8, 8, 11, 11, 15, 30];
var playerShields = [0, 0, 3, 5, 10, 15, 20];
var playerOriginalLives = playerHealths.slice();
var playerOriginalShields = playerShields.slice();
var shipWeaponTypes = [0, 1, 1, 2, 2, 3, 3];
var playerTotalHeight;
var bossTotalHeight;
var sPlayerTotalHeight;
var weaponAmountsMax = [0, 20, 30, 10, 20, 30, 50];
var enemyWidths = [];
var bossWidth;
var bossHeight;
var shootingEnemyHealths = [5, 5, 5, 5, 5];
var shootingEnemyShields = [0, 3, 0, 7, 10];
var shootingEnemyAmmo = [5, 5, 7, 7, 10, 10];
var shootingEnemyWeaponType = [1, 1, 2, 2, 3, 3];
var bossHealths = [20, 50, 120, 200, 500, 1000];
var bossShields = [0, 30, 0, 80, 100, 500];
var bossAmmo = [40, 80, 80, 80, 120, 200];
var bossWeaponType = [1, 1, 2, 2, 3, 3];
var enemyHeights = [];
var healthBarHeight;
var shieldBarHeight;
var sHealthBarHeight;
var sSealthBarHeight;
var weaponAmounts = weaponAmountsMax.slice();
var barBorders;
var shieldWidths = [];
var healthWidths = [];
var healthBars = [];
var shieldBars = [];
var shieldsActive = [];
var squadronShips = [];
var squadronElements = [];
var noOfShips = 7;
var i;
var gamepadConnected = false;
var gameTime = 0;
var levels = [];
var gamepadpressed = [];
for (i = 0; i < 200; i++) {
  gamepadpressed.push(false);
}
var timeouts = {
  bgmusic: null,
  bgmusicStop: null,
  switchShip: null,
  newWorld: null,
  shieldRecharge: 0,
  ammoRecharge: 0,
  bossShieldRecharge: 0,
  bossAmmoRecharge: 0,
  bossFire: 0,
  enemyShieldRecharge: 0,
  enemyAmmoRecharge: 0,
  enemyFire: 0,
  planetTimer: 0,
  switchShipCooldown: null,
  fire: true,
  invincibility: 0,
  invincibilityWarn: 0,
  invincibilityMusicSlow: 0,
  bossbgmusicStop: null,
  alert: null
};
var stopScroll = false;
var bomb = false;
var invincibilityMusicSlow = false;
var settingControls = 0;
var settingGamepadControls = 0;
var invincibilityCol = 0;
var invincibilityCount = 0;
var globalScaleFactor = 1;
var stopSpawn = false;
var score = 0;
var gamePadJustPressed = {
  flyleft: false,
  flyright: false,
  down: false,
  up: false,
  weapon: false,
  pause: false,
  menuenter: false
};
var stopWorldCounter = false;
var menuSelected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currentMenu = 0;
var switchShipCooldown = false;
var switchShipCooldownTime = 10;
var gameInterrups = {
  resize: false,
  blur: false,
  manualPause: false
};
var playerUpSpeedFactor = 2;
var clearGame = false;
var pauseGameStuff = false;
var isAWorldActive = false;
var squadronLives = initialSquadronLives;
var worldNumber = 1;
var remainingDistanceToPlanet = 150;
var originalDimensions = [];
var originalWindowDimensions = [];
var currentDimensions = [];
var currentWindowDimensions = [];
var shipExplosionActive = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var shipExplosionTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var playersUnlocked = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var playersIReallyUnlocked = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var selectedShip = 0;
var refreshRate = 15;
var parallaxSpeed = 4;
var missileSpeeds = [0, 13, 17, 20, 0, 0, 0];
var bossMissileSpeeds = [0, 11, 15, 18, 0, 0, 0];
var enemyMissileSpeeds = [0, 11, 15, 18, 0, 0, 0];
var playerSpeed = 15;
var playerHealths = playerOriginalLives.slice();
var playerShields = playerOriginalShields.slice();
var enemySpeeds = [4, 4, 4];
var powerUpSpeed = 4;
var bossSpeeds = [9, 10, 11, 12, 12, 13];
var weaponAmounts = weaponAmountsMax.slice();
var frameRateS = 1000 / refreshRate;
var shieldRespawnTime = Math.ceil(7 * frameRateS);
var weaponRespawnTime = Math.ceil(0.5 * frameRateS);
var bossShieldRespawnTime = Math.ceil(4 * frameRateS);
var bossWeaponRespawnTime = Math.ceil(0.01 * frameRateS);
var bossFireTime = Math.ceil(0.25 * frameRateS);
var enemyShieldRespawnTime = Math.ceil(4 * frameRateS);
var enemyWeaponRespawnTime = Math.ceil(0.01 * frameRateS);
var enemyFireTime = Math.ceil(0.25 * frameRateS);
var worldMeterTime = Math.ceil(0.2 * frameRateS);
var invincibilityFlash = [Math.ceil(0.05 * frameRateS), 0];
var invincibilityWarnSlow = Math.ceil(0.05 * frameRateS);
var invincibility = false;
var invincibilityTime = Math.ceil(20 * frameRateS);
var invincibilityWarn = false;
var invincibilityWarnTime = Math.ceil(15 * frameRateS);
var isBossFight = false;
var invincibilityMusicSlowTime = (invincibilityTime - invincibilityWarnTime) / 36;
var newSpawnTimes = [
  Math.floor(0.15 * frameRateS),
  Math.floor(2.5 * frameRateS),
  Math.floor(1.5 * frameRateS),
  Math.floor(9 * frameRateS)
];
for (i = 0; i < playerShields.length; i++) {
  if (playerShields[i] == 0) {
    shieldsActive[i] = false;
  } else {
    shieldsActive[i] = true;
  }
}

/* FUNCTIONS */

function generateLevels() {
  for (var i = 0; i < 6; i++) {
    generateLevel(i);
  }
}

function generateLevel(level) {
  var ranT, ranX, i;
  levels.push([""]);
  var levelFrameDuration = worldMeterTime * planetDistances[level] * 2;
  var fsi = [];
  for (i = 0; i < newSpawnTimes.length; i++) {
    fsi[i] = Math.ceil(levelFrameDuration / newSpawnTimes[i]);
  }
  for (i = 0; i < levelFrameDuration + 1; i++) {
    //grow?
    levels[level][i] = [];
  }
  for (i = 0; i < fsi.length; i++) {
    for (var j = 0; j < fsi[i]; j++) {
      switch (i) {
        case 0:
          ranX = Math.floor(Math.random() * (gameWidth - enemyWidths[0]));
          ranT = Math.floor(Math.random() * 44) + 1;
          break;
        case 1:
          ranX = Math.floor(Math.random() * (gameWidth - enemyWidths[1]));
          ranT = Math.floor(Math.random() * 3);
          break;
        case 2:
          ranX = Math.floor(Math.random() * (gameWidth - enemyWidths[2]));
          ranT = Math.floor(Math.random() * level);
          break;
        case 3:
          ranX = Math.floor(Math.random() * (gameWidth - powerupWidth));
          var ranPower = Math.floor(Math.random() * 100);
          if (ranPower < powerupSpawnChance[0]) {
            ranT = 0;
          } else if (ranPower < powerupSpawnChance[1]) {
            if (level >= 2) {
              ranT = 1;
            } else {
              ranT = 0;
            }
          } else if (ranPower < powerupSpawnChance[2]) {
            if (level >= 3) {
              ranT = 2;
            } else {
              ranT = 0;
            }
          } else if (ranPower < powerupSpawnChance[3]) {
            ranT = 3;
          } else if (ranPower < powerupSpawnChance[4]) {
            ranT = 4;
          } else {
            ranT = 5;
          }
          break;
      }
      levels[level][newSpawnTimes[i] * j].push({
        type: i,
        type2: ranT,
        spawnX: ranX
      });
    }
  }
}

function spawnRun(level, time) {
  var current = levels[level][time]; //not enough in the level gen - thats the problem
  var item, name, enemyElement, powerupN, powerupName;
  for (var i = 0; i < current.length; i++) {
    item = current[i];
    switch (item.type) {
      case 0:
        if (!clearGame && !pauseGameStuff && !stopSpawn && !bomb) {
          name = "enemy_" + new Date().getTime();
          $("#enemies").addSprite(name, {
            animation: "",
            posx: item.spawnX,
            posy: -spawnBeforeSize,
            width: enemyWidths[0],
            height: enemyHeights[0]
          });
          enemyElement = $("#" + name);
          enemyElement.addClass("enemy");
          enemyElement.addClass("asteroid");
          var asteroidN = item.type2;
          enemyElement[0].style.backgroundImage = `url('./assets/images/hq/asteroid-${asteroidN}.png')`;
          enemyElement[0].enemy = new Enemy(enemyElement, name, 0, 5, 0, 0, 3, 0);
        }
        break;
      case 1:
        if (!clearGame && !pauseGameStuff && !stopSpawn && !bomb) {
          name = "powerupAsteroidEnemy_" + new Date().getTime();
          $("#enemies").addSprite(name, {
            animation: "",
            posx: item.spawnX,
            posy: -spawnBeforeSize,
            width: enemyWidths[1],
            height: enemyHeights[1]
          });
          enemyElement = $("#" + name);
          enemyElement.addClass("enemy");
          powerupN = item.type2;
          powerupName = powerupNames[powerupN];
          enemyElement.addClass("powerupAsteroid");
          enemyElement.addClass(`pid-${powerupN}`);
          enemyElement[0].style.backgroundImage = `url('./assets/images/hq/asteroid-powerup-${powerupName}.png')`;
          enemyElement[0].enemy = new Enemy(enemyElement, name, 1, 5, 0, 0, 3, 0);
        }
        break;
      case 2:
        if (!clearGame && !pauseGameStuff && !stopSpawn && !bomb && worldNumber != 1) {
          name = "shootingEnemy_" + new Date().getTime();
          $("#enemies").addSprite(name, {
            animation: "",
            posx: item.spawnX,
            posy: -spawnBeforeSize,
            width: enemyWidths[2],
            height: enemyHeights[2]
          });
          enemyElement = $("#" + name);
          enemyElement.addClass("enemy");
          enemyElement.addClass("shootingEnemy");
          var typeN = item.type2;
          var tnp = typeN + 1;
          enemyElement[0].style.backgroundImage = `url('./assets/images/hq/zeta-${tnp}-top.png')`;
          enemyElement[0].enemy = new Enemy(
            enemyElement,
            name,
            2,
            shootingEnemyHealths[typeN],
            shootingEnemyShields[typeN],
            shootingEnemyAmmo[typeN],
            3,
            shootingEnemyWeaponType[typeN]
          );
        }
        break;
      case 3:
        if (!clearGame && !pauseGameStuff && !stopSpawn) {
          name = "powerup_Loose_" + new Date().getTime();
          $("#enemies").addSprite(name, {
            animation: "",
            posx: item.spawnX,
            posy: -spawnBeforeSize,
            width: powerupWidth,
            height: powerupHeight
          });
          var powerupElement = $("#" + name);
          powerupN = item.type2;
          powerupName = powerupNames[powerupN];
          powerupElement.addClass("powerup");
          powerupElement.addClass(`pid-${powerupN}`);
          powerupElement[0].style.backgroundImage = `url('./assets/animations/hq/powerups-${powerupName}.gif')`;
          powerupElement[0].powerup = new Powerup(powerupElement, name, powerupN);
        }
        break;
    }
  }
}

function updateScore() {
  var scoreUpd = String(score).padStart(6, "0");
  document.getElementById("scoreNumber").innerHTML = scoreUpd;
}
function keepGoing(opt) {
  switch (opt) {
    case 0:
      currentMenu = 12;
      document.getElementById("gameOver").style.display = "none";
      document.getElementById("keepGoing").style.display = "block";
      break;
    case 1:
      currentMenu = 5;
      document.getElementById("keepGoing").style.display = "none";
      document.getElementById("gameOver").style.display = "block";
      break;
    case 2:
      if (isBossFight) {
        playersUnlocked[worldNumber] = 1;
        selectedShip = worldNumber;
      } else {
        playersUnlocked = playersIReallyUnlocked.slice();
      }
      squadronLives = initialSquadronLives;
      playerHealths = playerOriginalLives.slice();
      playerShields = playerOriginalShields.slice();
      updateShieldBars();
      updateHealthbars();
      updateShieldBar();
      updateHealthbar();
      updateSquadronLives();
      updateShipDetails();
      updateShipsInGame();
      score = 0;
      updateScore();
      weaponAmounts = weaponAmountsMax.slice();
      updateWeaponAmmunition();
      document.getElementById("keepGoing").style.display = "none";
      $.playground().resumeGame();
      currentMenu = 0;
      isAWorldActive = true;
      gameInterrups.manualPause = false;
      playBgMusic();
      break;
  }
}

function killInvincibility() {
  stopBgMusic();
  invincibility = false;
  invincibilityWarn = false;
  invincibilityMusicSlow = false;
  invincibilityCount = 0;
  timeouts.invincibility = 0;
  timeouts.invincibilityWarn = 0;
  timeouts.invincibilityMusicSlow = 0;
  window.clearInterval(timeouts.bgmusicStop);
  if (sound[1]) {
    document.getElementById("bgInvincibility").pause();
    document.getElementById("bgInvincibility").currentTime = 0.0;
    playBgMusic();
  }
  flashInvincibility();
}

function gamePadKeyListen() {
  if (!gameInterrups.blur) {
    var keyP = gamepadpressed.indexOf(true);
    if (keyP != -1) {
      if (settingGamepadControls != 0) {
        var keyName = gamepadCodes[keyP];
        switch (settingGamepadControls) {
          case 1:
            if (
              gamePadControls.flyright != keyP &&
              gamePadControls.dowm != keyP &&
              gamePadControls.up != keyP &&
              gamePadControls.weapon != keyP &&
              gamePadControls.pause != keyP
            ) {
              gamePadControls.flyleft = keyP;
              gamePadJustPressed.flyleft = true;
            }
            break;
          case 2:
            if (
              gamePadControls.flyleft != keyP &&
              gamePadControls.dowm != keyP &&
              gamePadControls.up != keyP &&
              gamePadControls.weapon != keyP &&
              gamePadControls.pause != keyP
            ) {
              gamePadControls.flyright = keyP;
              gamePadJustPressed.flyright = true;
            }
            break;
          case 3:
            if (
              gamePadControls.flyleft != keyP &&
              gamePadControls.flyright != keyP &&
              gamePadControls.up != keyP &&
              gamePadControls.weapon != keyP &&
              gamePadControls.pause != keyP
            ) {
              gamePadControls.down = keyP;
              gamePadJustPressed.down = true;
            }
            break;
          case 4:
            if (
              gamePadControls.flyleft != keyP &&
              gamePadControls.flyright != keyP &&
              gamePadControls.down != keyP &&
              gamePadControls.weapon != keyP &&
              gamePadControls.pause != keyP
            ) {
              gamePadControls.up = keyP;
              gamePadJustPressed.up = true;
            }
            break;
          case 5:
            if (
              gamePadControls.flyleft != keyP &&
              gamePadControls.flyright != keyP &&
              gamePadControls.down != keyP &&
              gamePadControls.up != keyP &&
              gamePadControls.pause != keyP &&
              gamePadControls.menuenter != keyP
            ) {
              gamePadControls.weapon = keyP;
              gamePadJustPressed.weapon = true;
            }
            break;
          case 6:
            if (
              gamePadControls.flyleft != keyP &&
              gamePadControls.flyright != keyP &&
              gamePadControls.down != keyP &&
              gamePadControls.up != keyP &&
              gamePadControls.menuenter != keyP &&
              gamePadControls.weapon != keyP
            ) {
              gamePadControls.pause = keyP;
              gamePadJustPressed.pause = true;
            }
            break;
          case 7:
            if (
              gamePadControls.down != keyP &&
              gamePadControls.up != keyP &&
              gamePadControls.pause != keyP &&
              gamePadControls.weapon != keyP
            ) {
              gamePadControls.menuenter = keyP;
              gamePadJustPressed.menuenter = true;
            }
            break;
        }
        settingGamepadControls = 0;
        updateGamepadControls();
      }
    }
    if (currentMenu != 16) {
      if (gamePadJustPressed.down) {
        if (!gamepadpressed[gamePadControls.down]) gamePadJustPressed.down = false;
      } else {
        if (gamepadpressed[gamePadControls.down]) {
          gamePadJustPressed.down = true;
          changeMenu(currentMenu, 0);
          if (!pauseGameStuff && isAWorldActive) {
            changeShip(0);
          }
        }
      }
      if (gamePadJustPressed.up) {
        if (!gamepadpressed[gamePadControls.up]) gamePadJustPressed.up = false;
      } else {
        if (gamepadpressed[gamePadControls.up]) {
          gamePadJustPressed.up = true;
          changeMenu(currentMenu, 1);
          if (!pauseGameStuff && isAWorldActive) {
            changeShip(1);
          }
        }
      }
      if (gamePadJustPressed.menuenter) {
        if (!gamepadpressed[gamePadControls.menuenter]) gamePadJustPressed.menuenter = false;
      } else {
        if (gamepadpressed[gamePadControls.menuenter]) {
          gamePadJustPressed.menuenter = true;
          changeMenu(currentMenu, 2);
        }
      }
    }
  }
}

function handleKeyPress(e) {
  if (settingControls != 0) {
    var keyName = keyCodes[e.keyCode];
    if (keyName != "undefined" && keyName != undefined) {
      switch (settingControls) {
        case 1:
          if (
            controls.flyright != e.keyCode &&
            controls.dowm != e.keyCode &&
            controls.up != e.keyCode &&
            controls.weapon != e.keyCode &&
            controls.pause != e.keyCode
          ) {
            controls.flyleft = e.keyCode;
          }
          break;
        case 2:
          if (
            controls.flyleft != e.keyCode &&
            controls.dowm != e.keyCode &&
            controls.up != e.keyCode &&
            controls.weapon != e.keyCode &&
            controls.pause != e.keyCode
          ) {
            controls.flyright = e.keyCode;
          }
          break;
        case 3:
          if (
            controls.flyleft != e.keyCode &&
            controls.flyright != e.keyCode &&
            controls.up != e.keyCode &&
            controls.weapon != e.keyCode &&
            controls.pause != e.keyCode
          ) {
            controls.down = e.keyCode;
          }
          break;
        case 4:
          if (
            controls.flyleft != e.keyCode &&
            controls.flyright != e.keyCode &&
            controls.down != e.keyCode &&
            controls.weapon != e.keyCode &&
            controls.pause != e.keyCode
          ) {
            controls.up = e.keyCode;
          }
          break;
        case 5:
          if (
            controls.flyleft != e.keyCode &&
            controls.flyright != e.keyCode &&
            controls.down != e.keyCode &&
            controls.up != e.keyCode &&
            controls.pause != e.keyCode &&
            controls.menuenter != e.keyCode
          ) {
            controls.weapon = e.keyCode;
          }
          break;
        case 6:
          if (
            controls.flyleft != e.keyCode &&
            controls.flyright != e.keyCode &&
            controls.down != e.keyCode &&
            controls.up != e.keyCode &&
            controls.menuenter != e.keyCode &&
            controls.weapon != e.keyCode
          ) {
            controls.pause = e.keyCode;
          }
          break;
        case 7:
          if (
            controls.down != e.keyCode &&
            controls.up != e.keyCode &&
            controls.pause != e.keyCode &&
            controls.weapon != e.keyCode
          ) {
            controls.menuenter = e.keyCode;
          }
          break;
      }
    }
    settingControls = 0;
    updateControls();
  } else {
    if (!gameInterrups.blur) {
      switch (e.keyCode) {
        case controls.down:
          changeMenu(currentMenu, 0);
          break;
        case controls.up:
          changeMenu(currentMenu, 1);
          break;
        case controls.menuenter:
          changeMenu(currentMenu, 2);
          break;
      }
    }
  }
}
document.addEventListener("keyup", handleKeyPress);

function openAlert(head, text, type) {
  window.clearTimeout(timeouts.alert);
  document.getElementById("alertTitle").innerHTML = head;
  document.getElementById("alertText").innerHTML = text;
  var col;
  switch (type) {
    case "green":
      col = "rgba(76, 175, 80, 0.6)";
      break;
    case "orange":
      col = "rgba(250, 140, 28, 0.6)";
      break;
    case "red":
      col = "rgba(245, 73, 39, 0.6)";
      break;
    default:
      col = "rgba(58, 58, 58, 0.6)";
      break;
  }
  var ab = document.getElementById("alertBox");
  ab.style.backgroundColor = col;
  ab.style.opacity = "1";
  timeouts.alert = setTimeout(closeAlert, 10000);
}

function closeAlert() {
  sessionStorage.setItem("nowelcome", "true");
  window.clearTimeout(timeouts.alert);
  document.getElementById("alertBox").style.opacity = "0";
}

function playBgMusic() {
  invincibilityMusicSlow = false;
  window.clearTimeout(timeouts.bgmusicStop);
  for (i = 0; i < 4; i++) {
    document.getElementById("bg" + i).pause();
    document.getElementById("bg" + i).currentTime = 0.0;
  }
  document.getElementById("bgBoss1").pause();
  if (sound[0]) {
    var rand = "bg" + Math.floor(Math.random() * 4);
    if (isBossFight) {
      rand = "bgBoss1";
    }
    document.getElementById(rand).volume = 0.7;
    document.getElementById(rand).currentTime = 0.0;
    document.getElementById(rand).play();
    timeouts.bgmusic = setTimeout(
      function () {
        playBgMusic();
      },
      document.getElementById(rand).duration * 1000
    );
  }
}

function invincibilityMusic() {
  if (sound[0]) {
    var rand = "bgInvincibility";
    document.getElementById(rand).volume = 0.9;
    document.getElementById(rand).currentTime = 0.0;
    document.getElementById(rand).play();
    timeouts.bgmusic = setTimeout(
      function () {
        invincibilityMusic();
      },
      document.getElementById(rand).duration * 1000
    );
  }
}
function stopBgMusic() {
  musStopCount = 0.7;
  window.clearTimeout(timeouts.bgmusic);
  var i;
  if (isBossFight) {
    timeouts.bgmusicStop = window.setInterval(function () {
      var i;
      if (musStopCount > 0) {
        musStopCount -= 0.025;
        document.getElementById("bgBoss1").volume = musStopCount;
      } else {
        document.getElementById("bgBoss1").pause();
        document.getElementById("bgBoss1").currentTime = 0.0;
        invincibilityMusicSlow = false;
        window.clearInterval(timeouts.bgmusicStop);
      }
    }, 100);
  } else {
    timeouts.bgmusicStop = window.setInterval(function () {
      var i;
      if (musStopCount > 0) {
        musStopCount -= 0.025;
        for (i = 0; i < 4; i++) {
          document.getElementById("bg" + i).volume = musStopCount;
        }
      } else {
        for (i = 0; i < 4; i++) {
          document.getElementById("bg" + i).pause();
          document.getElementById("bg" + i).currentTime = 0.0;
        }
        invincibilityMusicSlow = false;
        window.clearInterval(timeouts.bgmusicStop);
      }
    }, 100);
  }
}
function stopInvincibilityMusic() {
  musStopCount = 0.9;
  window.clearTimeout(timeouts.bgmusic);
  invincibilityMusicSlow = true;
}

function mainMenu(option) {
  document.getElementById("mainMenu").style.display = "none";
  switch (option) {
    case 0:
      document.getElementById("story").style.display = "block";
      currentMenu = 0;
      break;
    case 1:
      document.getElementById("settingsMenu").style.display = "block";
      currentMenu = 2;
      break;
    case 2:
      document.getElementById("creditsMenu").style.display = "block";
      currentMenu = 4;
      break;
  }
}
function updateControls() {
  sessionStorage.setItem("controls", JSON.stringify(controls));
  document.getElementById("controls1").innerHTML = keyCodes[controls.flyleft];
  document.getElementById("controls2").innerHTML = keyCodes[controls.flyright];
  document.getElementById("controls3").innerHTML = keyCodes[controls.down];
  document.getElementById("controls4").innerHTML = keyCodes[controls.up];
  document.getElementById("controls5").innerHTML = keyCodes[controls.weapon];
  document.getElementById("controls6").innerHTML = keyCodes[controls.pause];
  document.getElementById("controls7").innerHTML = keyCodes[controls.menuenter];
}
function updateGamepadControls() {
  sessionStorage.setItem("gcontrols", JSON.stringify(gamePadControls));
  document.getElementById("gcontrols1").innerHTML = gamepadCodes[gamePadControls.flyleft];
  document.getElementById("gcontrols2").innerHTML = gamepadCodes[gamePadControls.flyright];
  document.getElementById("gcontrols3").innerHTML = gamepadCodes[gamePadControls.down];
  document.getElementById("gcontrols4").innerHTML = gamepadCodes[gamePadControls.up];
  document.getElementById("gcontrols5").innerHTML = gamepadCodes[gamePadControls.weapon];
  document.getElementById("gcontrols6").innerHTML = gamepadCodes[gamePadControls.pause];
  document.getElementById("gcontrols7").innerHTML = gamepadCodes[gamePadControls.menuenter];
}
function setControls(n) {
  var sc = document.getElementById("setControls");
  switch (n) {
    case 0:
      sc.style.display = "block";
      currentMenu = 15;
      break;
    case 8:
      sc.style.display = "none";
      currentMenu = 2;
      break;
    default:
      settingControls = n;
      document.getElementById("controls" + settingControls).innerHTML = "...";
      window.setTimeout(function () {
        settingControls = 0;
        updateControls();
      }, 10000);
      break;
  }
}
function setGamepadControls(n) {
  updateGamepadControls();
  var sc = document.getElementById("setGamepadControls");
  switch (n) {
    case 0:
      sc.style.display = "block";
      currentMenu = 16;
      break;
    case 8:
      sc.style.display = "none";
      currentMenu = 2;
      break;
    default:
      settingGamepadControls = n;
      document.getElementById("gcontrols" + settingGamepadControls).innerHTML = "...";
      window.setTimeout(function () {
        settingGamepadControls = 0;
        updateGamepadControls();
      }, 10000);
      break;
  }
}
function settingsMenu(option) {
  switch (option) {
    case 0:
      var te;
      if (sound[0] && sound[1]) {
        sound[0] = true;
        sound[1] = false;
        te = "SOUND - MUSIC ONLY";
      } else if (sound[0] && !sound[1]) {
        sound[0] = false;
        sound[1] = true;
        te = "SOUND - SFX ONLY";
      } else if (!sound[0] && sound[1]) {
        sound[0] = false;
        sound[1] = false;
        te = "SOUND - OFF";
      } else {
        sound[0] = true;
        sound[1] = true;
        te = "SOUND - ON";
      }
      sessionStorage.setItem("sound0", sound[0].toString());
      sessionStorage.setItem("sound1", sound[1].toString());
      document.getElementById("sound").innerHTML = te;
      document.getElementById("sound2").innerHTML = te;
      break;
    case 1:
      var bt = document.getElementById("difficulty");
      switch (initialSquadronLives) {
        case 1:
          initialSquadronLives = 10;
          bt.innerHTML = "DIFFICULTY - EASY";
          break;
        case 5:
          initialSquadronLives = 1;
          bt.innerHTML = "DIFFICULTY - HARD";
          break;
        case 10:
          initialSquadronLives = 5;
          bt.innerHTML = "DIFFICULTY - NORMAL";
          break;
      }
      sessionStorage.setItem("insql", String(initialSquadronLives));
      squadronLives = initialSquadronLives;
      updateSquadronLives();
      break;
    case 2:
      setControls(0);
      break;
    case 3:
      if (gamepadConnected) {
        setGamepadControls(0);
      }
      break;
    case 4:
      sessionStorage.clear();
      window.location.reload();
      break;
    case 5:
      document.getElementById("settingsMenu").style.display = "none";
      document.getElementById("mainMenu").style.display = "block";
      currentMenu = 1;
      break;
  }
}
function inGameSettingsMenu(option) {
  switch (option) {
    case 0:
      var te;
      if (sound[0] && sound[1]) {
        sound[0] = true;
        sound[1] = false;
        te = "SOUND - MUSIC ONLY";
      } else if (sound[0] && !sound[1]) {
        sound[0] = false;
        sound[1] = true;
        te = "SOUND - SFX ONLY";
        stopBgMusic();
      } else if (!sound[0] && sound[1]) {
        sound[0] = false;
        sound[1] = false;
        te = "SOUND - OFF";
        stopBgMusic();
      } else {
        sound[0] = true;
        sound[1] = true;
        te = "SOUND - ON";
        playBgMusic();
      }
      sessionStorage.setItem("sound0", sound[0].toString());
      sessionStorage.setItem("sound1", sound[1].toString());
      document.getElementById("sound").innerHTML = te;
      document.getElementById("sound2").innerHTML = te;
      break;
    case 1:
      document.getElementById("inGameSettingsMenu").style.display = "none";
      if (!DEV) {
        document.getElementById("pauseMenu").style.display = "block";
        currentMenu = 9;
      } else {
        document.getElementById("pauseMenuDev").style.display = "block";
        currentMenu = 10;
      }
      break;
  }
}

function showDevSettings() {
  document.getElementById("devSettings").style.display = "block";
  document.getElementById("pauseMenuDev").style.display = "none";
  currentMenu = 11;
}

function devSettings(option) {
  var name;
  var powerupElement;
  var ranPower;
  var powerupN;
  var powerupName;
  switch (option) {
    case 0:
      break;
    case 1:
      playersIReallyUnlocked = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
      playersUnlocked = playersIReallyUnlocked.slice();
      updateShipsInGame();
      break;
    case 2:
      playerHealths = playerOriginalLives.slice();
      playerShields = playerOriginalShields.slice();
      weaponAmounts = weaponAmountsMax.slice();
      squadronLives = 5;
      updateHealthbar();
      updateHealthbars();
      updateShieldBar();
      updateShieldBars();
      updateShipDetails();
      updateShipsInGame();
      updateSquadronLives();
      updateWeaponAmmunition();
      break;
    case 3:
      squadronLives = 100;
      playersIReallyUnlocked = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
      playersUnlocked = playersIReallyUnlocked.slice();
      updateShipsInGame();
      updateSquadronLives();
      break;
    case 4:
      squadronLives = 1;
      updateSquadronLives();
      break;
    case 5:
      for (var i = 0; i < 10; i++) {
        name = "powerup_" + new Date().getTime() + i;
        $("#enemies").addSprite(name, {
          animation: "",
          posx: Math.random() * gameWidth * 0.9,
          posy: 0,
          width: powerupWidth,
          height: powerupHeight
        });
        powerupElement = $("#" + name);
        powerupN = 5;
        powerupName = powerupNames[powerupN];
        powerupElement.addClass("powerup");
        powerupElement.addClass(`pid-${powerupN}`);
        powerupElement[0].style.backgroundImage = `url('./assets/animations/hq/powerups-${powerupName}.gif')`;
        powerupElement[0].powerup = new Powerup(powerupElement, name, powerupN);
      }
      break;
    case 6:
      for (var j = 0; j < 10; j++) {
        name = "powerup_" + new Date().getTime() + j;
        $("#enemies").addSprite(name, {
          animation: "",
          posx: Math.random() * gameWidth * 0.9,
          posy: 0,
          width: powerupWidth,
          height: powerupHeight
        });
        powerupElement = $("#" + name);
        powerupN = 4;
        powerupName = powerupNames[powerupN];
        powerupElement.addClass("powerup");
        powerupElement.addClass(`pid-${powerupN}`);
        powerupElement[0].style.backgroundImage = `url('./assets/animations/hq/powerups-${powerupName}.gif')`;
        powerupElement[0].powerup = new Powerup(powerupElement, name, powerupN);
      }
      break;
    case 7:
      remainingDistanceToPlanet = 3;
      updatePlanetDistance();
      break;
    case 8:
      LOGGING = !LOGGING;
      break;
    case 9:
      CONTNMW = !CONTNMW;
      break;
    case 12:
      DEV = false;
      LOGGING = false;
      CONTNMW = false;
      break;
  }
  if (option == 10 || option == 11) {
    document.getElementById("devSettings").style.display = "none";
    document.getElementById("pauseMenuDev").style.display = "none";
    document.getElementById("upScroller").style.display = "block";
    currentMenu = 0;
  } else {
    document.getElementById("devSettings").style.display = "none";
    document.getElementById("pauseMenuDev").style.display = "block";
    currentMenu = 10;
  }
  if (option == 11) {
    remainingDistanceToPlanet = Infinity;
    clearGame = true;
    gameInterrups.manualPause = false;
    $.playground().resumeGame();
  }
}

function credits(option) {
  switch (option) {
    case 0:
      document.getElementById("creditsMenu").style.display = "none";
      document.getElementById("mainMenu").style.display = "block";
      currentMenu = 1;
      break;
  }
}
function story(option) {
  switch (option) {
    case 0:
      document.getElementById("story").style.display = "none";
      document.getElementById("mainMenu").style.display = "block";
      currentMenu = 1;
      break;
    case 1:
      if (storySlide < 5) {
        document.getElementById("story-" + storySlide).style.display = "none";
        storySlide += 1;
        document.getElementById("story-" + storySlide).style.display = "block";
      } else {
        startGame();
      }
      break;
    case 2:
      if (storySlide > 1) {
        document.getElementById("story-" + storySlide).style.display = "none";
        storySlide -= 1;
        document.getElementById("story-" + storySlide).style.display = "block";
      }
      break;
  }
}

function init() {
  if (
    navigator.serviceWorker &&
    (window.location.href.search("https://") != -1 || window.location.href.search("http://") != -1)
  ) {
    navigator.serviceWorker.register("loader.js").then((registration) => {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data == "ready") {
          preloadComplete();
        }
      });
      if (registration.active) {
        registration.active.postMessage("preload");
      } else {
        window.location.reload();
      }
    });
  } else {
    //alert("ERROR: CACHING CANCELLED DUE TO SERVICEWORKER FAIL.");
    //if (DEV) {
    preloadComplete();
    //}
  }
}

function preloadComplete() {
  document.getElementById("splashOtherh2").innerHTML = "Loading sounds...";
  if (!createjs.Sound.initializeDefaultPlugins()) {
  } else {
    try {
      createjs.Sound.addEventListener("fileload", soundLoad);
      createjs.Sound.alternateExtensions = ["mp3", "wav", "ogg"];
      createjs.Sound.registerSounds(
        [
          { id: "shipHit", src: "/shipHit.wav" },
          { id: "lose", src: "/gameOver.mp3" },
          { id: "win0", src: "/gameWin.wav" },
          { id: "gun", src: "/gun.mp3" },
          { id: "laser", src: "/laser.wav" },
          { id: "powerupCollect", src: "/powerupCollect.wav" },
          { id: "newWorld", src: "/newWorld.mp3" },
          { id: "shipFound", src: "/powerupCollect.wav" },
          { id: "shipDead", src: "/vineBoom.mp3" },
          { id: "boom", src: "/booom.mp3" },
          { id: "squadronDead", src: "/squadronDead.mp3" },
          { id: "bossDestroy", src: "/bossDestroy.mp3" },
          { id: "enemyDestroy", src: "/shipHit.wav" },
          { id: "invincibilityHit", src: "/invincibilityHit.mp3" },
          { id: "torpedo", src: "/torpedo.wav" }
        ],
        "./assets/sound"
      );
    } catch (err) {}
  }
}

var mouseTimer = null;
var cursorVisible = true;

function disappearCursor() {
  mouseTimer = null;
  document.body.style.cursor = "none";
  cursorVisible = false;
}

document.onmousemove = function () {
  if (mouseTimer) {
    window.clearTimeout(mouseTimer);
  }
  if (!cursorVisible) {
    document.body.style.cursor = "default";
    cursorVisible = true;
  }
  mouseTimer = window.setTimeout(disappearCursor, 5000);
};

function scaleResized() {
  var scaleX = window.innerWidth / 1280;
  var scaleY = window.innerHeight / 559;

  var scaleFactor = Math.min(scaleX, scaleY);
  document.getElementById("resizedMenu").style.width = 1280 * scaleFactor;
  document.getElementById("resizedMenu").style.height = 559 * scaleFactor;
  document.getElementById("resizedGame").style.width = 1280 * scaleFactor;
  document.getElementById("resizedGame").style.height = 559 * scaleFactor;
}

function scalePage() {
  scaleResized();
  var windowRatios = [window.innerWidth / 1280, window.innerHeight / 559];
  globalScaleFactor = Math.min(windowRatios[0], windowRatios[1]);
  originalDimensions[0] = 1280 * globalScaleFactor;
  originalDimensions[1] = 559 * globalScaleFactor;
  var page = document.getElementById("resizeMaterial");
  currentWindowDimensions = originalDimensions.slice();
  page.style.width = originalDimensions[0] + "px";
  page.style.height = originalDimensions[1] + "px";
  var newCss = [originalDimensions[0] / 100, originalDimensions[1] / 100];
  var root = document.documentElement;
  root.style.setProperty("--vw-replace", newCss[0] + "px");
  root.style.setProperty("--vh-replace", newCss[1] + "px");
  scaleVariables();
  originalWindowDimensions[0] = window.innerWidth;
  originalWindowDimensions[1] = window.innerHeight;
  currentWindowDimensions = originalWindowDimensions.slice();
  $(window).resize(function () {
    scaleResized();
    if (!CONTNMW) {
      currentWindowDimensions[0] = window.innerWidth;
      currentWindowDimensions[1] = window.innerHeight;
      if (
        currentWindowDimensions[0] == originalWindowDimensions[0] &&
        currentWindowDimensions[1] == originalWindowDimensions[1]
      ) {
        if (currentMenu == 14) {
          changeTitle("Main Menu");
          document.getElementById("resizedMenu").style.display = "none";
          currentMenu = oldMenuSelected;
        } else {
          document.getElementById("resizedGame").style.display = "none";
          gameInterrups.resize = false;
          currentMenu = oldMenuSelected;
          checkResumeRequirements();
        }
      } else {
        if (currentMenu == 1 || currentMenu == 2 || currentMenu == 4) {
          changeTitle("Error");
          document.getElementById("resizedMenu").style.display = "block";
          oldMenuSelected = currentMenu;
          currentMenu = 14;
        } else {
          changeTitle("Error");
          isAWorldActive = false;
          $.playground().pauseGame();
          document.getElementById("resizedGame").style.display = "block";
          gameInterrups.resize = true;
          oldMenuSelected = currentMenu;
          currentMenu = 13;
        }
      }
    }
  });
}

function scaleVariables() {
  var i;
  refreshRate = refreshRate * globalScaleFactor;
  parallaxSpeed = parallaxSpeed * globalScaleFactor;
  for (i = 0; i < missileSpeeds.length; i++) {
    missileSpeeds[i] = missileSpeeds[i] * globalScaleFactor;
  }
  for (i = 0; i < bossMissileSpeeds.length; i++) {
    bossMissileSpeeds[i] = bossMissileSpeeds[i] * globalScaleFactor;
  }
  for (i = 0; i < enemyMissileSpeeds.length; i++) {
    enemyMissileSpeeds[i] = enemyMissileSpeeds[i] * globalScaleFactor;
  }
  playerSpeed = playerSpeed * globalScaleFactor;
  for (i = 0; i < enemySpeeds.length; i++) {
    enemySpeeds[i] = enemySpeeds[i] * globalScaleFactor;
  }
  for (i = 0; i < bossSpeeds.length; i++) {
    bossSpeeds[i] = bossSpeeds[i] * globalScaleFactor;
  }
  powerUpSpeed = powerUpSpeed * globalScaleFactor;
}

function soundLoad(ev) {
  if (ev.id == "torpedo") {
    document.getElementById("splashOtherh2").innerHTML = "Precaching Game...";
    updateControls();
    updateGamepadControls();
    scalePage();
    gameWidth = originalDimensions[0];
    gameHeight = originalDimensions[1];
    playerHeight = gameHeight * 0.04;
    playerWidth = playerHeight;
    spawnBeforeSize = gameHeight * 0.3;
    enemyHeights[0] = gameHeight * 0.08;
    enemyWidths[0] = enemyHeights[0];
    enemyHeights[1] = gameHeight * 0.08;
    enemyWidths[1] = enemyHeights[1];
    enemyHeights[2] = gameHeight * 0.1;
    enemyWidths[2] = enemyHeights[2];
    bossWidth = gameHeight * 0.15;
    bossHeight = bossWidth;
    powerupHeight = gameHeight * 0.08;
    creditsScrollSpeed = gameHeight * 0.001;
    powerupWidth = powerupHeight;
    shipToCollectHeight = gameHeight * 0.08;
    shipToCollectWidth = powerupHeight;
    healthBarHeight = gameHeight * 0.01;
    shieldBarHeight = gameHeight * 0.01;
    barBorders = gameHeight / 879;
    sPlayerHeight = gameHeight * 0.1;
    sPlayerWidth = sPlayerHeight;
    sHealthBarHeight = gameHeight * 0.02;
    sShieldBarHeight = gameHeight * 0.02;
    playerTotalHeight = playerHeight + shieldBarHeight + healthBarHeight + barBorders * 30;
    bossTotalHeight = bossHeight + sShieldBarHeight + sHealthBarHeight + barBorders * 30;
    sPlayerTotalHeight = sPlayerHeight + sShieldBarHeight + sHealthBarHeight + barBorders * 30;
    bossTotalHeight = bossHeight + sShieldBarHeight + sHealthBarHeight + barBorders * 30;
    centrel = (playerWidth * 5) / 2 - playerWidth / 2;
    sCentrel = (playerWidth * 5) / 2 - sPlayerWidth / 2;
    generateLevels();
    background = new $.gQ.Animation({ imageURL: "./assets/images/hq/scroll-background.png" });

    $("#playground").playground({ height: gameHeight, width: gameWidth, keyTracker: true });

    $.playground()
      .addGroup("background", { width: gameWidth, height: gameHeight })
      .addSprite("background1", { animation: background, width: gameWidth, height: gameHeight })
      .addSprite("background2", { animation: background, width: gameWidth, height: gameHeight, posy: gameHeight / 2 })
      .addSprite("background3", { animation: background, width: gameWidth, height: gameHeight, posy: gameHeight })
      .end()
      .addGroup("playerMissileLayer", { width: gameWidth, height: gameHeight })
      .end()
      .addGroup("enemies", { width: gameWidth, height: gameHeight })
      .end()
      .addGroup("squadron", {
        animation: "",
        posx: gameWidth / 2 - (playerWidth * 5) / 2 - sCentrel,
        posy: gameHeight - playerTotalHeight * 3,
        width: playerWidth * 5,
        height: playerTotalHeight * 3
      })
      .addGroup("ship1", {
        animation: "",
        posx: sCentrel,
        posy: -(sHealthBarHeight + barBorders * 2 + sShieldBarHeight + barBorders * 2) * 2,
        width: sPlayerWidth,
        height: sPlayerTotalHeight
      })
      .addSprite("ship1Body", { animation: "", posx: 0, posy: 0, width: sPlayerWidth, height: sPlayerHeight })
      .addSprite("ship1HealthBar", {
        posx: 0,
        posy: sPlayerHeight + sHealthBarHeight - barBorders * 2,
        width: sPlayerWidth,
        height: sHealthBarHeight
      })
      .addSprite("ship1ShieldBar", {
        posx: 0,
        posy: sPlayerHeight + sHealthBarHeight + barBorders * 2 + sShieldBarHeight + barBorders * 2,
        width: sPlayerWidth,
        height: sShieldBarHeight
      })
      .end()
      .addGroup("ship2", {
        animation: "",
        posx: centrel - playerWidth,
        posy: playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship2Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship2HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship2ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      .addGroup("ship3", {
        animation: "",
        posx: centrel + playerWidth,
        posy: playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship3Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship3HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship3ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      .addGroup("ship4", {
        animation: "",
        posx: centrel - 2 * playerWidth,
        posy: 2 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship4Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship4HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship4ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      .addGroup("ship5", {
        animation: "",
        posx: centrel,
        posy: 2 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship5Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship5HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship5ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      .addGroup("ship6", {
        animation: "",
        posx: centrel + 2 * playerWidth,
        posy: 2 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship6Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship6HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship6ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()

      .addGroup("ship7", {
        animation: "",
        posx: centrel - 3 * playerWidth,
        posy: 3 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship7Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship7HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship7ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      /*.addGroup("ship8", {
        animation: "",
        posx: centrel - playerWidth,
        posy: 3 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship8Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship8HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship8ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      .addGroup("ship9", {
        animation: "",
        posx: centrel + playerWidth,
        posy: 3 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship9Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship9HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship9ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      .addGroup("ship10", {
        animation: "",
        posx: centrel + 3 * playerWidth,
        posy: 3 * playerTotalHeight,
        width: playerWidth,
        height: playerTotalHeight
      })
      .addSprite("ship10Body", { animation: "", posx: 0, posy: 0, width: playerWidth, height: playerHeight })
      .addSprite("ship10HealthBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight - barBorders * 2,
        width: playerWidth,
        height: healthBarHeight
      })
      .addSprite("ship10ShieldBar", {
        posx: 0,
        posy: playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2,
        width: playerWidth,
        height: shieldBarHeight
      })
      .end()
      */
      .end();
    for (var i = 0; i < noOfShips; i++) {
      var ip = i + 1;
      var bsElement = $(`#ship${ip}`);
      bsElement.addClass("player");
      squadronElements[i] = $(`#ship${ip}Body`);
      squadronElements[i].addClass("shipBody");
      if (playersUnlocked[i] == 1) {
        bsElement.addClass("unlockedShip");
      }
      if (i == selectedShip) {
        squadronElements[i].addClass("selectedShip");
        bsElement.addClass("selectedShip");
      }
      squadronElements[i][0].player = new Player(squadronElements[i]);
      $(`#ship${ip}HealthBar`).addClass("healthBar generalStatusBar");
      $(`#ship${ip}ShieldBar`).addClass("shieldBar generalStatusBar");
      if (!shieldsActive[i]) {
        document.getElementById(`ship${ip}ShieldBar`).style.width = "0px";
      }
    }
    $.playground().registerCallback(function () {
      if (!stopScroll) {
        $("#background1").y((($("#background1").y() + parallaxSpeed + gameHeight) % (2 * gameHeight)) - gameHeight);
        $("#background2").y((($("#background2").y() + parallaxSpeed + gameHeight) % (2 * gameHeight)) - gameHeight);
        $("#background3").y((($("#background3").y() + parallaxSpeed + gameHeight) % (2 * gameHeight)) - gameHeight);
      }
      for (var h = 0; h < noOfShips; h++) {
        if (shipExplosionActive[h] == 1) {
          if (shipExplosionTime[h] >= 960) {
            shipExplosionActive[h] = 0;
            switchShipCooldown = false;
            selectedShip = playersUnlocked.indexOf(1);
            selectingShip = selectedShip;
            updateShipDetails();
            updateShipsInGame();
          } else {
            shipExplosionTime[h] += 1000 / refreshRate;
          }
        } else {
          shipExplosionTime[h] = 0;
        }
      }
      $(".boss").each(function () {
        var me = $(this)[0].boss;
        if (me.exploded) {
          isAWorldActive = false;
          if (me.explodeCount >= 960) {
            $(this).remove();
            newWorldBossDone();
          } else {
            me.explodeCount += 1000 / refreshRate;
          }
        } else {
          this.boss.update();
        }
      });
      $(".shipToCollect").each(function () {
        var me = $(this)[0].ship;
        this.ship.update();
        if (areColliding($(this), $(".selectedShip"))) {
          $(this).remove();
          newWorldShipCollect();
        }
      });
      $(".enemy").each(function () {
        var name, powerupElement, powerupN, powerupName;
        var me = $(this)[0].enemy;
        var isPowerupAsteroid = $(this).attr("class").search("powerupAsteroid") != -1;
        var isShooting = $(this).attr("class").search("shootingEnemy") != -1;
        if (me.exploded) {
          this.enemy.update();
          if (isPowerupAsteroid && me.explodeCount == 0) {
            name = "powerup_" + new Date().getTime();
            $("#enemies").addSprite(name, {
              animation: "",
              posx: $(this).x(),
              posy: $(this).y(),
              width: powerupWidth,
              height: powerupHeight
            });
            powerupElement = $("#" + name);
            powerupN = Number(
              $(this)
                .attr("class")
                .split(" ")
                .find(function (el) {
                  return el.search("pid-") != -1;
                })
                .toString()
                .split("pid-")[1]
            );
            powerupName = powerupNames[powerupN];
            powerupElement.addClass("powerup");
            powerupElement.addClass(`pid-${powerupN}`);
            powerupElement[0].style.backgroundImage = `url('./assets/animations/hq/powerups-${powerupName}.gif')`;
            powerupElement[0].powerup = new Powerup(powerupElement, name, powerupN);
          }
          if (isShooting && me.explodeCount == 0) {
            name = "powerup_Loose_" + new Date().getTime();
            $("#enemies").addSprite(name, {
              animation: "",
              posx: $(this).x(),
              posy: $(this).y(),
              width: powerupWidth,
              height: powerupHeight
            });
            powerupElement = $("#" + name);
            var ranPower = Math.floor(Math.random() * 100);
            if (ranPower < powerupSpawnChance[0]) {
              powerupN = 0;
            } else if (ranPower < powerupSpawnChance[1]) {
              if (selectedShip >= 1) {
                powerupN = 1;
              } else {
                powerupN = 0;
              }
            } else if (ranPower < powerupSpawnChance[2]) {
              if (selectedShip >= 2) {
                powerupN = 2;
              } else {
                powerupN = 0;
              }
            } else if (ranPower < powerupSpawnChance[3]) {
              powerupN = 3;
            } else if (ranPower < powerupSpawnChance[4]) {
              powerupN = 0;
            } else {
              powerupN = 5;
            }
            powerupName = powerupNames[powerupN];
            powerupElement.addClass("powerup");
            powerupElement.addClass(`pid-${powerupN}`);
            powerupElement[0].style.backgroundImage = `url('./assets/animations/hq/powerups-${powerupName}.gif')`;
            powerupElement[0].powerup = new Powerup(powerupElement, name, powerupN);
          }
          if (me.explodeCount >= 960) {
            $(this).remove();
          } else {
            me.explodeCount += 1000 / refreshRate;
          }
        } else {
          this.enemy.update();
          if ($(this).y() > gameHeight || clearGame || bomb) {
            $(this).remove();
          } else {
            if (areColliding($(this), $(".selectedShip"))) {
              if (!invincibility) {
                flashHit("player");
                for (var i = 0; i < me.dmg; i++) {
                  if (playerShields[selectedShip] != 0) {
                    playerShields[selectedShip]--;
                  } else {
                    playerHealths[selectedShip]--;
                  }
                }
                updateHealthbar();
                updateShieldBar();
                if (sound[1]) {
                  playSound("shipHit");
                }
                $(this).remove();
              } else {
                if (sound[1]) {
                  playSound("invincibilityHit");
                }
                $(this).remove();
              }
            }
          }
        }
      });
      $(".powerup").each(function () {
        var me = $(this)[0].powerup;
        this.powerup.update();
        var powerupN = Number(
          $(this)
            .attr("class")
            .split(" ")
            .find(function (el) {
              return el.search("pid-") != -1;
            })
            .toString()
            .split("pid-")[1]
        );
        if ($(this).y() > gameHeight || clearGame) {
          $(this).remove();
        } else {
          if (areColliding($(this), $(".selectedShip"))) {
            $(this).remove();
            powerupCollect(powerupN);
          }
        }
      });
      $(".playerMissiles").each(function () {
        var wtype = Number(
          $(this)
            .attr("class")
            .split(" ")
            .find(function (el) {
              return el.search("weaponNo") != -1;
            })
            .toString()
            .split("weaponNo")[1]
        );
        var posy = $(this).y();
        var soundplay = false;
        if (posy < 0) {
          $(this).remove();
        } else {
          $(this).y(-missileSpeeds[wtype], true);
          var collided = $(this).collision(".enemy,." + $.gQ.groupCssClass);
          if (collided.length > 0) {
            collided.each(function () {
              var enemy = $(this)[0].enemy;
              if (!enemy.exploded) {
                soundplay = true;
                if (enemy.hp + enemy.shield - weaponDamage[wtype] < 1) {
                  enemy.exploded = true;
                  enemy.node[0].style.backgroundImage = "url('./assets/animations/hq/enemyGeneralExplosion.gif')";
                  score += enemy.originalHp * 10;
                  if (sound[1]) {
                    playSound("enemyDestroy");
                  }
                  updateScore();
                } else {
                  for (var i = 0; i < weaponDamage[wtype]; i++) {
                    if (enemy.shield > 0) {
                      enemy.shield--;
                    } else {
                      enemy.hp--;
                    }
                  }
                  score += weaponDamage[wtype] * 10;
                  updateScore();
                }
              }
            });
            if (soundplay) {
              createjs.Sound.stop();
              if (sound[1]) {
                playSound("shipHit");
              }
              $(this).remove();
            }
          }
          if ($("#boss_" + worldNumber).length) {
            if (areColliding($(this), $("#boss_" + worldNumber))) {
              var boss = $("#boss_" + worldNumber)[0].boss;
              if (!boss.exploded) {
                flashHit("boss");
                if (boss.hp + boss.shield - weaponDamage[wtype] < 1) {
                  boss.hp = 0;
                  boss.shield = 0;
                  boss.exploded = true;
                  document.getElementById("bossBody").style.backgroundImage =
                    "url('./assets/animations/hq/bossExplosion.gif')";
                  score += bossHealths[worldNumber - 1] * 10 + bossShields[worldNumber - 1] * 10;
                  if (sound[1]) {
                    playSound("bossDestroy");
                  }
                  updateScore();
                } else {
                  soundplay = true;
                  for (var i = 0; i < weaponDamage[wtype]; i++) {
                    if (boss.shield != 0) {
                      boss.shield--;
                    } else {
                      boss.hp--;
                    }
                  }
                  score += weaponDamage[wtype] * 10;
                  updateScore();
                }
              }
              updateBossBars();
              if (soundplay) {
                createjs.Sound.stop();
                if (sound[1]) {
                  playSound("shipHit");
                }
                $(this).remove();
              }
            }
          }
        }
      });

      $(".bossMissiles").each(function () {
        var wtype = Number(
          $(this)
            .attr("class")
            .split(" ")
            .find(function (el) {
              return el.search("weaponNo") != -1;
            })
            .toString()
            .split("weaponNo")[1]
        );
        var posy = $(this).y();
        var soundplay = false;
        if (posy > gameHeight || !isAWorldActive) {
          $(this).remove();
        } else {
          $(this).y(bossMissileSpeeds[wtype], true);
          if (areColliding($(this), $(".selectedShip"))) {
            if (!invincibility) {
              flashHit("player");
              for (var i = 0; i < weaponDamage[wtype]; i++) {
                if (playerShields[selectedShip] != 0) {
                  playerShields[selectedShip]--;
                } else {
                  playerHealths[selectedShip]--;
                }
              }
              updateHealthbar();
              updateShieldBar();
              if (sound[1]) {
                playSound("shipHit");
              }
              $(this).remove();
            } else {
              if (sound[1]) {
                playSound("invincibilityHit");
              }
              $(this).remove();
            }
          }
        }
      });

      $(".enemyMissiles").each(function () {
        var wtype = Number(
          $(this)
            .attr("class")
            .split(" ")
            .find(function (el) {
              return el.search("weaponNo") != -1;
            })
            .toString()
            .split("weaponNo")[1]
        );
        var posy = $(this).y();
        var soundplay = false;
        if (posy > gameHeight || !isAWorldActive || clearGame || bomb) {
          $(this).remove();
        } else {
          $(this).y(enemyMissileSpeeds[wtype], true);
          if (areColliding($(this), $(".selectedShip"))) {
            if (!invincibility) {
              flashHit("player");
              for (var i = 0; i < weaponDamage[wtype]; i++) {
                if (playerShields[selectedShip] != 0) {
                  playerShields[selectedShip]--;
                } else {
                  playerHealths[selectedShip]--;
                }
              }
              updateHealthbar();
              updateShieldBar();
              if (sound[1]) {
                playSound("shipHit");
              }
              $(this).remove();
            } else {
              if (sound[1]) {
                playSound("invincibilityHit");
              }
              $(this).remove();
            }
          }
          var collided = $(this).collision(".enemy,." + $.gQ.groupCssClass);
          if (collided.length > 0) {
            collided.each(function () {
              var enemy = $(this)[0].enemy;
              if (!enemy.exploded) {
                soundplay = true;
                if (enemy.hp - weaponDamage[wtype] < 1) {
                  enemy.exploded = true;
                  enemy.node[0].style.backgroundImage = "url('./assets/animations/hq/enemyGeneralExplosion.gif')";
                  score += enemy.originalHp * 10;
                  if (sound[1]) {
                    playSound("enemyDestroy");
                  }
                  updateScore();
                } else {
                  for (var i = 0; i < weaponDamage[wtype]; i++) {
                    if (enemy.shield != 0) {
                      enemy.shield--;
                    } else {
                      enemy.hp--;
                    }
                  }
                  score += weaponDamage[wtype] * 10;
                  updateScore();
                }
              }
            });
            if (soundplay) {
              createjs.Sound.stop();
              if (sound[1]) {
                playSound("shipHit");
              }
              $(this).remove();
            }
          }
        }
      });

      var i;
      if (invincibilityMusicSlow && !pauseGameStuff && isAWorldActive) {
        if (timeouts.invincibilityMusicSlow >= invincibilityMusicSlowTime) {
          if (musStopCount > 0) {
            musStopCount -= 0.025;
            document.getElementById("bgInvincibility").volume = musStopCount;
          } else {
            document.getElementById("bgInvincibility").pause();
            document.getElementById("bgInvincibility").currentTime = 0.0;
            if (sound[0]) {
              playBgMusic();
            }
            window.clearInterval(timeouts.bgmusicStop);
            invincibilityMusicSlow = false;
          }
          timeouts.invincibilityMusicSlow = 0;
        } else {
          timeouts.invincibilityMusicSlow++;
        }
      }
      if (invincibility && !pauseGameStuff && isAWorldActive) {
        if (timeouts.invincibilityWarn >= invincibilityWarnTime) {
          invincibilityWarn = true;
          invincibilityFlash[1] = invincibilityFlash[0];
          stopInvincibilityMusic();
          timeouts.invincibilityWarn = 0;
        } else {
          timeouts.invincibilityWarn++;
        }
        if (timeouts.invincibility >= invincibilityTime) {
          invincibility = false;
          invincibilityWarn = false;
          flashInvincibility();
          timeouts.invincibility = 0;
        } else {
          timeouts.invincibility++;
        }
        if (invincibilityWarn) {
          if (invincibilityCount >= invincibilityFlash[1]) {
            invincibilityFlash[1] += invincibilityWarnSlow;
            flashInvincibility();
            invincibilityCount = 0;
          } else {
            invincibilityCount++;
          }
        } else {
          if (invincibilityCount >= invincibilityFlash[0]) {
            flashInvincibility();
            invincibilityCount = 0;
          } else {
            invincibilityCount++;
          }
        }
      }
      if (
        (jQuery.gameQuery.keyTracker[controls.flyleft] || gamepadpressed[gamePadControls.flyleft]) &&
        !pauseGameStuff &&
        !gameInterrups.blur
      ) {
        for (i = 0; i < noOfShips; i++) {
          if (shipExplosionActive[i] == 0) {
            var ip = i + 1;
            document.getElementById(`ship${ip}Body`).style.backgroundImage =
              `url('./assets/images/hq/rho-${ip}-turnleft.png')`;
          }
        }
        var nextpos = $("#squadron").x() - playerSpeed;
        if (nextpos >= -playerWidth * 1.29) {
          $("#squadron").x(nextpos);
        }
      }
      if (
        (jQuery.gameQuery.keyTracker[controls.flyright] || gamepadpressed[gamePadControls.flyright]) &&
        !pauseGameStuff &&
        !gameInterrups.blur
      ) {
        for (var j = 0; j < noOfShips; j++) {
          if (shipExplosionActive[j] == 0) {
            var jp = j + 1;
            document.getElementById(`ship${jp}Body`).style.backgroundImage =
              `url('./assets/images/hq/rho-${jp}-turnright.png')`;
          }
        }
        var nextposj = $("#squadron").x() + playerSpeed;
        if (nextposj <= gameWidth - playerWidth * 4) {
          $("#squadron").x(nextposj);
        }
      }
      if (
        !jQuery.gameQuery.keyTracker[controls.flyleft] &&
        !jQuery.gameQuery.keyTracker[controls.flyright] &&
        !gamepadpressed[gamePadControls.flyleft] &&
        !gamepadpressed[gamePadControls.flyright] &&
        !gameInterrups.blur
      ) {
        for (var k = 0; k < noOfShips; k++) {
          if (shipExplosionActive[k] == 0) {
            var kp = k + 1;
            document.getElementById(`ship${kp}Body`).style.backgroundImage =
              `url('./assets/images/hq/rho-${kp}-top.png')`;
          }
        }
      }
      if (gamePadJustPressed.weapon && !gameInterrups.blur) {
        if (!gamepadpressed[gamePadControls.weapon]) {
          gamePadJustPressed.weapon = false;
          timeouts.fire = true;
        }
      } else {
        if (gamepadpressed[gamePadControls.weapon] && !gameInterrups.blur) {
          gamePadJustPressed.weapon = true;
          if (!pauseGameStuff && isAWorldActive) {
            timeouts.fire = false;
            var ssp = selectedShip + 1;
            var weaponType = shipWeaponTypes[selectedShip];
            var wn;
            switch (weaponType) {
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
            if (weaponAmounts[selectedShip] > 0 && !pauseGameStuff) {
              if (sound[1]) {
                playSound(wn);
              }
              weaponAmounts[selectedShip]--;
              updateWeaponAmmunition();
              var playerposx = $("#squadron").x() + $(`#ship${ssp}`).x();
              var playerposy = $("#squadron").y() + $(`#ship${ssp}`).y();
              var name = "playerMissile_" + new Date().getTime();
              $("#playerMissileLayer").addSprite(name, {
                posx: playerposx + sPlayerWidth / 3,
                posy: playerposy,
                width: sPlayerWidth / 3,
                height: sPlayerHeight / 3
              });
              $("#" + name).addClass("playerMissiles weaponNo" + weaponType);
            }
          }
        }
      }

      if (
        (jQuery.gameQuery.keyTracker[controls.pause] || gamepadpressed[gamePadControls.pause]) &&
        !pauseGameStuff &&
        !gameInterrups.blur
      ) {
        pauseGame();
      }
      if (timeouts.ammoRecharge == weaponRespawnTime) {
        if (
          !jQuery.gameQuery.keyTracker[controls.weapon] &&
          !gamepadpressed[gamePadControls.weapon] &&
          weaponAmounts[selectedShip] != weaponAmountsMax[selectedShip] &&
          !pauseGameStuff &&
          !gameInterrups.blur
        ) {
          weaponAmounts[selectedShip]++;
          if (LOGGING) console.debug("WEAPON AMOUNT UPDATE: " + weaponAmounts[selectedShip]);
          updateWeaponAmmunition();
        }
        timeouts.ammoRecharge = 0;
      } else {
        timeouts.ammoRecharge++;
      }
      if (timeouts.shieldRecharge == shieldRespawnTime) {
        if (
          playerShields[selectedShip] < playerOriginalShields[selectedShip] &&
          shieldsActive[selectedShip] &&
          !pauseGameStuff
        ) {
          playerShields[selectedShip]++;
          if (LOGGING) console.debug("SHIELD UPDATE: " + playerShields[selectedShip]);
          updateShieldBar();
        }
        timeouts.shieldRecharge = 0;
      } else {
        timeouts.shieldRecharge++;
      }
      var boss;
      if (timeouts.bossAmmoRecharge == bossWeaponRespawnTime) {
        boss = $("#boss_" + worldNumber);
        if (!pauseGameStuff && boss.length) {
          boss = boss[0].boss;
          boss.updateAmmo();
          if (LOGGING) console.debug("BOSS WEAPON AMOUNT UPDATE: " + boss.ammo);
        }
        timeouts.bossAmmoRecharge = 0;
      } else {
        timeouts.bossAmmoRecharge++;
      }
      if (timeouts.bossFire == bossFireTime) {
        boss = $("#boss_" + worldNumber);
        if (!pauseGameStuff && boss.length) {
          boss = boss[0].boss;
          boss.fire();
        }
        timeouts.bossFire = 0;
      } else {
        timeouts.bossFire++;
      }
      if (timeouts.bossShieldRecharge == bossShieldRespawnTime) {
        boss = $("#boss_" + worldNumber);
        if (!pauseGameStuff && boss.length) {
          boss = boss[0].boss;
          boss.updateShield();
          if (LOGGING) console.debug("SHIELD UPDATE: " + boss.shield);
        }
        timeouts.bossShieldRecharge = 0;
      } else {
        timeouts.bossShieldRecharge++;
      }

      var enemy;
      if (timeouts.enemyAmmoRecharge == enemyWeaponRespawnTime) {
        $(".enemy").each(function () {
          $(this)[0].enemy.updateAmmo();
        });
        timeouts.enemyAmmoRecharge = 0;
      } else {
        timeouts.enemyAmmoRecharge++;
      }
      if (timeouts.enemyFire == enemyFireTime) {
        $(".enemy").each(function () {
          $(this)[0].enemy.fire();
        });
        timeouts.enemyFire = 0;
      } else {
        timeouts.enemyFire++;
      }
      if (timeouts.enemyShieldRecharge == enemyShieldRespawnTime) {
        $(".enemy").each(function () {
          $(this)[0].enemy.updateShield();
        });
        timeouts.enemyShieldRecharge = 0;
      } else {
        timeouts.enemyShieldRecharge++;
      }

      if (timeouts.planetTimer == worldMeterTime) {
        if (isAWorldActive && !stopWorldCounter) {
          remainingDistanceToPlanet--;
          score += 1;
          updateScore();
          updatePlanetDistance();
        }
        timeouts.planetTimer = 0;
      } else {
        timeouts.planetTimer++;
      }
      if (!stopWorldCounter) {
        spawnRun(worldNumber - 1, gameTime);
        gameTime++;
      }
    }, refreshRate);

    setInterval(function () {
      if (gamepadConnected) {
        checkGamepads();
        gamePadKeyListen();
      }
    }, 15);

    $(document).keyup(function (e) {
      if (e.keyCode == controls.down && !pauseGameStuff && isAWorldActive) {
        changeShip(0);
      }
      if (e.keyCode == controls.up && !pauseGameStuff && isAWorldActive) {
        changeShip(1);
      }
      if (e.keyCode === controls.weapon) {
        timeouts.fire = true;
      }
    });

    $(document).keydown(function (e) {
      if (e.keyCode === controls.weapon && !pauseGameStuff && isAWorldActive) {
        if (timeouts.fire) {
          timeouts.fire = false;
          var ssp = selectedShip + 1;
          var weaponType = shipWeaponTypes[selectedShip];
          var wn;
          switch (weaponType) {
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
          if (weaponAmounts[selectedShip] > 0 && !pauseGameStuff) {
            if (sound[1]) {
              playSound(wn);
            }
            weaponAmounts[selectedShip]--;
            updateWeaponAmmunition();
            var playerposx = $("#squadron").x() + $(`#ship${ssp}`).x();
            var playerposy = $("#squadron").y() + $(`#ship${ssp}`).y();
            var name = "playerMissile_" + new Date().getTime();
            $("#playerMissileLayer").addSprite(name, {
              posx: playerposx + sPlayerWidth / 3,
              posy: playerposy,
              width: sPlayerWidth / 3,
              height: sPlayerHeight / 3
            });
            $("#" + name).addClass("playerMissiles weaponNo" + weaponType);
          }
        }
      }
    });

    $.playground().startGame();
    for (var l = 0; l < noOfShips; l++) {
      var lp = l + 1;
      shieldBars[l] = document.getElementById(`ship${lp}ShieldBar`);
      healthBars[l] = document.getElementById(`ship${lp}HealthBar`);
      healthWidths[l] = Number(healthBars[l].style.width.split("px")[0]);
      shieldWidths[l] = Number(shieldBars[l].style.width.split("px")[0]);
    }

    updateShipDetails();
    $.loadCallback(function (ev) {
      if (ev == 100) {
        document.getElementById("splashOtherh2").innerHTML = "Finishing Up...";
        setTimeout(function () {
          $.playground().pauseGame();

          document.getElementById("splashOtherh2").innerHTML = `<button
          onclick="unlockGame()"
          class="w3-center w3-btn w3-white w3-round w3-border-white w3-ripple">
          <b>CLICK TO BEGIN</b>
        </button>`;
        }, 500);
      }
    });
  }
}

function unlockGame() {
  changeTitle("Main Menu");
  document.getElementById("loading").style.display = "none";
  document.getElementById("mainMenu").style.display = "block";
  currentMenu = 1;
  if (sessionStorage.getItem("nowelcome") != "true") {
    openAlert(
      "Welcome to Squadron!",
      "Use the UP and DOWN ARROWS to move the cursor and press SHIFT to select. You can change the controls in the settings menu.",
      "orange"
    );
  }
}

function flashHit(elem) {
  switch (elem) {
    case "boss":
      document.documentElement.style.setProperty("--boss-hit-col", "rgb(255, 96, 96)");
      setTimeout(function () {
        document.documentElement.style.setProperty("--boss-hit-col", "transparent");
      }, flashTime);
      break;
    case "player":
      document.documentElement.style.setProperty("--invincibility-col", "rgb(255, 96, 96)");
      setTimeout(function () {
        document.documentElement.style.setProperty("--invincibility-col", "transparent");
      }, flashTime);
      break;
  }
}
function flashInvincibility() {
  if (invincibility) {
    switch (invincibilityCol) {
      case "rgb(128, 128, 128)":
        invincibilityCol = "rgb(255, 255, 255)";
        break;
      case "rgb(255, 255, 255)":
        invincibilityCol = "rgb(128, 128, 128)";
        break;
      default:
        invincibilityCol = "rgb(128, 128, 128)";
        break;
    }
  } else {
    invincibilityCol = "transparent";
  }
  document.documentElement.style.setProperty("--invincibility-col", invincibilityCol);
}

function powerupCollect(n) {
  if (n != 5 && n != 4 && sound[1]) {
    playSound("powerupCollect");
  }
  switch (n) {
    case 0:
      score += 500;
      updateScore();
      playerHealths[selectedShip] = playerOriginalLives[selectedShip];
      updateHealthbar();
      updateHealthbars();
      break;
    case 1:
      score += 500;
      updateScore();
      weaponAmounts[selectedShip] = weaponAmountsMax[selectedShip];
      updateWeaponAmmunition();
      break;
    case 2:
      score += 500;
      updateScore();
      playerShields[selectedShip] = playerOriginalShields[selectedShip];
      updateShieldBar();
      updateShieldBars();
      break;
    case 3:
      score += 500;
      updateScore();
      squadronLives++;
      updateSquadronLives();
      break;
    case 4:
      score += 8000;
      updateScore();
      if (!invincibility) {
        invincibility = true;
        invincibilityWarn = false;
        invincibilityMusicSlow = false;
        invincibilityCount = 0;
        timeouts.invincibility = 0;
        timeouts.invincibilityWarn = 0;
        timeouts.invincibilityMusicSlow = 0;
        stopBgMusic();
        if (sound[0]) {
          invincibilityMusic();
        }
      } else {
        stopBgMusic();
        invincibility = true;
        invincibilityWarn = false;
        invincibilityMusicSlow = false;
        invincibilityCount = 0;
        timeouts.invincibility = 0;
        timeouts.invincibilityWarn = 0;
        timeouts.invincibilityMusicSlow = 0;
        window.clearInterval(timeouts.bgmusicStop);
        if (sound[1]) {
          document.getElementById("bgInvincibility").pause();
          document.getElementById("bgInvincibility").currentTime = 0.0;
          invincibilityMusic();
        }
      }
      break;
    case 5:
      score += 700;
      updateScore();
      $(".enemy").each(function () {
        var enemy = $(this)[0].enemy;
        if (!enemy.exploded) {
          enemy.exploded = true;
          enemy.node[0].style.backgroundImage = "url('./assets/animations/hq/enemyGeneralExplosion.gif')";
          score += enemy.originalHp * 10;
          updateScore();
        }
      });
      if (sound[1]) {
        playSound("boom");
      }
      bomb = true;
      setTimeout(function () {
        bomb = false;
      }, 100);
      break;
  }
}

function startGame() {
  updateSquadronLives();
  document.getElementById("mainMenu").style.display = "none";
  currentMenu = 0;
  playBgMusic();
  changeTitle("Game");
  document.getElementById("upScroller").style.display = "block";
  $.playground().resumeGame();
  updateShipsInGame();
  updateShipDetails();
  updateHealthbars();
  updateHealthbar();
  updateShieldBars();
  updateShieldBar();
  $(window).focus(function () {
    if (!CONTNMW && currentMenu != 1 && currentMenu != 2 && currentMenu != 4 && currentMenu != 15) {
      document.getElementById("paused").style.display = "none";
      gameInterrups.blur = false;
      checkResumeRequirements();
    }
  });
  $(window).blur(function () {
    if (!CONTNMW && currentMenu != 1 && currentMenu != 2 && currentMenu != 4 && currentMenu != 15) {
      changeTitle("Paused");
      $.playground().pauseGame();
      document.getElementById("paused").style.display = "block";
      gameInterrups.blur = false;
      isAWorldActive = false;
    }
  });
  isAWorldActive = true;
}

function checkResumeRequirements() {
  if (!gameInterrups.resize && !gameInterrups.blur && !gameInterrups.manualPause) {
    $.playground().resumeGame();
    changeTitle("Game");
    isAWorldActive = true;
  }
}

function playSound(toPlay) {
  createjs.Sound.play(toPlay);
}

function changeMenu(menu, opt) {
  if (currentMenu != 0) {
    var nms;
    var mm = menu - 1;
    switch (opt) {
      case 0:
        nms = (menuSelected[mm] + 1) % menuSelectMax[mm];
        menuSelected[mm] = nms;
        break;
      case 1:
        nms = (menuSelected[mm] + (menuSelectMax[mm] - 1)) % menuSelectMax[mm];
        menuSelected[mm] = nms;
        break;
      case 2:
        nms = menuSelected[mm];
        document.getElementById(`menu${menu}Button${nms}`).click();
        break;
    }
    for (var i = 0; i < menuSelectMax[mm]; i++) {
      document.getElementById(`menu${menu}Select${i}`).innerHTML = "";
    }
    nms = menuSelected[mm];
    document.getElementById(`menu${menu}Select${nms}`).innerHTML =
      `<img src="./assets/images/hq/rho-1-top.png" class="menuSelectImage">`;
  }
}

function changeTitle(title) {
  document.title = `${title} | Squadron`;
}

function pauseMenuDo(option) {
  switch (option) {
    case 0:
      document.getElementById("pauseMenu").style.display = "none";
      document.getElementById("pauseMenuDev").style.display = "none";
      changeTitle("Game");
      document.getElementById("upScroller").style.display = "block";
      isAWorldActive = true;
      gameInterrups.manualPause = false;
      $.playground().resumeGame();
      currentMenu = 0;
      break;
    case 1:
      document.getElementById("pauseMenu").style.display = "none";
      document.getElementById("inGameSettingsMenu").style.display = "block";
      currentMenu = 3;
      break;
  }
}
function updateShipDetails() {
  var ssp = selectedShip + 1;
  document.getElementById("selectedShipImage").src = `./assets/images/hq/rho-${ssp}-top.png`;
  document.getElementById("selectedShipNumber").innerHTML = ssp;
  document.getElementById("selectedShipName").innerHTML = shipNames[selectedShip];
  document.getElementById("currentWeaponName").innerHTML = weaponNamesDescriptive[shipWeaponTypes[selectedShip]];
  updateWeaponAmmunition();
}

function updateWorldCount() {
  document.getElementById("worldNumber").innerHTML = worldNumber;
}

function continueAfterDeath() {
  if (isBossFight) {
    playersUnlocked[worldNumber] = 1;
    selectedShip = worldNumber;
  } else {
    playersUnlocked = playersIReallyUnlocked.slice();
  }
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
  $.playground().resumeGame();
  currentMenu = 0;
  isAWorldActive = true;
  gameInterrups.manualPause = false;
}

function updateWeaponAmmunition() {
  var ammoInner = document.getElementById("ammoBarInner");
  var div = weaponAmounts[selectedShip] / weaponAmountsMax[selectedShip];
  if (isNaN(div)) {
    div = 0;
  }
  if (weaponAmountsMax[selectedShip] == 0) {
    ammoInner.style.width = "0px";
    if (LOGGING) console.debug("Ship has no ammo");
  } else {
    ammoInner.style.width =
      (document.getElementById("ammoBarOuter").clientWidth / weaponAmountsMax[selectedShip]) *
        weaponAmounts[selectedShip] +
      "px";
    if (LOGGING) console.debug("AMMO:" + weaponAmounts[selectedShip]);
    if (div < 0.34) {
      ammoInner.style.backgroundColor = "#F54927";
    } else if (div < 0.46) {
      ammoInner.style.backgroundColor = "#FFDF20";
    } else if (div < 0.67) {
      ammoInner.style.backgroundColor = "#BBF451";
    } else {
      ammoInner.style.backgroundColor = "#4CAF50";
    }
  }
}

window.addEventListener("gamepadconnected", function (e) {
  gamePadConnect(navigator.getGamepads()[0].id);
  gamePadJustPressed = {
    flyleft: true,
    flyright: true,
    down: true,
    up: true,
    weapon: true,
    pause: true,
    menuenter: true
  };
  gamepadConnected = true;
});

window.addEventListener("gamepaddisconnected", function (e) {
  if (navigator.getGamepads()[0] == null) {
    gamepadConnected = false;
    pauseGame();
    openAlert("Gamepad Disconnected.", "A gamepad had been disconnected.", "red");
    document.getElementById("gamepadStatus").innerHTML = "NO GAMEPAD CONNECTED";
  }
});

function gamePadConnect(id) {
  openAlert("Gamepad Connected.", id + " Connected.", "green");
  document.getElementById("gamepadStatus").innerHTML = "SET GAMEPAD CONTROLS";
}

function checkGamepads() {
  try {
    const gamepads = navigator.getGamepads();
    gamepadpressed = [];
    var i;
    for (i = 0; i < gamepads[0].buttons.length; i++) {
      gamepadpressed[i] = gamepads[0].buttons[i].pressed;
    }
    for (i = 0; i < gamepads[0].axes.length; i++) {
      gamepadpressed[100 + i * 2] = gamepads[0].axes[i] <= 0 - gamepadDeadzone;
      gamepadpressed[100 + i * 2 + 1] = gamepads[0].axes[i] >= 0 + gamepadDeadzone;
    }
  } catch {}
}

function updatePlanetDistance() {
  if (remainingDistanceToPlanet == 0) {
    document.getElementById("remainingDistanceToPlanet").innerHTML = `YOU ARE AT A PLANET`;
    newWorld();
  } else {
    document.getElementById("remainingDistanceToPlanet").innerHTML =
      `PLANET INCOMING IN ${remainingDistanceToPlanet}KM`;
  }
  //console.log(worldNumber - 1, worldMeterTime * planetDistances[worldNumber - 1], gameTime, planetDistances[worldNumber - 1] - gameTime / worldMeterTime);
  //console.log(remainingDistanceToPlanet - (planetDistances[worldNumber - 1] - gameTime / worldMeterTime));
  if (remainingDistanceToPlanet <= (gameHeight * 1.3) / enemySpeeds[0] / worldMeterTime) {
    stopSpawn = true;
  }
}

function updateSquadronLives() {
  document.getElementById("squadronNumber").innerHTML = squadronLives;
}

function newWorldShipCollect() {
  if (sound[1]) {
    playSound("shipFound");
  }
  document.getElementById("downToSwitchMessage").innerHTML = "";
  killInvincibility();
  var name;
  playersUnlocked = [0, 0, 0, 0, 0, 0, 0, 0];
  playersUnlocked[worldNumber] = 1;
  playersIReallyUnlocked[worldNumber] = 1;
  selectedShip = worldNumber;
  updateShipDetails();
  updateShipsInGame();
  isBossFight = true;
  if (!invincibility) {
    stopBgMusic();
    playBgMusic();
  }

  name = "boss_" + worldNumber;
  var wnm = worldNumber - 1;
  $("#enemies")
    .addGroup(name, {
      animation: "",
      posx: gameWidth,
      posy: 0,
      width: bossWidth,
      height: bossTotalHeight
    })
    .addSprite("bossBody", {
      animation: "",
      posx: 0,
      posy: barBorders * 2 + barBorders * 2 + sShieldBarHeight + sHealthBarHeight + barBorders * 2,
      width: bossWidth,
      height: bossHeight
    })
    .addSprite("bossHealthBar", {
      animation: "",
      posx: 0,
      posy: barBorders * 2 + barBorders * 2 + sShieldBarHeight,
      width: bossWidth,
      height: sHealthBarHeight
    })
    .addSprite("bossShieldBar", {
      animation: "",
      posx: 0,
      posy: barBorders * 2,
      width: bossWidth,
      height: sShieldBarHeight
    })
    .end();
  var bossElement = $("#" + name);
  bossElement.addClass("boss");
  if (worldNumber != 6) {
    $("#bossBody").css("backgroundImage", `url('./assets/images/hq/zeta-${worldNumber}-top.png')`);
  } else {
    $("#bossBody").css("backgroundImage", `url('./assets/images/hq/zeta-6-top-min.png')`);
  }
  bossElement[0].boss = new Boss(bossElement, wnm);
  $(`#bossHealthBar`).addClass("healthBar generalStatusBar");
  $(`#bossShieldBar`).addClass("shieldBar generalStatusBar");
  if (bossShields[wnm] == 0) {
    document.getElementById(`bossShieldBar`).style.width = "0px";
  }
}

function newWorld() {
  stopScroll = true;
  var name = "ship_" + new Date().getTime();
  $("#enemies").addSprite(name, {
    animation: "",
    posx: Math.random() * gameWidth * 0.9,
    posy: 0,
    width: shipToCollectWidth,
    height: shipToCollectHeight
  });
  var shipElement = $("#" + name);
  shipElement.addClass("shipToCollect");
  var wnp = worldNumber + 1;
  shipElement[0].style.backgroundImage = `url('./assets/images/hq/rho-${wnp}-top.png')`;
  shipElement[0].ship = new Ship(shipElement, wnp);

  clearGame = true;
  stopWorldCounter = true;
}

function newWorldBossDone() {
  if (!invincibility) {
    stopBgMusic();
    isBossFight = false;
    if (sound[0]) {
      playBgMusic();
    }
  }
  gameInterrups.manualPause = true;
  stopSpawn = false;
  clearGame = true;
  pauseGameStuff = true;
  timeouts.newWorld = setInterval(function () {
    if ($("#squadron").y() < 0) {
      window.clearInterval(timeouts.newWorld);
      if (sound[1]) {
        playSound("newWorld");
      }
      $.playground().pauseGame();
      worldNumber++;
      if (worldNumber == 7) {
        document.getElementById("upScroller").style.display = "none";
        stopBgMusic();
        currentMenu = 8;
        if (sound[1]) {
          playSound("win0");
        }
        var hsMessage;
        var scoreUpd = String(score).padStart(6, "0");
        var highscore = localStorage.getItem("hs");
        if (highscore == undefined || highscore == null) highscore = "0";
        var highscoreN = Number(highscore);
        if (score > highscoreN) {
          hsMessage = "You set a new highscore with a score of " + scoreUpd + "!";
          localStorage.setItem("hs", score.toString());
        } else {
          hsMessage = "The current highscore is " + highscore.padStart(6, "0") + ". You scored " + scoreUpd + ".";
        }
        document.getElementById("finalScore").innerHTML = hsMessage;
        document.getElementById("gameWon").style.display = "block";
      } else {
        currentMenu = 6;
        var wnm = worldNumber - 1;
        remainingDistanceToPlanet = planetDistances[wnm];
        updateWorldCount();
        document.getElementById("rescuedShipName1").innerHTML = shipNames[wnm];

        document.getElementById("rescuedShipImage").src = "./assets/images/hq/rho-" + worldNumber + "-top.png";
        document.getElementById("rescuedShipName2").innerHTML = shipNames[wnm];
        document.getElementById("rescuedShipWeapon").innerHTML = weaponNamesDescriptive[shipWeaponTypes[wnm]];
        if (weaponAmountsMax[shipWeaponTypes[wnm]] == 0) {
          document.getElementById("rescuedShipWeaponCapacity").innerHTML = "NO AMMUNITION";
        } else {
          document.getElementById("rescuedShipWeaponCapacity").innerHTML =
            weaponAmountsMax[shipWeaponTypes[wnm]] + " SHOTS CAPACITY";
        }
        document.getElementById("rescuedShipHealth").innerHTML = playerOriginalLives[wnm];
        if (playerOriginalShields[wnm] == 0) {
          document.getElementById("rescuedShipShield").innerHTML = "NO SHIELD";
        } else {
          document.getElementById("rescuedShipShield").innerHTML = playerOriginalShields[wnm] + " SHIELD HP";
        }
        document.getElementById("newWorld").style.display = "block";
      }
    } else {
      $("#squadron").y($("#squadron").y() - playerSpeed);
    }
  }, refreshRate * playerUpSpeedFactor);
}

function newWorldContinue() {
  document.getElementById("downToSwitchMessage").innerHTML = "UP / DOWN TO SWITCH";
  gameTime = 0;
  stopScroll = false;
  stopWorldCounter = false;
  $("#squadron").y(gameHeight - playerTotalHeight * 3);
  document.getElementById("newWorld").style.display = "none";
  playersUnlocked = playersIReallyUnlocked.slice();
  playerHealths = playerOriginalLives.slice();
  playerShields = playerOriginalShields.slice();
  weaponAmounts = weaponAmountsMax.slice();
  gameInterrups.manualPause = false;
  currentMenu = 0;
  $.playground().resumeGame();
  updatePlanetDistance();
  updateShipsInGame();
  updateHealthbars();
  updateHealthbar();
  updateShieldBars();
  updateShieldBar();
  updateWeaponAmmunition();
  $("#squadron").x(gameWidth / 2 - (playerWidth * 5) / 2);
  clearGame = true;
  setTimeout(function () {
    clearGame = false;
    isAWorldActive = true;
    pauseGameStuff = false;
  }, 100);
}
var selectingShip = null;
function changeShip(dir) {
  if (!isBossFight) {
    if (!switchShipCooldown) {
      var newShip = selectedShip;
      var newShipUsage = newShip;
      if (dir == 0) {
        for (var i = newShipUsage; i < playersUnlocked.length + newShipUsage; i++) {
          var sp = i + 1;
          sp = sp % playersUnlocked.length;
          if (playersUnlocked[sp] == 1) {
            newShip = sp;
            break;
          }
        }
      } else {
        for (var j = playersUnlocked.length + newShipUsage; j > newShipUsage; j--) {
          var sm = j - 1;
          sm = sm % playersUnlocked.length;
          if (playersUnlocked[sm] == 1) {
            newShip = sm;
            break;
          }
        }
      }
      selectedShip = newShip;
      updateShipsInGame();
      updateShipDetails();
      var oldShipN = Number($(".selectedShip").not(".shipBody").attr("id").split("ship")[1]) - 1;
      if (selectingShip != oldShipN) {
        if (LOGGING) console.debug("Switch cooldown initialised");
        switchShipCooldown = true;
        timeouts.switchShipCooldown = setTimeout(function () {
          if (LOGGING) console.debug("Switch cooldown complete");
          switchShipCooldown = false;
        }, switchShipCooldownTime);
      }
    } else {
      if (LOGGING) console.debug("Switch ship prevented by cooldown");
    }
  }
}

function gameOver() {
  gamePadJustPressed = {
    flyleft: true,
    flyright: true,
    down: true,
    up: true,
    weapon: true,
    pause: true,
    menuenter: true
  };
  createjs.Sound.stop();
  stopBgMusic();
  if (sound[1]) {
    playSound("shipHit");
    playSound("lose");
  }
  isAWorldActive = false;
  $.playground().pauseGame();
  currentMenu = 5;
  gameInterrups.manualPause = true;
  document.getElementById("gameOver").style.display = "block";
  shipExplosionActive = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function returnToMainMenu() {
  isAWorldActive = false;
  window.location.reload();
}

function updateHealthbar() {
  var sp = selectedShip + 1;
  if (playerHealths[selectedShip] < 1) {
    playersUnlocked[selectedShip] = 0;
    shipExplosionActive[selectedShip] = 1;
    document.getElementById(`ship${sp}Body`).style.backgroundImage = "url('./assets/animations/hq/shipExplosion.gif')";
    healthBars[selectedShip].style.width = "0px";
    shieldBars[selectedShip].style.width = "0px";
    if (playersUnlocked.indexOf(1) == -1) {
      if (squadronLives == 1) {
        gameOver();
      } else {
        createjs.Sound.stop();
        if (sound[1]) {
          playSound("squadronDead");
        }
        squadronLives--;
        isAWorldActive = false;
        $.playground().pauseGame();
        currentMenu = 7;
        gameInterrups.manualPause = true;
        document.getElementById("squadronDeath").style.display = "block";
        shipExplosionActive = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    } else {
      if (sound[1]) {
        playSound("shipDead");
      }
      selectedShip = 0;
    }
  } else {
    var div = playerHealths[selectedShip] / playerOriginalLives[selectedShip];
    if (isNaN(div)) {
      div = 0;
    }
    if (playerHealths[selectedShip] == 0) {
      healthBars[selectedShip].style.width = "0px";
    } else {
      healthBars[selectedShip].style.width =
        (healthWidths[selectedShip] / playerOriginalLives[selectedShip]) * playerHealths[selectedShip] + "px";
      if (LOGGING) console.debug("HEALTH:" + playerHealths[selectedShip]);
      if (div < 0.46) {
        healthBars[selectedShip].style.backgroundColor = "#F54927";
      } else if (div < 0.67) {
        healthBars[selectedShip].style.backgroundColor = "#FFDF20";
      } else {
        healthBars[selectedShip].style.backgroundColor = "#4CAF50";
      }
    }
  }
}

function updateBossBars() {
  var wnm = worldNumber - 1;
  var healthBar = document.getElementById("bossHealthBar");
  var shieldBar = document.getElementById("bossShieldBar");
  var boss = $("#boss_" + worldNumber)[0].boss;
  var div = boss.hp / bossHealths[wnm];
  if (isNaN(div)) {
    div = 0;
  }
  if (boss.hp == 0) {
    healthBar.style.width = "0px";
  } else {
    healthBar.style.width = (bossWidth / bossHealths[wnm]) * boss.hp + "px";
    if (LOGGING) console.debug("BOSS HEALTH:" + boss.hp);
    if (div < 0.46) {
      healthBar.style.backgroundColor = "#F54927";
    } else if (div < 0.67) {
      healthBar.style.backgroundColor = "#FFDF20";
    } else {
      healthBar.style.backgroundColor = "#4CAF50";
    }
  }
  div = boss.shield / bossShields[wnm];
  if (isNaN(div)) {
    div = 0;
  }
  if (boss.shield == 0) {
    shieldBar.style.width = "0px";
    if (LOGGING) console.debug("BOSS has no shield");
  } else {
    shieldBar.style.width = (bossWidth / bossShields[wnm]) * boss.shield + "px";
    if (LOGGING) console.debug("BOSS SHIELD: " + boss.shield);
    if (div < 0.34) {
      shieldBar.style.backgroundColor = "#162456";
    } else if (div < 0.46) {
      shieldBar.style.backgroundColor = "#1C398E";
    } else if (div < 0.67) {
      shieldBar.style.backgroundColor = "#1C69A8";
    } else {
      shieldBar.style.backgroundColor = "#0077FF";
    }
  }
}

function updateHealthbars() {
  for (var i = 0; i < healthBars.length; i++) {
    var div = playerHealths[i] / playerOriginalLives[i];
    if (isNaN(div)) {
      div = 0;
    }
    if (playerHealths[i] == 0) {
      healthBars[i].style.width = "0px";
    } else {
      healthBars[i].style.width = (healthWidths[i] / playerOriginalLives[i]) * playerHealths[i] + "px";
      if (LOGGING) console.debug("HEALTH:" + playerHealths[i]);
      if (div < 0.46) {
        healthBars[i].style.backgroundColor = "#F54927";
      } else if (div < 0.67) {
        healthBars[i].style.backgroundColor = "#FFDF20";
      } else {
        healthBars[i].style.backgroundColor = "#4CAF50";
      }
    }
  }
}

function updateShieldBars() {
  for (var i = 0; i < shieldBars.length; i++) {
    var div = playerShields[i] / playerOriginalShields[i];
    if (isNaN(div)) {
      div = 0;
    }
    if (playerShields[i] == 0) {
      shieldBars[i].style.width = "0px";
      if (LOGGING) console.debug("Ship " + i + " has no shield");
    } else {
      shieldBars[i].style.width = (shieldWidths[i] / playerOriginalShields[i]) * playerShields[i] + "px";
      if (LOGGING) console.debug("SHIELD:" + playerShields[i]);
      if (div < 0.34) {
        shieldBars[i].style.backgroundColor = "#162456";
      } else if (div < 0.46) {
        shieldBars[i].style.backgroundColor = "#1C398E";
      } else if (div < 0.67) {
        shieldBars[i].style.backgroundColor = "#1C69A8";
      } else {
        shieldBars[i].style.backgroundColor = "#0077FF";
      }
    }
  }
}
function areColliding(element1, element2) {
  var $el1 = $(element1);
  var $el2 = $(element2);

  var offset1 = $el1.offset();
  var offset2 = $el2.offset();

  var el1_left = offset1.left;
  var el1_right = offset1.left + $el1.width();
  var el1_top = offset1.top;
  var el1_bottom = offset1.top + $el1.height();

  var el2_left = offset2.left;
  var el2_right = offset2.left + $el2.width();
  var el2_top = offset2.top;
  var el2_bottom = offset2.top + $el2.height();

  return el1_left < el2_right && el1_right > el2_left && el1_top < el2_bottom && el1_bottom > el2_top;
}

function updateShipsInGame() {
  var i, ip, bsElement;
  var oldShipN = Number($(".selectedShip").not(".shipBody").attr("id").split("ship")[1]) - 1;
  if (selectedShip != oldShipN) {
    var oldShip = $(".selectedShip").not(".shipBody");
    var oldShipBody = $(".selectedShip.shipBody");
    var oldShipHealthBar = oldShip.children(".healthBar");
    var oldShipShieldBar = oldShip.children(".shieldBar");
    for (i = 0; i < noOfShips; i++) {
      ip = i + 1;
      bsElement = $(`#ship${ip}`);
      squadronElements[i] = $(`#ship${ip}Body`);
      bsElement.removeClass("unlockedShip");
      squadronElements[i].removeClass("selectedShip");
      bsElement.removeClass("selectedShip");
      squadronElements[i].removeClass("selectingShip");
      bsElement.removeClass("selectingShip");
      if (playersUnlocked[i] == 1) {
        bsElement.addClass("unlockedShip");
      } else if (shipExplosionActive[i] == 1) {
        bsElement.addClass("unlockedShip");
      }
      if (i == selectedShip) {
        squadronElements[i].addClass("selectedShip");
        bsElement.addClass("selectedShip");
      }
      if (!shieldsActive[i]) {
        document.getElementById(`ship${ip}ShieldBar`).style.width = "0px";
      }
    }
    var newX = oldShip.x();
    var newY = oldShip.y();
    var newShip = $(".selectedShip").not(".shipBody");
    var newShipBody = $(".selectedShip.shipBody");
    var newShipHealthBar = newShip.children(".healthBar");
    var newShipShieldBar = newShip.children(".shieldBar");
    var currentX = newShip.x();
    var currentY = newShip.y();
    newShip.css("width", sPlayerWidth + "px");
    newShip.css("height", sPlayerTotalHeight + "px");
    oldShip.css("width", playerWidth + "px");
    oldShip.css("height", playerTotalHeight + "px");
    newShipBody.css("width", sPlayerWidth + "px");
    newShipBody.css("height", sPlayerHeight + "px");
    oldShipBody.css("width", playerWidth + "px");
    oldShipBody.css("height", playerHeight + "px");
    oldShipHealthBar.css("width", playerWidth + "px");
    oldShipHealthBar.css("height", healthBarHeight + "px");
    newShipHealthBar.css("width", sPlayerWidth + "px");
    newShipHealthBar.css("height", sHealthBarHeight + "px");
    oldShipShieldBar.css("width", playerWidth + "px");
    oldShipShieldBar.css("height", shieldBarHeight + "px");
    newShipShieldBar.css("width", sPlayerWidth + "px");
    newShipShieldBar.css("height", sShieldBarHeight + "px");
    oldShip.x(currentX, false);
    oldShip.y(currentY, false);
    newShip.x(newX, false);
    newShip.y(newY, false);
    oldShipHealthBar.x(0, false);
    oldShipHealthBar.y(playerHeight + healthBarHeight - barBorders * 2, false);
    newShipHealthBar.x(0, false);
    newShipHealthBar.y(sPlayerHeight + sHealthBarHeight - barBorders * 2, false);
    oldShipShieldBar.x(0, false);
    oldShipShieldBar.y(playerHeight + healthBarHeight + barBorders * 2 + shieldBarHeight + barBorders * 2, false);
    newShipShieldBar.x(0, false);
    newShipShieldBar.y(sPlayerHeight + sHealthBarHeight + barBorders * 2 + sShieldBarHeight + barBorders * 2, false);
    shieldWidths[selectedShip] = sPlayerWidth;
    shieldWidths[oldShipN] = playerWidth;
    healthWidths[selectedShip] = sPlayerWidth;
    healthWidths[oldShipN] = playerWidth;
    updateHealthbar();
    updateHealthbars();
    updateShieldBar();
    updateShieldBars();
  } else {
    for (i = 0; i < noOfShips; i++) {
      ip = i + 1;
      bsElement = $(`#ship${ip}`);
      squadronElements[i] = $(`#ship${ip}Body`);
      bsElement.removeClass("unlockedShip");
      squadronElements[i].removeClass("selectedShip");
      bsElement.removeClass("selectedShip");
      squadronElements[i].removeClass("selectingShip");
      bsElement.removeClass("selectingShip");
      if (playersUnlocked[i] == 1) {
        bsElement.addClass("unlockedShip");
      } else if (shipExplosionActive[i] == 1) {
        bsElement.addClass("unlockedShip");
      }
      if (i == selectedShip) {
        squadronElements[i].addClass("selectedShip");
        bsElement.addClass("selectedShip");
      }
      if (!shieldsActive[i]) {
        document.getElementById(`ship${ip}ShieldBar`).style.width = "0px";
      }
    }
  }
}

function updateShieldBar() {
  var div = playerShields[selectedShip] / playerOriginalShields[selectedShip];
  if (isNaN(div)) {
    div = 0;
  }
  if (playerShields[selectedShip] == 0) {
    shieldBars[selectedShip].style.width = "0px";
    if (LOGGING) console.debug("Ship " + selectedShip + " has no shield");
  } else {
    shieldBars[selectedShip].style.width =
      (shieldWidths[selectedShip] / playerOriginalShields[selectedShip]) * playerShields[selectedShip] + "px";
    if (LOGGING) console.debug("SHIELD:" + playerShields[selectedShip]);
    if (div < 0.34) {
      shieldBars[selectedShip].style.backgroundColor = "#162456";
    } else if (div < 0.46) {
      shieldBars[selectedShip].style.backgroundColor = "#1C398E";
    } else if (div < 0.67) {
      shieldBars[selectedShip].style.backgroundColor = "#1C69A8";
    } else {
      shieldBars[selectedShip].style.backgroundColor = "#0077FF";
    }
  }
}

function pauseGame() {
  if (isAWorldActive) {
    isAWorldActive = false;
    changeTitle("Paused");
    $.playground().pauseGame();
    gameInterrups.manualPause = true;
    if (!DEV) {
      document.getElementById("pauseMenu").style.display = "block";
      document.getElementById("upScroller").style.display = "none";
      currentMenu = 9;
    } else {
      document.getElementById("pauseMenuDev").style.display = "block";
      document.getElementById("upScroller").style.display = "none";
      currentMenu = 10;
    }
  }
}

function Enemy(node, id, type, hp, shield, ammo, dmg, wType) {
  this.exploded = false;
  this.explodeCount = 0;
  this.node = node;
  this.type = type;
  this.id = id;
  this.hp = hp;
  this.originalHp = hp;
  this.shield = shield;
  this.shieldMax = shield;
  this.ammo = ammo;
  this.ammoMax = ammo;
  this.dmg = dmg;
  this.sensitivity = gameWidth * 0.03;
  this.wType = wType;
  this.speed = enemySpeeds[this.type];
  this.update = function () {
    this.node.y(this.speed, true);
  };
  this.fire = function () {
    var wn;
    if (!this.exploded && this.ammo > 0) {
      var sqx = $("#squadron").x();
      var sqy = $("#squadron").y();
      if (
        this.node.x() > sqx - this.sensitivity &&
        this.node.x() < sqx + playerWidth * 5 + this.sensitivity &&
        this.node.y() <= sqy
      ) {
        switch (this.wType) {
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
        if (sound[1]) {
          playSound(wn);
        }
        this.ammo--;
        var name = "enemyMissile_" + new Date().getTime();
        $("#playerMissileLayer").addSprite(name, {
          posx: this.node.x() + enemyWidths[this.type] / 3,
          posy: this.node.y() + enemyHeights[this.type],
          width: enemyWidths[this.type] / 3,
          height: enemyHeights[this.type] / 3
        });
        $("#" + name).addClass("enemyMissiles weaponNo" + this.wType);
      }
    }
  };
  this.updateAmmo = function () {
    if (this.ammo < this.ammoMax && !this.firing) {
      this.ammo++;
    }
  };
  this.updateShield = function () {
    if (this.shield < this.shieldMax) {
      this.shield++;
    }
  };
}
var bossPrevDir = "top";
function Boss(node, id) {
  this.exploded = false;
  this.explodeCount = 0;
  this.node = node;
  this.id = id;
  this.firing = false;
  this.hp = bossHealths[id];
  this.shield = bossShields[id];
  this.shieldMax = bossShields[id];
  this.ammo = bossAmmo[id];
  this.ammoMax = bossAmmo[id];
  this.wType = bossWeaponType[id];
  this.speed = bossSpeeds[id];
  this.update = function () {
    if (!this.exploded) {
      var ip = this.id + 1;
      var bgi;
      if (ip != 6) {
        bgi = `url('./assets/images/hq/zeta-${ip}-top.png')`;
      } else {
        bgi = `url('./assets/images/hq/zeta-${ip}-top-min.png')`;
      }
      var sqx = Math.ceil($("#squadron").x() + $(".selectedShip.player").not(".shipBody").x());
      var myx = Math.ceil(this.node.x());
      if (myx < sqx - this.speed) {
        this.node.x(this.speed, true);
        bossPrevDir = "turnleft";
        if (ip != 6) {
          bgi = `url('./assets/images/hq/zeta-${ip}-turnleft.png')`;
        } else {
          bgi = `url('./assets/images/hq/zeta-${ip}-turnleft-min.png')`;
        }
      } else if (myx > sqx + this.speed) {
        this.node.x(-this.speed, true);
        bossPrevDir = "turnright";
        if (ip != 6) {
          bgi = `url('./assets/images/hq/zeta-${ip}-turnright.png')`;
        } else {
          bgi = `url('./assets/images/hq/zeta-${ip}-turnright-min.png')`;
        }
      } else {
        bossPrevDir = "top";
      }
      document.getElementById("bossBody").style.backgroundImage = bgi;
    }
  };
  this.fire = function () {
    var wn;
    var ip = this.id + 1;
    switch (this.wType) {
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
    if (this.firing) {
      if (this.ammo > 0) {
        if (sound[1]) {
          playSound(wn);
        }
        this.ammo--;
        if (ip == 6) {
          $("#bossBody").css("backgroundImage", `url('./assets/images/hq/zeta-6-${bossPrevDir}-max.png')`);
        }
        var name = "bossMissile_" + new Date().getTime();
        $("#playerMissileLayer").addSprite(name, {
          posx: this.node.x() + bossWidth / 3,
          posy: this.node.y() + $("#bossBody").y() + bossHeight,
          width: bossWidth / 3,
          height: bossHeight / 3
        });
        $("#" + name).addClass("bossMissiles weaponNo" + this.wType);
        setTimeout(function () {
          var bb = $("#bossBody");
          try {
            if ($("#boss_" + worldNumber)[0].boss.exploded) {
              bb.css("backgroundImage", `url('./assets/animations/hq/bossExplosion.gif`);
            } else {
              var ip = $("#boss_" + worldNumber)[0].boss.id + 1;
              if (ip == 6) {
                bb.css("backgroundImage", `url('./assets/images/hq/zeta-6-${bossPrevDir}-min.png')`);
              }
            }
          } catch {
            try {
              bb.css("backgroundImage", `url('./assets/animations/hq/bossExplosion.gif`);
            } catch {}
          }
        }, 50);
      } else {
        this.firing = false;
      }
    } else {
      if (this.ammo == this.ammoMax) {
        this.firing = true;
      }
    }
  };
  this.updateAmmo = function () {
    if (this.ammo < this.ammoMax && !this.firing) {
      this.ammo++;
    }
  };
  this.updateShield = function () {
    if (this.shield < this.shieldMax) {
      this.shield++;
    }
    updateBossBars();
  };
}

function Powerup(node, id, type) {
  this.node = node;
  this.id = id;
  this.type = type;
  this.speed = powerUpSpeed;
  this.update = function () {
    this.node.y(this.speed, true);
  };
}

function Ship(node, id) {
  this.node = node;
  this.id = id;
  this.speed = 5;
  this.dir = 0;
  this.upDir = 0;
  this.update = function () {
    if (this.upDir == 1) {
      if (this.node.y() <= this.speed) {
        this.upDir = 0;
      } else {
        this.node.y(-this.speed, true);
      }
    } else {
      if (this.node.y() >= gameHeight - this.speed - shipToCollectHeight) {
        this.upDir = 1;
      } else {
        this.node.y(this.speed, true);
      }
    }
    if (this.dir == 0) {
      if (this.node.x() <= this.speed) {
        this.dir = 1;
      } else {
        this.node.x(-this.speed, true);
      }
    } else {
      if (this.node.x() >= gameWidth - this.speed - shipToCollectWidth) {
        this.dir = 0;
      } else {
        this.node.x(this.speed, true);
      }
    }
  };
}

function Player(node) {
  this.node = node;
}
