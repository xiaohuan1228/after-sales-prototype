path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
lines = open(path, encoding='utf-8').readlines()

# Find verifyItemList line
target = '              <div id="verifyItemList" style="display:flex;flex-direction:column;gap:6px;margin-bottom:20px;"></div>\n'
idx = None
for i, l in enumerate(lines):
    if l == target:
        idx = i
        break

if idx is None:
    print('ERROR: verifyItemList line not found')
else:
    bottom_bar = (
        '              <div style="display:flex;justify-content:flex-end;gap:8px;'
        'margin-top:10px;padding-top:10px;border-top:1px dashed #f0f0f0;">\n'
        '                <button class="btn btn-default" style="height:30px;font-size:12px;" '
        'onclick="openVerifyMobilePreview()">&#128241; 手机预览</button>\n'
        '                <button class="btn btn-primary" style="height:30px;font-size:12px;" '
        'onclick="openVerifyItemModal(-1)">+ 新增验收项</button>\n'
        '              </div>\n'
    )
    lines.insert(idx + 1, bottom_bar)
    open(path, 'w', encoding='utf-8').writelines(lines)
    print('OK: inserted bottom buttons after line', idx + 1)