async function initStyleGuide() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // 1. DASHBOARD DE ESTATÍSTICAS
        const statsContainer = document.getElementById('stats');
        const stats = [
            { label: 'Total de Regras', value: data.rules.total },
            { label: 'Seletores Únicos', value: data.selectors.total },
            { label: 'Declarations', value: data.declarations.total },
            { label: 'Tamanho (Gzip)', value: (data.meta.gzipBytes / 1024).toFixed(2) + ' KB' }
        ];

        stats.forEach(s => {
            statsContainer.innerHTML += `
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p class="text-sm text-gray-500 uppercase font-bold">${s.label}</p>
                    <p class="text-3xl font-black text-blue-900">${s.value}</p>
                </div>
            `;
        });

        // 2. PROCESSAR CORES ÚNICAS (Background-color)
        const bgColors = data.declarations.properties['background-color'] || [];
        const uniqueColors = [...new Set(bgColors)].filter(c => c.startsWith('#')); // Apenas Hex únicos

        const colorContainer = document.getElementById('colors-container');
        uniqueColors.slice(0, 18).forEach(color => { // Limitando as 18 primeiras para não poluir
            colorContainer.innerHTML += `
                <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div class="swatch" style="background-color: ${color}"></div>
                    <div class="p-3 text-center">
                        <span class="text-xs font-mono font-bold text-gray-600">${color.toUpperCase()}</span>
                    </div>
                </div>
            `;
        });

        // 3. PROCESSAR FONTES
        const fontFamilies = data.declarations.properties['font-family'] || [];
        const uniqueFonts = [...new Set(fontFamilies)];

        const fontContainer = document.getElementById('fonts-container');
        uniqueFonts.forEach(font => {
            fontContainer.innerHTML += `
                <div class="bg-white p-6 rounded-xl border border-gray-100">
                    <p class="text-gray-400 text-xs mb-2 font-mono">${font}</p>
                    <p style="font-family: ${font}" class="text-xl">O rato roeu a roupa do rei de Roma. (1234567890)</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar o JSON:", error);
        document.body.innerHTML += '<p class="text-red-500 p-8">Erro ao carregar data.json. Verifique se o arquivo está no repositório.</p>';
    }
}

initStyleGuide();