const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const corsValidation = require('./config/corsValidation.js')

const app = express();
const port = 3000;

const getAllCookies = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); // set timeout to 0
  await page.goto(url);
  const client = await page.target().createCDPSession();
  const cookies = await client.send('Network.getAllCookies');
  return cookies
}

app.use(cors(corsValidation));

app.use(express.json());

app.post('/singleweb', async ( req, res ) => {
  const { singleWebsite } = req.body
  if ( !singleWebsite ) {
    return res.status('400').json( {message: "Please input website link"} )
  } 
  const singleWebsiteCookies = await getAllCookies(singleWebsite)
  res.send(singleWebsiteCookies)
})


app.post('/manyweb', async (req, res) => {

  console.log( req.body )

  if( !Array.isArray(req.body) ){
    return res.status(400).json( {message: "valid array needed"} )
  }
  let sendSuccessFuly = [];
  for (const eachTabInfo of req.body) {
    let cookieandwebObj = await getAllCookies(eachTabInfo.url)
    cookieandwebObj["websiteDetails"] = eachTabInfo
    sendSuccessFuly.push( cookieandwebObj );
  }
  console.log("sendSuccessFuly",sendSuccessFuly)
  res.send(sendSuccessFuly);
});

app.all('*', (req, res) => {
  res.status(404).type('txt').send('404 Not Found')
})

app.listen(port, () => {
  console.log(`listening to ${port}`);
});