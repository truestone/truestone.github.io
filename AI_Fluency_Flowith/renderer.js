import { glossaryData } from './data/glossary_data.js';
import { promptsData } from './data/prompts_data.js';

function renderGlossary() {
    const container = document.getElementById('glossary-container');
    const searchInput = document.getElementById('glossary-search');
    if (!container) return;

    const render = (data) => {
        if (data.length === 0) {
            container.innerHTML = `<p class="text-center text-slate-500 py-8">검색 결과가 없습니다.</p>`;
            return;
        }
        container.innerHTML = data.map(item => `
            <div class="content-card p-6 mb-6 prose max-w-none">
                <h3 class="!text-xl !font-bold !text-blue-700 !mt-0 !mb-2">${item.korean_term} <span class="text-base font-normal text-slate-500 ml-2">${item.term}</span></h3>
                <p class="!text-slate-700 !mb-4 !mt-0">${item.description}</p>
                <div class="bg-slate-100 p-4 rounded-lg not-prose">
                    <p class="font-bold text-sm text-slate-600 mb-2">활용 예시 (한국 대학 환경)</p>
                    <p class="text-slate-600 text-sm leading-relaxed">${item.example.replace(new RegExp('\\\\n', 'g'), '<br>')}</p>
                </div>
            </div>
        `).join('');
    };

    render(glossaryData);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filteredData = glossaryData.filter(item =>
                item.korean_term.toLowerCase().includes(query) ||
                item.term.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.example.toLowerCase().includes(query)
            );
            render(filteredData);
        });
    }
}


function renderPrompts() {
    const container = document.getElementById('prompt-library-container');
    if (!container) return;

    if (!promptsData || promptsData.length === 0) {
        container.innerHTML = `<div class="text-center py-10"><p>준비된 프롬프트가 없습니다.</p></div>`;
        return;
    }

    let html = '';
    promptsData.forEach(category => {
        html += `<div class="mb-12">`;
        html += `<h2 class="section-title !text-2xl !border-blue-500 !mb-6 flex items-center"><i data-lucide="${category.icon}" class="w-7 h-7 mr-3 text-blue-600"></i>${category.category}</h2>`;
        
        category.prompts.forEach(prompt => {
            html += `
                <div class="content-card p-6 mb-4 prompt-container">
                    <h4 class="text-lg font-semibold text-blue-800 mb-2">${prompt.title}</h4>
                    <div class="bg-slate-100 p-4 rounded-lg relative">
                        <pre class="text-slate-700 font-mono text-sm whitespace-pre-wrap">${prompt.prompt}</pre>
                    </div>
                    <div class="mt-4 flex justify-between items-center gap-4">
                         <p class="text-sm text-slate-500 flex-1"><strong class="font-semibold text-slate-600">활용 팁:</strong> ${prompt.tip}</p>
                         <button class="copy-btn btn-primary !py-1.5 !px-3 !text-xs flex items-center shrink-0">
                            <i data-lucide="copy" class="w-3.5 h-3.5"></i><span class="ml-1.5">복사하기</span>
                         </button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    });
    
    container.innerHTML = html;
    lucide.createIcons();
}


export { renderGlossary, renderPrompts };
