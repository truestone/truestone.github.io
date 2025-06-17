import { router } from './router.js';
import { glossaryData } from './data/glossary_data.js';
import { renderGlossary } from './renderer.js';

const quizExplanations = {
    'diligence-ethics-1-a': {
        isCorrect: false,
        text: '<strong>오답입니다.</strong> AI가 생성한 텍스트를 그대로 사용하는 것은 표절에 해당할 수 있으며, 내용의 정확성도 보장할 수 없습니다. AI는 최종 결과에 대한 책임이 없는 도구이므로, 모든 내용은 연구자 본인이 직접 검증하고 작성해야 합니다.'
    },
    'diligence-ethics-1-b': {
        isCorrect: true,
        text: '<strong>정답입니다.</strong> AI를 아이디어를 얻거나 초안을 잡는 보조 도구로 활용하되, 최종 결과물은 반드시 자신의 언어로 재구성하고 사실 관계를 검증해야 합니다. 또한, 학술지의 가이드라인에 따라 AI 활용 사실을 투명하게 밝히는 것이 윤리적인 연구 활동의 기본입니다.'
    }
};

function updateActiveNav(hash) {
    const cleanHash = hash.startsWith('#') ? hash : `#${hash}`;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === cleanHash) {
            link.classList.add('active');
        }
    });


    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.classList.remove('bg-slate-200', 'font-bold');
         if (link.getAttribute('href') === cleanHash) {
            link.classList.add('bg-slate-200', 'font-bold');
        }
    });
}

function applyTooltips(containerSelector = '#main-content') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const termsMap = new Map(glossaryData.map(item => [item.korean_term, item.description]));
    if (termsMap.size === 0) return;

    const regex = new RegExp(`\\b(${Array.from(termsMap.keys()).join('|')})\\b`, 'g');

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (node.parentElement.closest('script, style, button, a, pre, code, .tooltip-term, input, textarea, h1, h2, h3, h4, h5, h6')) {
                return NodeFilter.FILTER_REJECT;
            }
            if (regex.test(node.nodeValue)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
        const parent = node.parentNode;
        if (!parent) return;
        
        const newHtml = node.nodeValue.replace(regex, match => `<span class="tooltip-term">${match}</span>`);
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHtml;

        const fragment = document.createDocumentFragment();
        Array.from(tempDiv.childNodes).forEach(child => fragment.appendChild(child.cloneNode(true)));
        
        parent.replaceChild(fragment, node);
    });
}


function setupTooltipEvents() {
    let tooltipEl = document.getElementById('tooltip-popup');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'tooltip-popup';
        document.body.appendChild(tooltipEl);
    }
    
    const termsMap = new Map(glossaryData.map(item => [item.korean_term, item.description]));

    document.body.addEventListener('mouseover', e => {
        if (e.target.classList.contains('tooltip-term')) {
            const termText = e.target.textContent;
            const description = termsMap.get(termText);
            if (description) {
                tooltipEl.innerHTML = description;
                tooltipEl.style.display = 'block';

                const targetRect = e.target.getBoundingClientRect();
                
                let top = targetRect.bottom + window.scrollY + 8;
                let left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipEl.offsetWidth / 2);

                if (left < 10) left = 10;
                if (left + tooltipEl.offsetWidth > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipEl.offsetWidth - 10;
                }
                if (top + tooltipEl.offsetHeight > window.innerHeight + window.scrollY) {
                    top = targetRect.top + window.scrollY - tooltipEl.offsetHeight - 8;
                }

                tooltipEl.style.top = `${top}px`;
                tooltipEl.style.left = `${left}px`;
            }
        }
    });

    document.body.addEventListener('mouseout', e => {
        if (e.target.classList.contains('tooltip-term')) {
            tooltipEl.style.display = 'none';
        }
    });
}


