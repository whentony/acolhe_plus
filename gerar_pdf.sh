#!/bin/bash

echo "🚀 Iniciando a compilação do artigo científico (LaTeX para PDF)..."

# Executa o pdflatex (duas vezes é recomendado caso houvessem tabelas de conteúdo ou referências cruzadas)
pdflatex artigo_cientifico.tex

echo "🧹 Limpando os arquivos temporários gerados pelo compilador..."
# O LaTeX gera vários arquivos auxiliares, apagamos para deixar a pasta limpa
rm -f artigo_cientifico.aux artigo_cientifico.log artigo_cientifico.out

echo "✅ Sucesso! O arquivo 'artigo_cientifico.pdf' está pronto na sua pasta."
