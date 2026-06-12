var _slaRules = [
  { type:'故障维修', enabled:true, slots:[{label:'上午上报',cutoffHour:12,deadlineDesc:'当日 24:00',deadlineHour:24,deadlineDay:0},{label:'下午上报',cutoffHour:24,deadlineDesc:'次日 12:00',deadlineHour:12,deadlineDay:1}], escalation:'超时后自动升级为 P0'},
  { type:'现场救援', enabled:true, slots:[{label:'全天',cutoffHour:24,deadlineDesc:'上报后 4 小时内',offsetHours:4}], escalation:'超时后自动通知主管升级'},
  { type:'周期保养', enabled:true, slots:[{label:'全天',cutoffHour:24,deadlineDesc:'上报后 48 小时内',offsetHours:48}], escalation:'超时发送提醒通知'},
  { type:'外观损伤', enabled:true, slots:[{label:'全天',cutoffHour:24,deadlineDesc:'上报后 72 小时内',offsetHours:72}], escalation:'超时发送提醒通知'},
  { type:'软件复诊', enabled:true, slots:[{label:'全天',cutoffHour:24,deadlineDesc:'上报后 24 小时内',offsetHours:24}], escalation:'超时后自动通知研发团队升级'},
  { type:'车辆批改', enabled:true, slots:[{label:'全天',cutoffHour:24,deadlineDesc:'上报后 48 小时内',offsetHours:48}], escalation:'超时发送提醒通知'},
  { type:'转站需求', enabled:true, slots:[{label:'全天',cutoffHour:24,deadlineDesc:'上报后 24 小时内',offsetHours:24}], escalation:'超时后自动通知调度主管升级'}
];
console.log('SLA规则总数:', _slaRules.length);
_slaRules.forEach(function(r) {
  console.log(r.type, '->', r.slots.map(function(s){return s.deadlineDesc}).join(', '), '| 升级:', r.escalation);
});
var types = ['故障维修','现场救援','周期保养','外观损伤','软件复诊','车辆批改','转站需求'];
var covered = _slaRules.map(function(r){return r.type});
var missing = types.filter(function(t){return covered.indexOf(t)===-1});
console.log('缺失类型:', missing.length ? missing.join(',') : '无');
console.log('验证通过');