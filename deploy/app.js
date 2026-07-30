// ===== 仪表盘 =====
function loadDashboard(){
var td=today();
var stats=sqlOne("SELECT (SELECT COUNT(*) FROM farmers) as tf,(SELECT COUNT(*) FROM messages WHERE status='待发送') as pm,(SELECT COUNT(*) FROM messages WHERE status='已发送') as sm,(SELECT COUNT(*) FROM debts WHERE status IN('待还','逾期')) as ad,(SELECT COALESCE(SUM(amount),0) FROM debts WHERE status IN('待还','逾期')) as ta,(SELECT COUNT(*) FROM debts WHERE status='逾期') as od,(SELECT COUNT(*) FROM ai_chats) as rc");
var todayNodes=getTodayNodes(td);
var acts=getRecentActivities();
// 首次访问引导
var dashEl=document.getElementById('page-dashboard');
var existingGuide=dashEl.querySelector('.welcome-guide');
if(!existingGuide&&window.innerWidth>=768){
  dashEl.insertAdjacentHTML('afterbegin','<div class="welcome-guide"><h3>🌾 欢迎使用农资CRM</h3><p>AI驱动的农户客户运营系统，帮助农资店主精准管理种植养殖周期、智能推送节点提醒、AI农技答疑和账期管理。</p><div class="guide-steps"><div class="guide-step" onclick="navigateTo(\'farmers\')" style="cursor:pointer">🌱 添加农户</div><div class="guide-step" onclick="navigateTo(\'chat\')" style="cursor:pointer">🤖 AI答疑</div><div class="guide-step" onclick="navigateTo(\'debts\')" style="cursor:pointer">💰 管理账期</div><div class="guide-step" onclick="navigateTo(\'weather\')" style="cursor:pointer">🌤️ 查看天气</div></div></div>');
}
var statCards=[
  {icon:'🌱',bg:'var(--primary-light)',val:stats.tf,label:'农户总数'},
  {icon:'📬',bg:'var(--accent-light)',val:stats.pm,label:'待发消息'},
  {icon:'💬',bg:'#e0e7ff',val:stats.rc,label:'答疑次数'},
  {icon:'💰',bg:'var(--danger-light)',val:stats.ad,label:'待收赊账('+stats.od+'笔逾期)'},
  {icon:'📊',bg:'var(--primary-50)',val:'¥'+Math.round(stats.ta||0),label:'赊账总额'},
  {icon:'✅',bg:'#f5f3ff',val:stats.sm,label:'已发消息'}
];
document.getElementById('dash-stats').innerHTML=statCards.map(function(s,i){
  return'<div class="stat-card stagger-in stagger-'+i+'"><div class="stat-icon" style="background:'+s.bg+'">'+s.icon+'</div><div><div class="stat-value count-up">'+esc(s.val)+'</div><div class="stat-label">'+esc(s.label)+'</div></div></div>'
}).join('');
var nd=document.getElementById('today-nodes');
if(todayNodes.length>0){nd.innerHTML=todayNodes.map(function(n){return'<div class="msg-item type-节点提醒"><div class="msg-title">🔔 '+esc(n.title)+'</div><div class="msg-content">'+esc(n.name)+' · '+esc(n.product_type)+' — '+esc(n.content)+'</div></div>'}).join('')}
else{nd.innerHTML='<div class="empty-state"><span class="empty-icon">✅</span><div class="empty-title">今日无待处理节点</div><div class="empty-desc">所有农户的种养周期节点均已跟进</div></div>'}
var ad=document.getElementById('recent-activities');
// 天气小卡片
if(weatherCache){
  var w=weatherCache,alerts=getWeatherAlert(w.temp,w.code,w.rainProb);
  nd.insertAdjacentHTML('beforebegin','<div class="card" style="margin-bottom:18px"><div class="weather-widget"><div class="weather-now"><div class="weather-icon">'+weatherCodeToEmoji(w.code)+'</div><div><div class="weather-temp">'+Math.round(w.temp)+'°C</div><div class="weather-desc">湿度 '+w.humidity+'% · 风力 '+w.wind+'km/h · 降雨 '+w.rainProb+'%</div></div></div><div class="weather-meta" style="flex:1;text-align:right">'+(alerts.length>0?'<span style="color:var(--danger)">'+alerts[0]+'</span>':'<span style="color:var(--primary)">✅ 天气适宜农事作业</span>')+'<br><small style="color:var(--text3)">从"天气预报"页面查看5日详细预报</small></div></div></div>');
}
if(acts.length>0){ad.innerHTML=acts.map(function(a){var icon=a.type==='消息'?'📬':a.type==='赊账'?'💰':'💬',d=(a.detail||'').substring(0,40);return'<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">'+icon+' <b>'+esc(a.type)+'</b> '+esc(d)+' <span style="color:var(--text3);float:right">'+new Date(a.created_at).toLocaleDateString('zh-CN')+'</span></div>'}).join('')}
else{ad.innerHTML='<div class="empty-state"><div class="empty-title">暂无动态</div></div>'}
}

