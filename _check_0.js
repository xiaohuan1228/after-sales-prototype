
// ===== 省市站 三级数据 =====
const siteTree = {
  '北京市': {
    '北京市辖区': ['北京亦庄站点','北京中关村站','北京通州站','北京海淀站']
  },
  '上海市': {
    '上海市辖区': ['上海浦东站','上海徐汇站','上海嘉定站']
  },
  '湖北省': {
    '武汉市': ['武汉光谷站','武汉江汉站'],
    '宜昌市': ['宜昌站点']
  },
  '天津市': {
    '天津市辖区': ['天津滨海站','天津河西站']
  },
  '广东省': {
    '广州市': ['广州番禺站','广州天河站'],
    '深圳市': ['深圳南山站','深圳宝安站']
  }
};

// ===== Cascader 单框三级联动 =====
var _cascaderOpen = false;
var _cascaderSel = { province: '', city: '', station: '' };
window._cascaderValue = '';

function initCascader() {
  var col1 = document.getElementById('cascaderCol1');
  col1.innerHTML = '';
  Object.keys(siteTree).forEach(function(p) {
    var item = document.createElement('div');
    item.className = 'cascader-col-item';
    item.innerHTML = p + '<span class="cascader-item-arrow">›</span>';
    item.onclick = function(e) { e.stopPropagation(); selectCascaderProvince(p); };
    col1.appendChild(item);
  });
}

function selectCascaderProvince(p) {
  _cascaderSel.province = p;
  _cascaderSel.city = '';
  _cascaderSel.station = '';
  window._cascaderValue = '';
  // 高亮省列
  document.querySelectorAll('#cascaderCol1 .cascader-col-item').forEach(function(el) {
    el.classList.toggle('active', el.textContent.trim().startsWith(p));
  });
  // 渲染市列
  var col2 = document.getElementById('cascaderCol2');
  var col3 = document.getElementById('cascaderCol3');
  col2.innerHTML = '';
  col3.innerHTML = '';
  var cities = siteTree[p] || {};
  Object.keys(cities).forEach(function(c) {
    var item = document.createElement('div');
    item.className = 'cascader-col-item';
    item.innerHTML = c + '<span class="cascader-item-arrow">›</span>';
    item.onclick = function(e) { e.stopPropagation(); selectCascaderCity(p, c); };
    col2.appendChild(item);
  });
}

function selectCascaderCity(p, c) {
  _cascaderSel.city = c;
  _cascaderSel.station = '';
  window._cascaderValue = '';
  // 高亮市列
  document.querySelectorAll('#cascaderCol2 .cascader-col-item').forEach(function(el) {
    el.classList.toggle('active', el.textContent.trim().startsWith(c));
  });
  // 渲染站点列
  var col3 = document.getElementById('cascaderCol3');
  col3.innerHTML = '';
  var stations = (siteTree[p] || {})[c] || [];
  stations.forEach(function(s) {
    var item = document.createElement('div');
    item.className = 'cascader-col-item';
    item.textContent = s;
    item.onclick = function(e) { e.stopPropagation(); selectCascaderStation(p, c, s); };
    col3.appendChild(item);
  });
}

function selectCascaderStation(p, c, s) {
  _cascaderSel.station = s;
  window._cascaderValue = s;
  // 高亮站点列
  document.querySelectorAll('#cascaderCol3 .cascader-col-item').forEach(function(el) {
    el.classList.toggle('active', el.textContent === s);
  });
  // 更新触发器文字
  var label = document.getElementById('cascaderLabel');
  label.textContent = p + ' / ' + c + ' / ' + s;
  label.className = 'cascader-selected';
  closeCascader();
}

function toggleCascader() {
  if (_cascaderOpen) { closeCascader(); } else { openCascader(); }
}

function openCascader() {
  _cascaderOpen = true;
  document.getElementById('cascaderPanel').classList.add('open');
  document.getElementById('cascaderTrigger').classList.add('open');
  document.getElementById('cascaderWrap').classList.add('open');
  // 恢复上次选中高亮
  if (_cascaderSel.province) { selectCascaderProvince(_cascaderSel.province); }
  if (_cascaderSel.city) { selectCascaderCity(_cascaderSel.province, _cascaderSel.city); }
}

function closeCascader() {
  _cascaderOpen = false;
  document.getElementById('cascaderPanel').classList.remove('open');
  document.getElementById('cascaderTrigger').classList.remove('open');
  document.getElementById('cascaderWrap').classList.remove('open');
}

function clearCascader() {
  _cascaderSel = { province: '', city: '', station: '' };
  window._cascaderValue = '';
  var label = document.getElementById('cascaderLabel');
  label.textContent = '省/市/站点';
  label.className = 'cascader-placeholder';
  document.getElementById('cascaderCol1').innerHTML = '';
  document.getElementById('cascaderCol2').innerHTML = '';
  document.getElementById('cascaderCol3').innerHTML = '';
  initCascader();
  initMhCascader();
  initMpCascader();
  closeCascader();
}

// 点击面板外关闭（工单页）
document.addEventListener('click', function(e) {
  var wrap = document.getElementById('cascaderWrap');
  if (wrap && !wrap.contains(e.target)) { closeCascader(); }
  var mhWrap = document.getElementById('mhCascaderWrap');
  if (mhWrap && !mhWrap.contains(e.target)) { closeMhCascader(); }
  var mpWrap = document.getElementById('mpCascaderWrap');
  if (mpWrap && !mpWrap.contains(e.target)) { closeMpCascader(); }
});

// ===== 保养历史 Cascader =====
var _mhCascaderOpen = false;
var _mhCascaderSel = { province: '', city: '', station: '' };
window._mhCascaderValue = '';
function initMhCascader() {
  var col1 = document.getElementById('mhCascaderCol1');
  if (!col1) return;
  col1.innerHTML = '';
  Object.keys(siteTree).forEach(function(p) {
    var item = document.createElement('div');
    item.className = 'cascader-col-item';
    item.innerHTML = p + '<span class="cascader-item-arrow">›</span>';
    item.onclick = function(e) { e.stopPropagation(); selectMhProvince(p); };
    col1.appendChild(item);
  });
}
function selectMhProvince(p) {
  _mhCascaderSel.province = p; _mhCascaderSel.city = ''; _mhCascaderSel.station = '';
  window._mhCascaderValue = '';
  document.querySelectorAll('#mhCascaderCol1 .cascader-col-item').forEach(function(el) { el.classList.toggle('active', el.textContent.trim().startsWith(p)); });
  var col2 = document.getElementById('mhCascaderCol2'); var col3 = document.getElementById('mhCascaderCol3');
  col2.innerHTML = ''; col3.innerHTML = '';
  Object.keys(siteTree[p] || {}).forEach(function(c) {
    var item = document.createElement('div'); item.className = 'cascader-col-item';
    item.innerHTML = c + '<span class="cascader-item-arrow">›</span>';
    item.onclick = function(e) { e.stopPropagation(); selectMhCity(p, c); };
    col2.appendChild(item);
  });
}
function selectMhCity(p, c) {
  _mhCascaderSel.city = c; _mhCascaderSel.station = ''; window._mhCascaderValue = '';
  document.querySelectorAll('#mhCascaderCol2 .cascader-col-item').forEach(function(el) { el.classList.toggle('active', el.textContent.trim().startsWith(c)); });
  var col3 = document.getElementById('mhCascaderCol3'); col3.innerHTML = '';
  ((siteTree[p] || {})[c] || []).forEach(function(s) {
    var item = document.createElement('div'); item.className = 'cascader-col-item'; item.textContent = s;
    item.onclick = function(e) { e.stopPropagation(); selectMhStation(p, c, s); };
    col3.appendChild(item);
  });
}
function selectMhStation(p, c, s) {
  _mhCascaderSel.station = s; window._mhCascaderValue = s;
  document.querySelectorAll('#mhCascaderCol3 .cascader-col-item').forEach(function(el) { el.classList.toggle('active', el.textContent === s); });
  var label = document.getElementById('mhCascaderLabel');
  label.textContent = p + ' / ' + c + ' / ' + s; label.className = 'cascader-selected';
  closeMhCascader();
}
function toggleMhCascader() { if (_mhCascaderOpen) { closeMhCascader(); } else { openMhCascader(); } }
function openMhCascader() {
  _mhCascaderOpen = true;
  document.getElementById('mhCascaderPanel').classList.add('open');
  document.getElementById('mhCascaderTrigger').classList.add('open');
  document.getElementById('mhCascaderWrap').classList.add('open');
  if (_mhCascaderSel.province) { selectMhProvince(_mhCascaderSel.province); }
  if (_mhCascaderSel.city) { selectMhCity(_mhCascaderSel.province, _mhCascaderSel.city); }
}
function closeMhCascader() {
  _mhCascaderOpen = false;
  document.getElementById('mhCascaderPanel').classList.remove('open');
  document.getElementById('mhCascaderTrigger').classList.remove('open');
  document.getElementById('mhCascaderWrap').classList.remove('open');
}

// ===== 保养计划 Cascader =====
var _mpCascaderOpen = false;
var _mpCascaderSel = { province: '', city: '', station: '' };
window._mpCascaderValue = '';
function initMpCascader() {
  var col1 = document.getElementById('mpCascaderCol1');
  if (!col1) return;
  col1.innerHTML = '';
  Object.keys(siteTree).forEach(function(p) {
    var item = document.createElement('div');
    item.className = 'cascader-col-item';
    item.innerHTML = p + '<span class="cascader-item-arrow">›</span>';
    item.onclick = function(e) { e.stopPropagation(); selectMpProvince(p); };
    col1.appendChild(item);
  });
}
function selectMpProvince(p) {
  _mpCascaderSel.province = p; _mpCascaderSel.city = ''; _mpCascaderSel.station = '';
  window._mpCascaderValue = '';
  document.querySelectorAll('#mpCascaderCol1 .cascader-col-item').forEach(function(el) { el.classList.toggle('active', el.textContent.trim().startsWith(p)); });
  var col2 = document.getElementById('mpCascaderCol2'); var col3 = document.getElementById('mpCascaderCol3');
  col2.innerHTML = ''; col3.innerHTML = '';
  Object.keys(siteTree[p] || {}).forEach(function(c) {
    var item = document.createElement('div'); item.className = 'cascader-col-item';
    item.innerHTML = c + '<span class="cascader-item-arrow">›</span>';
    item.onclick = function(e) { e.stopPropagation(); selectMpCity(p, c); };
    col2.appendChild(item);
  });
}
function selectMpCity(p, c) {
  _mpCascaderSel.city = c; _mpCascaderSel.station = ''; window._mpCascaderValue = '';
  document.querySelectorAll('#mpCascaderCol2 .cascader-col-item').forEach(function(el) { el.classList.toggle('active', el.textContent.trim().startsWith(c)); });
  var col3 = document.getElementById('mpCascaderCol3'); col3.innerHTML = '';
  ((siteTree[p] || {})[c] || []).forEach(function(s) {
    var item = document.createElement('div'); item.className = 'cascader-col-item'; item.textContent = s;
    item.onclick = function(e) { e.stopPropagation(); selectMpStation(p, c, s); };
    col3.appendChild(item);
  });
}
function selectMpStation(p, c, s) {
  _mpCascaderSel.station = s; window._mpCascaderValue = s;
  document.querySelectorAll('#mpCascaderCol3 .cascader-col-item').forEach(function(el) { el.classList.toggle('active', el.textContent === s); });
  var label = document.getElementById('mpCascaderLabel');
  label.textContent = p + ' / ' + c + ' / ' + s; label.className = 'cascader-selected';
  closeMpCascader();
}
function toggleMpCascader() { if (_mpCascaderOpen) { closeMpCascader(); } else { openMpCascader(); } }
function openMpCascader() {
  _mpCascaderOpen = true;
  document.getElementById('mpCascaderPanel').classList.add('open');
  document.getElementById('mpCascaderTrigger').classList.add('open');
  document.getElementById('mpCascaderWrap').classList.add('open');
  if (_mpCascaderSel.province) { selectMpProvince(_mpCascaderSel.province); }
  if (_mpCascaderSel.city) { selectMpCity(_mpCascaderSel.province, _mpCascaderSel.city); }
}
function closeMpCascader() {
  _mpCascaderOpen = false;
  document.getElementById('mpCascaderPanel').classList.remove('open');
  document.getElementById('mpCascaderTrigger').classList.remove('open');
  document.getElementById('mpCascaderWrap').classList.remove('open');
}

