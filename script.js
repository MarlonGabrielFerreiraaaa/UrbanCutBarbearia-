/**
 * ==============================================================================
 * URBAN CUT BARBEARIA — MOTOR JAVASCRIPT UNIFICADO (CLEAN CODE)
 * Módulos: StorageManager, CalendarEngine, CartEngine, DashboardEngine, Toast
 * ==============================================================================
 */

// --- 1. MÓDULO DE ARMAZENAMENTO E PERSISTÊNCIA (StorageManager) ---
const UrbanStorage = {
  KEYS: {
    APPOINTMENTS: 'agendamentosUrbanCut',
    SALES: 'vendasUrbanCut',
    CART: 'sacolaUrbanCut'
  },

  // Inicializa dados demonstrativos e limpa registros de teste
  init() {
    if (!localStorage.getItem(this.KEYS.APPOINTMENTS)) {
      this.seedInitialData();
    } else {
      // Remove automaticamente qualquer registro de teste indesejado
      const lista = this.getAppointments();
      const filtrada = lista.filter(item => 
        !item.cliente || !item.cliente.toLowerCase().includes('chupacu')
      );
      if (filtrada.length !== lista.length) {
        this.saveAppointments(filtrada);
      }
    }
  },

  seedInitialData() {
    const today = new Date();
    const formatDate = (daysAhead) => {
      const d = new Date(today);
      d.setDate(d.getDate() + daysAhead);
      return d.toISOString().split('T')[0];
    };

    const initialAppointments = [
      {
        id: 1729450001,
        cliente: "Lucas Silveira",
        whatsapp: "(42) 99876-5432",
        servico: "Corte Urban & Visagismo",
        valor: 65.00,
        barbeiro: "Marlon Gabriel",
        data: formatDate(0),
        hora: "10:00",
        status: "Concluído"
      },
      {
        id: 1729450002,
        cliente: "Rodrigo Almeida",
        whatsapp: "(42) 99123-4567",
        servico: "Combo Urban (Corte + Barba)",
        valor: 105.00,
        barbeiro: "Erick Rafael",
        data: formatDate(0),
        hora: "14:30",
        status: "Confirmado"
      },
      {
        id: 1729450003,
        cliente: "Matheus Borges",
        whatsapp: "(42) 99988-7766",
        servico: "Barboterapia Ritual",
        valor: 55.00,
        barbeiro: "Marlon Gabriel",
        data: formatDate(0),
        hora: "16:30",
        status: "Confirmado"
      },
      {
        id: 1729450004,
        cliente: "Gabriel Siqueira",
        whatsapp: "(42) 98844-3322",
        servico: "Corte Urban & Visagismo",
        valor: 65.00,
        barbeiro: "Erick Rafael",
        data: formatDate(1),
        hora: "11:00",
        status: "Confirmado"
      },
      {
        id: 1729450005,
        cliente: "Felipe Castilho",
        whatsapp: "(42) 99777-1122",
        servico: "Tratamento Capilar Fortificante",
        valor: 50.00,
        barbeiro: "Marlon Gabriel",
        data: formatDate(-1),
        hora: "17:30",
        status: "Concluído"
      }
    ];

    const initialSales = [
      {
        id: 2001,
        data: formatDate(0),
        cliente: "Lucas Silveira",
        itens: ["Pomada Modeladora Clay Matte (x1)"],
        total: 45.00,
        status: "Entregue"
      },
      {
        id: 2002,
        data: formatDate(0),
        cliente: "Rodrigo Almeida",
        itens: ["Elixir Nutritivo Urban Barba (x1)", "Balm Modelador & Alinhador (x1)"],
        total: 94.00,
        status: "Separado para Retirada"
      }
    ];

    localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
    localStorage.setItem(this.KEYS.SALES, JSON.stringify(initialSales));
  },

  // Agendamentos
  getAppointments() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.APPOINTMENTS)) || [];
    } catch (e) {
      return [];
    }
  },

  saveAppointments(list) {
    localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(list));
  },

  addAppointment(appointment) {
    const list = this.getAppointments();
    list.unshift(appointment);
    this.saveAppointments(list);
    return appointment;
  },

  updateAppointmentStatus(id, newStatus) {
    const list = this.getAppointments();
    const index = list.findIndex(item => item.id == id);
    if (index !== -1) {
      list[index].status = newStatus;
      this.saveAppointments(list);
      return true;
    }
    return false;
  },

  deleteAppointment(id) {
    const list = this.getAppointments();
    const filtered = list.filter(item => item.id != id);
    this.saveAppointments(filtered);
    return true;
  },

  // Vendas / Reservas de Produtos
  getSales() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SALES)) || [];
    } catch (e) {
      return [];
    }
  },

  addSale(sale) {
    const list = this.getSales();
    list.unshift(sale);
    localStorage.setItem(this.KEYS.SALES, JSON.stringify(list));
    return sale;
  },

  resetAllData() {
    localStorage.removeItem(this.KEYS.APPOINTMENTS);
    localStorage.removeItem(this.KEYS.SALES);
    this.seedInitialData();
  }
};

