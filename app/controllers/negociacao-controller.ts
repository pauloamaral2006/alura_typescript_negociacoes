import { DiaDaSemana } from "../enums/dias-da-semana.js";
import { Negociacao } from "../models/negociacao.js";
import { Negociacoes } from "../models/negociacoes.js";
import { MensagemView } from "../views/mensagem-view.js";
import { NegociacoesView } from "../views/negociacoes-viewer.js";

export class NegociacaoController {
  private inputData: HTMLInputElement;
  private inputQuantidade: HTMLInputElement;
  private inputValor: HTMLInputElement;
  private negociacoes = new Negociacoes();
  private negociacoesView = new NegociacoesView("#negociacoesView");
  private mensagemView = new MensagemView("#mensagemView");

  constructor() {
    this.inputData = <HTMLInputElement>document.querySelector("#data");
    this.inputQuantidade = document.querySelector(
      "#quantidade"
    ) as HTMLInputElement;
    this.inputValor = document.querySelector("#valor") as HTMLInputElement;
    this.negociacoesView.update(this.negociacoes);
  }

  public adiciona(): void {
    const negociacao = this.criaNegociacao();

    if (!this.ehDiaUtil(negociacao.data)) {
      this.mensagemView.update("Apenas negociações em dias úteis são aceitas.");
      return;
    }
    this.negociacoes.adiciona(negociacao);
    this.limpparformulario();
    this.atualizaVire();
  }

  private ehDiaUtil(data: Date) {
    return (
      data.getDay() > DiaDaSemana.DOMINGO && data.getDay() < DiaDaSemana.SABADO
    );
  }

  private criaNegociacao(): Negociacao {
    return Negociacao.criaDe(
      this.inputData.value,
      this.inputQuantidade.value,
      this.inputValor.value
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
