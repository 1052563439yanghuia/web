// =====================
// 教学管理系统 业务逻辑
// =====================

let currentUser = null;

// 模拟学生数据库
const students = [
  {studentId:'2203',name:'张明哲',age:21,gender:'男',grade:'网络2203',isPunished:true,reason:'携带违规电器'},
  {studentId:'2201',name:'吴天宇',age:21,gender:'男',grade:'前端2201',isPunished:true,reason:'考试作弊'},
  {studentId:'2202',name:'杨宇航',age:21,gender:'男',grade:'前端2202',isPunished:true,reason:'和同学打架'},
  {studentId:'2204',name:'李四',age:20,gender:'女',grade:'前端2201',isPunished:false,reason:''}
];

// 登录逻辑
function doLogin() {
  currentUser = {name:'屈侯'};
  document.getElementById('username').innerText = currentUser.name;
  document.getElementById('mainArea').innerHTML = `
    <div class="card">
      <h3>欢迎, ${currentUser.name}</h3>
      <button class="btn" onclick="openPage('student-query')">进入学生信息查询</button>
    </div>`;
}

// 打开页面
function openPage(p) {
  const titleMap = {
    'student-query': '学生信息查询',
    'manage-punished': '管理受处分学生',
    'modify-student': '学生信息修改'
  };
  document.getElementById('pageTitle').innerText = titleMap[p] || '个人中心';
  addTab(titleMap[p]);
  if(p === 'student-query') renderStudentQuery();
  if(p === 'manage-punished') renderPunished();
  if(p === 'modify-student') renderModify();
}

// 添加标签页
function addTab(title) {
  const tabs = document.getElementById('tabs');
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.innerText = title;
  tabs.appendChild(tag);
}

// 学生信息查询
function renderStudentQuery() {
  document.getElementById('mainArea').innerHTML = `
    <div class="card">
      <div class="controls">
        <input id="q" placeholder="支持学号、姓名和班级查询" class="input-small">
        <select id="qtype" class="input-small">
          <option>全部</option><option>学号</option><option>姓名</option><option>年级</option>
        </select>
        <label><input type="checkbox" id="exact"> 精确</label>
        <button class="btn" onclick="searchStudents()">查询</button>
      </div>
      <h3 style="text-align:center">学生信息</h3>
      <table class="table">
        <thead>
          <tr><th>学号</th><th>姓名</th><th>年龄</th><th>性别</th><th>年级</th><th>是否处分</th><th>处分原因</th></tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>`;
  populateTable(students);
}

// 表格填充
function populateTable(data) {
  document.getElementById('tbody').innerHTML = data.map(r => `
    <tr>
      <td>${r.studentId}</td>
      <td>${r.name}</td>
      <td>${r.age}</td>
      <td>${r.gender}</td>
      <td>${r.grade}</td>
      <td style="color:${r.isPunished ? '#F87171' : '#10B981'}">
        ${r.isPunished ? '处分中' : '无处分'}
      </td>
      <td>${r.reason || ''}</td>
    </tr>`).join('');
}

// 搜索功能
function searchStudents() {
  const q = document.getElementById('q').value.trim();
  const type = document.getElementById('qtype').value;
  const exact = document.getElementById('exact').checked;
  if(!q) return populateTable(students);

  const res = students.filter(s => {
    if(type === '全部')
      return s.studentId.includes(q) || s.name.includes(q) || s.grade.includes(q);
    if(type === '学号') return exact ? s.studentId === q : s.studentId.includes(q);
    if(type === '姓名') return exact ? s.name === q : s.name.includes(q);
    if(type === '年级') return exact ? s.grade === q : s.grade.includes(q);
  });
  populateTable(res);
}

// 受处分学生管理
function renderPunished() {
  const punished = students.filter(s => s.isPunished);
  document.getElementById('mainArea').innerHTML = `
    <div class="card">
      <div class="controls">
        <input id="pq" placeholder="支持学号、姓名和年级查询" class="input-small">
        <button class="btn" onclick="searchPunished()">查询</button>
      </div>
      <h3 style="text-align:center">受处分学生信息</h3>
      <table class="table">
        <thead><tr><th>学号</th><th>姓名</th><th>年龄</th><th>性别</th><th>年级</th><th>处分原因</th></tr></thead>
        <tbody id="punishedBody">
          ${punished.map(r=>`
            <tr>
              <td>${r.studentId}</td><td>${r.name}</td><td>${r.age}</td>
              <td>${r.gender}</td><td>${r.grade}</td><td>${r.reason}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function searchPunished() {
  const q = document.getElementById('pq').value.trim();
  const punished = students.filter(s =>
    s.isPunished && (s.studentId.includes(q) || s.name.includes(q) || s.grade.includes(q))
  );
  document.getElementById('punishedBody').innerHTML = punished.map(r => `
    <tr>
      <td>${r.studentId}</td><td>${r.name}</td><td>${r.age}</td>
      <td>${r.gender}</td><td>${r.grade}</td><td>${r.reason}</td>
    </tr>`).join('');
}

// 学生信息修改
function renderModify() {
  document.getElementById('mainArea').innerHTML = `
    <div class="card">
      <div class="controls">
        <input id="modq" placeholder="请输入学号进行精确查询" class="input-small">
        <button class="btn" onclick="queryForModify()">查询</button>
      </div>
      <div id="editArea"></div>
    </div>`;
}

function queryForModify() {
  const id = document.getElementById('modq').value.trim();
  if(!id) return alert('请输入学号');
  const s = students.find(x => x.studentId === id);
  if(!s) return alert('请输入正确的学号');

  document.getElementById('editArea').innerHTML = `
    <div>学号：${s.studentId}</div>
    <div>姓名：${s.name}</div>
    <div>年龄：${s.age}</div>
    <div>性别：${s.gender}</div>
    <div>年级：
      <select id="gradeSel">
        <option>前端2201</option><option>前端2202</option><option>网络2203</option>
      </select>
      <button class="btn" onclick="modifyField('grade')">修改</button>
    </div>
    <div>是否处分：
      <input type="checkbox" id="punishChk" ${s.isPunished ? 'checked' : ''}>
      <button class="btn" onclick="modifyField('punish')">修改</button>
    </div>
    <div>处分原因：
      <textarea id="reason" style="width:240px;height:80px">${s.reason || ''}</textarea>
      <button class="btn" onclick="modifyField('reason')">修改</button>
    </div>
    <div style="margin-top:8px">
      <button class="btn" onclick="modifyAll('${s.studentId}')">修改全部</button>
    </div>`;
}

function modifyField(field) {
  const id = document.getElementById('modq').value.trim();
  const s = students.find(x => x.studentId === id);
  if(!s) return;

  if(field === 'grade') s.grade = document.getElementById('gradeSel').value;
  if(field === 'punish') s.isPunished = document.getElementById('punishChk').checked;
  if(field === 'reason') s.reason = document.getElementById('reason').value;
  alert('修改成功');
}

function modifyAll(id) {
  const s = students.find(x => x.studentId === id);
  if(!s) return;
  s.grade = document.getElementById('gradeSel').value;
  s.isPunished = document.getElementById('punishChk').checked;
  s.reason = document.getElementById('reason').value;
  alert('全部修改成功');
}