// --- 2. SISTEMA DE NOTIFICAÇÃO TOAST ---
function showToast(mensagem, tipo = 'sucesso') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'urban-toast';
  
  const icon = tipo === 'sucesso' ? '✨' : (tipo === 'alerta' ? '⚠️' : 'ℹ️');
  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${icon}</span>
    <span class="flex-grow-1">${mensagem}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

// --- 3. MOTOR DO CALENDÁRIO & AGENDAMENTO (CalendarEngine) ---
const CalendarEngine = {
  horariosPadrao: [
    '09:00', '10:00', '11:00', '13:30', '14:30', 
    '15:30', '16:30', '17:30', '18:30', '19:30'
  ],

  tabelaPrecos: {
    "Corte Urban & Visagismo": 65.00,
    "Barboterapia Ritual": 55.00,
    "Tratamento Capilar Fortificante": 50.00,
    "Combo Urban (Corte + Barba)": 105.00
  },

  estado: {
    barbeiro: "Marlon Gabriel",
    data: "",
    horario: "",
    servico: "Corte Urban & Visagismo",
    preco: 65.00
  },

  init() {
    const bookingForm = document.getElementById('formAgendamento');
    if (!bookingForm) return;

    const dataInput = document.getElementById('dataAgendamento');
    const servicoSelect = document.getElementById('servicoDesejado');
    
    // Configura a data mínima para hoje
    const hoje = new Date().toISOString().split('T')[0];
    if (dataInput) {
      dataInput.min = hoje;
      dataInput.value = hoje;
      this.estado.data = hoje;
    }

    // Pré-seleciona serviço caso venha da URL (ex: ?servico=Corte)
    const urlParams = new URLSearchParams(window.location.search);
    const servicoParam = urlParams.get('servico');
    if (servicoParam && servicoSelect) {
      for (let option of servicoSelect.options) {
        if (option.value.toLowerCase().includes(servicoParam.toLowerCase())) {
          option.selected = true;
          this.estado.servico = option.value;
          this.estado.preco = this.tabelaPrecos[option.value] || 65.00;
          break;
        }
      }
    }

    // Configura evento de barbeiros
    const barberCards = document.querySelectorAll('.barber-card');
    barberCards.forEach(card => {
      card.addEventListener('click', () => {
        barberCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.estado.barbeiro = card.getAttribute('data-barbeiro');
        this.renderizarSlots();
      });
    });

    // Eventos de alteração
    if (dataInput) {
      dataInput.addEventListener('change', (e) => {
        this.estado.data = e.target.value;
        this.renderizarSlots();
      });
    }

    if (servicoSelect) {
      servicoSelect.addEventListener('change', (e) => {
        this.estado.servico = e.target.value;
        this.estado.preco = this.tabelaPrecos[e.target.value] || 65.00;
        this.atualizarResumo();
      });
    }

    // Submissão do agendamento
    bookingForm.addEventListener('submit', (e) => this.processarAgendamento(e));

    // Renderiza os slots inicialmente
    this.renderizarSlots();
    this.atualizarResumo();
  },

  renderizarSlots() {
    const container = document.getElementById('gradeHorarios');
    if (!container) return;

    container.innerHTML = '';
    const agendamentos = UrbanStorage.getAppointments();

    // Filtra agendamentos para a mesma data e mesmo barbeiro que não estejam cancelados
    const agendamentosNoDia = agendamentos.filter(item => 
      item.data === this.estado.data && 
      item.barbeiro === this.estado.barbeiro &&
      item.status !== 'Cancelado'
    );

    const horariosOcupados = agendamentosNoDia.map(item => item.hora);

    this.horariosPadrao.forEach(hora => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const estaOcupado = horariosOcupados.includes(hora);

      if (estaOcupado) {
        btn.className = 'slot-btn booked';
        btn.disabled = true;
        btn.innerHTML = `${hora}<small>Ocupado</small>`;
      } else {
        const estaSelecionado = this.estado.horario === hora;
        btn.className = `slot-btn available ${estaSelecionado ? 'selected' : ''}`;
        btn.innerHTML = `${hora}<small class="text-accent">Livre</small>`;
        
        btn.addEventListener('click', () => {
          document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.estado.horario = hora;
          this.atualizarResumo();
        });
      }

      container.appendChild(btn);
    });

    // Se o horário previamente selecionado agora estiver ocupado, reseta
    if (horariosOcupados.includes(this.estado.horario)) {
      this.estado.horario = "";
      this.atualizarResumo();
    }
  },

  atualizarResumo() {
    const elServico = document.getElementById('resumoServico');
    const elDataHora = document.getElementById('resumoDataHora');
    const elBarbeiro = document.getElementById('resumoBarbeiro');
    const elValor = document.getElementById('resumoValor');

    if (elServico) elServico.textContent = this.estado.servico || 'Não selecionado';
    if (elBarbeiro) elBarbeiro.textContent = this.estado.barbeiro;
    if (elValor) elValor.textContent = `R$ ${this.estado.preco.toFixed(2).replace('.', ',')}`;

    if (elDataHora) {
      if (this.estado.data && this.estado.horario) {
        const [ano, mes, dia] = this.estado.data.split('-');
        elDataHora.textContent = `${dia}/${mes}/${ano} às ${this.estado.horario}`;
      } else if (this.estado.data) {
        const [ano, mes, dia] = this.estado.data.split('-');
        elDataHora.textContent = `${dia}/${mes}/${ano} (Escolha um horário)`;
      } else {
        elDataHora.textContent = 'Selecione data e hora';
      }
    }
  },

  processarAgendamento(event) {
    event.preventDefault();

    if (!this.estado.horario) {
      showToast('Por favor, selecione um horário disponível na grade.', 'alerta');
      return;
    }

    const nome = document.getElementById('nomeCliente').value.trim();
    const whatsapp = document.getElementById('whatsappCliente').value.trim();

    if (!nome || !whatsapp) {
      showToast('Preencha seu nome e WhatsApp para confirmar.', 'alerta');
      return;
    }

    const novoAgendamento = {
      id: Date.now(),
      cliente: nome,
      whatsapp: whatsapp,
      servico: this.estado.servico,
      valor: this.estado.preco,
      barbeiro: this.estado.barbeiro,
      data: this.estado.data,
      hora: this.estado.horario,
      status: 'Confirmado'
    };

    UrbanStorage.addAppointment(novoAgendamento);

    // Feedback visual
    showToast(`Agendamento confirmado para ${nome}!`, 'sucesso');

    const msgConfirmacao = document.getElementById('mensagemConfirmacao');
    const textoConfirmacao = document.getElementById('textoConfirmacao');
    if (msgConfirmacao && textoConfirmacao) {
      const [ano, mes, dia] = this.estado.data.split('-');
      textoConfirmacao.innerHTML = `
        🎉 <strong>Tudo certo, ${nome}!</strong><br>
        Seu horário para <strong>${this.estado.servico}</strong> com <strong>${this.estado.barbeiro}</strong> foi confirmado para o dia <strong>${dia}/${mes}/${ano} às ${this.estado.horario}</strong>.<br>
        <span class="small text-muted">Aguardamos você na Unidade Centro.</span>
      `;
      msgConfirmacao.classList.remove('d-none');
      msgConfirmacao.scrollIntoView({ behavior: 'smooth' });
    }

    // Atualiza os slots imediatamente (o horário passa a ser ocupado)
    this.renderizarSlots();
  }
};

