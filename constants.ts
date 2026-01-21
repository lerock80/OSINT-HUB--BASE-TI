
import { Tool, Category } from './types';

export const APP_VERSION = '1.0.2'; // Incrementado para aplicar reordenação de categorias

export const INITIAL_CATEGORIES: Category[] = [
  // Brasil no topo
  { id: 'cat-br-doc', name: 'Brasil - Documentos' },
  { id: 'cat-br-soc', name: 'Brasil - Redes Sociais' },
  { id: 'cat-br-tel', name: 'Brasil - Telefone' },
  { id: 'cat-br-mail', name: 'Brasil - E-mail' },
  { id: 'cat-br-com', name: 'Brasil - Comercial' },
  { id: 'cat-br-geo', name: 'Brasil - Geolocalização' },
  { id: 'cat-br-imo', name: 'Brasil - Imóveis' },
  { id: 'cat-br-jur', name: 'Brasil - Jurídico' },
  { id: 'cat-br-fin', name: 'Brasil - Financeiro' },
  { id: 'cat-br-sec', name: 'Brasil - Segurança' },
  { id: 'cat-br-tr', name: 'Brasil - Transparência' },
  
  // Demais categorias
  { id: 'cat-tel', name: 'Telefone' },
  { id: 'cat-mail', name: 'E-mail' },
  { id: 'cat-social', name: 'Redes Sociais' },
  { id: 'cat-dom', name: 'Domínios' },
  { id: 'cat-meta', name: 'Metadados' },
  { id: 'cat-search', name: 'Busca Geral' },
  { id: 'cat-img', name: 'Imagens' },
  { id: 'cat-fin', name: 'Financeiro' },
  { id: 'cat-com', name: 'Comercial' },
  { id: 'cat-geo', name: 'Geolocalização' },
  { id: 'cat-track', name: 'Rastreamento' },
  { id: 'cat-sec', name: 'Segurança' },
  { id: 'cat-fb', name: 'Facebook' },
  { id: 'cat-ig', name: 'Instagram' },
  { id: 'cat-tw', name: 'Twitter' },
  { id: 'cat-tk', name: 'TikTok' },
  { id: 'cat-transp', name: 'Transparência' },
  { id: 'cat-gen', name: 'Geradores' },
  { id: 'cat-plat', name: 'Plataformas Integradas' },
  { id: 'cat-adv', name: 'Busca Avançada' }
];

