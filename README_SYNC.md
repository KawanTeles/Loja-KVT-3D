# Guia de Sincronização e Desenvolvimento — Loja KVT-3D

Este documento explica a arquitetura integrada da loja, quais arquivos devem ser versionados e como trabalhar de forma sincronizada em mais de um computador (ex: computador principal e notebook).

---

## 1. Arquitetura do Projeto

O projeto é composto por três partes integradas:
1. **Frontend da Loja e Painel (HTML/CSS/JS)**: Servido estaticamente em produção (Netlify) ou localmente através de um servidor local. Conecta-se diretamente ao **Supabase** para carregar produtos, categorias, banners e configurações.
2. **Servidor Local Frontend (Porta 3000)**: Servidor Express simples para servir a loja localmente (`http://localhost:3000/`) e simular a API localmente no modo offline.
3. **Backend de Sincronização (Porta 3001)**: Localizado na pasta `/backend`. Responsável por realizar o upload das imagens para o Supabase Storage e, em seguida, fazer commits automáticos dessas imagens e das atualizações de dados no GitHub, ativando o deploy automático no Netlify.

---

## 2. Versionamento de Arquivos no Git (.gitignore)

Para evitar vazamento de credenciais privadas ou conflitos de pacotes, a seguinte estrutura de arquivos foi estabelecida no `.gitignore`:

### Arquivos Versionados (ENVIAR ao GitHub)
* Todos os arquivos HTML, CSS e JavaScript da loja (`index.html`, `/css/`, `/js/`, `/admin/`).
* Banco de dados JSON de backup local (`/data/db.json`).
* Imagens do produto locais e enviadas (`/img/`, `/img/uploads/`).
* Arquivos de configuração do Git e dependências do projeto (`package.json`, `package-lock.json`).

### Arquivos Ignorados (NÃO ENVIAR ao GitHub)
* `backend/.env`: Contém credenciais privadas críticas (chaves de acesso do GitHub, Netlify e Supabase Service Role). **Nunca envie este arquivo ao GitHub.**
* `node_modules/` e `backend/node_modules/`: Pastas de dependências instaladas localmente (geradas via `npm install`).
* `backups/`: Diretório de logs e backups locais.

---

## 3. Fluxo de Trabalho Multi-Computador

Quando você alterna entre o computador de desenvolvimento principal e o seu notebook, siga estes passos simples para garantir sincronização total:

### Passo 1: Configuração Inicial no Notebook
Na primeira vez que clonar ou abrir o projeto no notebook:
1. Instale as dependências na raiz e no backend:
   ```bash
   # Na raiz do projeto
   npm install
   
   # Na pasta backend
   cd backend
   npm install
   ```
2. Crie o arquivo `backend/.env` copiando a partir do `.env.example`:
   * Preencha as chaves privadas do Supabase, GitHub e Netlify com os mesmos valores do computador principal.

### Passo 2: Rotina de Desenvolvimento Diário

#### Ao iniciar o trabalho no Notebook:
1. Abra a pasta do projeto e execute:
   ```bash
   git pull
   ```
   *Isso baixará as últimas imagens enviadas e quaisquer alterações de layout/design.*

#### Ao rodar o projeto localmente:
Para que o painel administrativo funcione com upload de imagens e sincronização com o GitHub, **ambos os servidores devem estar rodando**:
1. Terminal 1 (Servidor Frontend - Porta 3000):
   ```bash
   npm start
   ```
2. Terminal 2 (Servidor de Sincronização - Porta 3001):
   ```bash
   cd backend
   npm run dev
   ```

#### Ao editar produtos/imagens pelo Painel:
* Ao adicionar novos produtos ou fazer upload de imagens no painel administrativo (`http://localhost:3000/admin`), os dados são salvos diretamente no **Supabase**.
* As novas imagens são salvas fisicamente em `/img/uploads` no seu computador e também no **Supabase Storage**.
* O backend (porta 3001) cria um commit automático e faz o push para o GitHub.
* O Netlify detecta o novo commit no GitHub e faz o deploy do site atualizado em produção em poucos minutos.

#### Ao voltar para o Computador Principal:
1. Feche os servidores no notebook.
2. No computador principal, execute `git pull` para obter as novas imagens e arquivos.
3. Inicie os dois servidores (`npm start` e `npm run dev`) e continue de onde parou.
