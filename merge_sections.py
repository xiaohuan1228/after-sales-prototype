with open('phase1_admin_prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 定位开始：工单信息 section-title
start_marker = "'<div class=\"section-title\">工单信息</div>' +"
# 定位结束：提报信息 grid 的最后一个 </div> + 后面紧跟运营影响
end_marker = "'<div class=\"section-title\">运营影响</div>' +"

s = content.find(start_marker)
e = content.find(end_marker)

print(f"start={s}, end={e}")
if s == -1 or e == -1:
    exit(1)

# 替换掉 [s, e) 之间的内容（不含运营影响标题）
new_section = (
    "'<div class=\"section-title\">工单信息</div>' +\n"
    "    '<div class=\"info-grid\">' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">工单类型</span><span class=\"info-value\">'+o.type+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">优先级</span><span class=\"info-value\">'+priTag(o.pri)+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">主状态</span><span class=\"info-value\">'+statusTag(o.status)+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">子状态</span><span class=\"info-value\"><span class=\"tag tag-status\">'+o.sub+'</span></span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">服务站</span><span class=\"info-value\">'+o.station+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">站点负责人</span><span class=\"info-value\">'+(o.stationManager||'-')+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">SLA</span><span class=\"info-value '+(o.slaWarn?'sla-warn':'')+'\">'+ o.sla+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">提报人</span><span class=\"info-value\">'+(o.reporter||'-')+rp+'<span style=\"color:#bbb;font-size:11px;margin-left:4px;\">('+o.reporterRole+')</span></span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">提报时间</span><span class=\"info-value\">'+(o.reportTime||'-')+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">工单来源</span><span class=\"info-value\">'+(o.reportSrc||'-')+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">最后操作人</span><span class=\"info-value\">'+(o.lastOp||'-')+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">最后操作时间</span><span class=\"info-value\">'+(o.lastOpTime||'-')+'</span></div>' +\n"
    "      '<div class=\"info-item\"><span class=\"info-label\">下一动作</span><span class=\"info-value\" style=\"color:#1890ff;\">'+o.next+'</span></div>' +\n"
    "      '<div class=\"info-item\" style=\"grid-column:span 2;\"><span class=\"info-label\">故障描述</span><span class=\"info-value\" style=\"line-height:1.7;\">'+o.desc+'</span></div>' +\n"
    "    '</div>' +\n"
    "    "
)

content = content[:s] + new_section + content[e:]

with open('phase1_admin_prototype.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("合并完成，已写入文件")