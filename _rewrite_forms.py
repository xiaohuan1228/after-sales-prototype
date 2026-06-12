with open('/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html', encoding='utf-8') as f:
    lines = f.readlines()

# 找到起止行（0-indexed）
start = next(i for i,l in enumerate(lines) if 'id="page-new-order"' in l)
end   = next(i for i,l in enumerate(lines) if '<!-- 工单详情抽屉 -->' in l)

before = lines[:start]
after  = lines[end:]

new_html = open('/Users/cuiqifan.1/Desktop/after_sales_prototype/_form_pages.html', encoding='utf-8').read()

with open('/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html', 'w', encoding='utf-8') as f:
    f.writelines(before)
    f.write(new_html)
    f.writelines(after)

print("Done. start=%d end=%d" % (start+1, end+1))