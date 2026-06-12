path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
lines = open(path).readlines()

# Find the start/end of tab-rule and tab-sla sections
def find_div_block(lines, start_id, start_line):
    """Find the complete div block starting at start_line with the given id"""
    depth = 0
    for i in range(start_line, len(lines)):
        l = lines[i]
        depth += l.count('<div') - l.count('</div>')
        if depth == 0:
            return i
    return len(lines) - 1

# Find tab-rule start
rule_start = None
for i, l in enumerate(lines):
    if 'id="tab-rule"' in l:
        rule_start = i
        break

# Find tab-sla start
sla_start = None
for i, l in enumerate(lines):
    if 'id="tab-sla"' in l:
        sla_start = i
        break

print(f'tab-rule starts at line {rule_start+1}')
print(f'tab-sla starts at line {sla_start+1}')

# Find tab-sla end (before tab-station)
sla_end = None
for i in range(sla_start + 1, len(lines)):
    if 'id="tab-station"' in lines[i]:
        # go back to find the blank line or </div> before tab-station
        sla_end = i
        # backtrack to skip blank lines
        while sla_end > sla_start and lines[sla_end-1].strip() == '':
            sla_end -= 1
        break

# Find tab-rule end (before tab-sla)
rule_end = None
for i in range(rule_start + 1, len(lines)):
    if 'id="tab-sla"' in lines[i]:
        rule_end = i
        while rule_end > rule_start and lines[rule_end-1].strip() == '':
            rule_end -= 1
        break

print(f'tab-rule block: lines {rule_start+1} to {rule_end}')
print(f'tab-sla block: lines {sla_start+1} to {sla_end}')

# Extract blocks
rule_block = lines[rule_start:rule_end]
sla_block = lines[sla_start:sla_end]

# Remove both blocks, then insert sla before rule
# Lines before rule_start + sla_block + rule_block + lines after sla_end
new_lines = lines[:rule_start] + sla_block + rule_block + lines[sla_end:]

open(path, 'w').writelines(new_lines)
print(f'done, total lines: {len(new_lines)}')