const orders = [
  { id:'WO-2026060001', vehicle:'JXG-001234', vin:'LVGH12345678901001', oem:'长安凯程', site:'北京亦庄站点', type:'故障维修', pri:'P0', status:'维修中', sub:'服务站诊断中', station:'天津市冀津贸易有限公司', sla:'剩余 23 分钟', slaWarn:true, next:'服务站完成诊断', desc:'车辆定位漂移，无法正常配送', reporter:'李建国', reporterPhone:'138****1201', reporterRole:'站点负责人', reportTime:'2026-06-08 08:51', reportSrc:'站点上报', stationManager:'张伟', stationManagerPhone:'139****0011', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6067', lastOp:'王运营', lastOpTime:'2026-06-08 09:15', affectHours:2.5, affectDays:1, accidentNo:'ACC-2026-0081', defectNo:'DEF-2026-0033', relatedDefect:'DEF-2026-0031', realtimeLoc:'北京市 经济技术开发区 荣华南路12号附近', locTime:'2026-06-08 09:18', locSpeed:'0 km/h', locStatus:'停驶', subSteps:[{step:'待服务站接单',startTime:'2026-06-08 08:51',endTime:'2026-06-08 09:05',executor:'王运营'},{step:'服务站诊断中',startTime:'2026-06-08 09:05',endTime:null,executor:'张师傅'}] },
  { id:'WO-2026060002', vehicle:'JXG-001237', vin:'LVGH12345678901002', oem:'长安凯程', site:'北京中关村站', type:'故障维修', pri:'P1', status:'待受理', sub:'-', station:'-', sla:'剩余 38 分钟', next:'运营受理或驳回', desc:'电池告警频繁出现', reporter:'车辆云控系统', reporterPhone:'-', reporterRole:'系统自动', reportTime:'2026-06-08 09:03', reportSrc:'车辆异常', stationManager:'刘建华', stationManagerPhone:'136****0022', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6031', lastOp:'系统自动', lastOpTime:'2026-06-08 09:03', affectHours:0.8, affectDays:0, accidentNo:'-', defectNo:'DEF-2026-0041', relatedDefect:'-', realtimeLoc:'北京市 海淀区 中关村大街49号附近', locTime:'2026-06-08 09:16', locSpeed:'8 km/h', locStatus:'行驶中' },
  { id:'WO-2026060003', vehicle:'JXG-001241', vin:'LVGH12345678901003', oem:'长安凯程', site:'上海浦东站', type:'软件复诊', pri:'P1', status:'维修中', sub:'售后/研发复诊中', station:'天津市冀津贸易有限公司', sla:'复诊预计 2小时', next:'研发回传结论', desc:'OTA 后行为异常，疑似版本问题', reporter:'王晓明', reporterPhone:'139****5523', reporterRole:'区域运营', reportTime:'2026-06-08 07:30', reportSrc:'运营手动', stationManager:'陈莉', stationManagerPhone:'137****0033', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6118', lastOp:'李研发', lastOpTime:'2026-06-08 10:44', affectHours:4.2, affectDays:1, accidentNo:'-', defectNo:'DEF-2026-0055', relatedDefect:'DEF-2026-0053', realtimeLoc:'上海市 浦东新区 张江高科技园区博霞路附近', locTime:'2026-06-08 10:50', locSpeed:'0 km/h', locStatus:'停驶', subSteps:[{step:'待服务站接单',startTime:'2026-06-08 07:30',endTime:'2026-06-08 08:00',executor:'王运营'},{step:'服务站诊断中',startTime:'2026-06-08 08:00',endTime:'2026-06-08 09:30',executor:'张师傅'},{step:'售后/研发复诊中',startTime:'2026-06-08 09:30',endTime:null,executor:'李研发'}] },
  { id:'WO-2026060004', vehicle:'JXG-001255', vin:'LVGH12345678901004', oem:'长安凯程', site:'北京通州站', type:'故障维修', pri:'P1', status:'待验收', sub:'维修完成', station:'天津市冀津贸易有限公司', sla:'剩余 4 小时', next:'站点验收', desc:'制动异常，已更换刹车片', reporter:'赵磊', reporterPhone:'135****8867', reporterRole:'站点负责人', reportTime:'2026-06-07 14:22', reportSrc:'站点上报', stationManager:'张伟', stationManagerPhone:'139****0011', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6055', lastOp:'张技师', lastOpTime:'2026-06-08 15:38', affectHours:26.5, affectDays:2, accidentNo:'ACC-2026-0077', defectNo:'DEF-2026-0028', relatedDefect:'DEF-2026-0025', realtimeLoc:'北京市 通州区 运河东大街9号服务站内', locTime:'2026-06-08 15:40', locSpeed:'0 km/h', locStatus:'维修中', subSteps:[{step:'待服务站接单',startTime:'2026-06-07 14:22',endTime:'2026-06-07 15:00',executor:'陈运营'},{step:'服务站诊断中',startTime:'2026-06-07 15:00',endTime:'2026-06-07 17:30',executor:'张技师'},{step:'待配件',startTime:'2026-06-07 17:30',endTime:'2026-06-08 09:00',executor:'陈运营'},{step:'待预约',startTime:'2026-06-08 09:00',endTime:'2026-06-08 10:00',executor:'陈运营'},{step:'已预约',startTime:'2026-06-08 10:00',endTime:'2026-06-08 13:00',executor:'张技师'},{step:'已到场',startTime:'2026-06-08 13:00',endTime:'2026-06-08 14:05',executor:'张技师'},{step:'维修开始',startTime:'2026-06-08 14:05',endTime:'2026-06-08 15:38',executor:'张技师'},{step:'维修完成',startTime:'2026-06-08 15:38',endTime:'2026-06-08 15:38',executor:'张技师'}] },
  { id:'WO-2026060005', vehicle:'JXG-001260', vin:'LVGH12345678901005', oem:'长安凯程', site:'武汉光谷站', type:'周期保养', pri:'P2', status:'维修中', sub:'待配件', station:'天津市冀津贸易有限公司', sla:'备件预计明日到货', next:'等待备件齐套', desc:'10000 公里保养', reporter:'陈思远', reporterPhone:'186****4490', reporterRole:'售后运营管理员', reportTime:'2026-06-07 10:00', reportSrc:'运营巡检导入', stationManager:'周海燕', stationManagerPhone:'135****0055', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6202', lastOp:'陈运营', lastOpTime:'2026-06-07 11:20', affectHours:18, affectDays:1, accidentNo:'-', defectNo:'-', relatedDefect:'-', realtimeLoc:'湖北省 武汉市 东湖高新区光谷大道88号附近', locTime:'2026-06-08 11:05', locSpeed:'0 km/h', locStatus:'停驶', subSteps:[{step:'待服务站接单',startTime:'2026-06-07 10:00',endTime:'2026-06-07 11:00',executor:'陈运营'},{step:'服务站诊断中',startTime:'2026-06-07 11:00',endTime:'2026-06-07 12:30',executor:'李技师'},{step:'待配件',startTime:'2026-06-07 12:30',endTime:null,executor:'陈运营'}] },
  { id:'WO-2026060006', vehicle:'JXG-001268', vin:'LVGH12345678901006', oem:'长安凯程', site:'北京海淀站', type:'外观损伤', pri:'P2', status:'已完成', sub:'-', station:'天津市冀津贸易有限公司', sla:'-', next:'已归档', desc:'侧门划痕修复', reporter:'刘芳', reporterPhone:'137****3312', reporterRole:'站点负责人', reportTime:'2026-06-06 16:45', reportSrc:'站点上报', stationManager:'张伟', stationManagerPhone:'139****0011', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6088', lastOp:'刘运营', lastOpTime:'2026-06-07 17:00', affectHours:8, affectDays:1, accidentNo:'-', defectNo:'-', relatedDefect:'-', realtimeLoc:'北京市 海淀区 中关村南大街5号附近', locTime:'2026-06-08 09:22', locSpeed:'12 km/h', locStatus:'行驶中',
    acceptResult:'通过', acceptTime:'2026-06-07 17:00', acceptBy:'刘运营', acceptComment:'修复质量合格，车身漆面无色差，划痕完全消除。已完成试驾验证，车辆状态正常，同意归档。',
    acceptPhotos:[{label:'修复前', emoji:'🚗', desc:'侧门划痕修复前'},{label:'修复后', emoji:'✅', desc:'划痕完全消除'},{label:'整体外观', emoji:'📸', desc:'整车外观验收'}]
  },
  { id:'WO-2026060008', vehicle:'JXG-001244', vin:'LVGH12345678901008', oem:'长安凯程', site:'上海嘉定站', type:'故障维修', pri:'P1', status:'受理驳回', sub:'-', station:'-', sla:'-', next:'待提报人补充信息', desc:'车辆底盘异响，疑似悬挂问题', reporter:'周磊', reporterPhone:'132****7788', reporterRole:'站点负责人', reportTime:'2026-06-07 11:20', reportSrc:'站点上报', stationManager:'陈莉', stationManagerPhone:'137****0033', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6175', lastOp:'王运营', lastOpTime:'2026-06-07 11:45', affectHours:0, affectDays:0, accidentNo:'-', defectNo:'-', relatedDefect:'-', realtimeLoc:'上海市 嘉定区 嘉定工业区站点内', locTime:'2026-06-07 11:45', locSpeed:'0 km/h', locStatus:'停驶',
    acceptResult:'驳回', acceptTime:'2026-06-07 11:45', acceptBy:'王运营', acceptComment:'工单信息不完整：缺少车辆底盘异响的具体部位描述、异响频率及复现条件，也未上传底盘图片或视频。请补充以下信息后重新提报：①异响发生时的具体工况（转弯/直行/颠簸）；②底盘图片（至少2张）；③是否已尝试临时处理。',
    acceptPhotos:[]
  },
  { id:'WO-2026060007', vehicle:'JXG-001270', vin:'LVGH12345678901007', oem:'长安凯程', site:'上海徐汇站', type:'现场救援', pri:'P1', status:'维修中', sub:'已预约', station:'天津市冀津贸易有限公司', sla:'ETA 14:30', next:'技师到场维修', desc:'传感器读数异常', reporter:'车辆云控系统', reporterPhone:'-', reporterRole:'系统自动', reportTime:'2026-06-08 06:18', reportSrc:'车辆异常', stationManager:'陈莉', stationManagerPhone:'137****0033', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6143', lastOp:'系统自动', lastOpTime:'2026-06-08 06:18', affectHours:7.2, affectDays:1, accidentNo:'-', defectNo:'DEF-2026-0062', relatedDefect:'-', realtimeLoc:'上海市 徐汇区 漕溪北路200号附近', locTime:'2026-06-08 09:10', locSpeed:'0 km/h', locStatus:'停驶', subSteps:[{step:'待服务站接单',startTime:'2026-06-08 06:18',endTime:'2026-06-08 08:00',executor:'系统自动'},{step:'服务站诊断中',startTime:'2026-06-08 08:00',endTime:'2026-06-08 10:30',executor:'李技师'},{step:'待预约',startTime:'2026-06-08 10:30',endTime:'2026-06-08 12:00',executor:'王运营'},{step:'已预约',startTime:'2026-06-08 12:00',endTime:null,executor:'王运营'}] },
  { id:'WO-2026060009', vehicle:'JXG-001280', vin:'LVGH12345678901009', oem:'上汽大通', site:'广州天河站', type:'外观损伤', pri:'P2', status:'验收驳回', sub:'-', station:'广州服务站', sla:'-', next:'待服务站重新处理', desc:'前保险杠刮蹭修复后色差明显', reporter:'陈明', reporterPhone:'135****9912', reporterRole:'站点负责人', reportTime:'2026-06-06 14:00', reportSrc:'站点上报', stationManager:'黄丽', stationManagerPhone:'138****0066', vehicleModel:'miniVan量产车型', vehicleNo:'JDE6280', lastOp:'李运营', lastOpTime:'2026-06-08 10:30', affectHours:48, affectDays:2, accidentNo:'-', defectNo:'-', relatedDefect:'-', realtimeLoc:'广东省 广州市 天河区体育西路附近', locTime:'2026-06-08 09:00', locSpeed:'0 km/h', locStatus:'停驶',
    acceptResult:'驳回', acceptTime:'2026-06-08 10:30', acceptBy:'李运营', acceptComment:'验收不通过：修复区域漆面色差明显，与原车漆面存在明显差异。且保险杠安装缝隙不均匀，需重新返工处理。请服务站重新修复后再次提交验收。',
    acceptPhotos:[]
  }
];

const flowTemplates = {
  '故障维修': {
    master: ['待受理','维修中','待验收','已完成','验收驳回'],
    sub: ['待服务站接单','服务站诊断中','待配件','待预约','已预约','已到场','维修开始','维修完成']
  },
  '现场救援': {
    master: ['待受理','处理中','已完成'],
    sub: ['已派单','技师出发','已到场','救援处理中','救援完成']
  },
  '周期保养': {
    master: ['待受理','维修中','待验收','已完成','验收驳回'],
    sub: ['待服务站接单','服务站诊断中','待配件','待预约','已预约','已到场','保养开始','保养完成']
  },
  '软件复诊': {
    master: ['待受理','复诊中','待验收','已完成','验收驳回'],
    sub: ['待接单','日志收集中','售后/研发复诊中','结论已回传','完成']
  },
  '外观损伤': {
    master: ['待受理','维修中','待验收','已完成','验收驳回'],
    sub: ['待服务站接单','损伤评估中','待配件','维修开始','维修完成']
  },
  '车辆批改': {
    master: ['待受理','处理中','已完成'],
    sub: ['待接单','批改执行中','批改完成']
  },
  '转站需求': {
    master: ['待受理','转运中','已完成'],
    sub: ['待调度','调度确认','车辆装载','运输中','已到达目标站','完成交接']
  }
};
function getFlow(type) {
  return flowTemplates[type] || flowTemplates['故障维修'];
}
// 兼容旧引用
const masterStatusList = flowTemplates['故障维修'].master;
const subStatusList = flowTemplates['故障维修'].sub;

// ===== 自动受理配置（需在 initTypeTable 之前赋值）=====
var _typeAutoAcceptMap = {
  '故障维修':'是','现场救援':'是','周期保养':'否',
  '软件复诊':'是','外观损伤':'是','车辆批改':'否','转站需求':'否'
};
var _typeAutoCondMap = {};

function acceptBlock(o) {
  if (o.status !== '已完成' && o.status !== '受理驳回') return '';
  var isPass = o.acceptResult === '通过';
  var tagColor = isPass ? '#f6ffed' : '#fff1f0';
  var tagBorder = isPass ? '#b7eb8f' : '#ffa39e';
  var tagText = isPass ? '#52c41a' : '#ff4d4f';
  var tagLabel = isPass ? '验收通过' : '验收驳回';
  var photosHtml = '';
  if (o.acceptPhotos && o.acceptPhotos.length) {
    photosHtml = '<div class="photo-row" style="margin-top:10px;">' +
      o.acceptPhotos.map(function(p) {
        return '<div class="photo-thumb" title="' + p.desc + '">' +
          '<span style="font-size:10px;color:#bbb;margin-top:2px;">' + p.label + '</span>' +
          '</div>';
      }).join('') +
      '</div>';
  }
  return '<div class="section-title">验收结果</div>' +
    '<div class="result-block">' +
      '<div class="result-block-title">' +
        '<span style="padding:2px 10px;border-radius:4px;font-size:12px;background:' + tagColor + ';border:1px solid ' + tagBorder + ';color:' + tagText + ';font-weight:600;">' + tagLabel + '</span>' +
        '<span style="color:#999;font-size:12px;margin-left:8px;">' + (o.acceptBy || '-') + '</span>' +
        '<span style="color:#bbb;font-size:11px;margin-left:8px;">' + (o.acceptTime || '') + '</span>' +
      '</div>' +
      '<div style="font-size:12px;color:#555;line-height:1.75;margin-top:8px;padding:10px 12px;background:#fafafa;border-radius:6px;border-left:3px solid ' + (isPass ? '#52c41a' : '#ff4d4f') + ';">' +
        (o.acceptComment || '-') +
      '</div>' +
      photosHtml +
    '</div>';
}

function syncBlock(o) {
  const diagnosedStates = ['售后/研发复诊中','待配件','待预约','已预约','已到场','维修开始','维修完成','-'];
  const repairedStates = ['维修完成'];
  const subIdx = subStatusList.indexOf(o.sub);
  const diagnosed = (subIdx >= subStatusList.indexOf('服务站诊断中') && subIdx > 0) || diagnosedStates.includes(o.sub);
  const showDiag = diagnosed || o.status === '已完成' || o.status === '待验收';
  const showRepair = repairedStates.includes(o.sub) || o.status === '待验收' || o.status === '已完成';
  if (!showDiag && !showRepair) {
    return '<div style="color:#aaa;font-size:12px;padding:8px 0;">诊断完成后将同步诊断结果；维修完成后将同步维修结果。</div>';
  }
  let html = '';
  if (showDiag) {
    html += '<div class="result-block"><div class="result-block-title">诊断结果（已同步）</div><div class="result-kv"><span class="result-k">诊断工具</span><span class="result-v">京小鸽诊断 v2.3.1</span><span class="result-k">故障码</span><span class="result-v">P0420 / U0100</span><span class="result-k">诊断人</span><span class="result-v">张师傅</span><span class="result-k">诊断时间</span><span class="result-v">2026-06-08 09:22</span><span class="result-k">初步结论</span><span class="result-v">GPS 模块信号干扰，定位偏差超过 50m，建议更换 GPS 天线</span></div><div style="margin-top:8px;font-size:11px;color:#888;">现场图片</div><div class="photo-row"><div class="photo-thumb" style="font-size:11px;color:#bbb;">图片</div><div class="photo-thumb" style="font-size:11px;color:#bbb;">图片</div><div class="photo-thumb" style="background:#f5f5f5;color:#bbb;font-size:13px;">日志</div></div></div>';
  }
  if (showRepair) {
    html += '<div class="result-block repair"><div class="result-block-title">维修结果（已同步）</div><div class="result-kv"><span class="result-k">故障根因</span><span class="result-v">GPS 天线老化，信号遮挡导致持续漂移</span><span class="result-k">维修动作</span><span class="result-v">更换 GPS 天线（零件号 JXG-ANT-003）并重新标定</span><span class="result-k">备件更换</span><span class="result-v">GPS 天线 ×1 — ¥ 280.00</span><span class="result-k">其他费用</span><span class="result-v">工时费 ¥ 140.00</span><span class="result-k">总费用</span><span class="result-v" style="font-weight:600;color:#1890ff;">¥ 420.00</span><span class="result-k">维修开始</span><span class="result-v">2026-06-08 14:05</span><span class="result-k">维修完成</span><span class="result-v">2026-06-08 15:38（耗时 93 分钟）</span><span class="result-k">执行技师</span><span class="result-v">张师傅</span><span class="result-k">维修结论</span><span class="result-v">已恢复，试跑 5 公里定位正常</span></div><div style="margin-top:8px;font-size:11px;color:#888;">维修图片（维修前 / 维修中 / 维修后）</div><div class="photo-row"><div class="photo-thumb" style="font-size:11px;color:#bbb;">前<br>图片</div><div class="photo-thumb" style="font-size:11px;color:#bbb;">中<br>图��</div><div class="photo-thumb" style="font-size:11px;color:#bbb;">后<br>图片</div></div></div>';
  }
  return html;
}

var costRows = {
  'WO-2026060004': [
    {type:'工时费', required:true,  item:'更换GPS天线工时', fee:140, bearer:'整车厂责任', note:''},
    {type:'服务费', required:true,  item:'GPS天线配件（JXG-ANT-003）', fee:280, bearer:'整车厂责任', note:''},
    {type:'其他费用', required:false, item:'', fee:0, bearer:'', note:''}
  ],
  'WO-2026060006': [
    {type:'工时费', required:true,  item:'侧门钣金工时', fee:200, bearer:'用户责任', note:''},
    {type:'服务费', required:true,  item:'喷漆材料费', fee:350, bearer:'用户责任', note:''},
    {type:'其他费用', required:false, item:'', fee:0, bearer:'', note:''}
  ]
};
var bearerOptions = ['整车厂责任','运营责任','服务站责任','用户责任'];
function costBlock(o) {
  var showRepair = ['维修完成'].includes(o.sub) || o.status==='待验收' || o.status==='已完成';
  if(!showRepair) return '';
  var rows = costRows[o.id] || [
    {type:'工时费',  required:true,  item:'', fee:0, bearer:'', note:''},
    {type:'服务费',  required:true,  item:'', fee:0, bearer:'', note:''},
    {type:'其他费用',required:false, item:'', fee:0, bearer:'', note:''}
  ];
  var total = rows.reduce(function(s,r){ return s + (parseFloat(r.fee)||0); }, 0);
  var bearerSel = function(v){ return '<select class="cost-select">'+ bearerOptions.map(function(op){ return '<option'+(op===v?' selected':'')+'>'+op+'</option>'; }).join('') +'<option value=""'+(v?'':' selected')+'>请选择</option></select>'; };
  var trs = rows.map(function(r, i){
    return '<tr>' +
      '<td><span class="cost-type-label">'+(r.required?'<span class="cost-required">*</span>':'')+r.type+'</span></td>' +
      '<td><input class="cost-input" style="min-width:120px;" value="'+r.item+'" placeholder="请输入服务项目"></td>' +
      '<td><input class="cost-input" style="width:80px;text-align:right;" value="'+(r.fee||'')+'" placeholder="0.00"></td>' +
      '<td style="min-width:120px;">'+bearerSel(r.bearer)+'</td>' +
      '<td><input class="cost-input" style="min-width:100px;" value="'+r.note+'" placeholder="备注"></td>' +
      '<td style="white-space:nowrap;">' +
        '<button class="cost-action-btn cost-del-btn" onclick="this.closest(\'tr\').remove();recalcCost(this)">删除</button>' +
        '<button class="cost-action-btn cost-add-btn" onclick="addCostRow(this)">新增</button>' +
      '</td>' +
    '</tr>';
  }).join('');
  return '<div class="section-title">费用明细</div>' +
    '<div style="overflow-x:auto;">' +
    '<table class="cost-table" id="costTable_'+o.id+'">' +
      '<thead><tr>' +
        '<th style="width:90px;">行类型</th>' +
        '<th>服务项目</th>' +
        '<th style="width:90px;">费用(元)</th>' +
        '<th style="width:130px;">费用承担方分类</th>' +
        '<th>承担方备注</th>' +
        '<th style="width:90px;">操作</th>' +
      '</tr></thead>' +
      '<tbody id="costBody_'+o.id+'">' + trs + '</tbody>' +
      '<tfoot><tr class="cost-total-row">' +
        '<td colspan="2" style="text-align:right;padding-right:12px;">合计</td>' +
        '<td id="costTotal_'+o.id+'">¥ '+total.toFixed(2)+'</td>' +
        '<td colspan="3"></td>' +
      '</tr></tfoot>' +
    '</table>' +
    '</div>';
}
var partsRows = {};
var partsBeforeOptions = ['GPS天线','刹车片','传感器','电池模块','制动系统','激光雷达','摄像头模块','车门锁体','轮毂轴承','转向电机'];
var partsAfterOptions  = ['GPS天线(新)','刹车片(新)','传感器(新)','电池模块(新)','制动总成(新)','激光雷达(新)','摄像头模块(新)','车门锁体(新)','轮毂轴承(新)','转向电机(新)'];
function partsBlock(o) {
  var showRepair = ['维修完成'].includes(o.sub) || o.status==='待验收' || o.status==='已完成';
  if(!showRepair) return '';
  var rows = partsRows[o.id] || [{before:'',after:'',serial:'',qty:1,fee:'',bearer:'',note:''}];
  var beforeSel = function(v){ return '<select class="cost-select">' +
    '<option value="">请选择</option>' +
    partsBeforeOptions.map(function(op){ return '<option'+(op===v?' selected':'')+'>'+op+'</option>'; }).join('') +
    '</select>'; };
  var afterSel = function(v){ return '<select class="cost-select">' +
    '<option value="">请选择</option>' +
    partsAfterOptions.map(function(op){ return '<option'+(op===v?' selected':'')+'>'+op+'</option>'; }).join('') +
    '</select>'; };
  var bearerParSel = function(v){ return '<select class="cost-select">' +
    '<option value=""'+(v?'':' selected')+'>请选择</option>' +
    bearerOptions.map(function(op){ return '<option'+(op===v?' selected':'')+'>'+op+'</option>'; }).join('') +
    '</select>'; };
  var trs = rows.map(function(r){
    return '<tr>' +
      '<td style="min-width:120px;">' + beforeSel(r.before) + '</td>' +
      '<td style="min-width:120px;">' + afterSel(r.after) + '</td>' +
      '<td><input class="cost-input" style="min-width:130px;" value="'+(r.serial||'')+'" placeholder="请输入设备序列号"></td>' +
      '<td><input class="cost-input" style="width:60px;text-align:center;" value="'+(r.qty||1)+'" type="number" min="1"></td>' +
      '<td><input class="cost-input" style="width:90px;text-align:right;" value="'+(r.fee||'')+'" placeholder="0.00"></td>' +
      '<td style="min-width:120px;">' + bearerParSel(r.bearer) + '</td>' +
      '<td><input class="cost-input" style="min-width:100px;" value="'+(r.note||'')+'" placeholder="请输入备注"></td>' +
      '<td style="white-space:nowrap;">' +
        '<button class="cost-action-btn cost-del-btn" onclick="this.closest(\'tr\').remove()">删除</button>' +
        '<button class="cost-action-btn cost-add-btn" onclick="addPartsRow(this)">新增</button>' +
      '</td>' +
    '</tr>';
  }).join('');
  return '<div class="section-title">更换配件记录</div>' +
    '<div style="font-size:11px;color:#888;margin-bottom:8px;">注：配件名称仅可带出该车的配件信息，如没有，请在<a style="color:#1890ff;cursor:pointer;">「设备基础信息管理」</a>更新车辆信息</div>' +
    '<div style="overflow-x:auto;">' +
    '<table class="cost-table" id="partsTable_'+o.id+'">' +
      '<thead><tr>' +
        '<th style="min-width:120px;">更换前配件</th>' +
        '<th style="min-width:120px;">更换后配件</th>' +
        '<th style="min-width:130px;">更换后配件序列号</th>' +
        '<th style="width:70px;">更换数量</th>' +
        '<th style="width:100px;">配件总费用(元)</th>' +
        '<th style="min-width:120px;">费用承担分类</th>' +
        '<th>承担方备注</th>' +
        '<th style="width:90px;">操作</th>' +
      '</tr></thead>' +
      '<tbody id="partsBody_'+o.id+'">' + trs + '</tbody>' +
    '</table>' +
    '</div>';
}
function addPartsRow(btn){
  var tbody = btn.closest('tbody');
  var beforeOpts = '<option value="">请选择</option>' + partsBeforeOptions.map(function(op){ return '<option>'+op+'</option>'; }).join('');
  var afterOpts  = '<option value="">请选择</option>' + partsAfterOptions.map(function(op){ return '<option>'+op+'</option>'; }).join('');
  var bearerOpts = '<option value="">请选择</option>' + bearerOptions.map(function(op){ return '<option>'+op+'</option>'; }).join('');
  var newTr = document.createElement('tr');
  newTr.innerHTML =
    '<td style="min-width:120px;"><select class="cost-select">' + beforeOpts + '</select></td>' +
    '<td style="min-width:120px;"><select class="cost-select">' + afterOpts  + '</select></td>' +
    '<td><input class="cost-input" style="min-width:130px;" placeholder="请输入设备序列号"></td>' +
    '<td><input class="cost-input" style="width:60px;text-align:center;" value="1" type="number" min="1"></td>' +
    '<td><input class="cost-input" style="width:90px;text-align:right;" placeholder="0.00"></td>' +
    '<td style="min-width:120px;"><select class="cost-select">' + bearerOpts + '</select></td>' +
    '<td><input class="cost-input" style="min-width:100px;" placeholder="请输入备注"></td>' +
    '<td style="white-space:nowrap;">' +
      '<button class="cost-action-btn cost-del-btn" onclick="this.closest(\'tr\').remove()">删除</button>' +
      '<button class="cost-action-btn cost-add-btn" onclick="addPartsRow(this)">新增</button>' +
  '</td>';
  tbody.appendChild(newTr);
}
function addCostRow(btn){
  var tr = btn.closest('tr');
  var tbody = tr.closest('tbody');
  var newTr = document.createElement('tr');
  newTr.innerHTML = '<td><span class="cost-type-label">其他费用</span></td>' +
    '<td><input class="cost-input" style="min-width:120px;" placeholder="请输入服务项目"></td>' +
    '<td><input class="cost-input" style="width:80px;text-align:right;" placeholder="0.00"></td>' +
    '<td style="min-width:120px;"><select class="cost-select"><option value="">请选择</option>' +
      bearerOptions.map(function(op){ return '<option>'+op+'</option>'; }).join('') +
    '</select></td>' +
    '<td><input class="cost-input" style="min-width:100px;" placeholder="备注"></td>' +
    '<td style="white-space:nowrap;">' +
      '<button class="cost-action-btn cost-del-btn" onclick="this.closest(\'tr\').remove()">删除</button>' +
      '<button class="cost-action-btn cost-add-btn" onclick="addCostRow(this)">新增</button>' +
    '</td>';
  tbody.appendChild(newTr);
}
function recalcCost(btn){
  var table = btn.closest('table');
  if(!table) return;
  var total = 0;
  table.querySelectorAll('tbody tr').forEach(function(row){
    var inp = row.querySelectorAll('input')[1];
    if(inp) total += parseFloat(inp.value)||0;
  });
  var totalCell = table.querySelector('tfoot .cost-total-row td:nth-child(3)');
  if(totalCell) totalCell.innerText = '¥ '+total.toFixed(2);
}

function priTag(p){ return '<span class="tag tag-'+p.toLowerCase()+'">'+p+'</span>'; }
// ===== 统一主状态映射 =====
var _unifiedStatusMap = {'待受理':'待受理','维修中':'处理中','处理中':'处理中','复诊中':'处理中','转运中':'处理中','待验收':'待验收','已完成':'已完成','验收驳回':'验收驳回'};
var _unifiedStatusList = ['待受理','处理中','待验收','已完成'];
function toUnifiedStatus(s){ return _unifiedStatusMap[s] || s; }

function statusTag(s){
  var m={'待受理':'pending','处理中':'doing','待验收':'verify','已完成':'done','验收驳回':'rejected'};
  var u = toUnifiedStatus(s);
  var tip = u !== s ? ' title="'+s+'"' : '';
  return '<span class="tag tag-'+(m[u]||'status')+'"'+tip+'>'+u+'</span>';
}

/* ===== SLA 核心计算（提前定义供 renderTable 使用）===== */
var _slaRules = [
  { type:'故障维修', enabled:true,
    slots:[
      {label:'上午上报（00:00–12:00）', cutoffHour:12, deadlineDesc:'当日 24:00', deadlineHour:24, deadlineDay:0},
      {label:'下午上报（12:00–24:00）', cutoffHour:24, deadlineDesc:'次日 12:00', deadlineHour:12, deadlineDay:1}
    ], escalation:'超时后自动升级为 P0，通知区域运营'},
  { type:'现场救援', enabled:true,
    slots:[{label:'全天', cutoffHour:24, deadlineDesc:'上报后 4 小时内', offsetHours:4}],
    escalation:'超时后自动通知主管升级'},
  { type:'周期保养', enabled:true,
    slots:[{label:'全天', cutoffHour:24, deadlineDesc:'上报后 48 小时内', offsetHours:48}],
    escalation:'超时发送提醒通知'},
  { type:'外观损伤', enabled:true,
    slots:[{label:'全天', cutoffHour:24, deadlineDesc:'上报后 72 小时内', offsetHours:72}],
    escalation:'超时发送提醒通知'}
];
function calcSlaDeadline(order){
  var rule = _slaRules.find(function(r){return r.type===order.type && r.enabled;});
  if(!rule || !order.reportTime) return null;
  var rt = new Date(order.reportTime.replace(' ','T'));
  if(isNaN(rt)) return null;
  var reportHour = rt.getHours() + rt.getMinutes()/60;
  var slot = null;
  for(var i=0;i<rule.slots.length;i++){
    var prevCut = i===0 ? 0 : rule.slots[i-1].cutoffHour;
    if(reportHour >= prevCut && reportHour < rule.slots[i].cutoffHour){slot=rule.slots[i];break;}
  }
  if(!slot) slot = rule.slots[rule.slots.length-1];
  if(slot.offsetHours != null) return new Date(rt.getTime() + slot.offsetHours*3600000);
  var deadline = new Date(rt);
  deadline.setDate(deadline.getDate() + (slot.deadlineDay||0));
  var dh = slot.deadlineHour >= 24 ? 0 : slot.deadlineHour;
  var addDay = slot.deadlineHour >= 24 ? 1 : 0;
  deadline.setHours(dh,0,0,0);
  deadline.setDate(deadline.getDate() + addDay);
  return deadline;
}
function getSlaText(order){
  if(toUnifiedStatus(order.status)==='已完成'||order.status==='受理驳回') return '-';
  var deadline = calcSlaDeadline(order);
  if(!deadline) return order.sla||'-';
  var now = new Date();
  var diffMs = deadline - now;
  if(diffMs < 0){
    var overH = Math.ceil(-diffMs/3600000);
    return '<span class="sla-warn">超时 '+overH+'h</span>';
  }
  var remH = Math.floor(diffMs/3600000);
  var remM = Math.floor((diffMs%3600000)/60000);
  if(remH>=24){var remD=Math.floor(remH/24);return '剩余 '+remD+'天 '+(remH%24)+'h';}
  if(remH>0) return '剩余 '+remH+'h '+remM+'m';
  return '<span class="sla-warn">剩余 '+remM+' 分钟</span>';
}

function renderTable(list){
  var tb=document.getElementById('tableBody');
  tb.innerHTML = list.map(function(o){
    return '<tr onclick="openDrawer(\''+o.id+'\')">' +
      '<td><strong style="color:#1890ff;">'+o.id+'</strong></td>' +
      '<td>'+o.vehicle+'<br><span style="color:#999;font-size:11px;">'+(o.vehicleModel||'-')+' / '+(o.vehicleNo||'-')+'</span></td>' +
      '<td class="col-desc"><span title="'+o.desc+'" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.6;">'+o.desc+'</span></td>' +
      '<td>'+o.type+'</td>' +
      '<td>'+priTag(o.pri)+'</td>' +
      '<td>'+statusTag(o.status)+'</td>' +
      '<td><span class="tag tag-status">'+o.sub+'</span></td>' +
      '<td>'+(o.reporter||'-')+'<br><span style="color:#999;font-size:11px;">'+(o.reporterPhone && o.reporterPhone!=='-' ? o.reporterPhone : o.reporterRole)+'</span></td>' +
      '<td>'+o.site+'</td>' +
      '<td>'+getSlaText(o)+'</td>' +
      '<td>'+o.station+'</td>' +
      '<td style="font-family:monospace;font-size:11px;">'+(o.vin||'-')+'</td>' +
      '<td>'+(o.oem||'-')+'</td>' +
      '<td>'+(o.affectHours!=null ? o.affectHours+'h' : '-')+'</td>' +
      '<td>'+(o.affectDays!=null ? o.affectDays+'天' : '-')+'</td>' +
      '<td>'+(o.accidentNo&&o.accidentNo!=='-' ? '<span style="color:#1890ff;">'+o.accidentNo+'</span>' : '-')+'</td>' +
      '<td>'+(o.defectNo&&o.defectNo!=='-' ? '<span style="color:#722ed1;">'+o.defectNo+'</span>' : '-')+'</td>' +
      '<td>'+(o.relatedDefect&&o.relatedDefect!=='-' ? '<span style="color:#722ed1;">'+o.relatedDefect+'</span>' : '-')+'</td>' +
      '<td>'+(o.lastOp||'-')+'<br><span style="color:#999;font-size:11px;">'+(o.lastOpTime||'-')+'</span></td>' +
      '<td>'+o.next+'</td>' +
      '<td class="col-action" onclick="event.stopPropagation()"><button class="btn btn-default" style="height:26px;padding:0 10px;font-size:11px;" onclick="openEditModal(\''+o.id+'\')">编辑</button> <button class="btn btn-default" style="height:26px;padding:0 10px;font-size:11px;" onclick="openDefectModal(\''+o.id+'\')">提报缺陷</button></td>' +
    '</tr>';
  }).join('');
  document.getElementById('totalCount').innerText = list.length;
  document.getElementById('navBadge').innerText = list.length;
}
function updateStatCards(){
  _unifiedStatusList.forEach(function(k){
    var el = document.getElementById('cnt-'+k);
    if(el) el.innerText = orders.filter(function(o){ return toUnifiedStatus(o.status)===k; }).length;
  });
}
renderTable(orders);
initCascader();
updateStatCards();
initTypeSelects();
initTypeTable();

updateStatCards();

/* ===== 结算单管理 ===== */
var bills = [
  { id:'BS-20260601', orderId:'WO-2026060001', vehicle:'JXG-001001', site:'北京自营服务站',
    type:'费用结算', laborFee:280, partsFee:420, total:700, status:'已结算',
    submitTime:'2026-06-07 10:30', auditor:'李财务', auditTime:'2026-06-07 14:00',
    laborItems:[{name:'故障诊断工时',qty:1,unit:'次',price:140},{name:'GPS天线更换工时',qty:1,unit:'次',price:140}],
    partsItems:[{partNo:'JXG-ANT-003',name:'GPS天线',qty:1,unit:'个',price:280,warranty:'是'},{partNo:'JXG-SEAL-001',name:'密封胶垫',qty:1,unit:'个',price:140,warranty:'是'}],
    remark:'质保期内免费更换，零件费用由供应商承担，工时正常结算。',
    payMethod:'对公转账', invoice:'已开票' },
  { id:'BS-20260602', orderId:'WO-2026060002', vehicle:'JXG-001270', site:'上海徐汇站',
    type:'费用+换件', laborFee:200, partsFee:680, total:880, status:'待审核',
    submitTime:'2026-06-08 09:45', auditor:'-', auditTime:'-',
    laborItems:[{name:'车门铰链调整工时',qty:2,unit:'次',price:100}],
    partsItems:[{partNo:'JXG-HINGE-007',name:'车门铰链总成',qty:1,unit:'套',price:480,warranty:'否'},{partNo:'JXG-BOLT-002',name:'固定螺栓组',qty:1,unit:'组',price:200,warranty:'否'}],
    remark:'非质保，车主自费。换件单据已附。',
    payMethod:'车主线上支付', invoice:'待开票' },
  { id:'BS-20260603', orderId:'WO-2026060003', vehicle:'JXG-001512', site:'天津冀津站',
    type:'换件结算', laborFee:0, partsFee:360, total:360, status:'审核中',
    submitTime:'2026-06-07 16:20', auditor:'王财务', auditTime:'-',
    laborItems:[],
    partsItems:[{partNo:'JXG-BRAKE-011',name:'制动片套装',qty:2,unit:'套',price:180,warranty:'是'}],
    remark:'质保期内换件，仅结算零件成本。',
    payMethod:'对公转账', invoice:'待开票' },
  { id:'BS-20260604', orderId:'WO-2026060004', vehicle:'JXG-001388', site:'广州天河站',
    type:'费用结算', laborFee:320, partsFee:0, total:320, status:'驳回',
    submitTime:'2026-06-06 11:00', auditor:'李财务', auditTime:'2026-06-06 15:30',
    laborItems:[{name:'空调系统检测工时',qty:1,unit:'次',price:180},{name:'管路清洗工时',qty:1,unit:'次',price:140}],
    partsItems:[],
    remark:'驳回原因：工时单价超出标准报价，请按站点协议价重新提交。',
    payMethod:'-', invoice:'-' },
  { id:'BS-20260605', orderId:'WO-2026060006', vehicle:'JXG-001777', site:'南京玄武站',
    type:'费用+换件', laborFee:160, partsFee:560, total:720, status:'已结算',
    submitTime:'2026-06-07 17:30', auditor:'李财务', auditTime:'2026-06-08 09:00',
    laborItems:[{name:'车身漆面修复工时',qty:1,unit:'次',price:160}],
    partsItems:[{partNo:'JXG-PAINT-003',name:'原厂漆料套装',qty:1,unit:'套',price:560,warranty:'否'}],
    remark:'外观损伤非质保，全额向车主收费，发票已邮寄。',
    payMethod:'车主线上支付', invoice:'已开票' },
];

function updateBillStatCards(){
  ['待审核','审核中','已结算','驳回'].forEach(function(k){
    var el=document.getElementById('bcnt-'+k);
    if(el) el.innerText=bills.filter(function(b){return b.status===k;}).length;
  });
}

var activeBillCard = null;
function filterBillByCard(el, status){
  var cards = document.querySelectorAll('#page-bill .stat-cards .stat-card');
  if(activeBillCard === status){
    activeBillCard = null;
    cards.forEach(function(c){c.classList.remove('active');});
    document.getElementById('billStatus').value = '';
    renderBillTable(); return;
  }
  activeBillCard = status;
  cards.forEach(function(c){c.classList.remove('active');});
  el.classList.add('active');
  document.getElementById('billStatus').value = status;
  renderBillTable();
}

function renderBillTable(){
  var kw=(document.getElementById('billKw')||{value:''}).value.toLowerCase();
  var st=(document.getElementById('billStatus')||{value:''}).value;
  var tp=(document.getElementById('billType')||{value:''}).value;
  var list=bills.filter(function(b){
    if(kw&&!(b.id.toLowerCase().includes(kw)||b.orderId.toLowerCase().includes(kw)||b.vehicle.toLowerCase().includes(kw))) return false;
    if(st&&b.status!==st) return false;
    if(tp&&b.type!==tp) return false;
    return true;
  });
  var statusColor={'待审核':'#fa8c16','审核中':'#1890ff','已结算':'#52c41a','驳回':'#ff4d4f'};
  var html=list.map(function(b){
    return '<tr style="cursor:pointer;" onclick="openBillDrawer(\''+b.id+'\')">'+
      '<td><b>'+b.id+'</b></td>'+
      '<td><a style="color:#1890ff;cursor:pointer;" onclick="event.stopPropagation();jumpToOrder(\''+b.orderId+'\')">'+b.orderId+'</a></td>'+
      '<td>'+b.vehicle+'</td>'+
      '<td>'+b.site+'</td>'+
      '<td><span style="padding:2px 8px;border-radius:10px;font-size:11px;background:#f0f7ff;color:#1890ff;">'+b.type+'</span></td>'+
      '<td style="text-align:right;">'+( b.laborFee?'¥ '+b.laborFee.toFixed(2):'-')+'</td>'+
      '<td style="text-align:right;">'+( b.partsFee?'¥ '+b.partsFee.toFixed(2):'-')+'</td>'+
      '<td style="text-align:right;font-weight:700;color:#1890ff;">¥ '+b.total.toFixed(2)+'</td>'+
      '<td><span style="padding:2px 8px;border-radius:10px;font-size:11px;color:#fff;background:'+(statusColor[b.status]||'#999')+';">'+b.status+'</span></td>'+
      '<td style="color:#888;font-size:12px;">'+b.submitTime+'</td>'+
      '<td class="col-action" onclick="event.stopPropagation()"><button class="btn btn-default" style="height:26px;padding:0 10px;font-size:11px;" onclick="openBillDrawer(\''+b.id+'\')">查看</button></td>'+
    '</tr>';
  }).join('');
  document.getElementById('billBody').innerHTML = html || '<tr><td colspan="11" style="text-align:center;color:#ccc;padding:32px;">暂无数据</td></tr>';
}

function openBillDrawer(id){
  var b=bills.find(function(x){return x.id===id;});
  if(!b) return;
  var o=orders.find(function(x){return x.id===b.orderId;})||{};
  var statusColor={'待审核':'#fa8c16','审核中':'#1890ff','已结算':'#52c41a','驳回':'#ff4d4f'};
  var sc=statusColor[b.status]||'#999';

  var laborRows=b.laborItems.map(function(i){
    return '<tr><td>'+i.name+'</td><td style="text-align:center;">'+i.qty+' '+i.unit+'</td><td style="text-align:right;">¥ '+i.price.toFixed(2)+'</td><td style="text-align:right;">¥ '+(i.qty*i.price).toFixed(2)+'</td></tr>';
  }).join('') || '<tr><td colspan="4" style="color:#ccc;text-align:center;">无工时费用</td></tr>';

  var partsRows=b.partsItems.map(function(i){
    return '<tr><td>'+i.partNo+'</td><td>'+i.name+'</td><td style="text-align:center;">'+i.qty+' '+i.unit+'</td><td style="text-align:right;">¥ '+i.price.toFixed(2)+'</td><td style="text-align:right;">¥ '+(i.qty*i.price).toFixed(2)+'</td><td style="text-align:center;"><span style="padding:1px 6px;border-radius:3px;font-size:11px;background:'+(i.warranty==='是'?'#f6ffed':'#fff1f0')+';color:'+(i.warranty==='是'?'#52c41a':'#ff4d4f')+';">'+i.warranty+'</span></td></tr>';
  }).join('') || '<tr><td colspan="6" style="color:#ccc;text-align:center;">无零件费用</td></tr>';


  var html=
    '<div class="detail-page-body-wrap">' +

      /* 卡片1：结算单基本信息 */
      '<div class="detail-card">' +
        '<div class="section-title" style="margin-top:0;">结算单信息</div>' +
        '<div class="info-grid">' +
          '<div class="info-item"><span class="info-label">结算单号</span><span class="info-val">' + b.id + '</span></div>' +
          '<div class="info-item"><span class="info-label">结算状态</span><span class="info-val">' +
            '<span class="badge ' + (b.status==='已结算'?'badge-done':(b.status==='审核中'?'badge-prog':'badge-wait')) + '">' + b.status + '</span>' +
          '</span></div>' +
          '<div class="info-item"><span class="info-label">结算类型</span><span class="info-val">' + b.type + '</span></div>' +
          '<div class="info-item"><span class="info-label">支付方式</span><span class="info-val">' + (b.payMethod||'线上支付') + '</span></div>' +
          '<div class="info-item"><span class="info-label">发票状态</span><span class="info-val">' + (b.invoiceStatus||'已开票') + '</span></div>' +
          '<div class="info-item"><span class="info-label">提交时间</span><span class="info-val">' + (b.submitTime||'2026-06-01 10:30') + '</span></div>' +
          '<div class="info-item"><span class="info-label">审核人</span><span class="info-val">' + (b.reviewer||'李财务') + '</span></div>' +
          '<div class="info-item"><span class="info-label">审核时间</span><span class="info-val">' + (b.reviewTime||'2026-06-01 14:20') + '</span></div>' +
          '<div class="info-item"><span class="info-label">创建时间</span><span class="info-val">' + (b.date||'—') + '</span></div>' +
        '</div>' +
      '</div>' +

      /* 卡片2：关联工单 */
      '<div class="detail-card">' +
        '<div class="section-title" style="margin-top:0;">关联工单</div>' +
        '<div class="info-grid">' +
          '<div class="info-item"><span class="info-label">工单号</span><span class="info-val">' +
            '<a href="javascript:void(0)" onclick="jumpToOrder(\'' + b.orderId + '\')" style="color:#1890ff;text-decoration:none;">' + b.orderId + '</a>' +
          '</span></div>' +
          '<div class="info-item"><span class="info-label">车辆编号</span><span class="info-val">' + (o.vehicle||'—') + '</span></div>' +
          '<div class="info-item"><span class="info-label">服务站</span><span class="info-val">' + (o.station||'—') + '</span></div>' +
          '<div class="info-item"><span class="info-label">工单状态</span><span class="info-val">' + statusTag(o.status) + '</span></div>' +
          '<div class="info-item span2"><span class="info-label">故障描述</span><span class="info-val">' + (o.fault||'—') + '</span></div>' +
        '</div>' +
      '</div>' +

      /* 卡片3：结算总金额 */
      '<div class="detail-card" style="background:#f0f9ff;border:1px solid #bae0ff;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<span style="font-size:14px;font-weight:600;color:#333;">结算总金额</span>' +
          '<span style="font-size:28px;font-weight:700;color:#1890ff;">¥ ' + b.total.toFixed(2) + '</span>' +
        '</div>' +
        '<div style="margin-top:10px;display:flex;gap:32px;font-size:13px;color:#666;">' +
          '<span>工时费用：<strong style="color:#333;">¥ ' + b.laborFee.toFixed(2) + '</strong></span>' +
          '<span>零件费用：<strong style="color:#333;">¥ ' + b.partsFee.toFixed(2) + '</strong></span>' +
        '</div>' +
      '</div>' +

      /* 卡片4：工时费用明细 */
      '<div class="detail-card">' +
        '<div class="section-title" style="margin-top:0;">工时费用明细</div>' +
        '<div class="table-wrap">' +
          '<table><thead><tr><th>工时项目</th><th style="text-align:center;">数量</th><th style="text-align:center;">单位</th><th style="text-align:right;">单价(元)</th><th style="text-align:right;">小计(元)</th></tr></thead>' +
          '<tbody>' + laborRows + '</tbody>' +
          '<tfoot><tr style="background:#fafafa;font-weight:600;"><td colspan="4" style="text-align:right;padding:8px 12px;">工时合计</td><td style="text-align:right;padding:8px 12px;color:#1890ff;">¥ ' + b.laborFee.toFixed(2) + '</td></tr></tfoot>' +
        '</table></div>' +
      '</div>' +

      /* 卡片5：换件/零件费用明细 */
      '<div class="detail-card">' +
        '<div class="section-title" style="margin-top:0;">换件 / 零件费用明细</div>' +
        '<div class="table-wrap">' +
          '<table><thead><tr><th>零件编号</th><th>零件名称</th><th style="text-align:center;">数量</th><th style="text-align:center;">单位</th><th style="text-align:right;">单价(元)</th><th style="text-align:right;">小计(元)</th><th style="text-align:center;">质保期</th></tr></thead>' +
          '<tbody>' + partsRows + '</tbody>' +
          '<tfoot><tr style="background:#fafafa;font-weight:600;"><td colspan="5" style="text-align:right;padding:8px 12px;">零件合计</td><td style="text-align:right;padding:8px 12px;color:#1890ff;">¥ ' + b.partsFee.toFixed(2) + '</td><td></td></tr></tfoot>' +
        '</table></div>' +
      '</div>' +

      /* 卡片6（条件）：备注/驳回原因 */
      (b.remark ?
        '<div class="detail-card">' +
          '<div class="section-title" style="margin-top:0;">备注 / 驳回原因</div>' +
          '<div style="background:#fffbe6;border-left:3px solid #faad14;padding:10px 14px;border-radius:4px;font-size:13px;color:#555;line-height:1.7;">' + b.remark + '</div>' +
        '</div>'
      : '') +

    '</div>';
  document.getElementById('billDetailPageTitle').innerText = '结算单详情 — ' + b.id;
  document.getElementById('billDetailPageBody').innerHTML = html;
  var abActions = '';
  if(b.status==='待审核') abActions += '<button class="btn btn-danger" style="margin-left:8px;" onclick="showToast(\'已驳回\',\'error\')">驳回</button><button class="btn btn-primary" style="margin-left:8px;" onclick="showToast(\'已提交审核\',\'success\')">提交审核</button>';
  if(b.status==='审核中') abActions += '<button class="btn btn-danger" style="margin-left:8px;" onclick="showToast(\'已驳回\',\'error\')">驳回</button><button class="btn btn-success" style="margin-left:8px;" onclick="showToast(\'审核通过，已结算\',\'success\')">审核通过</button>';
  document.getElementById('billDetailPageActions').innerHTML = abActions;
  document.getElementById('page-bill').classList.add('hidden');
  document.getElementById('page-bill-detail').classList.remove('hidden');
  document.getElementById('crumb').innerText = '结算单管理 / 结算单详情';
}
function closeBillDetail(){
  document.getElementById('page-bill-detail').classList.add('hidden');
  document.getElementById('page-bill').classList.remove('hidden');
  document.getElementById('crumb').innerText = '结算单管理';
}
function jumpToOrder(orderId){
  // 隐藏所有页面，切换到工单管理并打开对应工单详情
  ['page-bill','page-bill-detail','page-maint','page-config','page-order-detail'].forEach(function(id){
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('page-workorder').classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  document.getElementById('nav-workorder').classList.add('active');
  document.getElementById('crumb').innerText = '工单管理';
  openDrawer(orderId);
}

var activeCard = null;
function filterByCard(el, status){
  document.querySelectorAll('.stat-card').forEach(function(c){c.classList.remove('active');});
  if(activeCard === status){ activeCard=null; renderTable(orders); return; }
  activeCard = status;
  el.classList.add('active');
  var list = orders.filter(function(o){ return toUnifiedStatus(o.status) === status; });
  renderTable(list);
}
function applyFilter(){
  var kw       = document.getElementById('searchKw').value.toLowerCase();
  var t        = document.getElementById('fType').value;
  var s        = document.getElementById('fStatus').value;
  var sub      = document.getElementById('fSub').value;
  var p        = document.getElementById('fPri').value;
  var station  = window._cascaderValue || '';
  var src      = document.getElementById('fSrc').value;
  var oem      = document.getElementById('fOem').value;
  var sla      = document.getElementById('fSla').value;
  var role     = document.getElementById('fRole').value;
  var dateFrom = document.getElementById('fDateFrom').value;
  var dateTo   = document.getElementById('fDateTo').value;
  document.querySelectorAll('.stat-card').forEach(function(c){c.classList.remove('active');});
  activeCard = null;
  var list = orders.filter(function(o){
    if(kw && !(o.id.toLowerCase().includes(kw)||o.vehicle.toLowerCase().includes(kw)||
               o.site.includes(kw)||(o.reporter&&o.reporter.toLowerCase().includes(kw)))) return false;
    if(t   && o.type!==t)    return false;
    if(s   && toUnifiedStatus(o.status)!==s)  return false;
    if(sub && o.sub!==sub)   return false;
    if(p   && o.pri!==p)     return false;
    if(station && o.station!==station) return false;
    if(src && o.reportSrc!==src)       return false;
    if(oem && o.oem!==oem)             return false;
    if(role && o.reporterRole!==role)  return false;
    if(sla === '超时风险') { var d = calcSlaDeadline(o); if(!d || d > new Date()) return false; }
    if(sla === '正常')     { var d = calcSlaDeadline(o); if(d && d <= new Date()) return false; }
    if(dateFrom && o.reportTime && o.reportTime.slice(0,10) < dateFrom) return false;
    if(dateTo   && o.reportTime && o.reportTime.slice(0,10) > dateTo)   return false;
    return true;
  });
  renderTable(list);
}
function resetFilter(){
  ['searchKw','fType','fStatus','fSub','fPri','fSrc','fOem','fSla','fRole','fDateFrom','fDateTo']
    .forEach(function(id){ document.getElementById(id).value=''; });
  clearCascader();
  document.querySelectorAll('.stat-card').forEach(function(c){c.classList.remove('active');});
  activeCard = null;
  renderTable(orders);
}

var commentStore = {};
function getComments(id){
  if(!commentStore[id]){
    commentStore[id] = [
      { role:'ops', name:'王运营', time:'2026-06-08 08:55', text:'工单已受理，正在联系服务站接单，请关注进度。' },
      { role:'station', name:'张师傅', time:'2026-06-08 09:10', text:'已到场，正在用诊断仪扫码，初步判断是 GPS 模块问题，稍后上传诊断图片。' },
      { role:'rd', name:'李研发', time:'2026-06-08 10:30', text:'已查看诊断日志，GPS 天线信号强度 -105dBm，低于阈值 -95dBm，建议更换天线，零件号 JXG-ANT-003。' },
      { role:'ops', name:'王运营', time:'2026-06-08 10:45', text:'收到，已通知服务站备货，预计今日下午完成维修。' }
    ];
  }
  return commentStore[id];
}
function renderComments(id){
  var list = getComments(id);
  var roleMap = { ops:'运营', station:'服务站', rd:'研发', system:'系统' };
  var avCls = { ops:'avatar-ops', station:'avatar-station', rd:'avatar-rd', system:'avatar-system' };
  var tagCls = { ops:'role-tag-ops', station:'role-tag-station', rd:'role-tag-rd', system:'role-tag-system' };
  return list.map(function(c){
    var isSelf = (c.role === 'ops');
    var imgs = c.imgs ? c.imgs.map(function(img){ return '<div class="comment-img-thumb">'+img+'</div>'; }).join('') : '';
    var imgBlock = imgs ? '<div class="comment-imgs">'+imgs+'</div>' : '';
    return '<div class="comment-item'+(isSelf?' self':'')+'">' +
      '<div class="comment-avatar '+avCls[c.role]+'">'+c.name.charAt(0)+'</div>' +
      '<div class="comment-bubble-wrap">' +
        '<div class="comment-meta">' +
          '<span class="comment-name">'+c.name+'</span>' +
          '<span class="comment-role-tag '+tagCls[c.role]+'">'+roleMap[c.role]+'</span>' +
          '<span>'+c.time+'</span>' +
        '</div>' +
        '<div class="comment-bubble">'+c.text+imgBlock+'</div>' +
      '</div>' +
    '</div>';
  }).join('');
}
function sendComment(orderId){
  var ta = document.getElementById('commentInput');
  var txt = ta.value.trim();
  var previewArea = document.getElementById('commentImgPreview');
  var hasPending = previewArea && previewArea.children.length > 0;
  if(!txt && !hasPending){ showToast('请输入留言内容', 'warning'); return; }
  var d = new Date();
  var pad = function(n){return n<10?'0'+n:n;};
  var now = d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes());
  var imgs = [];
  if(hasPending){ for(var i=0;i<previewArea.children.length;i++){ imgs.push('[图片]'); } }
  var newComment = { role:'ops', name:'王运营', time:now, text:txt||'(已上传图片)' };
  if(imgs.length) newComment.imgs = imgs;
  getComments(orderId).push(newComment);
  var cl = document.getElementById('commentList');
  if(cl){ cl.innerHTML = renderComments(orderId); cl.scrollTop = cl.scrollHeight; }
  ta.value = '';
  if(previewArea) previewArea.innerHTML = '';
}
function triggerImgUpload(){
  var inp = document.getElementById('commentFileInput');
  if(inp){ inp.click(); }
}
function handleImgSelect(orderId){
  var inp = document.getElementById('commentFileInput');
  var previewArea = document.getElementById('commentImgPreview');
  if(!inp||!inp.files||!previewArea) return;
  for(var i=0;i<inp.files.length;i++){
    var thumb = document.createElement('div');
    thumb.className = 'preview-img-item';
    thumb.innerHTML = '<span style="font-size:11px;color:#999;">图片</span><div class="preview-img-rm" onclick="this.parentNode.remove()">×</div>';
    previewArea.appendChild(thumb);
  }
  inp.value = '';
}

/* ===== Toast ===== */
function showToast(msg, type, duration) {
  var container = document.getElementById('toastContainer');
  var el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  var icon = type==='success'?'':type==='error'?'':type==='warning'?'':'';
  el.innerText = icon + msg;
  container.appendChild(el);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('show'); }); });
  setTimeout(function(){
    el.classList.remove('show');
    setTimeout(function(){ el.remove(); }, 350);
  }, duration || 2400);
}

function openDrawer(id){
  var o = orders.find(function(x){return x.id===id;});
  if(!o) return;
  document.getElementById('detailPageTitle').innerHTML = '<span style="color:#999;font-size:12px;font-weight:400;margin-right:8px;">'+o.id+'</span>'+o.desc;
  var badge = document.getElementById('detailPageBadge');
  if(badge) badge.innerHTML = priTag(o.pri) + ' ' + statusTag(o.status);
  var _flow = getFlow(o.type);
  var _masterList = _flow.master;
  var _subList = _flow.sub;
  var masterIdx = _masterList.indexOf(o.status);
  var masterFlow = _masterList.map(function(s,i){
    var cls = i<masterIdx?'done':(i===masterIdx?'current':'');
    return '<div class="status-step"><div class="step-circle '+cls+'">'+(i+1)+'</div><div class="step-label">'+s+'</div></div>'+(i<_masterList.length-1?'<div class="step-line '+(i<masterIdx?'done':'')+'"></div>':'');
  }).join('');
  var subIdx = _subList.indexOf(o.sub);
  var subStepsMap = {};
  if(o.subSteps) o.subSteps.forEach(function(s){ subStepsMap[s.step] = s; });
  var subTL = _subList.map(function(s,i){
    var isDone = i < subIdx;
    var isCur  = i === subIdx;
    var dotCls    = 'timeline-dot'+(isDone?' done':isCur?' current':'');
    var statusCls = 'timeline-status'+(isDone?' done':isCur?' current':'');
    var textCls   = 'timeline-text'+(isCur?' current':'');
    var statusTxt = isDone?'完成':isCur?'进行中':'—';
    var step = subStepsMap[s];
    var metaHtml = '';
    if(step){
      var timeStr = step.startTime ? step.startTime.slice(5) : '';
      if(step.endTime && step.endTime !== step.startTime) timeStr += ' → ' + step.endTime.slice(5);
      else if(isCur) timeStr += ' → 进行中';
      metaHtml = '<span style="display:flex;gap:10px;margin-top:2px;font-size:11px;color:#aaa;flex-wrap:wrap;">' +
        (step.executor ? '<span>执行人：<b style="color:#666;">'+step.executor+'</b></span>' : '') +
        (timeStr ? '<span>'+timeStr+'</span>' : '') +
        '</span>';
    }
    return '<div class="timeline-item"><div class="'+dotCls+'"></div><div style="flex:1;min-width:0;">'+
      '<div style="display:flex;align-items:center;gap:6px;">'+
        '<span class="'+statusCls+'">'+statusTxt+'</span>'+
        '<span class="'+textCls+'">'+s+'</span>'+
      '</div>'+
      metaHtml+
    '</div></div>';
  }).join('');
  var rp = o.reporterPhone&&o.reporterPhone!=='-' ? '<span style="color:#888;margin-left:6px;">'+o.reporterPhone+'</span>' : '';
  var hasRelated = (o.accidentNo&&o.accidentNo!=='-')||(o.defectNo&&o.defectNo!=='-')||(o.relatedDefect&&o.relatedDefect!=='-');
  var relatedHtml = '';
  if(hasRelated){
    relatedHtml = '<div class="section-title">关联单号</div><div class="info-grid">';
    if(o.accidentNo&&o.accidentNo!=='-') relatedHtml += '<div class="info-item"><span class="info-label">事故单号</span><span class="info-value" style="color:#ff4d4f;font-weight:600;">'+o.accidentNo+'</span></div>';
    if(o.defectNo&&o.defectNo!=='-') relatedHtml += '<div class="info-item"><span class="info-label">缺陷编号</span><span class="info-value" style="color:#722ed1;font-weight:600;">'+o.defectNo+'</span></div>';
    if(o.relatedDefect&&o.relatedDefect!=='-') relatedHtml += '<div class="info-item"><span class="info-label">关联缺陷</span><span class="info-value" style="color:#722ed1;">'+o.relatedDefect+'</span></div>';
    relatedHtml += '</div>';
  }
  var commentHtml =
    '<div class="section-title">诊断留言</div>' +
    '<div class="comment-section">' +
      '<div class="comment-list" id="commentList">'+renderComments(id)+'</div>' +
      '<div class="comment-input-wrap">' +
        '<div class="comment-toolbar">' +
          '<button class="comment-toolbar-btn" title="上传图片" onclick="triggerImgUpload()">图片</button>' +
          '<button class="comment-toolbar-btn" title="Emoji">表情</button>' +
        '</div>' +
        '<div id="commentImgPreview" class="preview-imgs"></div>' +
        '<textarea class="comment-textarea" id="commentInput" placeholder="输入留言内容，支持上传图片…"></textarea>' +
        '<div class="comment-footer">' +
          '<span class="comment-hint">' +
            '<span class="comment-hint-dot" style="background:#1890ff;"></span>运营' +
            '<span class="comment-hint-dot" style="background:#52c41a;"></span>服务站' +
            '<span class="comment-hint-dot" style="background:#722ed1;"></span>研发' +
          '</span>' +
          '<button class="btn btn-primary" style="height:28px;padding:0 16px;font-size:12px;border-radius:6px;" onclick="sendComment(\''+id+'\')">' +
          '发送</button>' +
        '</div>' +
      '</div>' +
      '<input type="file" id="commentFileInput" accept="image/*" multiple style="display:none;" onchange="handleImgSelect(\''+id+'\')">' +
    '</div>';
  document.getElementById('detailPageBody').innerHTML =
    '<div class="detail-card">' +
      '<div class="section-title" style="margin-top:0;">车辆信息</div>' +
      '<div class="info-grid">' +
        '<div class="info-item"><span class="info-label">车辆编号</span><span class="info-value" style="font-weight:600;">'+o.vehicle+'</span></div>' +
        '<div class="info-item"><span class="info-label">车型</span><span class="info-value">'+(o.vehicleModel||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">车牌号</span><span class="info-value">'+(o.vehicleNo||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">OEM</span><span class="info-value">'+(o.oem||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">VIN</span><span class="info-value">'+(o.vin||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">所属站点</span><span class="info-value">'+o.site+'</span></div>' +
        '<div class="info-item"><span class="info-label">站点负责人</span><span class="info-value">'+(o.stationManager||'-')+(o.stationManagerPhone&&o.stationManagerPhone!=='-'?'<span style="color:#888;margin-left:6px;font-size:12px;">'+o.stationManagerPhone+'</span>':'')+'</span></div>' +
        '<div class="info-item span2"><span class="info-label">实时位置</span><span class="info-value">'+(o.realtimeLoc||'-')+'<span style="color:#999;font-size:11px;margin-left:8px;">'+(o.locTime?'更新于 '+o.locTime:'')+'</span><span style="margin-left:8px;padding:1px 6px;border-radius:3px;font-size:11px;background:'+(o.locStatus==='行驶中'?'#e6f7ff':o.locStatus==='维修中'?'#fff7e6':'#f5f5f5')+';color:'+(o.locStatus==='行驶中'?'#1890ff':o.locStatus==='维修中'?'#fa8c16':'#999')+'">'+(o.locStatus||'')+'</span>'+(o.locSpeed && o.locSpeed!=='0 km/h'?'<span style="color:#999;font-size:11px;margin-left:6px;">'+o.locSpeed+'</span>':'')+'</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="detail-card">' +
      '<div class="section-title" style="margin-top:0;">工单信息</div>' +
      '<div class="info-grid">' +
        '<div class="info-item"><span class="info-label">工单类型</span><span class="info-value">'+o.type+'</span></div>' +
        '<div class="info-item"><span class="info-label">优先级</span><span class="info-value">'+priTag(o.pri)+'</span></div>' +
        '<div class="info-item"><span class="info-label">主状态</span><span class="info-value">'+statusTag(o.status)+'</span></div>' +
        '<div class="info-item"><span class="info-label">子状态</span><span class="info-value"><span class="tag tag-status">'+o.sub+'</span></span></div>' +
        '<div class="info-item"><span class="info-label">SLA</span><span class="info-value">'+getSlaText(o)+'</span></div>' +
        '<div class="info-item"><span class="info-label">工单来源</span><span class="info-value">'+(o.reportSrc||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">服务站</span><span class="info-value">'+o.station+'</span></div>' +
        '<div class="info-item"><span class="info-label">站点负责人</span><span class="info-value">'+(o.stationManager||'-')+(o.stationManagerPhone?' ('+o.stationManagerPhone+')':'')+'</span></div>' +
        '<div class="info-item"><span class="info-label">下一动作</span><span class="info-value" style="color:#1890ff;">'+o.next+'</span></div>' +
        '<div class="info-item"><span class="info-label">提报人</span><span class="info-value">'+(o.reporter||'-')+rp+'<span style="color:#bbb;font-size:11px;margin-left:4px;">('+o.reporterRole+')</span></span></div>' +
        '<div class="info-item"><span class="info-label">提报时间</span><span class="info-value">'+(o.reportTime||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">影响时长/天数</span><span class="info-value">'+(o.affectHours!=null?'<strong>'+o.affectHours+'h</strong> / <strong>'+o.affectDays+'天</strong>':'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">最后操作人</span><span class="info-value">'+(o.lastOp||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">最后操作时间</span><span class="info-value">'+(o.lastOpTime||'-')+'</span></div>' +
        (hasRelated ?
          (o.accidentNo&&o.accidentNo!=='-'?'<div class="info-item"><span class="info-label">事故单号</span><span class="info-value" style="color:#ff4d4f;font-weight:600;">'+o.accidentNo+'</span></div>':'') +
          (o.defectNo&&o.defectNo!=='-'?'<div class="info-item"><span class="info-label">缺陷编号</span><span class="info-value" style="color:#722ed1;font-weight:600;">'+o.defectNo+'</span></div>':'') +
          (o.relatedDefect&&o.relatedDefect!=='-'?'<div class="info-item"><span class="info-label">关联缺陷</span><span class="info-value" style="color:#722ed1;">'+o.relatedDefect+'</span></div>':'')
        : '') +
        '<div class="info-item span3"><span class="info-label">故障描述</span><span class="info-value" style="line-height:1.7;">'+o.desc+'</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="detail-card">' +
      '<div class="section-title" style="margin-top:0;">主状态流转</div>' +
      '<div class="status-flow" style="flex-wrap:wrap;padding:8px 0;">'+masterFlow+'</div>' +
      '<div class="section-title" style="display:flex;align-items:center;justify-content:space-between;">' +
        '<span>维修子单进度</span>' +
        '<button class="btn btn-primary" style="height:26px;padding:0 12px;font-size:12px;border-radius:4px;" onclick="openAddSubOrderModal(\''+id+'\')">' +
          '＋ 新建维修子单' +
        '</button>' +
      '</div>' +
      '<div class="timeline">'+subTL+'</div>' +
    '</div>' +
    '<div class="detail-card">' + syncBlock(o) + costBlock(o) + partsBlock(o) + '</div>' +
    (acceptBlock(o) ? '<div class="detail-card">' + acceptBlock(o) + '</div>' : '') +
    '<div class="detail-card">' + commentHtml + '</div>';
  var cl = document.getElementById('commentList');
  if(cl) setTimeout(function(){ cl.scrollTop = cl.scrollHeight; }, 50);
  var actions = '';
  var us = toUnifiedStatus(o.status);
  if(us==='待受理') actions = '<button class="btn btn-danger" onclick="opAct(\''+o.id+'\',\'驳回\')">受理驳回</button><button class="btn btn-primary" onclick="opAct(\''+o.id+'\',\'受理\')">受理并创建子单</button><button class="btn btn-default" onclick="openEditModal(\''+o.id+'\')">编辑工单</button>';
  else if(us==='待验收') actions = '<button class="btn btn-danger" onclick="opAct(\''+o.id+'\',\'验收驳回\')">验收驳回</button><button class="btn btn-success" onclick="opAct(\''+o.id+'\',\'验收通过\')">验收通过</button><button class="btn btn-default" onclick="openEditModal(\''+o.id+'\')">编辑工单</button>';
  else if(o.sub==='服务站诊断中') actions = '<button class="btn btn-default" onclick="opAct(\''+o.id+'\',\'升级复诊\')">升级售后/研发复诊</button><button class="btn btn-default" onclick="openEditModal(\''+o.id+'\')">编辑工单</button>';
  else if(us==='已完成') actions = '';
  else if(us==='验收驳回' || o.status==='受理驳回') actions = '<button class="btn btn-default" onclick="openEditModal(\''+o.id+'\')">编辑工单</button>';
  else actions = '<button class="btn btn-default" onclick="openEditModal(\''+o.id+'\')">编辑工单</button>';
  document.getElementById('detailPageActions').innerHTML = actions;
  document.getElementById('page-workorder').classList.add('hidden');
  document.getElementById('page-order-detail').classList.remove('hidden');
  document.getElementById('crumb').innerText = '工单管理 / 工单详情';
}
function closeOrderDetail(){
  document.getElementById('page-order-detail').classList.add('hidden');
  document.getElementById('page-workorder').classList.remove('hidden');
  document.getElementById('crumb').innerText = '工单管理';
}
function closeDrawer(){ closeOrderDetail(); }
function opAct(id, act){
  showToast('已对工单 ' + id + ' 执行：' + act, 'success');
  closeOrderDetail();
}

/* ===== 编辑工单 ===== */
var editingId = null;
function openEditModal(id){
  editingId = id;
  var o = orders.find(function(x){ return x.id === id; });
  if(!o) return;
  document.getElementById('editType').value = o.type || '';
  document.getElementById('editPri').value = o.pri || '';
  document.getElementById('editVehicle').value = o.vehicle || '';
  document.getElementById('editVehicleModel').value = o.vehicleModel || '';
  document.getElementById('editVehicleNo').value = o.vehicleNo || '';
  document.getElementById('editSite').value = o.site || '';
  document.getElementById('editStation').value = o.station || '';
  document.getElementById('editSrc').value = o.reportSrc || '';
  document.getElementById('editReporter').value = o.reporter || '';
  document.getElementById('editPhone').value = o.reporterPhone || '';
  if(document.getElementById('editRole')) document.getElementById('editRole').value = o.reporterRole || '';
  document.getElementById('editDesc').value = o.desc || '';
  document.getElementById('editOrderPageTitle').textContent = '编辑工单 · ' + id;
  showFormPage('page-edit-order');
}
/* ===== 缺陷提报 ===== */
var defectOrderId = null;
function openDefectModal(id){
  defectOrderId = id;
  var o = orders.find(function(x){ return x.id === id; });
  // 预填标题和时间
  document.getElementById('defectTitle').value = o ? o.desc : '';
  document.getElementById('defectDesc').value = '';
  document.getElementById('defectSeverity').value = '';
  document.getElementById('defectRoverVer').value = '';
  // 默认发生时间为当前时间
  var now = new Date();
  var pad = function(n){ return n < 10 ? '0' + n : n; };
  document.getElementById('defectTime').value =
    now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) +
    'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  document.querySelectorAll('input[name="defectCrash"]').forEach(function(r){ r.checked = r.value === '否'; });
  document.getElementById('defectFileInput').value = '';
  showFormPage('page-defect');
}
function submitDefect(){
  var title = document.getElementById('defectTitle').value.trim();
  var severity = document.getElementById('defectSeverity').value;
  var rover = document.getElementById('defectRoverVer').value;
  var time = document.getElementById('defectTime').value;
  var desc = document.getElementById('defectDesc').value.trim();
  if(!title){ showToast('请填写问题标题', 'warning'); return; }
  if(!severity){ showToast('请选择严重程度', 'warning'); return; }
  if(!rover){ showToast('请选择 Rover 版本', 'warning'); return; }
  if(!time){ showToast('请填写发生时间', 'warning'); return; }
  if(!desc){ showToast('请填写问题描述', 'warning'); return; }
  closeFormPage('defect-back');
  showToast('缺陷已提报成功', 'success');
}

function submitEdit(){
  var o = orders.find(function(x){ return x.id === editingId; });
  if(!o) return;
  o.type = document.getElementById('editType').value;
  o.pri = document.getElementById('editPri').value;
  o.vehicle = document.getElementById('editVehicle').value;
  o.vehicleModel = document.getElementById('editVehicleModel').value;
  o.vehicleNo = document.getElementById('editVehicleNo').value;
  o.site = document.getElementById('editSite').value;
  o.station = document.getElementById('editStation').value;
  o.reportSrc = document.getElementById('editSrc').value;
  o.reporter = document.getElementById('editReporter').value;
  o.reporterPhone = document.getElementById('editPhone').value;
  o.reporterRole = document.getElementById('editRole') ? document.getElementById('editRole').value : o.reporterRole;
  o.desc = document.getElementById('editDesc').value;
  renderTable(orders);
  closeFormPage('edit-back');
  if(!document.getElementById('page-order-detail').classList.contains('hidden')){
    openDrawer(editingId);
  }
  showToast('工单已更新', 'success');
}

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

// ===== 表单页面跳转（替代弹窗）=====
var _formPageFrom = 'workorder'; // 记录来源页，用于返回
var _allFormPages = ['page-new-order','page-edit-order','page-defect','page-batch-order','page-maint-batch','page-add-sub-order','page-type-edit'];
var _allMainPages = ['page-workorder','page-maint','page-bill','page-config','page-order-detail','page-bill-detail'];

function showFormPage(pageId) {
  // 记录当前可见的主页（用于返回）
  _allMainPages.concat(_allFormPages).forEach(function(id) {
    var el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) { _formPageFrom = id; }
  });
  // 隐藏所有主页和其他表单页
  _allMainPages.concat(_allFormPages).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  var target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden');
    document.querySelector('.content').scrollTop = 0;
  }
}

function closeFormPage(dest) {
  // 隐藏所有表单页
  _allFormPages.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  if (dest === 'edit-back') {
    // 编辑工单：返回工单详情或列表
    var detailPage = document.getElementById('page-order-detail');
    if (_formPageFrom === 'page-order-detail') {
      detailPage.classList.remove('hidden');
    } else {
      document.getElementById('page-workorder').classList.remove('hidden');
    }
  } else if (dest === 'defect-back') {
    var detailPage = document.getElementById('page-order-detail');
    if (_formPageFrom === 'page-order-detail') {
      detailPage.classList.remove('hidden');
    } else {
      document.getElementById('page-workorder').classList.remove('hidden');
    }
  } else if (dest === 'sub-back') {
    var detailPage = document.getElementById('page-order-detail');
    if (_formPageFrom === 'page-order-detail') {
      detailPage.classList.remove('hidden');
    } else {
      document.getElementById('page-workorder').classList.remove('hidden');
    }
  } else {
    // workorder / maint / bill / config
    var pageMap = {
      'workorder':'page-workorder', 'maint':'page-maint',
      'bill':'page-bill', 'config':'page-config'
    };
    var targetId = pageMap[dest] || 'page-workorder';
    document.getElementById(targetId).classList.remove('hidden');
    if (dest === 'maint') renderMaint();
    if (dest === 'bill') { renderBillTable(); updateBillStatCards(); }
  }
}
function submitNew(){
  var t=document.getElementById('newType').value, p=document.getElementById('newPri').value;
  var v=document.getElementById('newVehicle').value, s=document.getElementById('newSite').value;
  if(!t||!p||!v||!s){ showToast('请补全必填项', 'error'); return; }
  var id='WO-2026060' + String(Math.floor(Math.random()*900)+100);
  var now = new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-');
  // 自动受理判断
  var flow = flowTemplates[t] || flowTemplates['故障维修'];
  var autoAccept = _typeAutoAcceptMap[t] === '是';
  var initStatus = autoAccept ? flow.master[1] : '待受理';
  var initSub = autoAccept ? (flow.sub[0] || '-') : '-';
  var initStation = autoAccept ? '天津市冀津贸易有限公司' : '待推荐';
  var initNext = autoAccept ? flow.sub[1] || flow.master[2] || '-' : '运营受理';
  var initLastOp = autoAccept ? '系统自动受理' : document.getElementById('newReporter').value || '运营手动';
  orders.unshift({id:id, vehicle:v, site:s, type:t, pri:p, status:initStatus, sub:initSub, station:initStation, sla:autoAccept?'剩余 60 分钟':'剩余 60 分钟', next:initNext, desc:document.getElementById('newDesc').value,
    reporter: document.getElementById('newReporter').value || '运营手动',
    reporterPhone: document.getElementById('newReporterPhone').value || '-',
    reporterRole: document.getElementById('newReporterRole').value || '售后运营管理员',
    reportTime: now, reportSrc:'运营手动',
    vehicleModel: document.getElementById('newVehicleModel').value || '-',
    vehicleNo: document.getElementById('newVehicleNo').value || '-',
    stationManager: '-',
    acceptResult: autoAccept ? '通过' : undefined,
    acceptTime: autoAccept ? now : undefined,
    acceptBy: autoAccept ? '系统自动' : undefined,
    acceptComment: autoAccept ? '自动受理：该工单类型已配置自动受理' : undefined
  });
  renderTable(orders);
  closeFormPage('workorder');
  ['newType','newPri','newVehicle','newSite','newDesc','newReporter','newReporterPhone','newReporterRole','newVehicleModel','newVehicleNo'].forEach(function(i){document.getElementById(i).value='';});
  showToast(autoAccept ? '已创建工单 ' + id + '（自动受理）' : '已创建主工单 ' + id, 'success');
}
function updateBatchPreview(){
  var text=document.getElementById('batchText').value.trim();
  var t=document.getElementById('batchType').value || '(请选类型)';
  var p=document.getElementById('batchPri').value;
  if(!text){ document.getElementById('batchPreview').innerText='空输入...'; document.getElementById('batchCount').innerText=0; return;}
  var lines=text.split('\n').filter(function(l){return l.trim();});
  document.getElementById('batchCount').innerText=lines.length;
  document.getElementById('batchPreview').innerHTML=lines.map(function(l){
    var parts=l.split('｜'); var v=parts[0], d=parts[1];
    return '<div class="preview-item">'+(v||'(车辆)')+' · '+t+' · '+priTag(p)+' · '+(d||'(描述)')+'</div>';
  }).join('');
}
function submitBatch(){
  var text=document.getElementById('batchText').value.trim();
  if(!text){ showToast('请输入批量文本', 'error'); return; }
  var lines=text.split('\n').filter(function(l){return l.trim();});
  showToast('已批量创建 ' + lines.length + ' 条待受理主工单', 'success');
  closeFormPage('workorder');
}

var maintHistory = [
  {id:'MH-2026050001',vehicle:'JXG-001234',model:'miniVan量产',vehicleNo:'JDE6067',site:'北京亦庄站点',type:'小保',mileage:5000,items:'机油/机滤/轮胎检查',station:'北京自营服务站',time:'2026-05-10',result:'正常完成',nextMileage:10000,operator:'张师傅'},
  {id:'MH-2026050002',vehicle:'JXG-001237',model:'miniVan量产',vehicleNo:'JDE6031',site:'北京中关村站',type:'首保',mileage:3000,items:'全车检查/轮胎调整',station:'北京自营服务站',time:'2026-05-12',result:'发现问题',nextMileage:8000,operator:'李技师'},
  {id:'MH-2026040003',vehicle:'JXG-001241',model:'miniVan量产',vehicleNo:'JDE6118',site:'上海浦东站',type:'大保',mileage:20000,items:'机油/机滤/空滤/刹车液/冷��液',station:'上海服务站',time:'2026-04-20',result:'正常完成',nextMileage:25000,operator:'王师傅'},
  {id:'MH-2026050004',vehicle:'JXG-001255',model:'miniVan量产',vehicleNo:'JDE6055',site:'北京通州站',type:'季度点检',mileage:12000,items:'灯光/制动/传感器检查',station:'北京自营服务站',time:'2026-05-22',result:'发现问题',nextMileage:15000,operator:'张师傅'},
  {id:'MH-2026050005',vehicle:'JXG-001260',model:'miniVan量产',vehicleNo:'JDE6202',site:'武汉光谷站',type:'小保',mileage:8000,items:'机油/机滤',station:'武汉外协',time:'2026-05-28',result:'正常完成',nextMileage:13000,operator:'周师傅'},
  {id:'MH-2026040006',vehicle:'JXG-001268',model:'miniVan量产',vehicleNo:'JDE6088',site:'北京海淀站',type:'小保',mileage:6000,items:'机油/机滤/雨刮',station:'北京自营服务站',time:'2026-04-15',result:'正常完成',nextMileage:11000,operator:'张师傅'},
  {id:'MH-2026050007',vehicle:'JXG-001270',model:'miniVan量产',vehicleNo:'JDE6143',site:'上海徐汇站',type:'首保',mileage:2800,items:'全车检查',station:'上海服务站',time:'2026-05-05',result:'正常完成',nextMileage:8000,operator:'陈师傅'},
  {id:'MH-2026050008',vehicle:'JXG-001275',model:'miniVan量产',vehicleNo:'JDE6177',site:'北京顺义站',type:'季度点检',mileage:9500,items:'电气系统/底盘检查',station:'北京自营服务站',time:'2026-05-30',result:'发现问题',nextMileage:12000,operator:'李技师'}
];
var maintPlan = [
  {vehicle:'JXG-001234',site:'北京亦庄站点',currentMileage:9200,lastTime:'2026-05-10',lastMileage:5000,planType:'小保',planMileage:10000,hasOrder:true,orderId:'WO-2026060001',dueDate:'2026-06-12',urgency:'7天内'},
  {vehicle:'JXG-001237',site:'北京中关村站',currentMileage:7800,lastTime:'2026-05-12',lastMileage:3000,planType:'小保',planMileage:8000,hasOrder:true,orderId:'WO-2026060002',dueDate:'2026-06-05',urgency:'已逾期'},
  {vehicle:'JXG-001241',site:'上海浦东站',currentMileage:24100,lastTime:'2026-04-20',lastMileage:20000,planType:'大保',planMileage:25000,hasOrder:true,orderId:'WO-2026060003',dueDate:'2026-06-25',urgency:'30天内'},
  {vehicle:'JXG-001255',site:'北京通州站',currentMileage:14200,lastTime:'2026-05-22',lastMileage:12000,planType:'小保',planMileage:15000,dueDate:'2026-07-10',urgency:'30天以上'},
  {vehicle:'JXG-001260',site:'武汉光谷站',currentMileage:12800,lastTime:'2026-05-28',lastMileage:8000,planType:'季度点检',planMileage:13000,dueDate:'2026-06-08',urgency:'已逾期'},
  {vehicle:'JXG-001268',site:'北京海淀站',currentMileage:10500,lastTime:'2026-04-15',lastMileage:6000,planType:'小保',planMileage:11000,dueDate:'2026-06-15',urgency:'7天内'},
  {vehicle:'JXG-001270',site:'上海徐汇站',currentMileage:7600,lastTime:'2026-05-05',lastMileage:2800,planType:'小保',planMileage:8000,dueDate:'2026-06-20',urgency:'30天内'},
  {vehicle:'JXG-001275',site:'北京顺义站',currentMileage:11800,lastTime:'2026-05-30',lastMileage:9500,planType:'大保',planMileage:20000,dueDate:'2026-09-01',urgency:'30天以上'}
];
function resultTag(r){ return r==='正常完成'?'<span class="tag tag-done">正常完成</span>':'<span class="tag tag-pending">发现问题</span>'; }
function urgencyTag(u){ var m={'已逾期':'danger','7天内':'p1','30天内':'p2','30天以上':'done','已提单':'prog'}; return '<span class="tag tag-'+(m[u]||'status')+'">'+u+'</span>'; }
function renderMaintHist(list){
  document.getElementById('maintHistBody').innerHTML = (list||maintHistory).map(function(r){
    return '<tr><td><strong style="color:#1890ff;">'+r.id+'</strong></td><td>'+r.vehicle+'</td><td><span style="color:#999;font-size:11px;">'+r.model+' / '+r.vehicleNo+'</span></td><td>'+r.site+'</td><td>'+r.type+'</td><td>'+r.mileage+'</td><td>'+r.items+'</td><td>'+r.station+'</td><td>'+r.time+'</td><td>'+resultTag(r.result)+'</td><td>'+r.nextMileage+'</td><td>'+r.operator+'</td></tr>';
  }).join('');
}
var currentPlanList = [];
function renderMaintPlan(list){
  currentPlanList = (list || maintPlan).slice().sort(function(a,b){
    var order={'已逾期':0,'7天内':1,'已提单':2,'30天内':3,'30天以上':4};
    var ua=a.hasOrder?'已提单':a.urgency, ub=b.hasOrder?'已提单':b.urgency;
    return (order[ua]!=null?order[ua]:5)-(order[ub]!=null?order[ub]:5);
  });
  var urgencyRowCls = {'已逾期':'color:#ff4d4f;background:#fff1f0;','7天内':'','30天内':'','30天以上':''};
  document.getElementById('maintPlanBody').innerHTML = currentPlanList.map(function(r,i){
    var rowStyle = r.hasOrder ? '' : (urgencyRowCls[r.urgency] || '');
    return '<tr style="'+rowStyle+'">'
      +'<td><input type="checkbox" class="plan-check" data-idx="'+i+'"></td>'
      +'<td>'+r.vehicle+'</td><td>'+r.site+'</td><td>'+r.currentMileage+'</td>'
      +'<td>'+r.lastTime+'</td><td>'+r.lastMileage+'</td>'
      +'<td>'+r.planMileage+'</td><td>'+r.dueDate+'</td>'+'<td>'+(r.orderId?'<a href="javascript:void(0)" onclick="jumpToOrder(\''+r.orderId+'\')" style="color:#1890ff;text-decoration:none;">'+r.orderId+'</a>':'—')+'</td>'+'<td>'+urgencyTag(r.hasOrder?'已提单':r.urgency)+'</td>'
      +'<td class="col-action" onclick="event.stopPropagation()">'+(r.hasOrder?'<span style="color:#aaa;font-size:12px;">已提单</span>':('<button class="btn btn-default" style="height:26px;padding:0 10px;font-size:11px;" onclick="alert(\'已为 '+r.vehicle+' 生成保养工单（演示）\')">生成工单</button>'))+'</td></tr>';
  }).join('');
}
function renderMaint(){ renderMaintHist(); renderMaintPlan(); updateMaintStatCards(); }

var activeMaintCard = null;
function updateMaintStatCards(){
  var today = new Date();
  var monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  document.getElementById('mcnt-week').innerText     = maintPlan.filter(function(p){ return p.urgency==='7天内' && !p.hasOrder; }).length;
  document.getElementById('mcnt-overdue').innerText  = maintPlan.filter(function(p){ return p.urgency==='已逾期' && !p.hasOrder; }).length;
  document.getElementById('mcnt-已提单').innerText = maintPlan.filter(function(p){ return !!p.hasOrder; }).length;
  // 本月已完成：maintHistory 中完成日期在本月的记录
  document.getElementById('mcnt-done').innerText     = maintHistory.filter(function(h){
    var d = new Date(h.completeTime || h.date || '');
    return d >= monthStart && d <= today;
  }).length || maintHistory.length;
}
function filterMaintByCard(el, key){
  var cards = document.querySelectorAll('#maintStatCards .stat-card');
  if(activeMaintCard === key){
    // 取消筛选
    activeMaintCard = null;
    cards.forEach(function(c){c.classList.remove('active');});
    renderMaintHist(); renderMaintPlan(); return;
  }
  activeMaintCard = key;
  cards.forEach(function(c){c.classList.remove('active');});
  el.classList.add('active');
  var planTab = document.querySelector('#page-maint .tab-nav .tab-item:first-child');
  var histTab = document.querySelector('#page-maint .tab-nav .tab-item:last-child');
  if(key === 'done'){
    switchMaintTab(histTab, 'maint-hist');
    renderMaintHist(maintHistory);
  } else {
    switchMaintTab(planTab, 'maint-plan');
    if(key==='week')           renderMaintPlan(maintPlan.filter(function(p){ return p.urgency==='7天内' && !p.hasOrder; }));
    else if(key==='overdue')   renderMaintPlan(maintPlan.filter(function(p){ return p.urgency==='已逾期' && !p.hasOrder; }));
    else if(key==='已提单') renderMaintPlan(maintPlan.filter(function(p){ return !!p.hasOrder; }));
    else                         renderMaintPlan(maintPlan);
  }
}
function switchMaintTab(el,id){
  el.parentNode.querySelectorAll('.tab-item').forEach(function(t){t.classList.remove('active');});
  el.classList.add('active');
  ['maint-hist','maint-plan'].forEach(function(t){document.getElementById(t).classList.toggle('hidden',t!==id);});
}
function applyMaintFilter(){
  var kw=document.getElementById('mhKw').value.toLowerCase();
  var t=document.getElementById('mhType').value;
  var r=document.getElementById('mhResult').value;
  renderMaintHist(maintHistory.filter(function(h){ return (!kw||h.vehicle.includes(kw)||h.site.includes(kw))&&(!t||h.type===t)&&(!r||h.result===r); }));
}
function resetMaintFilter(){ ['mhKw','mhType','mhResult'].forEach(function(i){document.getElementById(i).value='';}); activeMaintCard=null; document.querySelectorAll('#maintStatCards .stat-card').forEach(function(c){c.classList.remove('active');}); renderMaintHist(); }
function applyPlanFilter(){
  var kw=document.getElementById('mpKw').value.toLowerCase();
  var u=document.getElementById('mpUrgency').value;
  renderMaintPlan(maintPlan.filter(function(p){ return (!kw||p.vehicle.includes(kw)||p.site.includes(kw))&&(!u||(u==='已提单'?!!p.hasOrder:p.urgency===u)); }));
}
function resetPlanFilter(){ ['mpKw','mpUrgency'].forEach(function(i){document.getElementById(i).value='';}); activeMaintCard=null; document.querySelectorAll('#maintStatCards .stat-card').forEach(function(c){c.classList.remove('active');}); renderMaintPlan(); }

function showPage(p){
  var allPages = ['page-workorder','page-config','page-maint','page-bill',
    'page-order-detail','page-bill-detail',
    'page-new-order','page-edit-order','page-defect','page-batch-order',
    'page-maint-batch','page-add-sub-order','page-type-edit'];
  allPages.forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== 'page-' + p);
  });
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  var navEl = document.getElementById('nav-' + p);
  if(navEl) navEl.classList.add('active');
  var crumbMap = { workorder:'工单管理', config:'系统配置', maint:'保养管理', bill:'结算单管理' };
  document.getElementById('crumb').innerText = crumbMap[p] || p;
  location.hash = p;
  if(p==='maint') renderMaint();
  if(p==='bill'){ renderBillTable(); updateBillStatCards(); }
}

// 页面加载时恢复上次所在页
(function(){
  var validPages = ['workorder','config','maint','bill'];
  var hash = location.hash.replace('#','');
  var initPage = validPages.indexOf(hash) !== -1 ? hash : 'workorder';
  // 等 DOM 就绪后执行（script 在 body 末尾，DOM 已可用）
  var allPages = ['page-workorder','page-config','page-maint','page-bill',
    'page-order-detail','page-bill-detail',
    'page-new-order','page-edit-order','page-defect','page-batch-order',
    'page-maint-batch','page-add-sub-order','page-type-edit'];
  allPages.forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.classList.toggle('hidden', id !== 'page-' + initPage);
  });
  var navEl = document.getElementById('nav-' + initPage);
  if(navEl){
    document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
    navEl.classList.add('active');
  }
  var crumbMap = { workorder:'工单管理', config:'系统配置', maint:'保养管理', bill:'结算单管理' };
  var crumbEl = document.getElementById('crumb');
  if(crumbEl) crumbEl.innerText = crumbMap[initPage] || initPage;
  if(initPage==='maint') renderMaint();
  if(initPage==='bill'){ renderBillTable(); updateBillStatCards(); }
})();
function switchTab(el, id){
  el.parentNode.querySelectorAll('.tab-item').forEach(function(t){t.classList.remove('active');});
  el.classList.add('active');
  ['tab-type','tab-sla','tab-station','tab-verify','tab-match'].forEach(function(t){document.getElementById(t).classList.toggle('hidden', t!==id);});
  if(id==='tab-verify') initVerifyTab();
}

