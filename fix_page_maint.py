path = '/Users/cuiqifan.1/Desktop/after_sales_prototype/phase1_admin_prototype.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old = "      <!-- 配置中心 -->\n      <div id=\"page-config\" class=\"hidden\">"

new = """      <!-- 保养管理 -->
      <div id="page-maint" class="hidden">
        <div class="page-title">保养管理</div>
        <div class="stat-cards" style="grid-template-columns:repeat(4,1fr);">
          <div class="stat-card success"><div class="stat-label">本月已完成</div><div class="stat-value">34</div></div>
          <div class="stat-card warning"><div class="stat-label">7天内待保养</div><div class="stat-value">12</div></div>
          <div class="stat-card danger"><div class="stat-label">已逾期</div><div class="stat-value">5</div></div>
          <div class="stat-card"><div class="stat-label">计划中</div><div class="stat-value">28</div></div>
        </div>
        <div class="config-tabs">
          <div class="tab-nav">
            <div class="tab-item active" onclick="switchMaintTab(this,'maint-hist')">历史保养记录</div>
            <div class="tab-item" onclick="switchMaintTab(this,'maint-plan')">未来保养计划</div>
          </div>
          <div class="tab-content">
            <div id="maint-hist">
              <div class="filter-bar">
                <input type="text" id="mhKw" placeholder="搜索车辆/站点">
                <select id="mhType"><option value="">保养类型</option><option>首保</option><option>小保</option><option>大保</option><option>季度点检</option></select>
                <select id="mhResult"><option value="">结果</option><option>正常完成</option><option>发现问题</option></select>
                <button class="btn btn-primary" onclick="applyMaintFilter()">筛选</button>
                <button class="btn btn-default" onclick="resetMaintFilter()">重置</button>
              </div>
              <div class="table-wrap"><table>
                <thead><tr><th>保养单号</th><th>车辆</th><th>车型/车号</th><th>站点</th><th>保养类型</th><th>里程(km)</th><th>保养项目</th><th>服务站</th><th>执行时间</th><th>结果</th><th>下次里程(km)</th><th>操作人</th></tr></thead>
                <tbody id="maintHistBody"></tbody>
              </table></div>
            </div>
            <div id="maint-plan" class="hidden">
              <div class="filter-bar">
                <input type="text" id="mpKw" placeholder="搜索车辆/站点">
                <select id="mpType"><option value="">计划类型</option><option>首保</option><option>小保</option><option>大保</option><option>季度点检</option></select>
                <select id="mpUrgency"><option value="">紧迫度</option><option>已逾期</option><option>7天内</option><option>30天内</option><option>30天以上</option></select>
                <button class="btn btn-primary" onclick="applyPlanFilter()">筛选</button>
                <button class="btn btn-default" onclick="resetPlanFilter()">重置</button>
              </div>
              <div class="table-wrap"><table>
                <thead><tr><th>车辆</th><th>站点</th><th>当前里程(km)</th><th>上次保养时间</th><th>上次里程(km)</th><th>计划类型</th><th>计划里程(km)</th><th>预计日期</th><th>紧迫度</th><th>操作</th></tr></thead>
                <tbody id="maintPlanBody"></tbody>
              </table></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 配置中心 -->
      <div id="page-config" class="hidden">"""

if old in c:
    c = c.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('OK - page-maint HTML已写入')
else:
    print('NOT FOUND')
    idx = c.find('配置中心')
    print(repr(c[idx-20:idx+60]))