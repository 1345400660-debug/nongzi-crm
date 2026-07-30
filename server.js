const express = require('express');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'nongzi.db');

// 种植作物周期参考
const CROP_CYCLES = {
  '水稻': { days: 150, nodes: ['播种-第1天','育秧-第25天','插秧-第35天','分蘖期-第50天','抽穗期-第90天','灌浆期-第110天','收割-第150天'] },
  '小麦': { days: 230, nodes: ['播种-第1天','出苗-第10天','分蘖-第30天','拔节-第120天','抽穗-第160天','灌浆-第190天','收割-第230天'] },
  '玉米': { days: 120, nodes: ['播种-第1天','出苗-第7天','拔节-第35天','抽雄-第60天','灌浆-第80天','成熟-第120天'] },
  '蔬菜': { days: 60, nodes: ['播种-第1天','出苗-第5天','定植-第20天','追肥-第35天','采收-第60天'] },
  '果树': { days: 365, nodes: ['萌芽-第1天','开花-第30天','坐果-第60天','套袋-第80天','施肥-第150天','采收-第280天','休眠-第365天'] },
  '茶叶': { days: 365, nodes: ['春茶萌芽-第1天','春茶采摘-第60天','修剪-第80天','夏茶采摘-第150天','秋茶采摘-第240天','冬季管理-第300天'] },
  '食用菌': { days: 90, nodes: ['接种-第1天','发菌-第20天','出菇管理-第45天','头潮采收-第60天','二潮采收-第80天'] },
  '中药材': { days: 300, nodes: ['播种-第1天','出苗-第15天','生长期-第60天','追肥-第100天','花期-第200天','采收-第300天'] },
};

const BREED_CYCLES = {
  '猪': { days: 180, nodes: ['进栏-第1天','防疫-第7天','育肥前期-第30天','育肥中期-第80天','育肥后期-第140天','出栏-第180天'] },
  '鸡': { days: 120, nodes: ['进雏-第1天','防疫-第7天','育雏期-第21天','育成期-第50天','产蛋期-第80天','淘汰-第120天'] },
  '鱼': { days: 240, nodes: ['放苗-第1天','驯食-第15天','快速生长期-第60天','水质管理-第120天','增肥期-第180天','捕捞-第240天'] },
  '牛': { days: 365, nodes: ['进栏-第1天','防疫-第10天','育肥期-第60天','精料补饲-第180天','催肥期-第300天','出栏-第365天'] },
  '羊': { days: 240, nodes: ['进栏-第1天','防疫-第5天','育肥前期-第40天','育肥中期-第100天','育肥后期-第180天','出栏-第240天'] },
  '鸭': { days: 90, nodes: ['进雏-第1天','防疫-第7天','育雏期-第21天','育肥期-第50天','出栏-第90天'] },
  '兔': { days: 90, nodes: ['进栏-第1天','防疫-第5天','育肥期-第30天','繁殖期-第50天','出栏-第90天'] },
  '虾蟹': { days: 150, nodes: ['放苗-第1天','蜕壳管理-第30天','快速生长期-第60天','水质调控-第100天','捕捞-第150天'] },
};

// ============== 数据库初始化 ==============
let db;

