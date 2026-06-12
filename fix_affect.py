path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 列表行：去掉橙色
old1 = "'<td style=\"color:#fa8c16;font-weight:600;\">'+(o.affectHours!=null ? o.affectHours+'h' : '-')+'</td>'"
new1 = "'<td>'+(o.affectHours!=null ? o.affectHours+'h' : '-')+'</td>'"
old2 = "'<td style=\"color:#fa8c16;\">'+(o.affectDays!=null ? o.affectDays+'\u5929' : '-')+'</td>'"
new2 = "'<td>'+(o.affectDays!=null ? o.affectDays+'\u5929' : '-')+'</td>'"

# 详情抽屉：去掉橙色
old3 = "'<div class=\"info-item\"><span class=\"info-label\" style=\"color:#fa8c16;\">\u5f71\u54cd\u8fd0\u8425\u65f6\u957f</span><span class=\"info-value\" style=\"color:#fa8c16;font-weight:600;\">'+(o.affectHours!=null?o.affectHours+'h':'-')+'</span></div>'"
new3 = "'<div class=\"info-item\"><span class=\"info-label\">\u5f71\u54cd\u8fd0\u8425\u65f6\u957f</span><span class=\"info-value\">'+(o.affectHours!=null?o.affectHours+'h':'-')+'</span></div>'"
old4 = "'<div class=\"info-item\"><span class=\"info-label\" style=\"color:#fa8c16;\">\u5f71\u54cd\u8fd0\u8425\u5929\u6570</span><span class=\"info-value\" style=\"color:#fa8c16;font-weight:600;\">'+(o.affectDays!=null?o.affectDays+'\u5929':'-')+'</span></div>'"
new4 = "'<div class=\"info-item\"><span class=\"info-label\">\u5f71\u54cd\u8fd0\u8425\u5929\u6570</span><span class=\"info-value\">'+(o.affectDays!=null?o.affectDays+'\u5929':'-')+'</span></div>'"

cnt = 0
for old, new in [(old1,new1),(old2,new2),(old3,new3),(old4,new4)]:
    if old in content:
        content = content.replace(old, new)
        cnt += 1
        print(f"replaced: {old[:40]}...")
    else:
        print(f"NOT FOUND: {old[:60]}...")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"done, {cnt} replacements")