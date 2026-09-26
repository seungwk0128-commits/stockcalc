const $=id=>document.getElementById(id);const num=id=>{const v=Number($(id)?.value);return Number.isFinite(v)?v:0};
const won=v=>Math.round(v).toLocaleString('ko-KR')+'원', qty=v=>Math.floor(v).toLocaleString('ko-KR')+'주', pct=v=>v.toFixed(2)+'%';
const good=(...v)=>v.every(x=>x>0);const details=a=>a.map(x=>`<div class="detail"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
function result(id,main,items=[]){$(id).innerHTML=`<div class="main-result">${main}</div><div class="details">${details(items)}</div>`}
const meta={
av:["",""],avg:['평균단가 계산기','여러 번 매수한 주식의 평균 매입단가를 계산합니다.'],water:['물타기 계산기','원하는 평균단가를 만들기 위해 필요한 추가 매수 수량을 계산합니다.'],break:['본전가격 계산기','현재 보유 주식의 매수가 기준 본전가격을 계산합니다.'],profit:['수익률 계산기','매수가와 현재/매도가를 기준으로 수익과 수익률을 계산합니다.'],target:['목표가격 계산기','원하는 수익률을 달성하기 위한 목표가격을 계산합니다.'],stop:['손절가격 계산기','허용 손실률을 기준으로 손절가격을 계산합니다.'],position:['매수 가능 수량 계산기','정해둔 투자금으로 살 수 있는 최대 주식 수를 계산합니다.'],dividend:['배당금 계산기','주당 배당금과 보유 수량으로 예상 배당금을 계산합니다.'],trade:['매매금액 계산기','주가와 수량으로 총 매매금액을 계산합니다.'],cagr:['연평균 수익률 계산기','투자기간 전체의 연평균 복리수익률을 계산합니다.'],need:['본전 필요 상승률','현재 주가에서 평균 매수가까지 필요한 상승률을 계산합니다.'],loss:['최대 손실금액 계산기','투자금과 허용 손실률로 최대 손실금액을 계산합니다.']};
const fields={
avg:[['첫 번째 매수가','aP','50,000'],['첫 번째 수량','aQ','100'],['두 번째 매수가','bP','40,000'],['두 번째 수량','bQ','100']],water:[['현재 평균단가','wA','50,000'],['현재 보유수량','wQ','100'],['추가 매수가','wP','35,000'],['원하는 평균단가','wT','42,000']],break:[['평균 매수가','brP','50,000'],['보유수량','brQ','100']],profit:[['매수가','pB','50,000'],['현재/매도가','pS','60,000'],['수량','pQ','100']],target:[['매수가','tB','50,000'],['원하는 수익률 (%)','tR','20']],stop:[['매수가','sB','50,000'],['허용 손실률 (%)','sR','10']],position:[['투자금','poC','5,000,000'],['현재 주가','poP','50,000']],dividend:[['주당 배당금','dD','1,000'],['보유 주식 수','dQ','500'],['주가','dP','50,000']],trade:[['주당 가격','trP','50,000'],['수량','trQ','100']],cagr:[['처음 투자금','cS','10,000,000'],['현재 평가금액','cE','15,000,000'],['투자 기간 (년)','cY','3']],need:[['내 평균 매수가','nB','50,000'],['현재 주가','nC','40,000']],loss:[['투자금','lM','5,000,000'],['허용 손실률 (%)','lR','10']]};
function panel(key){const fs=fields[key].map(f=>`<div class="field"><label>${f[0]}</label><input id="${f[1]}" type="number" inputmode="decimal" placeholder="${f[2]}"></div>`).join('');return `<div class="panel"><div class="fields">${fs}</div><button class="calc" id="doCalc">계산하기</button><div class="result" id="res"><div class="main-result">결과가 여기에 표시됩니다</div></div></div>`}
let current='avg';function render(key){current=key;document.querySelectorAll('.tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===key));$('title').textContent=meta[key][0];$('desc').textContent=meta[key][1];$('panels').innerHTML=panel(key);$('doCalc').onclick=calculators[key];}
const calculators={
avg(){let a=num('aP'),b=num('aQ'),c=num('bP'),d=num('bQ');if(!good(a,b)||c<0||d<0)return;let total=a*b+c*d,q=b+d;result('res',won(total/q),[['총 매수금액',won(total)],['총 수량',qty(q)],['평균단가',won(total/q)]])},
water(){let a=num('wA'),q=num('wQ'),p=num('wP'),t=num('wT');if(!good(a,q,p,t)||t>=a||t<=p){result('res','목표 평단을 다시 확인하세요');return}let x=q*(a-t)/(t-p);result('res',qty(x),[['추가 매수금액',won(x*p)],['기존 수량',qty(q)],['계산 후 평균단가',won((a*q+p*x)/(q+x))]])},
break(){let p=num('brP'),q=num('brQ');if(!good(p,q))return;result('res',won(p),[['평균 매수가',won(p)],['보유수량',qty(q)],['총 매수금액',won(p*q)]])},
profit(){let b=num('pB'),s=num('pS'),q=num('pQ');if(!good(b,s,q))return;let cost=b*q,rev=s*q,pro=rev-cost;result('res',won(pro),[['수익률',pct(pro/cost*100)],['매수금액',won(cost)],['매도금액',won(rev)]])},
target(){let b=num('tB'),r=num('tR');if(!good(b)||r<0)return;let p=b*(1+r/100);result('res',won(p),[['매수가',won(b)],['목표 수익률',pct(r)],['예상 주당 수익',won(p-b)]])},
stop(){let b=num('sB'),r=num('sR');if(!good(b)||r<0)return;let p=b*(1-r/100);result('res',won(p),[['매수가',won(b)],['허용 손실률',pct(r)],['주당 손실',won(b-p)]])},
position(){let c=num('poC'),p=num('poP');if(!good(c,p))return;let q=Math.floor(c/p);result('res',qty(q),[['사용금액',won(q*p)],['남는 금액',won(c-q*p)],['주당 가격',won(p)]])},
dividend(){let d=num('dD'),q=num('dQ'),p=num('dP');if(!good(d,q,p))return;result('res',won(d*q),[['주당 배당금',won(d)],['배당수익률',pct(d/p*100)],['보유수량',qty(q)]])},
trade(){let p=num('trP'),q=num('trQ');if(!good(p,q))return;result('res',won(p*q),[['주당 가격',won(p)],['수량',qty(q)],['총 매매금액',won(p*q)]])},
cagr(){let s=num('cS'),e=num('cE'),y=num('cY');if(!good(s,e,y))return;result('res',pct((Math.pow(e/s,1/y)-1)*100),[['시작 금액',won(s)],['현재 금액',won(e)],['기간',y+'년']])},
need(){let b=num('nB'),c=num('nC');if(!good(b,c))return;result('res',pct((b/c-1)*100),[['평균 매수가',won(b)],['현재 주가',won(c)],['필요 상승금액',won(b-c)]])},
loss(){let m=num('lM'),r=num('lR');if(!good(m)||r<0)return;result('res',won(m*r/100),[['투자금',won(m)],['허용 손실률',pct(r)],['손실 후 금액',won(m*(1-r/100))]])}};
document.querySelectorAll('.tool').forEach(x=>x.addEventListener('click',()=>{render(x.dataset.tool);$('tools').scrollIntoView({behavior:'smooth',block:'start'})}));
render('avg');
$('heroCalc').onclick=()=>{let b=Number($('heroBuy').value),c=Number($('heroCur').value);$('heroOut').textContent=good(b,c)?pct((b/c-1)*100)+' 올라야 본전':'값을 입력하세요'};
$('fontSize').onclick=()=>{document.body.classList.toggle('large');$('fontSize').textContent=document.body.classList.contains('large')?'글자 보통':'글자 크게'};
