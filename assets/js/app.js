/*
========================================
 SISTEMA DE GESTÃO FINANCEIRA
 app.js
 Funções gerais e Dashboard
========================================
*/

document.addEventListener("DOMContentLoaded", function () {

    /*
    ====================================
    PROTEGER PÁGINA
    ====================================
    */

    Auth.protegerPagina();


    /*
    ====================================
    USUÁRIO LOGADO
    ====================================
    */

    const usuario = Auth.usuarioAtual();

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    if (nomeUsuario && usuario) {
        nomeUsuario.textContent = usuario.nome;
    }


    /*
    ====================================
    BOTÃO SAIR
    ====================================
    */

    const btnSair =
        document.getElementById("btnSair");

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            function () {
                Auth.logout();
            }
        );

    }


    /*
    ====================================
    DASHBOARD
    ====================================
    */

    carregarDashboard();

});


/*
========================================
 CARREGAR DASHBOARD
========================================
*/

function carregarDashboard() {

    const elementoReceitas =
        document.getElementById("totalReceitas");

    /*
    Se não existir esse elemento,
    significa que não estamos no Dashboard.
    */

    if (!elementoReceitas) {
        return;
    }

    const usuarioId = Auth.usuarioId();

    const receitas = Storage.listarDoUsuario(
        "receitas",
        usuarioId
    );

    const despesas = Storage.listarDoUsuario(
        "despesas",
        usuarioId
    );

    /*
    ====================================
    CALCULAR TOTAIS
    ====================================
    */

    const totalReceitas =
        Utils.somar(receitas);

    const totalDespesas =
        Utils.somar(despesas);

    const saldo =
        totalReceitas - totalDespesas;

    /*
    ====================================
    GRÁFICO
    ====================================
    */

    carregarGrafico(
        totalReceitas,
        totalDespesas
    );

    /*
    ====================================
    EXIBIR TOTAIS
    ====================================
    */

    elementoReceitas.textContent =
        Utils.moeda(totalReceitas);


    const elementoDespesas =
        document.getElementById("totalDespesas");

    const elementoSaldo =
        document.getElementById("saldoAtual");


    if (elementoDespesas) {

        elementoDespesas.textContent =
            Utils.moeda(totalDespesas);

    }


    if (elementoSaldo) {

        elementoSaldo.textContent =
            Utils.moeda(saldo);


        if (saldo < 0) {

            elementoSaldo.classList.add(
                "resultado-negativo"
            );

        } else {

            elementoSaldo.classList.add(
                "resultado-positivo"
            );

        }

    }


    /*
    ====================================
    MOVIMENTAÇÕES
    ====================================
    */

    carregarMovimentacoes(
        receitas,
        despesas
    );

}


/*
========================================
 ÚLTIMAS MOVIMENTAÇÕES
========================================
*/

