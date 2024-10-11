let chart;
const categorias = ["Alimentação", "Infraestrutura", "Marketing", "Pessoal", "Recepção", "Transporte", "Brindes", "Decoração", "Ministro", "Outros"];

// Função para formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Função para calcular e atualizar o valor total da linha
function calcularValorTotalLinha(linha) {
    const quantidade = parseFloat(linha.querySelector('.quantidade').value) || 0;
    const valorUnitario = parseFloat(linha.querySelector('.valor-unitario').value) || 0;
    const valorTotal = quantidade * valorUnitario;
    linha.querySelector('.valor-total').textContent = formatarMoeda(valorTotal);

    calcularCustoTotal();
    atualizarResumoFinanceiro();
    atualizarGraficoEDados();
    salvarDados();
}

// Função para adicionar um novo custo à tabela
function adicionarCusto() {
    const descricao = document.getElementById('novaDescricao').value;
    const categoria = document.getElementById('novaCategoria').value || "Outros";
    const quantidade = document.getElementById('novaQuantidade').value;
    const valorUnitario = document.getElementById('novoValorUnitario').value;

    adicionarCustoTabela(descricao, categoria, quantidade, valorUnitario);

    document.getElementById('novaDescricao').value = "";
    document.getElementById('novaCategoria').value = "";
    document.getElementById('novaQuantidade').value = 1;
    document.getElementById('novoValorUnitario').value = "";
}

