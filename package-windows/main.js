const { app, BrowserWindow, Tray, Menu } = require("electron");

if (require("electron-squirrel-startup")) app.quit();

const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 559,
    show: false,
    titleBarStyle: "hidden",
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    icon: path.join(__dirname, "assets/logos/logoText.ico"),
    titleBarOverlay: {
      color: "#000000",
      symbolColor: "#ffffff"
    }
  });
  win.maximize();
  win.setMenu(null);
  win.show();
  win.loadFile(path.join(__dirname, "index.html"));
};
var tray = null;
app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, "assets/logos/logoText.ico"));
  tray.setToolTip("Squadron");
  tray.setTitle("Squadron");
  createWindow();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Continue Game",
      click: () => {
        const wins = BrowserWindow.getAllWindows();
        if (wins.length === 0) {
          createWindow();
        } else {
          wins[0].focus();
        }
      }
    },
    { role: "quit" }
  ]);

  tray.setContextMenu(contextMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
