import { useCallback } from 'react'

export const useBrazilianCurrency = () => {
  const formatCurrency = useCallback((value: number | string): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numericValue)) {
      return 'R$ 0,00'
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue)
  }, [])

  const parseCurrency = useCallback((value: string): number => {
    // Remove todos os caracteres que não são dígitos, vírgula ou ponto
    const cleanValue = value.replace(/[^\d,.-]/g, '')
    
    // Se tem vírgula, substitui por ponto para conversão
    const normalizedValue = cleanValue.replace(',', '.')
    
    const parsed = parseFloat(normalizedValue)
    return isNaN(parsed) ? 0 : parsed
  }, [])

  const formatInputCurrency = useCallback((value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    // Converte para número e divide por 100 para ter os centavos
    const amount = parseInt(numbers) / 100
    
    return formatCurrency(amount).replace('R$ ', '')
  }, [formatCurrency])

  return {
    formatCurrency,
    parseCurrency,
    formatInputCurrency,
  }
}
