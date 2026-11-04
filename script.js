(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ---------- 진도 저장 ---------- */
var KEY='vibe-guide-checks-v1', mem={}, state={};
function load(){try{var r=localStorage.getItem(KEY);return r?JSON.parse(r):{}}catch(e){return mem}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){mem=state}}
state=load();

/* ---------- 프롬프트 데이터 ---------- */
var P=[
{id:'p-001',step:0,cat:'개념 이해',title:'쉬운 비유로 개념 듣기',text:`나는 코딩을 전혀 모르는 {{직업}}이야. 바이브 코딩이 무엇인지 {{직업}}의 업무에 빗대어 5문장 이내로 설명해 줘. 그리고 오늘 내가 알아야 할 용어 3개만 알려 줘.`,tip:'같은 이름의 빈칸은 한 번만 채우면 모두 바뀝니다.'},

{id:'p-010',step:1,cat:'기본 틀',title:'5요소 프롬프트 기본 틀',text:`중소기업 수출 담당자가 쓰는 수출 준비도 자가진단 웹페이지를 만들어 줘.
기능: 질문 10개, 체크하면 점수와 진행률 막대가 바뀌고, 마지막에 등급(준비 부족/보통/우수)과 다음 할 일을 보여줘.
디자인: 파란색 계열의 깔끔한 모던 디자인, 스마트폰에서도 보기 좋게.
형식: CSS와 JavaScript를 포함한 단일 HTML 파일로, 코드 전체를 한 번에 줘.`,tip:'누가 쓰는지, 무엇을, 기능, 디자인, 형식 다섯 가지가 모두 들어 있는지 확인하세요.'},
{id:'p-011',step:1,cat:'첫 페이지',title:'내 소개 페이지',text:`나는 {{직업/소속}}이고 {{주요 분야}}를 상담합니다. 방문자에게 나를 소개하는 한 페이지짜리 웹페이지를 만들어 줘.
구성: 상단 이름과 한 줄 소개 / 하는 일 3가지 / 경력·자격 요약 / 문의 방법(이메일만 표시).
디자인은 신뢰감 있는 남색과 흰색, 모던하고 여백이 넉넉하게. 단일 HTML 파일로 줘.`,tip:'연락처는 이메일만 넣습니다. 전화번호는 넣지 마세요.'},
{id:'p-012',step:1,cat:'첫 페이지',title:'명함형 소개 카드',text:`명함처럼 한 화면에 들어오는 모바일용 소개 카드 페이지를 만들어 줘.
이름 {{이름}}, 직함 {{직함}}, 이메일 {{이메일}}, 홈페이지 {{홈페이지 주소}}. 이메일은 복사 버튼으로 복사되게 해 줘. 단일 HTML 파일로.`},

{id:'p-020',step:2,cat:'수정 요청',title:'글자 크기와 배경색 바꾸기',text:`제목 글자를 지금보다 20% 크게 하고, 배경색을 아주 연한 회색으로 바꿔 줘. 다른 부분은 그대로 두고 전체 코드를 다시 줘.`,tip:'한 번에 한 가지만 요청하는 것이 원칙입니다.'},
{id:'p-021',step:2,cat:'수정 요청',title:'섹션 추가',text:`'하는 일' 섹션 아래에 '고객 후기' 섹션을 추가해 줘. 후기는 예시 문구 3개로 채우고, 실제 후기로 바꿀 수 있게 수정 위치를 주석으로 표시해 줘.`},
{id:'p-022',step:2,cat:'수정 요청',title:'모바일 화면 고치기',text:`스마트폰 화면(폭 375px)에서 글자가 너무 작고 버튼이 겹쳐 보여. 모바일에서도 읽기 편하게 레이아웃을 고쳐 줘.`},
{id:'p-023',step:2,cat:'수정 요청',title:'말투 바꾸기',text:`전체 문장을 딱딱한 보고서 말투에서 친근하지만 전문적인 말투로 바꿔 줘. 숫자와 고유명사는 그대로 유지해 줘.`},
{id:'p-024',step:2,cat:'수정 요청',title:'제안만 먼저 받기',text:`지금 페이지에서 바꾸면 좋을 점 3가지를 먼저 제안만 해 줘. 내가 고른 것만 적용해 줘.`},
{id:'p-025',step:2,cat:'이해하기',title:'코드 구조 설명 듣기',text:`방금 만든 코드가 어떤 구조인지 비전공자에게 설명하듯 설명해 줘. 파일의 각 부분이 화면의 어디에 해당하는지 알려 줘.`},
{id:'p-026',step:2,cat:'이해하기',title:'내 프롬프트 진단받기',text:`내가 한 요청 중 어떤 표현이 모호해서 결과가 기대와 달랐는지 분석하고, 더 좋은 프롬프트로 고쳐 줘.`},

{id:'p-030',step:3,cat:'기능 추가',title:'체크리스트와 진행률',text:`체크리스트 항목 12개를 만들어 줘. 체크할 때마다 상단에 '12개 중 N개 완료(N%)' 진행률 막대가 바뀌고, 새로고침해도 체크 상태가 유지되게 해 줘.`},
{id:'p-031',step:3,cat:'기능 추가',title:'손익분기점 계산기',text:`손익분기점 계산기를 만들어 줘. 입력: 판매가, 단위당 변동비, 월 고정비. 출력: 손익분기 판매량, 손익분기 매출액, 목표 이익을 낼 판매량. 숫자는 천 단위 쉼표로 표시하고, 빈칸이나 음수를 넣으면 안내 문구를 보여줘.`,tip:'아래 검수표의 예시 숫자로 결과를 대조해 보세요.'},
{id:'p-032',step:3,cat:'기능 추가',title:'환율 환산 간이 계산기',text:`입력한 금액에 환율을 곱해 원화로 환산하는 간이 계산기를 만들어 줘. 환율은 사용자가 직접 입력하게 하고, '실제 거래에는 은행 고시환율을 확인하세요'라는 안내를 결과 아래에 넣어 줘.`},
{id:'p-033',step:3,cat:'기능 추가',title:'복사·초기화 버튼',text:`방금 만든 계산기에 '결과 복사' 버튼과 '초기화' 버튼을 추가해 줘.`},

{id:'p-040',step:4,cat:'Claude Code',title:'폴더 파악하기 (읽기만)',text:`이 폴더에 어떤 파일들이 있는지 보고, 프로젝트가 무엇인지 3줄로 설명해 줘. 아직 아무것도 수정하지 마.`},
{id:'p-041',step:4,cat:'Claude Code',title:'계획을 먼저 보고 파일 분리',text:`수출 준비도 자가진단 페이지를 index.html, style.css, script.js 세 파일로 나눠서 만들어 줘. 먼저 만들 계획을 보여 주고, 내가 승인하면 진행해 줘.`},
{id:'p-042',step:4,cat:'Claude Code',title:'작업 규칙 파일 만들기',text:`이 폴더의 규칙을 CLAUDE.md 파일로 저장해 줘: 한국어로 답하기 / 파일은 index.html, style.css, script.js만 사용 / 외부 서비스에 개인정보 전송 금지 / 수정 전에 계획을 먼저 보여주기.`},
{id:'p-043',step:4,cat:'설정 파일',type:'code',title:'CLAUDE.md 예시',text:`# 프로젝트 규칙
- 사용자는 코딩 초보자다. 모든 설명은 한국어로, 쉬운 말로 한다.
- 파일은 index.html, style.css, script.js 세 개만 쓴다.
- 수정하기 전에 무엇을 바꿀지 먼저 요약하고 승인을 받는다.
- 개인정보(전화번호, 주민번호, 고객 회사 정보)를 코드나 예시에 넣지 않는다.
- 연락처는 이메일만 표시한다.
- 수정할 때마다 무엇을 바꿨는지 3줄로 알려 준다.`},
{id:'p-044',step:4,cat:'Claude Code',title:'방금 수정 되돌리기',text:`방금 수정한 내용을 되돌리고 싶어. 무엇이 바뀌었는지 쉬운 말로 요약하고, 직전 상태로 복원해 줘.`},

{id:'p-050',step:5,cat:'배포',title:'GitHub에 올릴 준비',text:`이 폴더를 GitHub에 올릴 수 있게 준비해 줘. 저장소 이름은 {{저장소 이름}}으로 제안하고, GitHub Pages로 공개하는 순서를 내가 따라 할 수 있게 한 단계씩 알려 줘. 비밀번호는 내가 직접 입력할게.`,tip:'저장소 이름은 영어 소문자와 하이픈을 권장합니다. 예: my-first-web'},

{id:'p-060',step:6,cat:'업무 도구',title:'경영 진단 레이더 차트',text:`{{업종}} 중소기업의 경영 진단 질문 15개를 만들어 줘. 영역은 재무, 마케팅, 인사, 생산, 수출 5가지이고 각 영역 3문항씩, 예/아니오로 답하게. 영역별 점수를 레이더 차트로 보여 주는 단일 HTML 페이지로 만들어 줘.`},
{id:'p-061',step:6,cat:'업무 도구',title:'지원사업 비교표',text:`정부 지원사업 3개를 비교하는 표 페이지를 만들어 줘. 열: 사업명, 지원 대상, 지원 한도, 신청 기간, 확인 링크. 내가 내용을 직접 채울 수 있게 비워 두고, 검색창과 정렬 기능을 넣어 줘. 수치와 기간은 반드시 공고문에서 확인하라는 안내를 상단에 넣어 줘.`},
{id:'p-062',step:6,cat:'업무 도구',title:'컨설팅 보고서 목차 초안',text:`컨설팅 결과 보고서의 목차 초안을 만들어 줘. 대상은 {{업종}} 중소기업, 주제는 {{주제}}. 현황 분석 / 문제점 / 개선 방안 / 실행 계획 / 기대 효과 구조로, 각 항목에 들어갈 내용을 한 줄씩 적어 줘.`},
{id:'p-063',step:6,cat:'업무 도구',title:'상담 신청 안내 페이지',text:`상담 신청 안내 페이지를 만들어 줘. 상담 분야 3가지, 진행 절차 4단계, 자주 묻는 질문 5개를 넣고, 문의는 이메일 주소를 화면에 보여주고 복사 버튼을 달아 줘. 전화번호는 넣지 마.`},

{id:'p-070',step:7,cat:'오류 해결',title:'버튼이 반응 없을 때',text:`버튼을 눌러도 아무 반응이 없어. 기대한 동작은 {{기대 동작}}이고, 실제로는 {{실제 상황}}이야. 원인을 쉬운 말로 설명하고 고친 전체 코드를 줘.`},
{id:'p-071',step:7,cat:'오류 해결',title:'오류 문구 해석 요청',text:`아래는 브라우저에서 F12를 눌러 나온 오류 문구야. 이 오류의 뜻과 해결 방법을 코딩을 모르는 사람도 이해하게 설명해 줘.
{{오류 문구 붙여넣기}}`},
{id:'p-072',step:7,cat:'오류 해결',title:'계산 결과가 틀릴 때',text:`계산 결과가 틀려. 입력값은 {{입력값}}, 내가 기대한 결과는 {{기대 결과}}인데 화면에는 {{화면에 나온 값}}이 나와. 계산식을 단계별로 보여 주고 수정해 줘.`},

{id:'p-r1',step:'R',cat:'실습 7',title:'① 입력·편집 화면 만들기',text:`컨설팅 결과보고서를 작성하는 웹페이지를 만들어 줘. 입력 영역: 상단 정보(기업명, 사업분야, 상담일자, 회차, 상담분야) / 기업의 애로사항 현황(긴 글) / 문제점 분석 및 진단(소제목+설명, 항목 추가·삭제 가능) / 컨설팅 내용(번호별 소주제와 세부 항목, 추가·삭제 가능) / 향후 추진계획(1단계부터 추가 가능) / 현장사진 올리기 / 컨설턴트 성명과 서명 이미지. 고객 연락처 입력칸은 만들지 마. 입력 내용은 브라우저 안에서만 처리하고 어디로도 전송하지 마. 단일 HTML 파일로 줘.`},
{id:'p-r2',step:'R',cat:'실습 7',title:'② 양식 분석 (PDF 첨부 후)',text:`첨부한 결과보고서 양식의 표 구성을 분석해서, 영역별 칸 이름과 칸에 들어가는 글의 형식(문체, 분량, 번호 매기기)을 정리해 줘. 고객의 이름과 연락처는 정리에서 제외해 줘.`,tip:'양식 PDF에 고객 정보가 있다면 가리거나 지운 사본을 올리세요.'},
{id:'p-r3',step:'R',cat:'실습 7',title:'③ 초안 요청 프롬프트 자동 생성',text:`상단 정보와 참고자료 입력칸의 내용을 합쳐서 아래 틀의 프롬프트를 만들고, '복사' 버튼을 달아 줘.
---
너는 중소기업 수출 컨설턴트의 보고서 작성 보조자다. 아래 [참고자료]만 근거로 결과보고서 초안을 쓴다. 자료에 없는 수치, 기관명, 금액은 지어내지 말고 '[확인 필요]'로 표시한다. 문체는 '~하였음', '~필요함'으로 끝나는 보고서체로 한다. 출력은 아래 구분 표식을 그대로 사용한다.
[애로사항] 2~3문장
[문제점] 소제목 + 설명 3~4개
[컨설팅내용] 1., 2., 3. 소주제별 세부 안내
[향후계획] 1단계~4단계
[참고자료]
(여기에 입력한 참고자료)
---`},
{id:'p-r4',step:'R',cat:'실습 7',title:'④ 답변을 칸별로 나누기',text:`Claude의 답변을 붙여넣는 입력창과 '칸에 채우기' 버튼을 만들어 줘. 답변 안의 [애로사항], [문제점], [컨설팅내용], [향후계획] 표식을 기준으로 내용을 나눠서 각 입력칸에 자동으로 넣고, 표식이 없거나 순서가 다르면 어떤 부분이 비었는지 안내해 줘.`},
{id:'p-r5',step:'R',cat:'실습 7',title:'⑤ 문서 파일로 내려받기',text:`입력한 내용을 원본 양식처럼 제목, 상단 정보 표, 영역별 칸이 있는 표 구성의 Word 파일(.docx)로 내려받는 버튼을 추가해 줘. 파일 이름은 '컨설팅결과보고서_상담일자'로 하고, 사진과 서명 이미지도 들어가게 해 줘. 문서는 브라우저 안에서만 만들어 줘. 인쇄해서 PDF로 저장하기 좋은 미리보기 화면도 함께 만들어 줘.`,tip:'내려받기는 내 컴퓨터에서 연 파일이나 배포한 주소에서 동작합니다. Claude 화면 안의 미리보기에서는 막힐 수 있습니다.'},
{id:'p-r6',step:'R',cat:'실습 7',title:'⑥ 시험과 보완',text:`가상의 초보 수출기업 사례(자동차부품 제조, 첫 수출 준비)로 샘플 데이터를 한 건 채워 넣는 '예시 불러오기' 버튼을 추가해 줘. 그리고 입력이 비어 있을 때 내려받기를 누르면 비어 있는 칸을 알려 줘.`}
];
var PMAP={};P.forEach(function(p){PMAP[p.id]=p});

