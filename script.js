async function initStyleGuide() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // 1. DASHBOARD DE ESTATÍSTICAS
        const statsContainer = document.getElementById('stats');
        statsContainer.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p class="text-sm text-gray-500 uppercase font-bold">Regras CSS</p>
                <p class="text-3xl font-black text-blue-900">${data.rules.total}</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p class="text-sm text-gray-500 uppercase font-bold">Cores Únicas</p>
                <p class="text-3xl font-black text-blue-900">${data.colors.unique}</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p class="text-sm text-gray-500 uppercase font-bold">Tamanhos de Fonte</p>
                <p class="text-3xl font-black text-blue-900">${data.typography.fontSizes.length}</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p class="text-sm text-gray-500 uppercase font-bold">Peso Gzip</p>
                <p class="text-3xl font-black text-blue-900">${(data.meta.gzipBytes / 1024).toFixed(1)}KB</p>
            </div>
        `;

        // 2. PALETA DE CORES (Lendo data.colors.values)
        const colorContainer = document.getElementById('colors-container');
        colorContainer.innerHTML = ''; 
        data.colors.values.sort((a, b) => b.count - a.count).slice(0, 4).forEach(colorObj => {
            colorContainer.innerHTML += `
                <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition hover:scale-105">
                    <div class="swatch" style="background-color: ${colorObj.raw}; height: 60px;"></div>
                    <div class="p-3">
                        <p class="text-xs font-mono font-bold text-gray-800">${colorObj.raw.toUpperCase()}</p>
                        <p class="text-[10px] text-gray-400">${colorObj.count}x usado</p>
                    </div>
                </div>
            `;
        });

        // 3. TIPOGRAFIA (Com Filtro e Limite de 4)
const fontContainer = document.getElementById('fonts-container');
fontContainer.innerHTML = '';

// Lista de filtros (agora usando .includes para ignorar mesmo com aspas)
const ignoreFonts = ['VideoJS', 'inherit', 'flexslider-icon', 'sans,sans-serif'];

data.typography.fontFamilies
    .filter(f => {
        // Verifica se o nome da fonte contém alguma das palavras proibidas
        return !ignoreFonts.some(ignored => f.value.includes(ignored));
    })
    .slice(0, 4) // <--- ADICIONE ISSO PARA LIMITAR A 4 FONTES
    .forEach(f => {
        // Limpa as aspas do nome para exibir bonito
        const nomeLimpo = f.value.replace(/"/g, '');
        
        fontContainer.innerHTML += `
            <div class="bg-white p-4 rounded-xl border border-gray-100 mb-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        ${nomeLimpo === 'ioc_fonte' ? 'Museo (ioc_fonte)' : nomeLimpo}
                    </span>
                    <span class="text-[10px] text-gray-400 italic">${f.count}x no CSS</span>
                </div>
                <p style="font-family: ${f.value}" class="text-2xl text-gray-800">
                    Instituto Oswaldo Cruz - Fiocruz
                </p>
            </div>
        `;
    });
        // 4. ESCALA DE TAMANHOS (Font Sizes - Mostrando os 10 mais comuns)
        // Adicione uma div com id="sizes-container" no seu HTML se quiser ver isso
        const sizesContainer = document.getElementById('sizes-container');
        if (sizesContainer) {
            data.typography.fontSizes.sort((a, b) => b.count - a.count).slice(0, 4).forEach(s => {
                sizesContainer.innerHTML += `
                    <div class="flex items-center gap-4 border-b border-gray-50 py-2">
                        <span class="w-16 font-mono text-sm font-bold text-gray-600">${s.value}</span>
                        <div class="bg-blue-100 h-2 rounded" style="width: ${Math.min(s.count * 5, 200)}px"></div>
                        <span class="text-[10px] text-gray-400">${s.count}x</span>
                    </div>
                `;
            }
        )}

    } catch (error) {
        console.error("Erro:", error);
    }
}
initStyleGuide();