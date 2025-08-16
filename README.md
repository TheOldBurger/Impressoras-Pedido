# The Old Burguer — Sistema de Pedidos (GitHub Pages)

Site estático de pedidos para restaurante com geração de comanda (recibo) pronta para impressão.

## Recursos
- Lista de itens do cardápio com busca.
- Adicionar itens com **observação** (ex.: sem tomate, extra bacon).
- Carrinho com ajustes de quantidade e remoção.
- Número do pedido inicia em **#0001** e incrementa automaticamente (salvo em `localStorage` do navegador).
- Geração de **comanda** com:
  - Logo fixo no topo (`assets/logo.png`).
  - Itens do pedido formatados: `2 Fritas (Sem Sal)`
  - **Total** somado automaticamente.
  - **QR Code PIX** fixo no final (`assets/pix_qr.png`).
- Layout simples, escuro no app e recibo claro para impressão.
- CSS de impressão (80mm) para impressoras térmicas.
- (Opcional) Esqueleto de integração com **Bluetooth** (Web Bluetooth API).

## Como publicar no GitHub Pages
1. Crie um repositório novo no GitHub, por exemplo: `the-old-burguer-pedidos`.
2. Envie os arquivos deste projeto (ou extraia o ZIP e faça commit).
3. Nas configurações do repositório, ative **Pages** e selecione a branch principal (raiz).
4. Acesse a URL indicada nas configurações do Pages.

## Personalização
- **Logo:** substitua `assets/logo.png` pelo seu arquivo (mantenha o mesmo nome).
- **PIX:** substitua `assets/pix_qr.png` pela imagem do seu QR/Chave PIX (mesmo nome).
- **Cardápio:** edite o array `MENU` no `app.js` com seus itens e preços.
- **Zerando o contador:** apague o `localStorage` chave `orderCounter` no seu navegador.

## Desenvolvido
HTML, CSS e JavaScript puro — pronto para GitHub Pages.