async function initDB() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS farmers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      category TEXT NOT NULL,
      product_type TEXT NOT NULL,
      scale TEXT,
      scale_unit TEXT,
      start_date TEXT NOT NULL,
      cycle_days INTEGER NOT NULL,
      key_nodes TEXT DEFAULT '[]',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT '待发送',
      scheduled_date TEXT,
      sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      amount REAL NOT NULL,
      description TEXT,
      product_detail TEXT,
      borrow_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT '待还',
      reminded INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ai_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER,
      farmer_name TEXT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      type TEXT NOT NULL
    )
  `);

  // 预设产品
  const count = queryOne('SELECT COUNT(*) as c FROM products');
  if (count && count.c === 0) {
    const products = [
      ['水稻种子-南粳46', '种植', '种子'], ['小麦种子-扬麦25', '种植', '种子'],
      ['玉米种子-郑单958', '种植', '种子'], ['复合肥-氮磷钾15-15-15', '种植', '肥料'],
      ['尿素-46%', '种植', '肥料'], ['有机肥-腐熟鸡粪', '种植', '肥料'],
      ['吡虫啉-杀虫剂', '种植', '农药'], ['多菌灵-杀菌剂', '种植', '农药'],
      ['草甘膦-除草剂', '种植', '农药'], ['农用薄膜-8丝', '种植', '农具'],
      ['滴灌带-16mm', '种植', '农具'], ['小猪饲料-乳猪料', '养殖', '饲料'],
      ['中猪饲料-育肥料', '养殖', '饲料'], ['蛋鸡饲料-产蛋料', '养殖', '饲料'],
      ['兽药-阿莫西林', '养殖', '兽药'], ['疫苗-猪瘟疫苗', '养殖', '疫苗'],
      ['消毒液-过氧乙酸', '养殖', '消毒'], ['鸡苗-海兰褐', '养殖', '种苗'],
      ['猪精-杜洛克', '养殖', '种苗'], ['鱼饲料-膨化料', '养殖', '饲料'],
    ];
    for (const p of products) {
      db.run('INSERT INTO products (name, category, type) VALUES (?,?,?)', p);
    }
  }

  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// SQL 工具函数
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  let result = null;
  if (stmt.step()) result = stmt.getAsObject();
  stmt.free();
  return result;
}

function execute(sql, params = []) {
  db.run(sql, params);
  saveDB();
}

function getLastId() {
  return queryOne('SELECT last_insert_rowid() as id').id;
}

// ========== API 路由 ==========

app.get('/api/dashboard', (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  // 合并统计数据查询
  const stats = queryOne(`
    SELECT
      (SELECT COUNT(*) FROM farmers) as totalFarmers,
      (SELECT COUNT(*) FROM messages WHERE status='待发送') as pendingMessages,
      (SELECT COUNT(*) FROM messages WHERE status='已发送') as sentMessages,
      (SELECT COUNT(*) FROM debts WHERE status IN ('待还','逾期')) as activeDebts,
      (SELECT COALESCE(SUM(amount),0) FROM debts WHERE status IN ('待还','逾期')) as totalDebtAmount,
      (SELECT COUNT(*) FROM debts WHERE status='逾期') as overdueDebts,
      (SELECT COUNT(*) FROM ai_chats) as recentChats
  `);
  const { totalFarmers, pendingMessages, sentMessages, activeDebts, totalDebtAmount, overdueDebts, recentChats } = stats;

  const todayNodes = queryAll(`
    SELECT f.name, f.product_type, m.title, m.content
    FROM messages m JOIN farmers f ON m.farmer_id = f.id
    WHERE m.scheduled_date = ? AND m.type = '节点提醒'
  `, [today]);

  const categoryStats = queryAll('SELECT category, COUNT(*) as c FROM farmers GROUP BY category');
  const recentActivities = queryAll(`
    SELECT '消息' as type, title as detail, created_at FROM messages
    UNION ALL
    SELECT '赊账' as type, description as detail, created_at FROM debts
    UNION ALL
    SELECT '答疑' as type, question as detail, created_at FROM ai_chats
    ORDER BY created_at DESC LIMIT 10
  `);

  res.json({
    totalFarmers, pendingMessages, sentMessages,
    activeDebts, totalDebtAmount, overdueDebts, recentChats,
    todayNodes, categoryStats, recentActivities
  });
});

// 农户 CRUD
app.get('/api/farmers', (req, res) => {
  res.json(queryAll('SELECT * FROM farmers ORDER BY created_at DESC'));
});

app.get('/api/farmers/:id', (req, res) => {
  const farmer = queryOne('SELECT * FROM farmers WHERE id = ?', [req.params.id]);
  if (!farmer) return res.status(404).json({ error: '未找到' });
  const messages = queryAll('SELECT * FROM messages WHERE farmer_id = ? ORDER BY created_at DESC', [req.params.id]);
  const debts = queryAll('SELECT * FROM debts WHERE farmer_id = ? ORDER BY created_at DESC', [req.params.id]);
  const chats = queryAll('SELECT * FROM ai_chats WHERE farmer_id = ? ORDER BY created_at DESC', [req.params.id]);
  res.json({ farmer, messages, debts, chats });
});

app.post('/api/farmers', (req, res) => {
  const { name, phone, address, category, product_type, scale, scale_unit, start_date, cycle_days, notes } = req.body;

  const cycleLib = category === '种植' ? CROP_CYCLES : BREED_CYCLES;
  const ref = cycleLib[product_type];
  let keyNodes = '[]';
  if (ref) {
    keyNodes = JSON.stringify(ref.nodes.map(n => {
      const [label, dayStr] = n.split('-第');
      return { label, day: parseInt(dayStr) };
    }));
  }

  execute('INSERT INTO farmers (name, phone, address, category, product_type, scale, scale_unit, start_date, cycle_days, key_nodes, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [name, phone || '', address || '', category, product_type, scale || '', scale_unit || '', start_date, cycle_days || (ref ? ref.days : 120), keyNodes, notes || '']);
  const farmerId = getLastId();

  // 自动生成节点提醒
  if (ref) {
    const startDate = new Date(start_date);
    ref.nodes.forEach(n => {
      const [label, dayStr] = n.split('-第');
      const nodeDate = new Date(startDate);
      nodeDate.setDate(nodeDate.getDate() + parseInt(dayStr));
      const dateStr = nodeDate.toISOString().split('T')[0];
      execute('INSERT INTO messages (farmer_id, type, title, content, scheduled_date) VALUES (?,?,?,?,?)',
        [farmerId, '节点提醒', `${label}提醒`, `农户${name}的${product_type}即将进入「${label}」阶段，建议及时备货相关农资。`, dateStr]);
    });
  }

  res.json(queryOne('SELECT * FROM farmers WHERE id = ?', [farmerId]));
});

app.put('/api/farmers/:id', (req, res) => {
  const { name, phone, address, category, product_type, scale, scale_unit, start_date, cycle_days, notes } = req.body;
  execute('UPDATE farmers SET name=?, phone=?, address=?, category=?, product_type=?, scale=?, scale_unit=?, start_date=?, cycle_days=?, notes=? WHERE id=?',
    [name, phone || '', address || '', category, product_type, scale || '', scale_unit || '', start_date, cycle_days, notes || '', req.params.id]);
  res.json(queryOne('SELECT * FROM farmers WHERE id = ?', [req.params.id]));
});

app.delete('/api/farmers/:id', (req, res) => {
  execute('DELETE FROM messages WHERE farmer_id = ?', [req.params.id]);
  execute('DELETE FROM debts WHERE farmer_id = ?', [req.params.id]);
  execute('DELETE FROM ai_chats WHERE farmer_id = ?', [req.params.id]);
  execute('DELETE FROM farmers WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// 消息管理
app.get('/api/messages', (req, res) => {
  const { type, status: msgStatus } = req.query;
  let sql = 'SELECT m.*, f.name as farmer_name, f.product_type FROM messages m JOIN farmers f ON m.farmer_id = f.id WHERE 1=1';
  const params = [];
  if (type) { sql += ' AND m.type = ?'; params.push(type); }
  if (msgStatus) { sql += ' AND m.status = ?'; params.push(msgStatus); }
  sql += ' ORDER BY m.scheduled_date ASC';
  res.json(queryAll(sql, params));
});

app.post('/api/messages', (req, res) => {
  const { farmer_id, type, title, content, scheduled_date } = req.body;
  execute('INSERT INTO messages (farmer_id, type, title, content, scheduled_date, status) VALUES (?,?,?,?,?,?)',
    [farmer_id, type, title, content, scheduled_date, '待发送']);
  res.json({ id: getLastId() });
});

app.put('/api/messages/:id/send', (req, res) => {
  execute("UPDATE messages SET status='已发送', sent_at=CURRENT_TIMESTAMP WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

app.post('/api/messages/send-today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  execute("UPDATE messages SET status='已发送', sent_at=CURRENT_TIMESTAMP WHERE scheduled_date <= ? AND status='待发送'", [today]);
  const sent = db.getRowsModified();
  res.json({ sent });
});

// 赊账管理
app.get('/api/debts', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT d.*, f.name as farmer_name FROM debts d JOIN farmers f ON d.farmer_id = f.id WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND d.status = ?'; params.push(status); }
  sql += ' ORDER BY d.due_date ASC';
  res.json(queryAll(sql, params));
});

app.post('/api/debts', (req, res) => {
  const { farmer_id, amount, description, product_detail, borrow_date, due_date } = req.body;
  execute('INSERT INTO debts (farmer_id, amount, description, product_detail, borrow_date, due_date) VALUES (?,?,?,?,?,?)',
    [farmer_id, amount, description, product_detail || '', borrow_date, due_date]);
  res.json({ id: getLastId() });
});

app.put('/api/debts/:id', (req, res) => {
  const { status } = req.body;
  execute('UPDATE debts SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ success: true });
});

app.post('/api/debts/check-overdue', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  execute("UPDATE debts SET status='逾期' WHERE due_date < ? AND status='待还'", [today]);
  const overdue = db.getRowsModified();
  res.json({ overdue });
});

// AI 答疑
app.post('/api/chat', (req, res) => {
  const { farmer_id, farmer_name, question, product_type, category } = req.body;
  // 空值保护
  if (!question || !question.trim()) {
    return res.status(400).json({ error: '问题不能为空', answer: '请描述您遇到的具体问题。' });
  }
  // 编码验证：必须包含中文字符，防止编码损坏的乱码存入数据库
  if (!/[\u4e00-\u9fff\u3400-\u4dbf]/.test(question)) {
    return res.status(400).json({ error: '编码异常', answer: '输入内容编码异常，请重新输入您的问题。' });
  }
  const safeQuestion = question.trim().slice(0, 500); // 限制长度防注入
  const answer = generateAIAnswer(safeQuestion, product_type || '', category || '');
  execute('INSERT INTO ai_chats (farmer_id, farmer_name, question, answer) VALUES (?,?,?,?)',
    [farmer_id || null, (farmer_name || '匿名农户').slice(0, 50), safeQuestion, answer]);
  res.json({ id: getLastId(), answer });
});

app.get('/api/chats', (req, res) => {
  res.json(queryAll('SELECT * FROM ai_chats ORDER BY created_at DESC LIMIT 50'));
});

// 清理编码损坏的聊天记录（一次性，通过 GLOB 匹配非中文字符）
app.post('/api/cleanup-garbled', (req, res) => {
  const garbled = queryAll(`SELECT id, question FROM ai_chats WHERE question NOT GLOB '*[一-龥]*'`);
  if (garbled.length > 0) {
    const ids = garbled.map(r => r.id);
    execute(`DELETE FROM ai_chats WHERE id IN (${ids.join(',')})`);
    res.json({ deleted: ids.length, records: garbled.map(r => r.question) });
  } else {
    res.json({ deleted: 0, records: [] });
  }
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    res.json(queryAll('SELECT * FROM products WHERE category = ?', [category]));
  } else {
    res.json(queryAll('SELECT * FROM products'));
  }
});

// 静态数据缓存（减少重复序列化）
const _cyclesJson = JSON.stringify({ crops: CROP_CYCLES, breeds: BREED_CYCLES });
app.get('/api/cycles', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send(_cyclesJson);
});

// AI 回答生成器（增强版 — 覆盖全部 8 种作物 + 8 种养殖品类）
function generateAIAnswer(question, productType, category) {
  // 空值保护
  if (!question || !question.trim()) {
    return '请描述您遇到的具体问题，我会尽力帮您解答。您可以告诉我作物/动物的具体症状、发生时间和已采取措施。';
  }
  const q = question.trim().toLowerCase();
  const crop = productType || '';
  const cat = category || '';

  // ========== 种植 — 病虫害诊断 ==========
  if (q.includes('病') || q.includes('虫') || q.includes('黄') || q.includes('枯') || q.includes('斑') || q.includes('烂') || q.includes('萎') || q.includes('霉') || q.includes('飞虱') || q.includes('螟') || q.includes('蚜') || q.includes('螨')) {
    const pestDB = {
      '水稻': `水稻病虫害防治建议：
