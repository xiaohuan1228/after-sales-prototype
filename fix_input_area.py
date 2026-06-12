path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到输入区块的起始和结束位置
start_marker = "'<div class=\"comment-input-area\">'"
end_marker = "'<input type=\"file\" id=\"commentFileInput\""

s = content.find(start_marker)
e = content.find(end_marker)
print(f's={s}, e={e}')
if s == -1 or e == -1:
    # 尝试备选
    start_marker = 'comment-input-area'
    s = content.find(start_marker)
    print('fallback s=', s, repr(content[s-2:s+40]))

if s != -1 and e != -1:
    # 替换 comment-input-area 块（不含 file input）
    new_block = (
        "'<div class=\"comment-input-wrap\">' +"
        "\n        '<div class=\"comment-toolbar\">' +"
        "\n          '<button class=\"comment-toolbar-btn\" title=\"上传图片\" onclick=\"triggerImgUpload()\">🖼️</button>' +"
        "\n          '<button class=\"comment-toolbar-btn\" title=\"Emoji\">😊</button>' +"
        "\n        '</div>' +"
        "\n        '<div id=\"commentImgPreview\" class=\"preview-imgs\"></div>' +"
        "\n        '<textarea class=\"comment-textarea\" id=\"commentInput\" placeholder=\"输入留言内容，支持上传图片…\"></textarea>' +"
        "\n        '<div class=\"comment-footer\">' +"
        "\n          '<span class=\"comment-hint\">' +"
        "\n            '<span class=\"comment-hint-dot\" style=\"background:#1890ff;\"></span>运营' +"
        "\n            '<span class=\"comment-hint-dot\" style=\"background:#52c41a;\"></span>服务站' +"
        "\n            '<span class=\"comment-hint-dot\" style=\"background:#722ed1;\"></span>研发' +"
        "\n          '</span>' +"
        "\n          '<button class=\"btn btn-primary\" style=\"height:28px;padding:0 16px;font-size:12px;border-radius:6px;\" onclick=\"sendComment(\\''+id+'\\')\">' +"
        "\n          '发送</button>' +"
        "\n        '</div>' +"
        "\n      '</div>' +"
        "\n      "
    )
    content = content[:s] + new_block + content[e:]
    print('Replaced successfully')
else:
    print('ERROR: could not find markers')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done, length:', len(content))