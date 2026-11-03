export interface CodeExplanation {
  id: string;
  title: string;
  category: string;
  lineRange: string;
  summary: string;
  details: string;
  benefits: string[];
}

export const FUNCTIONAL_PYTHON_CODE = `"""
Calculadora Simples e Modular em Python.

Operações fundamentais suportadas:
  1. Adição (+)
  2. Subtração (-)
  3. Multiplicação (*)
  4. Divisão (/) com validação contra divisão por zero
  5. Potência (^) com suporte a expoentes reais
  6. Porcentagem (%) calculando a taxa percentual de um valor

Autor: Código Limpo & Modular
Padrão: PEP 8 com Type Hinting
"""

from typing import Union

# Definição de alias de tipo para flexibilidade numérica
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
    Solicita um número ao usuário e valida a entrada contra erros de tipo (ValueError).
    Aceita vírgula ou ponto como separador decimal.
    """
    while True:
        entrada = input(mensagem).strip().replace(",", ".")
        try:
            return float(entrada)
        except ValueError:
            print("❌ Entrada inválida! Digite apenas números reais (ex: 10, -5 ou 3.14).")


def exibir_menu() -> None:
    """Exibe o menu de opções disponíveis no terminal."""
    print("\\n" + "=" * 40)
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
    """
    Função principal que orquestra o fluxo de execução,
    o menu interativo e o tratamento de exceções.
    """
    # Mapeamento limpo entre opção do menu e a função correspondente (Dispatch Table)
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

        # Condição de saída limpa
        if opcao == "7":
            print("\\nEncerrando a calculadora. Até logo!")
            break

        # Validação da opção informada
        if opcao not in operacoes:
            print("\\n❌ Opção inexistente. Por favor, escolha um número de 1 a 7.")
            continue

        simbolo, funcao_operacao = operacoes[opcao]

        # Coleta segura dos dois operandos
        num1 = obter_numero("Digite o primeiro número: ")
        num2 = obter_numero("Digite o segundo número: ")

        # Execução protegida com tratamento de ZeroDivisionError e ValueError
        try:
            resultado = funcao_operacao(num1, num2)
            # Formata sem casas decimais se for inteiro exato (ex: 4.0 -> 4)
            res_str = f"{int(resultado)}" if resultado.is_integer() else f"{resultado:.4f}".rstrip("0").rstrip(".")
            print(f"\\n✅ Resultado: {num1} {simbolo} {num2} = {res_str}")
        except (ZeroDivisionError, ValueError) as erro:
            print(f"\\n⚠️  {erro}")


# Ponto de entrada padrão do script Python
if __name__ == "__main__":
    executar_calculadora()
`;

export const OOP_PYTHON_CODE = `"""
Calculadora Orientada a Objetos (OOP) em Python.

Demonstra encapsulamento, histórico de operações e reutilização em classes.
"""

from typing import List, Tuple, Union

Numero = Union[int, float]


class Calculadora:
    """
    Classe que encapsula as operações matemáticas e armazena o histórico de cálculos.
    """

    def __init__(self) -> None:
        self.historico: List[Tuple[str, float]] = []

    def adicionar(self, a: Numero, b: Numero) -> float:
        """Executa a adição e registra no histórico."""
        resultado = float(a + b)
        self._registrar_historico(f"{a} + {b}", resultado)
        return resultado

    def subtrair(self, a: Numero, b: Numero) -> float:
        """Executa a subtração e registra no histórico."""
        resultado = float(a - b)
        self._registrar_historico(f"{a} - {b}", resultado)
        return resultado

    def multiplicar(self, a: Numero, b: Numero) -> float:
        """Executa a multiplicação e registra no histórico."""
        resultado = float(a * b)
        self._registrar_historico(f"{a} * {b}", resultado)
        return resultado

    def dividir(self, a: Numero, b: Numero) -> float:
        """
        Executa a divisão com proteção contra divisor zero.
        """
        if b == 0:
            raise ZeroDivisionError("Divisor não pode ser zero.")
        resultado = float(a / b)
        self._registrar_historico(f"{a} / {b}", resultado)
        return resultado

    def potenciar(self, a: Numero, b: Numero) -> float:
        """Executa a potenciação e registra no histórico."""
        if a == 0 and b < 0:
            raise ZeroDivisionError("Zero não pode ser elevado a potência negativa.")
        resultado = a ** b
        if isinstance(resultado, complex):
            raise ValueError("Resultado complexo não suportado.")
        resultado_float = float(resultado)
        self._registrar_historico(f"{a} ^ {b}", resultado_float)
        return resultado_float

    def porcentagem(self, a: Numero, b: Numero) -> float:
        """Calcula a porcentagem ((a * b) / 100) e registra no histórico."""
        resultado = float((a * b) / 100)
        self._registrar_historico(f"{b}% de {a}", resultado)
        return resultado

    def _registrar_historico(self, expressao: str, resultado: float) -> None:
        """Método auxiliar interno para registrar operações."""
        self.historico.append((expressao, resultado))

    def ver_historico(self) -> List[Tuple[str, float]]:
        """Retorna uma cópia do histórico de operações."""
        return list(self.historico)


# Exemplo de uso:
if __name__ == "__main__":
    calc = Calculadora()
    print("Soma:", calc.adicionar(10, 5))          # 15.0
    print("Subtração:", calc.subtrair(20, 8))       # 12.0
    print("Multiplicação:", calc.multiplicar(4, 3)) # 12.0
    print("Divisão:", calc.dividir(50, 2))          # 25.0
    print("Potência:", calc.potenciar(2, 8))        # 256.0
    print("Porcentagem:", calc.porcentagem(250, 15))# 37.5
    print("\\nHistórico:", calc.ver_historico())
`;

