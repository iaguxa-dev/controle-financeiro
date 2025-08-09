import { Tag, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'

interface OwnershipTagProps {
  isOwn: boolean
  ownerName: string
  ownerEmail?: string
}

export default function OwnershipTag({ isOwn, ownerName, ownerEmail }: OwnershipTagProps) {
  if (isOwn) {
    return (
      <Tag color="blue" icon={<UserOutlined />}>
        Seus dados
      </Tag>
    )
  }

  return (
    <Tooltip title={ownerEmail || 'Dados compartilhados'}>
      <Tag color="orange" icon={<UserOutlined />}>
        {ownerName}
      </Tag>
    </Tooltip>
  )
}
