// ===== 消息推送模拟 =====
function loadNotifyPage(){
  renderNotifyStats();
  renderNotifyTemplates();
}

function renderNotifyStats(){
  var msgsSent=sqlOne("SELECT COUNT(*) as c FROM messages WHERE status='已发送'").c||0;
  var msgsTotal=sqlOne("SELECT COUNT(*) as c FROM messages").c||0;
  var msgsPending=msgsTotal-msgsSent;
  var debtsReminded=sqlOne("SELECT COUNT(*) as c FROM messages WHERE type='账期提醒'").c||0;
  var nodeReminders=sqlOne("SELECT COUNT(*) as c FROM messages WHERE type='节点提醒'").c||0;
  var el=document.getElementById('notify-stats-content');
  if(!el)return;
  el.innerHTML='<div class="stat-row"><span>📬 总消息数</span><b>'+msgsTotal+'</b></div>'+
    '<div class="stat-row"><span>✅ 已推送</span><b style="color:var(--primary)">'+msgsSent+'</b></div>'+
    '<div class="stat-row"><span>⏳ 待推送</span><b style="color:var(--accent)">'+msgsPending+'</b></div>'+
    '<div class="stat-row"><span>📅 节点提醒</span><b>'+nodeReminders+'</b></div>'+
    '<div class="stat-row"><span>💰 账期提醒</span><b>'+debtsReminded+'</b></div>'+
    '<div class="stat-row"><span>📱 模拟渠道</span><b>短信+微信+APP推送</b></div>';
}

function renderNotifyTemplates(){
  var el=document.getElementById('notify-templates');
  if(!el)return;
  var tpls=[
    {title:'节点提醒模板',preview:'【农资CRM】{农户姓名}您好，您的{品类}即将进入{节点名称}阶段。建议及时备货相关农资。回复TD退订',channel:'短信'},
    {title:'账期温和提醒',preview:'{农户姓名}您好，您在清溪农资店有一笔¥{金额}的{商品}款即将到期。收成后方便的时候来店里结算即可，不急。祝丰收！',channel:'微信'},
    {title:'农技知识推送',preview:'【农技小课堂】{品类}当前阶段管理要点：{要点内容}。有疑问随时到店咨询或使用农技AI答疑。',channel:'APP'},
    {title:'新品到货通知',preview:'{农户姓名}您好！店里新到了{产品名称}，品质好价格优。需要的话给您预留？',channel:'微信'},
    {title:'天气预警通知',preview:'【农资CRM】天气预报：{日期}{天气状况}，温度{温度范围}。建议：{农事建议}。注意安全！',channel:'短信'}
  ];
  el.innerHTML=tpls.map(function(t,i){return'<div class="tpl-item" onclick="previewNotify('+i+')"><div class="tpl-title">'+t.title+' <span class="tag tag-gray" style="float:right">'+t.channel+'</span></div><div class="tpl-preview">'+t.preview+'</div></div>'}).join('')
}

function previewNotify(idx){
  var tpls=['播种育秧提醒','温和还款提醒','农技知识','新品到货','天气预警'];
  addPhoneNotify(tpls[idx]+'已模拟发送至张建国的手机','app')
}

function addPhoneNotify(msg,type){
  var el=document.getElementById('phone-notifs');if(!el)return;
  var icons={sms:'📩',wechat:'💬',app:'🌾'},names={sms:'短信',wechat:'微信',app:'农资CRM'},cls='n-'+type;
  var d=new Date(),t=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');
  el.innerHTML='<div class="phone-notif '+cls+'"><span class="n-type n-type-'+type+'">'+icons[type]+' '+names[type]+'</span><span class="n-time">'+t+'</span><div class="n-body">'+msg+'</div></div>'+el.innerHTML
}

function sendNotifyToAll(){
  showConfirm('确定向全部 <b>'+allFarmers.length+'</b> 户农户推送今日提醒？<br><small style="color:var(--text2)">将模拟通过短信+微信+APP三个渠道同步推送</small>','📤',function(){
    addPhoneNotify('已向'+allFarmers.length+'户农户推送今日节点提醒（模拟）','app');
    addPhoneNotify('王德发：小麦灌浆期-浇水追肥提醒已送达','sms');
    addPhoneNotify('李秀莲：猪育肥后期-催肥方案已推送','wechat');
    showToast('模拟推送完成！'+allFarmers.length+'户农户已收到通知')
  })
}