async function handleNavigation() {
    const hash = window.location.hash || '#introduction';
    try {
        await router(hash);
    } catch(e) {
        console.error("Failed to load page content", e);
        const mainContent = document.getElementById('main-content');
        if(mainContent) {
            mainContent.innerHTML = `<p class="text-center text-red-500">페이지를 불러오는 데 실패했습니다.</p>`;
        }
    }
    
    updateActiveNav(hash);

    if (hash === '#glossary') {
        renderGlossary();
    }
    
    applyTooltips();
}

function setupEventListeners() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('#mobile-menu a, nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.addEventListener('click', async (e) => {
            const accordionHeader = e.target.closest('.accordion-header');
            if (accordionHeader) {
                const content = accordionHeader.nextElementSibling;
                const icon = accordionHeader.querySelector('i[data-lucide^=\\"chevron-\\"]');
                if (content && content.classList.contains('accordion-content')) {
                    content.classList.toggle('hidden');
                }
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
            }

            const copyBtn = e.target.closest('.copy-btn');
            if (copyBtn && !copyBtn.disabled) {
                const promptContainer = copyBtn.closest('.prompt-container');
                if(promptContainer) {
                    const pre = promptContainer.querySelector('pre');
                    if (pre) {
                        const textToCopy = pre.innerText;
                        try {
                            await navigator.clipboard.writeText(textToCopy);
                            const originalHTML = copyBtn.innerHTML;
                            copyBtn.innerHTML = `<i data-lucide=\\"check\\" class=\\"w-3.5 h-3.5\\"></i><span class=\\"ml-1.5\\">복사 완료!</span>`;
                            lucide.createIcons({ nodes: [copyBtn.querySelector('i')] }); 
                            
                            copyBtn.disabled = true;

                            setTimeout(() => {
                                copyBtn.innerHTML = originalHTML;
                                lucide.createIcons({ nodes: [copyBtn.querySelector('i')] });
                                copyBtn.disabled = false;
                            }, 2000);
                        } catch (err) {
                            console.error('Failed to copy text: ', err);
                            const span = copyBtn.querySelector('span');
                            if (span) span.textContent = '복사 실패';
                        }
                    }
                }
            }

            const quizOptionBtn = e.target.closest('.quiz-option');
            if (quizOptionBtn) {
                const scenarioDiv = quizOptionBtn.closest('.quiz-scenario');
                if (!scenarioDiv) return;

                const scenarioId = quizOptionBtn.dataset.scenario;
                const optionId = quizOptionBtn.dataset.option;
                
                scenarioDiv.querySelectorAll('.quiz-option').forEach(btn => {
                    btn.classList.remove('bg-blue-100', 'border-blue-500', 'ring-2', 'ring-blue-300');
                    btn.classList.add('hover:bg-slate-100');
                    btn.disabled = true;
                });

                quizOptionBtn.classList.add('bg-blue-100', 'border-blue-500', 'ring-2', 'ring-blue-300');
                quizOptionBtn.classList.remove('hover:bg-slate-100');

                const feedbackContainer = scenarioDiv.querySelector('.quiz-feedback');
                feedbackContainer.querySelectorAll('div[id^="feedback-"]').forEach(feedback => {
                    feedback.classList.add('hidden');
                });

                const feedbackToShow = feedbackContainer.querySelector(`#feedback-${scenarioId}-${optionId}`);
                if (feedbackToShow) {
                    feedbackToShow.classList.remove('hidden');
                    
                    const feedbackKey = `${scenarioId}-${optionId}`;
                    const explanationData = quizExplanations[feedbackKey];
                    if (explanationData) {
                        let explanationDiv = feedbackToShow.querySelector('.explanation-text');
                        if (!explanationDiv) {
                            explanationDiv = document.createElement('div');
                            explanationDiv.className = 'explanation-text mt-3 p-4 bg-slate-100 rounded-lg text-sm text-slate-700 leading-relaxed';
                            feedbackToShow.appendChild(explanationDiv);
                        }
                        explanationDiv.innerHTML = explanationData.text;
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setupEventListeners();
    setupTooltipEvents();
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
});

export { updateActiveNav };
