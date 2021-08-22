'use strict'

// config 내의 값들은 아래의 주석을 확인해주세요
/* 
 botToken 에는 https://discord.com/developers/applications 에서 생성한 botToken 를 넣어주십시오
 webhookId 에는 디스코내에서 생성한 웹훜의 id 입니다
 webhookToken 역시 디스코드내에서 생성한 웹훅의 token 값 입니다.
 galleryAddress 후킹할 갤러리의 주소 입니다.
 baseAddress "https://gall.dcinside.com" 이 값을 그대로 넣으면 됩니다.
*/

const config = require("./config.json")  // 해당 파일을 생성해서 넣으세요.


const Discord = require("discord.js")
const minorBot = new Discord.WebhookClient(config.webhookId, config.webhookToken) // 웹훅 클라이언트입니다. 마갤봇 채널에 쏘는 웹훅
const GallBot = require('./gallbot'); // 마갤용 웹훅 봇

// const Gusoon = require("./gusoon");
// var gusoon = new Gusoon( config.botToken )
//gusoon.launchGusoon();


var gallBot = GallBot.getInstance(minorBot, config.galleryAddress)
gallBot.loopCrawling(); // 크롤링 이후 웹훅에 쏘는 로직