// ===== 农户管理 =====
function loadFarmers(){allFarmers=sqlAll('SELECT * FROM farmers ORDER BY created_at DESC');progressCache={};renderFarmers()}

function calcProgress(f){
var key=f.id+'_'+new Date().toDateString();
if(progressCache[key])return progressCache[key];
var sd=new Date(f.start_date),elapsed=Math.floor((Date.now()-sd)/86400000);
var pct=Math.min(100,Math.round(elapsed/f.cycle_days*100));
var nodes=JSON.parse(f.key_nodes||'[]'),cp='';
for(var i=nodes.length-1;i>=0;i--){if(elapsed>=nodes[i].day){cp=nodes[i].label;break}}
var r={elapsed:elapsed,pct:pct,currentPhase:cp,nodes:nodes};progressCache[key]=r;return r}

var debouncedRenderFarmers=debounce(renderFarmers,300);

function renderFarmers(){
var search=(document.getElementById('farmer-search')?document.getElementById('farmer-search').value:'').toLowerCase();
var fc=(document.getElementById('farmer-filter-cat')?document.getElementById('farmer-filter-cat').value:'');
var list=allFarmers.filter(function(f){if(search&&f.name.indexOf(search)<0&&(f.phone||'').indexOf(search)<0&&(f.address||'').indexOf(search)<0)return false;if(fc&&f.category!==fc)return false;return true});
// 表格视图
var t=document.getElementById('farmer-table');
if(list.length===0){t.innerHTML='<tr><td colspan="10"><div class="empty-state"><span class="empty-icon">🌱</span><div class="empty-title">'+(allFarmers.length===0?'暂无农户数据':'未找到匹配农户')+'</div><div class="empty-desc">'+(allFarmers.length===0?'点击右上角「添加农户」开始建立档案':'尝试调整搜索条件')+'</div>'+(allFarmers.length===0?'<div class="empty-action"><button class="btn btn-primary" onclick="openFarmerModal()">+ 添加农户</button></div>':'')+'</div></td></tr>'}
else{t.innerHTML=list.map(function(f){var p=calcProgress(f),cl=p.pct>=100?'progress-red':p.pct>=70?'progress-yellow':'progress-green';return'<tr><td><b>'+esc(f.name)+'</b></td><td>'+esc(f.phone||'-')+'</td><td>'+esc(f.address||'-')+'</td><td><span class="tag '+(f.category==='种植'?'tag-green':'tag-yellow')+'">'+esc(f.category)+'</span></td><td>'+esc(f.product_type)+'</td><td>'+esc(f.scale)+esc(f.scale_unit||'')+'</td><td>'+esc(f.start_date)+'</td><td>'+esc(f.cycle_days)+'天</td><td style="min-width:130px"><small>'+esc(p.currentPhase||'未开始')+'</small><div class="progress-bar"><div class="progress-fill '+cl+'" style="width:'+p.pct+'%"></div></div><small>'+p.pct+'%</small></td><td><button class="btn btn-sm btn-outline" data-action="view" data-id="'+f.id+'">详情</button> <button class="btn btn-sm btn-outline" data-action="edit" data-id="'+f.id+'">编辑</button> <button class="btn btn-sm btn-danger" data-action="delete" data-id="'+f.id+'" data-name="'+esc(f.name)+'">删除</button></td></tr>'}).join('')}
// 卡片视图 (移动端)
var cl=document.getElementById('farmer-card-list');
if(list.length===0){cl.innerHTML='<div class="empty-state"><span class="empty-icon">🌱</span><div class="empty-title">'+(allFarmers.length===0?'暂无农户数据':'未找到匹配农户')+'</div><div class="empty-desc">'+(allFarmers.length===0?'点击右上角「添加农户」开始建立档案':'尝试调整搜索条件')+'</div>'+(allFarmers.length===0?'<div class="empty-action"><button class="btn btn-primary" onclick="openFarmerModal()">+ 添加农户</button></div>':'')+'</div>'}
else{cl.innerHTML=list.map(function(f){var p=calcProgress(f),cl2=p.pct>=100?'progress-red':p.pct>=70?'progress-yellow':'progress-green';return'<div class="card-list-item"><div class="cli-header"><span class="cli-title">'+esc(f.name)+'</span><span class="tag '+(f.category==='种植'?'tag-green':'tag-yellow')+'">'+esc(f.category)+'</span></div><div class="cli-detail">📞 '+esc(f.phone||'-')+' · 📍 '+esc(f.address||'-')+'</div><div class="cli-detail">🌾 '+esc(f.product_type)+' · '+esc(f.scale)+esc(f.scale_unit||'')+' · 周期'+esc(f.cycle_days)+'天</div><div style="margin-top:6px"><small style="color:var(--text2)">'+esc(p.currentPhase||'未开始')+'</small><div class="progress-bar"><div class="progress-fill '+cl2+'" style="width:'+p.pct+'%"></div></div></div><div class="cli-actions"><button class="btn btn-sm btn-outline" data-action="view" data-id="'+f.id+'">详情</button><button class="btn btn-sm btn-outline" data-action="edit" data-id="'+f.id+'">编辑</button><button class="btn btn-sm btn-danger" data-action="delete" data-id="'+f.id+'" data-name="'+esc(f.name)+'">删除</button></div></div>'}).join('')}
// 事件绑定
function bindFarmerBtns(el){el.querySelectorAll('button[data-action]').forEach(function(b){b.addEventListener('click',function(){var a=this.dataset.action,id=parseInt(this.dataset.id);if(a==='view')viewFarmer(id);else if(a==='edit')openFarmerModal(id);else if(a==='delete'){showConfirm('确定删除农户「'+this.dataset.name+'」？<br><small style="color:var(--danger)">相关消息、赊账记录也将一并删除</small>','🗑️',function(){deleteFarmer(id)})}})})}
bindFarmerBtns(t);bindFarmerBtns(cl);}

