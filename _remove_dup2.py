#!/usr/bin/env python3
"""Remove remaining duplicate mobile JS functions."""
filepath = 'after_sales_prototype/phase1_unified_prototype.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all function definitions that are duplicated
# Strategy: find the LAST occurrence of each mobile function and keep it
# Remove earlier occurrences of: setFilter, openFilterSheet, selectFilterOption,
# applyFilterSheet, clearFilterSheet, closeTempFilter, updateFilterSummary,
# openSheet, closeSheet, openTaskComplete, openTaskClose, openTaskAction,
# closeTempTask, submitTaskAction, applyMobileFilters, resetMobileFilters

dup_funcs = [
    'function setFilter(el, role, value)',
    'function openFilterSheet(phone)',
    'function selectFilterOption(el, role, key, value)',
    'function applyFilterSheet(role)',
    'function clearFilterSheet(role)',
    'function closeTempFilter(role)',
    'function updateFilterSummary(phone)',
    'function openSheet(role, sheetId)',
    'function closeSheet(role)',
    'function openTaskComplete(role, orderId)',
    'function openTaskClose(role, orderId)',
    'function openTaskAction(role, orderId, actionId)',
    'function closeTempTask(role)',
    'function submitTaskAction(role, actionId)',
    'function applyMobileFilters(phone)',
    'function resetMobileFilters(phone)',
]

lines = content.split('\n')
# Find line indices of each function
func_positions = {}
for i, line in enumerate(lines):
    for fn in dup_funcs:
        if fn in line:
            if fn not in func_positions:
                func_positions[fn] = []
            func_positions[fn].append(i)

# For each function with multiple occurrences, remove the earlier ones
# We need to remove entire function blocks (from function declaration to closing })
remove_ranges = []
for fn, positions in func_positions.items():
    if len(positions) > 1:
        # Keep the last occurrence, remove earlier ones
        for pos in positions[:-1]:
            # Find the end of the function (next line that starts with 'function' or is empty after })
            end_pos = pos + 1
            while end_pos < len(lines):
                # A function block ends when we hit a line that starts with 'function '
                # or when we've passed a closing } followed by empty line
                if lines[end_pos].strip().startswith('function ') and end_pos > pos + 2:
                    break
                if lines[end_pos].strip() == '}' and end_pos > pos:
                    # Check next line - if it's empty or starts with 'function', we're done
                    if end_pos + 1 < len(lines) and (lines[end_pos+1].strip() == '' or lines[end_pos+1].strip().startswith('function ') or lines[end_pos+1].strip().startswith('//')):
                        end_pos = end_pos + 1
                        break
                end_pos += 1
            remove_ranges.append((pos, end_pos))

# Sort ranges and merge overlapping ones
remove_ranges.sort()
merged = []
for start, end in remove_ranges:
    if merged and start <= merged[-1][1]:
        merged[-1] = (merged[-1][0], max(merged[-1][1], end))
    else:
        merged.append((start, end))

# Remove the ranges
new_lines = []
prev_end = 0
for start, end in merged:
    new_lines.extend(lines[prev_end:start])
    prev_end = end
new_lines.extend(lines[prev_end:])

with open(filepath, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print(f"Removed {len(lines) - len(new_lines)} lines across {len(merged)} ranges")
for start, end in merged:
    print(f"  Removed lines {start+1}-{end}")