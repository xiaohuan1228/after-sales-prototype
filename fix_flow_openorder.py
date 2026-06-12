#!/usr/bin/env python3
import re

path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = (
    '  var masterIdx = masterStatusList.indexOf(o.status);\n'
    '  var masterFlow = masterStatusList.map(function(s,i){\n'
    '    var cls = i<masterIdx?\'done\':(i===masterIdx?\'current\':\'\');\n'
    '    return \'<div class="status-step"><div class="step-circle \'+cls+\'">\''
    '+(i+1)+\'</div><div class="step-label">\'+s+\'</div></div>\''
    '+(i<masterStatusList.length-1?\'<div class="step-line \'+(i<masterIdx?\'done\':\'\')+\'"></div>\':\'\')'
    ';\n'
    '  }).join(\'\');\n'
    '  var subIdx = subStatusList.indexOf(o.sub);\n'
    '  var subStepsMap = {};\n'
    '  if(o.subSteps) o.subSteps.forEach(function(s){ subStepsMap[s.step] = s; });\n'
    '  var subTL = subStatusList.map(function(s,i){'
)

new = (
    '  var _flow = getFlow(o.type);\n'
    '  var _masterList = _flow.master;\n'
    '  var _subList = _flow.sub;\n'
    '  var masterIdx = _masterList.indexOf(o.status);\n'
    '  var masterFlow = _masterList.map(function(s,i){\n'
    '    var cls = i<masterIdx?\'done\':(i===masterIdx?\'current\':\'\');\n'
    '    return \'<div class="status-step"><div class="step-circle \'+cls+\'">\''
    '+(i+1)+\'</div><div class="step-label">\'+s+\'</div></div>\''
    '+(i<_masterList.length-1?\'<div class="step-line \'+(i<masterIdx?\'done\':\'\')+\'"></div>\':\'\')'
    ';\n'
    '  }).join(\'\');\n'
    '  var subIdx = _subList.indexOf(o.sub);\n'
    '  var subStepsMap = {};\n'
    '  if(o.subSteps) o.subSteps.forEach(function(s){ subStepsMap[s.step] = s; });\n'
    '  var subTL = _subList.map(function(s,i){'
)

if old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: replaced')
else:
    print('NOT FOUND - dumping search excerpt:')
    idx = content.find('var masterIdx = masterStatusList')
    if idx >= 0:
        print(repr(content[idx:idx+500]))