function carregarMovimentacoes(
    receitas,
    despesas
) {

    const tabela =
        document.getElementById(
            "tabelaMovimentacoes"
        );


    if (!tabela) {
        return;
    }


    /*
    Adicionamos um campo "tipo"
    temporariamente para identificar
    Receita ou Despesa.
    */

    const listaReceitas =
        receitas.map(item => ({
            ...item,
            tipo: "Receita"
        }));


    const listaDespesas =
        despesas.map(item => ({
            ...item,
            tipo: "Despesa"
        }));


    let movimentacoes = [
        ...listaReceitas,
        ...listaDespesas
    ];


    /*
    Ordenar pelas movimentações
    mais recentes.
    */

    movimentacoes =
        Utils.ordenarPorData(
            movimentacoes
        );


    /*
    Mostrar somente as 5 últimas.
    */

    movimentacoes =
        movimentacoes.slice(0, 5);


    /*
    Nenhum registro
    */

    if (movimentacoes.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="tabela-vazia"
                >
                    Nenhuma movimentação cadastrada.
                </td>

            </tr>

        `;

        return;
    }


    /*
    ====================================
    MONTAR TABELA
    ====================================
    */

    tabela.innerHTML =
    movimentacoes.map(item => {

        /*
        ====================================
        TIPO DA MOVIMENTAÇÃO
        ====================================
        */

        const ehReceita =
            item.tipo === "Receita";


        const classeTipo =
            ehReceita
                ? "tipo-receita"
                : "tipo-despesa";


        const icone =
            ehReceita
                ? "↑"
                : "↓";


        /*
        ====================================
        VALOR
        ====================================
        */

        const classeValor =
            ehReceita
                ? "valor-receita"
                : "valor-despesa";


        const valorExibido =
            ehReceita
                ? "+ " + Utils.moeda(item.valor)
                : "- " + Utils.moeda(item.valor);


        /*
        ====================================
        STATUS
        ====================================
        */

        const status =
            Utils.escaparHTML(
                item.status
            );


        const classeStatus =
            status === "Pendente"

                ? "status-pendente"

                : ehReceita

                    ? "status-recebido"

                    : "status-pago";


        /*
        ====================================
        LINHA DA TABELA
        ====================================
        */

        return `

            <tr>

                <td>

                    <div class="tipo-movimentacao">

                        <span
                            class="icone-movimentacao ${classeTipo}"
                        >
                            ${icone}
                        </span>

                        <strong class="${classeTipo}">
                            ${Utils.escaparHTML(
                                item.tipo
                            )}
                        </strong>

                    </div>

                </td>


                <td>
                    ${Utils.escaparHTML(
                        item.descricao
                    )}
                </td>


                <td>
                    ${Utils.escaparHTML(
                        item.categoria
                    )}
                </td>


                <td>
                    ${Utils.dataBR(
                        item.data
                    )}
                </td>


                <td>

                    <strong class="${classeValor}">
                        ${valorExibido}
                    </strong>

                </td>


                <td>

                    <span
                        class="status ${classeStatus}"
                    >
                        ${status}
                    </span>

                </td>

            </tr>

        `;

    }).join("");

}

/*
    ========================================
    GRÁFICO RECEITAS X DESPESAS
    ========================================
    */

    function carregarGrafico(
        totalReceitas,
        totalDespesas
    ) {

        const barraReceitas =
            document.getElementById(
                "barraReceitas"
            );

        const barraDespesas =
            document.getElementById(
                "barraDespesas"
            );


        /*
        Se não estamos no Dashboard,
        não executa.
        */

        if (
            !barraReceitas ||
            !barraDespesas
        ) {
            return;
        }


        /*
        ====================================
        VALORES
        ====================================
        */

        const valorReceitas =
            document.getElementById(
                "graficoValorReceitas"
            );

        const valorDespesas =
            document.getElementById(
                "graficoValorDespesas"
            );


        valorReceitas.textContent =
            "+" + Utils.moeda(totalReceitas);


        valorDespesas.textContent =
            "-" + Utils.moeda(totalDespesas);


        /*
        ====================================
        CALCULAR TAMANHO DAS BARRAS
        ====================================
        */

        const maiorValor =
            Math.max(
                totalReceitas,
                totalDespesas
            );


        let porcentagemReceitas = 0;
        let porcentagemDespesas = 0;


        if (maiorValor > 0) {

            porcentagemReceitas =
                (
                    totalReceitas /
                    maiorValor
                ) * 100;


            porcentagemDespesas =
                (
                    totalDespesas /
                    maiorValor
                ) * 100;

        }


        /*
        ====================================
        ANIMAÇÃO DAS BARRAS
        ====================================
        */

        barraReceitas.style.width = "0%";
        barraDespesas.style.width = "0%";


        setTimeout(
            function () {

                barraReceitas.style.width =
                    porcentagemReceitas + "%";


                barraDespesas.style.width =
                    porcentagemDespesas + "%";

            },
            100
        );


        /*
        ====================================
        MAIOR MOVIMENTAÇÃO
        ====================================
        */

        const maiorMovimentacao =
            document.getElementById(
                "maiorMovimentacao"
            );


        if (
            totalReceitas === 0 &&
            totalDespesas === 0
        ) {

            maiorMovimentacao.textContent =
                "Nenhuma movimentação";

            maiorMovimentacao.className = "";

        }
        
        else if (
            totalReceitas >=
            totalDespesas
        ) {

            maiorMovimentacao.textContent =
                "Receitas";

            maiorMovimentacao.className =
                "valor-receita";

        }

        else {

            maiorMovimentacao.textContent =
                "Despesas";

            maiorMovimentacao.className =
                "valor-despesa";

        }

    }