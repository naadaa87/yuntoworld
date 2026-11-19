# 윤토 YUNTO — 홈페이지

함께 배우고, 바로 쓰는 창작 언어 윤토(YUNTO)와 고유문자 sonilipi의 공식 사이트입니다.
빌드 도구 없이 동작하는 정적 사이트입니다. HTML·CSS·JS와 JSON 데이터만으로 이루어져 있어 GitHub에 올리고 Cloudflare Pages에 연결하면 바로 배포됩니다.

## 구성

```
index.html        홈 — 살아 있는 변환기, 1분 맛보기, 배우는 길
learn.html        배우기 — 10분 코스(대화형), 60분 스타터, 7일 챌린지, 30일 플랜
grammar.html      문법과 기준 — 소리 15개, 문법 13조, 상관표, 파생 13가지, 숫자·시간·이름
script.html       문자 — 변환기(PNG/SVG 저장), 15자 표, 모음 논리, 음절 묶어 쓰기, 숫자
dictionary.html   사전 — 핵심 낱말 189 · 기능어 31 · 숫자 14, 검색과 분류
phrases.html      상황별 표현 — 8장면 48문장
about.html        소개 — 이름, 원칙, 표준 관리, 로드맵, 참여
404.html          없는 주소
assets/sonilipi.js   고유문자 렌더러 (로마자 → SVG). 사이트의 모든 고유문자를 이 파일이 그립니다
assets/site.css      스타일
assets/site.js       공통 동작 (메뉴, 히어로 변환기, 듣기)
assets/learn.js      10분 코스 대화형 동작
assets/dictionary.js 사전 검색
assets/script-page.js 문자 페이지 변환기와 글자표
data/lexicon.json    낱말 데이터 (사전과 검사의 원본)
data/sentences.json  예문 데이터
img/                 심볼, 파비콘, 공유용 이미지
```

## 배포 (GitHub → Cloudflare Pages)

1. GitHub에 새 저장소를 만들고 이 폴더의 파일을 그대로 올립니다. (`index.html`이 저장소 최상위에 있어야 합니다.)
2. Cloudflare 대시보드 → Workers & Pages → Create → Pages → Connect to Git → 저장소 선택.
3. 빌드 설정:
   - Framework preset: **None**
   - Build command: **(비워 둠)**
   - Build output directory: **/** (또는 비워 둠)
4. Save and Deploy. 이후에는 `main` 브랜치에 push할 때마다 자동으로 다시 배포됩니다.
5. 사용자 지정 도메인은 Pages 프로젝트 → Custom domains에서 연결합니다.

## 바꿔야 할 값

- GitHub 저장소 주소는 HTML 안에 `https://github.com/naadaa87/yunto`로 들어 있습니다. 저장소 이름이 다르면 모든 HTML 파일에서 이 주소를 찾아 바꾸세요. (편집기의 “모두 바꾸기”로 한 번에 됩니다.)
- 공유용 이미지 주소(`og:image`)는 `https://yuntoworld.pages.dev/img/og.png`로 되어 있습니다. 도메인을 바꾸면 함께 바꾸세요.
- 낱말 제안 양식은 `.github/ISSUE_TEMPLATE/word.md`에 있습니다.

## 데이터 수정

- 낱말을 더하거나 고칠 때는 `data/lexicon.json`만 수정합니다. 사전 페이지가 자동으로 반영합니다.
- 예문은 `data/sentences.json`을 수정합니다. 표현 페이지는 정적 HTML이므로 예문을 바꾼 뒤에는 `phrases.html`도 함께 고쳐야 합니다.
- 고유문자 모양(좌표)은 `assets/sonilipi.js`의 `glyph()` 함수 한 곳에만 있습니다.

## 라이선스

언어 규칙·사전·예문은 출처 표시 조건으로 자유롭게 쓸 수 있습니다. 이름·심볼·공식 글꼴은 프로젝트가 관리합니다.
