const {remote} = require('electron');
const {BrowserWindow, dialog, shell} = remote;
const fs = require('fs');

let print_win;
let save_pdf_path;

async function initPrintWin(){
  let print_win = new BrowserWindow({'auto-hide-menu-bar':true});
  await print_win.loadURL('file://' + __dirname + '/print.html');

  print_win.on('closed', () => {
    print_win = null;
  });
    //print_win.show();
}

function getPDFPrintSettings() {
  var option = {
    landscape: false,
    marginsType: 0,
    printBackground: false,
    printSelectionOnly: false,
    pageSize: 'A4',
  };

  var layoutSetting = document.getElementById("layout-settings");
  option.landscape =
    layoutSetting.options[layoutSetting.selectedIndex].value == 'Landscape';
  var pageSizeSetting = document.getElementById("page-size-settings");
  option.pageSize =
    pageSizeSetting.options[pageSizeSetting.selectedIndex].text;
  var marginsSetting = document.getElementById("margin-settings");
  option.marginsType =
    parseInt(marginsSetting.options[marginsSetting.selectedIndex].value);

  option.printBackground = document.getElementById("print-background").checked;
  option.printSelectionOnly = document.getElementById(
    "print-selection").checked;
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

export async function savePDF() {
  if (!print_win) {
    await initPrintWin();
  }
  print_win.webContents.on('did-finish-load', () => {
    dialog.showSaveDialog(print_win, {}, function (file_path) {
      if (file_path) {
        print_win.webContents.printToPDF(getPDFPrintSettings(), function (err, data) {
          if (err) {
            dialog.showErrorBox('Error', err);
            return;
          }
          fs.writeFile(file_path, data, function (err) {
            if (err) {
              dialog.showErrorBox('Error', err);
              return;
            }
            save_pdf_path = file_path;
          });
        });
      }
    });
  });

}

export const printRawHtml = html => {
  const win = new BrowserWindow({ show: false });
  win.loadURL(`data:text/html;charset=UTF-8,${
    encodeURIComponent(`<html><body>${html}</body></html>`)
  }`);
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(
      'window.print(); setTimeout(() => window.close());',
    );
  });
};

export function viewPDF() {
  if (!save_pdf_path) {
    dialog.showErrorBox('Error', "You should save the pdf before viewing it");
    return;
  }
  shell.openItem(save_pdf_path);
}