// ===== 验收清单数据 =====
var _verifyTplData = {
  '故障维修标准模板': [
    {name:'车辆启动验证',  photo:false},
    {name:'故障码清除',  photo:false},
    {name:'最小闭环任务试跑',  photo:true},
    {name:'维修前/中/后图片上传',  photo:true},
    {name:'备件费用确认',  photo:false},
    {name:'P0/P1 根因与复盘结论',  photo:false}
  ],
  '现场救援模板': [
    {name:'故障现场照片上传',  photo:true},
    {name:'救援完成确认',  photo:false},
    {name:'车辆能否自行驶离',  photo:false},
    {name:'联系客户确认',  photo:false},
    {name:'救援报告填写',  photo:false}
  ],
  '保养清单': [
    {name:'机油更换确认',  photo:false},
    {name:'滤芯更换确认',  photo:false},
    {name:'轮胎气压检查',  photo:false},
    {name:'灯光功能检查',  photo:false},
    {name:'刹车系统检查',  photo:false},
    {name:'保养里程/日期记录',  photo:false}
  ],
  '软件复诊模板': [
    {name:'OTA 版本确认',  photo:false},
    {name:'故障码清除',  photo:false},
    {name:'软件功能回归测试',  photo:false},
    {name:'最小闭环任务试跑',  photo:true},
    {name:'复诊报告提交',  photo:false}
  ],
  '外观验收': [
    {name:'划痕/损伤修复确认',  photo:true},
    {name:'修复前/后照片比',  photo:true},
    {name:'整车外观拍照',  photo:true},
    {name:'客户确认签字',  photo:false}
  ],
  '批改流程模板': [
    {name:'批改项清单逐一确认',  photo:false},
    {name:'批改前/后照片',  photo:true},
    {name:'车辆功能验证',  photo:false},
    {name:'备件/耗材费用登记',  photo:false}
  ],
  '转站流程模板': [
    {name:'发运前车辆状态确认',  photo:true},
    {name:'发运照片上传',  photo:true},
    {name:'目标站接收确认',  photo:false},
    {name:'交接记录填写',  photo:false}
  ],
  '通用验收模板': [
    {name:'车辆基本功能验证',  photo:false},
    {name:'完工照片上传',  photo:true},
    {name:'客户确认',  photo:false}
  ],
  '暂无模板': []
};
var _verifyCurrentTpl = null;
var _verifyEditIdx    = -1;

