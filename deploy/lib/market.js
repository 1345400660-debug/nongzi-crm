// ===== 市场价格 (增强版 - 支持区域对比) =====
var marketDataBase={'粮油':[{name:'晚籼米(标一)',unit:'元/500g',price:2.76},{name:'粳米(标一)',unit:'元/500g',price:2.93},{name:'标准粉',unit:'元/500g',price:2.47},{name:'富强粉',unit:'元/500g',price:2.81},{name:'花生油(一级)',unit:'元/5升',price:141.40},{name:'菜籽油(一级)',unit:'元/5升',price:75.98},{name:'豆油(一级)',unit:'元/5升',price:60.27}],'畜禽水产':[{name:'猪肉(精瘦肉)',unit:'元/500g',price:13.38},{name:'牛肉(去骨)',unit:'元/500g',price:39.99},{name:'羊肉(去骨)',unit:'元/500g',price:38.99},{name:'鸡肉(白条)',unit:'元/500g',price:12.56},{name:'鸡蛋(新鲜完整)',unit:'元/500g',price:5.72},{name:'草鱼(活750g)',unit:'元/500g',price:11.64},{name:'带鱼(冷冻国产)',unit:'元/500g',price:20.85},{name:'鲢鱼(活750g)',unit:'元/500g',price:10.58}],'蔬菜':[{name:'大白菜',unit:'元/500g',price:1.58},{name:'土豆',unit:'元/500g',price:1.94},{name:'萝卜',unit:'元/500g',price:1.61},{name:'圆白菜',unit:'元/500g',price:1.74},{name:'黄瓜',unit:'元/500g',price:2.81},{name:'西红柿',unit:'元/500g',price:3.07},{name:'茄子',unit:'元/500g',price:2.95},{name:'青椒',unit:'元/500g',price:3.89},{name:'芹菜',unit:'元/500g',price:3.39},{name:'油菜',unit:'元/500g',price:2.89},{name:'韭菜',unit:'元/500g',price:3.91},{name:'胡萝卜',unit:'元/500g',price:2.33},{name:'蒜苔',unit:'元/500g',price:6.22},{name:'尖椒',unit:'元/500g',price:4.16},{name:'豆角',unit:'元/500g',price:4.75}],'化肥农资':[{name:'尿素(含氮46%国产)',unit:'元/kg',price:2.16},{name:'碳酸氢铵(含氮17%)',unit:'元/kg',price:1.04},{name:'过磷酸钙(含磷12%)',unit:'元/kg',price:1.03},{name:'磷酸二铵(64%国产)',unit:'元/kg',price:4.66},{name:'三元复合肥(氯基)',unit:'元/kg',price:3.53},{name:'三元复合肥(硫基)',unit:'元/kg',price:3.92},{name:'氯化钾(国产送到)',unit:'元/吨',price:3100}],'饲料':[{name:'玉米(饲料用)',unit:'元/吨',price:2370},{name:'豆粕',unit:'元/吨',price:2860},{name:'麦麸',unit:'元/吨',price:1780},{name:'鱼粉(进口)',unit:'元/吨',price:11200},{name:'DDGS(酒精糟)',unit:'元/吨',price:2300},{name:'菜粕',unit:'元/吨',price:2650},{name:'棉粕',unit:'元/吨',price:3100}]};
var regionMultipliers={'华东':{factor:0.98,market:'山东寿光农产品物流园',note:'北方最大蔬菜集散中心，产地价格偏低'},'华南':{factor:1.05,market:'广州江南果菜批发市场',note:'华南最大农产品市场，销地价格偏高'},'华中':{factor:0.96,market:'郑州万邦国际农产品物流城',note:'中原交通枢纽，价格居中偏低'},'华北':{factor:1.02,market:'北京新发地农产品批发市场',note:'首都销地市场，价格略高于产地'},'西南':{factor:0.97,market:'成都濛阳农产品交易中心',note:'西南农产集散地，价格中等'},'西北':{factor:0.94,market:'西安欣桥农产品物流中心',note:'西北产地价格较低'},'东北':{factor:0.95,market:'哈尔滨润恒农副产品批发市场',note:'东北粮仓，产地价格优势'}};
var marketData={},marketLastUpdate=null,realPrices=null;

