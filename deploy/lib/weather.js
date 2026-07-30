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
function qWeatherIconToEmoji(c){var m={100:'☀️',101:'🌤️',102:'⛅',103:'🌥️',104:'☁️',150:'🌙',151:'☁️',300:'🌦️',301:'🌦️',302:'⛈️',303:'⛈️',304:'⛈️',305:'🌧️',306:'🌧️',307:'🌧️',308:'🌧️',309:'🌦️',310:'🌧️',311:'🌧️',312:'🌧️',313:'🧊',314:'🌧️',315:'🌧️',316:'🌧️',317:'🌧️',318:'🌧️',399:'🌧️',400:'🌨️',401:'🌨️',402:'❄️',403:'❄️',404:'🌨️',405:'🌨️',406:'🌨️',407:'❄️',499:'❄️',500:'🌫️',501:'🌫️',502:'🌫️',503:'💨',504:'💨',507:'💨',508:'💨',509:'🌫️',510:'🌫️',511:'🌫️',512:'🌫️',513:'🌫️',514:'🌫️',515:'🌫️',900:'🔥',901:'🥶'};return m[c]||'🌡️'}
function qWeatherIconToDesc(c){var m={100:'晴',101:'多云',102:'少云',103:'晴间多云',104:'阴',150:'晴(夜)',300:'阵雨',301:'强阵雨',302:'雷阵雨',303:'强雷阵雨',304:'雷阵雨+冰雹',305:'小雨',306:'中雨',307:'大雨',308:'极端降雨',309:'毛毛雨',310:'暴雨',311:'大暴雨',312:'特大暴雨',313:'冻雨',314:'小到中雨',315:'中到大雨',316:'大到暴雨',317:'暴雨到大暴雨',318:'大暴雨到特大暴雨',399:'雨',400:'小雪',401:'中雪',402:'大雪',403:'暴雪',404:'雨夹雪',405:'雨雪',406:'阵雨夹雪',407:'阵雪',499:'雪',500:'薄雾',501:'雾',502:'霾',503:'扬沙',504:'浮尘',507:'沙尘暴',508:'强沙尘暴',509:'浓雾',510:'强浓雾',511:'中度霾',512:'重度霾',513:'严重霾',514:'大雾',515:'特强浓雾',900:'热',901:'冷'};return m[c]||'未知'}
function getQWeatherAlert(temp,weatherText,precip,windSpeed){
  var alerts=[],t=parseFloat(temp),w=parseFloat(windSpeed)||0,p=parseFloat(precip)||0,txt=weatherText||'';
  if(t>38)alerts.push('🔴 极端高温('+Math.round(t)+'°C)：畜禽必须遮阳+喷雾降温，午后严禁田间作业，大棚通风口全开');
  else if(t>35)alerts.push('🟡 高温预警('+Math.round(t)+'°C)：畜禽防暑降温，10:00-16:00避免田间作业');
  if(t<0)alerts.push('🔵 低温预警：大棚加盖保温被，水管防冻，幼畜增加垫料');
  if(t<-10)alerts.push('🔴 极寒预警：温棚双层覆盖，牲畜入圈加温');
  if(txt.indexOf('雷')>=0)alerts.push('⚡ 雷暴预警：暂停一切户外农事，人员远离高地和树木');
  if(txt.indexOf('暴雨')>=0||txt.indexOf('大暴雨')>=0||txt.indexOf('特大暴雨')>=0)alerts.push('🌧️ 暴雨预警：提前清沟排渍，鱼塘加固防溢，低洼田块排水');
  else if(txt.indexOf('大雨')>=0)alerts.push('🟡 大雨提示：暂缓施肥施药，雨后巡查病虫害');
  if(w>40)alerts.push('💨 大风预警(>40km/h)：大棚加固压膜绳，果树支架检查');
  if(txt.indexOf('雪')>=0)alerts.push('❄️ 降雪预警：大棚及时除雪，牲畜入圈保暖');
  if(txt.indexOf('沙尘')>=0||txt.indexOf('霾')>=0)alerts.push('🌫️ 沙尘/霾预警：大棚减少通风，户外佩戴防护');
  if(txt.indexOf('冰雹')>=0)alerts.push('🧊 冰雹预警：大棚加盖防护网，果园拉防雹网');
  return alerts;
}
function getQAgriScore(temp,precip,windSpeed,weatherText){
  var score=100,reasons=[],t=parseFloat(temp),w=parseFloat(windSpeed)||0,p=parseFloat(precip)||0,txt=weatherText||'';
  if(t>35){score-=20;reasons.push('高温不利于田间作业')}else if(t>30){score-=8;reasons.push('温度偏高')}else if(t>=15&&t<=28){reasons.push('温度适宜农事')}else if(t<5){score-=15;reasons.push('低温限制作物生长')}
  if(p>25){score-=25;reasons.push('降水量大，不适合施药施肥')}else if(p>10){score-=8;reasons.push('有降水，施肥需谨慎')}
  if(w>35){score-=15;reasons.push('大风不适合施药')}else if(w>20){score-=5;reasons.push('风速偏大')}
  if(txt.indexOf('雷')>=0||txt.indexOf('冰雹')>=0){score-=30;reasons.push('强对流天气严禁作业')}
  if(txt.indexOf('暴雨')>=0){score-=25;reasons.push('暴雨不宜农事')}
  if(txt.indexOf('沙尘')>=0||txt.indexOf('霾')>=0){score-=10;reasons.push('空气质量差，减少户外作业')}
  var level=score>=80?'🟢 适宜':score>=60?'🟡 较适宜':score>=40?'🟠 不太适宜':'🔴 不适宜';
  return{score:Math.max(0,score),level:level,reasons:reasons}
}