function initVerifyTab(){
  var nav = document.getElementById('verifyTplNav');
  if(nav.children.length > 0) return;
  var tpls = Object.keys(_verifyTplData);
  tpls.forEach(function(name){
    _appendVerifyTplTab(name);
  });
  switchVerifyTpl(tpls[0]);
}

function _appendVerifyTplTab(name){
  var nav = document.getElementById('verifyTplNav');
  var wrap = document.createElement('div');
  wrap.setAttribute('data-tpl', name);
  wrap.style.cssText = 'display:flex;align-items:center;gap:2px;border-bottom:2px solid transparent;';
  var label = document.createElement('span');
  label.textContent = name;
  label.style.cssText = 'padding:8px 10px 8px 14px;cursor:pointer;font-size:13px;color:#888;white-space:nowrap;transition:color 0.15s;';
  label.onclick = function(){ switchVerifyTpl(name); };
  var del = document.createElement('span');
  del.textContent = '×';
  del.title = '删除此模板';
  del.style.cssText = 'padding:2px 8px 2px 0;cursor:pointer;font-size:14px;color:#ccc;line-height:1;transition:color 0.15s;';
  del.onmouseover = function(){ del.style.color='#ff4d4f'; };
  del.onmouseout  = function(){ del.style.color='#ccc'; };
  del.onclick = function(e){ e.stopPropagation(); deleteVerifyTpl(name); };
  wrap.appendChild(label);
  wrap.appendChild(del);
  nav.appendChild(wrap);
}

