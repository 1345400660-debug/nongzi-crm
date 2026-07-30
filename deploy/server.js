// 农资CRM 服务端代理 v4.1
// 息壤杯全国人工智能OPC创新大赛 · 惠民产品创新赛道
var http=require('http'),fs=require('fs'),path=require('path'),https=require('https'),zlib=require('zlib');
var root=__dirname;
var mime={'html':'text/html;charset=utf-8','js':'application/javascript','css':'text/css','png':'image/png','jpg':'image/jpeg','svg':'image/svg+xml','ico':'image/x-icon','json':'application/json','wasm':'application/wasm'};

// ===== 和风天气配置 =====
// 免费注册 → https://console.qweather.com → 创建项目 → 获取 API KEY 和 API Host
// 免费版：1000次/天，支持实时天气+7日预报+生活指数
var QW_API_KEY='398e9aab49f84b3eb94f43a2cd77b874';
var QW_API_HOST='p54ewv8juj.re.qweatherapi.com';

function fetchQWeather(apiPath){
  return new Promise(function(resolve,reject){
    var url='https://'+QW_API_HOST+apiPath;
    console.log('[qweather] '+url.substring(0,90)+'...');
    var options=require('url').parse(url);
    options.headers={'X-QW-Api-Key':QW_API_KEY,'Accept-Encoding':'gzip'};
    https.get(options,function(proxyRes){
      var chunks=[];
      var stream=proxyRes;
      if(proxyRes.headers['content-encoding']==='gzip'){
        stream=proxyRes.pipe(zlib.createGunzip());
      }
      stream.on('data',function(c){chunks.push(c)});
      stream.on('end',function(){
        var body=Buffer.concat(chunks).toString('utf-8');
        try{var d=JSON.parse(body);resolve(d)}catch(e){reject(new Error('JSON解析失败: '+body.substring(0,200)))}
      });
    }).on('error',function(e){reject(e)});
  });
}

http.createServer(function(req,res){
  var urlPath=req.url.split('?')[0];
  var qs=req.url.split('?')[1]||'';
  var params=new URLSearchParams(qs);

  // 和风天气聚合代理
  if(urlPath==='/api/qweather/weather'){
    var lat=params.get('lat'),lng=params.get('lng');
    if(!lat||!lng){res.writeHead(400,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end('{"error":"缺少经纬度参数"}');return}

    if(QW_API_KEY==='YOUR_QWEATHER_API_KEY'){
      res.writeHead(200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'});
      res.end(JSON.stringify({
        error:'未配置API KEY',
        help:'请到 https://console.qweather.com 免费注册，创建项目获取API KEY后，在 server.js 中替换 QW_API_KEY 的值'
      }));
      return;
    }

    // 并发请求三个接口
    Promise.all([
      fetchQWeather('/v7/weather/now?location='+lng+','+lat),
      fetchQWeather('/v7/weather/7d?location='+lng+','+lat),
      fetchQWeather('/v7/indices/1d?type=1,2,3,5,8,14,16&location='+lng+','+lat)
    ]).then(function(results){
      var now=results[0],day=results[1],idx=results[2];
      // 检查状态码
      if(now.code!=='200')throw new Error('实时天气API错误: '+now.code);
      if(day.code!=='200')throw new Error('预报API错误: '+day.code);
      // indices可能返回404（某些城市不支持），容错
      var result={
        now:now.now,
        daily:day.daily,
        indices:idx&&idx.code==='200'?idx.daily:[],
        updateTime:now.updateTime,
        fxLink:now.fxLink
      };
      res.setHeader('Content-Type','application/json;charset=utf-8');
      res.setHeader('Cache-Control','no-cache');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.writeHead(200);
      res.end(JSON.stringify(result));
    }).catch(function(e){
      console.error('[qweather error]',e.message);
      res.writeHead(200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'});
      res.end(JSON.stringify({error:e.message||'天气服务异常'}));
    });
    return;
  }

  // 保留旧 Open-Meteo 代理（兼容）
  if(urlPath==='/api/weather'){
    var lat2=params.get('lat'),lng2=params.get('lng');
    if(!lat2||!lng2){res.writeHead(400,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end('{"error":"missing lat/lng"}');return}
    var apiUrl='https://api.open-meteo.com/v1/forecast?latitude='+lat2+'&longitude='+lng2+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,precipitation_sum,wind_speed_10m_max,uv_index_max,sunshine_duration&timezone=Asia/Shanghai&forecast_days=7';
    https.get(apiUrl,function(proxyRes){
      var body='';proxyRes.on('data',function(c){body+=c});
      proxyRes.on('end',function(){
        res.setHeader('Content-Type','application/json;charset=utf-8');
        res.setHeader('Cache-Control','no-cache');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.writeHead(200);
        res.end(body);
      });
    }).on('error',function(e){
      res.writeHead(502,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
      res.end('{"error":"'+e.message+'"}');
    });
    return;
  }

  // 农业农村部农产品价格 API 代理
  if(urlPath==='/api/agri/prices'){
    var postData=JSON.stringify({pageNum:1,pageSize:1});
    var reqOpts=require('url').parse('https://pfsc.agri.cn/api/FarmDaily/list');
    reqOpts.method='POST';
    reqOpts.headers={
      'Content-Type':'application/json',
      'Content-Length':Buffer.byteLength(postData),
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer':'https://pfsc.agri.cn/',
      'Origin':'https://pfsc.agri.cn'
    };
    var prefReq=https.request(reqOpts,function(proxyRes){
      var body='';
      proxyRes.on('data',function(c){body+=c});
      proxyRes.on('end',function(){
        try{
          var d=JSON.parse(body);
          if(d.code===200&&d.content.list.length>0){
            var r=d.content.list[0];
            res.setHeader('Content-Type','application/json;charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin','*');
            res.setHeader('Cache-Control','max-age=3600');
            res.writeHead(200);
            res.end(JSON.stringify({
              date:r.daylyDate,
              index:{name:'农产品批发价格200指数',value:r.indexConclusion},
              animal:{text:r.animalConclusion},
              aquatic:{text:r.aquaticConclusion},
              vegetable:{text:r.vegetablesConclusion},
              fruit:{text:r.fruitsConclusion},
              topData:r.countentstr,
              source:r.source+' · 农业农村部信息中心'
            }));
          } else {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'});
            res.end(JSON.stringify({error:'暂无数据'}));
          }
        }catch(e){
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'});
          res.end(JSON.stringify({error:'解析失败'}));
        }
      });
    });
    prefReq.setTimeout(10000,function(){prefReq.destroy();res.writeHead(200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify({error:'请求超时'}))});
    prefReq.on('error',function(e){
      res.writeHead(200,{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'*'});
      res.end(JSON.stringify({error:'价格服务异常: '+e.message}));
    });
    prefReq.write(postData);
    prefReq.end();
    return;
  }

  // 静态文件
  var fp=path.join(root,req.url==='/'?'index.html':urlPath.substring(1));
  fs.readFile(fp,function(err,data){
    if(err){res.writeHead(404);res.end('404');return}
    var ext=path.extname(fp).slice(1);
    res.setHeader('Content-Type',mime[ext]||'application/octet-stream');
    res.setHeader('Cache-Control','no-cache,no-store,must-revalidate');
    res.setHeader('Pragma','no-cache');
    res.setHeader('Expires','0');
    res.writeHead(200);
    res.end(data);
  });
}).listen(3001);
console.log('Server running at http://localhost:3001/ (和风天气 + 农业农村部价格 + Open-Meteo)');
