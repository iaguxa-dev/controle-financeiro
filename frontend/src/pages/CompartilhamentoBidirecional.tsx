import { Card, Typography, Space, Alert, List, Tag } from 'antd'
import { 
  ShareAltOutlined, 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

export default function CompartilhamentoBidirecional() {
  return (
    <div>
      <Title level={2}>
        <ShareAltOutlined /> Sistema de Compartilhamento Bidirecional
      </Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Alert
          message="✨ Novidade: Compartilhamento Completo!"
          description="Agora o compartilhamento é bidirecional! Ambas as pessoas com o mesmo código podem ver, editar e excluir todas as transações."
          type="success"
          showIcon
        />

        <Card title="🔄 Como Funciona o Compartilhamento Bidirecional">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Paragraph>
              Quando duas pessoas compartilham o mesmo código, elas têm acesso <strong>completo e igual</strong> a todas as transações financeiras:
            </Paragraph>

            <List
              size="small"
              dataSource={[
                { icon: <EyeOutlined />, text: 'Visualizar todas as receitas, despesas e faturas', color: 'blue' },
                { icon: <PlusOutlined />, text: 'Adicionar novas transações', color: 'green' },
                { icon: <EditOutlined />, text: 'Editar qualquer transação existente', color: 'orange' },
                { icon: <DeleteOutlined />, text: 'Excluir qualquer transação', color: 'red' }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <Tag color={item.color} icon={item.icon}>
                      Permissão
                    </Tag>
                    <Text>{item.text}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Space>
        </Card>

        <Card title="👥 Cenários de Uso">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>💑 Casal:</Text>
              <Paragraph>
                Ambos os cônjuges podem gerenciar completamente as finanças da família. 
                Cada um pode adicionar suas receitas e despesas, e ambos têm visibilidade total.
              </Paragraph>
            </div>

            <div>
              <Text strong>👨‍👩‍👧‍👦 Família:</Text>
              <Paragraph>
                Pais podem compartilhar o controle financeiro. Cada pai pode adicionar 
                despesas e receitas, facilitando o controle conjunto do orçamento familiar.
              </Paragraph>
            </div>

            <div>
              <Text strong>🏢 Sociedade:</Text>
              <Paragraph>
                Sócios podem compartilhar o controle financeiro da empresa, 
                com ambos tendo acesso total às transações comerciais.
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card title="🔍 Identificação de Transações">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Paragraph>
              Nas listas de transações, você verá tags indicando quem criou cada item:
            </Paragraph>

            <Space wrap>
              <Tag color="blue" icon={<UserOutlined />}>
                Seus dados
              </Tag>
              <Tag color="orange" icon={<UserOutlined />}>
                João Silva
              </Tag>
              <Tag color="orange" icon={<UserOutlined />}>
                Maria Santos
              </Tag>
            </Space>

            <Alert
              message="Transparência Total"
              description="Mesmo que você possa editar transações de outras pessoas, sempre saberá quem criou originalmente cada item."
              type="info"
              showIcon
            />
          </Space>
        </Card>

        <Card title="⚠️ Importante Saber">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Alert
              message="Responsabilidade Compartilhada"
              description="Como ambas as pessoas têm acesso total, é importante ter confiança mútua e comunicação sobre as mudanças feitas."
              type="warning"
              showIcon
            />

            <List
              size="small"
              dataSource={[
                'Qualquer pessoa pode excluir transações criadas pela outra',
                'Mudanças são refletidas imediatamente para ambas as pessoas',
                'Não há histórico de quem fez alterações (apenas quem criou)',
                'O código de compartilhamento é o mesmo para ambas as pessoas'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text>• {item}</Text>
                </List.Item>
              )}
            />
          </Space>
        </Card>

        <Card title="🚀 Como Começar">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Paragraph>
              <Text strong>Passo 1:</Text> Acesse seu perfil e copie seu código de compartilhamento
            </Paragraph>
            <Paragraph>
              <Text strong>Passo 2:</Text> Compartilhe o código com a pessoa que terá acesso
            </Paragraph>
            <Paragraph>
              <Text strong>Passo 3:</Text> A pessoa acessa o link ou insere o código
            </Paragraph>
            <Paragraph>
              <Text strong>Passo 4:</Text> Pronto! Agora ambos têm acesso total às finanças
            </Paragraph>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
