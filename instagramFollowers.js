//SECTION 
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM9', { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`))

//!SECTION 

const puppeteer = require( 'puppeteer-core' );
var config = {
    headless: true,
    autoCloseBrowser: true,
    incognito: true
}



var username = 'anime_reaven';
var refreshTime = 10;




var mainUrl = 'https://www.instagram.com';

refresh();

function refresh() {
    checkInstagramFollowers()
    setTimeout(()=>{
        refresh();
    },refreshTime*1000);
}



async function checkInstagramFollowers() {
    const browser = await puppeteer.launch( {
        headless: config.headless,
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        userDataDir: './data/User Data/Default',
    } );
    var context = browser.defaultBrowserContext();

    if ( config.incognito ) {
        context = await browser.createIncognitoBrowserContext()
    }
    var page = await context.newPage() || await page.newPage();

    await page.setViewport( {
        width: 1280,
        height: 800
    } )

    var url = `${mainUrl}/${username}`;

    await page.goto( url );
    console.log( `Opened ${url}!` );
    let followers = await page.evaluate( () =>
    document.querySelectorAll( 'li a span' )[1].title
    );
    await console.log(followers + Date.now().toUTC);
    //send followers to serialport
    
    

    await console.log( 'Operation Completed!' );
    if ( config.autoCloseBrowser ) {
        await context.close();
        //console.log( 'Tab Closed!' );
        browser.close();
    };
    await context.on( 'targetdestroyed', () => {
        browser.close();
        //console.log( 'Browser Closed!' );
        stopNodeProcess();
    } );
};

function stopNodeProcess() {
    process.exit();
}