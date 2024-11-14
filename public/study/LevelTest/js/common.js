$(document).ready(function () {
	//페이지 작동 정보 변수
	let isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

	// 접속 디바이스 구별 함수 (https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.4.5/mobile-detect.min.js)
	const md = new MobileDetect(window.navigator.userAgent);
	const isAndroid = md.os() === 'AndroidOS';
	const isIos = md.os() === 'iOS' || 'iPadOS';

	// 웹 브라우저 정보(사용방법 : detectEnvironment(navigator.userAgent))
	function detectEnvironment(userAgent) {
		// iOS WebView 감지
		if (/iPhone|iPad|iPod/.test(userAgent) && !/Safari/.test(userAgent)) {
		return "iOS WebView";
		}
	
		// Android WebView 감지
		if (/Android/.test(userAgent) && /wv/.test(userAgent)) {
		return "Android WebView";
		}
	
		// Chrome 브라우저 감지
		if (/Chrome/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent)) {
		return "Chrome";
		}
	
		// Safari 브라우저 감지
		if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
		return "Safari";
		}
	
		// Firefox 브라우저 감지
		if (/Firefox/.test(userAgent)) {
		return "Firefox";
		}
	
		// Edge 브라우저 감지
		if (/Edg/.test(userAgent)) {
		return "Edge";
		}
	
		return "Unknown";
	}

	// 이건 사파리나 iOS 인가?
	function isSafari() {
		return detectEnvironment(navigator.userAgent) === 'iOS WebView' || detectEnvironment(navigator.userAgent) === 'Safari';
	}

	// 터치 장치인지 구별하기
	function isTouchDevice() {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	}

	let targetLayout = "#outline";
	let targetLayoutPopStart = "#popStart";
	let targetLayoutPopLevel = "#popLevel";
	let targetLayoutPopResult = "#popResult";

	// PC, 태블릿 스케일
	function scaleElementPC() {
		const width = window.innerWidth;
		const height = window.innerHeight;
	
		const isTouchScreen = () => {
		return navigator.maxTouchPoints > 0;
		}
	
		let portraitScale = (width - 50) / 1280;
		let landscapeScale = (height - 50) / 720;
	
		if (window.matchMedia("(orientation: landscape)").matches) {
		document.querySelector(targetLayout).style.transform =
			`scale(${isTouchScreen() ?  portraitScale :landscapeScale})`;
		document.querySelector(targetLayoutPopStart).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopLevel).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopResult).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale}) translate(-50%, -50%)`;
		} else {
		document.querySelector(targetLayout).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale})`;
		document.querySelector(targetLayoutPopStart).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopLevel).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopResult).style.transform =
			`scale(${isTouchScreen() ? portraitScale :landscapeScale}) translate(-50%, -50%)`;
		}
	}
	
	// 모바일 스케일
	function scaleElementMobile() {
		const width = window.innerWidth;
		const height = window.innerHeight;  
	
		let portraitScale = (width - 50) / 1280;
		let landscapeScale = (height - 50) / 720;
	
		if (window.matchMedia("(orientation: landscape)").matches) {
		document.querySelector(targetLayout).style.transform =
			`scale(${landscapeScale})`;
		document.querySelector(targetLayoutPopStart).style.transform =
			`scale(${landscapeScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopLevel).style.transform =
			`scale(${landscapeScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopResult).style.transform =
			`scale(${landscapeScale}) translate(-50%, -50%)`;
		} else {
		document.querySelector(targetLayout).style.transform =
			`scale(${portraitScale})`;
		document.querySelector(targetLayoutPopStart).style.transform =
			`scale(${portraitScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopLevel).style.transform =
			`scale(${portraitScale}) translate(-50%, -50%)`;
		document.querySelector(targetLayoutPopResult).style.transform =
			`scale(${portraitScale}) translate(-50%, -50%)`;
		}
	}
	
	// 스마트폰 사이즈인지 체크
	function checkMobile() {
		if (!md.is('iPhone')) {
		if (window.matchMedia("(orientation: landscape)").matches) {
			return screen.height < 600
		} 
		if (window.matchMedia("(orientation: portrait)").matches) {
			return screen.width < 600
		}
		} else {
		return true;
		}
	}

	window.addEventListener('DOMContentLoaded', checkMobile() ? scaleElementMobile : scaleElementPC);
	window.addEventListener('resize', checkMobile() ? scaleElementMobile : scaleElementPC);

	doStart();

	reScale();
});