function switchVerifyTpl(name){
  _verifyCurrentTpl = name;
  var nav = document.getElementById('verifyTplNav');
  Array.from(nav.children).forEach(function(wrap){
    var active = wrap.getAttribute('data-tpl') === name;
    wrap.style.borderBottomColor = active ? '#1890ff' : 'transparent';
    var label = wrap.querySelector('span');
    if(label){
      label.style.color = active ? '#1890ff' : '#888';
      label.style.fontWeight = active ? '600' : '400';
    }
  });
  document.getElementById('verifyTplTitle').textContent = name;
  renderVerifyItems();
}

function openAddTplModal(){
  document.getElementById('newTplName').value = '';
  document.getElementById('addTplModal').style.display = 'flex';
  setTimeout(function(){ document.getElementById('newTplName').focus(); }, 50);
}
function closeAddTplModal(){
  document.getElementById('addTplModal').style.display = 'none';
}
function confirmAddTpl(){
  var name = document.getElementById('newTplName').value.trim();
  if(!name){ showToast('请输入模板名称', 'error'); return; }
  if(_verifyTplData.hasOwnProperty(name)){ showToast('模板名称已存在', 'error'); return; }
  _verifyTplData[name] = [];
  _appendVerifyTplTab(name);
  closeAddTplModal();
  switchVerifyTpl(name);
  showToast('模板已创建', 'success');
}
function deleteVerifyTpl(name){
  var tpls = Object.keys(_verifyTplData);
  if(tpls.length <= 1){ showToast('至少保留一个验收模板', 'error'); return; }
  if(!confirm('确认删除模板「' + name + '」及其全部验收项？')) return;
  delete _verifyTplData[name];
  // 从 nav 中移除
  var nav = document.getElementById('verifyTplNav');
  Array.from(nav.children).forEach(function(el){
    if(el.getAttribute('data-tpl') === name) nav.removeChild(el);
  });
  // 若删除的是当前模板，切到第一个
  if(_verifyCurrentTpl === name){
    _verifyCurrentTpl = null;
    switchVerifyTpl(Object.keys(_verifyTplData)[0]);
  }
  showToast('模板已删除', 'success');
}

