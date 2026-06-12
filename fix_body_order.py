#!/usr/bin/env python3
# 修复 </body></html> 位置：将其从第一个 </script> 后移到文件末尾
import re

filepath = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到第一个 </script> 后紧跟的 </body>\n</html>\n
# 把这段 </body></html> 删掉（移到文件最后）
bad_tail = '\n</body>\n</html>\n'

# 用一个唯一标记定位第一个 </script> 后面的 </body></html>
# 策略：找 initTypeTable 函数结束后的 </script>\n</body>\n</html>
marker = '  });\n}\n\n</script>\n</body>\n</html>\n'
replacement = '  });\n}\n\n</script>\n'

if marker in content:
    content = content.replace(marker, replacement, 1)
    # 确保文件末尾有 </body></html>
    content = content.rstrip('\n') + '\n</body>\n</html>\n'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: </body></html> moved to end of file')
else:
    print('ERROR: marker not found, checking content...')
    idx = content.find('</script>\n</body>\n</html>')
    print(f'  Found </script>\\n</body>\\n</html> at char index: {idx}')
    # show context
    if idx > 0:
        print(repr(content[idx-100:idx+30]))