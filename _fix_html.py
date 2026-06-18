#!/usr/bin/env python3
"""修复被污染的 phase1_unified_prototype.html 文件

目标文件的问题：
- 从第315行开始被污染，表单页面被错误插入到header内部
- 文件从原来的700行膨胀到21199行
- 缺少 page-workorder, page-maint, page-bill, page-order-detail, page-bill-detail, page-config 等主页面

修复策略：
1. 保留目标文件前314行（正确的CSS/头部/sidebar/header开始）
2. 从源文件616-1520行获取所有主页面、详情页、配置页、表单页和抽屉内容
3. 正确闭合header和content
4. 添加关闭标签
"""

src_path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
dst_path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_unified_prototype.html'

# 读取源文件
with open(src_path, 'r', encoding='utf-8') as f:
    src_lines = f.readlines()

# 读取目标文件
with open(dst_path, 'r', encoding='utf-8') as f:
    dst_lines = f.readlines()

print(f"目标文件总行数: {len(dst_lines)}")

# 1. 保留目标文件前314行（正确的CSS/头部/sidebar/header内部内容）
# 前314行包含：
# line 306: <main class="main">
# line 307: <header class="header">
# line 308: breadcrumb
# line 309-313: user-info div内容（header-notif, span, avatar等）
# line 314: </div> (闭合user-info) - 但从输出看314行是空行，需要检查
# 实际：line 313是闭合user-info的</div>，line 314是空行
# 所以保留前313行即可（0-based: 0-312）

# 检查前几行
for i in range(308, 316):
    print(f"  目标文件第{i+1}行: {dst_lines[i].rstrip()[:80]}")

good_lines = dst_lines[:313]  # 保留前313行（0-based索引0-312）

# 2. 闭合header，然后开始content div
bridge_lines = [
    '\n',                         # 空行（原line 314是空行，已包含在good_lines中）
    '    </header>\n',            # 闭合 header
    '\n',                         # 空行
    '    <div class="content">\n',  # 开始 content div
]

# 3. 从源文件获取616-1520行的所有主页面内容（0-based: 615-1519）
# 源文件616-1168行：主页面（workorder, maint, bill, order-detail, bill-detail, config）
# 源文件1169-1520行：表单页面和抽屉
content_lines = src_lines[615:1520]

print(f"源文件内容行数: {len(content_lines)}")
print(f"源文件首行: {content_lines[0][:80]}")
print(f"源文件末行: {content_lines[-1][:80]}")

# 4. 闭合标签：content div, main, layout, view-admin
closing_lines = [
    '    </div><!-- content -->\n',
    '  </main>\n',
    '</div><!-- layout -->\n',
    '</div><!-- view-admin -->\n',
]

# 构建新文件
new_content = good_lines + bridge_lines + content_lines + closing_lines

print(f"新文件总行数: {len(new_content)}")

# 写入文件
with open(dst_path, 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print("文件修复完成!")