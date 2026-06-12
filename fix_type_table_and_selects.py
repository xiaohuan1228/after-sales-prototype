#!/usr/bin/env python3
path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# =============================================
# 1. tab-type 表头新增「流程步骤」列 + tbody 改为动态渲染
# =============================================
old1 = (
    '                  <thead><tr><th>编码</th><th>类型名称</th><th>默认优先级</th>'
    '<th>是否创建子单</th><th>验收模板</th><th>状态</th><th>操作</th></tr></thead>\n'
    '                  <tbody id="typeBody">\n'
    '                    <tr><td>REPAIR</td><td>故障维修</td><td><span class="tag tag-p1">P1</span></td><td>是</td><td>故障维修标准模板</td><td><span class="tag tag-done">启用</span></td><td><a>编辑</a></td></tr>\n'
    '                    <tr><td>MAINT</td><td>周期保养</td><td><span class="tag tag-p2">P2</span></td><td>是</td><td>保养清单</td><td><span class="tag tag-done">启用</span></td><td><a>编辑</a></td></tr>\n'
    '                    <tr><td>INSPECT</td><td>站点点检</td><td><span class="tag tag-p2">P2</span></td><td>否</td><td>点检模板</td><td><span class="tag tag-done">启用</span></td><td><a>编辑</a></td></tr>\n'
    '                    <tr><td>DAMAGE</td><td>外观损伤</td><td><span class="tag tag-p2">P2</span></td><td>是</td><td>外观验收</td><td><span class="tag tag-done">启用</span></td><td><a>编辑</a></td></tr>\n'
    '                    <tr><td>SOFTWARE</td><td>软件复诊</td><td><span class="tag tag-p1">P1</span></td><td>按需</td><td>软件复诊模板</td><td><span class="tag tag-done">启用</span></td><td><a>编辑</a></td></tr>\n'
    '                  </tbody>'
)
new1 = (
    '                  <thead><tr><th>编码</th><th>类型名称</th><th>默认优先级</th>'
    '<th>是否创建子单</th><th>验收模板</th><th>流程步骤</th><th>状态</th><th>操作</th></tr></thead>\n'
    '                  <tbody id="typeBody"></tbody>'
)
if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print('OK: tab-type table replaced')
else:
    print('MISS: tab-type table')

# =============================================
# 2. fType select 动态化（工单列表筛选栏）
# =============================================
old2 = '<select id="fType"><option value="">工单类型</option><option>故障维修</option><option>现场救援</option><option>周期保养</option><option>外观损伤</option><option>车辆批改</option><option>软件复诊</option></select>'
new2 = '<select id="fType"><option value="">工单类型</option></select>'
if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print('OK: fType select replaced')
else:
    print('MISS: fType select')

# =============================================
# 3. editType select 动态化（编辑工单弹窗）
# =============================================
old3 = '<select class="form-control" id="editType"><option value="">请选择</option><option>故障维修</option><option>现场救援</option><option>周期保养</option><option>外观损伤</option><option>车辆批改</option><option>软件复诊</option></select>'
new3 = '<select class="form-control" id="editType"><option value="">请选择</option></select>'
if old3 in content:
    content = content.replace(old3, new3, 1)
    changes += 1
    print('OK: editType select replaced')
else:
    print('MISS: editType select')

# =============================================
# 4. newType select 动态化（新建工单弹窗）
# =============================================
old4 = '<select class="form-control" id="newType"><option value="">请选择</option><option>故障维修</option><option>现场救援</option><option>周期保养</option><option>外观损伤</option><option>车辆批改</option><option>软件复诊</option></select>'
new4 = '<select class="form-control" id="newType"><option value="">请选择</option></select>'
if old4 in content:
    content = content.replace(old4, new4, 1)
    changes += 1
    print('OK: newType select replaced')
else:
    print('MISS: newType select')

if changes > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'DONE: {changes} changes written')
else:
    print('NO changes written')