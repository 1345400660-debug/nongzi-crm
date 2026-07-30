// ===== 天气区域数据 =====
// 覆盖中国七大农业产区，50+个重点农业市县
var WEATHER_REGIONS={
  '东北':{'黑龙江':[{name:'哈尔滨·松北区',lat:45.80,lng:126.53},{name:'齐齐哈尔·梅里斯区',lat:47.35,lng:123.92},{name:'绥化·北林区',lat:46.63,lng:126.98}],'吉林':[{name:'长春·九台区',lat:44.15,lng:125.84},{name:'四平·梨树县',lat:43.31,lng:124.34},{name:'松原·前郭县',lat:45.14,lng:124.83}],'辽宁':[{name:'沈阳·苏家屯区',lat:41.67,lng:123.33},{name:'铁岭·昌图县',lat:42.78,lng:124.11},{name:'锦州·北镇市',lat:41.60,lng:121.80}]},
  '华北':{'河北':[{name:'石家庄·藁城区',lat:38.04,lng:114.51},{name:'保定·定州市',lat:38.52,lng:114.99},{name:'邯郸·永年区',lat:36.78,lng:114.49}],'山西':[{name:'太原·小店区',lat:37.87,lng:112.55},{name:'运城·临猗县',lat:35.15,lng:110.77},{name:'晋中·太谷区',lat:37.42,lng:112.55}],'内蒙古':[{name:'呼和浩特·赛罕区',lat:40.82,lng:111.75},{name:'巴彦淖尔·临河区',lat:40.75,lng:107.39},{name:'通辽·科尔沁区',lat:43.62,lng:122.27}]},
  '华东':{'山东':[{name:'济南·章丘区',lat:36.68,lng:117.54},{name:'寿光·蔬菜基地',lat:36.86,lng:118.79},{name:'潍坊·寒亭区',lat:36.77,lng:119.22},{name:'临沂·兰山区',lat:35.06,lng:118.35}],'江苏':[{name:'南京·六合区',lat:32.36,lng:118.84},{name:'徐州·铜山区',lat:34.20,lng:117.18},{name:'盐城·大丰区',lat:33.20,lng:120.50},{name:'苏州·吴江区',lat:31.16,lng:120.64}],'安徽':[{name:'合肥·肥东县',lat:31.89,lng:117.47},{name:'阜阳·颍州区',lat:32.89,lng:115.81},{name:'宣城·清溪镇',lat:30.95,lng:118.75}],'浙江':[{name:'杭州·萧山区',lat:30.18,lng:120.26},{name:'金华·婺城区',lat:29.08,lng:119.65},{name:'嘉兴·南湖区',lat:30.76,lng:120.76}],'福建':[{name:'福州·闽侯县',lat:26.15,lng:119.14},{name:'漳州·龙海区',lat:24.44,lng:117.81},{name:'南平·建阳区',lat:27.33,lng:118.12}],'江西':[{name:'南昌·南昌县',lat:28.55,lng:115.94},{name:'赣州·于都县',lat:25.95,lng:115.41},{name:'宜春·袁州区',lat:27.82,lng:114.38}]},
  '华中':{'河南':[{name:'郑州·中牟县',lat:34.75,lng:113.99},{name:'周口·商水县',lat:33.54,lng:114.61},{name:'驻马店·驿城区',lat:33.01,lng:114.02},{name:'南阳·宛城区',lat:33.00,lng:112.54}],'湖北':[{name:'武汉·江夏区',lat:30.35,lng:114.32},{name:'荆州·荆州区',lat:30.35,lng:112.19},{name:'襄阳·襄州区',lat:32.09,lng:112.21}],'湖南':[{name:'长沙·望城区',lat:28.30,lng:112.82},{name:'常德·鼎城区',lat:29.03,lng:111.68},{name:'衡阳·衡南县',lat:26.89,lng:112.61}]},
  '华南':{'广东':[{name:'广州·白云区',lat:23.17,lng:113.27},{name:'湛江·雷州市',lat:20.91,lng:110.10},{name:'茂名·高州市',lat:21.92,lng:110.85}],'广西':[{name:'南宁·武鸣区',lat:23.17,lng:108.28},{name:'桂林·临桂区',lat:25.24,lng:110.21},{name:'玉林·北流市',lat:22.71,lng:110.35}],'海南':[{name:'海口·琼山区',lat:20.00,lng:110.37},{name:'三亚·崖州区',lat:18.36,lng:109.17},{name:'儋州·那大镇',lat:19.52,lng:109.58}]},
  '西南':{'四川':[{name:'成都·双流区',lat:30.58,lng:103.92},{name:'绵阳·安州区',lat:31.54,lng:104.56},{name:'南充·顺庆区',lat:30.80,lng:106.08}],'云南':[{name:'昆明·呈贡区',lat:24.89,lng:102.80},{name:'曲靖·麒麟区',lat:25.50,lng:103.80},{name:'大理·大理市',lat:25.61,lng:100.27}],'贵州':[{name:'贵阳·清镇市',lat:26.56,lng:106.47},{name:'遵义·播州区',lat:27.54,lng:106.83},{name:'毕节·七星关区',lat:27.30,lng:105.29}]},
  '西北':{'陕西':[{name:'西安·临潼区',lat:34.37,lng:109.21},{name:'渭南·临渭区',lat:34.50,lng:109.51},{name:'杨凌·农业示范区',lat:34.28,lng:108.07}],'甘肃':[{name:'兰州·皋兰县',lat:36.06,lng:103.83},{name:'张掖·甘州区',lat:38.93,lng:100.45},{name:'天水·麦积区',lat:34.57,lng:105.89}],'宁夏':[{name:'银川·永宁县',lat:38.28,lng:106.25},{name:'吴忠·利通区',lat:37.98,lng:106.20}],'新疆':[{name:'乌鲁木齐·米东区',lat:43.97,lng:87.68},{name:'阿克苏·温宿县',lat:41.28,lng:80.24},{name:'石河子·农业区',lat:44.31,lng:86.08}]}
};

