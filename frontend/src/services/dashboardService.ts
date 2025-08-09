import api from './api'

export interface DashboardData {
  stats: {
    saldoMes: number
    totalReceitas: number
    totalDespesas: number
    contasPagas: number
    contasAPagar: number
  }
  ultimasReceitas: Array<{
    id: string
    descricao: string
    valor: number
    data_recebimento: string
    categoria: string
  }>
  proximasContas: Array<{
    id: string
    descricao: string
    valor: number
    data_vencimento: string
    categoria: string
    status: string
  }>
  resumoFinanceiro?: {
    totalReceitas: number
    totalDespesas: number
    saldoAtual: number
    despesasPendentes: number
  }
  despesasVencendo?: any[]
  receitasRecentes?: any[]
  faturasResumo?: any[]
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [receitasRes, despesasRes, faturasRes] = await Promise.all([
        api.get('/receitas'),
        api.get('/despesas'),
        api.get('/faturas')
      ])

      const receitas = receitasRes.data || []
      const despesas = despesasRes.data || []
      const faturas = faturasRes.data || []

      // Calcular resumo financeiro
      const totalReceitas = receitas.reduce((sum: number, receita: any) => sum + parseFloat(receita.valor || 0), 0)
      const totalDespesas = despesas.reduce((sum: number, despesa: any) => sum + parseFloat(despesa.valor || 0), 0)
      const totalFaturas = faturas.reduce((sum: number, fatura: any) => sum + parseFloat(fatura.valor || 0), 0)
      
      const saldoAtual = totalReceitas - totalDespesas - totalFaturas
      const despesasPendentes = despesas.filter((despesa: any) => despesa.status === 'pendente').length

      // Calcular estatísticas
      const contasPagas = despesas.filter((despesa: any) => despesa.status === 'pago').length
      const contasAPagar = despesas.filter((despesa: any) => despesa.status === 'pendente').length

      // Despesas vencendo (próximos 7 dias)
      const hoje = new Date()
      const proximaSemanaa = new Date()
      proximaSemanaa.setDate(hoje.getDate() + 7)
      
      const despesasVencendo = despesas.filter((despesa: any) => {
        if (despesa.status !== 'pendente') return false
        const dataVencimento = new Date(despesa.data_vencimento)
        return dataVencimento >= hoje && dataVencimento <= proximaSemanaa
      })

      // Receitas recentes (últimas 5)
      const receitasRecentes = receitas
        .sort((a: any, b: any) => new Date(b.created_at || b.data_recebimento).getTime() - new Date(a.created_at || a.data_recebimento).getTime())
        .slice(0, 5)

      // Próximas contas a pagar (próximos 10 dias)
      const proximasConta = new Date()
      proximasConta.setDate(hoje.getDate() + 10)
      
      const proximasContas = despesas
        .filter((despesa: any) => {
          if (despesa.status === 'pago') return false
          const dataVencimento = new Date(despesa.data_vencimento)
          return dataVencimento >= hoje && dataVencimento <= proximasConta
        })
        .sort((a: any, b: any) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
        .slice(0, 5)

      // Resumo de faturas por competência
      const faturasResumo = faturas.reduce((acc: any, fatura: any) => {
        const competencia = fatura.competencia
        if (!acc[competencia]) {
          acc[competencia] = {
            competencia,
            total: 0,
            quantidade: 0
          }
        }
        acc[competencia].total += parseFloat(fatura.valor || 0)
        acc[competencia].quantidade += 1
        return acc
      }, {})

      return {
        stats: {
          saldoMes: saldoAtual,
          totalReceitas,
          totalDespesas: totalDespesas + totalFaturas,
          contasPagas,
          contasAPagar
        },
        ultimasReceitas: receitasRecentes.map((receita: any) => ({
          id: receita.id,
          descricao: receita.descricao,
          valor: parseFloat(receita.valor || 0),
          data_recebimento: receita.data_recebimento,
          categoria: receita.categoria
        })),
        proximasContas: proximasContas.map((despesa: any) => ({
          id: despesa.id,
          descricao: despesa.descricao,
          valor: parseFloat(despesa.valor || 0),
          data_vencimento: despesa.data_vencimento,
          categoria: despesa.categoria,
          status: despesa.status
        })),
        resumoFinanceiro: {
          totalReceitas,
          totalDespesas: totalDespesas + totalFaturas,
          saldoAtual,
          despesasPendentes
        },
        despesasVencendo,
        receitasRecentes,
        faturasResumo: Object.values(faturasResumo)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
      throw error
    }
  },

  async getResumoMensal(month: string, year: string) {
    try {
      const [receitasRes, despesasRes] = await Promise.all([
        api.get(`/receitas?month=${month}&year=${year}`),
        api.get(`/despesas?month=${month}&year=${year}`)
      ])

      const receitas = receitasRes.data || []
      const despesas = despesasRes.data || []

      const totalReceitas = receitas.reduce((sum: number, receita: any) => sum + parseFloat(receita.valor || 0), 0)
      const totalDespesas = despesas.reduce((sum: number, despesa: any) => sum + parseFloat(despesa.valor || 0), 0)

      return {
        totalReceitas,
        totalDespesas,
        saldo: totalReceitas - totalDespesas,
        quantidadeReceitas: receitas.length,
        quantidadeDespesas: despesas.length
      }
    } catch (error) {
      console.error('Erro ao buscar resumo mensal:', error)
      throw error
    }
  }
}