function openFarmerModal(id){
var f=id?allFarmers.find(function(f){return f.id===id}):null,cat=f?f.category:'种植';
var lib=cat==='种植'?CROP_CYCLES:BREED_CYCLES,types=Object.keys(lib);
var topts=types.map(function(t){return'<option value="'+esc(t)+'"'+(f&&f.product_type===t?' selected':'')+'>'+esc(t)+'</option>'}).join('');
document.getElementById('modal-container').innerHTML='<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><h3>'+(id?'编辑农户':'添加农户')+'</h3><div class="form-row"><div class="form-group"><label>姓名 <span class="required">*</span></label><input id="fm-name" value="'+esc(f?f.name:'')+'"></div><div class="form-group"><label>电话</label><input id="fm-phone" value="'+esc(f?f.phone:'')+'"></div></div><div class="form-group"><label>地址</label><input id="fm-address" value="'+esc(f?f.address:'')+'"></div><div class="form-row"><div class="form-group"><label>经营类别</label><select id="fm-category" onchange="onCatChange()"><option value="种植"'+(cat==='种植'?' selected':'')+'>种植</option><option value="养殖"'+(cat==='养殖'?' selected':'')+'>养殖</option></select></div><div class="form-group"><label>品类 <span class="required">*</span></label><select id="fm-product">'+topts+'</select></div></div><div class="form-row"><div class="form-group"><label>规模</label><input id="fm-scale" value="'+esc(f?f.scale:'')+'" placeholder="如：50"></div><div class="form-group"><label>单位</label><select id="fm-scale-unit"><option value="亩"'+(f&&f.scale_unit==='亩'?' selected':'')+'>亩</option><option value="头"'+(f&&f.scale_unit==='头'?' selected':'')+'>头</option><option value="只"'+(f&&f.scale_unit==='只'?' selected':'')+'>只</option><option value="尾"'+(f&&f.scale_unit==='尾'?' selected':'')+'>尾</option></select></div></div><div class="form-row"><div class="form-group"><label>开始日期 <span class="required">*</span></label><input type="date" id="fm-start-date" value="'+esc(f?f.start_date:'')+'"></div><div class="form-group"><label>周期天数</label><input type="number" id="fm-cycle" value="'+esc(f?f.cycle_days:'')+'" placeholder="自动填充"></div></div><div class="form-group"><label>备注</label><textarea id="fm-notes">'+esc(f?f.notes:'')+'</textarea></div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" id="btn-save-farmer">保存</button></div></div></div>';
document.getElementById('btn-save-farmer').addEventListener('click',function(){saveFarmer(id||0)})}

