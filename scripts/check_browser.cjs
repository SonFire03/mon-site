const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,headless:true,args:['--no-sandbox']});
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.PORTFOLIO_URL || 'http://127.0.0.1:8765/';
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Homepage overflow ${width}`);
  assert.equal(await page.locator('.work-card:visible').count(),6);
  await page.getByRole('button',{name:'Cybersécurité',exact:true}).click();assert.equal(await page.locator('.work-card:visible').count(),4);
  await page.getByRole('button',{name:'Backend',exact:true}).click();assert.equal(await page.locator('.work-card:visible').count(),1);
  await page.getByRole('button',{name:'Outillage',exact:true}).click();assert.equal(await page.locator('.work-card:visible').count(),1);
  await page.getByRole('button',{name:/Tous les projets/}).click();
  if(width<960){await page.locator('#navToggle').click();assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'true');await page.locator('#navMenu a[href="#about"]').click();assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'false');}
  await page.screenshot({path:`/tmp/portfolio-${width}.png`,fullPage:true});
 }
 await page.route('https://formspree.io/**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
 await page.locator('[name=name]').fill('Test local');await page.locator('[name=email]').fill('test@example.com');await page.locator('[name=message]').fill('Test intercepté : aucun message envoyé.');await page.locator('button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#form-feedback').textContent.includes('Message envoyé'));
 await page.unroute('https://formspree.io/**');await page.route('https://formspree.io/**',r=>r.fulfill({status:500,body:'error'}));
 await page.locator('[name=name]').fill('Test local');await page.locator('[name=email]').fill('test@example.com');await page.locator('[name=message]').fill('Test erreur intercepté.');await page.locator('button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#form-feedback').textContent.includes('Erreur'));
 for(const file of ['recruiter.html',...fs.readdirSync('projet').map(x=>`projet/${x}/${x==='certif'?'certifications.html':'index.html'}`)]){
  for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.goto(base+file);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${file} overflow ${width}`);assert.equal(await page.locator('h1').count(),1,`${file} heading`);}
 }
 await page.goto(base+'projet/certif/certifications.html?filter=tryhackme');assert.equal(await page.locator('.cert:visible:not([data-source=tryhackme])').count(),0);
 await page.locator('#certSearch').fill('zzzz-nonexistent');assert.equal(await page.locator('.cert:visible').count(),0);
 const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(base);assert.equal(await np.locator('.work-card:visible').count(),6);
 await page.goto(base+'projet/mini-soc-dashboard/index.html');await page.keyboard.press('Control+k');assert(await page.locator('#cmdPalette').isVisible());await page.locator('#cmdInput').fill('zzzz');await page.keyboard.press('Tab');assert.equal(await page.locator('#cmdInput').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Escape');assert(!(await page.locator('#cmdPalette').isVisible()));assert.deepEqual(errors,[]);console.log('PASS: 4 viewport sizes, project filters, mobile menu, mocked contact success/error, all secondary pages, certification filters, no-JS content, no JS errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
