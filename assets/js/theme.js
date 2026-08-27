/*
========================================
 SISTEMA DE GESTÃO FINANCEIRA
 theme.js
 Controle do tema claro / escuro
========================================
*/

const Theme = {

    chave: "sgf_tema",


    /*
    ================================
    INICIAR
    ================================
    */

    iniciar() {

        const temaSalvo =
            localStorage.getItem(
                this.chave
            ) || "claro";


        this.aplicar(
            temaSalvo
        );


        document.addEventListener(
            "DOMContentLoaded",
            () => {

                const btnTema =
                    document.getElementById(
                        "btnTema"
                    );


                const btnAlterarTemaConfig =
                    document.getElementById(
                        "btnAlterarTemaConfig"
                    );


                /*
                Botão do topo
                */

                if (btnTema) {

                    this.atualizarBotao(
                        btnTema
                    );


                    btnTema.addEventListener(
                        "click",
                        () => {

                            this.alternar();

                        }
                    );

                }


                /*
                Botão da página
                Configurações
                */

                if (
                    btnAlterarTemaConfig
                ) {

                    this.atualizarBotaoConfig(
                        btnAlterarTemaConfig
                    );


                    btnAlterarTemaConfig
                        .addEventListener(
                            "click",
                            () => {

                                this.alternar();

                            }
                        );

                }

            }
        );

    },


    /*
    ================================
    TEMA ATUAL
    ================================
    */

    temaAtual() {

        const escuro =
            document.documentElement
                .getAttribute(
                    "data-theme"
                ) === "dark";


        return escuro
            ? "escuro"
            : "claro";

    },


    /*
    ================================
    ALTERNAR TEMA
    ================================
    */

    alternar() {

        const novoTema =
            this.temaAtual() ===
            "escuro"

                ? "claro"
                : "escuro";


        this.aplicar(
            novoTema
        );


        localStorage.setItem(
            this.chave,
            novoTema
        );


        this.atualizarTodosBotoes();

    },


    /*
    ================================
    APLICAR TEMA
    ================================
    */

    aplicar(tema) {

        if (
            tema === "escuro"
        ) {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

        } else {

            document.documentElement
                .removeAttribute(
                    "data-theme"
                );

        }

    },


    /*
    ================================
    ATUALIZAR BOTÃO DO TOPO
    ================================
    */

    atualizarBotao(
        botao
    ) {

        const escuro =
            this.temaAtual() ===
            "escuro";


        botao.textContent =
            escuro
                ? "☀️"
                : "🌙";


        botao.title =
            escuro
                ? "Ativar tema claro"
                : "Ativar tema escuro";

    },


    /*
    ================================
    ATUALIZAR BOTÃO CONFIGURAÇÕES
    ================================
    */

    atualizarBotaoConfig(
        botao
    ) {

        const escuro =
            this.temaAtual() ===
            "escuro";


        botao.textContent =
            escuro
                ? "Ativar Tema Claro"
                : "Ativar Tema Escuro";

    },


    /*
    ================================
    ATUALIZAR TODOS OS BOTÕES
    ================================
    */

    atualizarTodosBotoes() {

        const btnTema =
            document.getElementById(
                "btnTema"
            );


        const btnAlterarTemaConfig =
            document.getElementById(
                "btnAlterarTemaConfig"
            );


        if (btnTema) {

            this.atualizarBotao(
                btnTema
            );

        }


        if (
            btnAlterarTemaConfig
        ) {

            this.atualizarBotaoConfig(
                btnAlterarTemaConfig
            );

        }

    }

};


/*
========================================
 INICIALIZAÇÃO
========================================
*/

Theme.iniciar();