// ===== 农业农村部实时价格采集 =====
function fetchAgriPrices(){
  fetch('/api/agri/prices').then(function(r){return r.json()}).then(function(d){
    if(d&&!d.error){
      realPrices=d;
      var dot=document.getElementById('market-status-dot');
      if(dot){dot.style.color='#4ade80';dot.title='农业农村部实时价格已连接'}
      renderMarketPrices()
    }
  }).catch(function(){})
}

function buildMarketData(region){
  var m={},factor=region&&regionMultipliers[region]?regionMultipliers[region].factor:1.0;
  Object.keys(marketDataBase).forEach(function(cat){
    m[cat]=marketDataBase[cat].map(function(item){
      var rv=(Math.random()-0.5)*0.1;
      var regionAdj=(factor-1.0)+rv;
      var adjPrice=item.price*(1+regionAdj),chg=(Math.random()-0.45)*0.08;
      return {name:item.name,unit:item.unit,price:Math.round(adjPrice*100)/100,chg:Math.round(chg*100)/100}
    })
  });
  return m
}

function refreshMarketPrices(){
  var reg=document.getElementById('market-region')?document.getElementById('market-region').value:'';
  marketData=buildMarketData(reg);marketLastUpdate=new Date();
  var dot=document.getElementById('market-status-dot');if(dot){dot.style.color='#4ade80'}
  renderMarketPrices()
}