export const TEST_PYTHON_CODE = `"""
Testes Unitários Automatizados para a Calculadora Python (usando unittest).
Garante a corretude de todas as operações e tratamento de erros.
"""

import unittest
from calculadora import adicao, subtracao, multiplicacao, divisao, potencia, porcentagem


class TestCalculadora(unittest.TestCase):
    """Bateria de testes cobrindo casos normais e limites."""

    def test_adicao(self):
        self.assertEqual(adicao(2, 3), 5.0)
        self.assertEqual(adicao(-1, 1), 0.0)
        self.assertEqual(adicao(2.5, 3.5), 6.0)

    def test_subtracao(self):
        self.assertEqual(subtracao(10, 4), 6.0)
        self.assertEqual(subtracao(0, 5), -5.0)
        self.assertEqual(subtracao(-3, -7), 4.0)

    def test_multiplicacao(self):
        self.assertEqual(multiplicacao(3, 4), 12.0)
        self.assertEqual(multiplicacao(-2, 3), -6.0)
        self.assertEqual(multiplicacao(100, 0), 0.0)

    def test_divisao_valida(self):
        self.assertEqual(divisao(10, 2), 5.0)
        self.assertEqual(divisao(7, 2), 3.5)
        self.assertEqual(divisao(-12, 4), -3.0)

    def test_divisao_por_zero(self):
        """Verifica se divisao por zero dispara ZeroDivisionError."""
        with self.assertRaises(ZeroDivisionError):
            divisao(10, 0)

    def test_potencia(self):
        self.assertEqual(potencia(2, 3), 8.0)
        self.assertEqual(potencia(5, 0), 1.0)
        self.assertEqual(potencia(9, 0.5), 3.0)

    def test_potencia_zero_negativo(self):
        """Verifica se 0 elevado a expoente negativo dispara ZeroDivisionError."""
        with self.assertRaises(ZeroDivisionError):
            potencia(0, -2)

    def test_porcentagem(self):
        self.assertEqual(porcentagem(200, 15), 30.0)
        self.assertEqual(porcentagem(50, 2.5), 1.25)
        self.assertEqual(porcentagem(0, 50), 0.0)


if __name__ == "__main__":
    unittest.main()
`;

