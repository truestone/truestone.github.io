import { renderGlossary } from './renderer.js';
import { renderPrompts } from './renderer.js';

const routes = {
    '#introduction': 'pages/introduction.html',
    '#core_principles': 'pages/core_principles.html',
    '#4d_framework': 'pages/4d_framework.html',
    '#delegation': 'pages/delegation.html',
    '#description': 'pages/description.html',
    '#discernment': 'pages/discernment.html',
    '#diligence': 'pages/diligence.html',
    '#use_cases': 'pages/use_cases_korea.html',
    '#prompt_library': 'pages/prompt_library.html',
    '#glossary': 'pages/glossary.html',
};

async function loadContent(path) {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`페이지를 찾을 수 없습니다: ${response.statusText}`);
        }
        mainContent.innerHTML = await response.text();
        lucide.createIcons();

        if (path.includes('glossary')) {
            renderGlossary();
        } else if (path.includes('prompt_library')) {
            renderPrompts();
        } else if (path.includes('4d_framework')) {
            setup4dFrameworkLinks();
        }

    } catch (error) {
        mainContent.innerHTML = `<div class="text-center py-20">
            <h1 class="text-2xl font-bold text-red-600">오류 발생</h1>
            <p class="mt-4 text-slate-600">${error.message}</p>
            <a href="#introduction" class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">홈으로 돌아가기</a>
        </div>`;
    }
}

function setup4dFrameworkLinks() {
    document.querySelectorAll('.framework-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            if (target) {
                window.location.hash = target;
            }
        });
    });
}

function router(hash) {
    const path = routes[hash] || routes['#introduction'];
    loadContent(path);
}

export { router };