// --- 4. MOTOR DA SACOLA E PRODUTOS (CartEngine) ---
const CartEngine = {
  sacola: [],

  init() {
    this.carregarSacola();
    this.atualizarContadorBadge();

    // Filtros de produtos
    const botoesFiltro = document.querySelectorAll('.btn-categoria');
    const cardsProdutos = document.querySelectorAll('.item-produto');

    botoesFiltro.forEach(btn => {
      btn.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const categoria = btn.getAttribute('data-categoria');
        cardsProdutos.forEach(card => {
          if (categoria === 'todos' || card.getAttribute('data-categoria') === categoria) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Botões "Reservar Produto"
    const botoesReservar = document.querySelectorAll('.btn-reservar-produto');
    botoesReservar.forEach(btn => {
      btn.addEventListener('click', () => {
        const nome = btn.getAttribute('data-nome');
        const preco = parseFloat(btn.getAttribute('data-preco'));
        this.adicionarItem(nome, preco);
      });
    });

    // Botão Limpar Sacola
    const btnEsvaziar = document.getElementById('btnEsvaziarSacola');
    if (btnEsvaziar) {
      btnEsvaziar.addEventListener('click', () => this.esvaziarSacola());
    }

    // Botão Finalizar Reserva
    const btnFinalizar = document.getElementById('btnFinalizarReserva');
    if (btnFinalizar) {
      btnFinalizar.addEventListener('click', () => this.finalizarReserva());
    }

    // Modal aberto -> renderiza itens
    const modalEl = document.getElementById('modalSacola');
    if (modalEl) {
      modalEl.addEventListener('show.bs.modal', () => this.renderizarSacola());
    }
  },

  carregarSacola() {
    try {
      this.sacola = JSON.parse(localStorage.getItem(UrbanStorage.KEYS.CART)) || [];
    } catch (e) {
      this.sacola = [];
    }
  },

  salvarSacola() {
    localStorage.setItem(UrbanStorage.KEYS.CART, JSON.stringify(this.sacola));
    this.atualizarContadorBadge();
  },

  adicionarItem(nome, preco) {
    const itemExistente = this.sacola.find(i => i.nome === nome);
    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      this.sacola.push({ nome, preco, quantidade: 1 });
    }
    this.salvarSacola();
    showToast(`"${nome}" adicionado à sua sacola!`, 'sucesso');
  },

  alterarQuantidade(nome, delta) {
    const item = this.sacola.find(i => i.nome === nome);
    if (item) {
      item.quantidade += delta;
      if (item.quantidade <= 0) {
        this.sacola = this.sacola.filter(i => i.nome !== nome);
      }
      this.salvarSacola();
      this.renderizarSacola();
    }
  },

  esvaziarSacola() {
    this.sacola = [];
    this.salvarSacola();
    this.renderizarSacola();
    showToast('Sacola esvaziada.', 'alerta');
  },

  calcularTotal() {
    return this.sacola.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  },

  atualizarContadorBadge() {
    const badges = document.querySelectorAll('#contadorCarrinho');
    const totalItens = this.sacola.reduce((acc, item) => acc + item.quantidade, 0);
    badges.forEach(b => b.textContent = totalItens);
  },

  renderizarSacola() {
    const container = document.getElementById('listaItensSacola');
    const totalEl = document.getElementById('totalSacola');
    if (!container) return;

    container.innerHTML = '';

    if (this.sacola.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted">
          <span style="font-size: 2rem;">🛍️</span>
          <p class="mt-2 mb-0">Sua sacola está vazia no momento.</p>
        </div>
      `;
      if (totalEl) totalEl.textContent = 'R$ 0,00';
      return;
    }

    this.sacola.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div>
          <h6 class="m-0 text-white fw-bold">${item.nome}</h6>
          <span class="small text-accent">R$ ${item.preco.toFixed(2).replace('.', ',')} un.</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="qty-btn" onclick="CartEngine.alterarQuantidade('${item.nome}', -1)">-</button>
          <span class="fw-bold px-1">${item.quantidade}</span>
          <button class="qty-btn" onclick="CartEngine.alterarQuantidade('${item.nome}', 1)">+</button>
          <span class="fw-bold text-white ms-2">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
        </div>
      `;
      container.appendChild(row);
    });

    if (totalEl) {
      totalEl.textContent = `R$ ${this.calcularTotal().toFixed(2).replace('.', ',')}`;
    }
  },

  finalizarReserva() {
    if (this.sacola.length === 0) {
      showToast('Adicione produtos antes de finalizar.', 'alerta');
      return;
    }

    const nome = prompt("Informe seu nome completo para a reserva dos produtos:");
    if (!nome) return;

    const novaVenda = {
      id: Date.now(),
      data: new Date().toISOString().split('T')[0],
      cliente: nome,
      itens: this.sacola.map(i => `${i.nome} (x${i.quantidade})`),
      total: this.calcularTotal(),
      status: "Reservado para Retirada"
    };

    UrbanStorage.addSale(novaVenda);
    this.esvaziarSacola();

    // Fecha o modal se o bootstrap estiver ativo
    const modalEl = document.getElementById('modalSacola');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }

    showToast(`Reserva concluída! Seus produtos estão reservados para retirada na barbearia.`, 'sucesso');
  }
};

// --- 5. MOTOR DO PAINEL DO PROPRIETÁRIO (DashboardEngine) ---
const DashboardEngine = {
  filtroAtual: 'todos',

  init() {
    const dashboardContainer = document.getElementById('dashboardContainer');
    if (!dashboardContainer) return;

    // Filtros de status da tabela
    const tabFiltros = document.querySelectorAll('.dashboard-filter-tab');
    tabFiltros.forEach(tab => {
      tab.addEventListener('click', () => {
        tabFiltros.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.filtroAtual = tab.getAttribute('data-status');
        this.renderizarTabelaAgendamentos();
      });
    });

    // Botões de Ação Global
    const btnSeed = document.getElementById('btnCarregarDadosDemo');
    if (btnSeed) {
      btnSeed.addEventListener('click', () => {
        UrbanStorage.resetAllData();
        this.atualizarTudo();
        showToast('Dados de demonstração recarregados com sucesso!', 'sucesso');
      });
    }

    this.atualizarTudo();
  },

  atualizarTudo() {
    this.calcularMetricas();
    this.renderizarTabelaAgendamentos();
    this.renderizarTabelaVendas();
    this.renderizarGraficoServicos();
  },

  calcularMetricas() {
    const agendamentos = UrbanStorage.getAppointments();
    const vendas = UrbanStorage.getSales();

    // Faturamento: serviços concluídos/confirmados + vendas
    const receitaServicos = agendamentos
      .filter(a => a.status !== 'Cancelado')
      .reduce((sum, a) => sum + (parseFloat(a.valor) || 0), 0);

    const receitaProdutos = vendas
      .reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);

    const receitaTotal = receitaServicos + receitaProdutos;

    // Clientes únicos
    const clientesUnicos = new Set(agendamentos.map(a => a.cliente.toLowerCase()));

    // Agendamentos Hoje
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = agendamentos.filter(a => a.data === hoje && a.status !== 'Cancelado').length;

    // Ticket Médio
    const totalAtendimentosValidos = agendamentos.filter(a => a.status !== 'Cancelado').length;
    const ticketMedio = totalAtendimentosValidos > 0 ? (receitaTotal / totalAtendimentosValidos) : 0;

    // Atualiza no DOM
    const elReceita = document.getElementById('kpiReceitaTotal');
    const elAgendamentos = document.getElementById('kpiTotalAgendamentos');
    const elClientes = document.getElementById('kpiClientesUnicos');
    const elTicket = document.getElementById('kpiTicketMedio');

    if (elReceita) elReceita.textContent = `R$ ${receitaTotal.toFixed(2).replace('.', ',')}`;
    if (elAgendamentos) elAgendamentos.textContent = agendamentos.length;
    if (elClientes) elClientes.textContent = clientesUnicos.size;
    if (elTicket) elTicket.textContent = `R$ ${ticketMedio.toFixed(2).replace('.', ',')}`;
  },

  renderizarTabelaAgendamentos() {
    const tbody = document.getElementById('tabelaAgendamentosCorpo');
    if (!tbody) return;

    tbody.innerHTML = '';
    const agendamentos = UrbanStorage.getAppointments();

    const filtrados = agendamentos.filter(a => {
      if (this.filtroAtual === 'todos') return true;
      return a.status.toLowerCase() === this.filtroAtual.toLowerCase();
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">Nenhum agendamento encontrado para este filtro.</td>
        </tr>
      `;
      return;
    }

    filtrados.forEach(item => {
      const tr = document.createElement('tr');
      const [ano, mes, dia] = (item.data || '').split('-');
      const dataFormatada = dia ? `${dia}/${mes}/${ano}` : item.data;

      let badgeClass = 'badge-status-confirmado';
      if (item.status === 'Concluído') badgeClass = 'badge-status-concluido';
      if (item.status === 'Cancelado') badgeClass = 'badge-status-cancelado';

      tr.innerHTML = `
        <td>
          <div class="fw-bold fs-6 mb-1" style="color: #ffffff !important; letter-spacing: 0.3px;">${item.cliente || 'Cliente Sem Nome'}</div>
          <div class="small" style="color: #9da5b5 !important;">
            <i class="bi bi-whatsapp text-success me-1"></i>${item.whatsapp || '-'}
          </div>
        </td>
        <td>
          <div class="fw-bold text-accent mb-1">${item.servico}</div>
          <div class="small" style="color: #8e95a5 !important;">
            <i class="bi bi-person-fill text-secondary me-1"></i>Barbeiro: ${item.barbeiro}
          </div>
        </td>
        <td>
          <div class="fw-semibold mb-1" style="color: #ffffff !important;">${dataFormatada}</div>
          <span class="badge bg-dark border border-secondary text-white px-2 py-1">
            <i class="bi bi-clock me-1 text-accent"></i>${item.hora}
          </span>
        </td>
        <td>
          <div class="fw-bold fs-6 text-accent">
            R$ ${(parseFloat(item.valor) || 0).toFixed(2).replace('.', ',')}
          </div>
        </td>
        <td>
          <span class="badge-status ${badgeClass}">${item.status}</span>
        </td>
        <td class="text-end">
          <div class="dropdown d-inline-block">
            <button class="btn btn-urban-outline btn-urban-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Ações
            </button>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border border-secondary p-2">
              <li>
                <a class="dropdown-item py-2 rounded-2 d-flex align-items-center gap-2" href="#" onclick="DashboardEngine.alterarStatus(${item.id}, 'Concluído'); return false;" style="color: #34d399 !important; font-weight: 600;">
                  <i class="bi bi-check2-circle fs-5"></i> Marcar como Concluído
                </a>
              </li>
              <li>
                <a class="dropdown-item py-2 rounded-2 d-flex align-items-center gap-2" href="#" onclick="DashboardEngine.alterarStatus(${item.id}, 'Confirmado'); return false;" style="color: #fbbf24 !important; font-weight: 600;">
                  <i class="bi bi-hourglass-split fs-5"></i> Deixar Confirmado
                </a>
              </li>
              <li><hr class="dropdown-divider border-secondary my-1"></li>
              <li>
                <a class="dropdown-item py-2 rounded-2 d-flex align-items-center gap-2" href="#" onclick="DashboardEngine.alterarStatus(${item.id}, 'Cancelado'); return false;" style="color: #f87171 !important; font-weight: 600;">
                  <i class="bi bi-x-circle fs-5"></i> Cancelar Agendamento
                </a>
              </li>
              <li><hr class="dropdown-divider border-secondary my-1"></li>
              <li>
                <a class="dropdown-item py-2 rounded-2 d-flex align-items-center gap-2" href="#" onclick="DashboardEngine.excluirAgendamento(${item.id}); return false;" style="color: #ef4444 !important; font-weight: 600;">
                  <i class="bi bi-trash3 fs-5"></i> Excluir Registro
                </a>
              </li>
            </ul>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  alterarStatus(id, novoStatus) {
    UrbanStorage.updateAppointmentStatus(id, novoStatus);
    this.atualizarTudo();
    showToast(`Status atualizado para "${novoStatus}".`, 'sucesso');
  },

  excluirAgendamento(id) {
    if (confirm("Deseja realmente excluir este agendamento do sistema?")) {
      UrbanStorage.deleteAppointment(id);
      this.atualizarTudo();
      showToast("Agendamento excluído com sucesso.", "alerta");
    }
  },

  renderizarTabelaVendas() {
    const tbody = document.getElementById('tabelaVendasCorpo');
    if (!tbody) return;

    tbody.innerHTML = '';
    const vendas = UrbanStorage.getSales();

    if (vendas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">Nenhuma venda de produto registrada.</td>
        </tr>
      `;
      return;
    }

    vendas.forEach(venda => {
      const tr = document.createElement('tr');
      const [ano, mes, dia] = (venda.data || '').split('-');
      const dataFormatada = dia ? `${dia}/${mes}/${ano}` : venda.data;

      tr.innerHTML = `
        <td><strong class="fs-6" style="color: #ffffff !important;">${venda.cliente}</strong></td>
        <td><span class="small" style="color: #9da5b5 !important;">${venda.itens ? venda.itens.join(', ') : '-'}</span></td>
        <td><span style="color: #ffffff !important;">${dataFormatada}</span></td>
        <td><strong class="text-accent fs-6">R$ ${(parseFloat(venda.total) || 0).toFixed(2).replace('.', ',')}</strong></td>
        <td><span class="badge bg-warning text-dark fw-bold px-3 py-1.5">${venda.status || 'Concluído'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  },

  renderizarGraficoServicos() {
    const container = document.getElementById('graficoServicosContainer');
    if (!container) return;

    const agendamentos = UrbanStorage.getAppointments().filter(a => a.status !== 'Cancelado');
    const contagem = {};

    agendamentos.forEach(a => {
      contagem[a.servico] = (contagem[a.servico] || 0) + 1;
    });

    const total = agendamentos.length || 1;
    container.innerHTML = '';

    Object.keys(contagem).forEach(servico => {
      const qtd = contagem[servico];
      const pct = Math.round((qtd / total) * 100);

      const item = document.createElement('div');
      item.className = 'service-bar-item';
      item.innerHTML = `
        <div class="d-flex justify-content-between small">
          <span class="text-white fw-semibold">${servico} (${qtd})</span>
          <span class="text-accent fw-bold">${pct}%</span>
        </div>
        <div class="service-bar-progress">
          <div class="service-bar-fill" style="width: ${pct}%;"></div>
        </div>
      `;
      container.appendChild(item);
    });
  }
};

// --- 6. INICIALIZAÇÃO GERAL ---
document.addEventListener('DOMContentLoaded', () => {
  UrbanStorage.init();
  CalendarEngine.init();
  CartEngine.init();
  DashboardEngine.init();
});