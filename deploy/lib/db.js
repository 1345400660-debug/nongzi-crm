// ===== 工具函数 =====
function esc(s){if(s==null)return'';var d=document.createElement('div');d.textContent=String(s);return d.innerHTML}
function debounce(fn,d){var t;return function(){var a=this,args=arguments;clearTimeout(t);t=setTimeout(function(){fn.apply(a,args)},d)}}
function fmtMoney(n){return Number(n||0).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function tdate(d){return d.toISOString().split('T')[0]}
function today(){return tdate(new Date())}
function daysAgo(n){return tdate(new Date(Date.now()-n*86400000))}
function daysFromNow(n){return tdate(new Date(Date.now()+n*86400000))}

// ===== Toast =====
function showToast(m,t){t=t||'success';var c=document.getElementById('toast-container');var d=document.createElement('div');d.className='toast toast-'+t;d.textContent=m;c.appendChild(d);setTimeout(function(){d.style.opacity='0';d.style.transform='translateX(100%)';d.style.transition='all 0.3s ease';setTimeout(function(){d.remove()},300)},2800)}

// ===== 确认对话框 =====
function showConfirm(m,i,fn){var id='c'+Date.now();var d=document.createElement('div');d.id=id;d.className='confirm-overlay';d.innerHTML='<div class="confirm-box"><div class="confirm-icon">'+(i||'⚠️')+'</div><div class="confirm-msg">'+m+'</div><div class="confirm-actions"><button class="btn btn-outline" onclick="document.getElementById(\''+id+'\').remove()">取消</button><button class="btn btn-primary" id="'+id+'-ok">确认</button></div></div>';document.body.appendChild(d);document.getElementById(id+'-ok').addEventListener('click',function(){d.remove();if(fn)fn()});d.addEventListener('click',function(e){if(e.target===d)d.remove()})}

function closeModal(){document.getElementById('modal-container').innerHTML=''}

// ===== 导航 =====
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('mobile-overlay').classList.toggle('show')}

// ===== 侧边栏收缩/展开 =====
var sidebarCollapsed=false;
function toggleCollapse(){
  var sb=document.getElementById('sidebar');
  sidebarCollapsed=!sidebarCollapsed;
  if(sidebarCollapsed){sb.classList.add('collapsed');sb.classList.remove('pinned')}
  else{sb.classList.remove('collapsed');sb.classList.add('pinned')}
  try{localStorage.setItem('sidebar-collapsed',sidebarCollapsed?'1':'0')}catch(e){}
}
function initSidebarCollapse(){
  // 加载用户偏好
  var pref='0';
  try{pref=localStorage.getItem('sidebar-collapsed')||'0'}catch(e){}
  var sb=document.getElementById('sidebar');
  var cb=document.getElementById('collapse-btn');
  if(!sb||!cb)return;
  // 绑定收缩按钮
  cb.addEventListener('click',function(e){e.stopPropagation();toggleCollapse()});
  // 平板端(768-1023px)默认收缩，桌面端(>=1024px)按偏好
  var isTablet=window.innerWidth>=768&&window.innerWidth<=1023;
  if(isTablet&&pref!=='1'){sb.classList.add('collapsed');sidebarCollapsed=true}
  else if(isTablet&&pref==='1'){sb.classList.add('pinned');sidebarCollapsed=false}
  else if(!isTablet&&pref==='1'){sb.classList.add('collapsed');sidebarCollapsed=true}
  else{sidebarCollapsed=false}
  // 窗口大小变化时自动调整
  window.addEventListener('resize',function(){
    var w=window.innerWidth;
    if(w<=767){sb.classList.remove('collapsed');sidebarCollapsed=false;return}
    if(w>=768&&w<=1023&&!sb.classList.contains('pinned')){sb.classList.add('collapsed');sidebarCollapsed=true}
  })
}

