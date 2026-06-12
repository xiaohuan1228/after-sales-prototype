path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
lines = open(path).readlines()

# find second 'var _slaRules = ['
count = 0
second_start = None
for i, l in enumerate(lines):
    if 'var _slaRules = [' in l:
        count += 1
        if count == 2:
            second_start = i
            break

# find 'function renderSlaRuleTable'
rend_line = None
for i, l in enumerate(lines):
    if 'function renderSlaRuleTable' in l:
        rend_line = i
        break

print('second _slaRules:', second_start+1 if second_start is not None else None)
print('renderSlaRuleTable:', rend_line+1 if rend_line is not None else None)

if second_start is not None and rend_line is not None:
    # also need to delete the blank line + comment before second_start
    # check 2 lines before
    del_start = second_start
    if del_start > 0 and lines[del_start-1].strip() == '':
        del_start -= 1
    if del_start > 0 and lines[del_start-1].strip().startswith('//'):
        del_start -= 1
    if del_start > 0 and lines[del_start-1].strip().startswith('/*'):
        del_start -= 1
    if del_start > 0 and lines[del_start-1].strip() == '':
        del_start -= 1
    print('deleting lines', del_start+1, 'to', rend_line)
    new_lines = lines[:del_start] + lines[rend_line:]
    open(path, 'w').writelines(new_lines)
    print('done, total lines now:', len(new_lines))
else:
    print('nothing to delete')