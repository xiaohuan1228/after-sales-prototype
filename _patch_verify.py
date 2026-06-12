with open('/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html', encoding='utf-8') as f:
    lines = f.readlines()

# 找替换区间（0-indexed）
# 从 "// ===== 验收清单数据 =====" 注释行到 removeVerifyItem 函数结束的 "}" 行
start = next(i for i,l in enumerate(lines) if '// ===== 验收清单数据 =====' in l)
# removeVerifyItem 函数结束后的第一行（即 showToast 之后的 "}" + 下一行）
# 找 removeVerifyItem 函数体最后一个 "}"
end = start
in_remove = False
for i in range(start, len(lines)):
    if 'function removeVerifyItem' in lines[i]:
        in_remove = True
    if in_remove and lines[i].strip() == '}':
        end = i + 1
        break

new_js = '''// ===== 验收清单数据 =====
var _verifyTplData = {
  '故障维修标准模板': [
    {name:'车辆启动验证',         comment:true,  photo:false},
    {name:'故障码清除',           comment:true,  photo:false},
    {name:'最小闭环任务试跑',     comment:true,  photo:true},
    {name:'维修前/中/后图片上传', comment:false, photo:true},
    {name:'备件费用确认',         comment:true,  photo:false},
    {name:'P0/P1 根因与复盘结论', comment:true,  photo:false}
  ],
  '现场救援模板': [
    {name:'故障现场照片上传',     comment:false, photo:true},
    {name:'救援完成确认',         comment:true,  photo:false},
    {name:'车辆能否自行驶离',     comment:true,  photo:false},
    {name:'联系客户确认',         comment:true,  photo:false},
    {name:'救援报告填写',         comment:true,  photo:false}
  ],
  '保养清单': [
    {name:'机油更换确认',         comment:true,  photo:false},
    {name:'滤芯更换确认',         comment:true,  photo:false},
    {name:'轮胎气压检查',         comment:true,  photo:false},
    {name:'灯光功能检查',         comment:true,  photo:false},
    {name:'刹车系统检查',         comment:true,  photo:false},
    {name:'保养里程/日期记录',    comment:true,  photo:false}
  ],
  '软件复诊模板': [
    {name:'OTA 版本确认',         comment:true,  photo:false},
    {name:'故障码清除',           comment:true,  photo:false},
    {name:'软件功能回归测试',     comment:true,  photo:false},
    {name:'最小闭环任务试跑',     comment:true,  photo:true},
    {name:'复诊报告提交',         comment:true,  photo:false}
  ],
  '外观验收': [
    {name:'划痕/损伤修复确认',    comment:true,  photo:true},
    {name:'修复前/后照片比',    comment:false, photo:true},
    {name:'整车外观拍照',         comment:false, photo:true},
    {name:'客户确认签字',         comment:true,  photo:false}
  ],
  '批改流程模板': [
    {name:'批改项清单逐一确认',   comment:true,  photo:false},
    {name:'批改前/后照片',        comment:false, photo:true},
    {name:'车辆功能验证',         comment:true,  photo:false},
    {name:'备件/耗材费用登记',    comment:true,  photo:false}
  ],
  '转站流程模板': [
    {name:'发运前车辆状态确认',   comment:true,  photo:true},
    {name:'发运照片上传',         comment:false, photo:true},
    {name:'目标站接收确认',       comment:true,  photo:false},
    {name:'交接记录填写',         comment:true,  photo:false}
  ],
  '通用验收模板': [
    {name:'车辆基本功能验证',     comment:true,  photo:false},
    {name:'完工照片上传',         comment:false, photo:true},
    {name:'客户确认',             comment:true,  photo:false}
  ],
  '暂无模板': []
};
var _verifyTplComment = {};
var _verifyTplPhotos  = {};
var _verifyCurrentTpl = null;
var _verifyEditIdx    = -1;

function initVerifyTab(){
  var nav = document.getElementById('verifyTplNav');
  if(nav.children.length > 0) return;
  var tpls = Object.keys(_verifyTplData);
  tpls.forEach(function(name){
    var el = document.createElement('div');
    el.textContent = name;
    el.style.cssText = 'padding:8px 14px;cursor:pointer;font-size:13px;color:#888;border-bottom:2px solid transparent;white-space:nowrap;transition:color 0.15s;';
    el.onclick = function(){ switchVerifyTpl(name); };
    nav.appendChild(el);
  });
  switchVerifyTpl(tpls[0]);
}

function switchVerifyTpl(name){
  if(_verifyCurrentTpl !== null){
    _verifyTplComment[_verifyCurrentTpl] = document.getElementById('verifyComment').value;
  }
  _verifyCurrentTpl = name;
  var nav = document.getElementById('verifyTplNav');
  Array.from(nav.children).forEach(function(el){
    var active = el.textContent === name;
    el.style.color = active ? '#1890ff' : '#888';
    el.style.borderBottomColor = active ? '#1890ff' : 'transparent';
    el.style.fontWeight = active ? '600' : '400';
  });
  document.getElementById('verifyTplTitle').textContent = name;
  document.getElementById('verifyComment').value = _verifyTplComment[name] || '';
  renderVerifyItems();
  renderVerifyPhotos();
}

function renderVerifyItems(){
  var list = document.getElementById('verifyItemList');
  var items = _verifyTplData[_verifyCurrentTpl] || [];
  if(items.length === 0){
    list.innerHTML = '<div style="color:#bbb;font-size:12px;padding:12px 0;">暂无验收项，点击右上角「+ 新增验收项」添加</div>';
    return;
  }
  list.innerHTML = items.map(function(item, idx){
    var commentTag = item.comment
      ? '<span style="font-size:11px;background:#e6f7ff;color:#1890ff;border:1px solid #bae7ff;border-radius:3px;padding:1px 6px;">评论 ✓</span>'
      : '<span style="font-size:11px;background:#f5f5f5;color:#bbb;border:1px solid #e8e8e8;border-radius:3px;padding:1px 6px;">评论 ✕</span>';
    var photoTag = item.photo
      ? '<span style="font-size:11px;background:#fff7e6;color:#fa8c16;border:1px solid #ffd591;border-radius:3px;padding:1px 6px;">图片 ✓</span>'
      : '<span style="font-size:11px;background:#f5f5f5;color:#bbb;border:1px solid #e8e8e8;border-radius:3px;padding:1px 6px;">图片 ✕</span>';
    return '<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#fafafa;border-radius:6px;border:1px solid #f0f0f0;">'
      +'<span style="color:#bbb;font-size:12px;min-width:20px;">'+(idx+1)+'.</span>'
      +'<span style="flex:1;font-size:13px;color:#333;">'+item.name+'</span>'
      +'<span style="display:flex;gap:4px;align-items:center;">'+commentTag+photoTag+'</span>'
      +'<button onclick="openVerifyItemModal('+idx+')" style="border:none;background:none;color:#1890ff;font-size:12px;cursor:pointer;padding:2px 6px;">编辑</button>'
      +'<button onclick="removeVerifyItem('+idx+')" style="border:none;background:none;color:#ff4d4f;font-size:12px;cursor:pointer;padding:2px 6px;">删除</button>'
      +'</div>';
  }).join('');
}

function renderVerifyPhotos(){
  var photos = _verifyTplPhotos[_verifyCurrentTpl] || [];
  var container = document.getElementById('verifyPhotoList');
  container.innerHTML = photos.map(function(src, idx){
    return '<div style="position:relative;width:80px;height:80px;">'
      +'<img src="'+src+'" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #f0f0f0;">'
      +'<button onclick="removeVerifyPhoto('+idx+')" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#ff4d4f;color:#fff;border:none;cursor:pointer;font-size:12px;line-height:18px;text-align:center;padding:0;">×</button>'
      +'</div>';
  }).join('');
}

function addVerifyPhotos(input){
  if(!_verifyTplPhotos[_verifyCurrentTpl]) _verifyTplPhotos[_verifyCurrentTpl] = [];
  var files = Array.from(input.files);
  var remaining = files.length;
  files.forEach(function(file){
    var reader = new FileReader();
    reader.onload = function(e){
      _verifyTplPhotos[_verifyCurrentTpl].push(e.target.result);
      remaining--;
      if(remaining === 0) renderVerifyPhotos();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function removeVerifyPhoto(idx){
  _verifyTplPhotos[_verifyCurrentTpl].splice(idx, 1);
  renderVerifyPhotos();
}

function openVerifyItemModal(idx){
  _verifyEditIdx = idx;
  document.getElementById('verifyItemModal').style.display = 'flex';
  document.getElementById('verifyItemModalTitle').textContent = idx === -1 ? '新增验收项' : '编辑验收项';
  if(idx === -1){
    document.getElementById('viName').value = '';
    document.getElementById('viComment').checked = true;
    document.getElementById('viPhoto').checked = true;
  } else {
    var item = (_verifyTplData[_verifyCurrentTpl] || [])[idx] || {};
    document.getElementById('viName').value = item.name || '';
    document.getElementById('viComment').checked = item.comment !== false;
    document.getElementById('viPhoto').checked = item.photo !== false;
  }
}

function closeVerifyItemModal(){
  document.getElementById('verifyItemModal').style.display = 'none';
}

function saveVerifyItem(){
  var name = document.getElementById('viName').value.trim();
  if(!name){ showToast('请输入验收项名称', 'error'); return; }
  var item = {
    name:    name,
    comment: document.getElementById('viComment').checked,
    photo:   document.getElementById('viPhoto').checked
  };
  if(!_verifyTplData[_verifyCurrentTpl]) _verifyTplData[_verifyCurrentTpl] = [];
  if(_verifyEditIdx === -1){
    _verifyTplData[_verifyCurrentTpl].push(item);
  } else {
    _verifyTplData[_verifyCurrentTpl][_verifyEditIdx] = item;
  }
  closeVerifyItemModal();
  renderVerifyItems();
  showToast(_verifyEditIdx === -1 ? '验收项已添加' : '已保存', 'success');
}

function removeVerifyItem(idx){
  if(!confirm('确认删除该验收项？')) return;
  _verifyTplData[_verifyCurrentTpl].splice(idx, 1);
  renderVerifyItems();
  showToast('已删除', 'success');
}
'''

with open('/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html', 'w', encoding='utf-8') as f:
    f.writelines(lines[:start])
    f.write(new_js)
    f.writelines(lines[end:])

print("Done. replaced lines %d-%d" % (start+1, end))