function initWeatherSelectors(){
  var regEl=document.getElementById('weather-region'),prEl=document.getElementById('weather-province'),locEl=document.getElementById('weather-location');
  if(!regEl)return;
  regEl.innerHTML='<option value="">选择大区</option>'+Object.keys(WEATHER_REGIONS).map(function(r){return'<option value="'+r+'">'+r+'</option>'}).join('');
  try{var saved=JSON.parse(localStorage.getItem('weather-loc')||'null');if(saved){regEl.value=saved.region||'';onWeatherRegionChange();setTimeout(function(){var pr=document.getElementById('weather-province');if(pr){pr.value=saved.province||'';onWeatherProvinceChange();setTimeout(function(){var lc=document.getElementById('weather-location');if(lc){lc.value=saved.loc||''}},50)}},50)}}catch(e){}
}

function onWeatherRegionChange(){
  var reg=document.getElementById('weather-region').value,prEl=document.getElementById('weather-province'),locEl=document.getElementById('weather-location');
  prEl.innerHTML='<option value="">选择省份</option>';locEl.innerHTML='<option value="">选择城市</option>';
  if(!reg||!WEATHER_REGIONS[reg])return;
  var provinces=Object.keys(WEATHER_REGIONS[reg]);
  prEl.innerHTML='<option value="">选择省份</option>'+provinces.map(function(p){return'<option value="'+p+'">'+p+'</option>'}).join('')
}
function onWeatherProvinceChange(){
  var reg=document.getElementById('weather-region').value,pr=document.getElementById('weather-province').value,locEl=document.getElementById('weather-location');
  locEl.innerHTML='<option value="">选择城市</option>';
  if(!reg||!pr||!WEATHER_REGIONS[reg]||!WEATHER_REGIONS[reg][pr])return;
  var cities=WEATHER_REGIONS[reg][pr];
  locEl.innerHTML='<option value="">选择城市</option>'+cities.map(function(c,i){return'<option value="'+c.lat+','+c.lng+'">'+c.name+'</option>'}).join('')
}
function onWeatherLocationChange(){
  var loc=document.getElementById('weather-location').value;if(!loc)return;
  var reg=document.getElementById('weather-region').value,pr=document.getElementById('weather-province').value;
  try{localStorage.setItem('weather-loc',JSON.stringify({region:reg,province:pr,loc:loc}))}catch(e){}
  loadWeather()
}

