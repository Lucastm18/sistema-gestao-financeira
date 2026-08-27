/*
========================================
 SISTEMA DE GESTÃO FINANCEIRA
 auth.js
 Login, sessão e usuários
========================================
*/

const Auth = {

    chaveSessao: "sgf_sessao",


    /*
    ================================
    REALIZAR LOGIN
    ================================
    */

    login(usuario, senha) {

        const usuarios =
            Storage.listar("usuarios");


        const usuarioEncontrado =
            usuarios.find(
                item =>
                    item.usuario === usuario &&
                    item.senha === senha &&
                    item.status === "Ativo"
            );


        if (!usuarioEncontrado) {
            return false;
        }


        const sessao = {

            codigo:
                usuarioEncontrado.codigo,

            nome:
                usuarioEncontrado.nome,

            usuario:
                usuarioEncontrado.usuario,

            tipo:
                usuarioEncontrado.tipo ||
                (
                    Number(usuarioEncontrado.codigo) === 1
                        ? "admin"
                        : "usuario"
                )

        };


        sessionStorage.setItem(
            this.chaveSessao,
            JSON.stringify(sessao)
        );


        return true;

    },


    /*
    ================================
    VERIFICAR SE ESTÁ LOGADO
    ================================
    */

    estaLogado() {

        return (
            sessionStorage.getItem(
                this.chaveSessao
            ) !== null
        );

    },


    /*
    ================================
    USUÁRIO ATUAL
    ================================
    */

    usuarioAtual() {

        const sessao =
            sessionStorage.getItem(
                this.chaveSessao
            );


        if (!sessao) {
            return null;
        }


        try {

            return JSON.parse(
                sessao
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar sessão:",
                erro
            );


            sessionStorage.removeItem(
                this.chaveSessao
            );


            return null;

        }

    },


    /*
    ================================
    ID DO USUÁRIO LOGADO
    ================================
    */

    usuarioId() {

        const usuario =
            this.usuarioAtual();


        if (!usuario) {
            return null;
        }


        return Number(
            usuario.codigo
        );

    },


    /*
    ================================
    VERIFICAR SE É ADMIN
    ================================
    */

    ehAdmin() {

        const usuario =
            this.usuarioAtual();


        if (!usuario) {
            return false;
        }


        return (
            usuario.tipo === "admin" ||
            Number(usuario.codigo) === 1
        );

    },


    /*
    ================================
    PROTEGER PÁGINA
    ================================
    */

    protegerPagina() {

        if (!this.estaLogado()) {

            window.location.href =
                "login.html";

        }

    },


    /*
    ================================
    PROTEGER PÁGINA DO ADMIN
    ================================
    */

    protegerAdmin() {

        if (!this.estaLogado()) {

            window.location.href =
                "login.html";

            return false;

        }


        if (!this.ehAdmin()) {

            window.location.href =
                "index.html";

            return false;

        }


        return true;

    },


    /*
    ================================
    LOGOUT
    ================================
    */

    logout() {

        sessionStorage.removeItem(
            this.chaveSessao
        );


        window.location.href =
            "login.html";

    },


    /*
    ================================
    CADASTRAR NOVO USUÁRIO
    ================================
    */

    cadastrarUsuario(
        nome,
        usuario,
        senha
    ) {

        const usuarios =
            Storage.listar(
                "usuarios"
            );


        nome = nome.trim();
        usuario = usuario.trim();


        if (
            !nome ||
            !usuario ||
            !senha
        ) {

            return {
                sucesso: false,
                mensagem:
                    "Preencha todos os campos."
            };

        }


        /*
        Não permite dois usuários
        com o mesmo login.
        */

        const usuarioExiste =
            usuarios.some(
                item =>
                    item.usuario
                        .toLowerCase() ===
                    usuario
                        .toLowerCase()
            );


        if (usuarioExiste) {

            return {
                sucesso: false,
                mensagem:
                    "Este nome de usuário já está cadastrado."
            };

        }


        /*
        Todo novo cadastro é
        usuário comum.
        */

        const novoUsuario =
            Storage.adicionar(
                "usuarios",
                {

                    nome:
                        nome,

                    usuario:
                        usuario,

                    senha:
                        senha,

                    tipo:
                        "usuario",

                    status:
                        "Ativo"

                }
            );


        return {

            sucesso: true,

            mensagem:
                "Usuário cadastrado com sucesso!",

            usuario:
                novoUsuario

        };

    },


    /*
    ================================
    ATUALIZAR CONTA
    ================================
    */

    atualizarConta(
        nome,
        usuario
    ) {

        const usuarioAtual =
            this.usuarioAtual();


        if (!usuarioAtual) {

            return {
                sucesso: false,
                mensagem:
                    "Usuário não encontrado."
            };

        }


        nome = nome.trim();
        usuario = usuario.trim();


        if (
            !nome ||
            !usuario
        ) {

            return {
                sucesso: false,
                mensagem:
                    "Preencha todos os campos."
            };

        }


        const usuarios =
            Storage.listar(
                "usuarios"
            );


        /*
        Verifica se outro usuário
        já possui este login.
        */

        const usuarioExiste =
            usuarios.some(
                item =>

                    item.usuario
                        .toLowerCase() ===
                    usuario
                        .toLowerCase()

                    &&

                    Number(
                        item.codigo
                    ) !==

                    Number(
                        usuarioAtual.codigo
                    )
            );


        if (usuarioExiste) {

            return {
                sucesso: false,
                mensagem:
                    "Este nome de usuário já está em uso."
            };

        }


        const indice =
            usuarios.findIndex(
                item =>
                    Number(
                        item.codigo
                    ) ===
                    Number(
                        usuarioAtual.codigo
                    )
            );


        if (indice === -1) {

            return {
                sucesso: false,
                mensagem:
                    "Usuário não encontrado."
            };

        }


        /*
        Atualizar dados.
        */

        usuarios[indice].nome =
            nome;

        usuarios[indice].usuario =
            usuario;


        Storage.salvarLista(
            "usuarios",
            usuarios
        );


        /*
        Atualizar sessão.
        */

        const novaSessao = {

            codigo:
                usuarioAtual.codigo,

            nome:
                nome,

            usuario:
                usuario,

            tipo:
                usuarios[indice].tipo ||
                usuarioAtual.tipo ||
                (
                    Number(usuarioAtual.codigo) === 1
                        ? "admin"
                        : "usuario"
                )

        };


        sessionStorage.setItem(
            this.chaveSessao,
            JSON.stringify(
                novaSessao
            )
        );


        return {

            sucesso: true,

            mensagem:
                "Dados atualizados com sucesso!"

        };

    },


    /*
    ================================
    ALTERAR SENHA
    ================================
    */

    alterarSenha(
        senhaAtual,
        novaSenha,
        confirmarNovaSenha
    ) {

        const usuarioAtual =
            this.usuarioAtual();


        if (!usuarioAtual) {

            return {
                sucesso: false,
                mensagem:
                    "Usuário não encontrado."
            };

        }


        if (
            !senhaAtual ||
            !novaSenha ||
            !confirmarNovaSenha
        ) {

            return {
                sucesso: false,
                mensagem:
                    "Preencha todos os campos de senha."
            };

        }


        if (
            novaSenha !==
            confirmarNovaSenha
        ) {

            return {
                sucesso: false,
                mensagem:
                    "A confirmação da nova senha não confere."
            };

        }


        if (
            novaSenha ===
            senhaAtual
        ) {

            return {
                sucesso: false,
                mensagem:
                    "A nova senha deve ser diferente da senha atual."
            };

        }


        const usuarios =
            Storage.listar(
                "usuarios"
            );


        const indice =
            usuarios.findIndex(
                item =>
                    Number(
                        item.codigo
                    ) ===
                    Number(
                        usuarioAtual.codigo
                    )
            );


        if (indice === -1) {

            return {
                sucesso: false,
                mensagem:
                    "Usuário não encontrado."
            };

        }


        if (
            usuarios[indice].senha !==
            senhaAtual
        ) {

            return {
                sucesso: false,
                mensagem:
                    "A senha atual está incorreta."
            };

        }


        usuarios[indice].senha =
            novaSenha;


        Storage.salvarLista(
            "usuarios",
            usuarios
        );


        return {

            sucesso: true,

            mensagem:
                "Senha alterada com sucesso!"

        };

    },


    /*
    ================================
    SOLICITAR REDEFINIÇÃO DE SENHA
    ================================
    */

    solicitarRedefinicaoSenha(
        usuario,
        novaSenha,
        confirmarNovaSenha
    ) {

        usuario =
            usuario.trim();


        if (
            !usuario ||
            !novaSenha ||
            !confirmarNovaSenha
        ) {

            return {
                sucesso: false,
                mensagem:
                    "Preencha todos os campos."
            };

        }


        if (
            novaSenha !==
            confirmarNovaSenha
        ) {

            return {
                sucesso: false,
                mensagem:
                    "As novas senhas não são iguais."
            };

        }


        const usuarios =
            Storage.listar(
                "usuarios"
            );


        const usuarioEncontrado =
            usuarios.find(
                item =>
                    item.usuario
                        .toLowerCase() ===
                    usuario.toLowerCase()

                    &&

                    item.status ===
                    "Ativo"
            );


        if (!usuarioEncontrado) {

            return {
                sucesso: false,
                mensagem:
                    "Usuário não encontrado."
            };

        }


        /*
        O Admin não utiliza esse
        sistema de recuperação.
        */

        const tipo =
            usuarioEncontrado.tipo ||
            (
                Number(
                    usuarioEncontrado.codigo
                ) === 1

                    ? "admin"
                    : "usuario"
            );


        if (
            tipo === "admin"
        ) {

            return {
                sucesso: false,
                mensagem:
                    "A conta de administrador não pode usar esta recuperação."
            };

        }


        /*
        Salvar solicitação.
        A senha ainda NÃO é alterada.
        */

        Storage.salvarSolicitacaoSenha(
            usuarioEncontrado,
            novaSenha
        );


        return {

            sucesso: true,

            mensagem:
                "Solicitação enviada. Aguarde a aprovação do administrador."

        };

    },


    /*
    ================================
    APROVAR SOLICITAÇÃO
    ================================
    */

    aprovarSolicitacaoSenha(
        codigoSolicitacao
    ) {

        if (!this.ehAdmin()) {

            return {
                sucesso: false,
                mensagem:
                    "Acesso não autorizado."
            };

        }


        const solicitacao =
            Storage.buscar(
                "solicitacoes_senha",
                codigoSolicitacao
            );


        if (
            !solicitacao ||
            solicitacao.status !==
            "Pendente"
        ) {

            return {
                sucesso: false,
                mensagem:
                    "Solicitação não encontrada."
            };

        }


        const usuarios =
            Storage.listar(
                "usuarios"
            );


        const indice =
            usuarios.findIndex(
                item =>
                    Number(
                        item.codigo
                    ) ===
                    Number(
                        solicitacao.usuarioId
                    )
            );


        if (indice === -1) {

            return {
                sucesso: false,
                mensagem:
                    "Usuário não encontrado."
            };

        }


        /*
        Aplicar nova senha.
        */

        usuarios[indice].senha =
            solicitacao.novaSenha;


        Storage.salvarLista(
            "usuarios",
            usuarios
        );


        /*
        Depois de aprovada,
        a solicitação é apagada.
        */

        Storage.excluir(
            "solicitacoes_senha",
            codigoSolicitacao
        );


        return {

            sucesso: true,

            mensagem:
                "Senha atualizada com sucesso!"

        };

    },


    /*
    ================================
    RECUSAR SOLICITAÇÃO
    ================================
    */

    recusarSolicitacaoSenha(
        codigoSolicitacao
    ) {

        if (!this.ehAdmin()) {

            return {
                sucesso: false,
                mensagem:
                    "Acesso não autorizado."
            };

        }


        const solicitacao =
            Storage.buscar(
                "solicitacoes_senha",
                codigoSolicitacao
            );


        if (!solicitacao) {

            return {
                sucesso: false,
                mensagem:
                    "Solicitação não encontrada."
            };

        }


        Storage.excluir(
            "solicitacoes_senha",
            codigoSolicitacao
        );


        return {

            sucesso: true,

            mensagem:
                "Solicitação recusada."

        };

    },


    /*
    ================================
    ADICIONAR MENU DO ADMIN
    ================================
    */

    adicionarMenuAdmin() {

        if (!this.ehAdmin()) {
            return;
        }


        const menu =
            document.querySelector(
                "ul.menu"
            );


        if (!menu) {
            return;
        }


        /*
        Evita colocar o link
        duas vezes.
        */

        const linkExistente =
            document.querySelector(
                'a[href="atualizar-senhas.html"]'
            );


        if (linkExistente) {
            return;
        }


        const item =
            document.createElement(
                "li"
            );


        const link =
            document.createElement(
                "a"
            );


        link.id =
            "menuAtualizarSenhas";


        link.href =
            "atualizar-senhas.html";


        link.textContent =
            "Atualizar Senhas";


        item.appendChild(
            link
        );


        menu.appendChild(
            item
        );

    }

};


