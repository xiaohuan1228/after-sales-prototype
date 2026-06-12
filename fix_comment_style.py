path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 注入留言 CSS（替换 </style> 标记）
comment_css = """
  /* ===== 诊断留言 ===== */
  .comment-section { background: #f7f8fa; border-radius: 8px; padding: 16px; margin-top: 4px; }
  .comment-list { display: flex; flex-direction: column; gap: 16px; max-height: 320px; overflow-y: auto; padding-right: 4px; }
  .comment-list::-webkit-scrollbar { width: 4px; }
  .comment-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
  .comment-item { display:flex; gap: 10px; align-items: flex-start; }
  .comment-item.self { flex-direction: row-reverse; }
  .comment-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .avatar-ops { background: #1890ff; color: #fff; }
  .avatar-station { background: #52c41a; color: #fff; }
  .avatar-rd { background: #722ed1; color: #fff; }
  .avatar-system { background: #bfbfbf; color: #fff; }
  .comment-bubble-wrap { max-width: 78%; display: flex; flex-direction: column; gap: 4px; }
  .comment-item.self .comment-bubble-wrap { align-items: flex-end; }
  .comment-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #999; }
  .comment-name { font-weight: 600; color: #555; font-size: 12px; }
  .comment-role-tag { padding: 1px 6px; border-radius: 10px; font-size: 10px; font-weight: 500; }
  .role-tag-ops { background: #e6f7ff; color: #1890ff; }
  .role-tag-station { background: #f6ffed; color: #52c41a; }
  .role-tag-rd { background: #f9f0ff; color: #722ed1; }
  .role-tag-system { background: #f5f5f5; color: #999; }
  .comment-bubble { background: #fff; border-radius: 10px; border-top-left-radius: 2px; padding: 9px 13px; font-size: 12px; line-height: 1.65; color: #333; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #eee; }
  .comment-item.self .comment-bubble { background: #e8f4ff; border-color: #bae0ff; border-top-left-radius: 10px; border-top-right-radius: 2px; }
  .comment-imgs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .comment-img-thumb { width: 56px; height: 56px; border-radius: 6px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid #e0e0e0; cursor: pointer; transition: border-color 0.2s; }
  .comment-img-thumb:hover { border-color: #1890ff; }
  /* 输入区 */
  .comment-input-wrap { margin-top: 14px; background: #fff; border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden; transition: border-color 0.2s; }
  .comment-input-wrap:focus-within { border-color: #1890ff; box-shadow: 0 0 0 2px rgba(24,144,255,0.1); }
  .comment-toolbar { padding: 8px 12px 6px; display: flex; align-items: center; gap: 4px; border-bottom: 1px solid #f5f5f5; }
  .comment-toolbar-btn { background: none; border: none; cursor: pointer; width: 28px; height: 28px; border-radius: 4px; font-size: 15px; display: flex; align-items: center; justify-content: center; color: #888; transition: background 0.15s; }
  .comment-toolbar-btn:hover { background: #f0f0f0; color: #333; }
  .comment-textarea { width: 100%; border: none; outline: none; padding: 10px 14px; font-size: 12px; resize: none; font-family: inherit; line-height: 1.6; min-height: 72px; color: #333; }
  .comment-textarea::placeholder { color: #bbb; }
  .comment-footer { padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; background: #fafafa; border-top: 1px solid #f0f0f0; }
  .comment-hint { font-size: 11px; color: #bbb; display: flex; align-items: center; gap: 8px; }
  .comment-hint-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .preview-imgs { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 14px 0; }
  .preview-img-item { width: 44px; height: 44px; border-radius: 5px; background: #e8f4ff; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid #bae0ff; position: relative; }
  .preview-img-rm { position: absolute; top: -5px; right: -5px; background: #ff4d4f; color: #fff; border-radius: 50%; width: 15px; height: 15px; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
"""

content = content.replace('</style>', comment_css + '</style>', 1)

# 2. 优化 renderComments 函数，使用更好的 HTML 结构
old_render = """function renderComments(id){
  var list = getComments(id);
  var roleMap = { ops:'运营', station:'服务站', rd:'研发', system:'系统' };
  var avCls = { ops:'avatar-ops', station:'avatar-station', rd:'avatar-rd', system:'avatar-system' };
  return list.map(function(c){
    var isSelf = (c.role === 'ops');
    var imgs = c.imgs ? c.imgs.map(function(img){ return '<div class="comment-img-thumb">'+img+'</div>'; }).join('') : '';
    var imgBlock = imgs ? '<div class="comment-imgs">'+imgs+'</div>' : '';
    return '<div class="comment-item'+(isSelf?' self':'')+'\">' +
      '<div class="comment-avatar '+avCls[c.role]+'">'+c.name.charAt(0)+'</div>' +
      '<div class="comment-bubble-wrap">' +
        '<div class="comment-meta"><span class="comment-role">'+c.name+'</span>' +
        '<span style="background:#f0f0f0;padding:0 5px;border-radius:2px;font-size:10px;">'+roleMap[c.role]+'</span>' +
        '<span>'+c.time+'</span></div>' +
        '<div class="comment-bubble">'+c.text+imgBlock+'</div>' +
      '</div>' +
    '</div>';
  }).join('');
}"""