export const INITIAL_TOOLS: Tool[] = [
  // 1-8: Telefone
  { id: 't1', categoryId: 'cat-tel', name: 'TrueCaller', description: 'Identificador global de chamadas e proteção contra spam.', url: 'https://www.truecaller.com' },
  { id: 't2', categoryId: 'cat-tel', name: 'EPIEOS', description: 'Investigação de contas digitais vinculadas a números.', url: 'https://epieos.com' },
  { id: 't3', categoryId: 'cat-tel', name: 'Phoneinfoga', description: 'Scanner de inteligência para números internacionais.', url: 'https://github.com/sundowndev/phoneinfoga' },
  { id: 't4', categoryId: 'cat-tel', name: 'Sync.me', description: 'Busca reversa de telefone com integração social.', url: 'https://sync.me/' },
  { id: 't5', categoryId: 'cat-tel', name: "That's Them", description: 'Informações residenciais e de contato por número.', url: 'https://thatsthem.com/reverse-phone-lookup' },
  { id: 't6', categoryId: 'cat-tel', name: 'WhoCalledMe', description: 'Repositório de números de telemarketing e golpes.', url: 'https://www.whocallme.com/choose-your-country' },
  { id: 't7', categoryId: 'cat-tel', name: 'FreeCarrierLookup', description: 'Verifica operadora e status de portabilidade.', url: 'https://freecarrierlookup.com/' },
  { id: 't8', categoryId: 'cat-tel', name: 'Ignorant', description: 'Verifica presença de número em redes específicas.', url: 'https://github.com/megadose/ignorant' },

  // 9-19: E-mail
  { id: 'm1', categoryId: 'cat-mail', name: 'Have I Been Zuckered', description: 'Verifica vazamentos específicos de dados do Facebook.', url: 'https://haveibeenzuckered.com/' },
  { id: 'm2', categoryId: 'cat-mail', name: 'EPIEOS Email', description: 'Perfis de redes sociais ligados a um e-mail.', url: 'https://epieos.com/' },
  { id: 'm3', categoryId: 'cat-mail', name: 'VerifyEmailAddress', description: 'Validador técnico de endereços de e-mail.', url: 'https://www.verifyemailaddress.org/' },
  { id: 'm4', categoryId: 'cat-mail', name: 'Have I Been Pwned', description: 'Base mundial de credenciais vazadas.', url: 'https://haveibeenpwned.com/' },
  { id: 'm5', categoryId: 'cat-mail', name: 'EmailRep', description: 'Pontuação de risco e reputação de e-mail.', url: 'https://emailrep.io/' },
  { id: 'm6', categoryId: 'cat-mail', name: 'Holehe', description: 'Checa contas em mais de 120 plataformas.', url: 'https://github.com/megadose/holehe' },
  { id: 'm7', categoryId: 'cat-mail', name: 'Infoga', description: 'Ferramenta de coleta de dados de e-mail público.', url: 'https://github.com/GiJ03/Infoga' },
  { id: 'm8', categoryId: 'cat-mail', name: 'Hunter.io', description: 'Busca de e-mails corporativos e domínios.', url: 'https://hunter.io/' },
  { id: 'm9', categoryId: 'cat-mail', name: 'Metric Sparrow', description: 'Permutador inteligente para descoberta de e-mail.', url: 'http://metricsparrow.com/toolkit/email-permutator' },
  { id: 'm10', categoryId: 'cat-mail', name: 'RocketReach', description: 'Busca de contatos profissionais e perfis.', url: 'https://rocketreach.co/' },
  { id: 'm11', categoryId: 'cat-mail', name: 'GHunt', description: 'Investigação profunda de contas do ecossistema Google.', url: 'https://github.com/mxrch/GHunt' },

  // 20-26: Redes Sociais
  { id: 's1', categoryId: 'cat-social', name: 'Sherlock', description: 'Caçador de usernames em centenas de redes sociais.', url: 'https://github.com/sherlock-project/sherlock' },
  { id: 's2', categoryId: 'cat-social', name: 'Namechk', description: 'Busca de disponibilidade de marca e usuário.', url: 'https://namechk.com' },
  { id: 's3', categoryId: 'cat-social', name: 'WhatsMyName Web', description: 'Busca rápida de apelidos em sites web.', url: 'https://whatsmyname.app' },
  { id: 's4', categoryId: 'cat-social', name: 'NameCheckUp', description: 'Verificador de presença social e web.', url: 'https://namecheckup.com' },
  { id: 's5', categoryId: 'cat-social', name: 'Username Instant', description: 'Checagem instantânea de usernames.', url: 'https://instantusername.com/' },
  { id: 's6', categoryId: 'cat-social', name: 'Profil3r', description: 'Correlação de perfis para inteligência de alvo.', url: 'https://github.com/Greyjedix/Profil3r' },
  { id: 's7', categoryId: 'cat-social', name: 'Nexfil', description: 'Scanner ultra-veloz de perfis públicos.', url: 'https://github.com/thewhiteh4t/nexfil' },

  // 27-34: Domínios
  { id: 'd1', categoryId: 'cat-dom', name: 'Dominio.es', description: 'Pesquisa oficial de domínios espanhóis.', url: 'https://nic.es/sgnd/dominio/publicBuscarDominios.action' },
  { id: 'd2', categoryId: 'cat-dom', name: 'Dossiê de Domínio', description: 'Informações detalhadas sobre rede e WHOIS.', url: 'https://centralops.net/co/DomainDossier.aspx' },
  { id: 'd3', categoryId: 'cat-dom', name: 'Nmmapper', description: 'Enumeração de subdomínios e análise DNS.', url: 'https://www.nmmapper.com/sys/tools/subdomainfinder' },
  { id: 'd4', categoryId: 'cat-dom', name: 'BuiltWith', description: 'Perfil de tecnologia de infraestrutura web.', url: 'https://builtwith.com/es' },
  { id: 'd5', categoryId: 'cat-dom', name: 'DNS Dumpster', description: 'Visualização técnica de registros DNS.', url: 'https://dnsdumpster.com' },
  { id: 'd6', categoryId: 'cat-dom', name: 'Assetfinder', description: 'Localizador de subdomínios e ativos relacionados.', url: 'https://github.com/tomnomnom/assetfinder' },
  { id: 'd7', categoryId: 'cat-dom', name: 'Sublist3r', description: 'Ferramenta modular de enumeração de subdomínios.', url: 'https://github.com/aboul3la/Sublist3r' },
  { id: 'd8', categoryId: 'cat-dom', name: 'DNSTwist', description: 'Mapeamento de permutação de domínios (Phishing).', url: 'https://github.com/elceef/dnstwist' },

  // 35-39: Metadados
  { id: 'me1', categoryId: 'cat-meta', name: 'Exiftool', description: 'Lider em análise técnica de metadados de arquivos.', url: 'https://github.com/exiftool/exiftool' },
  { id: 'me2', categoryId: 'cat-meta', name: 'Pymeta', description: 'Extração de metadados em documentos Office/PDF.', url: 'https://github.com/m8sec/pymeta' },
  { id: 'me3', categoryId: 'cat-meta', name: 'FOCA', description: 'Análise de metadados para infraestrutura de rede.', url: 'https://github.com/ElevenPaths/FOCA' },
  { id: 'me4', categoryId: 'cat-meta', name: 'Metadata2go', description: 'Visualizador de metadados online simplificado.', url: 'https://www.metadata2go.com/' },
  { id: 'me5', categoryId: 'cat-meta', name: 'Verexif', description: 'Ferramenta web para verificação EXIF.', url: 'https://www.verexif.com' },

  // 40-46: Busca Geral
  { id: 'bg1', categoryId: 'cat-search', name: 'Shodan', description: 'Busca por dispositivos e hardware conectado.', url: 'https://www.shodan.io' },
  { id: 'bg2', categoryId: 'cat-search', name: 'Wolfram Alpha', description: 'Motor de conhecimento computacional avançado.', url: 'https://www.wolframalpha.com' },
  { id: 'bg3', categoryId: 'cat-search', name: 'Boardreader', description: 'Busca exclusiva em fóruns e comunidades.', url: 'https://boardreader.com' },
  { id: 'bg4', categoryId: 'cat-search', name: 'Science.gov', description: 'Pesquisa em bases de dados científicas federais.', url: 'https://www.science.gov/' },
  { id: 'bg5', categoryId: 'cat-search', name: 'Google Trends', description: 'Monitoramento de volumes de busca mundiais.', url: 'https://trends.google.es/trends/' },
  { id: 'bg6', categoryId: 'cat-search', name: 'Archive.org', description: 'Biblioteca histórica da Internet.', url: 'https://archive.org' },
  { id: 'bg7', categoryId: 'cat-search', name: 'Ressuscitar Páginas', description: 'Acesso a caches de sites fora do ar.', url: 'https://addons.mozilla.org/es/firefox/addon/resurrect-pages' },

  // 47-52: Imagens
  { id: 'i1', categoryId: 'cat-img', name: 'Tineye', description: 'Especialista em busca reversa e cópias exatas.', url: 'https://tineye.com' },
  { id: 'i2', categoryId: 'cat-img', name: 'Google Lens', description: 'Reconhecimento visual massivo de objetos e locais.', url: 'https://www.google.com/imghp' },
  { id: 'i3', categoryId: 'cat-img', name: 'Bing Images', description: 'Poderoso motor visual da Microsoft.', url: 'https://www.bing.com/images' },
  { id: 'i4', categoryId: 'cat-img', name: 'Yandex Images', description: 'Referência em reconhecimento facial de precisão.', url: 'https://yandex.com/images' },
  { id: 'i5', categoryId: 'cat-img', name: 'Baidu Images', description: 'Principal motor de busca visual asiático.', url: 'https://image.baidu.com' },
  { id: 'i6', categoryId: 'cat-img', name: 'Search by Image', description: 'Extensão para busca reversa múltipla.', url: 'https://chromewebstore.google.com/detail/search-byimage/cnojnbdhbhnkbcieeekonklommdnndci' },

  // 53-54: Financeiro
  { id: 'f1', categoryId: 'cat-fin', name: 'IBAN Checker', description: 'Validação e detalhamento de contas bancárias.', url: 'https://www.iban.com/' },
  { id: 'f2', categoryId: 'cat-fin', name: 'Credit Card Verifier', description: 'Teste de integridade de números de cartão.', url: 'https://www.validcreditcardnumber.com' },

  // 55-59: Comercial
  { id: 'c1', categoryId: 'cat-com', name: 'LibreBOR', description: 'Informação mercantil aberta e transparente.', url: 'https://librebor.me/' },
  { id: 'c2', categoryId: 'cat-com', name: 'DatosCif', description: 'Diretório de empresas e identificadores comerciais.', url: 'https://www.datoscif.es/' },
  { id: 'c3', categoryId: 'cat-com', name: 'Iberinform', description: 'Relatórios de solvência e risco empresarial.', url: 'https://www.iberinform.es/' },
  { id: 'c4', categoryId: 'cat-com', name: 'OpenCorporates', description: 'Base mundial de dados empresariais abertos.', url: 'https://opencorporates.com' },
  { id: 'c5', categoryId: 'cat-com', name: 'Brownbook', description: 'Diretório global de negócios comunitário.', url: 'https://www.brownbook.net/' },

  // 60-61: Geolocalização
  { id: 'g1', categoryId: 'cat-geo', name: 'Qual é o meu IP', description: 'Geolocalização IP e dados de rede.', url: 'https://www.cual-es-mi-ip.net/' },
  { id: 'g2', categoryId: 'cat-geo', name: 'Google Maps', description: 'O mapa definitivo para análise geoespacial.', url: 'https://www.google.es/maps/' },

  // 62-64: Rastreamento
  { id: 'rt1', categoryId: 'cat-track', name: 'Quem me leu', description: 'Rastreamento de abertura de e-mails.', url: 'https://whoreadme.com' },
  { id: 'rt2', categoryId: 'cat-track', name: 'Flightradar', description: 'Monitoramento global de voos em tempo real.', url: 'https://www.flightradar24.com' },
  { id: 'rt3', categoryId: 'cat-track', name: 'IP Logger', description: 'Rastreamento de localização via links curtos.', url: 'https://iplogger.org/es/' },

  // 65-67: Segurança
  { id: 'sec1', categoryId: 'cat-sec', name: 'VirusTotal', description: 'Investigação de ameaças em arquivos e URLs.', url: 'https://www.virustotal.com/gui/home/upload' },
  { id: 'sec2', categoryId: 'cat-sec', name: 'Sukuri SiteCheck', description: 'Detecção de malware em sites públicos.', url: 'https://sitecheck.sucuri.net/' },
  { id: 'sec3', categoryId: 'cat-sec', name: 'Hybrid Analysis', description: 'Sandbox gratuita para análise de malware.', url: 'https://www.hybrid-análise.com/' },

  // 68-72: Facebook
  { id: 'fb1', categoryId: 'cat-fb', name: 'Stalkface', description: 'Exploração de atividade pública no Facebook.', url: 'https://stalkface.com/es/' },
  { id: 'fb2', categoryId: 'cat-fb', name: 'Lookup ID', description: 'Identificação de IDs únicos de perfil.', url: 'https://lookup-id.com/' },
  { id: 'fb3', categoryId: 'cat-fb', name: 'Inteltechniques FB', description: 'Ferramentas de busca social e perfil.', url: 'https://inteltechniques.com/osint/facebook.html' },
  { id: 'fb4', categoryId: 'cat-fb', name: 'Sleep Stats', description: 'Análise de comportamento via atividade na plataforma.', url: 'https://github.com/sqren/fb-sleep-stats' },
  { id: 'fb5', categoryId: 'cat-fb', name: 'Video Downloader', description: 'Baixador de vídeos públicos do Facebook.', url: 'https://fdown.net/' },

  // 73-77: Instagram
  { id: 'ig1', categoryId: 'cat-ig', name: 'Instaloader', description: 'Download de mídias e metadados via CLI.', url: 'https://github.com/instaloader/instaloader' },
  { id: 'ig2', categoryId: 'cat-ig', name: 'ID Picker', description: 'Extração de IDs e dados de perfil.', url: 'https://commentpicker.com/instagram-user-id.php' },
  { id: 'ig3', categoryId: 'cat-ig', name: 'Sterraxcyl', description: 'Investigação profunda de perfis de alvo.', url: 'https://github.com/novitae/sterraxcyl' },
  { id: 'ig4', categoryId: 'cat-ig', name: 'SSS Instagram', description: 'Downloader rápido de mídias do Instagram.', url: 'https://sssinstagram.com/es' },
  { id: 'ig5', categoryId: 'cat-ig', name: 'Geluchat', description: 'Análise OSINT para redes Meta.', url: 'https://addons.mozilla.org/es/firefox/addon/facebook-instagram-osint/' },

  // 78-82: Twitter
  { id: 'tw1', categoryId: 'cat-tw', name: 'Twitter ID Finder', description: 'Conversor de username para ID numérico.', url: 'https://twiteridfinder.com/' },
  { id: 'tw2', categoryId: 'cat-tw', name: 'Twint', description: 'Busca de tweets sem limitação de API.', url: 'https://github.com/twintproject/twint' },
  { id: 'tw3', categoryId: 'cat-tw', name: 'X2Twitter', description: 'Salvar mídias e conteúdo da plataforma X.', url: 'https://x2twitter.com/es/download-twitter-photo' },
  { id: 'tw4', categoryId: 'cat-tw', name: 'Getfvid X', description: 'Salvar mídias e conteúdo da plataforma X.', url: 'https://www.getfvid.com/es/twitter' },
  { id: 'tw5', categoryId: 'cat-tw', name: 'Tweetdeck', description: 'Painel de monitoramento profissional.', url: 'https://create.twitter.com/es/products/tweetdeck' },

  // 83-85: TikTok
  { id: 'tk1', categoryId: 'cat-tk', name: 'TikTok Comment Picker', description: 'Ferramentas de extração de dados do TikTok.', url: 'https://commentpicker.com/tiktok-id.php' },
  { id: 'tk2', categoryId: 'cat-tk', name: 'SSSTIK', description: 'Remoção de marca d\'água de vídeos.', url: 'https://ssstik.io/es' },
  { id: 'tk3', categoryId: 'cat-tk', name: 'TikTok Scraper', description: 'Extração massiva de dados da plataforma.', url: 'https://github.com/drawrowfly/tiktok-scraper' },

  // 86-87: Transparência
  { id: 'tr1', categoryId: 'cat-transp', name: 'Transparentia', description: 'Monitoramento de gastos e influência política.', url: 'https://transparentia.newtral.es/buscador' },
  { id: 'tr2', categoryId: 'cat-transp', name: 'Infoelectoral', description: 'Dados históricos sobre votações e candidatos.', url: 'https://infoelectoral.interior.gob.es/es/inicio/' },

  // 88-89: Geradores
  { id: 'ge1', categoryId: 'cat-gen', name: 'Random Face Generator', description: 'Geração de rostos hiper-realistas via IA.', url: 'https://this-person-does-not-exist.com/en' },
  { id: 'ge2', categoryId: 'cat-gen', name: 'Fake Name Generator', description: 'Criação de personas e identidades digitais.', url: 'https://es.fakenamegenerator.com/' },

  // 90-98: Plataformas Integradas
  { id: 'pl1', categoryId: 'cat-plat', name: 'Maltego', description: 'Padrão ouro em análise de links e inteligência visual.', url: 'https://www.maltego.com/' },
  { id: 'pl2', categoryId: 'cat-plat', name: 'Lampyre', description: 'Plataforma russa robusta de investigação analítica.', url: 'https://lampyre.io/' },
  { id: 'pl3', categoryId: 'cat-plat', name: 'SocialLinks', description: 'Conectores avançados para inteligência social.', url: 'https://sociallinks.io/es' },
  { id: 'pl4', categoryId: 'cat-plat', name: 'Recon-ng', description: 'Framework CLI modular para reconhecimento web.', url: 'https://github.com/lanmaster53/recon-ng' },
  { id: 'pl5', categoryId: 'cat-plat', name: 'Spiderfoot', description: 'Automação de inteligência de fonte aberta.', url: 'https://github.com/smicallef/spiderfoot' },
  { id: 'pl6', categoryId: 'cat-plat', name: 'TheHarvester', description: 'Coleta de e-mails, subdomínios e nomes públicos.', url: 'https://github.com/laramies/theHarvester' },
  { id: 'pl7', categoryId: 'cat-plat', name: 'Skopenow', description: 'Plataforma para investigação corporativa e fraude.', url: 'https://www.skopenow.com/' },
  { id: 'pl8', categoryId: 'cat-plat', name: 'Maryam', description: 'Framework OSINT open-source modular.', url: 'https://github.com/saeeddhqan/Maryam' },
  { id: 'pl9', categoryId: 'cat-plat', name: 'iKy', description: 'Ferramenta visual de perfil de alvo.', url: 'https://github.com/kennbroorg/iKy' },

  // 99: Busca Avançada
  { id: 'ad1', categoryId: 'cat-adv', name: 'Google Dorks', description: 'A maior biblioteca de vulnerabilidades via pesquisa.', url: 'https://www.exploit-db.com/google-hacking-database' },

  // 100-105: Brasil - Documentos
  { id: 'br-d1', categoryId: 'cat-br-doc', name: 'CPF Online', description: 'Consulta pública de situação cadastral no Brasil.', url: 'https://cpfonline.com.br' },
  { id: 'br-d2', categoryId: 'cat-br-doc', name: 'Consulta CPF', description: 'Portal privado para verificação de CPFs.', url: 'https://www.consultacpf.com.br' },
  { id: 'br-d3', categoryId: 'cat-br-doc', name: 'Serasa Experian', description: 'Base de dados brasileira sobre crédito e débitos.', url: 'https://www.serasaexperian.com.br' },
  { id: 'br-d4', categoryId: 'cat-br-doc', name: 'Receita Federal', description: 'Órgão oficial para dados tributários brasileiros.', url: 'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/perguntas-frequentes/tributos/imposto-de-renda' },
  { id: 'br-d5', categoryId: 'cat-br-doc', name: 'Detran', description: 'Consulta de veículos e condutores em SP.', url: 'https://www.detran.sp.gov.br' },
  { id: 'br-d6', categoryId: 'cat-br-doc', name: 'Jucerja', description: 'Registro comercial e dados de empresas no RJ.', url: 'https://www.jucerja.rj.gov.br' },

  // 106-110: Brasil - Redes Sociais
  { id: 'br-s1', categoryId: 'cat-br-soc', name: 'Facebook Brasil', description: 'Busca reversa focada em perfis brasileiros.', url: 'https://www.facebook.com' },
  { id: 'br-s2', categoryId: 'cat-br-soc', name: 'Instagram Brasil', description: 'Análise de perfis e localização nacional.', url: 'https://www.instagram.com' },
  { id: 'br-s3', categoryId: 'cat-br-soc', name: 'Twitter Brasil', description: 'Monitoramento de tweets e trends nacionais.', url: 'https://twitter.com' },
  { id: 'br-s4', categoryId: 'cat-br-soc', name: 'LinkedIn Brasil', description: 'Busca profissional no mercado nacional.', url: 'https://www.linkedin.com' },
  { id: 'br-s5', categoryId: 'cat-br-soc', name: 'Orkut (Arquivo)', description: 'Recuperação histórica de dados sociais antigos.', url: 'https://archive.org/web/' },

  // 111-114: Brasil - Telefone
  { id: 'br-t1', categoryId: 'cat-br-tel', name: 'TrueCaller BR', description: 'Identificador otimizado para números nacionais.', url: 'https://www.truecaller.com/br' },
  { id: 'br-t2', categoryId: 'cat-br-tel', name: 'Consulta Telefone', description: 'Diretório nacional de assinantes e endereços.', url: 'https://www.consultatelefone.com.br' },
  { id: 'br-t3', categoryId: 'cat-br-tel', name: 'Quem Ligou', description: 'Fórum brasileiro de denúncia de números suspeitos.', url: 'https://www.quemligou.com.br' },
  { id: 'br-t4', categoryId: 'cat-br-tel', name: 'Identificador de Chamadas', description: 'App para detecção de spam telefônico nacional.', url: 'https://www.identificadordechamadas.com.br' },

  // 115-117: Brasil - E-mail
  { id: 'br-m1', categoryId: 'cat-br-mail', name: 'Hunter.io BR', description: 'Extração de e-mails de domínios corporativos .br.', url: 'https://hunter.io' },
  { id: 'br-m2', categoryId: 'cat-br-mail', name: 'RocketReach BR', description: 'Conectando profissionais brasileiros via e-mail.', url: 'https://rocketreach.co' },
  { id: 'br-m3', categoryId: 'cat-br-mail', name: 'Clearbit BR', description: 'Enriquecimento de dados de contatos no Brasil.', url: 'https://clearbit.com' },

  // 118-124: Brasil - Comercial
  { id: 'br-c1', categoryId: 'cat-br-com', name: 'Jucerja Empresas', description: 'Consulta completa de CNPJs e sócios no Rio.', url: 'https://www.jucerja.rj.gov.br' },
  { id: 'br-c2', categoryId: 'cat-br-com', name: 'Jucesp Empresas', description: 'Dados societários e mercantis no estado de SP.', url: 'https://www.jucesp.sp.gov.br' },
  { id: 'br-c3', categoryId: 'cat-br-com', name: 'Jucesc Empresas', description: 'Registro de empresas e contratos em SC.', url: 'https://www.jucesc.sc.gov.br' },
  { id: 'br-c4', categoryId: 'cat-br-com', name: 'Consulta Empresa', description: 'Portal unificado para busca de dados cadastrais.', url: 'https://www.consultaempresa.com.br' },
  { id: 'br-c5', categoryId: 'cat-br-com', name: 'Sintegra', description: 'Sistema integrado de informações sobre operações interestaduais.', url: 'https://www1.sintegra.gov.br' },
  { id: 'br-c6', categoryId: 'cat-br-com', name: 'CNPJ Fácil', description: 'Ferramenta simplificada para consulta de empresas.', url: 'https://cnpjfacil.com.br' },
  { id: 'br-c7', categoryId: 'cat-br-com', name: 'Dados Públicos', description: 'Repositório de informações empresariais abertas.', url: 'https://dadospublicos.info' },

  // 125-127: Brasil - Geolocalização
  { id: 'br-g1', categoryId: 'cat-br-geo', name: 'Google Maps BR', description: 'Mapas e Street View otimizados para o Brasil.', url: 'https://www.google.com.br/maps' },
  { id: 'br-g2', categoryId: 'cat-br-geo', name: 'OpenStreetMap BR', description: 'Mapa comunitário livre com dados nacionais.', url: 'https://www.openstreetmap.org' },
  { id: 'br-g3', categoryId: 'cat-br-geo', name: 'Waze Brasil', description: 'Dados de tráfego e incidentes em tempo real.', url: 'https://www.waze.com' },

  // 128-132: Brasil - Imóveis
  { id: 'br-i1', categoryId: 'cat-br-imo', name: 'Imóvel Web', description: 'Principal portal de anúncios imobiliários.', url: 'https://www.imovelweb.com.br' },
  { id: 'br-i2', categoryId: 'cat-br-imo', name: 'Vivareal', description: 'Busca de casas e apartamentos em território nacional.', url: 'https://www.vivareal.com.br' },
  { id: 'br-i3', categoryId: 'cat-br-imo', name: 'Zap Imóveis', description: 'Líder em classificados de imóveis no Brasil.', url: 'https://www.zapimoveis.com.br' },
  { id: 'br-i4', categoryId: 'cat-br-imo', name: 'Airbnb Brasil', description: 'Hospedagens e locais para curta temporada.', url: 'https://www.airbnb.com.br' },
  { id: 'br-i5', categoryId: 'cat-br-imo', name: 'Registro de Imóveis', description: 'Portal oficial do CNJ para consulta de escrituras.', url: 'https://www.cnj.jus.br' },

  // 133-137: Brasil - Jurídico
  { id: 'br-j1', categoryId: 'cat-br-jur', name: 'Consulta Processual', description: 'Busca unificada de processos nos tribunais brasileiros.', url: 'https://www.cnj.jus.br' },
  { id: 'br-j2', categoryId: 'cat-br-jur', name: 'STF', description: 'Portal oficial do Supremo Tribunal Federal.', url: 'https://portal.stf.jus.br' },
  { id: 'br-j3', categoryId: 'cat-br-jur', name: 'STJ', description: 'Superior Tribunal de Justiça e suas decisões.', url: 'https://www.stj.jus.br' },
  { id: 'br-j4', categoryId: 'cat-br-jur', name: 'OAB', description: 'Cadastro Nacional de Advogados e profissionais.', url: 'https://www.oab.org.br' },
  { id: 'br-j5', categoryId: 'cat-br-jur', name: 'Senatcon', description: 'Direito do consumidor e processos administrativos.', url: 'https://www.senado.leg.br' },

  // 138-142: Brasil - Financeiro
  { id: 'br-f1', categoryId: 'cat-br-fin', name: 'Banco Central', description: 'Dados financeiros oficiais e histórico de taxas.', url: 'https://www.bcb.gov.br' },
  { id: 'br-f2', categoryId: 'cat-br-fin', name: 'CVM', description: 'Comissão de Valores Mobiliários do Brasil.', url: 'https://www.gov.br/cvm' },
  { id: 'br-f3', categoryId: 'cat-br-fin', name: 'Consulta Dívida', description: 'Portal para verificação de débitos protestados.', url: 'https://www.consultadivida.com.br' },
  { id: 'br-f4', categoryId: 'cat-br-fin', name: 'Score de Crédito', description: 'Verificação de pontuação financeira Serasa.', url: 'https://www.serasaexperian.com.br' },
  { id: 'br-f5', categoryId: 'cat-br-fin', name: 'Extrato CPF', description: 'Dados de benefícios sociais e previdenciários.', url: 'https://www.gov.br/cidadania/pt-br' },

  // 143-146: Brasil - Segurança
  { id: 'br-se1', categoryId: 'cat-br-sec', name: 'VirusTotal', description: 'Análise de segurança baseada em nuvem pública.', url: 'https://www.virustotal.com' },
  { id: 'br-se2', categoryId: 'cat-br-sec', name: 'URLhaus', description: 'Monitoramento de domínios maliciosos e botnets.', url: 'https://urlhaus.abuse.ch' },
  { id: 'br-se3', categoryId: 'cat-br-sec', name: 'PhishTank', description: 'Base comunitária contra ataques de Phishing.', url: 'https://www.phishtank.com' },
  { id: 'br-se4', categoryId: 'cat-br-sec', name: 'Abuse.ch', description: 'Plataforma de inteligência sobre crimes digitais.', url: 'https://abuse.ch' },

  // 147-150: Brasil - Transparência
  { id: 'br-tr1', categoryId: 'cat-br-tr', name: 'Portal da Transparência', description: 'Dados oficiais sobre gastos do governo federal.', url: 'https://www.portaldatransparencia.gov.br' },
  { id: 'br-tr2', categoryId: 'cat-br-tr', name: 'Serenata de Amor', description: 'Projeto de IA para fiscalização de gastos públicos.', url: 'https://serenata.ai' },
  { id: 'br-tr3', categoryId: 'cat-br-tr', name: 'Gastos Públicos', description: 'Análise independente das contas nacionais.', url: 'https://www.gastospublicos.com.br' },
  { id: 'br-tr4', categoryId: 'cat-br-tr', name: 'Dados Abertos', description: 'Portal oficial de dados abertos do Brasil.', url: 'https://dados.gov.br' }
];