/* ---------- 단계 데이터 ---------- */
var STEPS=[
{id:'step-0',n:0,title:'준비와 기본 개념',time:20,tool:'Claude 웹·앱',out:'작업 폴더, 로그인 완료',
 goal:'바이브 코딩이 무엇인지 알고, 실습할 환경을 갖춥니다.',
 prepare:['노트북과 인터넷 연결','Claude 계정 (claude.ai에서 가입 또는 로그인)','메모장(Windows) 또는 텍스트 편집기(Mac)'],
 concepts:['웹페이지의 시작은 <b>HTML 파일 하나</b>입니다. 메모장에 코드를 저장하고 브라우저로 열면 웹페이지가 됩니다.','나는 코드를 쓰는 사람이 아니라 <b>무엇을 만들지 정하고 결과를 검수하는 기획자</b>입니다.','결과가 마음에 들지 않으면 다시 요청하면 됩니다. 한 번에 완벽할 필요가 없습니다.'],
 steps:['<code>claude.ai</code>에 접속해 로그인합니다. 휴대폰보다 노트북 화면에서 진행하세요.','바탕화면에 <code>my-first-web</code> 폴더를 만듭니다. 앞으로 모든 파일은 여기에 저장합니다.','파일 확장자가 보이도록 설정합니다. Windows는 탐색기 상단의 보기 메뉴에서 파일 확장명을 켜고, Mac은 Finder 설정의 고급 탭에서 모든 파일 확장자 보기를 켭니다. 메뉴 모양이 다르면 "파일 확장명 표시 방법"으로 검색하세요.','아래 첫 프롬프트를 Claude에 붙여넣고 답을 읽어 봅니다.'],
 prompts:['p-001'],
 checks:['my-first-web 폴더가 바탕화면에 있다','Claude에 로그인되어 있다','파일 이름 끝의 확장자(.txt 등)가 보인다','바이브 코딩을 내 말로 한두 문장으로 설명할 수 있다'],
 stuck:[{q:'확장자 설정을 못 찾겠어요',a:'확장자가 보이지 않아도 진행은 가능하지만, 저장할 때 .html이 제대로 붙었는지 확인하기 어렵습니다. 운영체제 이름과 "파일 확장자 표시"로 검색하거나 Claude에게 내 운영체제 버전을 알려 주고 물어보세요.'},{q:'로그인이 안 돼요',a:'이메일 인증 메일이 스팸함에 있는지 확인하고, 다른 브라우저(Chrome 등)로 다시 시도해 보세요.'}]},

{id:'step-1',n:1,title:'첫 웹페이지 만들기',time:40,tool:'Claude 채팅',out:'소개·명함 페이지(profile.html)',
 goal:'한 번의 요청으로 HTML 파일을 만들어 저장하고, 브라우저에서 엽니다.',
 prepare:['Step 0에서 만든 my-first-web 폴더','내 소개에 쓸 정보(이름, 하는 일, 경력 요약, 이메일)'],
 steps:['아래 프롬프트의 노란 빈칸을 내 정보로 바꿔 Claude에 보냅니다. 프롬프트 상자의 <b>내 내용으로 바꾸기</b> 버튼을 쓰면 편합니다.','Claude가 코드를 보여 주면 코드 블록의 복사 버튼으로 <b>전체</b>를 복사합니다. 미리보기가 함께 나오면 모양부터 확인합니다.','메모장을 열어 붙여넣고 다른 이름으로 저장합니다. 폴더는 <code>my-first-web</code>, 파일 이름은 <code>profile.html</code>, 파일 형식은 모든 파일, 인코딩은 UTF-8로 합니다.','저장한 <code>profile.html</code>을 더블클릭해 브라우저에서 엽니다.','마음에 들지 않는 부분을 한 가지씩 Claude에게 고쳐 달라고 합니다. 고친 코드를 같은 파일에 덮어쓰고 브라우저에서 새로고침합니다.'],
 extra:[{label:'확장 아이디어',html:'<ul><li>사진 넣기: 사진 파일을 같은 폴더에 두고 파일 이름을 Claude에게 알려 줍니다.</li><li>경력·자격 요약, 컨설팅 분야 섹션 추가</li><li>연락처는 이메일만 표시합니다.</li></ul>'}],
 prompts:['p-010','p-011','p-012'],
 checks:['내 이름과 소개가 보이는 페이지가 브라우저에서 열린다','파일 이름이 profile.html이고 my-first-web 폴더에 있다','Claude에게 수정 요청을 1번 이상 해 봤다'],
 stuck:[{q:'한글이 깨져 보여요',a:'메모장에서 저장할 때 인코딩을 UTF-8로 선택하세요. 이미 저장했다면 다른 이름으로 저장 화면에서 인코딩을 바꿔 다시 저장합니다.'},{q:'더블클릭하면 메모장으로 열려요',a:'파일 이름이 <code>profile.html.txt</code>로 저장됐을 가능성이 큽니다. 확장자가 보이게 설정하고, 저장할 때 파일 형식을 모든 파일로 선택했는지 확인하세요.'},{q:'화면이 비어 있어요',a:'코드를 일부만 복사했거나 Claude의 답이 중간에 끊겼을 수 있습니다. "코드가 끊겼어. 처음부터 전체 코드를 다시 줘"라고 요청하세요.'}]},

{id:'step-2',n:2,title:'프롬프트 설계와 반복 수정',time:40,tool:'Claude 채팅',out:'개선된 페이지, 내 프롬프트 3개',
 goal:'작게 나눠 요청하고, 결과를 보고 고치는 습관을 만듭니다.',
 prepare:['Step 1의 profile.html'],
 concepts:['한 번에 <b>하나만</b> 요청합니다.','요청 끝에 <b>"다른 부분은 그대로 두고 전체 코드를 다시 줘"</b>를 붙입니다.','고치기 전 파일은 <code>profile_v1.html</code>처럼 복사본으로 남겨 둡니다.'],
 steps:['같은 페이지에 대해 색상, 글자 크기, 섹션 순서, 모바일 화면, 말투 순서로 한 번에 하나씩 수정을 요청합니다.','아래 프롬프트 빌더로 5요소를 채워 새 요청을 만들어 봅니다.','모호한 요청과 구체적인 요청의 결과를 나란히 비교합니다.','결과가 좋았던 프롬프트 3개를 메모장에 모아 둡니다.'],
 builder:true,
 extra:[{label:'모호 vs 구체',html:'<div class="scroll"><table class="tbl"><thead><tr><th>모호한 요청</th><th>구체적인 요청</th></tr></thead><tbody><tr><td>좀 더 예쁘게 해 줘</td><td>배경을 연한 회색으로, 제목은 진한 남색으로, 버튼은 둥근 모서리로 바꿔 줘</td></tr><tr><td>계산기 만들어 줘</td><td>판매가, 변동비, 고정비를 입력하면 손익분기 판매량을 보여주는 계산기를 만들어 줘</td></tr><tr><td>고쳐 줘</td><td>버튼을 눌러도 결과가 안 나와. 기대한 동작은 결과 표시이고, 실제로는 반응이 없어</td></tr></tbody></table></div>'}],
 prompts:['p-020','p-021','p-022','p-023','p-024','p-025','p-026'],
 checks:['수정 요청 5회 이상 성공했다','모호한 요청과 구체적인 요청의 결과를 비교해 봤다','5요소 빌더로 만든 프롬프트를 1개 이상 썼다','좋은 프롬프트 3개를 메모해 두었다'],
 stuck:[{q:'다른 부분까지 바뀌어 버려요',a:'요청에 "다른 부분은 그대로 두고"를 넣고, 바꿀 위치를 섹션 이름으로 지정하세요.'},{q:'대화가 길어지면 엉뚱한 답을 해요',a:'새 대화를 열고 지금의 전체 코드를 붙여넣은 뒤 이어서 요청하세요.'},{q:'이전 버전으로 돌아가고 싶어요',a:'수정할 때마다 파일을 복사해 <code>profile_v1.html</code>, <code>profile_v2.html</code>처럼 남겨 두면 언제든 돌아갈 수 있습니다.'}]},

{id:'step-3',n:3,title:'기능 추가: 체크리스트와 계산기',time:60,tool:'Claude 채팅',out:'동작하는 도구 1개',
 goal:'버튼, 입력, 계산처럼 움직이는 기능을 넣고 직접 검수합니다.',
 prepare:['Step 2까지 익힌 5요소와 수정 요령','계산기를 고를 경우 엑셀이나 계산기(검수용)'],
 steps:['만들 도구를 고릅니다. 수출 준비도 체크리스트 또는 손익분기점 계산기를 권합니다.','아래 프롬프트로 요청하고 <code>tool.html</code>로 저장해 엽니다.','다양한 값을 직접 넣어 시험합니다. 아래 검수표의 숫자와 결과를 대조하세요.','틀린 값은 입력값, 기대값, 화면에 나온 값을 그대로 적어 고쳐 달라고 합니다.','빈칸과 음수를 넣었을 때 안내 문구가 나오는지 확인하고, 없으면 추가를 요청합니다.'],
 extra:[{label:'검수표',html:'<p>계산기는 결과가 맞는지 사람이 확인해야 합니다. 아래 예시값을 넣어 보세요.</p><div class="scroll"><table class="tbl"><thead><tr><th>입력</th><th>계산식</th><th class="num">기대 결과</th></tr></thead><tbody><tr><td>판매가 10,000 / 변동비 6,000 / 고정비 2,000,000</td><td>고정비 ÷ (판매가 − 변동비)</td><td class="num">손익분기 판매량 500개, 매출 5,000,000원</td></tr><tr><td>위 입력에 목표이익 500,000 추가</td><td>(고정비 + 목표이익) ÷ (판매가 − 변동비)</td><td class="num">625개</td></tr><tr><td>1,000달러 / 예시 환율 1,400</td><td>금액 × 환율</td><td class="num">1,400,000원</td></tr></tbody></table></div><p class="note"><b>주의</b> 환율 1,400은 연습용 예시 값입니다. 실제 거래에는 은행 고시환율을 확인하세요.</p>'}],
 prompts:['p-030','p-031','p-032','p-033'],
 checks:['기능이 정상 동작한다','검수표의 값과 결과가 일치한다','빈칸이나 음수를 넣으면 안내 문구가 나온다','새로고침 후의 동작(유지 또는 초기화)을 이해했다'],
 stuck:[{q:'계산 결과가 틀려요',a:'입력값, 기대값, 화면 값을 그대로 적어 Claude에게 보여 주고 "계산식을 단계별로 보여 줘"라고 요청하세요. 아래 Step 7의 계산 오류 프롬프트를 쓰면 됩니다.'},{q:'새로고침하면 체크 상태가 사라져요',a:'"체크 상태를 브라우저에 저장해서 새로고침해도 유지되게 해 줘"라고 요청하세요.'},{q:'숫자에 쉼표가 안 들어가요',a:'"결과 숫자는 천 단위 쉼표로 표시해 줘"를 요청하세요.'}]},

{id:'step-4',n:4,title:'Claude Code 입문',time:60,tool:'Claude Code',out:'로컬 폴더의 프로젝트',
 goal:'내 컴퓨터의 폴더에서 Claude가 파일을 직접 만들고 고치게 합니다.',
 prepare:['my-first-web 폴더(Step 3의 tool.html 포함)','Claude Code를 쓸 수 있는 계정','터미널(Windows는 PowerShell, Mac은 터미널)'],
 steps:['Step 3의 도구 파일을 <code>index.html</code>로 이름을 바꿔 작업 폴더에 둡니다.','Claude Code를 설치합니다. 설치 방법과 이용 가능한 요금제는 바뀔 수 있으니 <a href="https://docs.claude.com" target="_blank" rel="noopener">공식 문서</a>의 안내를 따르세요.','터미널을 열어 작업 폴더로 이동한 뒤 <code>claude</code>를 입력해 실행합니다. 이동 예: <code>cd Desktop/my-first-web</code>','먼저 읽기만 시킵니다. 폴더 내용을 설명해 달라고 요청하세요.','계획을 먼저 세우게 하고, 내가 승인한 뒤에 수정시킵니다.','한 번에 한 가지씩 수정 요청하고, 브라우저에서 새로고침해 확인합니다.','규칙은 <code>CLAUDE.md</code>에 기록해 매번 반복해서 말하지 않습니다.'],
 extra:[{label:'채팅과 Code',html:'<div class="scroll"><table class="tbl"><thead><tr><th>구분</th><th>Claude 채팅</th><th>Claude Code</th></tr></thead><tbody><tr><td>적합한 일</td><td>아이디어, 첫 초안, 질문, 원인 설명</td><td>여러 파일 작업, 수정 반복, 배포 준비</td></tr><tr><td>결과 전달</td><td>코드를 복사해 직접 저장</td><td>폴더의 파일이 바로 생성·수정</td></tr><tr><td>입문 난이도</td><td>낮음</td><td>중간 (설치와 폴더 개념 필요)</td></tr><tr><td>이 과정에서</td><td>Step 1~3</td><td>Step 4~7</td></tr></tbody></table></div>'},{label:'막힐 때 표',html:'<div class="scroll"><table class="tbl"><thead><tr><th>증상</th><th>원인</th><th>해결</th></tr></thead><tbody><tr><td>실행 명령이 인식되지 않음</td><td>설치 후 터미널을 다시 열지 않음</td><td>터미널을 닫았다가 다시 열기</td></tr><tr><td>엉뚱한 폴더에서 작업함</td><td>실행 위치가 다름</td><td>"지금 작업 중인 폴더 경로를 알려 줘"라고 묻기</td></tr><tr><td>수정이 마음에 들지 않음</td><td>요청이 너무 큼</td><td>"방금 수정을 되돌리고 한 가지만 다시 해 줘"</td></tr><tr><td>화면에 변화가 없음</td><td>브라우저를 새로고침하지 않음</td><td>저장 확인 후 Ctrl+F5</td></tr></tbody></table></div>'}],
 prompts:['p-040','p-041','p-042','p-043','p-044'],
 checks:['Claude Code가 내 폴더에서 실행된다','읽기만 시키는 요청이 성공했다','계획을 승인한 뒤 수정이 반영됐다','Claude Code로 수정 요청 3회 성공했다','CLAUDE.md를 만들었다'],
 stuck:[{q:'claude 명령이 인식되지 않아요',a:'설치 후 터미널 창을 닫았다가 새로 여세요. 그래도 안 되면 공식 문서의 설치 안내를 다시 확인하세요.'},{q:'Claude가 한꺼번에 너무 많이 바꿔요',a:'수정 범위를 파일이나 섹션 이름으로 한정하고, "계획을 먼저 보여 주고 승인받아"를 규칙에 넣으세요.'}]},

{id:'step-5',n:5,title:'배포와 공유',time:40,tool:'Claude Code, GitHub',out:'공개 주소(URL)',
 goal:'만든 페이지를 누구나 열 수 있는 주소로 공개합니다.',
 prepare:['index.html이 있는 작업 폴더','GitHub 계정 (github.com에서 가입)'],
 steps:['GitHub에 가입합니다. 비밀번호는 내가 직접 입력하고 Claude에게 알려 주지 않습니다.','Claude Code에게 폴더를 GitHub에 올릴 준비를 요청하고, 안내하는 명령을 승인하며 따라 합니다. 로그인 화면은 직접 진행합니다.','메인 파일 이름이 <code>index.html</code>인지 확인합니다.','GitHub의 저장소 화면에서 Settings → Pages로 들어가 브랜치를 <code>main</code>, 폴더를 root로 선택하고 저장합니다.','몇 분 뒤 <code>https://사용자이름.github.io/저장소이름/</code> 주소로 접속해 확인합니다.','스마트폰에서도 열어 보고, 명함·이메일 서명·블로그에 주소를 넣습니다.'],
 extra:[{label:'주의',html:'<p class="note"><b>공개 저장소</b>의 파일은 누구나 볼 수 있습니다. 개인정보, 고객 자료, 비밀번호, API 키는 파일에 넣지 마세요.</p>'}],
 prompts:['p-050'],
 checks:['저장소에 파일이 올라가 있다','공개 주소로 접속하면 페이지가 열린다','스마트폰에서도 정상으로 보인다','주소를 한 곳 이상에 넣었다'],
 stuck:[{q:'주소로 들어가니 404가 떠요',a:'설정 직후에는 몇 분 걸릴 수 있습니다. Pages 설정에서 브랜치와 폴더를 다시 확인하고, 메인 파일 이름이 index.html인지 보세요. 무료 계정은 보통 공개 저장소에서 Pages를 씁니다.'},{q:'수정했는데 공개 페이지가 그대로예요',a:'Claude Code에게 "수정한 내용을 GitHub에 올려 줘"라고 요청하고, 몇 분 뒤 Ctrl+F5로 새로고침하세요.'}]},

{id:'step-6',n:6,title:'경영지도사 실전 프로젝트',time:90,tool:'Claude 채팅, Claude Code',out:'졸업 프로젝트 1개',
 goal:'실제 상담과 강의에 쓸 도구를 처음부터 배포까지 혼자 만듭니다.',
 prepare:['Step 1~5를 마친 상태','가상 사례 데이터 (실제 고객 정보는 쓰지 않습니다)'],
 steps:['아래 표에서 프로젝트를 하나 고릅니다.','기획 메모 5줄을 씁니다. 누가 쓰고, 무엇을 입력하고, 무엇을 보여줄지 정합니다.','5요소 프롬프트로 1차 제작합니다. (Claude 채팅)','가상 사례 1건을 넣어 결과가 맞는지 대조합니다.','Claude Code로 파일을 나누고 개선합니다.','배포한 뒤 가상 고객에게 시연하고 개선점 3가지를 적습니다.'],
 extra:[{label:'프로젝트 7선',html:'<div class="scroll"><table class="tbl"><thead><tr><th>프로젝트</th><th>상담·강의에서의 쓰임</th><th>핵심 기능</th><th>난이도</th><th>소요</th></tr></thead><tbody><tr><td>상담 안내·명함 페이지</td><td>첫 만남과 홍보</td><td>소개, 분야, 이메일 표시</td><td>★</td><td>30분</td></tr><tr><td>수출 준비도 자가진단</td><td>초기 상담에서 현황 파악</td><td>질문 체크, 점수·등급, 다음 할 일</td><td>★★</td><td>60분</td></tr><tr><td>손익분기점·마진 계산기</td><td>가격·원가 상담</td><td>입력값 계산, 결과 복사</td><td>★★</td><td>60분</td></tr><tr><td>환율·관세 간이 계산기</td><td>수출 가격 시뮬레이션</td><td>환율·세율 직접 입력, 환산</td><td>★★</td><td>60분</td></tr><tr><td>경영 진단 레이더 차트</td><td>5개 영역 진단 결과 시각화</td><td>문항 점수, 차트, 영역별 코멘트</td><td>★★★</td><td>90분</td></tr><tr><td>지원사업 비교표</td><td>정책자금·지원사업 안내</td><td>검색, 정렬, 링크</td><td>★★★</td><td>90분</td></tr><tr><td><a href="#report">컨설팅 결과보고서 자동 작성기</a></td><td>상담 직후 결과보고서 작성·제출</td><td>참고자료 입력, 초안 생성, 편집, 문서 다운로드</td><td>★★★★</td><td>120분</td></tr></tbody></table></div>'},{label:'적용 시 지킬 점',html:'<ul><li>법령, 세율, 한도, 기간 같은 수치는 도구가 확정해 주는 값이 아니므로 화면에 <b>출처 확인 안내</b>를 넣습니다.</li><li>고객의 회사명과 재무 자료는 입력하지 않거나, 브라우저 안에서만 계산하고 저장하지 않게 합니다.</li><li>진단 결과는 참고용이며 최종 판단은 지도사가 한다는 문구를 넣습니다.</li></ul><p><a class="btn pri" href="#report">심화 과제: 보고서 자동 작성기 만들기</a></p>'}],
 prompts:['p-060','p-061','p-062','p-063'],
 checks:['프로젝트 하나를 골라 기획 메모를 썼다','가상 사례로 결과를 대조해 맞는 것을 확인했다','공개 주소로 배포했다','가상 고객에게 시연하고 개선점 3가지를 적었다'],
 stuck:[{q:'무엇을 만들어야 할지 모르겠어요',a:'가장 최근 상담에서 반복해서 설명했던 내용을 떠올려 보세요. 같은 설명을 자주 한다면 그것을 체크리스트나 계산기로 만들 수 있습니다.'},{q:'진단 점수 기준을 어떻게 정하죠?',a:'Claude에게 점수 구간 안을 3가지 제안받은 뒤 내 경험에 맞게 직접 고르세요. 기준의 최종 판단은 지도사의 몫입니다.'}]},

{id:'step-7',n:7,title:'오류 해결·보안·유지보수',time:30,tool:'Claude 채팅, Claude Code',out:'점검 체크리스트 완료',
 goal:'막혔을 때 스스로 해결하고, 안전하게 운영하는 습관을 만듭니다.',
 prepare:['Step 6의 졸업 프로젝트'],
 steps:['브라우저에서 <b>F12</b> 키를 눌러 개발자 도구를 열고 Console 탭의 빨간 오류 문구를 확인합니다.','오류 문구를 그대로 복사해 아래 프롬프트로 Claude에게 해결을 요청합니다.','일부러 오류를 만들어 보세요. 파일의 한 글자를 지우고 오류가 어떻게 보이는지 확인한 뒤 되돌립니다.','체크포인트의 점검 항목을 하나씩 확인합니다.','폴더를 통째로 복사해 백업하고, GitHub에 최신본이 올라가 있는지 봅니다.','한 달에 한 번 링크와 수치가 최신인지 점검합니다.'],
 prompts:['p-070','p-071','p-072'],
 checkTitle:'점검 체크리스트',
 checks:['페이지에 휴대폰 번호, 주민번호, 고객 회사 정보가 없다','이메일 외의 개인 연락처가 노출되지 않는다','코드에 비밀번호나 API 키가 없다','계산 결과를 실제 사례 1건과 대조했다','법령·수치에는 출처 확인 안내가 있다','스마트폰과 다른 브라우저에서 정상 동작한다','파일을 백업했고 GitHub에 최신본이 올라가 있다','참고용 면책 문구가 들어 있다'],
 stuck:[{q:'F12를 눌러도 아무것도 안 나와요',a:'노트북에 따라 Fn 키와 함께 눌러야 할 수 있습니다. 또는 브라우저 메뉴에서 개발자 도구를 열 수 있습니다.'},{q:'오류 문구가 너무 길어요',a:'빨간색으로 표시된 첫 줄부터 몇 줄만 복사해도 Claude가 원인을 찾는 데 충분한 경우가 많습니다.'}]}
];