// ===== 主题切换 (深色/浅色模式) =====
var isDarkTheme=false;
function applyTheme(dark){
  isDarkTheme=dark;
  if(dark){document.documentElement.setAttribute('data-theme','dark');document.getElementById('theme-icon').textContent='☀️';document.getElementById('theme-label').textContent='浅色模式'}
  else{document.documentElement.removeAttribute('data-theme');document.getElementById('theme-icon').textContent='🌙';document.getElementById('theme-label').textContent='深色模式'}
  // 同步移动端按钮
  var mb=document.getElementById('mobile-theme-btn');if(mb)mb.textContent=dark?'☀️':'🌙';
  try{localStorage.setItem('theme',dark?'dark':'light')}catch(e){}
}
function initTheme(){
  var pref='';
  try{pref=localStorage.getItem('theme')||''}catch(e){}
  var dark=pref==='dark'||(!pref&&window.matchMedia('(prefers-color-scheme:dark)').matches);
  applyTheme(dark);
  // 切换按钮
  var btn=document.getElementById('theme-toggle');
  if(btn){btn.addEventListener('click',function(e){e.stopPropagation();applyTheme(!isDarkTheme)})}
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(e){
    var saved='';try{saved=localStorage.getItem('theme')||''}catch(ex){}
    if(!saved)applyTheme(e.matches)})
}

var pageTitles={dashboard:'运营总览',farmers:'农户档案',messages:'消息中心',chat:'农技答疑',debts:'账期管理',datasource:'数据来源',weather:'天气预报',market:'行情价格',notify:'消息推送'};

// ===== 导航键盘支持 =====
document.querySelectorAll('.nav-item[data-page], .bottom-nav-item[data-page]').forEach(function(item){
  item.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();navigateTo(this.dataset.page)}})
})

function setActiveNav(page){
  // 侧边栏
  document.querySelectorAll('.sidebar .nav-item').forEach(function(i){i.classList.remove('active')});
  var si=document.querySelector('.sidebar .nav-item[data-page="'+page+'"]');
  if(si)si.classList.add('active');
  // 底部导航
  document.querySelectorAll('.bottom-nav-item').forEach(function(i){i.classList.remove('active')});
  var bi=document.querySelector('.bottom-nav-item[data-page="'+page+'"]');
  if(bi)bi.classList.add('active');
  // 页面标题
  var mt=document.getElementById('mobile-page-title');if(mt)mt.textContent=pageTitles[page]||page;
}

function navigateTo(page){
  // 页面退出动画
  var active=document.querySelector('.page.active');
  if(active){active.classList.add('out');setTimeout(function(){active.classList.remove('out','active')},180)}
  // 切换到新页面
  setTimeout(function(){
    setActiveNav(page);
    document.getElementById('page-'+page).classList.add('active');
    // 移动端关闭侧边栏
    if(window.innerWidth<=767){document.getElementById('sidebar').classList.remove('open');document.getElementById('mobile-overlay').classList.remove('show')}
    // 更新底部导航
    document.querySelectorAll('.bottom-nav-item').forEach(function(i){i.classList.toggle('active',i.dataset.page===page)});
    // 更新标题
    var mt=document.getElementById('mobile-page-title');if(mt)mt.textContent=pageTitles[page]||page;
  },180);
  switch(page){
    case'dashboard':loadDashboard();break;
    case'farmers':loadFarmers();break;
    case'messages':loadMessages();break;
    case'chat':loadChatPage();break;
    case'debts':loadDebts();break;
    case'weather':loadWeather();break;
    case'market':loadMarketPrices();break;
    case'notify':loadNotifyPage();break;
  }
}

document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();var c=document.querySelector('.confirm-overlay');if(c)c.remove()}if(e.ctrlKey&&e.key==='Enter'){var ci=document.getElementById('chat-input');if(ci&&document.activeElement===ci)sendChat()}});

// ===== 种养周期 =====
var CROP_CYCLES={};
var BREED_CYCLES={};

// ===== 全局状态 =====
var allFarmers=[],allMessages=[],allDebts=[],progressCache={};
var chatFarmerId=null,chatFarmerName='匿名农户',chatProductType='',chatCategory='';

// ===== SQL.js 数据库 =====
var db=null;