function renderVerifyItems(){
  var list = document.getElementById('verifyItemList');
  var items = _verifyTplData[_verifyCurrentTpl] || [];
  if(items.length === 0){
    list.innerHTML = '<div style="color:#bbb;font-size:12px;padding:12px 0;">暂无验收项，点击下方「+ 新增验收项」添加</div>';
    return;
  }
  list.innerHTML = items.map(function(item, idx){
    var photoTag = item.photo
      ? '<span style="font-size:11px;background:#fff7e6;color:#fa8c16;border:1px solid #ffd591;border-radius:3px;padding:1px 6px;">图片 ✓</span>'
      : '<span style="font-size:11px;background:#f5f5f5;color:#bbb;border:1px solid #e8e8e8;border-radius:3px;padding:1px 6px;">图片 ✕</span>';
    return '<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#fafafa;border-radius:6px;border:1px solid #f0f0f0;">'
      +'<span style="color:#bbb;font-size:12px;min-width:20px;">'+(idx+1)+'.</span>'
      +'<span style="flex:1;font-size:13px;color:#333;">'+item.name+'</span>'
      +'<span style="display:flex;gap:4px;align-items:center;">'+photoTag+'</span>'
      +'<button onclick="openVerifyItemModal('+idx+')" style="border:none;background:none;color:#1890ff;font-size:12px;cursor:pointer;padding:2px 6px;">编辑</button>'
      +'<button onclick="removeVerifyItem('+idx+')" style="border:none;background:none;color:#ff4d4f;font-size:12px;cursor:pointer;padding:2px 6px;">删除</button>'
      +'</div>';
  }).join('');
}




