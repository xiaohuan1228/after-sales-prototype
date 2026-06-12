import re

path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
html = open(path, encoding='utf-8').read()

# 1. 变量声明
html = html.replace("var _verifyTplComment = {};\n", '')
html = html.replace("var _verifyTplPhotos  = {};\n", '')

# 2. deleteVerifyTpl 里的 delete 语句
html = html.replace("  delete _verifyTplComment[name];\n", '')
html = html.replace("  delete _verifyTplPhotos[name];\n", '')

# 3. renderVerifyPhotos 函数（整体删除）
html = re.sub(
    r'function renderVerifyPhotos\(\)\{.*?\}\n',
    '',
    html,
    flags=re.DOTALL
)

# 4. addVerifyPhotos 函数
html = re.sub(
    r'function addVerifyPhotos\(input\)\{.*?\}\n',
    '',
    html,
    flags=re.DOTALL
)

# 5. removeVerifyPhoto 函数
html = re.sub(
    r'function removeVerifyPhoto\(idx\)\{.*?\}\n',
    '',
    html,
    flags=re.DOTALL
)

open(path, 'w', encoding='utf-8').write(html)
print('Done')