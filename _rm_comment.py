import re

path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
html = open(path, encoding='utf-8').read()

# 1. 数据里去掉 comment:true/false（含前后空格和逗号）
html = re.sub(r'\s*comment\s*:\s*(?:true|false)\s*,\s*', '  ', html)

# 2. renderVerifyItems 里去掉 commentTag 两行
html = re.sub(
    r'\s*var commentTag = item\.comment[\s\S]*?;border-radius:3px;padding:1px 6px;">图片 ✕</span>\';\n',
    '\n',
    html
)

# 3. renderVerifyItems 里去掉 commentTag+ 的拼接
html = html.replace("+'<span style=\"display:flex;gap:4px;align-items:center;\">'+commentTag+photoTag+'</span>'",
                    "+'<span style=\"display:flex;gap:4px;align-items:center;\">'+photoTag+'</span>'")

# 4. openVerifyItemModal 里去掉 viComment 相关行
html = re.sub(r"    document\.getElementById\('viComment'\)\.checked = .*?;\n", '', html)

# 5. saveVerifyItem 里去掉 comment 字段
html = re.sub(r"\s*comment\s*:\s*document\.getElementById\('viComment'\)\.checked\s*,?\n", '\n', html)

open(path, 'w', encoding='utf-8').write(html)
print('Done')