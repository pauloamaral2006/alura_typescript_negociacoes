import { domInjector } from "../decorators/dom-injector.js";
import { inspect } from "../decorators/imspect.js";
import { logarTempoDeExecucao } from "../decorators/logar-tempo-de-execucao.js";
import { DiaDaSemana } from "../enums/dias-da-semana.js";
import { Negociacao } from "../models/negociacao.js";
import { Negociacoes } from "../models/negociacoes.js";
import { NegociacoesService } from "../services/negociacoes-service.js";
import { MensagemView } from "../views/mensagem-view.js";
import { NegociacoesView } from "../views/negociacoes-viewer.js";

export class NegociacaoController {
  @domInjector("#data")
  private inputData: HTMLInputElement;

  @domInjector("#quantidade")
  private inputQuantidade: HTMLInputElement;

  @domInjector("#valor")
  private inputValor: HTMLInputElement;
  private negociacoes = new Negociacoes();
  private negociacoesView = new NegociacoesView("#negociacoesView");
  private mensagemView = new MensagemView("#mensagemView");
  private negociacaoService = new NegociacoesService();
  constructor() {
    this.negociacoesView.update(this.negociacoes);
  }

  @inspect
  @logarTempoDeExecucao()
  public adiciona(): void {
    const negociacao = Negociacao.criaDe(
      this.inputData.value,
      this.inputQuantidade.value,
      this.inputValor.value
    );

    if (!this.ehDiaUtil(negociacao.data)) {
      this.mensagemView.update("Apenas negociações em dias úteis são aceitas.");
      return;
    }
    this.negociacoes.adiciona(negociacao);
    this.limpparformulario();
    this.atualizaVire();
  }

  importaDados(): void {
    this.negociacaoService.obterNegociacoesDoDia().then((negociacoesDeHoje) => {
      return negociacoesDeHoje.filter((negociacaoDeHoje) => {
        return !this.negociacoes
          .lista()
          .some((negociacao) => negociacao.ehIgual(negociacaoDeHoje));
      });
    });
    this.negociacaoService.obterNegociacoesDoDia().then((negociacoesDeHoje) => {
      for (let negociacao of negociacoesDeHoje) {
        this.negociacoes.adiciona(negociacao);
      }
      this.atualizaVire();
    });
  }
  private ehDiaUtil(data: Date) {
    return (
      data.getDay() > DiaDaSemana.DOMINGO && data.getDay() < DiaDaSemana.SABADO
    );
  }

  private limpparformulario() {
    this.inputData.value = "";
    this.inputQuantidade.value = "";
    this.inputValor.value = "";

    this.inputData.focus();
  }

  private atualizaVire() {
    this.negociacoesView.update(this.negociacoes);
    this.mensagemView.update("Negociação adicionada com sucesso.");
  }
}