function saveFarmer(id){
var name=document.getElementById('fm-name').value.trim(),cat=document.getElementById('fm-category').value,product=document.getElementById('fm-product').value,startDate=document.getElementById('fm-start-date').value;
if(!name||!product||!startDate){showToast('请填写姓名、品类和开始日期','error');return}
var lib=cat==='种植'?CROP_CYCLES:BREED_CYCLES,ref=lib[product];
var data=[name,document.getElementById('fm-phone').value.trim()||'',document.getElementById('fm-address').value.trim()||'',cat,product,document.getElementById('fm-scale').value.trim()||'',document.getElementById('fm-scale-unit').value,startDate,parseInt(document.getElementById('fm-cycle').value)||(ref?ref.days:120),document.getElementById('fm-notes').value.trim()||''];
if(id){sqlRun('UPDATE farmers SET name=?,phone=?,address=?,category=?,product_type=?,scale=?,scale_unit=?,start_date=?,cycle_days=?,notes=? WHERE id=?',data.concat([id]));closeModal();loadFarmers();loadDashboard();showToast('农户已更新');return}
sqlRun('INSERT INTO farmers(name,phone,address,category,product_type,scale,scale_unit,start_date,cycle_days,notes) VALUES(?,?,?,?,?,?,?,?,?,?)',data);
var fid=sqlLastId();
if(ref){var sd=new Date(startDate);ref.nodes.forEach(function(n){var parts=n.split('-第'),nd=new Date(sd);nd.setDate(nd.getDate()+parseInt(parts[1]));sqlRun("INSERT INTO messages(farmer_id,type,title,content,scheduled_date) VALUES(?,'节点提醒',?,?,?)",[fid,parts[0]+'提醒','农户'+name+'的'+product+'即将进入「'+parts[0]+'」阶段，建议及时备货相关农资。',tdate(nd)])})}
closeModal();loadFarmers();loadDashboard();showToast('农户已添加，节点提醒已自动生成')}

function deleteFarmer(id){sqlRun('DELETE FROM messages WHERE farmer_id=?',[id]);sqlRun('DELETE FROM debts WHERE farmer_id=?',[id]);sqlRun('DELETE FROM farmers WHERE id=?',[id]);loadFarmers();loadDashboard();showToast('已删除')}

