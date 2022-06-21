const {remote} = require('electron');
const {BrowserWindow, dialog, shell, app} = remote;
const fs = require('fs');

let print_win;
let save_pdf_path;

async function initPrintWin(html, chartData, chartLabels){
  const path = app.getAppPath();
  print_win = new BrowserWindow( {
    show: false,
    'auto-hide-menu-bar':true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });
  print_win.loadURL(`file://${path}/print.html?getData=${encodeURIComponent(html)}&getChartData=${encodeURIComponent(JSON.stringify(chartData))}&getChartLabels=${encodeURIComponent(JSON.stringify(chartLabels))}`);

  print_win.on('closed', () => {
    print_win = null;
  });
    //print_win.show();
}

function getPDFPrintSettings() {
  var option = {
    landscape: true,
    marginsType: 0,
    printBackground: true,
    printSelectionOnly: false,
    pageSize: 'A4',
  };

  return option;
}

export async function print() {
  if (!print_win) {
    await initPrintWin();
  }
  print_win.webContents.on('did-finish-load', () => {
    print_win.webContents.print({}, (success, errorType) => {
      if (!success) console.log(errorType)
    })
  });
}

export async function savePDF(fileName, html, chartData, chartLabels) {
  if (!print_win) {
    await initPrintWin(html, chartData, chartLabels);
  }
  print_win.webContents.on('did-finish-load', () => {
    dialog.showSaveDialog(print_win, {
      defaultPath: "report_"+fileName+".pdf"
    }).then(function (dialogReturn) {
      if (dialogReturn.filePath) {
        print_win.webContents.printToPDF(getPDFPrintSettings()).then((data) => {
          fs.writeFile(dialogReturn.filePath, data, function (err) {
            if (err) {
              dialog.showErrorBox('Error', err);
              return;
            }
            save_pdf_path = dialogReturn.filePath;
            print_win.close();
          });
        }).catch( (err) => {
          if (err) {
            dialog.showErrorBox('Error', err);
            return;
          }
        });
      } else {
        print_win.close();
      }
    }).catch(err => {
      print_win.close();
    });
  });

}

export const printRawHtml = async(html, chartData, chartLabels) => {
  const path = app.getAppPath();

  const win = new BrowserWindow({
    show: false,
   'auto-hide-menu-bar':true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    },  width: 1684, height: 1190 });

  win.loadURL(`file://${path}/print.html?getData=${encodeURIComponent(html)}&getChartData=${encodeURIComponent(JSON.stringify(chartData))}&getChartLabels=${encodeURIComponent(JSON.stringify(chartLabels))}`);
  win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(
      'setTimeout(() =>window.print(), 1000); setTimeout(() => window.close(), 2000);',
    );
  });
}

export function viewPDF() {
  if (!save_pdf_path) {
    dialog.showErrorBox('Error', "You should save the pdf before viewing it");
    return;
  }
  shell.openItem(save_pdf_path);
}
