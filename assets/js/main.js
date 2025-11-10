/* Init EmailJS */
(() => {
	if (window.emailjs) {
		emailjs.init('79s25E4YDdEzL4eIi');
	}
})();

/* Mobile menu */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
	menuBtn.addEventListener('click', () => {
		mobileMenu.classList.toggle('hidden');
	});
	// Close on link click
	mobileMenu.querySelectorAll('a').forEach(a => {
		a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
	});
}

/* Smooth anchor scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', e => {
		const id = anchor.getAttribute('href');
		if (id && id !== '#') {
			e.preventDefault();
			document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});

/* Scroll progress - optimized with RAF */
const scrollProgress = document.getElementById('scrollProgress');
let rafId = null;
const setProgress = () => {
	const scrollTop = window.scrollY;
	const height = document.body.scrollHeight - window.innerHeight;
	const progress = Math.min(100, Math.max(0, (scrollTop / height) * 100));
	if (scrollProgress) scrollProgress.style.width = progress + '%';
};
const onScroll = () => {
	if (rafId) cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(setProgress);
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
	if (rafId) cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(setProgress);
}, { passive: true });
setProgress();

/* Typing effect */
const typingEl = document.getElementById('typing');
const typingPhrases = [
	"I'm a Full-Stack Developer",
	"I'm a UI/UX Designer",
        "I'm a Web Developer"
];
let typingIndex = 0;
let charIndex = 0;
let deleting = false;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const typingTick = () => {
	if (!typingEl) return;
	if (reduceMotion.matches) {
		typingEl.textContent = typingPhrases[0];
		return;
	}
	const phrase = typingPhrases[typingIndex];
	const nextText = phrase.slice(0, charIndex);
	typingEl.textContent = nextText || '\u00A0';
	if (!deleting) {
		if (charIndex < phrase.length) {
			charIndex++;
		} else {
			deleting = true;
			setTimeout(typingTick, 1400);
			return;
		}
	} else {
		if (charIndex > 0) {
			charIndex--;
		} else {
			deleting = false;
			typingIndex = (typingIndex + 1) % typingPhrases.length;
		}
	}
	setTimeout(typingTick, deleting ? 55 : 70);
};
typingTick();
reduceMotion.addEventListener('change', () => {
	charIndex = 0;
	typingIndex = 0;
	deleting = false;
	typingTick();
});

/* Cursor glow follow */
const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('pointermove', (e) => {
	if (!cursorGlow) return;
	cursorGlow.style.left = e.clientX + 'px';
	cursorGlow.style.top = e.clientY + 'px';
});

/* Particles background - optimized for performance */
(function initParticles() {
	const canvas = document.getElementById('particles');
	if (!canvas) return;
	const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
	let dpr = Math.min(window.devicePixelRatio || 1, 2);
	let w, h;
	let particles = [];
	let animId = null;
	let isVisible = !document.hidden;
	
	function resize() {
		w = canvas.clientWidth = canvas.offsetWidth;
		h = canvas.clientHeight = canvas.offsetHeight;
		canvas.width = Math.floor(w * dpr);
		canvas.height = Math.floor(h * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		// Recalculate particles on resize
		const colors = ['#8b5cf6', '#14b8a6', '#60a5fa'];
		const count = Math.min(60, Math.floor((w * h) / 25000));
		particles = new Array(count).fill(0).map(() => ({
			x: Math.random() * w,
			y: Math.random() * h,
			r: Math.random() * 1.5 + 0.5,
			vx: (Math.random() - 0.5) * 0.25,
			vy: (Math.random() - 0.5) * 0.25,
			c: colors[Math.floor(Math.random() * colors.length)]
		}));
	}
	
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(resize, 150);
	}, { passive: true });
	resize();
	
	// Pause when tab is hidden
	document.addEventListener('visibilitychange', () => {
		isVisible = !document.hidden;
		if (isVisible && !animId) {
			frame();
		} else if (!isVisible && animId) {
			cancelAnimationFrame(animId);
			animId = null;
		}
	});
	
	function frame() {
		if (!isVisible) return;
		ctx.clearRect(0, 0, w, h);
		for (const p of particles) {
			p.x += p.vx; p.y += p.vy;
			if (p.x < 0 || p.x > w) p.vx *= -1;
			if (p.y < 0 || p.y > h) p.vy *= -1;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			ctx.fillStyle = p.c + 'aa';
			ctx.fill();
		}
		animId = requestAnimationFrame(frame);
	}
	if (isVisible) frame();
})();

