const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let MealList = {
  "date": "",
  "breakfast": "",
  "lunch": "",
  "dinner": "",
};

async function crawl() {
  // 가상 브라우져를 실행, headless: false를 주면 벌어지는 일을 새로운 창을 열어 보여준다(default: true)
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const ndhs_id = ''; // 추후 로그인 폼에서 각자의 아이디 비밀번호를 입력받게 할 예정
  const ndhs_pw = '';

  // headless: false일때 브라우져 크기 지정해주는 코드
  // await page.setViewport({
  //     width: 1366,
  //     height: 768
  // });

  //페이지로 가라
  await page.goto('http://portal.ndhs.or.kr/index');

  //해당 페이지에 특정 html 태그를 클릭해라
  await page.click('body > div > div > div > div > div > div.row > div > div.login-body > div > div.col-xs-12.col-sm-5.login-con.pt20 > div > form > ul > li:nth-child(2)');

  //아이디랑 비밀번호 란에 값을 넣어라
  await page.evaluate((id, pw) => {
    document.querySelector('#stuUserId').value = id;
    document.querySelector('#stuPassword').value = pw;
  }, ndhs_id, ndhs_pw);

  //로그인 버튼을 클릭해라
  await page.click('#student > div > div:nth-child(2) > button');

  //로그인 화면이 전환될 때까지 기다려라, headless: false 일때는 필요 반대로 headless: true일때는 없어야 되는 코드
  //await page.waitForNavigation()

  //로그인 성공 시(화면 전환 성공 시)
  if (page.url() === 'http://portal.ndhs.or.kr/dashboard/dashboard') {
    //학사 페이지로 가서
    await page.goto('http://portal.ndhs.or.kr/studentLifeSupport/carte/list');

    // 현재 페이지의 html정보를 로드
    const content = await page.content();
    const $ = cheerio.load(content);
    const lists = $("body > div.container-fluid > div:nth-child(6) > div > table > tbody > tr");
    lists.each((index, list) => {
      MealList[index] = {
        date: $(list).find("th").text().replace('\n\t\t\t\t\t\t\t\t', ""),
        breakfast: $(list).find("td:nth-of-type(1)").text(),
        lunch: $(list).find("td:nth-of-type(2)").text(),
        dinner: $(list).find("td:nth-of-type(3)").text()
      }
      console.log(MealList[index]);

    })
  }
  //로그인 실패시
  else {
    console.log('실패');
    ndhs_id = 'nope';
    ndhs_pw = 'nope';
  }

  //브라우저 꺼라
  await browser.close();
};


crawl();