function openVerifyMobilePreview(){
  var items = _verifyTplData[_verifyCurrentTpl] || [];
  document.getElementById('mobilePreviewTitle').textContent = _verifyCurrentTpl || '验收表单';
  var body = document.getElementById('mobilePreviewBody');
  if(items.length === 0){
    body.innerHTML = '<div style="color:#bbb;font-size:12px;text-align:center;padding:24px 0;">暂无验收项</div>';
  } else {
    body.innerHTML = items.map(function(item, idx){
      var photoSection = item.photo
        ? '<div style="margin-top:8px;">'
          +'<div style="font-size:11px;color:#888;margin-bottom:4px;">上传图片（可选）</div>'
          +'<div style="display:flex;gap:6px;flex-wrap:wrap;">'
          +'<div style="width:52px;height:52px;border:1.5px dashed #d9d9d9;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:18px;background:#fafafa;">+</div>'
          +'</div>'
          +'</div>'
        : '';
      return '<div style="background:#fff;border-radius:10px;padding:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">'
        +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">'
        +'<div style="width:20px;height:20px;border-radius:50%;background:#1890ff;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+(idx+1)+'</div>'
        +'<span style="font-size:13px;font-weight:600;color:#111;">'+item.name+'</span>'
        +'</div>'
        +'<div style="display:flex;gap:10px;margin-bottom:8px;">'
        +'<label style="display:flex;align-items:center;gap:4px;font-size:12px;color:#333;cursor:pointer;"><input type="radio" name="vi_'+idx+'" style="accent-color:#52c41a;"> 通过</label>'
        +'<label style="display:flex;align-items:center;gap:4px;font-size:12px;color:#333;cursor:pointer;"><input type="radio" name="vi_'+idx+'" style="accent-color:#ff4d4f;"> 不通过</label>'
        +'</div>'
        + photoSection
        +'</div>';
    }).join('');
  }
  document.getElementById('verifyMobileModal').style.display = 'flex';
}
function closeVerifyMobilePreview(){
  document.getElementById('verifyMobileModal').style.display = 'none';
}

