// ===== IndexedDB 数据持久化 =====
// 自动将浏览器中的 SQLite 数据库保存到 IndexedDB
// 刷新页面后自动恢复，不再丢失数据

var PERSIST_DB_NAME='nongzi-crm';
var PERSIST_STORE='sqlite';
var PERSIST_KEY='db-binary';
var _savePending=false;

// 打开 IndexedDB
function openDbStore(){
  return new Promise(function(resolve,reject){
    var req=indexedDB.open(PERSIST_DB_NAME,1);
    req.onupgradeneeded=function(e){
      var db=e.target.result;
      if(!db.objectStoreNames.contains(PERSIST_STORE)){
        db.createObjectStore(PERSIST_STORE)
      }
    };
    req.onsuccess=function(e){resolve(e.target.result)};
    req.onerror=function(e){reject(e.target.error)};
  })
}

// 保存数据库到 IndexedDB（节流：500ms 内只保存一次）
function saveDb(){
  if(_savePending)return;
  _savePending=true;
  setTimeout(function(){_savePending=false},500);
  if(!db)return;
  try{
    var data=db.export(); // Uint8Array
    openDbStore().then(function(idb){
      var tx=idb.transaction(PERSIST_STORE,'readwrite');
      var store=tx.objectStore(PERSIST_STORE);
      store.put(data,PERSIST_KEY);
    }).catch(function(){})
  }catch(e){
    console.warn('数据库保存失败:',e.message)
  }
}

// 从 IndexedDB 加载数据库
function loadDb(){
  return openDbStore().then(function(idb){
    return new Promise(function(resolve,reject){
      var tx=idb.transaction(PERSIST_STORE,'readonly');
      var store=tx.objectStore(PERSIST_STORE);
      var req=store.get(PERSIST_KEY);
      req.onsuccess=function(e){
        var data=e.target.result;
        if(data){
          resolve(new Uint8Array(data))
        }else{
          resolve(null)
        }
      };
      req.onerror=function(){reject(null)}
    })
  }).catch(function(){return null})
}

// 清理持久化数据
function clearPersistedDb(){
  openDbStore().then(function(idb){
    var tx=idb.transaction(PERSIST_STORE,'readwrite');
    var store=tx.objectStore(PERSIST_STORE);
    store.delete(PERSIST_KEY);
  }).catch(function(){})
}
