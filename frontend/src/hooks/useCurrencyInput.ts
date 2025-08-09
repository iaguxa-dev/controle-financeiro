import { useState, useCallback } from 'react'

export const useCurrencyInput = (initialValue: number = 0) => {
  const [value, setValue] = useState<number>(initialValue)

  const formatValue = useCallback((val: number | string): string => {
    // Converte para número se for string
    const numValue = typeof val === 'string' ? parseFloat(val) : val
    
    // Se não for um número válido, retorna string vazia
    if (isNaN(numValue) || numValue === 0) return ''
    
    // Formata com separadores brasileiros
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue)
  }, [])

  const parseValue = useCallback((displayValue: string): number => {
    // Remove todos os caracteres não numéricos exceto vírgula e ponto
    const cleanValue = displayValue.replace(/[^\d,.-]/g, '')
    
    // Se está vazio, retorna 0
    if (!cleanValue) return 0
    
    // Substitui vírgula por ponto para conversão
    const normalizedValue = cleanValue.replace(',', '.')
    
    // Converte para número
    const parsed = parseFloat(normalizedValue)
    return isNaN(parsed) ? 0 : parsed
  }, [])

  const handleChange = useCallback((val: number | null) => {
    const newValue = val || 0
    setValue(newValue)
    return newValue
  }, [])

  return {
    value,
    setValue,
    formatValue,
    parseValue,
    handleChange
  }
}