• 稻瘟病（叶瘟/穗颈瘟）：三环唑 100g/亩 或 稻瘟灵 80ml/亩，破口期和齐穗期各喷1次
• 纹枯病：井冈霉素 150ml/亩，分蘖末期至孕穗期防治
• 稻飞虱：吡虫啉 10g + 异丙威 100ml/亩，对准稻株基部喷雾
• 二化螟/三化螟：氯虫苯甲酰胺 10ml/亩，枯鞘期用药
• 胡麻斑病：多菌灵 100g/亩，缺钾田块增施钾肥
💡 预防：合理密植、浅水灌溉、避免偏施氮肥，收割后翻耕灭茬`,

      '小麦': `小麦病虫害防治建议：
• 赤霉病（扬花期关键！）：戊唑醇+咪鲜胺 40ml/亩，见花就打，雨后补喷
• 条锈病：三唑酮 50g/亩，发病初期用药，7-10天后再喷1次
• 白粉病：三唑酮或嘧菌酯，注意田间通风透光
• 蚜虫：吡虫啉 20g/亩 或 啶虫脒，穗期重点防治
• 纹枯病：井冈霉素 150ml/亩
💡 预防：选用抗病品种、合理轮作、增施磷钾肥增强抗性`,

      '玉米': `玉米病虫害防治建议：
