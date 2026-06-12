path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
lines = open(path, encoding='utf-8').readlines()

# Find start: verifyMobileModal div
start_marker = '              <div id="verifyMobileModal"'
end_marker = '              <!-- 验收项编辑弹窗 -->'

start_idx = end_idx = None
for i, l in enumerate(lines):
    if start_idx is None and l.startswith(start_marker):
        start_idx = i
    if start_idx is not None and end_marker in l:
        end_idx = i
        break

print(f'start={start_idx+1}, end(exclusive)={end_idx+1}')

new_html = '''              <!-- 手机预览弹窗 -->
              <div id="verifyMobileModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(3px);" onclick="if(event.target===this)closeVerifyMobilePreview()">
                <div style="background:transparent;display:flex;flex-direction:column;align-items:center;gap:12px;">
                  <!-- 顶栏 -->
                  <div style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 4px;">
                    <span style="color:#fff;font-size:13px;font-weight:600;opacity:0.9;">📱 手机端预览</span>
                    <button onclick="closeVerifyMobilePreview()" style="width:28px;height:28px;border:none;background:rgba(255,255,255,0.15);border-radius:50%;font-size:16px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);">×</button>
                  </div>
                  <!-- 手机外框 -->
                  <div style="position:relative;">
                    <!-- 侧键 -->
                    <div style="position:absolute;left:-4px;top:72px;width:3px;height:26px;background:#8a8a9a;border-radius:2px 0 0 2px;"></div>
                    <div style="position:absolute;left:-4px;top:108px;width:3px;height:26px;background:#8a8a9a;border-radius:2px 0 0 2px;"></div>
                    <div style="position:absolute;right:-4px;top:96px;width:3px;height:44px;background:#8a8a9a;border-radius:0 2px 2px 0;"></div>
                    <!-- 手机主壳 -->
                    <div style="background:linear-gradient(160deg,#1c1c1e,#2c2c2e);border-radius:40px;padding:10px;box-shadow:0 16px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1),0 0 0 1px rgba(255,255,255,0.06);width:300px;">
                      <!-- 动态岛 -->
                      <div style="height:30px;display:flex;align-items:center;justify-content:center;">
                        <div style="background:#000;border-radius:20px;height:24px;width:88px;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:inset 0 1px 3px rgba(0,0,0,0.5);">
                          <div style="width:9px;height:9px;background:#1c1c1e;border-radius:50%;border:1.5px solid #3a3a3c;"></div>
                          <div style="width:5px;height:5px;background:#2c2c2e;border-radius:50%;"></div>
                        </div>
                      </div>
                      <!-- 屏幕 -->
                      <div style="background:#f0f2f5;border-radius:28px;overflow:hidden;box-shadow:inset 0 2px 10px rgba(0,0,0,0.2);">
                        <!-- 状态栏 -->
                        <div style="background:#111;padding:3px 14px;display:flex;justify-content:space-between;align-items:center;">
                          <span style="color:#fff;font-size:9px;font-weight:700;">9:41</span>
                          <div style="display:flex;gap:3px;align-items:center;">
                            <span style="color:#fff;font-size:8px;">▮▮▮</span>
                            <span style="color:#fff;font-size:8px;">WiFi</span>
                            <span style="color:#fff;font-size:8px;">⬛</span>
                          </div>
                        </div>
                        <!-- 导航栏 -->
                 <div style="background:linear-gradient(90deg,#1890ff,#0064cc);padding:9px 11px;display:flex;align-items:center;gap:7px;">
                          <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <span style="color:#fff;font-size:10px;">‹</span>
                          </div>
                          <span style="color:#fff;font-size:11px;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" id="mobilePreviewTitle">验收表单</span>
                          <div style="background:rgba(255,255,255,0.18);border-radius:10px;padding:2px 7px;">
                            <span style="color:#fff;font-size:9px;font-weight:500;">验收中</span>
                          </div>
                        </div>
                        <!-- 表单内容 -->
                        <div id="mobilePreviewBody" style="padding:8px;max-height:480px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
                        <!-- 底部按钮区 -->
                        <div style="background:#fff;border-top:1px solid #f0f0f0;padding:8px 10px 6px;">
                          <div style="display:flex;gap:6px;">
                            <button style="flex:1;height:32px;border:1.5px solid #d9d9d9;background:#fff;border-radius:8px;font-size:10px;color:#666;font-weight:500;">驳回</button>
                            <button style="flex:2;height:32px;border:none;background:linear-gradient(90deg,#1890ff,#0064cc);border-radius:8px;font-size:10px;color:#fff;font-weight:700;box-shadow:0 2px 8px rgba(24,144,255,0.4);">✓ 验收通过</button>
                          </div>
                          <div style="height:3px;width:50px;background:#ddd;border-radius:2px;margin:6px auto 0;"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
'''

lines[start_idx:end_idx] = [new_html]
open(path, 'w', encoding='utf-8').writelines(lines)
print('OK: mobile preview dialog replaced')