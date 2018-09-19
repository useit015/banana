const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

var globalShortcut = electron.globalShortcut;

var exec = require('child_process').exec;

const {ipcMain} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// Configuration

var mainWindow = [];
var nbWin = 1;
var debug = false;
var volume = 2;

var launch = ['CommandOrControl+Q', 'CommandOrControl+W'];

// Private var
var sound = false;
var WinTitle;
var title = "Banana";


ipcMain.on('konami', function() {
	debug = true;
	exec('killall simb');
	app.quit();
})

function createWindow (i) {

	// Create the browser window.
	mainWindow[i] = new BrowserWindow({width: 800, height: 600, frame: false})

	// and load the index.html of the app.
	mainWindow[i].loadURL(`file://${__dirname}/index.html`)

	mainWindow[i].on('close', function() {
		if (!debug) {
			createWindow(i);
		}
	})

	mainWindow[i].setPosition(Math.floor((Math.random() * (2560 - 800)) + 0), Math.floor((Math.random() * (1440 - 600)) + 0));
	//mainWindow[i].setFullScreen(true);
	if (!debug) {
		mainWindow[i].setKiosk(true);
		mainWindow[i].setMenuBarVisibility(false);
		mainWindow[i].setVisibleOnAllWorkspaces(true);
		mainWindow[i].setKiosk(true);
	}

}


app.on('ready', makeWins);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
	if (!debug) {
		makeWins();
	} else {
		app.quit();
	}
})

app.on('activate', makeWins);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function makeWins() {


	launch.forEach(function(value) {
		const ret = globalShortcut.register(value, function() {
			if (!sound) {
				volumeUp();
				setInterval(volumeUp, 2000);
				sound = true;
			}

			if (volume < 10) {
				volume++;
				exec('osascript -e "set Volume ' + volume + '"');
			}
		});
	});

	if (debug) {
		globalShortcut.register('F14', function() {
			app.quit();
		});
	}

	for (var i = 0; i < nbWin; i++) {
		createWindow(i);
	}
}

exec('osascript -e "set Volume 0"');
exec('osascript -e "tell application "System Events" to set require password to wake of security preferences to false"');

setInterval(function() {
	exec("osascript -e 'tell application \"System Events\" to set frontmost of process \"" + title + "\" to true'", function(error, stdout, stderr)
	    {

	    });
}, 100);

function short() {
	createWindow(mainWindow.length);
	console.log("Short");
}

function volumeUp() {
	if (!debug) {
		exec('osascript -e "set Volume ' + volume + '"');
		exec('audiodevice output internal');
	}
}
