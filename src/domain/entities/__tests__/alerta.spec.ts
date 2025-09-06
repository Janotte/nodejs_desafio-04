import { describe, it, expect, beforeEach } from 'vitest';
import { Alerta, TipoAlerta, StatusAlerta } from '../alerta';
import { Email } from '../../value-objects/email';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('Alerta', () => {
  let email: Email;
  let produtoId: UniqueEntityId;

  beforeEach(() => {
    email = new Email('admin@loja.com');
    produtoId = new UniqueEntityId();
  });

  it('should create alert with all properties', () => {
    const alerta = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });

    expect(alerta.tipo).toBe(TipoAlerta.ESTOQUE_BAIXO);
    expect(alerta.status).toBe(StatusAlerta.PENDENTE);
    expect(alerta.titulo).toBe('Estoque Baixo');
    expect(alerta.mensagem).toBe('Produto com estoque baixo');
    expect(alerta.destinatario).toBe(email);
    expect(alerta.produtoId).toBe(produtoId);
    expect(alerta.tentativasEnvio).toBe(0);
    expect(alerta.maxTentativas).toBe(3);
    expect(alerta.ativo).toBe(true);
  });

  it('should mark alert as sent', () => {
    const alerta = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });

    alerta.marcarComoEnviado();

    expect(alerta.status).toBe(StatusAlerta.ENVIADO);
    expect(alerta.dataEnvio).toBeInstanceOf(Date);
  });

  it('should mark alert as failed and increment attempts', () => {
    const alerta = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });

    alerta.marcarComoFalhou();

    expect(alerta.status).toBe(StatusAlerta.PENDENTE);
    expect(alerta.tentativasEnvio).toBe(1);
  });

  it('should mark alert as failed when max attempts reached', () => {
    const alerta = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 2,
      maxTentativas: 3,
      ativo: true,
    });

    alerta.marcarComoFalhou();

    expect(alerta.status).toBe(StatusAlerta.FALHOU);
    expect(alerta.tentativasEnvio).toBe(3);
  });

  it('should check if alert can be sent', () => {
    const alertaPendente = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 1,
      maxTentativas: 3,
      ativo: true,
    });

    const alertaEnviado = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.ENVIADO,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });

    const alertaFalhou = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.FALHOU,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 3,
      maxTentativas: 3,
      ativo: true,
    });

    expect(alertaPendente.podeTentarEnviar()).toBe(true);
    expect(alertaEnviado.podeTentarEnviar()).toBe(false);
    expect(alertaFalhou.podeTentarEnviar()).toBe(false);
  });

  it('should activate and deactivate alert', () => {
    const alerta = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });

    alerta.desativar();
    expect(alerta.ativo).toBe(false);

    alerta.ativar();
    expect(alerta.ativo).toBe(true);
  });

  it('should update message and title', () => {
    const alerta = new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: 'Estoque Baixo',
      mensagem: 'Produto com estoque baixo',
      destinatario: email,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });

    alerta.atualizarMensagem('Nova mensagem');
    alerta.atualizarTitulo('Novo título');

    expect(alerta.mensagem).toBe('Nova mensagem');
    expect(alerta.titulo).toBe('Novo título');
  });

  describe('Static factory methods', () => {
    it('should create low stock alert', () => {
      const alerta = Alerta.criarAlertaEstoqueBaixo(email, produtoId, 'Camiseta Azul', 5, 10);

      expect(alerta.tipo).toBe(TipoAlerta.ESTOQUE_BAIXO);
      expect(alerta.status).toBe(StatusAlerta.PENDENTE);
      expect(alerta.titulo).toBe('Estoque Baixo - Camiseta Azul');
      expect(alerta.mensagem).toBe(
        'O produto Camiseta Azul está com estoque baixo. Quantidade atual: 5, Mínima: 10'
      );
      expect(alerta.destinatario).toBe(email);
      expect(alerta.produtoId).toBe(produtoId);
      expect(alerta.tentativasEnvio).toBe(0);
      expect(alerta.maxTentativas).toBe(3);
      expect(alerta.ativo).toBe(true);
    });

    it('should create out of stock alert', () => {
      const alerta = Alerta.criarAlertaEstoqueZerado(email, produtoId, 'Camiseta Azul');

      expect(alerta.tipo).toBe(TipoAlerta.ESTOQUE_ZERADO);
      expect(alerta.status).toBe(StatusAlerta.PENDENTE);
      expect(alerta.titulo).toBe('Estoque Zerado - Camiseta Azul');
      expect(alerta.mensagem).toBe(
        'O produto Camiseta Azul está sem estoque. É necessário fazer um novo pedido.'
      );
      expect(alerta.destinatario).toBe(email);
      expect(alerta.produtoId).toBe(produtoId);
      expect(alerta.tentativasEnvio).toBe(0);
      expect(alerta.maxTentativas).toBe(3);
      expect(alerta.ativo).toBe(true);
    });

    it('should create order arrived alert', () => {
      const alerta = Alerta.criarAlertaPedidoChegou(email, produtoId, 'Camiseta Azul');

      expect(alerta.tipo).toBe(TipoAlerta.PEDIDO_CHEGOU);
      expect(alerta.status).toBe(StatusAlerta.PENDENTE);
      expect(alerta.titulo).toBe('Pedido Chegou - Camiseta Azul');
      expect(alerta.mensagem).toBe(
        'O pedido do produto Camiseta Azul chegou e foi adicionado ao estoque.'
      );
      expect(alerta.destinatario).toBe(email);
      expect(alerta.produtoId).toBe(produtoId);
      expect(alerta.tentativasEnvio).toBe(0);
      expect(alerta.maxTentativas).toBe(3);
      expect(alerta.ativo).toBe(true);
    });
  });
});