/*
========================================
 TELA DE LOGIN
========================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const formulario =
            document.getElementById(
                "loginForm"
            );


        /*
        Se não estamos na tela
        de login, ignora.
        */

        if (!formulario) {
            return;
        }


        /*
        Já está logado.
        */

        if (Auth.estaLogado()) {

            window.location.href =
                "index.html";

            return;

        }


        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const campoUsuario =
                    document.getElementById(
                        "usuario"
                    );


                const campoSenha =
                    document.getElementById(
                        "senha"
                    );


                const mensagem =
                    document.getElementById(
                        "mensagemLogin"
                    );


                const usuario =
                    campoUsuario.value.trim();


                const senha =
                    campoSenha.value;


                if (
                    !usuario ||
                    !senha
                ) {

                    mensagem.textContent =
                        "Preencha o usuário e a senha.";


                    mensagem.className =
                        "mensagem-login erro";


                    return;

                }


                const loginRealizado =
                    Auth.login(
                        usuario,
                        senha
                    );


                if (loginRealizado) {

                    mensagem.textContent =
                        "Login realizado com sucesso!";


                    mensagem.className =
                        "mensagem-login sucesso";


                    window.location.href =
                        "index.html";

                } else {

                    mensagem.textContent =
                        "Usuário ou senha inválidos.";


                    mensagem.className =
                        "mensagem-login erro";


                    campoSenha.value =
                        "";


                    campoSenha.focus();

                }

            }
        );

    }
);


/*
========================================
 MENU EXCLUSIVO DO ADMIN
========================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            Auth.estaLogado()
        ) {

            Auth.adicionarMenuAdmin();

        }

    }
);