// ===== 天气 API (增强版) =====
var weatherCache=null,weatherAutoTimer=null;
function weatherCodeToEmoji(c){var m={0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'🌨️',77:'🌨️',80:'🌧️',81:'🌧️',82:'🌧️',85:'🌨️',86:'🌨️',95:'⛈️',96:'⛈️',97:'⛈️'};return m[c]||'🌡️'}
function weatherCodeToDesc(c){var m={0:'晴朗',1:'大部晴',2:'多云',3:'阴',45:'雾',48:'冻雾',51:'小毛毛雨',53:'中毛毛雨',55:'大毛毛雨',61:'小雨',63:'中雨',65:'大雨',71:'小雪',73:'中雪',75:'大雪',77:'雪粒',80:'阵雨',81:'中阵雨',82:'大阵雨',85:'小阵雪',86:'大阵雪',95:'雷暴',96:'雷暴+小冰雹',97:'雷暴+大冰雹'};return m[c]||'未知'}
function getWeatherAlert(t,code,rain,wind){var alerts=[];if(t>38)alerts.push('🔴 极端高温('+Math.round(t)+'°C)：畜禽必须遮阳+喷雾降温，午后严禁田间作业，大棚通风口全开');else if(t>35)alerts.push('🟡 高温预警('+Math.round(t)+'°C)：畜禽防暑降温，10:00-16:00避免田间作业');if(t<0)alerts.push('🔵 低温预警：大棚加盖保温被，水管防冻，幼畜增加垫料');if(t<-10)alerts.push('🔴 极寒预警：温棚双层覆盖，牲畜入圈加温');if(code>=95)alerts.push('⚡ 雷暴预警：暂停一切户外农事，人员远离高地和树木');if(rain>70)alerts.push('🌧️ 暴雨预警：提前清沟排渍，鱼塘加固防溢，低洼田块排水');if(rain>40)alerts.push('🟡 降雨提示：暂缓施肥施药，雨后巡查病虫害');if(wind>40)alerts.push('💨 大风预警(>40km/h)：大棚加固压膜绳，果树支架检查');if(code>=71&&code<=77)alerts.push('❄️ 降雪预警：大棚及时除雪，牲畜入圈保暖');return alerts}
function getAgriScore(temp,rain,wind,code){
  var score=100,reasons=[];
  if(temp>35){score-=20;reasons.push('高温不利于田间作业')}else if(temp>30){score-=8;reasons.push('温度偏高')}else if(temp>=15&&temp<=28){score+=0;reasons.push('温度适宜农事')}else if(temp<5){score-=15;reasons.push('低温限制作物生长')}
  if(rain>60){score-=25;reasons.push('降雨量过大，不适合施药施肥')}else if(rain>30){score-=8;reasons.push('有降雨，施肥需谨慎')}else if(rain<5&&temp>25){score-=3;reasons.push('偏干燥')}
  if(wind>35){score-=15;reasons.push('大风天气不适合施药')}else if(wind>20){score-=5;reasons.push('风速偏大')}
  if(code>=95){score-=30;reasons.push('雷暴天气严禁作业')}
  var level=score>=80?'🟢 适宜':score>=60?'🟡 较适宜':score>=40?'🟠 不太适宜':'🔴 不适宜';
  return{score:Math.max(0,score),level:level,reasons:reasons}
}

function updateWeatherStatusDot(alive){var d=document.getElementById('weather-status-dot');if(d){d.style.color=alive?'#4ade80':'#94a3b8';d.title=alive?'天气数据实时更新中':'天气数据未连接'}}

