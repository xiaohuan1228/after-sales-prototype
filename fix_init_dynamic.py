#!/usr/bin/env python3
path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# =============================================
# 1. 在 initCascader(); 后面（L1401附近）插入 initTypeSelects(); initTypeTable();
# =============================================
old_init = 'renderTable(orders);\ninitCascader();\nupdateStatCards();'
new_init = 'renderTable(orders);\ninitCascader();\nupdateStatCards();\ninitTypeSelects();\ninitTypeTable();'
if old_init in content:
    content = content.replace(old_init, new_init, 1)
    changes += 1
    print('OK: init calls inserted')
else:
    print('MISS: init calls')

# =============================================
# 2. 在 </script> 标签前插入函数定义
# =============================================
type_code_map = {
    '故障维修': 'REPAIR',
    '现场救援': 'RESCUE',
    '周期保养': 'MAINT',
    '软件复诊': 'SOFTWARE',
    '外观损伤': 'DAMAGE',
    '车辆批改': 'MODIFY'
}
pri_map = {
    '故障维修': 'P1',
    '现场救援': 'P0',
    '周期保养': 'P2',
    '软件复诊': 'P1',
    '外观损伤': 'P2',
    '车辆批改': 'P2'
}

new_funcs = '''
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
var typeCodeMap = {
  '故障维修':'REPAIR','现场救援':'RESCUE','周期保养':'MAINT',
  '软件复诊':'SOFTWARE','外观损伤':'DAMAGE','车辆批改':'MODIFY'
};
var typePriMap = {
  '故障维修':'P1','现场救援':'P0','周期保养':'P2',
  '软件复诊':'P1','外观损伤':'P2','车辆批改':'P2'
};
var typeSubMap = {
  '故障维修':'是','现场救援':'按需','周期保养':'是',
  '软件复诊':'按需','外观损伤':'是','车辆批改':'否'
};
var typeTplMap = {
  '故障维修':'故障维修标准模板','现场救援':'现场救援模板','周期保养':'保养清单',
  '软件复诊':'软件复诊模板','外观损伤':'外观验收','车辆批改':'批改流程模板'
};
function initTypeTable() {
  var tbody = document.getElementById('typeBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.keys(flowTemplates).forEach(function(t) {
    var code = typeCodeMap[t] || t.toUpperCase();
    var pri  = typePriMap[t] || 'P2';
    var priCls = pri==='P0'?'tag-p0':pri==='P1'?'tag-p1':'tag-p2';
    var sub  = typeSubMap[t] || '是';
    var tpl  = typeTplMap[t] || '—';
    var steps = flowTemplates[t].sub.join(' → ');
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+code+'</td><td>'+t+'</td>'
      +'<td><span class="tag '+priCls+'">'+pri+'</span></td>'
      +'<td>'+sub+'</td><td>'+tpl+'</td>'
      +'<td style="max-width:300px;white-space:normal;color:#666;font-size:11px;">'+steps+'</td>'
      +'<td><span class="tag tag-done">启用</span></td>'
      +'<td><a style="color:#1890ff;cursor:pointer;">编辑</a></td>';
    tbody.appendChild(tr);
  });
}
'''

if '</script>' in content:
    content = content.replace('</script>', new_funcs + '\n</script>', 1)
    changes += 1
    print('OK: type functions inserted')
else:
    print('MISS: </script> tag')

if changes > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'DONE: {changes} changes written')
else:
    print('NO changes written')