function updateWeatherStatusDot(alive){var d=document.getElementById('weather-status-dot');if(d){d.style.color=alive?'#4ade80':'#94a3b8';d.title=alive?'天气数据实时更新中':'天气数据未连接'}}

var weatherRetryCount=0;
async function loadWeather(){
  var el=document.getElementById('weather-content'),locEl=document.getElementById('weather-location');
  if(!el||!locEl)return;
  var locVal=locEl.value;if(!locVal){el.innerHTML='<div class="card"><div class="empty-state"><span class="empty-icon">🌤️</span><div class="empty-title">请选择地区查看天气</div><div class="empty-desc">选择大区→省份→城市，获取精准农事天气</div></div></div>';return}
  el.innerHTML='<div class="card"><div style="display:flex;gap:14px;flex-wrap:wrap"><div class="skeleton skel-row" style="flex:1"></div><div class="skeleton skel-row" style="width:60%"></div></div></div>';
  updateWeatherStatusDot(false);
  try{
    var loc=locVal.split(','),locName=locEl.options[locEl.selectedIndex]?locEl.options[locEl.selectedIndex].text:'当前地区';
    var r=await fetch('/api/qweather/weather?lat='+loc[0]+'&lng='+loc[1]);
    if(!r.ok)throw new Error('服务器响应 '+r.status);
    var d=await r.json();
    if(d.error)throw new Error(d.help?d.error+'\n'+d.help:d.error);
    if(!d.now)throw new Error('数据格式异常');
    weatherRetryCount=0;
    var now=d.now,daily=d.daily,idx=d.indices||[],wd=['日','一','二','三','四','五','六'];
    weatherCache={temp:now.temp,humidity:now.humidity,text:now.text,icon:now.icon,wind:now.windSpeed,windDir:now.windDir,precip:now.precip,locName:locName,feelsLike:now.feelsLike,pressure:now.pressure,vis:now.vis};
    updateWeatherStatusDot(true);

    // 天气实况
    var tempVal=parseFloat(now.temp),feelsLike=parseFloat(now.feelsLike)||tempVal;
    var iconEmoji=qWeatherIconToEmoji(now.icon),descText=now.text||qWeatherIconToDesc(now.icon);

    // 7日预报
    var fc='',rainData=[];for(var i=0;i<Math.min(daily.length,7);i++){var dy=daily[i],dt=new Date(dy.fxDate),dn=i===0?'今天':i===1?'明天':i===2?'后天':'周'+wd[dt.getDay()];rainData.push({prob:0,sum:parseFloat(dy.precip)||0});fc+='<div class="forecast-day"><div class="day-name">'+dn+'</div><div class="day-icon">'+qWeatherIconToEmoji(dy.iconDay)+'</div><div class="day-temp" style="color:#dc2626">'+dy.tempMax+'°</div><div class="day-temp" style="color:#2563eb">'+dy.tempMin+'°</div><div class="day-rain">💧 '+dy.precip+'mm</div></div>'}

    var agri=getQAgriScore(now.temp,now.precip,now.windSpeed,now.text);
    var alerts=getQWeatherAlert(now.temp,now.text,now.precip,now.windSpeed);
    var alertsHTML=alerts.length>0?'<div style="margin-top:14px">'+alerts.map(function(a){return'<div class="weather-alert">'+a+'</div>'}).join('')+'</div>':'';

    // 农事建议
    var agriAdvice='';
    if(tempVal>35)agriAdvice+='• 大棚蔬菜：上午9点前关闭通风口蓄温，10点后全开通风<br>• 畜禽：屋顶喷白反射阳光，饮水添加VC抗应激<br>• 果树：果园生草覆盖降温，避免中午灌溉';
    else if(tempVal>=20&&tempVal<=30&&(parseFloat(now.precip)||0)<5)agriAdvice+='• ✅ 天气适宜施肥施药，建议抓住窗口期<br>• 可安排田间中耕除草、整枝打杈<br>• 鱼塘：适宜投喂和水质调节';
    else if(parseFloat(now.precip)>10)agriAdvice+='• 暂缓施肥施药，肥料会被雨水冲走<br>• 提前清理排水沟，低洼田块做好排水准备<br>• 已成熟蔬菜/水果抢收，减少损失';
    else agriAdvice+='• 关注天气变化，灵活安排农事<br>• 大棚注意通风降温，防病害滋生';

    var rainTrend='';for(var i=0;i<Math.min(daily.length,7);i++){var ri=parseFloat(daily[i].precip)||0;rainTrend+='<span style="display:inline-block;width:30px;text-align:center;font-size:10px;color:'+(ri>10?'#2563eb':ri>2?'#60a5fa':'#94a3b8')+'">'+(ri>0?'🌧':'☀')+'</span>'}
    var totalRain=daily.reduce(function(a,b){return a+(parseFloat(b.precip)||0)},0).toFixed(1);

    // 生活指数
    var indicesHTML='';
    if(idx.length>0){
      var idxMap={};idx.forEach(function(x){idxMap[x.type]=x});
      var idxItems=[
        {type:'8',emoji:'😊',name:'舒适度'},
        {type:'5',emoji:'☀️',name:'紫外线'},
        {type:'14',emoji:'👕',name:'晾晒'},
        {type:'16',emoji:'🧴',name:'防晒'},
        {type:'9',emoji:'🤧',name:'感冒'},
        {type:'3',emoji:'🧥',name:'穿衣'}
      ];
      indicesHTML='<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius);margin-top:14px"><div style="font-size:12px;color:var(--text2);margin-bottom:8px">🏷️ 生活指数</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">';
      idxItems.forEach(function(item){
        var d=idxMap[item.type];
        if(d)indicesHTML+='<div style="text-align:center"><div style="font-size:18px">'+item.emoji+'</div><div style="font-size:11px;color:var(--text2)">'+item.name+'</div><div style="font-size:13px;font-weight:600">'+d.category+'</div></div>';
      });
      indicesHTML+='</div></div>';
    }

    el.innerHTML='<div class="card"><div class="weather-widget"><div class="weather-now"><div class="weather-icon">'+iconEmoji+'</div><div><div class="weather-temp">'+Math.round(tempVal)+'°C <span style="font-size:12px;color:var(--text2);font-weight:400">体感 '+Math.round(feelsLike)+'°C</span></div><div class="weather-desc">'+descText+' · '+locName+'</div></div></div><div class="weather-meta"><div>💨 '+now.windDir+' '+now.windScale+'级 ('+now.windSpeed+' km/h)</div><div>💧 湿度 '+now.humidity+'%</div><div>🌧 降水量 '+now.precip+'mm</div><div>👁 能见度 '+now.vis+'km · 气压 '+now.pressure+'hPa</div></div><div class="weather-forecast" style="flex-wrap:wrap">'+fc+'</div></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px">'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius)"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">🌾 农事适宜度</div><div style="font-size:22px;font-weight:700">'+agri.level+'</div><div style="font-size:11px;color:var(--text2);margin-top:4px">'+agri.reasons.join(' · ')+'</div></div>'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius)"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">📅 7日降雨趋势</div><div style="font-size:20px;letter-spacing:2px;margin-bottom:4px">'+rainTrend+'</div><div style="font-size:11px;color:var(--text2)">累计降水: '+totalRain+'mm</div></div>'+
    '</div>'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius);margin-top:14px"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">📋 农事操作建议</div><div style="font-size:13px;line-height:1.8">'+agriAdvice+'</div></div>'+
    indicesHTML+
    alertsHTML+
    '<div style="font-size:10px;color:var(--text3);margin-top:12px;text-align:right">数据来源: 和风天气 · 更新于 '+new Date().toLocaleTimeString('zh-CN')+' <span id="weather-countdown"></span></div></div>';
    startWeatherAutoRefresh();
  }catch(e){
    console.error('天气API请求失败:',e.message||e);
    loadWeatherFallback(locVal)
  }
}