function openVerifyItemModal(idx){
  _verifyEditIdx = idx;
  document.getElementById('verifyItemModal').style.display = 'flex';
  document.getElementById('verifyItemModalTitle').textContent = idx === -1 ? '新增验收项' : '编辑验收项';
  if(idx === -1){
    document.getElementById('viName').value = '';
    document.getElementById('viPhoto').checked = true;
  } else {
    var item = (_verifyTplData[_verifyCurrentTpl] || [])[idx] || {};
    document.getElementById('viName').value = item.name || '';
    document.getElementById('viPhoto').checked = item.photo !== false;
  }
}

function closeVerifyItemModal(){
  document.getElementById('verifyItemModal').style.display = 'none';
}

function saveVerifyItem(){
  var name = document.getElementById('viName').value.trim();
  if(!name){ showToast('请输入验收项名称', 'error'); return; }
  var item = {
    name:    name,
    photo:   document.getElementById('viPhoto').checked
  };
  if(!_verifyTplData[_verifyCurrentTpl]) _verifyTplData[_verifyCurrentTpl] = [];
  if(_verifyEditIdx === -1){
    _verifyTplData[_verifyCurrentTpl].push(item);
  } else {
    _verifyTplData[_verifyCurrentTpl][_verifyEditIdx] = item;
  }
  closeVerifyItemModal();
  renderVerifyItems();
  showToast(_verifyEditIdx === -1 ? '验收项已添加' : '已保存', 'success');
}

function removeVerifyItem(idx){
  if(!confirm('确认删除该验收项？')) return;
  _verifyTplData[_verifyCurrentTpl].splice(idx, 1);
  renderVerifyItems();
  showToast('已删除', 'success');
}
var stationData = [
  {name:'北京自营服务站', region:'北京全域', models:['京小鸽 全车型','京小鸽 V1/V2','京小鸽 V1'], load:76, p01:true},
  {name:'上海服务站',     region:'上海/嘉兴', models:['京小鸽 V1/V2','京小鸽 V1'],                load:54, p01:true},
  {name:'武汉外协',       region:'湖北全域', models:['京小鸽 V1'],                                 load:32, p01:false}
];
var regionMap = {'北京全域':['北京全域'],'上海/嘉兴':['上海/嘉兴'],'湖北全域':['湖北全域']};
function runMatchSim(){
  var region  = document.getElementById('simRegion').value;
  var model   = document.getElementById('simModel').value;
  var pri     = document.getElementById('simPri').value;
  var rows = stationData.map(function(s){
    var reasons = [];
    var pass = true;
    // Step1 地理
    var coveredRegions = s.region.split('/').map(function(r){return r.trim();});
    var regionKey = region.replace('全域','').trim();
    var geoOk = coveredRegions.some(function(r){ return r.indexOf(regionKey)>=0 || region.indexOf(r)>=0; });
    if(!geoOk){ pass=false; reasons.push('区域不覆盖'); }
    // Step2 车型
    var modelOk = s.models.some(function(m){ return m==='京小鸽 全车型' || m===model; });
    if(!modelOk){ pass=false; reasons.push('车型不匹配'); }
    // Step3 P0/P1 资质
    if((pri==='P0'||pri==='P1') && !s.p01){ pass=false; reasons.push('P0/P1资质不足'); }
    var statusHtml, recommend='';
    if(pass){
      statusHtml = '<span class="tag tag-done">通过</span>';
      recommend = s.load+'% 负载';
    } else {
      statusHtml = '<span class="tag tag-rejected">剔除</span>';
      recommend = '<span style="color:#ff4d4f;">'+reasons.join(' / ')+'</span>';
    }
    return {name:s.name, pass:pass, load:s.load, statusHtml:statusHtml, recommend:recommend};
  });
  // Step4 负载排序
  var passed = rows.filter(function(r){return r.pass;}).sort(function(a,b){return a.load-b.load;});
  var output;
  if(passed.length===0){
    output = '<div style="color:#ff4d4f;font-weight:600;">无合适服务站，触发人工指派告警</div>';
  } else {
    output = '<div style="color:#52c41a;font-weight:600;margin-bottom:8px;">推荐服务站：<strong>'+passed[0].name+'</strong>（负载 '+passed[0].load+'%，最低）</div>';
  }
  output += '<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;"><thead><tr style="background:#fafafa;"><th style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">服务站</th><th style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">过滤结果</th><th style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">备注</th></tr></thead><tbody>';
  rows.forEach(function(r){
    output += '<tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">'+r.name+'</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">'+r.statusHtml+'</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">'+r.recommend+'</td></tr>';
  });
  output += '</tbody></table>';
  document.getElementById('matchSimOutput').innerHTML = output;
}
function toggleAllPlanCheck(el){
  document.querySelectorAll('.plan-check').forEach(function(cb){ cb.checked = el.checked; });
}
function openMaintBatch(){
  var checked = document.querySelectorAll('.plan-check:checked');
  if(checked.length === 0){ alert('请先勾选要批量处理的车辆'); return; }
  var rows = [];
  checked.forEach(function(cb){
    var idx = parseInt(cb.getAttribute('data-idx'));
    rows.push(currentPlanList[idx]);
  });
  document.getElementById('maintBatchCount').innerText = rows.length;
  document.getElementById('maintBatchPreviewBody').innerHTML = rows.map(function(r){
    return '<tr><td>'+r.vehicle+'</td><td>'+r.site+'</td>'
      +'<td>'+r.dueDate+'</td><td>'+urgencyTag(r.urgency)+'</td></tr>';
  }).join('');
  showFormPage('page-maint-batch');
}
function submitMaintBatch(){
  var count = parseInt(document.getElementById('maintBatchCount').innerText);
  var pri = document.getElementById('maintBatchPri').value;
  alert('已批量创建 ' + count + ' 条 ' + pri + ' 保养工单（演示）');
  closeFormPage('maint');
  // 取消勾选
  var allCheck = document.getElementById('planCheckAll');
  if(allCheck) allCheck.checked = false;
  document.querySelectorAll('.plan-check').forEach(function(cb){ cb.checked = false; });
}
function addType(){
  var tb=document.getElementById('typeBody');
  var tr=document.createElement('tr');
  tr.innerHTML='<td><input class="form-control" placeholder="编码" style="height:26px;"></td><td><input class="form-control" placeholder="名称" style="height:26px;"></td><td><select class="form-control" style="height:26px;"><option>P0</option><option selected>P1</option><option>P2</option></select></td><td>是</td><td>默认模板</td><td><span class="tag tag-pending">草稿</span></td><td><a onclick="this.closest(\'tr\').remove()">删除</a></td>';
  tb.appendChild(tr);
}

// ===== 动态初始化工单类型 select =====
function initTypeSelects() {
  var types = Object.keys(flowTemplates);
  ['fType','editType','newType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    // 保留第一个 placeholder option
    while (el.options.length > 1) el.remove(1);
    types.forEach(function(t) {
      var opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      el.appendChild(opt);
    });
  });
}

// ===== 动态渲染 tab-type 表格 =====
function initTypeTable() {
  var typeCodeMap = {
    '故障维修':'REPAIR','现场救援':'RESCUE','周期保养':'MAINT',
    '软件复诊':'SOFTWARE','外观损伤':'DAMAGE','车辆批改':'MODIFY','转站需求':'TRANSFER'
  };
  var typePriMap = {
    '故障维修':'P1','现场救援':'P0','周期保养':'P2',
    '软件复诊':'P1','外观损伤':'P2','车辆批改':'P2','转站需求':'P1'
  };
  var typeSubMap = {
    '故障维修':'是','现场救援':'按需','周期保养':'是',
    '软件复诊':'按需','外观损伤':'是','车辆批改':'否','转站需求':'否'
  };
  var typeTplMap = {
    '故障维修':'故障维修标准模板','现场救援':'现场救援模板','周期保养':'保养清单',
    '软件复诊':'软件复诊模板','外观损伤':'外观验收','车辆批改':'批改流程模板','转站需求':'转站流程模板'
  };
  var tbody = document.getElementById('typeBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.keys(flowTemplates).forEach(function(t) {
    var code = typeCodeMap[t] || t.toUpperCase();
    var pri  = typePriMap[t] || 'P2';
    var priCls = pri==='P0'?'tag-p0':pri==='P1'?'tag-p1':'tag-p2';
    var sub  = typeSubMap[t] || '是';
    var autoAccept = _typeAutoAcceptMap[t] || '否';
    var autoTag = autoAccept === '是' ? '<span class="tag tag-done">自动</span>' : '<span class="tag tag-rejected">手动</span>';
    var tpl  = typeTplMap[t] || '—';
    var steps = flowTemplates[t].sub.join(' → ');
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+code+'</td><td>'+t+'</td>'
      +'<td><span class="tag '+priCls+'">'+pri+'</span></td>'
      +'<td>'+sub+'</td><td>'+autoTag+'</td><td>'+tpl+'</td>'
      +'<td style="max-width:300px;white-space:normal;color:#666;font-size:11px;">'+steps+'</td>'
      +'<td><span class="tag tag-done" id="typeStatus-'+code+'">启用</span></td>'
      +'<td><a style="color:#1890ff;cursor:pointer;" onclick="openTypeEditModal(\''+t+'\')">编辑</a></td>';
    tbody.appendChild(tr);
  });
}

