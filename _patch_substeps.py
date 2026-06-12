import re

with open('phase1_admin_prototype.html', 'r') as f:
    content = f.read()

# subSteps 数据 per order
patches = {
    'WO-2026060001': "subSteps:[{step:'待服务站接单',startTime:'2026-06-08 08:51',endTime:'2026-06-08 09:05',executor:'王运营'},{step:'服务站诊断中',startTime:'2026-06-08 09:05',endTime:null,executor:'张师傅'}]",
    'WO-2026060003': "subSteps:[{step:'待服务站接单',startTime:'2026-06-08 07:30',endTime:'2026-06-08 08:00',executor:'王运营'},{step:'服务站诊断中',startTime:'2026-06-08 08:00',endTime:'2026-06-08 09:30',executor:'张师傅'},{step:'售后/研发复诊中',startTime:'2026-06-08 09:30',endTime:null,executor:'李研发'}]",
    'WO-2026060004': "subSteps:[{step:'待服务站接单',startTime:'2026-06-07 14:22',endTime:'2026-06-07 15:00',executor:'陈运营'},{step:'服务站诊断中',startTime:'2026-06-07 15:00',endTime:'2026-06-07 17:30',executor:'张技师'},{step:'待配件',startTime:'2026-06-07 17:30',endTime:'2026-06-08 09:00',executor:'陈运营'},{step:'待预约',startTime:'2026-06-08 09:00',endTime:'2026-06-08 10:00',executor:'陈运营'},{step:'已预约',startTime:'2026-06-08 10:00',endTime:'2026-06-08 13:00',executor:'张技师'},{step:'已到场',startTime:'2026-06-08 13:00',endTime:'2026-06-08 14:05',executor:'张技师'},{step:'维修开始',startTime:'2026-06-08 14:05',endTime:'2026-06-08 15:38',executor:'张技师'},{step:'维修完成',startTime:'2026-06-08 15:38',endTime:'2026-06-08 15:38',executor:'张技师'}]",
    'WO-2026060005': "subSteps:[{step:'待服务站接单',startTime:'2026-06-07 10:00',endTime:'2026-06-07 11:00',executor:'陈运营'},{step:'服务站诊断中',startTime:'2026-06-07 11:00',endTime:'2026-06-07 12:30',executor:'李技师'},{step:'待配件',startTime:'2026-06-07 12:30',endTime:null,executor:'陈运营'}]",
    'WO-2026060007': "subSteps:[{step:'待服务站接单',startTime:'2026-06-08 06:18',endTime:'2026-06-08 08:00',executor:'系统自动'},{step:'服务站诊断中',startTime:'2026-06-08 08:00',endTime:'2026-06-08 10:30',executor:'李技师'},{step:'待预约',startTime:'2026-06-08 10:30',endTime:'2026-06-08 12:00',executor:'王运营'},{step:'已预约',startTime:'2026-06-08 12:00',endTime:null,executor:'王运营'}]",
}

for oid, steps_str in patches.items():
    # 找到该工单 id 所在行，在行末 } 前插入
    pattern = r"(\{ id:'" + oid + r"',[^\n]+?)(,\s*realtimeLoc:[^\n]+?)(,\s*locStatus:'[^']+' \})"
    def make_replacer(s):
        def repl(m):
            return m.group(1) + m.group(2) + m.group(3).replace(' }', ', '+s+' }')
        return repl
    new_content = re.sub(pattern, make_replacer(steps_str), content, flags=re.DOTALL)
    if new_content != content:
        content = new_content
        print(f"Patched {oid}")
    else:
        print(f"WARN: no match for {oid}")

with open('phase1_admin_prototype.html', 'w') as f:
    f.write(content)
print("Done")