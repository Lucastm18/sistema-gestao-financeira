/*
========================================
 SISTEMA DE GESTÃO FINANCEIRA
 utils.js
 Funções auxiliares reutilizáveis
========================================
*/

const Utils = {

    /*
    ================================
    FORMATAR VALOR EM REAL
    ================================
    */

    moeda(valor) {
        const numero = Number(valor) || 0;

        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    },


    /*
    ================================
    FORMATAR DATA
    yyyy-mm-dd -> dd/mm/yyyy
    ================================
    */

    dataBR(data) {

        if (!data) {
            return "-";
        }

        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },


    /*
    ================================
    DATA ATUAL
    ================================
    */

    dataAtual() {

        const hoje = new Date();

        const ano = hoje.getFullYear();

        const mes = String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            hoje.getDate()
        ).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    },


    /*
    ================================
    CONVERTER VALOR PARA NÚMERO
    ================================
    */

    numero(valor) {

        if (
            valor === null ||
            valor === undefined ||
            valor === ""
        ) {
            return 0;
        }

        return Number(valor) || 0;
    },


    /*
    ================================
    SOMAR VALORES
    ================================
    */

    somar(lista, campo = "valor") {

        return lista.reduce((total, item) => {

            return total + this.numero(item[campo]);

        }, 0);
    },


    /*
    ================================
    ORDENAR POR DATA
    Mais recente primeiro
    ================================
    */

    ordenarPorData(lista) {

        return [...lista].sort((a, b) => {

            const dataA = new Date(
                `${a.data}T00:00:00`
            );

            const dataB = new Date(
                `${b.data}T00:00:00`
            );

            return dataB - dataA;
        });
    },


    /*
    ================================
    ESCAPAR HTML
    Evita que texto digitado pelo usuário
    seja interpretado como HTML.
    ================================
    */

    escaparHTML(texto) {

        const elemento =
            document.createElement("div");

        elemento.textContent =
            texto === null ||
            texto === undefined
                ? ""
                : String(texto);

        return elemento.innerHTML;
    }

};