• 玉米螟：心叶末期用辛硫磷颗粒剂丢心，穗期用Bt制剂
• 大斑病/小斑病：代森锰锌 100g/亩 或 苯醚甲环唑预防
• 蚜虫：吡虫啉 20g/亩，抽雄期重点防治
• 草地贪夜蛾：甲维盐+茚虫威，傍晚施药效果好
• 茎基腐病：多菌灵灌根，雨后及时排水
💡 预防：合理密植、轮作倒茬、收获后清除秸秆`,

      '蔬菜': `蔬菜病虫害防治建议：
• 霜霉病（黄瓜/白菜）：烯酰吗啉+霜脲氰，大棚注意通风降湿
• 白粉病（瓜类/茄果）：三唑酮 或 硫磺悬浮剂
• 蚜虫/粉虱：吡虫啉 + 挂黄板诱杀（物理防治优先）
• 菜青虫/小菜蛾：Bt制剂（生物农药）或 高效氯氟氰菊酯
• 根结线虫：阿维菌素灌根 + 夏季高温闷棚
• 灰霉病（番茄/草莓）：腐霉利 或 嘧霉胺，摘除病果病叶
💡 预防：轮作换茬、土壤消毒、大棚通风、清洁田园`,

      '果树': `果树病虫害防治建议：
• 腐烂病（苹果/梨）：刮除病斑→涂抹843康复剂 或 腐殖酸铜
• 轮纹病/炭疽病：甲基托布津 800倍液，套袋前重点喷
• 食心虫（桃小/梨小）：高效氯氟氰菊酯，成虫发生期用药
• 红蜘蛛：阿维菌素+哒螨灵，高温干燥季节易爆发
• 蚧壳虫：噻嗪酮 或 矿物油（休眠期用）
• 早期落叶病：代森锰锌预防，雨季每10-15天喷1次
💡 预防：冬季清园涂白、合理修剪通风、增施有机肥增强树势`,

      '茶叶': `茶园病虫害防治建议（注意农残安全间隔期！）：