var REPORT={id:'report',n:'7',title:'컨설팅 결과보고서 자동 작성기',time:120,tool:'Claude 채팅, Claude Code',out:'가상 사례로 완성한 보고서 작성 웹',kick:'실습 7 · 심화',
 goal:'상담 내용과 참고자료를 넣으면 정해진 양식의 결과보고서 초안이 칸별로 채워지고, 컨설턴트가 추가·수정·보완한 뒤 Word 문서 등으로 내려받는 웹을 만듭니다. 난이도가 높아 90분 수업과 30분 과제로 나눠 진행해도 좋습니다.',
 prepare:['Step 6까지 마친 상태','공공기관 전문가 컨설팅 결과보고서 양식 PDF (고객 정보는 가린 사본)','가상 사례 1건 (예: 자동차부품 제조, 첫 수출 준비 기업)'],
 steps:['Claude 채팅에서 양식 구조를 말로 설명하고 입력 화면을 1차 제작합니다.','양식 PDF를 첨부해 칸 구성이 맞는지 확인하고 고칩니다.','초안 요청용 프롬프트를 자동으로 만드는 기능을 추가합니다.','붙여넣은 답변을 구분 표식 기준으로 칸별로 나누는 기능을 추가합니다.','항목 추가·삭제와 브라우저 자동 저장 기능을 추가합니다.','미리보기와 .docx 내려받기 기능을 추가합니다.','Claude Code로 파일을 분리하고 가상 사례 1건으로 시험한 뒤 배포합니다.'],
 extra:[
 {label:'양식 구조',html:'<div class="scroll"><table class="tbl"><thead><tr><th>양식 영역</th><th>담기는 내용</th><th>웹 입력 방식</th></tr></thead><tbody><tr><td>상단 정보</td><td>상담 기업(기업명, 사업분야), 컨설턴트(성명, 상담일자, 회차, 상담분야)</td><td>입력칸. 고객 연락처 칸은 만들지 않음</td></tr><tr><td>기업의 애로사항 현황</td><td>기업 상황과 요청 사항 2~3문장</td><td>긴 글 입력</td></tr><tr><td>문제점 분석 및 진단</td><td>소제목과 설명으로 된 문제점 3~4개</td><td>항목 추가·삭제</td></tr><tr><td>컨설팅 내용</td><td>번호가 붙은 소주제 1~3개와 세부 안내</td><td>소주제·세부 항목 추가·삭제</td></tr><tr><td>기타</td><td>단계별 향후 추진계획, 현장사진</td><td>단계 목록, 이미지 올리기</td></tr><tr><td>확인 문구와 서명</td><td>프로그램 수행 확인 문구, 컨설턴트 성명·서명</td><td>고정 문구와 서명 이미지 올리기</td></tr></tbody></table></div>'},
 {label:'사용 흐름',html:'<ol class="steps"><li>기본 정보(가칭 기업명, 상담일자, 회차, 상담분야) 입력</li><li>참고자료 붙여넣기: 상담 메모, 기업이 준 자료, 지원사업 안내문 등</li><li>초안 생성: 애로사항, 문제점, 컨설팅 내용, 향후 계획이 칸별로 채워짐</li><li>컨설턴트가 칸별로 추가·수정·보완하고 문구 다듬기를 요청</li><li>미리보기로 원본 양식과 같은 모양인지 확인</li><li>내려받기: Word 파일(.docx), 인쇄용 화면, 텍스트 복사</li></ol>'},
 {label:'자동 작성 방식',html:'<div class="scroll"><table class="tbl"><thead><tr><th>방식</th><th>동작</th><th>난이도</th><th>활용</th></tr></thead><tbody><tr><td>A. 채팅 연계</td><td>웹이 Claude에 붙여넣을 프롬프트를 만들어 주고, Claude의 답변을 웹에 붙여넣으면 구분 표식에 따라 칸별로 채워짐</td><td>★★★</td><td>기본 과정. API 키가 필요 없음</td></tr><tr><td>B. API 연동</td><td>버튼 한 번으로 Claude API를 호출해 초안 생성</td><td>★★★★★</td><td>심화 과제. API 키를 웹 코드에 넣으면 누구나 볼 수 있으므로 키를 서버 쪽에 보관하는 중계 기능이 필요</td></tr></tbody></table></div>'},
 {label:'지켜야 할 점',html:'<ul><li>연습에는 <b>가상 사례</b>만 씁니다. 실제 상담에서는 고객의 이름, 연락처, 회사 정보를 Claude에 붙여넣기 전에 지우거나 A사처럼 가립니다.</li><li>웹에 상담자 연락처 칸을 두지 않고, 보고서 출력물에도 필요한 정보만 넣습니다. 현장사진은 얼굴이 나오므로 당사자 동의를 받습니다.</li><li>초안의 금액, 지원사업 조건, 기관명, 수수료는 틀릴 수 있으므로 컨설턴트가 공식 자료로 확인한 뒤 확정합니다. 보고서의 책임은 작성한 컨설턴트에게 있습니다.</li><li>기관마다 제출 양식이 정해져 있으므로 연습용 일반 양식과 제출용 공식 양식을 구분하고, 실제 제출은 기관이 준 파일 형식을 따릅니다.</li></ul>'}],
 prompts:['p-r1','p-r2','p-r3','p-r4','p-r5','p-r6'],
 checks:['가상 사례 1건을 넣어 6개 영역이 모두 채워졌다','내용을 수정한 뒤 .docx를 내려받아 Word에서 열렸다','고객 식별 정보가 화면·파일·코드 어디에도 남지 않는다','초안의 수치를 공식 자료로 확인하는 절차를 넣었다'],
 stuck:[{q:'버튼 한 번으로 자동 작성되게 하고 싶어요',a:'Claude API를 호출해야 합니다. API 키를 웹 코드에 넣으면 누구나 볼 수 있어 위험하므로, 키를 서버에 보관하는 중계 기능이 필요한 심화 과제입니다. 먼저 A 방식으로 완성하세요.'},{q:'내려받기 버튼을 눌러도 파일이 안 받아져요',a:'Claude 화면 안의 미리보기에서는 파일 저장이 막힐 수 있습니다. 파일을 내 컴퓨터에 저장해 열거나 배포한 주소에서 시험하세요.'}]};

