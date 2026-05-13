import { PageHeader } from '../../components/common/PageHeader'

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="Settings" />
      <p className="text-sm text-deus-muted">Profile and notification preferences.</p>
    </div>
  )
}
