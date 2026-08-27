/*
========================================
 SISTEMA DE GESTÃO FINANCEIRA
 storage.js
========================================
*/

const Storage = {

    prefixo: "sgf_",


    /*
    ================================
    CHAVE DO LOCALSTORAGE
    ================================
    */

    chave(nome) {

        return this.prefixo + nome;

    },


    /*
    ================================
    LISTAR
    ================================
    */

    listar(nome) {

        const dados =
            localStorage.getItem(
                this.chave(nome)
            );


        if (!dados) {

            return [];

        }


        try {

            return JSON.parse(
                dados
            );

        } catch (erro) {

            console.error(
                `Erro ao carregar ${nome}:`,
                erro
            );


            return [];

        }

    },


    /*
    ================================
    SALVAR LISTA
    ================================
    */

    salvarLista(
        nome,
        dados
    ) {

        localStorage.setItem(

            this.chave(nome),

            JSON.stringify(
                dados
            )

        );

    },


    /*
    ================================
    PRÓXIMO CÓDIGO
    ================================
    */

    proximoCodigo(nome) {

        const registros =
            this.listar(nome);


        if (
            registros.length === 0
        ) {

            return 1;

        }


        const codigos =
            registros.map(

                registro =>
                    Number(
                        registro.codigo
                    ) || 0

            );


        return (
            Math.max(...codigos) + 1
        );

    },


    /*
    ================================
    ADICIONAR
    ================================
    */

    adicionar(
        nome,
        dados
    ) {

        const registros =
            this.listar(nome);


        const novoRegistro = {

            ...dados,

            codigo:
                this.proximoCodigo(
                    nome
                )

        };


        registros.push(
            novoRegistro
        );


        this.salvarLista(
            nome,
            registros
        );


        return novoRegistro;

    },


    /*
    ================================
    BUSCAR
    ================================
    */

    buscar(
        nome,
        codigo
    ) {

        return (

            this.listar(nome)
                .find(

                    registro =>

                        Number(
                            registro.codigo
                        ) ===

                        Number(
                            codigo
                        )

                )

            || null

        );

    },


    /*
    ================================
    EDITAR
    ================================
    */

    editar(
        nome,
        codigo,
        novosDados
    ) {

        const registros =
            this.listar(nome);


        const indice =
            registros.findIndex(

                registro =>

                    Number(
                        registro.codigo
                    ) ===

                    Number(
                        codigo
                    )

            );


        if (
            indice === -1
        ) {

            return false;

        }


        registros[indice] = {

            ...registros[indice],

            ...novosDados,

            codigo:
                registros[indice]
                    .codigo

        };


        this.salvarLista(
            nome,
            registros
        );


        return true;

    },


    /*
    ================================
    EXCLUIR
    ================================
    */

    excluir(
        nome,
        codigo
    ) {

        const registros =
            this.listar(nome);


        const novaLista =
            registros.filter(

                registro =>

                    Number(
                        registro.codigo
                    ) !==

                    Number(
                        codigo
                    )

            );


        if (
            novaLista.length ===
            registros.length
        ) {

            return false;

        }


        this.salvarLista(
            nome,
            novaLista
        );


        return true;

    },


    /*
    ========================================
    LISTAR DADOS DE UM USUÁRIO
    ========================================
    */

    listarDoUsuario(
        nome,
        usuarioId
    ) {

        return (
            this.listar(nome)
                .filter(

                    registro =>

                        Number(
                            registro.usuarioId
                        ) ===

                        Number(
                            usuarioId
                        )

                )
        );

    },


    /*
    ========================================
    ADICIONAR DADO PARA UM USUÁRIO
    ========================================
    */

    adicionarDoUsuario(
        nome,
        dados,
        usuarioId
    ) {

        return this.adicionar(

            nome,

            {

                ...dados,

                usuarioId:
                    Number(
                        usuarioId
                    )

            }

        );

    },


    /*
    ========================================
    BUSCAR REGISTRO DO USUÁRIO
    ========================================
    */

    buscarDoUsuario(
        nome,
        codigo,
        usuarioId
    ) {

        return (

            this.listar(nome)
                .find(

                    registro =>

                        Number(
                            registro.codigo
                        ) ===
                        Number(
                            codigo
                        )

                        &&

                        Number(
                            registro.usuarioId
                        ) ===
                        Number(
                            usuarioId
                        )

                )

            || null

        );

    },


    /*
    ========================================
    EDITAR REGISTRO DO USUÁRIO
    ========================================
    */

    editarDoUsuario(
        nome,
        codigo,
        novosDados,
        usuarioId
    ) {

        const registros =
            this.listar(nome);


        const indice =
            registros.findIndex(

                registro =>

                    Number(
                        registro.codigo
                    ) ===
                    Number(
                        codigo
                    )

                    &&

                    Number(
                        registro.usuarioId
                    ) ===
                    Number(
                        usuarioId
                    )

            );


        if (
            indice === -1
        ) {

            return false;

        }


        registros[indice] = {

            ...registros[indice],

            ...novosDados,

            codigo:
                registros[indice]
                    .codigo,

            usuarioId:
                registros[indice]
                    .usuarioId

        };


        this.salvarLista(
            nome,
            registros
        );


        return true;

    },


    /*
    ========================================
    EXCLUIR REGISTRO DO USUÁRIO
    ========================================
    */

    excluirDoUsuario(
        nome,
        codigo,
        usuarioId
    ) {

        const registros =
            this.listar(nome);


        const indice =
            registros.findIndex(

                registro =>

                    Number(
                        registro.codigo
                    ) ===
                    Number(
                        codigo
                    )

                    &&

                    Number(
                        registro.usuarioId
                    ) ===
                    Number(
                        usuarioId
                    )

            );


        if (
            indice === -1
        ) {

            return false;

        }


        registros.splice(
            indice,
            1
        );


        this.salvarLista(
            nome,
            registros
        );


        return true;

    },


    /*
    ========================================
    LIMPAR DADOS DE UM USUÁRIO
    ========================================
    */

    limparDadosDoUsuario(
        usuarioId
    ) {

        if (
            usuarioId === null ||
            usuarioId === undefined
        ) {

            return false;

        }


        const colecoes = [

            "receitas",
            "despesas"

        ];


        colecoes.forEach(

            nome => {

                const registros =
                    this.listar(
                        nome
                    );


                /*
                Mantém os registros
                pertencentes aos
                outros usuários.
                */

                const registrosMantidos =
                    registros.filter(

                        registro =>

                            Number(
                                registro.usuarioId
                            ) !==

                            Number(
                                usuarioId
                            )

                    );


                this.salvarLista(
                    nome,
                    registrosMantidos
                );

            }

        );


        return true;

    },


    /*
    ========================================
    SALVAR SOLICITAÇÃO DE SENHA
    ========================================
    */

    salvarSolicitacaoSenha(
        usuario,
        novaSenha
    ) {

        const solicitacoes =
            this.listar(
                "solicitacoes_senha"
            );


        /*
        Verifica se o usuário
        já possui uma solicitação
        pendente.
        */

        const indicePendente =
            solicitacoes.findIndex(
                solicitacao =>

                    Number(
                        solicitacao.usuarioId
                    ) ===
                    Number(
                        usuario.codigo
                    )

                    &&

                    solicitacao.status ===
                    "Pendente"
            );


        /*
        Se já existe uma solicitação,
        atualiza a senha desejada.
        */

        if (
            indicePendente !== -1
        ) {

            solicitacoes[
                indicePendente
            ].novaSenha =
                novaSenha;


            solicitacoes[
                indicePendente
            ].dataSolicitacao =
                new Date().toISOString();


            this.salvarLista(
                "solicitacoes_senha",
                solicitacoes
            );


            return solicitacoes[
                indicePendente
            ];

        }


        /*
        Criar nova solicitação.
        */

        const novaSolicitacao = {

            codigo:
                this.proximoCodigo(
                    "solicitacoes_senha"
                ),

            usuarioId:
                Number(
                    usuario.codigo
                ),

            nome:
                usuario.nome,

            usuario:
                usuario.usuario,

            novaSenha:
                novaSenha,

            status:
                "Pendente",

            dataSolicitacao:
                new Date().toISOString()

        };


        solicitacoes.push(
            novaSolicitacao
        );


        this.salvarLista(
            "solicitacoes_senha",
            solicitacoes
        );


        return novaSolicitacao;

    },


    /*
    ========================================
    LISTAR SOLICITAÇÕES DE SENHA
    ========================================
    */

    listarSolicitacoesSenha(
        status = ""
    ) {

        const solicitacoes =
            this.listar(
                "solicitacoes_senha"
            );


        if (!status) {

            return solicitacoes;

        }


        return solicitacoes.filter(
            solicitacao =>
                solicitacao.status ===
                status
        );

    },


    /*
    ================================
    INICIALIZAR SISTEMA
    ================================
    */

    inicializar() {

        /*
        ================================
        USUÁRIOS
        ================================
        */

        if (
            localStorage.getItem(
                this.chave(
                    "usuarios"
                )
            ) === null
        ) {

            this.salvarLista(

                "usuarios",

                [

                    {

                        codigo: 1,

                        nome:
                            "Administrador",

                        usuario:
                            "admin",

                        senha:
                            "123456",

                        tipo:
                            "admin",

                        status:
                            "Ativo"

                    }

                ]

            );

        }


        /*
        ================================
        RECEITAS
        ================================
        */

        if (
            localStorage.getItem(
                this.chave(
                    "receitas"
                )
            ) === null
        ) {

            this.salvarLista(
                "receitas",
                []
            );

        }


        /*
        ================================
        DESPESAS
        ================================
        */

        if (
            localStorage.getItem(
                this.chave(
                    "despesas"
                )
            ) === null
        ) {

            this.salvarLista(
                "despesas",
                []
            );

        }


        /*
        ================================
        SOLICITAÇÕES DE SENHA
        ================================
        */

        if (
            localStorage.getItem(
                this.chave(
                    "solicitacoes_senha"
                )
            ) === null
        ) {

            this.salvarLista(
                "solicitacoes_senha",
                []
            );

        }


        /*
        Atualizar estruturas antigas.
        */

        this.migrarDadosAntigos();

        this.migrarTiposUsuarios();

    },


    /*
    ========================================
    MIGRAR DADOS ANTIGOS
    ========================================
    */

    migrarDadosAntigos() {

        const colecoes = [

            "receitas",
            "despesas"

        ];


        colecoes.forEach(

            nome => {

                const registros =
                    this.listar(
                        nome
                    );


                let alterado =
                    false;


                registros.forEach(

                    registro => {

                        if (
                            registro.usuarioId ===
                            undefined
                        ) {

                            /*
                            Registros antigos passam
                            a pertencer ao Admin.
                            */

                            registro.usuarioId =
                                1;


                            alterado =
                                true;

                        }

                    }

                );


                if (
                    alterado
                ) {

                    this.salvarLista(
                        nome,
                        registros
                    );

                }

            }

        );

    },


    /*
    ========================================
    MIGRAR TIPOS DOS USUÁRIOS
    ========================================
    */

    migrarTiposUsuarios() {

        const usuarios =
            this.listar(
                "usuarios"
            );


        let alterado =
            false;


        usuarios.forEach(
            usuario => {

                if (
                    !usuario.tipo
                ) {

                    usuario.tipo =

                        Number(
                            usuario.codigo
                        ) === 1

                            ? "admin"
                            : "usuario";


                    alterado =
                        true;

                }

            }
        );


        if (
            alterado
        ) {

            this.salvarLista(
                "usuarios",
                usuarios
            );

        }

    }

};


/*
========================================
 INICIALIZAÇÃO
========================================
*/

Storage.inicializar();