function sqlAll(sql,params){params=params||[];var s=db.prepare(sql);if(params.length>0)s.bind(params);var r=[];while(s.step())r.push(s.getAsObject());s.free();return r}
function sqlOne(sql,params){params=params||[];var s=db.prepare(sql);if(params.length>0)s.bind(params);var r=null;if(s.step())r=s.getAsObject();s.free();return r}
function sqlRun(sql,params){
  db.run(sql,params||[]);
  // 数据变更后自动持久化
  var s=sql.trim().substring(0,6).toUpperCase();
  if(s==='INSERT'||s==='UPDATE'||s==='DELETE'||s==='CREATE'||s==='DROP')saveDb()
}
function sqlLastId(){return sqlOne('SELECT last_insert_rowid() as id').id}

function getTodayNodes(td){
  return sqlAll("SELECT f.name, f.product_type, m.title, m.content FROM messages m JOIN farmers f ON m.farmer_id=f.id WHERE m.scheduled_date=? AND m.type='节点提醒'",[td]);
}

function getRecentActivities(){
  return sqlAll("SELECT '消息' as type, title as detail, created_at FROM messages UNION ALL SELECT '赊账' as type, description as detail, created_at FROM debts UNION ALL SELECT '答疑' as type, question as detail, created_at FROM ai_chats ORDER BY created_at DESC LIMIT 10");
}

// ===== DB 初始化 =====
function updateLoading(txt,pct){
  document.getElementById('load-status').textContent=txt;
  document.getElementById('load-bar').style.width=pct+'%';
}