function viewFarmer(id){
var f=sqlOne('SELECT * FROM farmers WHERE id=?',[id]),nodes=JSON.parse(f.key_nodes||'[]'),sd=new Date(f.start_date),elapsed=Math.floor((Date.now()-sd)/86400000);
var msgs=sqlAll('SELECT * FROM messages WHERE farmer_id=? ORDER BY created_at DESC LIMIT 10',[id]);
var debts=sqlAll('SELECT * FROM debts WHERE farmer_id=? ORDER BY created_at DESC',[id]);
document.getElementById('modal-container').innerHTML='<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal" style="max-width:680px"><h3>🌱 '+esc(f.name)+' · 档案详情</h3><div class="detail-grid"><div class="detail-item"><div class="label">经营类别</div><div class="value"><span class="tag '+(f.category==='种植'?'tag-green':'tag-yellow')+'">'+esc(f.category)+'</span></div></div><div class="detail-item"><div class="label">品类</div><div class="value">'+esc(f.product_type)+'</div></div><div class="detail-item"><div class="label">规模</div><div class="value">'+esc(f.scale)+' '+esc(f.scale_unit||'')+'</div></div><div class="detail-item"><div class="label">开始日期</div><div class="value">'+esc(f.start_date)+'</div></div><div class="detail-item"><div class="label">生长周期</div><div class="value">'+esc(f.cycle_days)+'天</div></div><div class="detail-item"><div class="label">已过天数</div><div class="value">'+elapsed+'天 ('+Math.round(elapsed/f.cycle_days*100)+'%)</div></div><div class="detail-item"><div class="label">电话</div><div class="value">'+esc(f.phone||'-')+'</div></div><div class="detail-item"><div class="label">地址</div><div class="value">'+esc(f.address||'-')+'</div></div></div><h4 style="margin:18px 0 10px">📊 关键节点</h4><div class="timeline">'+nodes.map(function(n){var nd=new Date(sd);nd.setDate(nd.getDate()+n.day);var cls='';if(elapsed>=n.day+2)cls='past';else if(Math.abs(elapsed-n.day)<=2)cls='today';return'<div class="timeline-item '+cls+'"><span class="timeline-label">'+esc(n.label)+'</span><span class="timeline-date">第'+n.day+'天 · '+nd.toLocaleDateString('zh-CN')+'</span></div>'}).join('')+'</div><h4 style="margin:18px 0 10px">📬 消息记录</h4>'+(msgs.length>0?msgs.map(function(m){return'<div class="msg-item" style="font-size:12px"><b>'+esc(m.title)+'</b> <span class="tag tag-gray">'+esc(m.status)+'</span><div style="color:var(--text2);margin-top:4px">'+esc(m.content)+'</div></div>'}).join(''):'<div class="empty-state"><div class="empty-title">暂无消息</div></div>')+'<h4 style="margin:18px 0 10px">💰 赊账记录</h4>'+(debts.length>0?debts.map(function(d){return'<div style="display:flex;justify-content:space-between;padding:8px;background:#fafaf7;border-radius:6px;margin-bottom:4px;font-size:12px"><span>¥'+fmtMoney(d.amount)+' - '+esc(d.description||'')+'</span><span class="tag '+(d.status==='已还'?'tag-green':d.status==='逾期'?'tag-red':'tag-yellow')+'">'+esc(d.status)+'</span></div>'}).join(''):'<div class="empty-state"><div class="empty-title">暂无赊账</div></div>')+'<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">关闭</button></div></div></div>'}

function onCatChange(){var cat=document.getElementById('fm-category').value,lib=cat==='种植'?CROP_CYCLES:BREED_CYCLES;document.getElementById('fm-product').innerHTML=Object.keys(lib).map(function(t){return'<option value="'+esc(t)+'">'+esc(t)+'</option>'}).join('')}

// ===== 消息管理 =====
function loadMessages(){var type=document.getElementById('msg-filter-type')?document.getElementById('msg-filter-type').value:'',status=document.getElementById('msg-filter-status')?document.getElementById('msg-filter-status').value:'';var sql='SELECT m.*, f.name as farmer_name, f.product_type FROM messages m JOIN farmers f ON m.farmer_id=f.id WHERE 1=1',params=[];if(type){sql+=' AND m.type=?';params.push(type)}if(status){sql+=' AND m.status=?';params.push(status)}sql+=' ORDER BY m.scheduled_date ASC';allMessages=sqlAll(sql,params);renderMessages()}

