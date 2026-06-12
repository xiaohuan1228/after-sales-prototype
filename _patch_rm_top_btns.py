path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
lines = open(path, encoding='utf-8').readlines()

# Remove lines 611-617 (0-based 610-616): the top toolbar div with buttons
# Replace the whole block with just the title span line (standalone)
start = 610  # 0-based, line 611
end = 617    # 0-based exclusive, line 617 inclusive -> remove [610:617]

# Verify first and last line of range
print('start:', repr(lines[start]))
print('end-1:', repr(lines[end-1]))

new_title_line = '              <div style="margin-bottom:10px;"><span id="verifyTplTitle" style="font-size:13px;font-weight:600;color:#333;"></span></div>\n'
lines[start:end] = [new_title_line]

open(path, 'w', encoding='utf-8').writelines(lines)
print('OK: removed top buttons, kept title span')