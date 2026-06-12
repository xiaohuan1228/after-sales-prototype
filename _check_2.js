
// ===== 编辑工单类型弹窗逻辑 =====
var _typeEditKey = ''; // 当前编辑的类型名（原始key，用于更新）
var _teMasterSteps = [];
var _teSubSteps = [];
var _typeCodeMap = {
  '故障维修':'REPAIR','现场救援':'RESCUE','周期保养':'MAINT',
  '软件复诊':'SOFTWARE','外观损伤':'DAMAGE','车辆批改':'MODIFY','转站需求':'TRANSFER'
};
var _typePriMap = {
  '故障维修':'P1','现场救援':'P0','周期保养':'P2',
  '软件复诊':'P1','外观损伤':'P2','车辆批改':'P2','转站需求':'P1'
};
var _typeSubMap = {
  '故障维修':'是','现场救援':'按需','周期保养':'是',
  '软件复诊':'按需','外观损伤':'是','车辆批改':'否','转站需求':'否'
};
var _typeTplMap = {
  '故障维修':'故障维修标准模板','现场救援':'现场救援模板','周期保养':'保养清单',
  '软件复诊':'软件复诊模板','外观损伤':'外观验收','车辆批改':'批改流程模板','转站需求':'转站流程模板'
};
var _typeEnabledMap = {};

function openTypeEditModal(typeName) {
  _typeEditKey = typeName;
  var flow = flowTemplates[typeName] || { master: [], sub: [] };
  document.getElementById('teTypeName').value = typeName;
  document.getElementById('teTypeCode').value = _typeCodeMap[typeName] || typeName.toUpperCase();
  document.getElementById('teTypePri').value = _typePriMap[typeName] || 'P2';
  document.getElementById('teTypeSub').value = _typeSubMap[typeName] || '是';
  document.getElementById('teTypeTpl').value = _typeTplMap[typeName] || '';
  document.getElementById('teTypeEnabled').checked = _typeEnabledMap[typeName] !== false;
  document.getElementById('teTypeAutoAccept').value = _typeAutoAcceptMap[typeName] || '否';
  var cond = _typeAutoCondMap[typeName] || {};
  document.getElementById('teAutoPri0').checked = !!cond.pri0;
  document.getElementById('teAutoInfoComplete').checked = !!cond.infoComplete;
  document.getElementById('teAutoHasPhoto').checked = !!cond.hasPhoto;
  toggleAutoAcceptDetail();
  _teMasterSteps = flow.master.slice();
  _teSubSteps = flow.sub.slice();
  renderTeStatusTags('master');
  renderTeStatusTags('sub');
  document.getElementById('typeEditPageTitle').textContent = '编辑工单类型 · ' + typeName;
  showFormPage('page-type-edit');
}

function renderTeStatusTags(kind) {
  var listId = kind === 'master' ? 'teMasterList' : 'teSubList';
  var arr = kind === 'master' ? _teMasterSteps : _teSubSteps;
  var container = document.getElementById(listId);
  container.innerHTML = arr.map(function(s, i) {
    return '<span style="display:inline-flex;align-items:center;gap:4px;background:#f0f7ff;border:1px solid #91d5ff;color:#1890ff;border-radius:4px;padding:3px 8px;font-size:12px;">'
      + s
      + '<span onclick="removeTeStatus(\'' + kind + '\',' + i + ')" style="cursor:pointer;color:#bbb;margin-left:2px;line-height:1;font-size:14px;" title="删除">×</span>'
      + '</span>';
  }).join('');
}

function addTeStatus(kind) {
  var inputId = kind === 'master' ? 'teMasterInput' : 'teSubInput';
  var val = document.getElementById(inputId).value.trim();
  if (!val) return;
  if (kind === 'master') { _teMasterSteps.push(val); }
  else { _teSubSteps.push(val); }
  document.getElementById(inputId).value = '';
  renderTeStatusTags(kind);
}

function removeTeStatus(kind, idx) {
  if (kind === 'master') { _teMasterSteps.splice(idx, 1); }
  else { _teSubSteps.splice(idx, 1); }
  renderTeStatusTags(kind);
}

// Enter 键快速添加
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  if (document.activeElement && document.activeElement.id === 'teMasterInput') addTeStatus('master');
  if (document.activeElement && document.activeElement.id === 'teSubInput') addTeStatus('sub');
});

function toggleAutoAcceptDetail() {
  var v = document.getElementById('teTypeAutoAccept').value;
  var d = document.getElementById('autoAcceptDetail');
  d.style.display = v === '是' ? '' : 'none';
}

