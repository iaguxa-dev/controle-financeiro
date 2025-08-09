import { Input } from 'antd'
import { useState, useCallback, useEffect } from 'react'

interface CurrencyInputProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
}

export const CurrencyInput = ({ value, onChange, placeholder = "R$ 0,00" }: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState(() => {
    if (value && value > 0) {
      return `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }
    return 'R$ 0,00'
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Remove tudo exceto números
    const cleanValue = inputValue.replace(/[^\d]/g, '')
    
    if (!cleanValue) {
      setDisplayValue('R$ 0,00')
      onChange?.(0)
      return
    }
    
    // Converte para centavos e depois para reais
    const cents = parseInt(cleanValue)
    const reais = cents / 100
    
    // Formata para exibição
    const formatted = `R$ ${reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
    
    setDisplayValue(formatted)
    onChange?.(reais)
  }, [onChange])

  // Atualiza displayValue quando value prop muda
  useEffect(() => {
    if (value !== undefined && value >= 0) {
      const formatted = `R$ ${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
      setDisplayValue(formatted)
    } else {
      setDisplayValue('R$ 0,00')
    }
  }, [value])

  return (
    <Input
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
    />
  )
}