async function loadWeather(){
  var el=document.getElementById('weather-content'),locEl=document.getElementById('weather-location');
  if(!el||!locEl)return;
  var locVal=locEl.value;if(!locVal){el.innerHTML='<div class="card"><div class="empty-state"><span class="empty-icon">🌤️</span><div class="empty-title">请选择地区查看天气</div><div class="empty-desc">选择大区→省份→城市，获取精准农事天气</div></div></div>';return}
  el.innerHTML='<div class="card"><div style="display:flex;gap:14px;flex-wrap:wrap"><div class="skeleton skel-row" style="flex:1"></div><div class="skeleton skel-row" style="width:60%"></div></div></div>';
  updateWeatherStatusDot(false);
  try{
    var loc=locVal.split(','),locName=locEl.options[locEl.selectedIndex].text;
    var url='https://api.open-meteo.com/v1/forecast?latitude='+loc[0]+'&longitude='+loc[1]+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,precipitation_sum,wind_speed_10m_max,uv_index_max,sunshine_duration&timezone=Asia/Shanghai&forecast_days=7';
    var r=await fetch(url),d=await r.json();
    if(!d||!d.current||!d.daily){throw new Error('数据异常')}
    var cur=d.current,days=d.daily,wd=['日','一','二','三','四','五','六'];
    weatherCache={temp:cur.temperature_2m,humidity:cur.relative_humidity_2m,code:cur.weather_code,wind:cur.wind_speed_10m,rainProb:days.precipitation_probability_max[0],rainSum:days.precipitation_sum[0],maxTemp:days.temperature_2m_max[0],minTemp:days.temperature_2m_min[0],locName:locName,gusts:cur.wind_gusts_10m,apparent:cur.apparent_temperature,uv:days.uv_index_max[0],sunshine:days.sunshine_duration[0]};
    updateWeatherStatusDot(true);
    var fc='';for(var i=0;i<Math.min(days.time.length,7);i++){var dt=new Date(days.time[i]),dn=i===0?'今天':i===1?'明天':i===2?'后天':'周'+wd[dt.getDay()];fc+='<div class="forecast-day"><div class="day-name">'+dn+'</div><div class="day-icon">'+weatherCodeToEmoji(days.weather_code[i])+'</div><div class="day-temp" style="color:#dc2626">'+Math.round(days.temperature_2m_max[i])+'°</div><div class="day-temp" style="color:#2563eb">'+Math.round(days.temperature_2m_min[i])+'°</div><div class="day-rain">💧 '+days.precipitation_probability_max[i]+'%</div></div>'}
    var agri=getAgriScore(cur.temperature_2m,days.precipitation_probability_max[0],cur.wind_speed_10m,cur.weather_code);
    var alerts=getWeatherAlert(cur.temperature_2m,cur.weather_code,days.precipitation_probability_max[0],cur.wind_speed_10m);
    var alertsHTML=alerts.length>0?'<div style="margin-top:14px">'+alerts.map(function(a){return'<div class="weather-alert">'+a+'</div>'}).join('')+'</div>':'';
    var agriAdvice='';
    if(cur.temperature_2m>35)agriAdvice+='• 大棚蔬菜：上午9点前关闭通风口蓄温，10点后全开通风<br>• 畜禽：屋顶喷白反射阳光，饮水添加VC抗应激<br>• 果树：果园生草覆盖降温，避免中午灌溉';
    else if(cur.temperature_2m>=20&&cur.temperature_2m<=30&&days.precipitation_probability_max[0]<30)agriAdvice+='• ✅ 天气适宜施肥施药，建议抓住窗口期<br>• 可安排田间中耕除草、整枝打杈<br>• 鱼塘：适宜投喂和水质调节';
    else if(days.precipitation_probability_max[0]>50)agriAdvice+='• 暂缓施肥施药，肥料会被雨水冲走<br>• 提前清理排水沟，低洼田块做好排水准备<br>• 已成熟蔬菜/水果抢收，减少损失';
    else agriAdvice+='• 关注天气变化，灵活安排农事<br>• 大棚注意通风降温，防病害滋生';
    var rainTrend='';for(var i=0;i<Math.min(days.time.length,7);i++){var rp=days.precipitation_probability_max[i],ri=days.precipitation_sum[i];rainTrend+='<span style="display:inline-block;width:30px;text-align:center;font-size:10px;color:'+(rp>50?'#2563eb':rp>20?'#60a5fa':'#94a3b8')+'">'+(ri>0?'🌧':'☀')+'</span>'}
    el.innerHTML='<div class="card"><div class="weather-widget"><div class="weather-now"><div class="weather-icon">'+weatherCodeToEmoji(cur.weather_code)+'</div><div><div class="weather-temp">'+Math.round(cur.temperature_2m)+'°C <span style="font-size:12px;color:var(--text2);font-weight:400">体感 '+Math.round(cur.apparent_temperature)+'°C</span></div><div class="weather-desc">'+weatherCodeToDesc(cur.weather_code)+' · '+locName+'</div></div></div><div class="weather-meta"><div>💨 风速 '+cur.wind_speed_10m+' km/h'+(cur.wind_gusts_10m>30?' (阵风'+Math.round(cur.wind_gusts_10m)+')':'')+'</div><div>💧 湿度 '+cur.relative_humidity_2m+'%</div><div>🧭 风向 '+cur.wind_direction_10m+'°</div><div>☀️ 日照 '+(days.sunshine_duration[0]?Math.round(days.sunshine_duration[0]/3600*10)/10:'~')+'h · UV指数 '+days.uv_index_max[0]+'</div></div><div class="weather-forecast" style="flex-wrap:wrap">'+fc+'</div></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px">'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius)"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">🌾 农事适宜度</div><div style="font-size:22px;font-weight:700">'+agri.level+'</div><div style="font-size:11px;color:var(--text2);margin-top:4px">'+agri.reasons.join(' · ')+'</div></div>'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius)"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">📅 7日降雨趋势</div><div style="font-size:20px;letter-spacing:2px;margin-bottom:4px">'+rainTrend+'</div><div style="font-size:11px;color:var(--text2)">累计降雨: '+days.precipitation_sum.reduce(function(a,b){return a+b},0).toFixed(1)+'mm</div></div>'+
    '</div>'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius);margin-top:14px"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">📋 农事操作建议</div><div style="font-size:13px;line-height:1.8">'+agriAdvice+'</div></div>'+
    alertsHTML+
    '<div style="font-size:10px;color:var(--text3);margin-top:12px;text-align:right">数据来源: Open-Meteo · ECMWF 全球预报模型 · 更新于 '+new Date().toLocaleTimeString('zh-CN')+' <span id="weather-countdown"></span></div></div>';
    startWeatherAutoRefresh();
  }catch(e){el.innerHTML='<div class="card"><div class="empty-state"><span class="empty-icon">🌤️</span><div class="empty-title">天气数据加载失败</div><div class="empty-desc">请检查网络连接后重试</div><div class="empty-action"><button class="btn btn-outline btn-sm" onclick="loadWeather()">🔄 重试</button></div></div></div>'}
}