function renderMessages(){
var d=document.getElementById('msg-list'),cl=document.getElementById('msg-card-list');
if(allMessages.length===0){d.innerHTML='<div class="empty-state"><span class="empty-icon">📭</span><div class="empty-title">暂无消息</div><div class="empty-desc">消息会根据农户种养周期自动生成</div></div>';cl.innerHTML='<div class="empty-state"><span class="empty-icon">📭</span><div class="empty-title">暂无消息</div><div class="empty-desc">消息会根据农户种养周期自动生成</div></div>';return}
// 列表视图
d.innerHTML=allMessages.map(function(m){return'<div class="msg-item type-'+esc(m.type)+'"><div class="msg-header"><span class="msg-title">'+esc(m.title)+'</span><span class="msg-farmer">🌱 '+esc(m.farmer_name||'')+' · '+esc(m.product_type||'')+'</span></div><div class="msg-content">'+esc(m.content)+'</div><div style="display:flex;justify-content:space-between;align-items:center"><span>📅 '+esc(m.scheduled_date||'-')+' · <span class="tag '+(m.status==='已发送'?'tag-green':'tag-yellow')+'">'+esc(m.status)+'</span></span>'+(m.status==='待发送'?'<button class="btn btn-sm btn-accent" data-send="'+m.id+'">发送</button>':'')+'</div></div>'}).join('');
// 卡片视图 (移动端)
cl.innerHTML=allMessages.map(function(m){return'<div class="card-list-item"><div class="cli-header"><span class="cli-title">📬 '+esc(m.title)+'</span><span class="tag '+(m.status==='已发送'?'tag-green':'tag-yellow')+'">'+esc(m.status)+'</span></div><div class="cli-detail">🌱 '+esc(m.farmer_name||'')+' · '+esc(m.product_type||'')+'</div><div class="cli-detail">'+esc(m.content)+'</div><div class="cli-meta"><span>📅 '+esc(m.scheduled_date||'-')+'</span></div>'+(m.status==='待发送'?'<div class="cli-actions"><button class="btn btn-sm btn-accent" data-send="'+m.id+'">📤 发送</button></div>':'')+'</div>'}).join('');
d.querySelectorAll('button[data-send]').forEach(function(b){b.addEventListener('click',function(){sendOneMessage(parseInt(b.dataset.send))})});
cl.querySelectorAll('button[data-send]').forEach(function(b){b.addEventListener('click',function(){sendOneMessage(parseInt(b.dataset.send))})});}

function sendOneMessage(id){sqlRun("UPDATE messages SET status='已发送', sent_at=CURRENT_TIMESTAMP WHERE id=?",[id]);showToast('消息已发送');loadMessages()}
function sendTodayMessages(){showConfirm('确定要一键发送今天所有待发消息吗？','📤',function(){var td=today();sqlRun("UPDATE messages SET status='已发送', sent_at=CURRENT_TIMESTAMP WHERE scheduled_date<=? AND status='待发送'",[td]);var sent=db.getRowsModified();showToast('已发送 '+sent+' 条消息');loadMessages();loadDashboard()})}

// ===== AI 答疑 =====
function loadChatPage(){loadChatHistory();var qd=document.getElementById('quick-questions');if(!qd.querySelector('button')){var qs=['水稻叶子发黄怎么办？','猪拉稀怎么治？','小麦什么时候施肥？','蛋鸡产蛋下降','茶叶有虫打什么药？'];qd.innerHTML=qs.map(function(q){return'<button class="quick-q" onclick="quickAsk(\''+esc(q)+'\')">'+esc(q)+'</button>'}).join('')}}

function quickAsk(q){document.getElementById('chat-input').value=q;sendChat()}

function loadChatHistory(){var chats=sqlAll('SELECT * FROM ai_chats ORDER BY created_at DESC LIMIT 50'),d=document.getElementById('chat-history');if(chats.length===0){d.innerHTML='<div class="empty-state"><span class="empty-icon">💬</span><div class="empty-title">暂无答疑记录</div><div class="empty-desc">向AI助手提问病虫害、施肥、饲料等问题<br>回答基于真实农技指导意见</div></div>';return}d.innerHTML=chats.map(function(c){return'<div class="chat-history-item" style="padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;font-size:12px;transition:background 0.15s" data-question="'+esc(c.question)+'"><b>'+esc(c.farmer_name||'匿名')+'</b>: '+esc((c.question||'').substring(0,35))+'...<div style="color:var(--text3);font-size:11px">'+new Date(c.created_at).toLocaleString('zh-CN')+'</div></div>'}).join('');
d.querySelectorAll('.chat-history-item').forEach(function(item){item.addEventListener('click',function(){document.getElementById('chat-input').value=this.dataset.question;document.getElementById('chat-input').focus()});item.addEventListener('mouseenter',function(){this.style.background='var(--msg-bg)'});item.addEventListener('mouseleave',function(){this.style.background=''})})}

