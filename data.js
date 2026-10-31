// Todos os dados da Florencio ficam aqui. O que não foi confirmado com a marmoraria está com confirmed: false.
// Fontes (30/10/2026): Google Maps. A marmoraria não tem site nem Instagram encontrado.
// Fotos e texturas: ilustrativas (Unsplash), até chegarem as fotos das obras.
window.FLORENCIO = {
  empresa: {
    nome: 'Marmoraria Florencio',
    endereco: 'R. Padre Francisco Van de Water, 101',
    bairro: 'Sítio Cercado, Curitiba - PR',
    cep: '81920-370',
    telefone: '(41) 99951-0642', tel: '+5541999510642',
    notaGoogle: '5,0',
    avaliacoes: 89,
    elogios: ['o acabamento', 'o preço', 'a rapidez', 'a explicação antes da obra', 'a equipe'], // temas das avaliações
    confirmed: true,
  },
  // O celular do Google Maps. Falta confirmar se é WhatsApp.
  whatsapp: { numero: '5541999510642', confirmed: false },
  horario: { texto: 'Consulte o horário pelo telefone', confirmed: false }, // o Maps mostrava "fecha às 17h"
  instagram: { usuario: '', confirmed: false },
  // Serviços típicos de marmoraria: confirmar quais a Florencio faz.
  ambientes: [
    { id: 'cozinha', nome: 'Bancada de cozinha', foto: '1778272617843-bdda47b64bad', texto: 'Bancada, frontão e recorte da pia e do cooktop, na medida da sua cozinha.', confirmed: false },
    { id: 'ilha', nome: 'Ilha e área gourmet', foto: '1753826944249-6bfc06c0c254', texto: 'Ilha, balcão e churrasqueira com a pedra que aguenta calor e uso.', confirmed: false },
    { id: 'banheiro', nome: 'Banheiro e lavatório', foto: '1756079664354-34944e001f6d', texto: 'Lavatório, nicho e saia da bancada com a mesma pedra, sem emenda aparente.', confirmed: false },
    { id: 'escada', nome: 'Escada', foto: '1767555026364-b2b17d7dc455', texto: 'Degraus e espelhos com acabamento nas bordas e antiderrapante onde precisa.', confirmed: false },
    { id: 'soleira', nome: 'Soleira e peitoril', foto: '1695542958346-d51b0c2f1917', texto: 'Soleiras, peitoris e rodapés: o acabamento pequeno que muda a obra inteira.', confirmed: false },
  ],
  // Mostruário: tipos de pedra com textura ilustrativa. Disponibilidade e cores reais: consultar.
  pedras: [
    { id: 'granito-preto', nome: 'Granito preto', foto: '1778235296112-a9ea74fff37a', texto: 'Escuro e uniforme, esconde o uso do dia a dia.' },
    { id: 'granito-cinza', nome: 'Granito cinza', foto: '1585749864755-f1adb4ec8e29', texto: 'Pontilhado claro, o mais pedido para cozinha.' },
    { id: 'marmore-branco', nome: 'Mármore branco', foto: '1551554781-c46200ea959d', texto: 'Veios cinza para banheiro e lavabo.' },
    { id: 'marmore-escuro', nome: 'Mármore escuro', foto: '1786673211400-90f79d15b1ff', texto: 'Fundo preto com veios brancos, para destacar.' },
    { id: 'quartzito', nome: 'Quartzito claro', foto: '1786673211682-3653b8a424e5', texto: 'Claro com veios dourados, resistente como granito.' },
    { id: 'pedra-verde', nome: 'Pedra verde', foto: '1786673208615-8847e4547cd4', texto: 'Para quem quer uma peça que chame a atenção.' },
  ],
};