function adicionarCustoTabela(descricao, categoria, quantidade, valorUnitario) {
    const tableBody = document.getElementById('custosTable').querySelector('tbody');
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td>${descricao}</td>
        <td>${categoria}</td>
        <td><input type="number" class="form-control quantidade" value="${quantidade}"></td>
        <td><input type="number" class="form-control valor-unitario" value="${valorUnitario}"></td>
        <td class="valor-total">${formatarMoeda(quantidade * valorUnitario)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removerLinha(this)">Remover</button></td>
    `;

    newRow.querySelectorAll('.quantidade, .valor-unitario').forEach(input => {
        input.addEventListener('input', () => calcularValorTotalLinha(newRow));
    });

    calcularCustoTotal();
    atualizarResumoFinanceiro();
    atualizarGraficoEDados();
    salvarDados();
}

// Função para remover uma linha da tabela de custos
function removerLinha(botao) {
    const row = botao.parentNode.parentNode;
    row.remove();
    calcularCustoTotal();
    atualizarResumoFinanceiro();
    atualizarGraficoEDados();
    salvarDados();
}

function calcularCustoTotal() {
    let custoTotal = 0;
    document.querySelectorAll('.valor-total').forEach(el => {
        custoTotal += parseFloat(el.textContent.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    });
    document.getElementById("custoTotal").textContent = formatarMoeda(custoTotal);
    document.getElementById("resumoCustos").textContent = formatarMoeda(custoTotal);
    return custoTotal;
}

function calcularTransporte() {
    const numPassageiros = parseInt(document.getElementById("numPassageiros").value) || 0;
    const passageirosPorVeiculo = parseInt(document.getElementById("passageirosPorVeiculo").value) || 1;
    const custoPorVeiculo = parseFloat(document.getElementById("custoPorVeiculo").value) || 0;

    const numVeiculos = Math.ceil(numPassageiros / passageirosPorVeiculo);
    const custoTotalTransporte = numVeiculos * custoPorVeiculo;

    document.getElementById("custoTransporte").textContent = formatarMoeda(custoTotalTransporte);
    adicionarTransporteATabela(custoTotalTransporte);
    salvarDados();
}

function adicionarTransporteATabela(custoTotalTransporte) {
    const tableBody = document.getElementById('custosTable').querySelector('tbody');
    let transporteRow = tableBody.querySelector('[data-descricao="Transporte"]');

    if (!transporteRow) {
        transporteRow = tableBody.insertRow();
        transporteRow.dataset.descricao = "Transporte";

        transporteRow.innerHTML = `
            <td>Transporte</td>
            <td>Transporte</td>
            <td><input type="number" class="form-control quantidade" value="1" disabled></td>
            <td><input type="number" class="form-control valor-unitario" value="${custoTotalTransporte}" disabled></td>
            <td class="valor-total"></td>
            <td><button class="btn btn-danger btn-sm" onclick="removerLinha(this)">Remover</button></td>
        `;
    }

    transporteRow.querySelector('.valor-total').textContent = formatarMoeda(custoTotalTransporte);
    calcularCustoTotal();
    salvarDados();
}

function calcularAlimentacao() {
    const numParticipantes = parseInt(document.getElementById("numParticipantesGeral").value) || 0;
    const custoAlmoco = parseFloat(document.getElementById("custoAlmoco").value) || 0;
    const custoJanta = parseFloat(document.getElementById("custoJanta").value) || 0;
    const custoLanche = parseFloat(document.getElementById("custoLanche").value) || 0;

    const custoTotalAlimentacao = numParticipantes * (custoAlmoco + custoJanta + custoLanche);

    document.getElementById("custoAlimentacao").textContent = formatarMoeda(custoTotalAlimentacao);

    adicionarAlimentacaoATabela(custoTotalAlimentacao);

    salvarDados();
}

function adicionarAlimentacaoATabela(custoTotalAlimentacao) {
    const tableBody = document.getElementById('custosTable').querySelector('tbody');
    let alimentacaoRow = tableBody.querySelector('[data-descricao="Alimentação"]');

    if (!alimentacaoRow) {
        alimentacaoRow = tableBody.insertRow();
        alimentacaoRow.dataset.descricao = "Alimentação";
        alimentacaoRow.innerHTML = `
            <td>Alimentação</td>
            <td>Alimentação</td>
            <td><input type="number" class="form-control quantidade" value="1" disabled></td>
            <td><input type="number" class="form-control valor-unitario" value="${custoTotalAlimentacao}" disabled></td>
            <td class="valor-total"></td>
            <td><button class="btn btn-danger btn-sm" onclick="removerLinha(this)">Remover</button></td>
        `;
    }

    alimentacaoRow.querySelector('.valor-total').textContent = formatarMoeda(custoTotalAlimentacao);
    calcularCustoTotal();
    salvarDados();
}

function calcularTotalReceitas() {
    const numParticipantes = parseInt(document.getElementById("numParticipantesGeral").value) || 0;
    const valorInscricao = parseFloat(document.getElementById("valorInscricao").value) || 0;
    const outrasReceitas = parseFloat(document.getElementById("outrasReceitas").value) || 0;

    const receitaInscricoes = numParticipantes * valorInscricao;
    const receitaTotal = receitaInscricoes + outrasReceitas;

    document.getElementById("receitaTotal").textContent = formatarMoeda(receitaTotal);
    document.getElementById("resumoReceitas").textContent = formatarMoeda(receitaTotal);

    const custoTotal = calcularCustoTotal();
    const lucroPrejuizo = receitaTotal - custoTotal;

    document.getElementById("lucro").textContent = formatarMoeda(Math.max(0, lucroPrejuizo));
    document.getElementById("prejuizo").textContent = formatarMoeda(-Math.min(0, lucroPrejuizo));


    const ticketMedio = custoTotal / numParticipantes || 0;
    document.getElementById("ticketMedio").textContent = formatarMoeda(ticketMedio);

    atualizarResumoFinanceiro(receitaTotal, lucroPrejuizo, valorInscricao);
    salvarDados();
}

function atualizarResumoFinanceiro(receitaTotal = 0, lucroPrejuizo = 0, valorInscricao = 0) {
    const custoTotal = parseFloat(document.getElementById("resumoCustos").textContent.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const numParticipantes = parseInt(document.getElementById("numParticipantesGeral").value) || 0;
    const ticketMedio = custoTotal / numParticipantes || 0;
    const ticketMedioElement = document.getElementById("ticketMedio");


    document.getElementById("resumoReceitas").textContent = formatarMoeda(receitaTotal);
    document.getElementById("valorInscricaoMostra").textContent = formatarMoeda(valorInscricao);

    if (lucroPrejuizo >= 0) {
        document.getElementById("resumoLucro").textContent = formatarMoeda(lucroPrejuizo);
        document.getElementById("resumoPrejuizo").textContent = formatarMoeda(0);
    } else {
        document.getElementById("resumoLucro").textContent = formatarMoeda(0);
        document.getElementById("resumoPrejuizo").textContent = formatarMoeda(Math.abs(lucroPrejuizo));
    }


    ticketMedioElement.textContent = formatarMoeda(ticketMedio);
    if (valorInscricao !== null && valorInscricao !== 0 && numParticipantes > 0 && ticketMedio > valorInscricao) {
        ticketMedioElement.classList.add("text-danger");
        const ticketMinimoLucro = (custoTotal / numParticipantes);
        document.getElementById("ticketMinimoLucro").textContent = formatarMoeda(ticketMinimoLucro);
    } else {
        ticketMedioElement.classList.remove("text-danger");
        document.getElementById("ticketMinimoLucro").textContent = "-";
    }
}


function atualizarGraficoEDados() {
    const labels = [];
    const data = [];

    const linhas = document.querySelectorAll('#custosTable tbody tr');
    linhas.forEach(linha => {
        const categoria = linha.querySelectorAll('td')[1].textContent;
        let valor = parseFloat(linha.querySelector('.valor-total').textContent.replace('R$', '').replace('.', '').replace(',', '.'));
        if (isNaN(valor)) {
            valor = 0;
        }

        const index = labels.indexOf(categoria);
        if (index === -1) {
            labels.push(categoria);
            data.push(valor);
        } else {
            data[index] += valor;
        }
    });

    atualizarGrafico(labels, data);
}

function atualizarGrafico(labels, data) {
    const ctx = document.getElementById('myChart');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: gerarCores(data.length)
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Custos'
                }
            }
        }
    });
}

function gerarCores(quantidade) {
    const cores = [];
    for (let i = 0; i < quantidade; i++) {
        cores.push(`hsl(${i * 360 / quantidade}, 70%, 60%)`);
    }
    return cores;
}

function salvarDados() {
    const dados = {
        custos: [],
        numParticipantes: parseInt(document.getElementById("numParticipantesGeral").value) || 0,
        valorInscricao: parseFloat(document.getElementById("valorInscricao").value) || 0,
        outrasReceitas: parseFloat(document.getElementById("outrasReceitas").value) || 0,
        numPassageiros: parseInt(document.getElementById("numPassageiros").value) || 0,
        passageirosPorVeiculo: parseInt(document.getElementById("passageirosPorVeiculo").value) || 1,
        custoPorVeiculo: parseFloat(document.getElementById("custoPorVeiculo").value) || 0,
        custoAlmoco: parseFloat(document.getElementById("custoAlmoco").value) || 0,
        custoJanta: parseFloat(document.getElementById("custoJanta").value) || 0,
        custoLanche: parseFloat(document.getElementById("custoLanche").value) || 0
    };

    const linhasCustos = document.querySelectorAll('#custosTable tbody tr');
    linhasCustos.forEach(linha => {
        dados.custos.push({
            descricao: linha.cells[0].textContent,
            categoria: linha.cells[1].textContent,
            quantidade: parseFloat(linha.querySelector('.quantidade').value) || 0,
            valorUnitario: parseFloat(linha.querySelector('.valor-unitario').value) || 0
        });
    });

    localStorage.setItem('dadosOrcamento', JSON.stringify(dados));
}

function carregarDados() {
    const dadosString = localStorage.getItem('dadosOrcamento');

    if (dadosString) {
        const dados = JSON.parse(dadosString);

        document.getElementById("numParticipantesGeral").value = dados.numParticipantes;
        document.getElementById("valorInscricao").value = dados.valorInscricao;
        document.getElementById("outrasReceitas").value = dados.outrasReceitas;
        document.getElementById("numPassageiros").value = dados.numPassageiros;
        document.getElementById("passageirosPorVeiculo").value = dados.passageirosPorVeiculo;
        document.getElementById("custoPorVeiculo").value = dados.custoPorVeiculo;
        document.getElementById("custoAlmoco").value = dados.custoAlmoco;
        document.getElementById("custoJanta").value = dados.custoJanta;
        document.getElementById("custoLanche").value = dados.custoLanche;

        const tableBody = document.getElementById('custosTable').querySelector('tbody');
        tableBody.innerHTML = '';

        dados.custos.forEach(custo => {
            adicionarCustoTabelaCarregada(custo);
        });

        calcularCustoTotal();
        calcularTotalReceitas();
        calcularTransporte();
        calcularAlimentacao();
        atualizarGraficoEDados();
    }
}


function adicionarCustoTabelaCarregada(custo) {
    const tableBody = document.getElementById('custosTable').querySelector('tbody');
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td>${custo.descricao}</td>
        <td>${custo.categoria}</td>
        <td><input type="number" class="form-control quantidade" value="${custo.quantidade}"></td>
        <td><input type="number" class="form-control valor-unitario" value="${custo.valorUnitario}"></td>
        <td class="valor-total">${formatarMoeda(custo.quantidade * custo.valorUnitario)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removerLinha(this)">Remover</button></td>
    `;

    newRow.querySelectorAll('.quantidade, .valor-unitario').forEach(input => {
        input.addEventListener('input', () => calcularValorTotalLinha(newRow));
    });


    if (custo.descricao === "Transporte" || custo.descricao === "Alimentação") {
        newRow.querySelectorAll('input').forEach(input => input.disabled = true);
    }
}


window.addEventListener('load', carregarDados);


document.getElementById('numParticipantesGeral').addEventListener('input', () => {
    calcularTotalReceitas();
    calcularTransporte();
    calcularAlimentacao();
    salvarDados();
});

document.querySelectorAll('#custosTable input').forEach(input => input.addEventListener('input', () => {
    calcularCustoTotal();
    atualizarGraficoEDados();
    salvarDados();
}));

document.getElementById('valorInscricao').addEventListener('input', () => {
    calcularTotalReceitas();
    salvarDados();
});

document.getElementById('outrasReceitas').addEventListener('input', () => {
    calcularTotalReceitas();
    salvarDados();
});

document.getElementById('numPassageiros').addEventListener('input', () => {
    calcularTransporte();
    salvarDados();
});

document.getElementById('passageirosPorVeiculo').addEventListener('input', () => {
    calcularTransporte();
    salvarDados();
});

document.getElementById('custoPorVeiculo').addEventListener('input', () => {
    calcularTransporte();
    salvarDados();
});

document.getElementById('custoAlmoco').addEventListener('input', () => {
    calcularAlimentacao();
    salvarDados();
});

document.getElementById('custoJanta').addEventListener('input', () => {
    calcularAlimentacao();
    salvarDados();
});

document.getElementById('custoLanche').addEventListener('input', () => {
    calcularAlimentacao();
    salvarDados();
});


atualizarResumoFinanceiro();
atualizarGraficoEDados();