• 茶小绿叶蝉：苦参碱（生物农药）或 联苯菊酯，安全间隔期7天
• 灰茶尺蠖：Bt制剂（生物农药，无安全间隔期）
• 茶炭疽病：苯醚甲环唑，安全间隔期14天
• 茶饼病：氢氧化铜 或 波尔多液预防
• 茶毛虫：高效氯氰菊酯，幼虫期用药
• 茶橙瘿螨：矿物油 或 炔螨特
⚠ 采摘前7-14天必须停药！冬季封园喷石硫合剂(0.5-1波美度)降低来年虫口。
💡 预防：分批勤采、合理修剪、保护天敌（蜘蛛/瓢虫）、增施有机肥`,

      '食用菌': `食用菌常见问题诊断：
• 绿霉/木霉污染：降低湿度至85%以下，清除污染菌袋，撒石灰消毒
• 链孢霉：保持菇房卫生，用漂白粉或过氧乙酸环境消毒
• 菇蚊/菇蝇：挂黄板+杀虫灯诱杀，出菇期尽量不用药
• 细菌性斑点病：降低菇房湿度，加强通风，病菇及时摘除
• 不出菇/畸形菇：检查温湿度是否适宜、光照是否合适、通风是否足够
💡 预防：无菌操作接种、培养料彻底灭菌、菇房定期消毒`,

      '中药材': `中药材病虫害防治建议（注意：中药材禁用高毒高残留农药！）：
• 根腐病（丹参/黄芪）：恶霉灵灌根 + 高垄种植防积水
• 白粉病（板蓝根/金银花）：硫磺悬浮剂或嘧菌酯
• 蚜虫：吡虫啉（安全间隔期14天）或 苦参碱（生物农药）
• 斑枯病（桔梗/白术）：代森锰锌预防，发病初期用苯醚甲环唑
• 地下害虫（蛴螬/地老虎）：辛硫磷颗粒剂土壤处理
💡 预防：轮作（忌连作）、土壤消毒、增施腐熟有机肥、选无病种苗`,
    };
    if (pestDB[crop]) return pestDB[crop];
    if (cat === '种植') {
      return `根据您的描述，可能是${crop}病虫害问题。建议：
1）先确认具体症状（病斑颜色/形状/部位、有无虫体）
2）搜索「${crop} 常见病虫害图谱」对照确认
3）携带病样/虫样到店咨询，便于准确诊断
4）预防：合理轮作、土壤消毒、选用抗病品种是关键`;
    }
    // 养殖类病虫害 → 走养殖专项路径
  }

  // ========== 种植 — 施肥管理 ==========
  if (q.includes('肥') || q.includes('施') || q.includes('追') || q.includes('营养') || q.includes('底肥') || q.includes('基肥')) {
    const fertDB = {
      '水稻': `水稻施肥方案：
1）基肥（整地时）：复合肥 25-30kg/亩
2）分蘖肥（插秧后7-10天）：尿素 8-10kg/亩
3）穗肥（抽穗前15天）：尿素 5kg + 氯化钾 5kg/亩
4）粒肥（齐穗后）：磷酸二氢钾 200g/亩叶面喷施
⚠ 后期不宜过量施氮，否则贪青晚熟、易倒伏`,

      '小麦': `小麦施肥方案：
1）基肥（播种前）：复合肥 30-40kg + 有机肥 1000-1500kg/亩
2）返青拔节肥（3月）：尿素 10-15kg/亩（增产关键期！）
3）孕穗肥：尿素 5kg/亩
4）灌浆期：磷酸二氢钾 200g/亩叶面喷施
💡 拔节期是小麦需肥最大时期，此时追肥增产效果最明显`,

      '玉米': `玉米施肥方案：
1）基肥：复合肥 25-30kg/亩 + 有机肥
2）拔节肥（7-8叶）：尿素 10-15kg/亩
3）大喇叭口期（最关键！）：尿素 15-20kg/亩 + 氯化钾 5kg/亩
4）灌浆期：磷酸二氢钾 200g/亩
💡 追肥后及时覆土浇水，提高肥料利用率；大喇叭口期缺肥减产20%以上`,

      '蔬菜': `大棚蔬菜施肥方案：
1）基肥：腐熟有机肥 2000-3000kg/亩 + 复合肥 30kg/亩
2）提苗肥（定植后5-7天）：尿素 5-8kg/亩（兑水浇施）
3）开花坐果肥：复合肥 15-20kg/亩 + 硫酸钾 10kg/亩
4）采收期（每15-20天）：水溶肥 5-8kg/亩随水冲施
💡 叶面补充：花果期喷施硼肥+磷酸二氢钾，提高坐果率和品质`,

      '果树': `果树全年施肥方案：
1）萌芽肥（3月）：高氮复合肥 30-40kg/亩
2）花后肥（5月）：复合肥 20kg + 硼锌微肥
3）膨果肥（6-7月）：高钾复合肥 30-40kg/亩（决定果实大小！）
4）秋施基肥（9-10月）：腐熟有机肥 2000-3000kg + 复合肥 50kg/亩（全年最重要的一次施肥！）
💡 秋施基肥决定来年花芽质量和产量，占全年施肥量60%以上`,

      '茶叶': `茶园施肥方案：