var ORDER=['home'].concat(STEPS.map(function(s){return s.id}));
var STEPMAP={};STEPS.forEach(function(s){STEPMAP[s.id]=s});STEPMAP.report=REPORT;
var TOTAL_TIME=STEPS.reduce(function(a,s){return a+s.time},0);

/* ---------- FAQ·용어집 ---------- */
var FAQ=[
{q:'Claude가 만든 코드를 어디에 저장하나요?',a:'메모장에 붙여넣고 <code>my-first-web</code> 폴더에 <code>이름.html</code>로 저장합니다. 파일 형식은 모든 파일, 인코딩은 UTF-8로 합니다. (Step 1)'},
{q:'저장했는데 메모장으로만 열려요',a:'파일 이름이 <code>profile.html.txt</code>처럼 저장됐을 수 있습니다. 확장자가 보이게 설정하고 이름 끝을 .html로 고치세요.'},
{q:'한글이 깨져 보여요',a:'UTF-8로 저장하지 않아서입니다. 다른 이름으로 저장하며 인코딩을 UTF-8로 선택하세요.'},
{q:'고쳤는데 화면이 그대로예요',a:'파일을 저장했는지 확인하고 브라우저에서 Ctrl+F5(Mac은 Command+Shift+R)로 강력 새로고침하세요.'},
{q:'Claude가 한 번에 너무 많이 바꿔요',a:'요청에 "다른 부분은 그대로 두고"를 넣고 바꿀 섹션을 지정하세요. Claude Code에서는 계획을 먼저 보고 승인받게 합니다.'},
{q:'이전 상태로 되돌리고 싶어요',a:'수정 전에 파일을 복사해 버전 이름을 붙여 두세요. Claude Code에서는 "방금 수정을 되돌려 줘"라고 요청할 수 있습니다.'},
{q:'대화가 길어지니 이상한 답을 해요',a:'새 대화를 열고 현재 전체 코드를 붙여넣은 뒤 이어서 요청하세요.'},
{q:'계산 결과가 틀려요',a:'입력값, 기대값, 화면 값을 그대로 적어 계산식을 단계별로 보여 달라고 요청하세요. 검수표의 예시값으로 대조하는 습관을 들이세요.'},
{q:'무료로도 따라 할 수 있나요?',a:'Claude의 이용 범위와 한도, Claude Code의 이용 조건은 바뀔 수 있습니다. 공식 안내에서 현재 조건을 확인하세요.'},
{q:'고객 정보를 넣어도 되나요?',a:'넣지 않는 것이 원칙입니다. 연습은 가상 사례로 하고, 실제 업무에서는 이름·연락처·회사 정보를 지우거나 가린 뒤 사용하세요.'},
{q:'만든 페이지를 다른 사람에게 어떻게 보여 주나요?',a:'GitHub Pages로 배포해 공개 주소를 만들어 공유합니다. (Step 5) 파일을 이메일로 보내 열어 보게 할 수도 있습니다.'},
{q:'GitHub 주소가 404로 나와요',a:'설정 직후에는 몇 분 걸릴 수 있습니다. Pages 설정의 브랜치와 폴더, 메인 파일 이름(index.html)을 확인하세요.'},
{q:'API 키는 뭐고 왜 위험한가요?',a:'프로그램이 Claude 같은 서비스를 대신 호출할 때 쓰는 비밀번호 같은 값입니다. 웹페이지 코드에 넣으면 누구나 볼 수 있어 도용될 수 있으므로 코드나 대화에 올리지 마세요.'}
];
var GLOSS=[
{t:'바이브 코딩',d:'코드를 직접 쓰지 않고 말로 요청해 AI가 코드를 만들게 하고, 결과를 보며 고쳐 가는 방식입니다.'},
{t:'프롬프트',d:'AI에게 보내는 요청 문장입니다. 구체적일수록 결과가 좋아집니다.'},
{t:'HTML',d:'웹페이지의 구조와 내용을 적는 문서 형식입니다. 파일 이름이 .html로 끝납니다.'},
{t:'CSS',d:'웹페이지의 색, 글자, 배치 같은 모양을 정하는 규칙입니다.'},
{t:'JavaScript',d:'버튼 클릭, 계산처럼 웹페이지가 움직이게 하는 코드입니다.'},
{t:'브라우저',d:'웹페이지를 여는 프로그램입니다. Chrome, Edge, Safari 등이 있습니다.'},
{t:'UTF-8',d:'한글이 깨지지 않게 저장하는 문자 인코딩 방식입니다.'},
{t:'터미널',d:'글자로 명령을 입력해 컴퓨터를 조작하는 창입니다. Windows에서는 PowerShell을 씁니다.'},
{t:'Claude Code',d:'내 컴퓨터의 폴더 안에서 파일을 읽고 만들고 고치는 Claude의 코딩 도구입니다.'},
{t:'CLAUDE.md',d:'Claude Code가 작업을 시작할 때 읽는 규칙 파일입니다. 매번 같은 지시를 반복하지 않게 해 줍니다.'},
{t:'저장소(Repository)',d:'프로젝트 파일과 수정 기록을 모아 두는 GitHub의 폴더입니다.'},
{t:'커밋',d:'수정 내용을 하나의 저장 시점으로 남기는 것입니다. 나중에 그 시점으로 돌아갈 수 있습니다.'},
{t:'배포',d:'만든 페이지를 인터넷에 공개해 누구나 주소로 열 수 있게 하는 일입니다.'},
{t:'GitHub Pages',d:'GitHub 저장소의 파일을 웹페이지로 공개해 주는 서비스입니다.'},
{t:'반응형',d:'컴퓨터와 스마트폰 등 화면 크기에 맞춰 레이아웃이 바뀌는 방식입니다.'},
{t:'API 키',d:'프로그램이 서비스를 호출할 때 쓰는 비밀번호 같은 값입니다. 공개하면 안 됩니다.'},
{t:'환각',d:'AI가 사실이 아닌 내용을 그럴듯하게 만들어 내는 현상입니다. 수치와 법령은 직접 확인해야 합니다.'}
];

