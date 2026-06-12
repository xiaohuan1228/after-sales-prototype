path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old = "    <div class=\"nav-group\">\n      <div class=\"nav-title\">系统配置</div>\n      <div class=\"nav-item\" onclick=\"showPage('config')\">系统配置</div>\n    </div>\n  </aside>"

new = "    <div class=\"nav-group\">\n      <div class=\"nav-title\">保养管理</div>\n      <div class=\"nav-item\" onclick=\"showPage('maint')\">保养管理</div>\n    </div>\n    <div class=\"nav-group\">\n      <div class=\"nav-title\">系统配置</div>\n      <div class=\"nav-item\" onclick=\"showPage('config')\">系统配置</div>\n    </div>\n  </aside>"

if old in c:
    c = c.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('OK - 保养管理菜单已写入')
else:
    print('NOT FOUND')
    idx = c.find('系统配置')
    print(repr(c[idx-50:idx+150]))