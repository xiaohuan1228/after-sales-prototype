#!/usr/bin/env python3
"""Remove duplicate mobile JS functions from unified prototype."""
import re

filepath = 'after_sales_prototype/phase1_unified_prototype.html'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the duplicate block: starts after line 3349 "}" + empty line
# and ends before line with "function closeFormPage"
start_idx = None
end_idx = None

for i, line in enumerate(lines):
    # Find where the duplicate block starts - the empty lines after showFormPage
    if i > 3348 and i < 3360 and line.strip() == '' and start_idx is None:
        # Check if next non-empty line is part of mobile functions
        for j in range(i+1, min(i+10, len(lines))):
            if lines[j].strip() and 'visibleCount' in lines[j] or 'applyMobileFilters' in lines[j]:
                start_idx = i
                break
    # Find closeFormPage which marks the end of the duplicate block
    if 'function closeFormPage(dest)' in line and end_idx is None and i > 3350:
        # The duplicate block ends just before closeFormPage
        # Find the last empty line before closeFormPage
        for j in range(i-1, max(i-5, 0), -1):
            if lines[j].strip() == '' or 'submitTaskAction' in lines[j]:
                end_idx = i  # Keep the empty line before closeFormPage
                break

print(f"Found duplicate block from line {start_idx+1} to {end_idx}")
if start_idx is not None and end_idx is not None:
    # Remove lines from start_idx to end_idx-1 (keep closeFormPage)
    # But keep one empty line
    removed = lines[start_idx:end_idx-1]
    new_lines = lines[:start_idx] + ['\n'] + lines[end_idx-1:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Removed {len(removed)} lines")
else:
    print("Could not find duplicate block")