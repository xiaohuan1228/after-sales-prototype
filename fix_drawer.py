import re

path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 openDrawer 函数开始位置
start_marker = 'function openDrawer(id){'
# 找到 closeDrawer 函数作为结束标记
end_marker = 'function closeDrawer()'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print('ERROR: markers not found', start_idx, end_idx)
    exit(1)

print(f'Replacing lines {start_idx}-{end_idx}')

new_func = r"""var commentStore = {};
function getComments(id){
  if(!commentStore[id]){
    commentStore[id] = [
      { role:'ops', name:'王运营', time:'2026-06-08 08:55', text:'工单已受理，正在联系服务站接单，请关注进度。' },
      { role:'station', name:'张师傅', time:'2026-06-08 09:10', text:'已到场，正在用诊断仪扫码，初步判断是 GPS 模块问题，稍后上传诊断图片。', imgs:['🔧','📋'] },
      { role:'rd', name:'李研发', time:'2026-06-08 10:30', text:'已查看诊断日志，GPS 天线信号强度 -105dBm，低于阈值 -95dBm，建议更换天线，零件号 JXG-ANT-003。', imgs:['📊'] },
      { role:'ops', name:'王运营', time:'2026-06-08 10:45', text:'收到，已通知服务站备货，预计今日下午完成维修。' }
    ];
  }
  return commentStore[id];
}
function renderComments(id){
  var list = getComments(id);
  var roleMap = { ops:'运营', station:'服务站', rd:'研发', system:'系统' };
  var avCls = { ops:'avatar-ops', station:'avatar-station', rd:'avatar-rd', system:'avatar-system' };
  return list.map(function(c){
    var isSelf = (c.role === 'ops');
    var imgs = c.imgs ? c.imgs.map(function(img){ return '<div class="comment-img-thumb">'+img+'</div>'; }).join('') : '';
    var imgBlock = imgs ? '<div class="comment-imgs">'+imgs+'</div>' : '';
    return '<div class="comment-item'+(isSelf?' self':'')+'">' +
      '<div class="comment-avatar '+avCls[c.role]+'">'+c.name.charAt(0)+'</div>' +
      '<div class="comment-bubble-wrap">' +
        '<div class="comment-meta"><span class="comment-role">'+c.name+'</span>' +
        '<span style="background:#f0f0f0;padding:0 5px;border-radius:2px;font-size:10px;">'+roleMap[c.role]+'</span>' +
        '<span>'+c.time+'</span></div>' +
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
  if(!txt && !hasPending){ alert('请输入留言内容'); return; }
  var d = new Date();
  var pad = function(n){return n<10?'0'+n:n;};
  var now = d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes());
  var imgs = [];
  if(hasPending){ for(var i=0;i<previewArea.children.length;i++){ imgs.push('🖼️'); } }
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
    thumb.innerHTML = '🖼️<div class="preview-img-rm" onclick="this.parentNode.remove()">×</div>';
    previewArea.appendChild(thumb);
  }
  inp.value = '';
}

function openDrawer(id){
  var o = orders.find(function(x){return x.id===id;});
  if(!o) return;
  document.getElementById('drawerTitle').innerText = o.id + ' · ' + o.type;
  var masterIdx = masterStatusList.indexOf(o.status);
  var masterFlow = masterStatusList.map(function(s,i){
    var cls = i<masterIdx?'done':(i===masterIdx?'current':'');
    return '<div class="status-step"><div class="step-circle '+cls+'">'+(i+1)+'</div><div class="step-label">'+s+'</div></div>'+(i<masterStatusList.length-1?'<div class="step-line '+(i<masterIdx?'done':'')+'"></div>':'');
  }).join('');
  var subIdx = subStatusList.indexOf(o.sub);
  var subTL = subStatusList.map(function(s,i){
    var cls = i<subIdx?'done':(i===subIdx?'current':'');
    return '<div class="timeline-item '+cls+'"><div class="timeline-time">'+(i<subIdx?'已完成':i===subIdx?'进行中':'待执行')+'</div><div class="timeline-content">'+s+'</div></div>';
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
      '<div class="comment-input-area">' +
        '<div class="comment-toolbar">' +
          '<button class="comment-toolbar-btn" title="上传图片" onclick="triggerImgUpload()">🖼️</button>' +
          '<span style="font-size:11px;color:#bbb;">| 运营端留言</span>' +
        '</div>' +
        '<div id="commentImgPreview" class="preview-imgs" style="padding:4px 10px 0;"></div>' +
        '<textarea class="comment-textarea" id="commentInput" placeholder="输入留言内容，可上传图片…" rows="3"></textarea>' +
        '<div class="comment-send-bar">' +
          '<span class="comment-hint">运营 / 服务站 / 研发 各端均可留言</span>' +
          '<button class="btn btn-primary" style="height:26px;padding:0 12px;font-size:12px;" onclick="sendComment(\''+id+'\')">发送</button>' +
        '</div>' +
      '</div>' +
      '<input type="file" id="commentFileInput" accept="image/*" multiple style="display:none;" onchange="handleImgSelect(\''+id+'\')">' +
    '</div>';
  document.getElementById('drawerBody').innerHTML =
    '<div class="section-title">车辆信息</div>' +
    '<div class="info-grid">' +
      '<div class="info-item"><span class="info-label">车辆编号</span><span class="info-value" style="font-weight:600;color:#1890ff;">'+o.vehicle+'</span></div>' +
      '<div class="info-item"><span class="info-label">所属站点</span><span class="info-value">'+o.site+'</span></div>' +
      '<div class="info-item"><span class="info-label">车型</span><span class="info-value">'+(o.vehicleModel||'-')+'</span></div>' +
      '<div class="info-item"><span class="info-label">车号</span><span class="info-value">'+(o.vehicleNo||'-')+'</span></div>' +
      '<div class="info-item" style="grid-column:span 2;"><span class="info-label">车架号 (VIN)</span><span class="info-value" style="font-family:monospace;letter-spacing:0.5px;">'+(o.vin||'-')+'</span></div>' +
      '<div class="info-item"><span class="info-label">整车厂</span><span class="info-value">'+(o.oem||'-')+'</span></div>' +
    '</div>' +
    '<div class="section-title">工单信息</div>' +
    '<div class="info-grid">' +
      '<div class="info-item"><span class="info-label">工单类型</span><span class="info-value">'+o.type+'</span></div>' +
      '<div class="info-item"><span class="info-label">优先级</span><span class="info-value">'+priTag(o.pri)+'</span></div>' +
      '<div class="info-item"><span class="info-label">主状态</span><span class="info-value">'+statusTag(o.status)+'</span></div>' +
      '<div class="info-item"><span class="info-label">子状态</span><span class="info-value"><span class="tag tag-status">'+o.sub+'</span></span></div>' +
      '<div class="info-item"><span class="info-label">服务站</span><span class="info-value">'+o.station+'</span></div>' +
      '<div class="info-item"><span class="info-label">站点负责人</span><span class="info-value">'+(o.stationManager||'-')+'</span></div>' +
      '<div class="info-item"><span class="info-label">SLA</span><span class="info-value '+(o.slaWarn?'sla-warn':'')+'">'+o.sla+'</span></div>' +
      '<div class="info-item"><span class="info-label">下一动作</span><span class="info-value" style="color:#1890ff;">'+o.next+'</span></div>' +
      '<div class="info-item" style="grid-column:span 2;"><span class="info-label">故障描述</span><span class="info-value" style="line-height:1.7;">'+o.desc+'</span></div>' +
    '</div>' +
    '<div class="section-title">提报信息</div>' +
    '<div class="info-grid">' +
      '<div class="info-item"><span class="info-label">提报人</span><span class="info-value">'+(o.reporter||'-')+rp+'<span style="color:#bbb;font-size:11px;margin-left:4px;">('+o.reporterRole+')</span></span></div>' +
      '<div class="info-item"><span class="info-label">提报时间</span><span class="info-value">'+(o.reportTime||'-')+'</span></div>' +
      '<div class="info-item"><span class="info-label">工单来源</span><span class="info-value">'+(o.reportSrc||'-')+'</span></div>' +
      '<div class="info-item"><span class="info-label">最后操作人</span><span class="info-value">'+(o.lastOp||'-')+'</span></div>' +
      '<div class="info-item" style="grid-column:span 2;"><span class="info-label">最后操作时间</span><span class="info-value">'+(o.lastOpTime||'-')+'</span></div>' +
    '</div>' +
    '<div class="section-title">运营影响</div>' +
    '<div class="info-grid">' +
      '<div class="info-item"><span class="info-label">影响运营时长</span><span class="info-value">'+(o.affectHours!=null?'<strong>'+o.affectHours+'h</strong>':'-')+'</span></div>' +
      '<div class="info-item"><span class="info-label">影响运营天数</span><span class="info-value">'+(o.affectDays!=null?'<strong>'+o.affectDays+'天</strong>':'-')+'</span></div>' +
    '</div>' +
    relatedHtml +
    '<div class="section-title">主工单状态流转</div>' +
    '<div class="status-flow">'+masterFlow+'</div>' +
    '<div class="section-title">维修子单执行进度</div>' +
    '<div class="timeline">'+subTL+'</div>' +
    '<div class="section-title">同步数据（诊断 / 维修结果）</div>' +
    syncBlock(o) +
    commentHtml;
  var cl = document.getElementById('commentList');
  if(cl) setTimeout(function(){ cl.scrollTop = cl.scrollHeight; }, 50);
  var actions = '';
  if(o.status==='待受理') actions = '<button class="btn btn-danger" onclick="opAct(\''+o.id+'\',\'驳回\')">受理驳回</button><button class="btn btn-primary" onclick="opAct(\''+o.id+'\',\'受理\')">受理并创建子单</button>';
  else if(o.status==='待验收') actions = '<button class="btn btn-danger" onclick="opAct(\''+o.id+'\',\'验收驳回\')">验收驳回</button><button class="btn btn-success" onclick="opAct(\''+o.id+'\',\'验收通过\')">验收通过</button>';
  else if(o.sub==='服务站诊断中') actions = '<button class="btn btn-default" onclick="opAct(\''+o.id+'\',\'升级复诊\')">升级售后/研发复诊</button>';
  else actions = '<button class="btn btn-default" onclick="closeDrawer()">关闭</button>';
  document.getElementById('drawerActions').innerHTML = actions;
  document.getElementById('drawer').classList.add('show');
  document.getElementById('drawerMask').classList.add('show');
}
"""

new_content = content[:start_idx] + new_func + content[end_idx:]
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done, new length:', len(new_content))