export const ARCHITECTURE_SECTIONS: CodeExplanation[] = [
  {
    id: "modularity",
    title: "1. Funções Puras e Modularidade (Princípio da Responsabilidade Única)",
    category: "Design de Software",
    lineRange: "Linhas 21 - 50",
    summary: "Cada operação matemática possui uma função separada, independente e sem efeitos colaterais.",
    details:
      "Em vez de colocar toda a lógica em um único bloco de código, separamos 'adicao', 'subtracao', 'multiplicacao', 'divisao', 'potencia' e 'porcentagem'. Cada função recebe apenas seus parâmetros numéricos e retorna o resultado. Isso atende ao Princípio de Responsabilidade Única (SRP - Single Responsibility Principle): as funções de cálculo não sabem de onde vêm os dados (terminal, interface web, arquivo) nem como eles serão exibidos.",
    benefits: [
      "Reutilização: as funções podem ser importadas em outros scripts sem precisar copiar código",
      "Testabilidade: é possível criar testes automatizados simples para cada função",
      "Isolamento de bugs: um erro em uma operação não afeta as outras",
    ],
  },
  {
    id: "typing",
    title: "2. Tipagem Estática (Type Hinting com typing.Union)",
    category: "Robustez & PEP 484",
    lineRange: "Linhas 15 - 45",
    summary: "Uso de anotações como 'a: Numero, b: Numero -> float' para declarar contratos claros de dados.",
    details:
      "O Python é uma linguagem dinamicamente tipada, mas desde o Python 3.5 o recurso de Type Hints (PEP 484) permite explicitar quais tipos são esperados e retornados. Definimos 'Numero = Union[int, float]' para que os parâmetros aceitem tanto números inteiros quanto reais, documentando imediatamente o contrato esperado.",
    benefits: [
      "Autocompletion inteligente em editores como VS Code e PyCharm",
      "Documentação viva no próprio código, eliminando dúvidas sobre o tipo de retorno",
      "Possibilidade de validação estática prévia com ferramentas como MyPy",
    ],
  },
  {
    id: "exception_handling",
    title: "3. Tratamento Resiliente de Exceções (ZeroDivisionError e ValueError)",
    category: "Segurança & Confiabilidade",
    lineRange: "Linhas 40 - 64, 98 - 105",
    summary: "Prevenção ativa contra quebra do programa em divisões por zero ou caracteres não numéricos.",
    details:
      "Em programas de iniciantes, ao digitar 'abc' o Python gera um ValueError e aborta o programa. Ao dividir por 0, gera um ZeroDivisionError. Nosso código adota duas práticas profissionais: na função 'divisao', fazemos uma checagem defensiva explícita lançando um ZeroDivisionError com mensagem amigável; na função 'obter_numero', usamos um loop 'while True' protegido por 'try/except ValueError' que insiste até o usuário fornecer um valor válido.",
    benefits: [
      "Zero travamentos inesperados: o programa orienta o usuário em vez de quebrar com um traceback assustador",
      "Separação entre detecção do erro (na função divisao) e exibição do erro (no laço principal)",
      "Suporte a vírgula ou ponto decimal (.replace(',', '.'))",
    ],
  },
  {
    id: "dispatch_table",
    title: "4. Tabela de Operações (Dicionário de Dispatch vs. if/elif)",
    category: "Clean Code",
    lineRange: "Linhas 78 - 84",
    summary: "Substituição de longas cadeias de if/elif por um dicionário mapeando opções para funções.",
    details:
      "Em vez de escrever 'if opcao == 1: adicao(...) elif opcao == 2: subtracao(...)', usamos um dicionário 'operacoes = {'1': ('+', adicao), ...}'. Como funções em Python são objetos de primeira classe (First-Class Citizens), podemos armazená-las em coleções e chamá-las dinamicamente como 'funcao_operacao(num1, num2)'.",
    benefits: [
      "Código muito mais limpo, elegante e conciso",
      "Extensibilidade: para adicionar uma nova operação (ex: potenciação), basta incluir uma linha no dicionário",
      "Facilidade de validação de opções com 'if opcao not in operacoes'",
    ],
  },
  {
    id: "main_guard",
    title: "5. A Guarda 'if __name__ == \"__main__\":'",
    category: "Arquitetura Python",
    lineRange: "Linha 109 - 110",
    summary: "Permite que o script funcione tanto como programa autônomo quanto como biblioteca importável.",
    details:
      "Quando você executa um arquivo Python com 'python calculadora.py', a variável mágica '__name__' recebe o valor '__main__'. Porém, se outro arquivo fizer 'import calculadora', a variável '__name__' terá o nome do módulo ('calculadora'). Essa guarda impede que o menu interativo e as perguntas de input iniciem automaticamente quando o arquivo é apenas importado para testes ou reutilização.",
    benefits: [
      "Permite que o arquivo de testes importe 'adicao', 'divisao', etc. sem disparar o menu interativo",
      "Padrão canônico exigido em projetos profissionais Python",
      "Organiza o ponto de entrada único do aplicativo",
    ],
  },
  {
    id: "pep8_docstrings",
    title: "6. Docstrings e Conformidade com PEP 8",
    category: "Legibilidade & Documentação",
    lineRange: "Linhas 1 - 12 e em cada função",
    summary: "Formatação padronizada e documentação clara acessível nativamente pela função help().",
    details:
      "O código adota a convenção PEP 8: nomes de funções e variáveis em snake_case (ex: 'obter_numero', 'funcao_operacao'), espaçamento consistente ao redor de operadores, e docstrings em formato triple-quote. Qualquer desenvolvedor pode executar 'help(divisao)' no terminal Python para ver os parâmetros e as exceções documentadas.",
    benefits: [
      "Facilidade de leitura imediata por outros desenvolvedores e equipes",
      "Geração automática de documentação através de ferramentas como Sphinx",
      "Padrão internacional da comunidade Python",
    ],
  },
];
