import re

with open('phase1_admin_prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

old = '''              <!-- 手机预览弹窗 -->
              <div id="verifyMobileModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;" onclick="if(event.target===this)closeVerifyMobilePreview()">
                <div style="background:#fff;border-radius:16px;padding:20px 24px;width:420px;box-shadow:0 12px 48px rgba(0,0,0,0.22);">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <span style="font-size:14px;font-weight:700;color:#111;">手机端预览</span>
                    <button onclick="closeVerifyMobilePreview()" style="border:none;background:none;font-size:18px;color:#999;cursor:pointer;line-height:1;">×</button>
                  </div>
                  <!-- 手机外框 -->
                  <div style="margin:0 auto;width:300px;background:#1a1a2e;border-radius:36px;padding:12px;box-shadow:0 4px 24px rgba(0,0,0,0.3);">
                    <!-- 顶部刘海 -->
                    <div style="background:#111;border-radius:24px;height:24px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                      <div style="width:60px;height:6px;background:#2a2a3e;border-radius:3px;"></div>
                    </div>
                    <!-- 屏幕内容 -->
                    <div style="background:#f5f7fa;border-radius:20px;overflow:hidden;">
                      <!-- App 顶栏 -->
                      <div style="background:#1890ff;padding:12px 14px;display:flex;align-items:center;gap:10px;">
                        <span style="color:#fff;font-size:14px;">←</span>
                        <span style="color:#fff;font-size:13px;font-weight:600;flex:1;" id="mobilePreviewTitle">验收表单</span>
                        <span style="color:rgba(255,255,255,0.7);font-size:11px;">验收</span>
                      </div>
                      <!-- 表单内容 -->
                      <div id="mobilePreviewBody" style="padding:12px;max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;"></div>
                      <!-- 底部按钮 -->
                      <div style="padding:10px 12px;background:#fff;border-top:1px solid #f0f0f0;display:flex;gap:8px;">
                        <button style="flex:1;height:36px;border:1px solid #d9d9d9;background:#fff;border-radius:6px;font-size:13px;color:#666;">驳回</button>
                        <button style="flex:2;height:36px;border:none;background:#1890ff;border-radius:6px;font-size:13px;color:#fff;font-weight:600;">验收通过</button>
                      </div>
                    </div>
                    <!-- 底部home键 -->
                    <div style="height:16px;display:flex;align-items:center;justify-content:center;margin-top:6px;">
                      <div style="width:80px;height:4px;background:#333;border-radius:2px;"></div>
                    </div>
                  </div>
                  <div style="text-align:center;color:#bbb;font-size:11px;margin-top:12px;">仅为视觉预览，实际交互以手机端为准</div>
                </div>
              </div>'''

new = '''              <!-- 手机预览弹窗 -->
              <div id="verifyMobileModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(3px);" onclick="if(event.target===this)closeVerifyMobilePreview()">
                <div style="background:#fff;border-radius:20px;width:700px;max-height:90vh;box-shadow:0 24px 80px rgba(0,0,0,0.3);overflow:hidden;display:flex;flex-direction:column;">
                  <!-- 弹窗顶栏 -->
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #f0f0f0;flex-shrink:0;background:#fff;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div style="width:34px;height:34px;background:linear-gradient(135deg,#1890ff,#096dd9);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(24,144,255,0.3);">📱</div>
                      <div>
                        <div style="font-size:14px;font-weight:700;color:#111;">手机端预览</div>
                        <div style="font-size:11px;color:#bbb;margin-top:1px;">仅为视觉演示，不代表最终交互效果</div>
                      </div>
                    </div>
                    <button onclick="closeVerifyMobilePreview()" style="width:30px;height:30px;border:none;background:#f5f5f5;border-radius:50%;font-size:16px;color:#999;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
                  </div>
                  <!-- 主体：左说明 + 右手机 -->
                  <div style="display:flex;flex:1;overflow:hidden;">
                    <!-- 左侧说明 -->
                    <div style="width:196px;flex-shrink:0;background:#f8faff;padding:22px 18px;display:flex;flex-direction:column;gap:14px;border-right:1px solid #f0f0f0;">
                      <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.8px;">验收流程</div>
                      <div style="display:flex;flex-direction:column;gap:14px;">
                        <div style="display:flex;align-items:flex-start;gap:9px;">
                          <div style="width:22px;height:22px;background:#1890ff;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</div>
                          <div style="font-size:12px;color:#444;line-height:1.6;">逐项检查<br><span style="color:#bbb;font-size:11px;">选择通过/驳回</span></div>
                        </div>
                        <div style="display:flex;align-items:flex-start;gap:9px;">
                          <div style="width:22px;height:22px;background:#52c41a;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</div>
                          <div style="font-size:12px;color:#444;line-height:1.6;">按需拍照<br><span style="color:#bbb;font-size:11px;">图片为可选项</span></div>
                        </div>
                        <div style="display:flex;align-items:flex-start;gap:9px;">
                          <div style="width:22px;height:22px;background:#722ed1;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</div>
                          <div style="font-size:12px;color:#444;line-height:1.6;">提交结果<br><span style="color:#bbb;font-size:11px;">通过或整体驳回</span></div>
                        </div>
                      </div>
                      <div style="margin-top:auto;background:#fffbeb;border:1px solid #ffe58f;border-radius:8px;padding:10px 12px;">
                        <div style="font-size:10px;color:#ad6800;margin-bottom:3px;">当前模板</div>
                        <div id="mobilePreviewTplName" style="font-size:12px;font-weight:600;color:#333;word-break:break-all;"></div>
                      </div>
                    </div>
                    <!-- 右侧手机 -->
                    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:28px 20px;background:linear-gradient(135deg,#e0eafc,#cfdef3);overflow-y:auto;">
                      <div style="position:relative;">
                        <!-- 侧键 -->
                        <div style="position:absolute;left:-4px;top:72px;width:3px;height:26px;background:#8a8a9a;border-radius:2px 0 0 2px;"></div>
                        <div style="position:absolute;left:-4px;top:108px;width:3px;height:26px;background:#8a8a9a;border-radius:2px 0 0 2px;"></div>
                        <div style="position:absolute;right:-4px;top:96px;width:3px;height:44px;background:#8a8a9a;border-radius:0 2px 2px 0;"></div>
                  <!-- 手机主壳 -->
                        <div style="background:linear-gradient(160deg,#1c1c1e,#2c2c2e);border-radius:40px;padding:10px;box-shadow:0 16px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1),0 0 0 1px rgba(255,255,255,0.06);width:258px;">
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
                            <div style="background:#111;padding:3px 14px 3px;display:flex;justify-content:space-between;align-items:center;">
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
                            <div id="mobilePreviewBody" style="padding:8px;max-height:340px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
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
                </div>
              </div>'''

if old in content:
    content = content.replace(old, new, 1)
    with open('phase1_admin_prototype.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('OK: HTML replaced')
else:
    print('WARN: pattern not found, trying line-based approach')
    lines = content.split('\n')
    # 找到目标行范围
    start = None
    end = None
    for i, line in enumerate(lines):
        if '<!-- 手机预览弹窗 -->' in line and start is None:
            start = i
        if start is not None and i > start and '<!-- 验收项编辑弹窗 -->' in line:
            end = i
            break
    if start is not None and end is not None:
        print(f'Found block: lines {start+1} to {end}')
        new_lines = new.split('\n')
        lines[start:end] = new_lines
        with open('phase1_admin_prototype.html', 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print('OK: line-based replacement done')
    else:
        print(f'ERROR: could not find block start={start} end={end}')