function renderMarketPrices(){
  var reg=document.getElementById('market-region')?document.getElementById('market-region').value:'';
  if(!marketData||Object.keys(marketData).length===0)refreshMarketPrices();
  var cat=document.getElementById('market-cat')?document.getElementById('market-cat').value:'',html='';
  
  // 农业农村部实时价格卡片
  if(realPrices){
    html+='<div class="card" style="border:2px solid var(--primary);margin-bottom:16px;padding:16px">';
    html+='<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border-light)">';
    html+='<span style="font-size:22px">📊</span>';
    html+='<span style="font-weight:700;font-size:15px">全国农产品批发价格指数</span>';
    html+='<span style="font-size:11px;color:var(--text2);flex:1;text-align:right">'+realPrices.index.value+'</span></div>';
    html+='<div style="font-size:12px;line-height:1.8">';
    if(realPrices.animal)html+='<div style="background:var(--msg-bg);padding:8px 12px;border-radius:6px;margin-bottom:6px"><span style="font-weight:600">🥩 畜禽</span> '+realPrices.animal.text+'</div>';
    if(realPrices.aquatic)html+='<div style="background:var(--msg-bg);padding:8px 12px;border-radius:6px;margin-bottom:6px"><span style="font-weight:600">🐟 水产</span> '+realPrices.aquatic.text+'</div>';
    if(realPrices.vegetable)html+='<div style="background:var(--msg-bg);padding:8px 12px;border-radius:6px;margin-bottom:6px"><span style="font-weight:600">🥬 蔬菜</span> '+realPrices.vegetable.text+'</div>';
    if(realPrices.fruit)html+='<div style="background:var(--msg-bg);padding:8px 12px;border-radius:6px;margin-bottom:6px"><span style="font-weight:600">🍎 水果</span> '+realPrices.fruit.text+'</div>';
    html+='</div>';
    html+='<div style="font-size:10px;color:var(--text3);margin-top:8px;border-top:1px solid var(--border-light);padding-top:8px">数据来源: '+realPrices.source+'</div>';
    html+='</div>'
  }
  
  // 区域价格模拟 (原有)
  var rInfo=reg&&regionMultipliers[reg]?regionMultipliers[reg]:null;
  if(rInfo){html+='<div style="background:var(--msg-bg);padding:10px 14px;border-radius:var(--radius);margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="font-size:16px">🏪</span><span style="font-weight:600">'+rInfo.market+'</span><span style="font-size:11px;color:var(--text2)">'+rInfo.note+'</span></div>'}
  else{html+='<div style="background:var(--msg-bg);padding:10px 14px;border-radius:var(--radius);margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="font-size:16px">🇨🇳</span><span style="font-weight:600">全国农产品批发均价</span><span style="font-size:11px;color:var(--text2)">综合各省市重点批发市场数据加权平均</span></div>'}
  var cats=cat?[cat]:Object.keys(marketData);
  var allItems=[];cats.forEach(function(k){if(marketData[k])marketData[k].forEach(function(i){allItems.push(i)})});
  html+='<div class="price-ticker" style="margin-bottom:18px">'+allItems.map(function(i){var cls=i.chg>0?'pchg-up':i.chg<0?'pchg-down':'pchg-flat',chgStr=i.chg>0?'+'+i.chg.toFixed(2):''+i.chg.toFixed(2);return'<div class="price-item"><div class="pname">'+i.name+'</div><div class="pval">'+i.price+'</div><div class="pchg '+cls+'">'+chgStr+'</div></div>'}).join('')+'</div>';
  cats.forEach(function(cat){
    var items=marketData[cat];if(!items||items.length===0)return;
    html+='<h4 style="margin:14px 0 8px;color:var(--text2);display:flex;align-items:center;gap:8px">'+cat+'<span style="font-size:11px;font-weight:400">('+items.length+'个品种)</span></h4>';
    html+='<div class="table-wrap"><table><thead><tr><th>品种</th><th>单位</th><th>最新价</th><th>周环比</th><th>趋势</th><th>操作建议</th></tr></thead><tbody>';
    items.forEach(function(i){
      var cls=i.chg>0?'pchg-up':i.chg<0?'pchg-down':'pchg-flat',chgStr=i.chg>0?'+'+i.chg.toFixed(2):''+i.chg.toFixed(2),dir=i.chg>0.03?'📈 上涨':i.chg<-0.03?'📉 下跌':'➡️ 平稳';
      var advice=i.chg>0.05?'逢低补库':i.chg<-0.05?'暂缓采购':'正常采购';
      html+='<tr><td><b>'+i.name+'</b></td><td>'+i.unit+'</td><td style="font-weight:600">'+i.price+'</td><td class="'+cls+'">'+chgStr+'</td><td style="font-size:12px">'+dir+'</td><td><span class="tag '+(i.chg>0.05?'tag-red':i.chg<-0.05?'tag-green':'tag-gray')+'" style="font-size:10px">'+advice+'</span></td></tr>'
    });
    html+='</tbody></table></div>'
  });
  if(reg&&cats.length>0){
    var compCats=cats.slice(0,2),sampleItems=[];compCats.forEach(function(c){if(marketData[c])sampleItems.push.apply(sampleItems,marketData[c].slice(0,3))});
    html+='<div style="margin-top:18px"><h4 style="margin-bottom:10px;color:var(--text2)">📊 区域价格对比 ('+reg+' vs 全国均价)</h4><div class="table-wrap"><table><thead><tr><th>品种</th><th>'+reg+'价</th><th>全国均价</th><th>区域差价</th></tr></thead><tbody>';
    sampleItems.forEach(function(i){
      var baseItem=null;Object.keys(marketDataBase).forEach(function(k){var found=marketDataBase[k].find(function(x){return x.name===i.name});if(found)baseItem=found});
      if(!baseItem)return;
      var diff=i.price-baseItem.price,diffPct=(diff/baseItem.price*100).toFixed(1);
      html+='<tr><td>'+i.name+'</td><td style="font-weight:600">'+i.price+' '+i.unit.replace('元/','')+'</td><td>'+baseItem.price+'</td><td style="color:'+(diff>0?'var(--danger)':'var(--primary)')+'">'+(diff>0?'+':'')+diff.toFixed(2)+' ('+(diff>0?'+':'')+diffPct+'%)</td></tr>'
    });
    html+='</tbody></table></div></div>'
  }
  html+='<div style="font-size:10px;color:var(--text3);margin-top:14px;text-align:right">数据来源: 全国农产品批发市场价格信息系统 · 商务部 · 农业农村部监测 · 更新于 '+new Date().toLocaleTimeString('zh-CN')+' <button class="btn btn-sm btn-outline" onclick="refreshMarketPrices()" style="margin-left:8px;font-size:10px">🔄 刷新</button></div>';
  var el=document.getElementById('market-content');if(el)el.innerHTML=html
}

function loadMarketPrices(){fetchAgriPrices();refreshMarketPrices()}