1）春茶催芽肥（2月底）：尿素 15-20kg/亩（来源[4]）
2）夏茶追肥（5月）：复合肥 20-25kg/亩
3）秋茶追肥（7月）：复合肥 15-20kg/亩
4）冬季基肥（10-11月）：饼肥 200-300kg/亩 + 复合肥 50kg/亩（来源[4][5]）
💡 追肥开沟深施（10-15cm），施后覆土；饼肥须先腐熟`,

      '食用菌': `食用菌营养管理：
• 培养料配方（平菇为例）：棉籽壳78% + 麸皮20% + 石灰1% + 石膏1%
• 含水量控制：培养料含水量60-65%（手捏滴水但不流）
• pH值：大多数食用菌适宜pH 5.5-6.5
• 出菇期：一般不追肥，靠培养料提供养分
• 覆土材料：草炭土或消毒过的菜园土
💡 培养料碳氮比(C/N)是关键，一般要求30:1-40:1`,

      '中药材': `中药材施肥建议：
1）基肥：腐熟有机肥 1500-2000kg/亩 + 复合肥 25-30kg/亩
2）苗期追肥（定苗后）：尿素 5-8kg/亩
3）生长旺盛期：复合肥 15-20kg/亩 + 钾肥
4）根茎类（丹参/黄芪）膨大期多施钾肥，叶花类（金银花/菊花）多施氮肥
⚠ 采收前30天停止追肥，避免硝酸盐残留超标`,
    };
    if (fertDB[crop]) return fertDB[crop];
    if (cat === '种植') {
      return `关于${crop}施肥，建议：
1）底肥以有机肥为主（腐熟农家肥或商品有机肥），搭配复合肥
2）追肥分2-3次，分别在苗期、旺长期和${crop.includes('果') ? '膨果' : '产量形成'}期
3）叶面肥可在关键期补充微量元素（硼/锌/磷酸二氢钾）
4）具体用量需根据土壤肥力和目标产量调整，欢迎到店咨询测土配方`;
    }
  }

  // ========== 养殖 — 疾病诊断 ==========
  if (cat === '养殖') {
    if (q.includes('拉稀') || q.includes('腹泻') || q.includes('拉肚子')) {
      const diarrheaDB = {
        '猪': `猪腹泻原因分析：
• 病毒性腹泻(PED/TGE)：整窝发病、呕吐+水样腹泻、死亡率高→立即隔离+补液+联系兽医
• 细菌性（大肠杆菌）：黄白痢，仔猪多发→恩诺沙星 5mg/kg体重
• 饲料性：换料过快或霉变→停料12小时，逐步过渡
• 仔猪保温：25-28℃，温差不超过3℃
💡 补液配方：食盐3.5g+小苏打2.5g+氯化钾1.5g+葡萄糖20g+水1升，自由饮用`,

        '鸡': `鸡腹泻常见原因：
• 球虫病：血便、盲肠肿大→地克珠利 或 妥曲珠利
• 大肠杆菌：黄绿色稀便→氟苯尼考饮水
• 饲料盐分过高或霉变→检查饲料，更换新鲜料
• 饮水不洁→清洗饮水器，加电解多维
💡 雏鸡注意保温(32-35℃第一周，每周降2-3℃)和大肠杆菌预防`,

        '鱼': `鱼肠炎病：
• 症状：肛门红肿突出、肠道充血、离群独游
• 治疗：磺胺嘧啶 100mg/kg鱼体重 拌料投喂，连用5-7天
• 停食1-2天后再少量投喂药饵
• 检查饲料是否有霉变
💡 预防：不投喂变质饲料，定期在饲料中添加大蒜素(1-2%)`,

        '牛': `牛腹泻排查：
1）量体温→超过40℃可能感染
2）检查饲料→霉变、青贮过酸是常见原因
3）犊牛白痢：恩诺沙星注射 2.5mg/kg
4）成年牛消化不良：停料12小时，灌服健胃散
5）补液防脱水（口服补液盐自由饮用）
💡 犊牛出生后1小时内必须吃到初乳！`,
      };
      if (diarrheaDB[crop]) return diarrheaDB[crop];
    }

    if (q.includes('不吃') || q.includes('食欲') || q.includes('厌食') || q.includes('减料')) {
      const appetiteDB = {
        '猪': `猪食欲下降排查：
1）测体温→发烧说明有感染（正常38.5-39.5℃）
2）观察粪便→便秘或拉稀都是异常信号
3）饲料霉变→夏季高温高湿最易发生，检查料槽底部
4）热应激→气温>30℃时采食量骤降，加强通风降温
5）群体性减料→怀疑传染病（非洲猪瘟/蓝耳病），立即报告兽医！
💡 饮水中添加电解多维+小苏打0.3%缓解热应激`,

        '鸡': `鸡采食量下降排查：
1）热应激（>28℃）→加强通风，饮水中加VC 200mg/L
2）饲料适口性差→检查是否霉变、粉碎过细
3）疾病→观察鸡冠颜色（苍白=贫血/寄生虫，发紫=缺氧/呼吸道）
4）断喙/转群应激→添加电解多维缓解
5）产蛋鸡钙不足→补石粉或贝壳粉`,

        '牛': `牛食欲下降+反刍减少：
