
var addSubOrderTargetId = null;
function openAddSubOrderModal(orderId) {
  addSubOrderTargetId = orderId;
  document.getElementById('subOrderTitle').value = '';
  document.getElementById('subOrderAssignee').value = '';
  document.getElementById('subOrderDesc').value = '';
  document.getElementById('subOrderStart').value = '';
  document.getElementById('subOrderEnd').value = '';
  showFormPage('page-add-sub-order');
}
function submitAddSubOrder() {
  var title    = document.getElementById('subOrderTitle').value.trim();
  var assignee = document.getElementById('subOrderAssignee').value.trim();
  var start    = document.getElementById('subOrderStart').value;
  if (!title)    { alert('请填写标题'); return; }
  if (!assignee) { alert('请填写负责人'); return; }
  if (!start)    { alert('请选择开始时间'); return; }
  var end = document.getElementById('subOrderEnd').value;
  var o = orders.find(function(x){ return x.id === addSubOrderTargetId; });
  if (o) {
    if (!o.subSteps) o.subSteps = [];
    o.subSteps.push({
      step:      title,
      executor:  assignee,
      startTime: start.replace('T',' '),
      endTime:   end ? end.replace('T',' ') : null
    });
  }
  closeFormPage('sub-back');
  showToast('维修子单「' + title + '」已创建', 'success');
  if (addSubOrderTargetId) openOrderDetail(addSubOrderTargetId);
}