new_render = """function renderComments(id){
  var list = getComments(id);
  var roleMap = { ops:'运营', station:'服务站', rd:'研发', system:'系统' };
  var avCls = { ops:'avatar-ops', station:'avatar-station', rd:'avatar-rd', system:'avatar-system' };
  var tagCls = { ops:'role-tag-ops', station:'role-tag-station', rd:'role-tag-rd', system:'role-tag-system' };
  return list.map(function(c){
    var isSelf = (c.role === 'ops');
    var imgs = c.imgs ? c.imgs.map(function(img){ return '<div class="comment-img-thumb">'+img+'</div>'; }).join('') : '';
    var imgBlock = imgs ? '<div class="comment-imgs">'+imgs+'</div>' : '';
    return '<div class="comment-item'+(isSelf?' self':'')+'">' +
      '<div class="comment-avatar '+avCls[c.role]+'">'+c.name.charAt(0)+'</div>' +
      '<div class="comment-bubble-wrap">' +
        '<div class="comment-meta">' +
          '<span class="comment-name">'+c.name+'</span>' +
          '<span class="comment-role-tag '+tagCls[c.role]+'">'+roleMap[c.role]+'</span>' +
          '<span>'+c.time+'</span>' +
        '</div>' +
        '<div class="comment-bubble">'+c.text+imgBlock+'</div>' +
      '</div>' +
    '</div>';
  }).join('');
}"""

if old_render in content:
    content = content.replace(old_render, new_render)
    print('renderComments replaced')
else:
    print('WARNING: renderComments not found by exact match, trying partial')
    idx = content.find('function renderComments(id){')
    end_idx = content.find('\nfunction sendComment', idx)
    if idx != -1 and end_idx != -1:
        content = content[:idx] + new_render + '\n' + content[end_idx:]
        print('renderComments replaced by position')

# 3. 优化留言输入区 HTML（在 commentHtml 中）
old_input = """      '<div class="comment-input-area">' +
        '<div class="comment-toolbar">' +
          '<button class="comment-toolbar-btn" title="上传图片" onclick="triggerImgUpload()">🖼️</button>' +
          '<span style="font-size:11px;color:#bbb;">| 运营端留言</span>' +
        '</div>' +
        '<div id="commentImgPreview" class="preview-imgs" style="padding:4px 10px 0;"></div>' +
        '<textarea class="comment-textarea" id="commentInput" placeholder="输入留言内容，可上传图片…" rows="3"></textarea>' +
        '<div class="comment-send-bar">' +
          '<span class="comment-hint">运营 / 服务站 / 研发 各端均可留言</span>' +
          '<button class="btn btn-primary" style="height:26px;padding:0 12px;font-size:12px;" onclick="sendComment(\\\'"+id+"\\\')\">发送</button>' +
        '</div>' +
      '</div>'"""

new_input = """      '<div class="comment-input-wrap">' +
        '<div class="comment-toolbar">' +
          '<button class="comment-toolbar-btn" title="上传图片" onclick="triggerImgUpload()">🖼️</button>' +
          '<button class="comment-toolbar-btn" title="Emoji">😊</button>' +
        '</div>' +
        '<div id="commentImgPreview" class="preview-imgs"></div>' +
        '<textarea class="comment-textarea" id="commentInput" placeholder="输入留言内容，支持上传图片…"></textarea>' +
        '<div class="comment-footer">' +
          '<span class="comment-hint">' +
            '<span class="comment-hint-dot" style="background:#1890ff;"></span>运营' +
            '<span class="comment-hint-dot" style="background:#52c41a;"></span>服务站' +
            '<span class="comment-hint-dot" style="background:#722ed1;"></span>研发' +
          '</span>' +
          '<button class="btn btn-primary" style="height:28px;padding:0 16px;font-size:12px;border-radius:6px;" onclick="sendComment(\\\'"+id+"\\\')\">发送</button>' +
        '</div>' +
      '</div>'"""

if old_input in content:
    content = content.replace(old_input, new_input)
    print('input area replaced')
else:
    print('WARNING: input area not matched, skipping')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done, file length:', len(content))