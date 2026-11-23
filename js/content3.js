/* NetTrail - níveis 6 (Cisco na prática) e 7 (Nuvem OCI). Mesmo formato de content.js. */
window.NT_CONTENT.units.push(
/* ===================== U25 ===================== */
{ id: "u25", sec: 6, icon: "⌨️", color: "#0891b2",
  title: ["Cisco IOS básico", "Cisco IOS Basics"],
  guide: [
    ["Modos: usuário (Router>), privilegiado (Router#, entra com enable), configuração global (Router(config)#, com configure terminal) e interface (Router(config-if)#). 'exit' volta um nível; 'end' volta direto ao #.",
     "Modes: user (Router>), privileged (Router#, via enable), global config (Router(config)#, via configure terminal) and interface (Router(config-if)#). 'exit' goes back one level; 'end' jumps straight to #."],
    ["A running-config fica na RAM e é perdida ao reiniciar. Para salvar: copy running-config startup-config (fica na NVRAM).",
     "The running-config lives in RAM and is lost on reboot. To save: copy running-config startup-config (stored in NVRAM)."],
    ["Senhas: enable secret (criptografada); line console 0 → password + login; service password-encryption esconde as senhas em texto puro.",
     "Passwords: enable secret (encrypted); line console 0 → password + login; service password-encryption hides plain-text passwords."],
    ["'?' mostra a ajuda e Tab completa comandos. hostname muda o nome; banner motd define a mensagem de aviso. Treine tudo no Cisco Packet Tracer.",
     "'?' shows help and Tab completes commands. hostname changes the name; banner motd sets the warning message. Practice everything in Cisco Packet Tracer."]
  ],
  q: [
    { t: "mc", q: ["O prompt 'Router#' indica qual modo?", "The prompt 'Router#' indicates which mode?"], o: [["Privilegiado", "Privileged EXEC"], ["Usuário", "User EXEC"], ["Configuração global", "Global configuration"], ["Interface", "Interface"]], a: 0 },
    { t: "fill", q: ["Comando para sair de Router> e entrar no modo privilegiado: ___", "Command to go from Router> into privileged mode: ___"], a: ["enable", "en"] },
    { t: "fill", q: ["Complete para entrar na configuração global:  configure ___", "Complete to enter global configuration:  configure ___"], a: ["terminal", "t", "term"] },
    { t: "mc", q: ["Onde fica a running-config?", "Where is the running-config stored?"], o: ["RAM", "NVRAM", "Flash", "ROM"], a: 0 },
    { t: "mc", q: ["Qual comando salva a configuração para sobreviver a um reboot?", "Which command saves the configuration so it survives a reboot?"], o: ["copy running-config startup-config", "show running-config", "reload", "erase startup-config"], a: 0 },
    { t: "mc", q: ["Qual comando define a senha do modo privilegiado já criptografada?", "Which command sets the privileged-mode password already encrypted?"], o: ["enable secret", "enable password", "line console 0", "login"], a: 0 },
    { t: "mc", q: ["Qual comando esconde as senhas que aparecem em texto puro na configuração?", "Which command hides plain-text passwords in the configuration?"], o: ["service password-encryption", "no service password", "enable secret", "crypto key generate rsa"], a: 0 },
    { t: "order", q: ["Ordene para trocar o nome do switch para SW1 e salvar", "Order the steps to rename the switch to SW1 and save"],
      items: ["enable", "configure terminal", "hostname SW1", "end", "copy running-config startup-config"] },
    { t: "tf", q: ["Se o equipamento reiniciar, as alterações que não foram salvas na startup-config são perdidas.", "If the device reboots, changes not saved to the startup-config are lost."], a: true },
    { t: "mc", q: ["Qual tecla/comando mostra a ajuda contextual no IOS?", "Which key/command shows context help in IOS?"], o: ["?", "help me", "F1", "man"], a: 0 },
    { t: "mc", q: ["Qual comando cria a mensagem de aviso exibida ao conectar?", "Which command creates the warning message shown when connecting?"], o: ["banner motd", "hostname", "description", "logging"], a: 0 },
    { t: "match", q: ["Associe o prompt ao modo", "Match the prompt to the mode"],
      pairs: [["Router>", ["Usuário", "User"]], ["Router#", ["Privilegiado", "Privileged"]], ["Router(config)#", ["Config. global", "Global config"]], ["Router(config-if)#", ["Interface", "Interface"]]] },
    { t: "mc", q: ["Qual ferramenta gratuita da Cisco simula redes para praticar comandos?", "Which free Cisco tool simulates networks to practice commands?"], o: ["Packet Tracer", "Wireshark", "PuTTY", "Excel"], a: 0 }
  ]
},
/* ===================== U26 ===================== */
{ id: "u26", sec: 6, icon: "🔀", color: "#0e7490",
  title: ["Configurando switches", "Configuring Switches"],
  guide: [
    ["Criar VLAN: vlan 10 → name VENDAS. Porta de acesso: interface fa0/1 → switchport mode access → switchport access vlan 10.",
     "Create a VLAN: vlan 10 → name SALES. Access port: interface fa0/1 → switchport mode access → switchport access vlan 10."],
    ["Trunk: switchport mode trunk; limite as VLANs com switchport trunk allowed vlan 10,20. Várias portas de uma vez: interface range fa0/1 - 10.",
     "Trunk: switchport mode trunk; limit VLANs with switchport trunk allowed vlan 10,20. Many ports at once: interface range fa0/1 - 10."],
    ["Switch camada 2 recebe IP de gerência numa SVI (interface vlan 1 → ip address … → no shutdown) e precisa de ip default-gateway.",
     "A layer 2 switch gets its management IP on an SVI (interface vlan 1 → ip address … → no shutdown) and needs ip default-gateway."],
    ["Port security: switchport port-security, maximum 1, mac-address sticky. Na violação padrão (shutdown) a porta vai para err-disabled; recupere com shutdown + no shutdown.",
     "Port security: switchport port-security, maximum 1, mac-address sticky. On the default violation (shutdown) the port goes err-disabled; recover with shutdown + no shutdown."]
  ],
  q: [
    { t: "fill", q: ["Complete para tornar a porta de acesso:  switchport mode ___", "Complete to make the port an access port:  switchport mode ___"], a: ["access"] },
    { t: "fill", q: ["Complete para colocar a porta na VLAN 10:  switchport access vlan ___", "Complete to put the port in VLAN 10:  switchport access vlan ___"], a: ["10"] },
    { t: "mc", q: ["No modo de configuração global, como criar a VLAN 20?", "In global configuration mode, how do you create VLAN 20?"], o: ["vlan 20", "create vlan 20", "switchport vlan 20", "interface vlan 20 only"], a: 0 },
    { t: "mc", q: ["Qual comando configura várias portas de uma vez?", "Which command configures many ports at once?"], o: ["interface range", "interface all", "port group", "vlan range"], a: 0 },
    { t: "mc", q: ["Onde um switch camada 2 recebe o IP de gerência?", "Where does a layer 2 switch get its management IP?"], o: [["Numa interface VLAN (SVI)", "On a VLAN interface (SVI)"], ["Numa porta Fast Ethernet", "On a Fast Ethernet port"], ["Na linha de console", "On the console line"], ["Não pode ter IP", "It can't have an IP"]], a: 0 },
    { t: "mc", q: ["Qual comando define o gateway de um switch camada 2?", "Which command sets the gateway on a layer 2 switch?"], o: ["ip default-gateway", "ip route 0.0.0.0", "default-router", "ip gateway"], a: 0 },
    { t: "mc", q: ["O que faz 'switchport port-security mac-address sticky'?", "What does 'switchport port-security mac-address sticky' do?"], o: [["Aprende o MAC conectado e grava na configuração", "Learns the connected MAC and writes it to the config"], ["Bloqueia todos os MACs", "Blocks every MAC"], ["Troca o MAC do switch", "Changes the switch MAC"], ["Cria uma VLAN", "Creates a VLAN"]], a: 0 },
    { t: "mc", q: ["Com port security no modo padrão, o que acontece numa violação?", "With port security in default mode, what happens on a violation?"], o: [["A porta vai para err-disabled", "The port goes err-disabled"], ["Nada", "Nothing"], ["O switch reinicia", "The switch reboots"], ["A VLAN é apagada", "The VLAN is deleted"]], a: 0 },
    { t: "mc", q: ["Como reativar uma porta em err-disabled?", "How do you bring back an err-disabled port?"], o: [["shutdown e depois no shutdown na interface", "shutdown then no shutdown on the interface"], ["reload no switch inteiro sempre", "Always reload the whole switch"], ["Trocar o cabo", "Swap the cable"], ["Apagar a VLAN", "Delete the VLAN"]], a: 0 },
    { t: "order", q: ["Ordene para colocar a porta fa0/5 na VLAN 10", "Order to put port fa0/5 in VLAN 10"],
      items: ["configure terminal", "interface fa0/5", "switchport mode access", "switchport access vlan 10", "end"] },
    { t: "fill", q: ["Complete para liberar só as VLANs 10 e 20 no trunk:  switchport trunk allowed ___ 10,20", "Complete to allow only VLANs 10 and 20 on the trunk:  switchport trunk allowed ___ 10,20"], a: ["vlan"] },
    { t: "mc", q: ["Qual comando mostra quais portas estão em cada VLAN?", "Which command shows which ports are in each VLAN?"], o: ["show vlan brief", "show ip route", "show version", "show clock"], a: 0 },
    { t: "tf", q: ["Por padrão, todas as portas de um switch Cisco estão na VLAN 1.", "By default, all ports on a Cisco switch are in VLAN 1."], a: true }
  ]
},
/* ===================== U27 ===================== */
{ id: "u27", sec: 6, icon: "🧭", color: "#155e75",
  title: ["Configurando roteadores", "Configuring Routers"],
  guide: [
    ["Interface: interface g0/0 → ip address 192.168.1.1 255.255.255.0 → no shutdown. Interfaces de roteador vêm desligadas por padrão!",
     "Interface: interface g0/0 → ip address 192.168.1.1 255.255.255.0 → no shutdown. Router interfaces are shut down by default!"],
    ["Rota estática: ip route REDE MÁSCARA PRÓXIMO-SALTO. Rota padrão: ip route 0.0.0.0 0.0.0.0 PRÓXIMO-SALTO.",
     "Static route: ip route NETWORK MASK NEXT-HOP. Default route: ip route 0.0.0.0 0.0.0.0 NEXT-HOP."],
    ["Router-on-a-stick: uma subinterface por VLAN (interface g0/0.10 → encapsulation dot1Q 10 → ip address …) ligada a um trunk.",
     "Router-on-a-stick: one subinterface per VLAN (interface g0/0.10 → encapsulation dot1Q 10 → ip address …) connected to a trunk."],
    ["DHCP: ip dhcp excluded-address (reserva IPs) → ip dhcp pool NOME → network → default-router → dns-server. Se o servidor DHCP estiver em outra rede, use ip helper-address.",
     "DHCP: ip dhcp excluded-address (reserves IPs) → ip dhcp pool NAME → network → default-router → dns-server. If the DHCP server is on another network, use ip helper-address."],
    ["NAT/PAT: ip nat inside (LAN) e ip nat outside (internet); ip nat inside source list 1 interface g0/1 overload.",
     "NAT/PAT: ip nat inside (LAN) and ip nat outside (internet); ip nat inside source list 1 interface g0/1 overload."]
  ],
  q: [
    { t: "tf", q: ["As interfaces de um roteador Cisco vêm ativadas por padrão.", "Cisco router interfaces are enabled by default."], a: false, e: ["É preciso usar 'no shutdown'.", "You need 'no shutdown'."] },
    { t: "fill", q: ["Complete com a máscara /24:  ip address 192.168.1.1 ___", "Complete with the /24 mask:  ip address 192.168.1.1 ___"], a: ["255.255.255.0"] },
    { t: "mc", q: ["Qual comando cria uma rota padrão via 10.0.0.2?", "Which command creates a default route via 10.0.0.2?"], o: ["ip route 0.0.0.0 0.0.0.0 10.0.0.2", "ip default-gateway 10.0.0.2", "ip route 10.0.0.2 0.0.0.0", "default route 10.0.0.2"], a: 0 },
    { t: "mc", q: ["Rota estática para 172.16.0.0/16 via 10.0.0.2:", "Static route to 172.16.0.0/16 via 10.0.0.2:"], o: ["ip route 172.16.0.0 255.255.0.0 10.0.0.2", "ip route 172.16.0.0 255.255.255.0 10.0.0.2", "ip route 10.0.0.2 172.16.0.0", "route add 172.16.0.0/16"], a: 0 },
    { t: "mc", q: ["O 'router-on-a-stick' usa:", "Router-on-a-stick uses:"], o: [["Subinterfaces com dot1Q ligadas a um trunk", "dot1Q subinterfaces connected to a trunk"], ["Um cabo por VLAN", "One cable per VLAN"], ["Wi-Fi", "Wi-Fi"], ["Somente rotas estáticas", "Only static routes"]], a: 0 },
    { t: "fill", q: ["Complete a subinterface da VLAN 10:  encapsulation ___ 10", "Complete the VLAN 10 subinterface:  encapsulation ___ 10"], a: ["dot1q"] },
    { t: "mc", q: ["Como impedir que o DHCP entregue os IPs .1 a .10?", "How do you stop DHCP from handing out .1 to .10?"], o: ["ip dhcp excluded-address 192.168.1.1 192.168.1.10", "no dhcp 1-10", "ip dhcp pool 1-10", "deny 192.168.1.1-10"], a: 0 },
    { t: "mc", q: ["Dentro do pool DHCP, qual comando define o gateway dos clientes?", "Inside the DHCP pool, which command sets the clients' gateway?"], o: ["default-router", "ip default-gateway", "gateway", "next-hop"], a: 0 },
    { t: "mc", q: ["O servidor DHCP está em outra rede. O que configurar na interface do roteador voltada aos clientes?", "The DHCP server is on another network. What do you set on the router interface facing the clients?"], o: ["ip helper-address", "ip dhcp pool", "ip nat inside", "no shutdown"], a: 0 },
    { t: "mc", q: ["Qual palavra no comando de NAT faz vários hosts compartilharem 1 IP (PAT)?", "Which keyword in the NAT command lets many hosts share 1 IP (PAT)?"], o: ["overload", "static", "pool", "outside"], a: 0 },
    { t: "mc", q: ["A interface voltada para a internet recebe:", "The internet-facing interface gets:"], o: ["ip nat outside", "ip nat inside", "ip helper-address", "switchport mode trunk"], a: 0 },
    { t: "order", q: ["Ordene a criação de um pool DHCP", "Order the creation of a DHCP pool"],
      items: ["ip dhcp pool LAN", "network 192.168.1.0 255.255.255.0", "default-router 192.168.1.1", "dns-server 8.8.8.8"] },
    { t: "mc", q: ["Qual comando mostra um resumo das interfaces, IPs e status?", "Which command shows a summary of interfaces, IPs and status?"], o: ["show ip interface brief", "show running-config", "show history", "show users"], a: 0 }
  ]
},
/* ===================== U28 ===================== */
{ id: "u28", sec: 6, icon: "🧰", color: "#0f766e",
  title: ["ACLs e serviços", "ACLs & Services"],
  guide: [
    ["ACL padrão (1–99) filtra só pelo IP de origem: coloque perto do DESTINO. ACL estendida (100–199) filtra origem, destino, protocolo e porta: coloque perto da ORIGEM.",
     "Standard ACL (1–99) filters only by source IP: place it near the DESTINATION. Extended ACL (100–199) filters source, destination, protocol and port: place it near the SOURCE."],
    ["Toda ACL termina com um 'deny any' implícito. Wildcard é o inverso da máscara: /24 → 0.0.0.255. Aplique com ip access-group N in|out.",
     "Every ACL ends with an implicit 'deny any'. A wildcard is the inverse of the mask: /24 → 0.0.0.255. Apply with ip access-group N in|out."],
    ["SSH: hostname + ip domain-name + crypto key generate rsa + username admin secret … + line vty 0 4 → transport input ssh → login local.",
     "SSH: hostname + ip domain-name + crypto key generate rsa + username admin secret … + line vty 0 4 → transport input ssh → login local."],
    ["NTP sincroniza o horário (ntp server). Syslog tem níveis de 0 (emergência) a 7 (debug). CDP/LLDP descobrem vizinhos (show cdp neighbors).",
     "NTP syncs time (ntp server). Syslog has levels 0 (emergency) to 7 (debug). CDP/LLDP discover neighbors (show cdp neighbors)."]
  ],
  q: [
    { t: "mc", q: ["O que existe no final de toda ACL?", "What exists at the end of every ACL?"], o: [["Um deny implícito", "An implicit deny"], ["Um permit implícito", "An implicit permit"], ["Nada", "Nothing"], ["Um log automático", "An automatic log"]], a: 0 },
    { t: "mc", q: ["Uma ACL padrão filtra por:", "A standard ACL filters by:"], o: [["IP de origem", "Source IP"], ["IP de destino", "Destination IP"], ["Porta TCP", "TCP port"], ["MAC", "MAC address"]], a: 0 },
    { t: "mc", q: ["Qual a faixa numérica das ACLs IPv4 estendidas?", "What is the number range for extended IPv4 ACLs?"], o: ["100–199", "1–99", "200–299", "1000–1999"], a: 0 },
    { t: "mc", q: ["Qual o wildcard de uma rede /24?", "What is the wildcard for a /24 network?"], o: ["0.0.0.255", "255.255.255.0", "0.0.0.0", "255.255.255.255"], a: 0 },
    { t: "mc", q: ["Onde se recomenda aplicar uma ACL estendida?", "Where should an extended ACL be applied?"], o: [["Perto da origem", "Near the source"], ["Perto do destino", "Near the destination"], ["Em todas as interfaces", "On every interface"], ["Só na console", "Only on the console"]], a: 0 },
    { t: "fill", q: ["Aplique a ACL 10 na entrada da interface:  ip access-group 10 ___", "Apply ACL 10 inbound on the interface:  ip access-group 10 ___"], a: ["in"] },
    { t: "mc", q: ["O que é necessário para habilitar SSH em um equipamento Cisco?", "What is needed to enable SSH on a Cisco device?"], o: [["Hostname, domínio, chave RSA e usuário local", "Hostname, domain name, RSA key and local user"], ["Apenas uma senha de console", "Only a console password"], ["Uma VLAN nova", "A new VLAN"], ["Um servidor DHCP", "A DHCP server"]], a: 0 },
    { t: "fill", q: ["Nas linhas VTY, permita só SSH:  transport input ___", "On VTY lines, allow only SSH:  transport input ___"], a: ["ssh"] },
    { t: "mc", q: ["No syslog, o nível 0 significa:", "In syslog, level 0 means:"], o: [["Emergência", "Emergency"], ["Debug", "Debugging"], ["Informativo", "Informational"], ["Aviso", "Warning"]], a: 0 },
    { t: "mc", q: ["Qual protocolo sincroniza o horário dos equipamentos?", "Which protocol synchronizes device time?"], o: ["NTP", "SNMP", "SMTP", "STP"], a: 0 },
    { t: "mc", q: ["Qual comando mostra os vizinhos Cisco diretamente conectados?", "Which command shows directly connected Cisco neighbors?"], o: ["show cdp neighbors", "show arp", "show ip route", "show vlan"], a: 0 },
    { t: "tf", q: ["O nível 7 (debugging) gera muito mais mensagens que o nível 3 (errors).", "Level 7 (debugging) produces many more messages than level 3 (errors)."], a: true },
    { t: "match", q: ["Associe o nível de syslog", "Match the syslog level"], pairs: [["0", "Emergency"], ["3", "Error"], ["4", "Warning"], ["7", "Debugging"]] }
  ]
},
/* ===================== U29 ===================== */
{ id: "u29", sec: 6, icon: "6️⃣", color: "#7e22ce",
  title: ["IPv6", "IPv6"],
  guide: [
    ["IPv6 tem 128 bits em 8 grupos de 4 dígitos hexadecimais. Abreviação: tire os zeros à esquerda de cada grupo e troque UMA sequência de grupos zerados por '::'.",
     "IPv6 has 128 bits in 8 groups of 4 hex digits. Shortening: drop leading zeros in each group and replace ONE run of all-zero groups with '::'."],
    ["Tipos: global unicast (2000::/3, ex.: 2001:…), link-local (fe80::/10, sempre presente), loopback (::1), multicast (ff00::/8), unique local (fc00::/7).",
     "Types: global unicast (2000::/3, e.g. 2001:…), link-local (fe80::/10, always present), loopback (::1), multicast (ff00::/8), unique local (fc00::/7)."],
    ["Não existe broadcast em IPv6 (usa multicast). LANs usam /64. O NDP substitui o ARP.",
     "There is no broadcast in IPv6 (it uses multicast). LANs use /64. NDP replaces ARP."],
    ["SLAAC: o host monta o próprio endereço com o prefixo anunciado pelo roteador. No Cisco, ative o roteamento com ipv6 unicast-routing.",
     "SLAAC: the host builds its own address from the prefix advertised by the router. On Cisco, enable routing with ipv6 unicast-routing."]
  ],
  q: [
    { t: "mc", q: ["Qual a forma abreviada de 2001:0db8:0000:0000:0000:0000:0000:0001?", "What is the short form of 2001:0db8:0000:0000:0000:0000:0000:0001?"], o: ["2001:db8::1", "2001:db8:0:1", "2001::db8::1", "21:db8::1"], a: 0 },
    { t: "tf", q: ["O '::' pode aparecer duas vezes no mesmo endereço IPv6.", "'::' can appear twice in the same IPv6 address."], a: false, e: ["Seria impossível saber quantos zeros há em cada lugar.", "It would be impossible to know how many zeros go in each place."] },
    { t: "mc", q: ["Qual é o endereço de loopback no IPv6?", "What is the IPv6 loopback address?"], o: ["::1", "127.0.0.1", "fe80::1", "ff02::1"], a: 0 },
    { t: "mc", q: ["Endereços link-local começam com:", "Link-local addresses start with:"], o: ["fe80", "2001", "ff00", "::1"], a: 0 },
    { t: "mc", q: ["Qual tipo de endereço NÃO existe no IPv6?", "Which address type does NOT exist in IPv6?"], o: ["Broadcast", "Multicast", "Unicast", "Anycast"], a: 0 },
    { t: "mc", q: ["Qual o prefixo padrão de uma LAN IPv6?", "What is the standard prefix for an IPv6 LAN?"], o: ["/64", "/24", "/48", "/128"], a: 0 },
    { t: "mc", q: ["Qual protocolo substitui o ARP no IPv6?", "Which protocol replaces ARP in IPv6?"], o: ["NDP", "DHCP", "ICMPv4", "STP"], a: 0 },
    { t: "mc", q: ["O host gera o próprio endereço a partir do prefixo anunciado pelo roteador. Isso é:", "The host builds its own address from the prefix advertised by the router. This is:"], o: ["SLAAC", "NAT", "APIPA", "PAT"], a: 0 },
    { t: "fill", q: ["Complete para ativar o roteamento IPv6 no Cisco:  ipv6 ___-routing", "Complete to enable IPv6 routing on Cisco:  ipv6 ___-routing"], a: ["unicast"] },
    { t: "mc", q: ["Endereços global unicast pertencem à faixa:", "Global unicast addresses belong to the range:"], o: ["2000::/3", "fe80::/10", "ff00::/8", "fc00::/7"], a: 0 },
    { t: "match", q: ["Associe o endereço ao tipo", "Match the address to its type"], pairs: [["::1", "Loopback"], ["fe80::/10", "Link-local"], ["ff00::/8", "Multicast"], ["2000::/3", "Global unicast"]] },
    { t: "mc", q: ["Quantos grupos hexadecimais tem um endereço IPv6 completo?", "How many hex groups are in a full IPv6 address?"], o: ["8", "4", "6", "16"], a: 0 }
  ]
},
/* ===================== U30 ===================== */
{ id: "u30", sec: 7, icon: "☁️", color: "#c2410c",
  title: ["Conceitos de nuvem", "Cloud Concepts"],
  guide: [
    ["IaaS: o provedor dá a infraestrutura (VMs, rede, disco) e você cuida do SO e apps. PaaS: plataforma gerenciada (ex.: banco gerenciado). SaaS: software pronto (ex.: e-mail web).",
     "IaaS: the provider gives infrastructure (VMs, network, disk) and you manage the OS and apps. PaaS: managed platform (e.g. managed database). SaaS: ready-made software (e.g. web e-mail)."],
    ["Modelos: pública, privada, híbrida (on-premises + pública) e multicloud. A nuvem troca CapEx (comprar equipamento) por OpEx (pagar pelo uso).",
     "Models: public, private, hybrid (on-premises + public) and multicloud. Cloud swaps CapEx (buying equipment) for OpEx (paying for usage)."],
    ["Escalar vertical = máquina maior (mais CPU/RAM). Horizontal = mais máquinas. Elasticidade = crescer e diminuir automaticamente com a demanda.",
     "Scale vertically = bigger machine (more CPU/RAM). Horizontally = more machines. Elasticity = growing and shrinking automatically with demand."],
    ["Responsabilidade compartilhada: o provedor cuida da segurança DA nuvem (prédio, hardware, rede física); o cliente cuida da segurança NA nuvem (dados, acessos, configurações).",
     "Shared responsibility: the provider secures the cloud itself (building, hardware, physical network); the customer secures what's in the cloud (data, access, configuration)."]
  ],
  q: [
    { t: "mc", q: ["Você gerencia o sistema operacional e as aplicações; o provedor gerencia o hardware. Que modelo é esse?", "You manage the OS and apps; the provider manages the hardware. Which model is this?"], o: ["IaaS", "SaaS", "PaaS", "On-premises"], a: 0 },
    { t: "mc", q: ["Um e-mail corporativo usado direto no navegador é um exemplo de:", "Corporate e-mail used straight from the browser is an example of:"], o: ["SaaS", "IaaS", "PaaS", "Bare metal"], a: 0 },
    { t: "mc", q: ["Um banco de dados gerenciado, em que você só usa e não cuida do servidor, é:", "A managed database you just use without managing the server is:"], o: ["PaaS", "IaaS", "SaaS", "DaaS"], a: 0 },
    { t: "mc", q: ["Do ponto de vista financeiro, a nuvem troca:", "Financially, the cloud swaps:"], o: [["CapEx por OpEx", "CapEx for OpEx"], ["OpEx por CapEx", "OpEx for CapEx"], ["Salário por bônus", "Salary for bonus"], ["Nada muda", "Nothing changes"]], a: 0 },
    { t: "mc", q: ["Escalar horizontalmente significa:", "Scaling horizontally means:"], o: [["Adicionar mais instâncias", "Adding more instances"], ["Aumentar CPU e RAM da mesma máquina", "Adding CPU and RAM to the same machine"], ["Trocar de região", "Changing region"], ["Desligar servidores", "Turning servers off"]], a: 0 },
    { t: "mc", q: ["Escalar verticalmente significa:", "Scaling vertically means:"], o: [["Aumentar CPU/RAM da mesma máquina", "Adding CPU/RAM to the same machine"], ["Adicionar mais máquinas", "Adding more machines"], ["Usar outra nuvem", "Using another cloud"], ["Comprar um rack", "Buying a rack"]], a: 0 },
    { t: "mc", q: ["Ajustar recursos automaticamente para cima e para baixo conforme a demanda é:", "Automatically adjusting resources up and down with demand is:"], o: [["Elasticidade", "Elasticity"], ["Redundância", "Redundancy"], ["Latência", "Latency"], ["Virtualização", "Virtualization"]], a: 0 },
    { t: "mc", q: ["No modelo de responsabilidade compartilhada, quem cuida das permissões dos usuários?", "In the shared responsibility model, who manages user permissions?"], o: [["O cliente", "The customer"], ["O provedor", "The provider"], ["Ninguém", "Nobody"], ["O fabricante do hardware", "The hardware vendor"]], a: 0 },
    { t: "mc", q: ["Usar o data center próprio junto com uma nuvem pública é:", "Using your own data center together with a public cloud is:"], o: [["Nuvem híbrida", "Hybrid cloud"], ["Nuvem privada", "Private cloud"], ["SaaS", "SaaS"], ["Edge", "Edge"]], a: 0 },
    { t: "tf", q: ["Na nuvem pública, o cliente é responsável pela segurança física do data center.", "In the public cloud, the customer is responsible for the data center's physical security."], a: false },
    { t: "match", q: ["Associe o modelo", "Match the model"],
      pairs: [["IaaS", ["Máquinas virtuais", "Virtual machines"]], ["PaaS", ["Plataforma gerenciada", "Managed platform"]], ["SaaS", ["Software pronto", "Ready-made software"]], ["On-premises", ["No próprio data center", "In your own data center"]]] },
    { t: "match", vocab: true, q: ["Vocabulário: ligue o termo em português ao inglês", "Vocabulary: match Portuguese to English"],
      pairs: [["Nuvem", "Cloud"], ["Escalabilidade", "Scalability"], ["Disponibilidade", "Availability"], ["Pagamento por uso", "Pay-as-you-go"]] }
  ]
},
/* ===================== U31 ===================== */
{ id: "u31", sec: 7, icon: "🗺️", color: "#b45309",
  title: ["Arquitetura da OCI", "OCI Architecture"],
  guide: [
    ["Region = área geográfica. Availability Domain (AD) = data centers isolados dentro da região (1 ou 3 por região). Fault Domain (FD) = agrupamento de hardware dentro do AD: são 3 por AD.",
     "Region = geographic area. Availability Domain (AD) = isolated data centers within a region (1 or 3 per region). Fault Domain (FD) = a grouping of hardware within an AD: there are 3 per AD."],
    ["Tenancy = a conta raiz do cliente. Compartments organizam e isolam recursos (por equipe, projeto ou ambiente) e podem ter compartments dentro.",
     "Tenancy = the customer's root account. Compartments organize and isolate resources (by team, project or environment) and can be nested."],
    ["Todo recurso tem um OCID, um identificador único. Alta disponibilidade: espalhe entre fault domains (ou ADs). Desastre regional: replique para outra região.",
     "Every resource has an OCID, a unique identifier. High availability: spread across fault domains (or ADs). Regional disaster: replicate to another region."],
    ["Always Free: recursos gratuitos permanentes para testar e estudar.", "Always Free: permanently free resources for testing and learning."]
  ],
  q: [
    { t: "mc", q: ["Na OCI, data centers isolados dentro de uma região são chamados de:", "In OCI, isolated data centers within a region are called:"], o: ["Availability Domains", "Fault Domains", "Compartments", "Tenancies"], a: 0 },
    { t: "mc", q: ["Quantos fault domains existem em cada availability domain?", "How many fault domains are in each availability domain?"], o: ["3", "1", "2", "6"], a: 0 },
    { t: "mc", q: ["O que é um fault domain?", "What is a fault domain?"], o: [["Um agrupamento de hardware dentro de um AD", "A grouping of hardware within an AD"], ["Uma região inteira", "A whole region"], ["Um tipo de usuário", "A user type"], ["Um disco", "A disk"]], a: 0 },
    { t: "mc", q: ["O que você usa para organizar e isolar recursos por equipe ou projeto?", "What do you use to organize and isolate resources by team or project?"], o: ["Compartments", "Regions", "Shapes", "Buckets"], a: 0 },
    { t: "mc", q: ["Como se chama a conta raiz de um cliente na OCI?", "What is a customer's root account in OCI called?"], o: ["Tenancy", "Compartment", "Realm", "VCN"], a: 0 },
    { t: "mc", q: ["Qual o identificador único de cada recurso na OCI?", "What is the unique identifier of each OCI resource?"], o: ["OCID", "UUID", "MAC", "ARN"], a: 0 },
    { t: "tf", q: ["Um compartment pode conter outros compartments.", "A compartment can contain other compartments."], a: true },
    { t: "mc", q: ["A região só tem 1 AD. Como ter alta disponibilidade entre duas VMs?", "The region has only 1 AD. How do you get high availability between two VMs?"], o: [["Colocar cada VM em um fault domain diferente", "Put each VM in a different fault domain"], ["Colocar as duas no mesmo host", "Put both on the same host"], ["Desligar uma", "Turn one off"], ["Não é possível", "It's impossible"]], a: 0 },
    { t: "mc", q: ["Como se proteger da falha de uma região inteira?", "How do you protect against a whole region failing?"], o: [["Replicar para outra região", "Replicate to another region"], ["Usar outro fault domain", "Use another fault domain"], ["Criar outro compartment", "Create another compartment"], ["Aumentar a VM", "Make the VM bigger"]], a: 0 },
    { t: "order", q: ["Ordene do maior para o menor", "Order from largest to smallest"], items: ["Region", "Availability Domain", "Fault Domain"] },
    { t: "match", q: ["Associe o termo", "Match the term"],
      pairs: [["Region", ["Área geográfica", "Geographic area"]], ["Availability Domain", ["Data centers isolados", "Isolated data centers"]], ["Fault Domain", ["Grupo de hardware", "Hardware grouping"]], ["Compartment", ["Organização lógica", "Logical organization"]]] },
    { t: "mc", q: ["Como se chamam os recursos gratuitos permanentes da OCI?", "What are OCI's permanently free resources called?"], o: ["Always Free", "Free Forever Plus", "Trial Max", "Zero Cost Tier"], a: 0 }
  ]
},
/* ===================== U32 ===================== */
{ id: "u32", sec: 7, icon: "🕸️", color: "#9a3412",
  title: ["Rede na OCI", "OCI Networking"],
  guide: [
    ["VCN = rede privada virtual, com uma faixa CIDR. Dentro dela ficam as subnets (públicas ou privadas), cada uma com sua route table.",
     "VCN = virtual cloud network with a CIDR range. Inside it are subnets (public or private), each with its route table."],
    ["Internet Gateway: internet nas duas direções (subnets públicas). NAT Gateway: só SAÍDA para a internet (subnets privadas). Service Gateway: acesso a serviços da Oracle (ex.: Object Storage) sem passar pela internet.",
     "Internet Gateway: internet both ways (public subnets). NAT Gateway: OUTBOUND-only internet (private subnets). Service Gateway: reach Oracle services (e.g. Object Storage) without going over the internet."],
    ["DRG (Dynamic Routing Gateway) conecta a VCN ao on-premises (VPN ou FastConnect) e a outras VCNs. FastConnect é uma conexão privada dedicada.",
     "The DRG (Dynamic Routing Gateway) connects the VCN to on-premises (VPN or FastConnect) and to other VCNs. FastConnect is a dedicated private connection."],
    ["Firewall: Security List vale para a subnet inteira; NSG (Network Security Group) vale para recursos/VNICs específicos. Regras stateful permitem a resposta automaticamente.",
     "Firewall: a Security List applies to the whole subnet; an NSG (Network Security Group) applies to specific resources/VNICs. Stateful rules allow the return traffic automatically."]
  ],
  q: [
    { t: "mc", q: ["Como se chama a rede privada virtual na OCI?", "What is the virtual private network called in OCI?"], o: ["VCN", "VPC", "VLAN", "DRG"], a: 0 },
    { t: "mc", q: ["Uma VM em subnet privada precisa baixar atualizações, mas não pode receber conexões da internet. Use:", "A VM in a private subnet needs to download updates but must not receive internet connections. Use:"], o: ["NAT Gateway", "Internet Gateway", "DRG", "Service Gateway"], a: 0 },
    { t: "mc", q: ["Qual gateway dá acesso à internet nas duas direções para subnets públicas?", "Which gateway gives two-way internet access to public subnets?"], o: ["Internet Gateway", "NAT Gateway", "Service Gateway", "Local Peering Gateway"], a: 0 },
    { t: "mc", q: ["Como acessar o Object Storage a partir de uma subnet privada sem passar pela internet?", "How do you reach Object Storage from a private subnet without going over the internet?"], o: ["Service Gateway", "Internet Gateway", "NAT Gateway", "FastConnect"], a: 0 },
    { t: "mc", q: ["Qual componente conecta a VCN ao data center da empresa por VPN ou FastConnect?", "Which component connects the VCN to the company data center via VPN or FastConnect?"], o: ["DRG", "NAT Gateway", "Security List", "Bucket"], a: 0 },
    { t: "mc", q: ["Qual serviço oferece uma conexão privada e dedicada até a OCI?", "Which service provides a dedicated private connection to OCI?"], o: ["FastConnect", "Site-to-Site VPN", "Internet Gateway", "Bastion"], a: 0 },
    { t: "mc", q: ["Para aplicar regras de firewall só a algumas VMs específicas, use:", "To apply firewall rules only to a few specific VMs, use:"], o: [["NSG (Network Security Group)", "NSG (Network Security Group)"], ["Security List", "Security List"], ["Route table", "Route table"], ["Compartment", "Compartment"]], a: 0 },
    { t: "mc", q: ["Uma Security List se aplica a:", "A Security List applies to:"], o: [["Toda a subnet", "The whole subnet"], ["Uma única VNIC", "A single VNIC"], ["A tenancy inteira", "The whole tenancy"], ["Só ao DRG", "Only the DRG"]], a: 0 },
    { t: "tf", q: ["O NAT Gateway permite que a internet inicie conexões até as VMs privadas.", "The NAT Gateway lets the internet start connections to private VMs."], a: false },
    { t: "mc", q: ["Criou um gateway, mas o tráfego não passa por ele. O que provavelmente falta?", "You created a gateway but traffic doesn't use it. What's probably missing?"], o: [["Uma regra na route table da subnet", "A rule in the subnet's route table"], ["Um novo compartment", "A new compartment"], ["Um bucket", "A bucket"], ["Uma VM maior", "A bigger VM"]], a: 0 },
    { t: "match", q: ["Associe o gateway", "Match the gateway"],
      pairs: [["Internet Gateway", ["Internet nos dois sentidos", "Internet both ways"]], ["NAT Gateway", ["Só saída", "Outbound only"]], ["Service Gateway", ["Serviços da Oracle", "Oracle services"]], ["DRG", ["On-premises / outras VCNs", "On-premises / other VCNs"]]] },
    { t: "mc", q: ["Numa regra stateful, o tráfego de resposta é:", "With a stateful rule, the return traffic is:"], o: [["Permitido automaticamente", "Allowed automatically"], ["Sempre bloqueado", "Always blocked"], ["Precisa de outra regra", "Needs another rule"], ["Enviado ao DRG", "Sent to the DRG"]], a: 0 }
  ]
},
/* ===================== U33 ===================== */
{ id: "u33", sec: 7, icon: "🔐", color: "#7c2d12",
  title: ["Compute, storage e IAM", "Compute, Storage & IAM"],
  guide: [
    ["Compute: VM ou Bare Metal (servidor físico dedicado). O shape define CPU (OCPUs) e memória; shapes flexíveis deixam você escolher os valores.",
     "Compute: VM or Bare Metal (dedicated physical server). The shape defines CPU (OCPUs) and memory; flexible shapes let you pick the values."],
    ["Storage: Block Volume = disco de uma instância; Object Storage = objetos em buckets via HTTP (tiers Standard, Infrequent Access e Archive); File Storage = sistema de arquivos compartilhado (NFS).",
     "Storage: Block Volume = an instance's disk; Object Storage = objects in buckets over HTTP (Standard, Infrequent Access and Archive tiers); File Storage = shared file system (NFS)."],
    ["IAM: permissões são dadas a GRUPOS por políticas. Ex.: Allow group NetAdmins to manage virtual-network-family in compartment Rede. Sem política, ninguém acessa nada.",
     "IAM: permissions are granted to GROUPS through policies. E.g. Allow group NetAdmins to manage virtual-network-family in compartment Network. With no policy, nobody can access anything."],
    ["Verbos, do menor ao maior: inspect → read → use → manage. Vault guarda chaves e segredos; Autonomous Database é o banco que se autogerencia.",
     "Verbs, from least to most: inspect → read → use → manage. Vault stores keys and secrets; Autonomous Database is the self-managing database."]
  ],
  q: [
    { t: "mc", q: ["Servidor físico dedicado, sem hypervisor, na OCI:", "A dedicated physical server, with no hypervisor, in OCI:"], o: ["Bare Metal", "VM", "Container", "Function"], a: 0 },
    { t: "mc", q: ["O que o 'shape' de uma instância define?", "What does an instance's 'shape' define?"], o: [["CPU e memória", "CPU and memory"], ["A região", "The region"], ["O usuário administrador", "The admin user"], ["A cor do console", "The console color"]], a: 0 },
    { t: "mc", q: ["Qual armazenamento funciona como o disco de uma instância?", "Which storage works as an instance's disk?"], o: ["Block Volume", "Object Storage", "File Storage", "Archive"], a: 0 },
    { t: "mc", q: ["Onde guardar backups, imagens e arquivos acessados via HTTP em buckets?", "Where do you store backups, images and files accessed over HTTP in buckets?"], o: ["Object Storage", "Block Volume", "File Storage", "Boot volume"], a: 0 },
    { t: "mc", q: ["Qual serviço oferece um sistema de arquivos compartilhado via NFS?", "Which service offers a shared file system over NFS?"], o: ["File Storage", "Object Storage", "Block Volume", "Vault"], a: 0 },
    { t: "mc", q: ["Qual tier do Object Storage é o mais barato, para dados quase nunca acessados (restaurar demora)?", "Which Object Storage tier is cheapest, for data almost never accessed (slow to restore)?"], o: ["Archive", "Standard", "Infrequent Access", "Premium"], a: 0 },
    { t: "order", q: ["Ordene os verbos das políticas do menor ao maior poder", "Order the policy verbs from least to most power"], items: ["inspect", "read", "use", "manage"] },
    { t: "mc", q: ["Qual política dá ao grupo NetAdmins controle total da rede no compartment Rede?", "Which policy gives the NetAdmins group full control of networking in the Network compartment?"],
      o: ["Allow group NetAdmins to manage virtual-network-family in compartment Rede", "Allow user NetAdmins to read all-resources in tenancy", "Deny group NetAdmins to use vcn", "Permit NetAdmins network full"], a: 0 },
    { t: "mc", q: ["Na OCI, as políticas dão permissões a:", "In OCI, policies grant permissions to:"], o: [["Grupos", "Groups"], ["Usuários diretamente", "Users directly"], ["Subnets", "Subnets"], ["Buckets", "Buckets"]], a: 0 },
    { t: "mc", q: ["Qual banco de dados aplica patches e ajustes sozinho?", "Which database applies patches and tuning by itself?"], o: ["Autonomous Database", "MySQL em VM", "Block Volume", "File Storage"], a: 0 },
    { t: "mc", q: ["Onde guardar chaves de criptografia e senhas de aplicações?", "Where do you store encryption keys and application secrets?"], o: ["Vault", "Bucket público", "Compartment raiz", "Route table"], a: 0 },
    { t: "tf", q: ["Um usuário novo, sem grupo e sem política, não tem acesso a nada por padrão.", "A new user with no group and no policy has no access to anything by default."], a: true },
    { t: "match", q: ["Associe o armazenamento", "Match the storage"],
      pairs: [["Block Volume", ["Disco da instância", "Instance disk"]], ["Object Storage", "Buckets"], ["File Storage", "NFS"], ["Archive", ["Mais barato e lento", "Cheapest and slowest"]]] }
  ]
}
);
