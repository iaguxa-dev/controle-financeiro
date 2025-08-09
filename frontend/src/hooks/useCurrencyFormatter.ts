import { useState, useCallback } from 'react'

export const useCurrencyFormatter = () => {
  const [displayValue, setDisplayValue] = useState('R$ 0,00')

  const handleInputChange = useCallback((inputValue: string, onFormChange: (value: number) => void) => {
    // Remove tudo exceto números
    const cleanValue = inputValue.replace(/[^\d]/g, '')
    
    if (!cleanValue) {
      setDisplayValue('R$ 0,00')
      onFormChange(0)
      return
    }
    
    // Converte para centavos e depois para reais
    const cents = parseInt(cleanValue)
    const reais = cents / 100
    
    // Atualiza o valor no form
    onFormChange(reais)
    
    // Formata para exibição
    const formatted = `R$ ${reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
    
    setDisplayValue(formatted)
  }, [])

  const resetValue = useCallback(() => {
    setDisplayValue('R$ 0,00')
  }, [])

  const setValue = useCallback((value: number) => {
    if (!value || value === 0) {
      setDisplayValue('R$ 0,00')
      return
    }
    
    const formatted = `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
    setDisplayValue(formatted)
  }, [])

  return {
    displayValue,
    handleInputChange,
    resetValue,
    setValue
  }
}
