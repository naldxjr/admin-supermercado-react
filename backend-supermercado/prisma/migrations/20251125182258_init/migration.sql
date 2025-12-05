CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "avatarUrl" TEXT
);

CREATE TABLE "Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "precoAtual" REAL NOT NULL,
    "precoPromocional" REAL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataValidade" TEXT NOT NULL
);

CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "identidade" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "tempoCliente" INTEGER NOT NULL
);


CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");


CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");


CREATE UNIQUE INDEX "Cliente_identidade_key" ON "Cliente"("identidade");
