path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
content = open(path, encoding='utf-8').read()

# 1. 手机预览底部按钮
old1 = '>驳回</button>'
new1 = '>不通过</button>'

# 2. JS验收项卡片单选项
old2 = '> 驳回</label>'
new2 = '> 不通过</label>'

if old1 in content:
    content = content.replace(old1, new1, 1)
    print('OK: bottom button replaced')
else:
    print('WARN: bottom button not found')

if old2 in content:
    content = content.replace(old2, new2, 1)
    print('OK: radio label replaced')
else:
    print('WARN: radio label not found')

open(path, 'w', encoding='utf-8').write(content)