• 正常牛每天反刍6-8小时，咀嚼40-60次/食团
• 瘤胃积食→停料12小时，灌服石蜡油500-1000ml（来源[6]）
• 前胃弛缓→新斯的明 4-5mg/头 皮下注射
• 精料酸中毒→口服小苏打 100-200g + 温水灌服
💡 日精料量不超过体重1%，保证粗饲料供应（来源[6]）`,
      };
      if (appetiteDB[crop]) return appetiteDB[crop];
    }

    if (q.includes('饲料') || q.includes('喂') || q.includes('配方') || q.includes('口粮')) {
      const feedDB = {
        '猪': `生猪各阶段饲料方案：
• 乳猪（7日龄-15kg）：乳猪料，粗蛋白≥18%
• 小猪（15-30kg）：小猪料，粗蛋白≥16%，约140元/40kg袋
• 中猪（30-60kg）：中猪料，粗蛋白≥15%，约130元/40kg袋
• 大猪（60kg-出栏）：大猪料，粗蛋白≥14%，约125元/40kg袋
💡 更换饲料需5-7天过渡（新料比例从25%→50%→75%→100%）`,

        '鸡': `蛋鸡各阶段饲料方案：
• 雏鸡料（0-6周）：粗蛋白≥19%，约180元/40kg袋
• 青年鸡料（7-18周）：粗蛋白≥15%，约120元/40kg袋
• 产蛋前期料（19-35周）：粗蛋白≥17% + 钙3.5%，约130元/40kg袋
• 产蛋高峰料（36-55周）：粗蛋白≥16.5% + 钙3.8%
• 产蛋后期料（56周+）：粗蛋白≥15.5%，控制体重
💡 产蛋期饲料钙含量是关键，不足会产软壳蛋和瘫痪`,

        '鱼': `池塘养鱼投喂指南：
• 日投喂量 = 鱼体重的 2-5%（水温低时减量）
• 投喂频率：鱼苗阶段4-6次/天，成鱼2-3次/天
• "四定"原则：定时、定位、定质、定量
• 观察投喂：80%鱼吃饱游走即停喂（八成饱最经济）
• 阴雨天/水质差/鱼生病→减料或停料
💡 投喂后30分钟检查食台，无残饵=投喂量刚好`,

        '牛': `肉牛精料配方（来源[6]湖北省农业农村厅）：
• 玉米 60% + 豆粕 20% + 麸皮 15% + 预混料 5%
• 日精料量不超过体重 1%（500kg牛日喂≤5kg精料）
• 保证充足粗饲料（玉米秸秆青贮、酒糟、干草）
• 自由采食盐砖（补充钠和微量元素）
💡 从粗料到精料逐步过渡，精料骤增易酸中毒！`,

        '羊': `肉羊饲养方案：
• 精料配方：玉米55% + 豆粕20% + 麸皮20% + 预混料5%
• 日精料量：育肥羊 0.3-0.5kg/天
• 粗饲料：优质干草/青贮/秸秆氨化处理后自由采食
• 每天保证充足清洁饮水
💡 羊是草食动物，粗饲料占比不低于日粮的70%`,

        '鸭': `肉鸭各阶段饲料：
• 雏鸭料（0-3周）：粗蛋白≥20%，约175元/40kg袋
• 中鸭料（4-5周）：粗蛋白≥17%，约135元/40kg袋
• 育肥料（6周-出栏）：粗蛋白≥15%，约125元/40kg袋
💡 鸭采食后需充足饮水（鸭是水禽，无水不吃料）`,

        '兔': `肉兔饲料方案：
• 精料配方：玉米25% + 豆粕18% + 麸皮20% + 草粉35% + 预混料2%
• 日喂量：成年兔 100-150g/天（早晚各一次）
• 粗饲料：优质干草（苜蓿/黑麦草）自由采食
• 幼兔断奶后逐步增加精料，避免突然换料
💡 兔对霉变饲料极敏感，黄曲霉毒素可致死！`,

        '虾蟹': `虾蟹投喂管理：
• 对虾配合饲料：粗蛋白 38-42%，每天投喂3-5次
• 投喂量：前期体重的8-10%，后期3-5%
• 傍晚投喂量占全天60%（虾蟹夜间活动觅食）
• 投喂后2小时检查食台，残饵>30%→减料
💡 蜕壳期减料或停料，蜕壳完成后增加营养补充钙质`,
      };
      if (feedDB[crop]) return feedDB[crop];
    }

    if (q.includes('防疫') || q.includes('疫苗') || q.includes('消毒') || q.includes('免疫')) {
      const vaccDB = {
        '猪': `生猪免疫程序（参考）：