/* Circular charts setup */
document.querySelectorAll('.circular-chart').forEach(el => {
	const value = Number(el.getAttribute('data-value') || '0');
	const deg = Math.max(0, Math.min(100, value)) / 100 * 360 + 'deg';
	el.style.setProperty('--progress', deg);
});

/* GSAP animations - optimized */
if (window.gsap) {
	gsap.registerPlugin(ScrollTrigger);
	// Honor reduced motion
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const baseEase = 'power2.out';
	const yAmt = prefersReduced ? 0 : 20;
	const dur = prefersReduced ? 0.01 : 0.6;
	// Hero entrance once
	gsap.from('h1', { opacity: 0, y: yAmt, duration: dur, ease: baseEase });
	gsap.from('#heroFrame', { opacity: 0, y: yAmt + 6, duration: dur + 0.1, delay: .05, ease: baseEase });
	// Section reveals (once) - optimized with refreshPriority
	document.querySelectorAll('section').forEach((sec) => {
		const targets = sec.querySelectorAll('.section-title, .glass-card, .service-card, .project-card');
		if (!targets.length) return;
		gsap.from(targets, {
			scrollTrigger: { 
				trigger: sec, 
				start: 'top 78%', 
				once: true,
				refreshPriority: -1
			},
			y: yAmt + 4,
			opacity: 0,
			duration: dur,
			stagger: 0.04,
			ease: baseEase,
			clearProps: 'all'
		});
	});
	// Batch ScrollTrigger refresh for better performance
	ScrollTrigger.config({ limitCallbacks: true, syncInterval: 16 });
}

/* Tilt effect for hero frame and project cards - optimized with RAF */
function addTilt(el, max = 10) {
	if (!el) return;
	if (!window.matchMedia('(pointer:fine)').matches) return;
	let bounds = el.getBoundingClientRect();
	let tiltRaf = null;
	let currentX = 0, currentY = 0;
	let targetX = 0, targetY = 0;
	function updateTilt() {
		currentX += (targetX - currentX) * 0.15;
		currentY += (targetY - currentY) * 0.15;
		el.style.transform = `perspective(900px) rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
		if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
			tiltRaf = requestAnimationFrame(updateTilt);
		}
	}
	function onMove(e) {
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		targetY = ((y / bounds.height) - 0.5) * -2 * max * 0.7;
		targetX = ((x / bounds.width) - 0.5) * 2 * max * 0.7;
		if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
	}
	function onLeave() {
		targetX = 0;
		targetY = 0;
		if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
	}
	el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); }, { passive: true });
	el.addEventListener('mousemove', onMove, { passive: true });
	el.addEventListener('mouseleave', onLeave, { passive: true });
}
addTilt(document.getElementById('heroFrame'), 8);
document.querySelectorAll('.project-card').forEach(card => addTilt(card, 6));

/* Project modals */
const openModal = id => document.getElementById(id)?.classList.add('open');
const closeModals = () => document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
document.querySelectorAll('.project-card').forEach(card => {
	const id = card.getAttribute('data-modal');
	card.querySelectorAll('button').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (id) openModal(id);
		});
	});
	card.addEventListener('click', (e) => {
		// Click on card media also opens
		if ((e.target).closest('a')) return;
		if (id) openModal(id);
	});
});
document.querySelectorAll('.modal').forEach(modal => {
	modal.addEventListener('click', (e) => {
		if (e.target === modal) modal.classList.remove('open');
	});
	modal.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeModals));
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });

/* EmailJS form */
const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');
if (form) {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		if (!window.emailjs) return;
		statusText.textContent = 'Sending...';
		const data = {
			from_name: form.name.value,
			from_email: form.email.value,
			message: form.message.value
		};
		try {
			await emailjs.send('service_5ek6g2a', 'template_6nzb9kf', data, '79s25E4YDdEzL4eIi');
			statusText.textContent = 'Thank you! Your message has been sent.';
			form.reset();
		} catch (err) {
			statusText.textContent = 'Something went wrong. Please try again later.';
		}
	});
}


