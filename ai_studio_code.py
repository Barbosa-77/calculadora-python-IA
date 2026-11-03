"""
Calculadora Simples e Modular em Python.

Operações suportadas:
  1. Adição (+)
  2. Subtração (-)
  3. Multiplicação (*)
  4. Divisão (/) com proteção contra divisão por zero.
  5. Potência (^) com suporte a expoentes reais e proteção contra zero negativo.
  6. Porcentagem (%) calculando a taxa percentual de um valor.

Padrão: PEP 8 com Type Hinting (PEP 484).
"""

from typing import Union

# Alias de tipo para flexibilidade numérica (aceita inteiros e floats)
Numero = Union[int, float]


def adicao(a: Numero, b: Numero) -> float:
    """Calcula e retorna a soma de dois números."""
    return float(a + b)


def subtracao(a: Numero, b: Numero) -> float:
    """Calcula e retorna a diferença entre dois números (a - b)."""
    return float(a - b)


def multiplicacao(a: Numero, b: Numero) -> float:
    """Calcula e retorna o produto de dois números (a * b)."""
    return float(a * b)


def divisao(a: Numero, b: Numero) -> float:
    """
    Calcula e retorna o quociente de a dividido por b.

    Raises:
        ZeroDivisionError: Lançado caso o divisor (b) seja igual a zero.
    """
    if b == 0:
        raise ZeroDivisionError("Erro matemático: Não é possível dividir por zero (0).")
    return float(a / b)


def potencia(a: Numero, b: Numero) -> float:
    """
    Calcula e retorna a base 'a' elevada ao expoente 'b' (a ** b).

    Raises:
        ZeroDivisionError: Lançado caso a base seja 0 e o expoente seja negativo.
        ValueError: Lançado caso o cálculo resulte em número complexo.
    """
    if a == 0 and b < 0:
        raise ZeroDivisionError("Erro matemático: Não é possível elevar zero (0) a um expoente negativo.")
    resultado = a ** b
    if isinstance(resultado, complex):
        raise ValueError("Erro matemático: O resultado é um número complexo (base negativa com expoente fracionário).")
    return float(resultado)


def porcentagem(a: Numero, b: Numero) -> float:
    """Calcula e retorna a porcentagem de um valor: (a * b) / 100."""
    return float((a * b) / 100)


def obter_numero(mensagem: str) -> float:
    """
    Solicita um número ao usuário e trata erros de entrada (ValueError).
    Aceita vírgula ou ponto como separador decimal.
    """
    while True:
        entrada = input(mensagem).strip().replace(",", ".")
        try:
            return float(entrada)
        except ValueError:
            print("❌ Entrada inválida! Digite apenas números válidos (ex: 10, -5 ou 3.14).")


def exibir_menu() -> None:
    """Exibe o menu de opções disponíveis no terminal."""
    print("\n" + "=" * 40)
    print("         CALCULADORA EM PYTHON         ")
    print("=" * 40)
    print(" 1. Adição (+)")
    print(" 2. Subtração (-)")
    print(" 3. Multiplicação (*)")
    print(" 4. Divisão (/)")
    print(" 5. Potência (^)")
    print(" 6. Porcentagem (%)")
    print(" 7. Sair")
    print("=" * 40)


def executar_calculadora() -> None:
    """Orquestra o menu, as operações e o fluxo de repetição."""
    # Tabela de Despacho (Dispatch Table): mapeia opção para símbolo e função
    operacoes = {
        "1": ("+", adicao),
        "2": ("-", subtracao),
        "3": ("*", multiplicacao),
        "4": ("/", divisao),
        "5": ("^", potencia),
        "6": ("%", porcentagem),
    }

    print("Bem-vindo à Calculadora Python!")

    while True:
        exibir_menu()
        opcao = input("Selecione uma opção (1-7): ").strip()

        # Condição de saída
        if opcao == "7":
            print("\nEncerrando a calculadora. Até logo!")
            break

        # Validação da opção
        if opcao not in operacoes:
            print("\n❌ Opção inexistente. Por favor, escolha um número de 1 a 7.")
            continue

        simbolo, funcao_operacao = operacoes[opcao]

        # Coleta protegida dos números
        num1 = obter_numero("Digite o primeiro número: ")
        num2 = obter_numero("Digite o segundo número: ")

        # Execução protegida contra divisões por zero ou valores inválidos
        try:
            resultado = funcao_operacao(num1, num2)
            # Formatação amigável: remove casas decimais se for número inteiro (ex: 4.0 -> 4)
            res_str = f"{int(resultado)}" if resultado.is_integer() else f"{resultado:.4f}".rstrip("0").rstrip(".")
            print(f"\n✅ Resultado: {num1} {simbolo} {num2} = {res_str}")
        except (ZeroDivisionError, ValueError) as erro:
            print(f"\n⚠️  {erro}")


# Ponto de entrada padrão do script
if __name__ == "__main__":
    executar_calculadora()