/* ---------- 프롬프트 렌더링 ---------- */
var VARS={}; // 프롬프트별 입력값
function varNames(p){var m=p.text.match(/\{\{[^}]+\}\}/g)||[],o=[];m.forEach(function(x){var n=x.slice(2,-2);if(o.indexOf(n)<0)o.push(n)});return o}
function ptextHtml(p){
  var v=VARS[p.id]||{};
  return esc(p.text).replace(/\{\{([^}]+)\}\}/g,function(_,n){var val=v[n];return '<mark>'+(val?esc(val):'['+n+']')+'</mark>'});
}
function ptextPlain(p){
  var v=VARS[p.id]||{};
  return p.text.replace(/\{\{([^}]+)\}\}/g,function(_,n){return v[n]?v[n]:'['+n+']'});
}
function stepLabel(p){return p.step==='R'?'실습 7':('Step '+p.step)}
function promptCard(p,showStep){
  var names=varNames(p),mono=p.type==='code'?' mono':'';
  var h='<article class="pcard" data-pid="'+p.id+'"><div class="ph-head"><h4>'+esc(p.title)+'</h4><span class="tag">'+(showStep?stepLabel(p)+' · ':'')+esc(p.cat)+'</span></div>';
  h+='<pre class="ptext'+mono+'">'+ptextHtml(p)+'</pre>';
  h+='<div class="pact"><button class="btn pri" type="button" data-act="copy">복사</button>';
  if(names.length)h+='<button class="btn" type="button" data-act="vars" aria-expanded="false">내 내용으로 바꾸기</button>';
  h+='</div>';
  if(names.length){
    h+='<div class="vars" hidden>'+names.map(function(n,i){return '<label>'+esc(n)+'<input type="text" data-pid="'+p.id+'" data-var="'+esc(n)+'" id="v-'+p.id+'-'+i+'" autocomplete="off"></label>'}).join('')+'</div>';
  }
  if(p.tip)h+='<p class="ptip">'+esc(p.tip)+'</p>';
  return h+'</article>';
}
function cards(ids,showStep){return ids.map(function(i){return promptCard(PMAP[i],showStep)}).join('')}