async function initApp(){
  updateLoading('初始化...',5);
  var SQL=await initSqlJs({locateFile:function(f){return'./'+f}});
  
  // 1. 尝试从 IndexedDB 恢复数据
  updateLoading('加载本地数据...',20);
  var savedData=await loadDb();
  
  if(savedData){
    // 有持久化数据 → 直接从二进制恢复
    updateLoading('恢复数据库...',30);
    db=new SQL.Database(savedData);
    updateLoading('数据恢复完成',60);
  } else {
    // 首次使用 → 新建数据库并灌入示范数据
    updateLoading('创建数据库结构...',30);
    db=new SQL.Database();
    db.run('PRAGMA foreign_keys=ON');
    db.run("CREATE TABLE IF NOT EXISTS farmers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,phone TEXT,address TEXT,category TEXT NOT NULL,product_type TEXT NOT NULL,scale TEXT,scale_unit TEXT,start_date TEXT NOT NULL,cycle_days INTEGER NOT NULL,key_nodes TEXT DEFAULT '[]',notes TEXT,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT,farmer_id INTEGER,type TEXT NOT NULL,title TEXT NOT NULL,content TEXT NOT NULL,status TEXT DEFAULT '待发送',scheduled_date TEXT,sent_at DATETIME,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("CREATE TABLE IF NOT EXISTS debts(id INTEGER PRIMARY KEY AUTOINCREMENT,farmer_id INTEGER,amount REAL NOT NULL,description TEXT,product_detail TEXT,borrow_date TEXT NOT NULL,due_date TEXT NOT NULL,status TEXT DEFAULT '待还',reminded INTEGER DEFAULT 0,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("CREATE TABLE IF NOT EXISTS ai_chats(id INTEGER PRIMARY KEY AUTOINCREMENT,farmer_id INTEGER,farmer_name TEXT,question TEXT NOT NULL,answer TEXT NOT NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,category TEXT,type TEXT NOT NULL)");

    // 预设产品
    var prods=[['水稻种子-南粳46','种植','种子'],['小麦种子-扬麦25','种植','种子'],['玉米种子-郑单958','种植','种子'],['复合肥-氮磷钾15-15-15','种植','肥料'],['尿素-46%','种植','肥料'],['有机肥-腐熟鸡粪','种植','肥料'],['吡虫啉-杀虫剂','种植','农药'],['多菌灵-杀菌剂','种植','农药'],['草甘膦-除草剂','种植','农药'],['农用薄膜-8丝','种植','农具'],['滴灌带-16mm','种植','农具'],['小猪饲料-乳猪料','养殖','饲料'],['中猪饲料-育肥料','养殖','饲料'],['蛋鸡饲料-产蛋料','养殖','饲料'],['兽药-阿莫西林','养殖','兽药'],['疫苗-猪瘟疫苗','养殖','疫苗'],['消毒液-过氧乙酸','养殖','消毒'],['鸡苗-海兰褐','养殖','种苗'],['猪精-杜洛克','养殖','种苗'],['鱼饲料-膨化料','养殖','饲料'],['湖羊羔羊料','养殖','饲料'],['肉鸭育肥料','养殖','饲料'],['兔颗粒料','养殖','饲料'],['虾蟹配合料','养殖','饲料'],['舔砖-矿物质','养殖','饲料'],['羊三联四防疫苗','养殖','疫苗'],['鸭肝炎疫苗','养殖','疫苗'],['兔瘟疫苗','养殖','疫苗'],['香菇菌种-L808','种植','种苗'],['中药材专用有机肥','种植','肥料']];
    for(var i=0;i<prods.length;i++){sqlRun('INSERT INTO products(name,category,type) VALUES(?,?,?)',prods[i])}

    updateLoading('灌入示范数据...',50);
    seedData();
    saveDb(); // 首次保存
    updateLoading('启动完成',100);
  }
  
  setTimeout(function(){document.getElementById('loading-overlay').style.display='none'},400);

  // 初始化导航：侧边栏
  document.querySelectorAll('.sidebar .nav-item').forEach(function(item){
    item.addEventListener('click',function(){navigateTo(item.dataset.page)});
  });

  // 初始化导航：底部导航栏
  document.querySelectorAll('.bottom-nav-item').forEach(function(item){
    item.addEventListener('click',function(){navigateTo(item.dataset.page)});
  });

  // 关闭页面/刷新前自动保存
  window.addEventListener('beforeunload',function(){saveDb()});

  loadDashboard();
  loadFarmers();
  initSidebarCollapse();
  initTheme();
  initWeatherSelectors();
  updateWeatherStatusDot(false);
  var md=document.getElementById('market-status-dot');if(md)md.style.color='#94a3b8';
}

// ===== 数据重置 =====
function resetAllData(){
  try{
    // 1. 清空所有表
    db.run('DELETE FROM farmers');
    db.run('DELETE FROM messages');
    db.run('DELETE FROM debts');
    db.run('DELETE FROM ai_chats');
    db.run('DELETE FROM products');
    // 2. 清空 IndexedDB 缓存
    clearPersistedDb();
    // 3. 重新灌入产品
    var prods=[['水稻种子-南粳46','种植','种子'],['小麦种子-扬麦25','种植','种子'],['玉米种子-郑单958','种植','种子'],['复合肥-氮磷钾15-15-15','种植','肥料'],['尿素-46%','种植','肥料'],['有机肥-腐熟鸡粪','种植','肥料'],['吡虫啉-杀虫剂','种植','农药'],['多菌灵-杀菌剂','种植','农药'],['草甘膦-除草剂','种植','农药'],['农用薄膜-8丝','种植','农具'],['滴灌带-16mm','种植','农具'],['小猪饲料-乳猪料','养殖','饲料'],['中猪饲料-育肥料','养殖','饲料'],['蛋鸡饲料-产蛋料','养殖','饲料'],['兽药-阿莫西林','养殖','兽药'],['疫苗-猪瘟疫苗','养殖','疫苗'],['消毒液-过氧乙酸','养殖','消毒'],['鸡苗-海兰褐','养殖','种苗'],['猪精-杜洛克','养殖','种苗'],['鱼饲料-膨化料','养殖','饲料'],['湖羊羔羊料','养殖','饲料'],['肉鸭育肥料','养殖','饲料'],['兔颗粒料','养殖','饲料'],['虾蟹配合料','养殖','饲料'],['舔砖-矿物质','养殖','饲料'],['羊三联四防疫苗','养殖','疫苗'],['鸭肝炎疫苗','养殖','疫苗'],['兔瘟疫苗','养殖','疫苗'],['香菇菌种-L808','种植','种苗'],['中药材专用有机肥','种植','肥料']];
    for(var i=0;i<prods.length;i++){sqlRun('INSERT INTO products(name,category,type) VALUES(?,?,?)',prods[i])}
    // 4. 重新灌入示范数据
    seedData();
    // 5. 保存到 IndexedDB
    saveDb();
    // 6. 刷新页面
    showToast('数据已重置，刷新页面中...','success');
    setTimeout(function(){location.reload()},1500);
  }catch(e){
    showToast('重置失败: '+e.message,'error');
    console.error('resetAllData error:',e);
  }
}