function sendChat(){
var input=document.getElementById('chat-input'),question=input.value.trim();
if(!question)return;
var btn=document.getElementById('btn-send-chat');btn.disabled=true;
var msgs=document.getElementById('chat-messages');
msgs.innerHTML+='<div class="chat-msg user">'+esc(question)+'</div>';
input.value='';
var lid='l'+Date.now();
msgs.innerHTML+='<div class="chat-msg ai" id="'+lid+'"><span class="skeleton" style="display:inline-block;width:120px;height:14px"></span></div>';
msgs.scrollTop=msgs.scrollHeight;
setTimeout(function(){
var el=document.getElementById(lid);if(!el)return;
var answer=generateAIAnswer(question,chatProductType,chatCategory);
sqlRun('INSERT INTO ai_chats(farmer_id,farmer_name,question,answer) VALUES(?,?,?,?)',[chatFarmerId,chatFarmerName,question,answer]);
el.innerHTML=esc(answer).replace(/\n/g,'<br>');
msgs.scrollTop=msgs.scrollHeight;
btn.disabled=false;
input.focus();
loadChatHistory();
},200)}

// ===== 账期管理 =====
function loadDebts(){var status=document.getElementById('debt-filter-status')?document.getElementById('debt-filter-status').value:'';var sql='SELECT d.*, f.name as farmer_name FROM debts d JOIN farmers f ON d.farmer_id=f.id WHERE 1=1',params=[];if(status){sql+=' AND d.status=?';params.push(status)}sql+=' ORDER BY d.due_date ASC';allDebts=sqlAll(sql,params);renderDebts()}

function renderDebts(){
var t=document.getElementById('debt-table'),cl=document.getElementById('debt-card-list');
if(allDebts.length===0){t.innerHTML='<tr><td colspan="7"><div class="empty-state"><span class="empty-icon">💰</span><div class="empty-title">暂无赊账记录</div><div class="empty-desc">赊账是农村农资店的普遍做法，农户收成后再结算</div><div class="empty-action"><button class="btn btn-primary" onclick="openDebtModal()">+ 新建赊账</button></div></div></td></tr>';cl.innerHTML='<div class="empty-state"><span class="empty-icon">💰</span><div class="empty-title">暂无赊账记录</div><div class="empty-desc">赊账是农村农资店的普遍做法，农户收成后再结算</div><div class="empty-action"><button class="btn btn-primary btn-sm" onclick="openDebtModal()">+ 新建赊账</button></div></div>';return}
// 表格视图
t.innerHTML=allDebts.map(function(d){return'<tr><td><b>'+esc(d.farmer_name)+'</b></td><td style="font-weight:600;color:'+(d.status==='逾期'?'var(--danger)':'inherit')+'">¥'+fmtMoney(d.amount)+'</td><td>'+esc(d.product_detail||d.description||'-')+'</td><td>'+esc(d.borrow_date)+'</td><td>'+esc(d.due_date)+'</td><td><span class="tag '+(d.status==='已还'?'tag-green':d.status==='逾期'?'tag-red':'tag-yellow')+'">'+esc(d.status)+'</span></td><td>'+(d.status!=='已还'?'<button class="btn btn-sm btn-primary" data-pay="'+d.id+'">标记已还</button> ':'')+(d.status==='待还'?'<button class="btn btn-sm btn-accent" data-remind="'+d.id+'" data-name="'+esc(d.farmer_name)+'" data-amount="'+d.amount+'">提醒</button>':'')+'</td></tr>'}).join('');
// 卡片视图 (移动端)
cl.innerHTML=allDebts.map(function(d){return'<div class="card-list-item"><div class="cli-header"><span class="cli-title">'+esc(d.farmer_name)+'</span><span style="font-weight:700;font-size:16px;color:'+(d.status==='逾期'?'var(--danger)':'var(--primary)')+'">¥'+fmtMoney(d.amount)+'</span></div><div class="cli-detail">📦 '+esc(d.product_detail||d.description||'-')+'</div><div class="cli-meta"><span>📅 赊账: '+esc(d.borrow_date)+'</span><span>⏰ 到期: '+esc(d.due_date)+'</span><span class="tag '+(d.status==='已还'?'tag-green':d.status==='逾期'?'tag-red':'tag-yellow')+'">'+esc(d.status)+'</span></div><div class="cli-actions">'+(d.status!=='已还'?'<button class="btn btn-sm btn-primary" data-pay="'+d.id+'">标记已还</button>':'')+(d.status==='待还'?'<button class="btn btn-sm btn-accent" data-remind="'+d.id+'" data-name="'+esc(d.farmer_name)+'" data-amount="'+d.amount+'">提醒</button>':'')+'</div></div>'}).join('');
// 事件绑定
function bindDebtBtns(el){el.querySelectorAll('button[data-pay]').forEach(function(b){b.addEventListener('click',function(){markPaid(parseInt(b.dataset.pay))})});el.querySelectorAll('button[data-remind]').forEach(function(b){b.addEventListener('click',function(){remindDebt(parseInt(b.dataset.remind),b.dataset.name,parseFloat(b.dataset.amount))})})}
bindDebtBtns(t);bindDebtBtns(cl);}