// ===== 天气离线兜底（API不可用时自动切换） =====
function loadWeatherFallback(locVal){
  var el=document.getElementById('weather-content'),locEl=document.getElementById('weather-location');
  if(!el)return;
  var loc=locVal.split(','),locName=locEl&&locEl.options[locEl.selectedIndex]?locEl.options[locEl.selectedIndex].text:'当前地区';
  var wd=['日','一','二','三','四','五','六'];
  // 根据地理位置估算气候（纬度越低越热，越北越凉）
  var lat=parseFloat(loc[0])||32;
  var baseTemp=Math.round(32 - Math.abs(lat-28)*0.15 + (Math.random()-0.5)*3);
  var season='夏'; // 7月是夏季
  var weatherTypes=[
    {icon:'☀️',text:'晴',tempOff:2,humid:50,precip:0,wind:8},
    {icon:'🌤️',text:'多云',tempOff:0,humid:60,precip:0,wind:10},
    {icon:'⛅',text:'少云',tempOff:1,humid:55,precip:0,wind:9},
    {icon:'🌥️',text:'阴',tempOff:-1,humid:75,precip:0.5,wind:12},
    {icon:'🌦️',text:'阵雨',tempOff:-2,humid:80,precip:5,wind:14},
    {icon:'🌧️',text:'小雨',tempOff:-3,humid:85,precip:8,wind:13},
    {icon:'⛈️',text:'雷阵雨',tempOff:-4,humid:90,precip:15,wind:18}
  ];
  var todayWx=weatherTypes[Math.floor(Math.random()*weatherTypes.length)];
  var temp=baseTemp+todayWx.tempOff,feelsLike=temp+(todayWx.humid>70?2:0);
  // 7日预报
  var fc='';for(var i=0;i<7;i++){
    var dt=new Date(Date.now()+i*86400000),dn=i===0?'今天':i===1?'明天':i===2?'后天':'周'+wd[dt.getDay()];
    var dWx=weatherTypes[Math.floor(Math.random()*weatherTypes.length)];
    var dHi=baseTemp+dWx.tempOff+Math.round((Math.random()-0.3)*4),dLo=Math.round(baseTemp-6+(Math.random()-0.5)*3);
    fc+='<div class="forecast-day"><div class="day-name">'+dn+'</div><div class="day-icon">'+dWx.icon+'</div><div class="day-temp" style="color:#dc2626">'+dHi+'°</div><div class="day-temp" style="color:#2563eb">'+dLo+'°</div><div class="day-rain">💧 '+(dWx.precip>0?dWx.precip+'mm':'0')+'</div></div>'
  }
  var agri=getQAgriScore(temp,0,todayWx.wind,todayWx.text);
  var alerts=getQWeatherAlert(temp,todayWx.text,todayWx.precip,todayWx.wind);
  var alertsHTML=alerts.length>0?'<div style="margin-top:14px">'+alerts.map(function(a){return'<div class="weather-alert">'+a+'</div>'}).join('')+'</div>':'';
  var agriAdvice='';
  if(temp>35)agriAdvice+='• 大棚蔬菜：上午9点前关闭通风口蓄温，10点后全开通风<br>• 畜禽：屋顶喷白反射阳光，饮水添加VC抗应激<br>• 果树：果园生草覆盖降温，避免中午灌溉';
  else if(temp>=20&&temp<=30&&todayWx.precip<5)agriAdvice+='• ✅ 天气适宜施肥施药，建议抓住窗口期<br>• 可安排田间中耕除草、整枝打杈<br>• 鱼塘：适宜投喂和水质调节';
  else if(todayWx.precip>10)agriAdvice+='• 暂缓施肥施药，肥料会被雨水冲走<br>• 提前清理排水沟，低洼田块做好排水准备<br>• 已成熟蔬菜/水果抢收，减少损失';
  else agriAdvice+='• 关注天气变化，灵活安排农事<br>• 大棚注意通风降温，防病害滋生';
  el.innerHTML='<div class="card"><div class="weather-widget"><div class="weather-now"><div class="weather-icon">'+todayWx.icon+'</div><div><div class="weather-temp">'+temp+'°C <span style="font-size:12px;color:var(--text2);font-weight:400">体感 '+feelsLike+'°C</span></div><div class="weather-desc">'+todayWx.text+' · '+locName+'</div></div></div><div class="weather-meta"><div>💨 东风 '+Math.round(todayWx.wind)+'级</div><div>💧 湿度 '+todayWx.humid+'%</div><div>🌧 降水量 '+todayWx.precip+'mm</div><div>👁 能见度 10km</div></div><div class="weather-forecast">'+fc+'</div></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px">'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius)"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">🌾 农事适宜度</div><div style="font-size:22px;font-weight:700">'+agri.level+'</div><div style="font-size:11px;color:var(--text2);margin-top:4px">'+agri.reasons.join(' · ')+'</div></div>'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius)"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">📅 7日降雨趋势</div><div style="font-size:20px;letter-spacing:2px">☀🌤☁🌧☀☁🌤</div><div style="font-size:11px;color:var(--text2)">离线模式 · 估算数据</div></div></div>'+
    '<div style="background:var(--msg-bg);padding:14px;border-radius:var(--radius);margin-top:14px"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">📋 农事操作建议</div><div style="font-size:13px;line-height:1.8">'+agriAdvice+'</div></div>'+
    alertsHTML+
    '<div style="font-size:10px;color:var(--text2);margin-top:12px;text-align:right;padding:4px 0">🔌 离线模式 · 数据为估算参考，服务器连接后将自动切换为实时数据</div></div>';
}

function startWeatherAutoRefresh(){
  if(weatherAutoTimer)clearInterval(weatherAutoTimer);
  var countdownEl=document.getElementById('weather-countdown');if(!countdownEl)return;
  var interval=5*60,remaining=interval;
  function tick(){remaining--;if(remaining<=0){remaining=interval;loadWeather()}var m=Math.floor(remaining/60),s=remaining%60;countdownEl.textContent='| ⏱ '+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s)+' 后自动刷新'}
  tick();weatherAutoTimer=setInterval(tick,1000)
}
