import re, subprocess, tempfile

with open('/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html','r') as f:
    content = f.read()

s1_open = content.find('<script>')
s1_close = content.find('</script>', s1_open)
s2_open = content.find('<script>', s1_close+9)
s2_close = content.find('</script>', s2_open+8)
s3_open = content.find('<script>', s2_close+9)
s3_close = content.find('</script>', s3_open+8)

prefix = content[:s1_open]
s1 = content[s1_open+8:s1_close]
s2 = content[s2_open+8:s2_close]
s3 = content[s3_open+8:s3_close]
s2_gap = content[s1_close+9:s2_open]

# ===== Step 1: Cut s1 at the inserted code =====
insert_start = s1.find("});\n  container.innerHTML = html;")
s1_kept = s1[:insert_start].rstrip()

# ===== Step 2: Extract correct blocks from s2_gap =====
def clean_and_extract(text):
    """Remove HTML tags and extract only renderSubNodeDetail part (before renderTePhases code)"""
    text = re.sub(r'</?(?:body|html|script)>', '', text)
    text = text.strip()
    text = re.sub(r'^script>\s*', '', text).strip()
    # Find renderTePhases marker and cut before it
    marker = "});\n  container.innerHTML = html;"
    idx = text.find(marker)
    if idx >= 0:
        return text[:idx].rstrip()
    return text.rstrip()

# Block 1 (预约): chars 7009~14220
b1 = clean_and_extract(s2_gap[7009:14220])
# Block 3 (到场): chars 20907~28087
b3 = clean_and_extract(s2_gap[20907:28087])
# Block 5 (维修): chars 34774~42607
b5 = clean_and_extract(s2_gap[34774:42607])
# Block 6 (维修图片): chars 42616~49636
b6 = clean_and_extract(s2_gap[42616:49636])
# Block 7 (后续函数): chars 49645~107704 - keep all (no renderTePhases code)
b7 = re.sub(r'</?(?:body|html|script)>', '', s2_gap[49645:107704]).strip()
b7 = re.sub(r'^script>\s*', '', b7).strip()

# ===== Step 3: Assemble Script 1 =====
s1_new = s1_kept + '\n' + b1 + '\n' + b3 + '\n' + b5 + '\n' + b6 + '\n' + b7

# ===== Step 4: Validate Script 1 =====
with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
    f.write(s1_new)
    temp_path = f.name

result = subprocess.run(['node', '--check', temp_path], capture_output=True, text=True)
if result.returncode != 0:
    err = result.stderr
    line_match = re.search(r'line (\d+)', err)
    if line_match:
        err_line = int(line_match.group(1))
        lines = s1_new.split('\n')
        print('ERROR near line {}'.format(err_line))
        for i in range(err_line-3, min(err_line+5, len(lines))):
            print('S1-L{}: {}'.format(i+1, lines[i][:120]))
    print('S1 Syntax Error: {}'.format(err[:300]))
else:
    print('S1 Syntax: OK!')

# Check key functions
for func in ['renderSubNodeDetail', 'switchPhaseTab', 'opAct', 'showFormPage', 
             'closeFormPage', 'initTypeTable', 'toggleTypeEnabled', 'showToast',
             'renderPhaseTimeline', 'calcSlaDeadline']:
    idx = s1_new.find('function ' + func)
    print('  function {}: {}'.format(func, idx if idx >= 0 else 'MISSING'))

# ===== Step 5: Validate Script 2 and 3 =====
with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
    f.write(s2)
    temp2 = f.name
result2 = subprocess.run(['node', '--check', temp2], capture_output=True, text=True)
print('S2 Syntax: {}'.format('OK' if result2.returncode == 0 else result2.stderr[:200]))

with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
    f.write(s3)
    temp3 = f.name
result3 = subprocess.run(['node', '--check', temp3], capture_output=True, text=True)
print('S3 Syntax: {}'.format('OK' if result3.returncode == 0 else result3.stderr[:200]))

# ===== Step 6: Rebuild file =====
if result.returncode == 0:
    new_content = prefix + '<script>\n' + s1_new + '\n</script>\n\n\n<script>\n' + s2 + '\n</script>\n\n\n<script>\n' + s3 + '\n</script>\n\n</body>\n</html>'
    
    with open('/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html','w') as f:
        f.write(new_content)
    
    print('File rebuilt successfully! Total chars: {}'.format(len(new_content)))
    lines_count = len(new_content.split('\n'))
    print('Total lines: {}'.format(lines_count))
    print('</html> count: {}'.format(new_content.count('</html>')))
    print('</body> count: {}'.format(new_content.count('</body>')))
    print('<script> count: {}'.format(new_content.count('<script>')))
    print('</script> count: {}'.format(new_content.count('</script>')))
else:
    print('S1 has syntax errors - NOT rebuilding file')