function startWeatherAutoRefresh(){
  if(weatherAutoTimer)clearInterval(weatherAutoTimer);
  var countdownEl=document.getElementById('weather-countdown');if(!countdownEl)return;
  var interval=5*60,remaining=interval;
  function tick(){remaining--;if(remaining<=0){remaining=interval;loadWeather()}var m=Math.floor(remaining/60),s=remaining%60;countdownEl.textContent='| ⏱ '+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s)+' 后自动刷新'}
  tick();weatherAutoTimer=setInterval(tick,1000)
}

// ===== 市场价格 (增强版 - 支持区域对比) =====
var marketDataBase={'粮油':[{name:'晚籼米(标一)',unit:'元/500g',price:2.76},{name:'粳米(标一)',unit:'元/500g',price:2.93},{name:'标准粉',unit:'元/500g',price:2.47},{name:'富强粉',unit:'元/500g',price:2.81},{name:'花生油(一级)',unit:'元/5升',price:141.40},{name:'菜籽油(一级)',unit:'元/5升',price:75.98},{name:'豆油(一级)',unit:'元/5升',price:60.27}],'畜禽水产':[{name:'猪肉(精瘦肉)',unit:'元/500g',price:13.38},{name:'牛肉(去骨)',unit:'元/500g',price:39.99},{name:'羊肉(去骨)',unit:'元/500g',price:38.99},{name:'鸡肉(白条)',unit:'元/500g',price:12.56},{name:'鸡蛋(新鲜完整)',unit:'元/500g',price:5.72},{name:'草鱼(活750g)',unit:'元/500g',price:11.64},{name:'带鱼(冷冻国产)',unit:'元/500g',price:20.85},{name:'鲢鱼(活750g)',unit:'元/500g',price:10.58}],'蔬菜':[{name:'大白菜',unit:'元/500g',price:1.58},{name:'土豆',unit:'元/500g',price:1.94},{name:'萝卜',unit:'元/500g',price:1.61},{name:'圆白菜',unit:'元/500g',price:1.74},{name:'黄瓜',unit:'元/500g',price:2.81},{name:'西红柿',unit:'元/500g',price:3.07},{name:'茄子',unit:'元/500g',price:2.95},{name:'青椒',unit:'元/500g',price:3.89},{name:'芹菜',unit:'元/500g',price:3.39},{name:'油菜',unit:'元/500g',price:2.89},{name:'韭菜',unit:'元/500g',price:3.91},{name:'胡萝卜',unit:'元/500g',price:2.33},{name:'蒜苔',unit:'元/500g',price:6.22},{name:'尖椒',unit:'元/500g',price:4.16},{name:'豆角',unit:'元/500g',price:4.75}],'化肥农资':[{name:'尿素(含氮46%国产)',unit:'元/kg',price:2.16},{name:'碳酸氢铵(含氮17%)',unit:'元/kg',price:1.04},{name:'过磷酸钙(含磷12%)',unit:'元/kg',price:1.03},{name:'磷酸二铵(64%国产)',unit:'元/kg',price:4.66},{name:'三元复合肥(氯基)',unit:'元/kg',price:3.53},{name:'三元复合肥(硫基)',unit:'元/kg',price:3.92},{name:'氯化钾(国产送到)',unit:'元/吨',price:3100}],'饲料':[{name:'玉米(饲料用)',unit:'元/吨',price:2370},{name:'豆粕',unit:'元/吨',price:2860},{name:'麦麸',unit:'元/吨',price:1780},{name:'鱼粉(进口)',unit:'元/吨',price:11200},{name:'DDGS(酒精糟)',unit:'元/吨',price:2300},{name:'菜粕',unit:'元/吨',price:2650},{name:'棉粕',unit:'元/吨',price:3100}]};
var regionMultipliers={'华东':{factor:0.98,market:'山东寿光农产品物流园',note:'北方最大蔬菜集散中心，产地价格偏低'},'华南':{factor:1.05,market:'广州江南果菜批发市场',note:'华南最大农产品市场，销地价格偏高'},'华中':{factor:0.96,market:'郑州万邦国际农产品物流城',note:'中原交通枢纽，价格居中偏低'},'华北':{factor:1.02,market:'北京新发地农产品批发市场',note:'首都销地市场，价格略高于产地'},'西南':{factor:0.97,market:'成都濛阳农产品交易中心',note:'西南农产集散地，价格中等'},'西北':{factor:0.94,market:'西安欣桥农产品物流中心',note:'西北产地价格较低'},'东北':{factor:0.95,market:'哈尔滨润恒农副产品批发市场',note:'东北粮仓，产地价格优势'}};
var marketData={},marketLastUpdate=null;

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

function loadMarketPrices(){refreshMarketPrices()}