function saveTypeEdit() {
  var newName = document.getElementById('teTypeName').value.trim();
  var newCode = document.getElementById('teTypeCode').value.trim();
  var newPri  = document.getElementById('teTypePri').value;
  var newSub  = document.getElementById('teTypeSub').value;
  var newTpl  = document.getElementById('teTypeTpl').value.trim();
  var enabled = document.getElementById('teTypeEnabled').checked;
  var newAuto = document.getElementById('teTypeAutoAccept').value;
  var newCond = {
    pri0: document.getElementById('teAutoPri0').checked,
    infoComplete: document.getElementById('teAutoInfoComplete').checked,
    hasPhoto: document.getElementById('teAutoHasPhoto').checked
  };

  if (!newName) { showToast('请填写类型名称', 'error'); return; }
  if (!newCode) { showToast('请填写编码', 'error'); return; }
  if (_teMasterSteps.length === 0) { showToast('请至少添加一个主状态', 'error'); return; }
  if (_teSubSteps.length === 0) { showToast('请至少添加一个子状态', 'error'); return; }

  // 如果改了类型名，迁移 key
  if (_typeEditKey !== newName) {
    flowTemplates[newName] = flowTemplates[_typeEditKey];
    delete flowTemplates[_typeEditKey];
    // 同步辅助 map
    _typeCodeMap[newName] = newCode; delete _typeCodeMap[_typeEditKey];
    _typePriMap[newName] = newPri;  delete _typePriMap[_typeEditKey];
    _typeSubMap[newName] = newSub;  delete _typeSubMap[_typeEditKey];
    _typeTplMap[newName] = newTpl;  delete _typeTplMap[_typeEditKey];
    _typeEnabledMap[newName] = enabled; delete _typeEnabledMap[_typeEditKey];
    _typeAutoAcceptMap[newName] = newAuto; delete _typeAutoAcceptMap[_typeEditKey];
    _typeAutoCondMap[newName] = newCond; delete _typeAutoCondMap[_typeEditKey];
  } else {
    _typeCodeMap[newName] = newCode;
    _typePriMap[newName] = newPri;
    _typeSubMap[newName] = newSub;
    _typeTplMap[newName] = newTpl;
    _typeEnabledMap[newName] = enabled;
    _typeAutoAcceptMap[newName] = newAuto;
    _typeAutoCondMap[newName] = newCond;
  }

  // 更新 flowTemplates
  flowTemplates[newName] = { master: _teMasterSteps.slice(), sub: _teSubSteps.slice() };

  closeFormPage('config');
  initTypeTable();
  initTypeSelects();
  showToast('工单类型已保存', 'success');
}
function renderSlaRuleTable() {
  var tbody = document.getElementById('slaRuleBody');
  if (!tbody) return;
  tbody.innerHTML = _slaRules.map(function(rule, ri) {
    var slotsHtml = rule.slots.map(function(s) {
      return '<div style="font-size:11px;color:#666;line-height:1.8;">' + s.label + '</div>';
    }).join('');
    var deadlineHtml = rule.slots.map(function(s) {
      return '<div style="font-size:11px;color:#1890ff;line-height:1.8;font-weight:500;">' + s.deadlineDesc + '</div>';
    }).join('');
    var enabledTag = rule.enabled
      ? '<span class="tag tag-done" style="cursor:pointer;" onclick="toggleSlaRule(' + ri + ')">启用</span>'
      : '<span class="tag tag-rejected" style="cursor:pointer;" onclick="toggleSlaRule(' + ri + ')">停用</span>';
    return '<tr>' +
      '<td><strong>' + rule.type + '</strong></td>' +
      '<td>' + slotsHtml + '</td>' +
      '<td>' + deadlineHtml + '</td>' +
      '<td style="font-size:11px;color:#888;">' + rule.escalation + '</td>' +
      '<td>' + enabledTag + '</td>' +
      '<td><button class="btn btn-default" style="height:24px;padding:0 8px;font-size:11px;" onclick="editSlaRule(' + ri + ')">编辑</button></td>' +
    '</tr>';
  }).join('');
}

function toggleSlaRule(idx) {
  _slaRules[idx].enabled = !_slaRules[idx].enabled;
  renderSlaRuleTable();
  showToast(_slaRules[idx].type + ' SLA 规则已' + (_slaRules[idx].enabled ? '启用' : '停用'), 'success');
}

function editSlaRule(idx) {
  var rule = _slaRules[idx];
  // 简单弹窗编辑截止时间描述（故障维修有两个时段）
  var slot0 = rule.slots[0];
  var slot1 = rule.slots[1] || null;
  var msg = '工单类型：' + rule.type + '\n';
  if (slot1) {
    msg += '\n时段1（上午上报）截止：' + slot0.deadlineDesc;
    msg += '\n时段2（下午上报）截止：' + slot1.deadlineDesc;
    var v1 = prompt(msg + '\n\n修改时段1截止时刻（小时，如 24 = 当日24点）', slot0.deadlineHour);
    if (v1 === null) return;
    var v2 = prompt('修改时段2截止时刻（小时，如 12 = 次日12点；填写时加次日偏移，格式：小时+次日偏移天 用逗号分隔）', slot1.deadlineHour + ',' + slot1.deadlineDay);
    if (v2 === null) return;
    var parts = v2.split(',');
    slot0.deadlineHour = parseInt(v1) || slot0.deadlineHour;
    slot0.deadlineDesc = slot0.deadlineHour >= 24 ? '当日 ' + slot0.deadlineHour + ':00' : '当日 ' + slot0.deadlineHour + ':00';
    slot1.deadlineHour = parseInt(parts[0]) || slot1.deadlineHour;
    slot1.deadlineDay = parseInt(parts[1] || '1');
    slot1.deadlineDesc = '次日 ' + (slot1.deadlineHour < 10 ? '0' : '') + slot1.deadlineHour + ':00';
  } else {
    var vo = prompt(msg + '\n修改处理时限（小时后完成）', slot0.offsetHours);
    if (vo === null) return;
    slot0.offsetHours = parseInt(vo) || slot0.offsetHours;
    slot0.deadlineDesc = '上报后 ' + slot0.offsetHours + ' 小时内';
  }
  renderSlaRuleTable();
  showToast(rule.type + ' SLA 规则已更新', 'success');
}

function saveSlaConfig() {
  showToast('SLA 配置已保存', 'success');
}

// 初始化时渲染 SLA 表
renderSlaRuleTable();
