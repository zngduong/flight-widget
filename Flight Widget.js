// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: infinity;

/* =======================================================
Script Name : Flight Widget.js
Author      : zngduong@gmail.com
Version     : 0.0.1
Description :
  Craw data flight schedule from danangairportterminal.vn
Dependencies: N/A
Actions     :
======================================================= */

const widget = await createWidget();

var CONF_FONT_WIDGET_TITLE = "System";
var CONF_FONT_WEIGHT_WIDGET_TITLE = "heavy";
var CONF_FONT_SIZE_WIDGET_TITLE = 16;
var CONF_FONT_COLOR_WIDGET_TITLE =
      Color.dynamic(
        new Color("#000000"),
        new Color("#fefefe")
      );
var CONF_FONT_DATE = "System";
var CONF_FONT_WEIGHT_DATE = "heavy";
var CONF_FONT_SIZE_DATE = 12;
var CONF_FONT_COLOR_DATE =
      Color.dynamic(
        new Color("#8a8a8d"),
        new Color("#9f9fa4")
      );
var WIDGET_SIZE = (config.runsInWidget ? config.widgetFamily : "large");
const WIDGET_NEWS_COUNT = 4;
// show widget if run in app
if (!config.runsInWidget) {
  switch (WIDGET_SIZE) {
    case "small": await widget.presentSmall(); break;
    case "medium": await widget.presentMedium(); break;
    case "large": await widget.presentLarge(); break;
  }
}

Script.setWidget(widget);
Script.complete();

/* ============== FUNCTIONS ============== */

// create the widget
async function createWidget() {
  const fontWidgetTitle = await loadFont('System', 'heavy', 16);
  
  const list = new ListWidget();
  const widgetData = await getData(false);
  
  // Display the title of the widget
  const titleStack = list.addStack();
  titleStack.layoutHorizontally();
  
  const widgetTitle = titleStack.addText("Arrivals");
  widgetTitle.font = fontWidgetTitle;
  widgetTitle.textColor = Color.dynamic(
        new Color("#000000"),
        new Color("#fefefe")
      );
  widgetTitle.lineLimit = 1;
  widgetTitle.minimumScaleFactor = 0.5;
  list.setPadding(16, 16, 16, 16);
  if (widgetData.length > 0) {
    titleStack.addSpacer();
    const sym = SFSymbol.named("airplane.arrival");
    sym.applyFont(fontWidgetTitle);
    const symbolArrivals = titleStack.addImage(sym.image);
    symbolArrivals.rightAlignImage();
    symbolArrivals.tintColor = Color.dynamic(
        new Color("#000000"),
        new Color("#fefefe")
      );
    symbolArrivals.imageSize = new Size(19, 19)
  }
  const postStack = list.addStack();
  postStack.layoutVertically();
  const count = widgetData.length;
  const aStackRow = await new Array(count);
      const aStackCol = await new Array(count);
      const aLblNewsDateTime = await new Array(count);
      const aLblNewsHeadline = await new Array(count);
      let i;
      for (i = 0; i < count; i++) {
        aStackRow[i] = list.addStack();
        aStackRow[i].layoutHorizontally();

        aStackCol[i] = aStackRow[i].addStack();
        aStackCol[i].layoutVertically();
        
        aLblNewsDateTime[i] = aStackCol[i].addText(widgetData[i][1]+' : '+ widgetData[i][0]);
        aLblNewsDateTime[i].font = loadFont("System", "heavy", 12);
        aLblNewsDateTime[i].textColor = Color.dynamic(
        new Color("#8a8a8d"),
        new Color("#9f9fa4")
      );
        aLblNewsDateTime[i].lineLimit = 1;
        aLblNewsDateTime[i].minimumScaleFactor = 0.5;
     }
  return list;
}

async function getData(isDeparture) {
  const toDate = new Date(Date.now());
  const url = `https://danangairportterminal.vn/umbraco/surface/flight/arrival?culturalInfor=en-gb&endTime=${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}+23:59&language=en&mapUrl=http:%2F%2Fdanangairportterminal.vn%2Fmaps%2F&startTime=${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}+00:00`
  const urlDep = `https://danangairportterminal.vn/umbraco/surface/flight/departure?culturalInfor=en-gb&endTime=${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}+23:59&language=en&mapUrl=http:%2F%2Fdanangairportterminal.vn%2Fmaps%2F&startTime=${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}+00:00`
  let req;
  (isDeparture)? req = new Request(urlDep) : req = new Request(url);
  const res = await req.loadString();
  
  const regTime = /<td .*arrival-1">\r?\s*(?<sta>\d\d:\d\d)\r?\s*.*\r?\s(?<eta>\d\d:\d\d)?/gm
  const regAdd = /<td .*arrival-2">\s*(?<add>.*)/gm
  const regCode = /<div.*flights-code.*\r?\s*.*\r?\s?.*<span>(?<code>.*)<\//gm
  const regStatus = /<td .*arrival-4">\s*.*">(?<status>.*)<\/s/gm

  const arrivals = [];
  console.log(res);
  while (
		(matchTime = regTime.exec(res)) !== null 
		&& (matchAdd = regAdd.exec(res)) !== null 
  		&& (matchCode = regCode.exec(res)) !== null 
   		&& (matchStatus = regStatus.exec(res)) !== null 
  ) {
  	const flight = [matchCode.groups.code,matchTime.groups.sta,matchTime.groups.eta,matchAdd.groups.add,matchStatus.groups.status];
	arrivals.push(flight);
  }
  return arrivals;
}

// get the chosen font for widget texts
function loadFont(fontName, fontThickness, fontSize) {
  let font = Font.boldSystemFont(fontSize);
  if (fontName == "System" || fontName == "Rounded" || fontName == "Monospaced") {
    switch (fontThickness) {
      case "ultralight":
        font = (fontName == "Rounded") ? Font.ultraLightRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.ultraLightMonospacedSystemFont(fontSize) : Font.ultraLightSystemFont(fontSize); break;
      case "thin":
        font = (fontName == "Rounded") ? Font.thinRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.thinMonospacedSystemFont(fontSize) : Font.thinSystemFont(fontSize); break;
      case "light":
        font = (fontName == "Rounded") ? Font.lightRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.lightMonospacedSystemFont(fontSize) : Font.lightSystemFont(fontSize); break;
      case "regular":
        font = (fontName == "Rounded") ? Font.regularRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.regularMonospacedSystemFont(fontSize) : Font.regularSystemFont(fontSize); break;
      case "medium":
        font = (fontName == "Rounded") ? Font.mediumRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.mediumMonospacedSystemFont(fontSize) : Font.mediumSystemFont(fontSize); break;
      case "semibold":
        font = (fontName == "Rounded") ? Font.semiboldRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.semiboldMonospacedSystemFont(fontSize) : Font.semiboldSystemFont(fontSize); break;
      case "bold":
        font = (fontName == "Rounded") ? Font.boldRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.boldMonospacedSystemFont(fontSize) : Font.boldSystemFont(fontSize); break;
      case "heavy":
        font = (fontName == "Rounded") ? Font.heavyRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.heavyMonospacedSystemFont(fontSize) : Font.heavySystemFont(fontSize); break;
      case "black":
        font = (fontName == "Rounded") ? Font.blackRoundedSystemFont(fontSize) : (fontName == "Monospaced") ? Font.blackMonospacedSystemFont(fontSize) : Font.blackSystemFont(fontSize); break;
    }
  } else {
    font = new Font(fontName, fontSize);
  }
  return font;
}

async function isOnline() {
  const view = new WebView();
  const connection = await view.evaluateJavaScript("navigator.onLine");
  return connection;
}

