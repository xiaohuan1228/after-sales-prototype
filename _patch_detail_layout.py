with open('phase1_admin_prototype.html', 'r') as f:
    lines = f.readlines()

new_block = r"""  document.getElementById('detailPageBody').innerHTML =
    '<div class="detail-card">' +
      '<div class="section-title" style="margin-top:0;">车辆信息</div>' +
      '<div class="info-grid">' +
        '<div class="info-item"><span class="info-label">车辆编号</span><span class="info-value" style="font-weight:600;">'+o.vehicle+'</span></div>' +
        '<div class="info-item"><span class="info-label">车型</span><span class="info-value">'+(o.vehicleModel||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">车牌号</span><span class="info-value">'+(o.vehicleNo||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">OEM</span><span class="info-value">'+(o.oem||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">VIN</span><span class="info-value">'+(o.vin||'-')+'</span></div>' +
        '<div class="info-item"><span class="info-label">所属站点</span><span class="info-value">'+o.site+'</span></div>' +
        '<div class="info-item span3"><span class="info-label">实时位置</span><span class="info-value">'+(o.realtimeLoc||'-')+'<span style="color:#999;font-size:11px;margin-left:8px;">'+(o.locTime?'更新于 '+o.locTime:'')+'</span><span style="margin-left:8px;padding:1px 6px;border-radius:3px;font-size:11px;background:'+(o.locStatus==='行驶中'?'#e6f7ff':o.locStatus==='维修中'?'#fff7e6':'#f5f5f5')+';color:'+(o.locStatus==='行驶中'?'#1890ff':o.locStatus==='维修中'?'#fa8c16':'#999')+'">'+(o.locStatus||'')+'</span>'+(o.locSpeed && o.locSpeed!=='0 km/h'?'<span style="color:#999;font-size:11px;margin-left:6px;">'+o.locSpeed+'</span>':'')+'</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="detail-card">' +
      '<div class="section-title" style="margin-top:0;">工单信息</div>' +
      '<div class="info-grid">' +
        '<div class="info-item"><span class="info-label">工单类型</span><span class="info-value">'+o.type+'</span></div>' +
        '<div class="info-item"><span class="info-label">优先级</span><span class="info-value">'+priTag(o.pri)+'</span></div>' +
        '<div class="info-item"><span class="info-label">主状态</span><span class="info-value">'+statusTag(o.status)+'</span></div>' +
        '<div class="info-item"><span class="info-label">子状态</span><span class="info-value"><span class="tag tag-status">'+o.sub+'</span></span></div>' +
        '<div class="info-item"><span class="info-label">SLA</span><span class="info-value '+(o.slaWarn?'sla-warn':'')+'">'+ o.sla+'</span></div>' +
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
      '<div class="section-title">维修子单进度</div>' +
      '<div class="timeline">'+subTL+'</div>' +
    '</div>' +
    '<div class="detail-card">' + syncBlock(o) + costBlock(o) + partsBlock(o) + '</div>' +
    (acceptBlock(o) ? '<div class="detail-card">' + acceptBlock(o) + '</div>' : '') +
    '<div class="detail-card">' + commentHtml + '</div>';
"""

# 替换 1771~1838 行（0-indexed 1770~1837）
lines[1770:1838] = [new_block]
with open('phase1_admin_prototype.html', 'w') as f:
    f.writelines(lines)
print("done, total lines:", len(lines))