/* ---------- 공통 조각 ---------- */
function row(label,inner){return '<div class="row"><div class="lab">'+label+'</div><div class="cell">'+inner+'</div></div>'}
function ul(a){return '<ul>'+a.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'}
function olSteps(a){return '<ol class="steps">'+a.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol>'}
function details(list){return list.map(function(x){return '<details class="q"><summary>'+x.q+'</summary><div class="ans">'+x.a+'</div></details>'}).join('')}
function checkList(s){
  var done=s.checks.filter(function(_,i){return state[s.id+':'+i]}).length;
  return '<p class="cprog" id="cprog">'+done+' / '+s.checks.length+' 확인</p>'+s.checks.map(function(c,i){
    return '<label class="chk"><input type="checkbox" data-k="'+s.id+':'+i+'"'+(state[s.id+':'+i]?' checked':'')+'><span>'+esc(c)+'</span></label>';
  }).join('');
}
function isDone(s){return s.checks.every(function(_,i){return state[s.id+':'+i]})}
function doneCount(){return STEPS.filter(isDone).length}

/* ---------- 5요소 빌더 ---------- */
var BDEF=[
 {k:'who',l:'1. 누가 쓰는지',v:'중소기업 수출 담당자',h:'쓰는 사람'},
 {k:'what',l:'2. 무엇을 만드는지',v:'수출 준비도 자가진단 웹페이지',h:'만들 것'},
 {k:'fn',l:'3. 어떤 기능이 필요한지',v:'질문 10개, 체크하면 점수와 진행률 막대가 바뀌고 마지막에 등급과 다음 할 일을 보여줌',h:'기능',ta:true},
 {k:'ds',l:'4. 디자인 느낌',v:'파란색 계열의 깔끔한 모던 디자인, 스마트폰에서도 보기 좋게',h:'디자인',ta:true},
 {k:'fm',l:'5. 결과물 형태',v:'CSS와 JavaScript를 포함한 단일 HTML 파일, 코드 전체를 한 번에',h:'형식',ta:true}
];
var BVAL={};BDEF.forEach(function(b){BVAL[b.k]=b.v});
function builderText(){
  return '다음 웹페이지를 만들어 줘.\n- 쓰는 사람: '+BVAL.who.trim()+'\n- 만들 것: '+BVAL.what.trim()+'\n- 기능: '+BVAL.fn.trim()+'\n- 디자인: '+BVAL.ds.trim()+'\n- 형식: '+BVAL.fm.trim();
}
function builderHtml(){
  var h='<p>아래 빈칸은 예시 값으로 채워져 있습니다. 내 상황에 맞게 고치면 아래 프롬프트가 바로 바뀝니다.</p>';
  BDEF.forEach(function(b){
    h+='<div class="fld"><label for="b-'+b.k+'">'+b.l+'</label>'+(b.ta?'<textarea id="b-'+b.k+'" data-b="'+b.k+'" rows="2">':'<input id="b-'+b.k+'" data-b="'+b.k+'" type="text" value="')+esc(BVAL[b.k])+(b.ta?'</textarea>':'">')+'</div>';
  });
  h+='<p class="cprog" id="b-status"></p><div class="pcard"><div class="ph-head"><h4>완성된 프롬프트</h4><span class="tag">빌더</span></div><pre class="ptext" id="b-out"></pre><div class="pact"><button class="btn pri" type="button" data-act="copy-builder">복사</button></div></div>';
  return h;
}
function builderUpdate(){
  var out=$('#b-out');if(!out)return;
  out.textContent=builderText();
  var n=BDEF.filter(function(b){return BVAL[b.k].trim()}).length;
  var st=$('#b-status');if(st)st.textContent=n===5?'5요소를 모두 채웠습니다.':'5요소 중 '+n+'개를 채웠습니다. 빈 항목이 있으면 결과가 모호해집니다.';
}

/* ---------- 화면: 홈 ---------- */
function viewHome(){
  var first=STEPS.filter(function(s){return !isDone(s)})[0];
  var started=STEPS.some(function(s){return s.checks.some(function(_,i){return state[s.id+':'+i]})});
  var cta;
  if(!first)cta='<a class="btn pri" href="#progress">수료 현황 보기</a>';
  else if(started)cta='<a class="btn pri" href="#'+first.id+'">이어서 하기 · Step '+first.n+'</a><a class="btn" href="#step-0">처음부터 보기</a>';
  else cta='<a class="btn pri" href="#step-0">Step 0부터 시작</a><a class="btn" href="#prompts">프롬프트 모음 보기</a>';
  var h='<section class="hero"><p class="kick">경영지도사를 위한 자기주도 실습</p><h1>바이브 코딩 길잡이</h1><p class="lead">코딩을 몰라도 됩니다. Claude에게 요청하고, 결과를 확인하고, 고쳐 가며 내 상담 업무에 쓰는 웹페이지를 만들어 직접 배포하는 8단계 실습입니다.</p><div class="cta">'+cta+'</div>'+
  '<div class="facts"><div><b>8단계</b><span>Step 0~7</span></div><div><b>'+Math.floor(TOTAL_TIME/60)+'시간 '+(TOTAL_TIME%60)+'분</b><span>혼자서 따라 하는 시간</span></div><div><b>'+P.length+'개</b><span>복사해 쓰는 프롬프트</span></div></div></section>';
  h+='<section class="sec"><h2>이 과정에서 만드는 것</h2><div class="three"><div><h3>내 소개·명함 페이지</h3><p>Step 1~2. 첫 요청으로 파일 하나를 만들어 브라우저로 열고, 작게 나눠 고치는 법을 익힙니다.</p></div><div><h3>체크리스트와 계산기</h3><p>Step 3. 수출 준비도 진단, 손익분기점 계산처럼 상담에서 바로 쓰는 도구를 만들고 검수합니다.</p></div><div><h3>보고서 작성 웹</h3><p>Step 6과 실습 7. 참고자료를 넣으면 결과보고서 초안이 칸별로 채워지는 웹을 만듭니다.</p></div></div></section>';
  h+='<section class="sec"><h2>학습 순서</h2><div class="scroll"><table class="tbl"><thead><tr><th>단계</th><th>주제</th><th>도구</th><th class="num">시간</th><th>결과물</th></tr></thead><tbody>'+
  STEPS.map(function(s){return '<tr><td>Step '+s.n+'</td><td><a href="#'+s.id+'">'+s.title+'</a></td><td>'+s.tool+'</td><td class="num">'+s.time+'분</td><td>'+s.out+'</td></tr>'}).join('')+
  '</tbody></table></div><p style="margin-top:10px;font-size:.92rem;color:var(--ink2)">Step 1~3은 Claude 채팅, Step 4부터는 Claude Code를 씁니다. 하루 1~2단계씩, 2주에 나눠 학습하는 것을 권장합니다.</p></section>';
  h+='<section class="sec"><h2>이렇게 학습하세요</h2><div class="three"><div><h3>한 번에 하나만</h3><p>요청은 작게 나눕니다. 색상, 기능, 문구를 한꺼번에 바꾸라고 하면 결과를 확인하기 어렵습니다.</p></div><div><h3>결과는 직접 확인</h3><p>계산기는 검수표의 숫자와 대조하고, 페이지는 스마트폰으로도 열어 봅니다.</p></div><div><h3>사실은 직접 검증</h3><p>법령, 세율, 한도, 기간은 AI가 틀릴 수 있습니다. 공식 자료로 확인하세요.</p></div></div></section>';
  return h;
}

/* ---------- 화면: 단계 ---------- */
function titleBlock(s){
  var kick=s.kick||('STEP '+s.n+' · '+s.time+'분 · '+s.tool);
  if(s.kick)kick+=' · '+s.time+'분 · '+s.tool;
  return '<div class="tb"><div><p class="kick">'+esc(kick)+'</p><h1>'+esc(s.title)+'</h1><p class="out">이번 단계 결과물: '+esc(s.out)+'</p></div><div class="stamp" data-stamp="'+s.id+'" aria-live="polite"></div></div>';
}
function viewStep(s){
  var h=titleBlock(s)+'<div class="form">';
  h+=row('목표','<p>'+s.goal+'</p>');
  h+=row('준비물',ul(s.prepare));
  if(s.concepts)h+=row('핵심 개념',ul(s.concepts));
  h+=row('따라 하기',olSteps(s.steps));
  if(s.builder)h+=row('프롬프트 빌더',builderHtml());
  (s.extra||[]).forEach(function(e){h+=row(e.label,e.html)});
  if(s.prompts&&s.prompts.length)h+=row('복사용 프롬프트',cards(s.prompts,false));
  h+=row(s.checkTitle||'체크포인트',checkList(s));
  h+=row('막힐 때',details(s.stuck));
  h+='</div>';
  var i=STEPS.indexOf(s),prev,next;
  if(s.id==='report'){prev=STEPMAP['step-6'];next=STEPMAP['step-7']}
  else{prev=STEPS[i-1];next=STEPS[i+1]}
  h+='<div class="pager">';
  if(prev)h+='<a class="btn" href="#'+prev.id+'"><span><small>이전</small>'+(prev.n!=='7'?'Step '+prev.n+' · ':'')+prev.title+'</span><span aria-hidden="true">←</span></a>';
  else h+='<a class="btn" href="#home"><span><small>이전</small>처음 화면</span><span aria-hidden="true">←</span></a>';
  if(next)h+='<a class="btn pri" href="#'+next.id+'"><span><small>다음</small>Step '+next.n+' · '+next.title+'</span><span aria-hidden="true">→</span></a>';
  else h+='<a class="btn pri" href="#progress"><span><small>마무리</small>내 진도와 수료 확인</span><span aria-hidden="true">→</span></a>';
  return h+'</div>';
}

/* ---------- 화면: 프롬프트 라이브러리 ---------- */
var libStep='all',libQ='';
function libList(){
  var q=libQ.trim().toLowerCase();
  var list=P.filter(function(p){
    if(libStep!=='all'&&String(p.step)!==libStep)return false;
    if(!q)return true;
    return (p.title+' '+p.text+' '+p.cat).toLowerCase().indexOf(q)>=0;
  });
  return '<p class="cnt">'+list.length+'개 프롬프트</p>'+(list.length?list.map(function(p){return promptCard(p,true)}).join(''):'<p>조건에 맞는 프롬프트가 없습니다. 검색어를 줄이거나 단계를 바꿔 보세요.</p>');
}
function viewPrompts(){
  var chips=[['all','전체']].concat(STEPS.map(function(s){return [String(s.n),'Step '+s.n]})).concat([['R','실습 7']]);
  var h='<div class="tb"><div><p class="kick">PROMPT LIBRARY</p><h1>프롬프트 모음</h1><p class="out">노란 빈칸을 내 내용으로 바꿔 복사해 Claude에 붙여넣으세요.</p></div></div>';
  h+='<div class="bar"><input class="srch" id="lib-q" type="search" placeholder="검색어 (예: 계산기, 오류, 보고서)" aria-label="프롬프트 검색" value="'+esc(libQ)+'"></div>';
  h+='<div class="chips" id="lib-chips">'+chips.map(function(c){return '<button type="button" class="chip" data-step="'+c[0]+'" aria-pressed="'+(libStep===c[0])+'">'+c[1]+'</button>'}).join('')+'</div>';
  h+='<div id="lib-list">'+libList()+'</div>';
  return h;
}

/* ---------- 화면: FAQ·용어집 ---------- */
var faqQ='',glQ='';
function faqList(){
  var q=faqQ.trim().toLowerCase();
  var l=FAQ.filter(function(x){return !q||(x.q+' '+x.a).toLowerCase().indexOf(q)>=0});
  return '<p class="cnt">'+l.length+'개 질문</p>'+(l.length?'<div class="form" style="margin:0"><div class="cell">'+details(l)+'</div></div>':'<p>찾는 내용이 없습니다. 다른 단어로 검색해 보세요.</p>');
}
function viewFaq(){
  return '<div class="tb"><div><p class="kick">TROUBLESHOOTING</p><h1>문제 해결</h1><p class="out">막힌 증상을 검색하세요. 단계별 막힐 때 항목도 함께 확인하세요.</p></div></div><div class="bar"><input class="srch" id="faq-q" type="search" placeholder="증상 검색 (예: 한글, 404, 새로고침)" aria-label="질문 검색" value="'+esc(faqQ)+'"></div><div id="faq-list">'+faqList()+'</div>';
}
function glList(){
  var q=glQ.trim().toLowerCase();
  var l=GLOSS.filter(function(x){return !q||(x.t+' '+x.d).toLowerCase().indexOf(q)>=0});
  return '<p class="cnt">'+l.length+'개 용어</p>'+(l.length?'<div class="scroll"><table class="tbl"><thead><tr><th>용어</th><th>쉬운 설명</th></tr></thead><tbody>'+l.map(function(x){return '<tr><td><b>'+esc(x.t)+'</b></td><td>'+esc(x.d)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p>찾는 용어가 없습니다.</p>');
}
function viewGloss(){
  return '<div class="tb"><div><p class="kick">GLOSSARY</p><h1>용어집</h1><p class="out">처음 보는 단어는 여기서 확인하세요.</p></div></div><div class="bar"><input class="srch" id="gl-q" type="search" placeholder="용어 검색" aria-label="용어 검색" value="'+esc(glQ)+'"></div><div id="gl-list">'+glList()+'</div>';
}

/* ---------- 화면: 내 진도 ---------- */
var resetArmed=false,resetTimer=null;
function viewProgress(){
  var n=doneCount(),all=n===STEPS.length;
  var h='<div class="tb"><div><p class="kick">MY PROGRESS</p><h1>내 진도</h1><p class="out">체크포인트를 모두 확인한 단계에 도장이 찍힙니다. 이 기록은 이 기기의 브라우저에만 저장됩니다.</p></div><div class="stamp big-stamp'+(all?' on':'')+'" aria-label="'+(all?'수료':'수료 전')+'">'+(all?'수료':'(인)')+'</div></div>';
  h+='<div class="form">';
  STEPS.concat([REPORT]).forEach(function(s){
    var d=s.checks.filter(function(_,i){return state[s.id+':'+i]}).length,pct=Math.round(d/s.checks.length*100);
    h+=row((s.id==='report'?'실습 7':'Step '+s.n),'<p style="margin:0"><a href="#'+s.id+'"><b>'+s.title+'</b></a> '+(isDone(s)?'<span class="tag" style="color:var(--accent);border-color:var(--accent)">완료</span>':'')+(s.id==='report'?' <span class="tag">심화</span>':'')+'</p><div class="pbar" aria-hidden="true"><i style="width:'+pct+'%"></i></div><p class="cprog" style="margin:4px 0 0">'+d+' / '+s.checks.length+' 확인</p>');
  });
  h+='</div>';
  h+='<p>Step 0~7을 모두 완료하면 수료입니다. 실습 7은 심화 과제로 수료 조건에는 포함되지 않습니다.</p>';
  h+='<p><button class="btn" type="button" data-act="reset" id="reset-btn">'+(resetArmed?'한 번 더 누르면 모두 지워집니다':'진도 초기화')+'</button></p>';
  return h;
}

/* ---------- 목차 ---------- */
function buildNav(){
  var h='<h2>시작</h2><div class="nav"><a href="#home" data-r="home"><span class="no">-</span>홈</a></div><h2>학습 단계</h2><div class="nav">';
  STEPS.forEach(function(s){
    h+='<a href="#'+s.id+'" data-r="'+s.id+'"><span class="no">'+s.n+'</span><span>'+s.title+'</span><span class="tm">'+s.time+'분</span><span class="dn" aria-label="완료">완</span></a>';
    if(s.n===6)h+='<a class="sub" href="#report" data-r="report"><span class="no">+</span><span>실습 7 보고서 작성기</span><span class="dn" aria-label="완료">완</span></a>';
  });
  h+='</div><h2>자료</h2><div class="nav"><a href="#prompts" data-r="prompts"><span class="no">P</span>프롬프트 모음</a><a href="#faq" data-r="faq"><span class="no">?</span>문제 해결</a><a href="#glossary" data-r="glossary"><span class="no">A</span>용어집</a><a href="#progress" data-r="progress"><span class="no">V</span>내 진도</a></div>';
  $('#side').innerHTML=h;
}

/* ---------- 상태 반영 ---------- */
function refresh(){
  var total=0,got=0;
  STEPS.forEach(function(s){s.checks.forEach(function(_,i){total++;if(state[s.id+':'+i])got++})});
  var pct=Math.round(got/total*100);
  $('#meter-i').style.width=pct+'%';
  $('#meter').setAttribute('aria-valuenow',pct);
  $('#meter-t').textContent=doneCount()+'/'+STEPS.length+' 단계';
  $$('#side a[data-r]').forEach(function(a){var s=STEPMAP[a.getAttribute('data-r')];a.classList.toggle('done',!!(s&&isDone(s)))});
  $$('.stamp[data-stamp]').forEach(function(el){var s=STEPMAP[el.getAttribute('data-stamp')],on=s&&isDone(s);el.classList.toggle('on',!!on);el.textContent=on?'완료':'(인)'});
  var cur=currentStep();
  if(cur){var cp=$('#cprog');if(cp)cp.textContent=cur.checks.filter(function(_,i){return state[cur.id+':'+i]}).length+' / '+cur.checks.length+' 확인'}
}
var curRoute='home';
function currentStep(){return STEPMAP[curRoute]||null}

/* ---------- 라우터 ---------- */
function route(){
  var r=(location.hash||'').replace(/^#/,'')||'home';
  var ok=r==='home'||r==='prompts'||r==='faq'||r==='glossary'||r==='progress'||STEPMAP[r];
  if(!ok)r='home';
  curRoute=r;
  var v=$('#view'),h;
  if(r==='home')h=viewHome();
  else if(r==='prompts')h=viewPrompts();
  else if(r==='faq')h=viewFaq();
  else if(r==='glossary')h=viewGloss();
  else if(r==='progress')h=viewProgress();
  else h=viewStep(STEPMAP[r]);
  v.innerHTML=h;
  $$('#side a[data-r]').forEach(function(a){if(a.getAttribute('data-r')===r)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  closeMenu();
  if(r==='step-2')builderUpdate();
  refresh();
  window.scrollTo(0,0);
  try{v.focus({preventScroll:true})}catch(e){}
}
function closeMenu(){$('#side').classList.remove('open');var b=$('#menu-btn');b.setAttribute('aria-expanded','false');b.textContent='목차'}

/* ---------- 복사 ---------- */
function copyText(text,btn,sourceEl){
  function flash(msg){var o=btn.getAttribute('data-label')||btn.textContent;btn.setAttribute('data-label',o);btn.textContent=msg;setTimeout(function(){btn.textContent=o;btn.removeAttribute('data-label')},1800)}
  function fallback(){
    try{
      var el=sourceEl||document.createElement('span');
      var rg=document.createRange();rg.selectNodeContents(el);var sel=window.getSelection();sel.removeAllRanges();sel.addRange(rg);
      flash('선택됨: Ctrl+C로 복사');
    }catch(e){flash('직접 선택해 복사하세요')}
  }
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){flash('복사됨')},fallback)}
    else fallback();
  }catch(e){fallback()}
}

/* ---------- 이벤트 ---------- */
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-act],.chip[data-step],#menu-btn');
  if(!t)return;
  if(t.id==='menu-btn'){var s=$('#side'),open=!s.classList.contains('open');s.classList.toggle('open',open);t.setAttribute('aria-expanded',String(open));t.textContent=open?'닫기':'목차';return}
  if(t.hasAttribute('data-step')){libStep=t.getAttribute('data-step');$$('#lib-chips .chip').forEach(function(c){c.setAttribute('aria-pressed',String(c===t))});$('#lib-list').innerHTML=libList();return}
  var act=t.getAttribute('data-act');
  if(act==='copy'){var card=t.closest('.pcard'),p=PMAP[card.getAttribute('data-pid')];copyText(ptextPlain(p),t,$('.ptext',card))}
  else if(act==='vars'){var c=t.closest('.pcard'),vs=$('.vars',c),show=vs.hidden;vs.hidden=!show;t.setAttribute('aria-expanded',String(show));t.textContent=show?'빈칸 닫기':'내 내용으로 바꾸기';if(show){var i=$('input',vs);if(i)i.focus()}}
  else if(act==='copy-builder'){copyText(builderText(),t,$('#b-out'))}
  else if(act==='copy-mail'){copyText('happyojh@gmail.com',t,$('#mail'))}
  else if(act==='reset'){
    if(!resetArmed){resetArmed=true;t.textContent='한 번 더 누르면 모두 지워집니다';clearTimeout(resetTimer);resetTimer=setTimeout(function(){resetArmed=false;var b=$('#reset-btn');if(b)b.textContent='진도 초기화'},4000)}
    else{resetArmed=false;clearTimeout(resetTimer);state={};save();route()}
  }
});
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.hasAttribute('data-var')){var id=t.getAttribute('data-pid'),n=t.getAttribute('data-var');VARS[id]=VARS[id]||{};VARS[id][n]=t.value;var card=t.closest('.pcard');$('.ptext',card).innerHTML=ptextHtml(PMAP[id])}
  else if(t.hasAttribute('data-b')){BVAL[t.getAttribute('data-b')]=t.value;builderUpdate()}
  else if(t.id==='lib-q'){libQ=t.value;$('#lib-list').innerHTML=libList()}
  else if(t.id==='faq-q'){faqQ=t.value;$('#faq-list').innerHTML=faqList()}
  else if(t.id==='gl-q'){glQ=t.value;$('#gl-list').innerHTML=glList()}
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.matches('input[data-k]')){var k=t.getAttribute('data-k');if(t.checked)state[k]=true;else delete state[k];save();refresh()}
});
window.addEventListener('hashchange',route);

buildNav();
route();
})();