function openDebtModal(){
if(allFarmers.length===0){showToast('请先添加农户','error');return}
document.getElementById('modal-container').innerHTML='<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><h3>新建赊账记录</h3><div class="form-group"><label>农户 <span class="required">*</span></label><select id="debt-farmer">'+allFarmers.map(function(f){return'<option value="'+f.id+'">'+esc(f.name)+' · '+esc(f.product_type)+'</option>'}).join('')+'</select></div><div class="form-row"><div class="form-group"><label>金额(元) <span class="required">*</span></label><input type="number" id="debt-amount" step="0.01" placeholder="0.00"></div><div class="form-group"><label>商品明细</label><input id="debt-product" placeholder="如：复合肥5袋"></div></div><div class="form-group"><label>描述</label><input id="debt-desc" placeholder="如：春耕赊购化肥"></div><div class="form-row"><div class="form-group"><label>赊账日期 <span class="required">*</span></label><input type="date" id="debt-borrow-date" value="'+today()+'"></div><div class="form-group"><label>到期日期 <span class="required">*</span></label><input type="date" id="debt-due-date"></div></div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" id="btn-save-debt">保存</button></div></div></div>';
document.getElementById('btn-save-debt').addEventListener('click',function(){var a=parseFloat(document.getElementById('debt-amount').value),bd=document.getElementById('debt-borrow-date').value,dd=document.getElementById('debt-due-date').value;if(!a||!bd||!dd||a<=0){showToast('请填写必填项','error');return}sqlRun('INSERT INTO debts(farmer_id,amount,description,product_detail,borrow_date,due_date) VALUES(?,?,?,?,?,?)',[parseInt(document.getElementById('debt-farmer').value),a,document.getElementById('debt-desc').value.trim(),document.getElementById('debt-product').value.trim(),bd,dd]);closeModal();loadDebts();showToast('赊账记录已添加')})}

function markPaid(id){sqlRun("UPDATE debts SET status='已还' WHERE id=?",[id]);loadDebts();loadDashboard();showToast('已标记为已还')}

function remindDebt(id,name,amount){
var d=allDebts.find(function(d){return d.id===id});
sqlRun("INSERT INTO messages(farmer_id,type,title,content,scheduled_date) VALUES(?,'账期提醒','温和还款提醒',?,?)",[d?d.farmer_id:null,name+'您好，您有一笔¥'+fmtMoney(amount)+'的农资款即将到期。收成后方便的时候来店里结算即可，不急。祝丰收！',today()]);
showToast('提醒消息已生成')}

function checkOverdue(){showConfirm('将检查所有待还赊账是否已逾期？','🔍',function(){var td=today();sqlRun("UPDATE debts SET status='逾期' WHERE due_date<? AND status='待还'",[td]);var od=db.getRowsModified();showToast('检查完成，'+od+' 笔已逾期',od>0?'error':'success');loadDebts();loadDashboard()})}

// ===== 启动 =====
try {
  initApp();
} catch(e) {
  updateLoading('初始化失败: ' + e.message, 0);
  console.error('Init Error:', e);
  document.getElementById('load-status').style.color = '#dc2626';
}

// 应用初始化后加载天气和市场价格
setTimeout(function(){loadWeather();loadMarketPrices();loadNotifyPage()},800);