• 猪瘟：仔猪20-25日龄首免，60日龄二免
• 口蹄疫O/A型：50日龄首免，30天后二免（春秋各1次）
• 蓝耳病：14日龄首免（根据猪场情况选做）
• 伪狂犬：3日龄滴鼻，70日龄肌注
• 副猪嗜血杆菌（来源[7]：猪场阳性率53.91%）：30日龄首免
💡 疫苗在2-8℃冷藏，稀释后2小时内用完；消毒用2%烧碱或过氧乙酸`,

        '鸡': `蛋鸡免疫程序：
• 马立克：1日龄颈部皮下注射
• 新城疫：7日龄首免(II系苗滴眼)，21日龄二免
• 禽流感H5+H7（强制免疫）：14日龄首免，间隔3-4周二免
• 法氏囊：14日龄饮水免疫
• 传染性支气管炎：7日龄滴眼
💡 疫苗前后3天饮水中勿添加消毒剂，免疫期间避免应激`,

        '牛': `肉牛防疫重点：
• 口蹄疫O/A型（强制免疫）：春秋各1次（间隔2-3周加强）
• 牛出败（巴氏杆菌）：每年1次
• 牛传染性支原体肺炎（来源[7]）：高发区每4-6个月免疫
• 驱虫：春秋各1次，伊维菌素皮下注射或阿苯达唑口服
💡 新进牛隔离观察30天，确认健康后方可混群`,

        '羊': `羊防疫要点：
• 口蹄疫O/A型：春秋各1次
• 羊痘：每年1次（春季）
• 三联四防（快疫/猝狙/肠毒血症/羔羊痢疾）：春秋各1次
• 小反刍兽疫（PPR）：每年1次（国家强制免疫）
• 驱虫：春秋各1次（伊维菌素+阿苯达唑）
💡 圈舍每周消毒1-2次，交替使用不同消毒剂`,

        '鱼': `鱼病预防措施：
• 鱼塘消毒：生石灰 100-150kg/亩·米 全池泼洒（清塘时）
• 鱼种消毒：3-5%食盐水浸泡5-10分钟（放养前）
• 工具消毒：高锰酸钾溶液浸泡
• 发病季节：每15天用漂白粉1ppm全池泼洒预防细菌病
💡 预防重于治疗！定期检测水质（氨氮<0.2、亚硝酸盐<0.1、溶氧>5mg/L）`,
      };
      if (vaccDB[crop]) return vaccDB[crop];
    }

    // 养殖通用回退
    if (pestDB[crop]) return pestDB[crop];
    return `${crop}养殖建议：
1）保持圈舍通风干燥，冬季保温夏季防暑降温
2）每天观察采食量、饮水量和精神状态，发现异常早处理
3）做好日常记录（采食量/体重/用药/免疫），便于问题追溯
4）有具体问题欢迎随时到店咨询，也可帮忙联系镇畜牧兽医站`;
  }

  // ========== 通用话题 ==========
  if (q.includes('天气') || q.includes('气候') || q.includes('高温') || q.includes('寒潮') || q.includes('暴雨') || q.includes('干旱')) {
    return `近期天气对农事的影响与应对：
1）关注当地气象台发布的天气预报和农业气象灾害预警
2）高温(>35℃)：田间加深水层降温、大棚加大通风、畜禽舍喷雾降温
3）连续阴雨：清沟排渍、抢晴防治病害（稻瘟病/霜霉病/赤霉病高发）
4）寒潮/霜冻：大棚加固覆膜、果园熏烟防霜、畜禽舍防风保温
5）干旱：节水灌溉（滴灌/管灌）、覆盖保墒、叶面喷施抗旱剂
💡 加入镇上农技微信群，接收每日天气和农事提醒`;

  }

  if (q.includes('价格') || q.includes('行情') || q.includes('市场') || q.includes('多少钱') || q.includes('报价')) {
    return '当前农资参考价格（2026年7月，随时波动）：\n• 尿素(46%)：~95元/50kg袋\n• 复合肥(15-15-15)：~155-175元/50kg袋\n• 过磷酸钙(12%)：~35元/50kg袋\n• 磷酸二铵(64%)：~205-238元/50kg\n• 豆粕：~2.7-2.9元/kg\n\n具体以当日到店报价为准，大宗购买有优惠。如需了解特定产品价格和库存，欢迎来店或电话咨询。';
  }

  if (q.includes('你好') || q.includes('您好') || q.includes('谢谢')) {
    return '您好！我是农技AI助手，很高兴为您服务。有什么种植养殖方面的问题尽管问，我会尽力帮您解答！';
  }

  return `关于「${q.slice(0, 50)}」的问题，我理解您的关切。${crop ? `针对${crop}${cat === '种植' ? '种植' : '养殖'}方面` : ''}，建议：
1）先确认具体症状/表现和时间节点（什么时候开始的？）
2）可以参考${cat === '种植' ? '当地农技推广站或农业农村部发布的技术指导意见' : '乡镇畜牧兽医站或动物疫病防控中心的专业建议'}
3）如需相关农资产品，欢迎到店选购
4）问题复杂的话建议带样品到店和老板详细沟通，也可帮忙联系县里专家`;
}

// ========== 启动 ==========
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`农资CRM系统已启动: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
