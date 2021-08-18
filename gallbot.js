const axios = require("axios") // nodejs 용 promise 기반 http client 입니다
const cheerio = require("cheerio");  // web crawling 
const fs = require('fs')
const config = require("./config.json") 


function loadRecentPostTime() {
    try {
        if( !fs.existsSync('./recent.json')) return 
        let f = fs.readFileSync('./recent.json','utf8')
        var recent = JSON.parse(f)
        return recent.recentTime
    } catch ( err ) {
        console.error(err)
    }
}
function saveRecentPostTime(time) {
    var inputs = { 
        recentTime: time
    }
    fs.writeFileSync('./recent.json', JSON.stringify(inputs) )
}

module.exports = class GallBot {
    constructor( _minorBot, _address ) {
        this.minorBot = _minorBot
        this.address = _address
        this.recentPostTime = loadRecentPostTime() || ( new Date().getTime() )
    }
    async getHtml() {
        try {
            return await axios.get(this.address)
        } catch (err) {
            console.error(err.msg)
        }
    }
    
    sendBotMessage(item) {
        const message = "마갤에 " + item.author + "님이 작성한 글이 올라와있습니다.\n" + config.baseAddress + item.link
        this.minorBot.send(message)
    }

    loopCrawling() {
        console.log("Crawling Start! " + this.recentPostTime)
        this.getHtml().then( html => {
            let indexCount = 0;
            let ulList = [];
            const $ = cheerio.load(html.data)
    
            // td 밑 tr들 배열
            const $bodyList = $("div.dcwrap > div.wrap_inner > main.listwrap")
                .children("section.left_content").first()
                .find("div.gall_listwrap > table")
                .children("tBody")
                .children('tr')
    
            // 배열 데이터 루프 돌면서 게시글만 가져옴
            $bodyList.each(function (i, elem) {
                indexCount++
                // 게시된 글중 외부 공지 글이 아닌 직접 게시판에 포스트 된 글들은 us-post클래스가 등록 되어 있음
                if ($(this).hasClass("us-post")) {
                    // 게시글 가져와서 리스트에 넣고 푸쉬
                    const part = {
                        author: $(this).find("td.gall_writer").attr("data-nick"),
                        title: $(this).find("td.gall_tit > a").text(),
                        link: $(this).find("td.gall_tit > a").attr("href"),
                        date: Date.parse($(this).find("td.gall_date").attr("title")),
                        dateString: $(this).find("td.gall_date").attr("title"),
                    }
                    ulList.push(part)
                }
            });
            return ulList;
        }).then(res => {
            var sec = 30
            console.log("Crawling Done!")
            // 시간 순대로 정렬 ( 가장 최근 순 )
            res.sort((a, b) => b.date - a.date)
            // 봇이 마지막으로 뿌린 시점부터 그 이후에 들어온 게시글 체크        
            const filtered = res.filter(it => it.date > this.recentPostTime)
    
            // 없으면 다시 돌아가서 크롤링
            if (filtered.length === 0) {
                setTimeout(this.loopCrawling.bind(this), sec * 1000)
                return
                // 있다면 해당 메시지를 디스코드에 post
            } else {
                console.log(filtered)
                console.log("최근 타임 : " + filtered[0].date + " String:" + filtered[0].dateString)
                console.log("Process will restart in " + sec + "seconds")
                // 시점 갱신
                this.recentPostTime = filtered[0].date
                saveRecentPostTime(this.recentPostTime)
                // 돌면서 메시지를 전송
                filtered.forEach(item => this.sendBotMessage(item))
                setTimeout(this.loopCrawling.bind(this), sec * 1000)
            }
        }).catch(err => {
            // 에러발생시 재실행
            var sec = 10
            console.log(err)
            console.log("Process will restart in " + sec + "seconds")
            setTimeout(this.loopCrawling.bind(this), 10000)
        })
    }
}


