import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { StaffForm } from '../../components/admin/StaffForm'
import { Toast } from '../../components/common/Toast'
import type { RegisterRequest } from '../../types'
import { authApi } from '../../api/auth'
import { validateRegisterStaff } from '../../utils/validators'

const initial: RegisterRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: 'MANAGER',
}

export function RegisterPage() {
  const nav = useNavigate()
  const [form, setForm] = useState<RegisterRequest>(initial)
  const [toast, setToast] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    setErr(null)
    const v = validateRegisterStaff(form)
    if (v) {
      setErr(v)
      return
    }
    setLoading(true)
    try {
      const body: RegisterRequest = {
        ...form,
        phoneNumber: form.phoneNumber?.trim() ? form.phoneNumber.trim() : '',
      }
      await authApi.register(body)
      setToast('User created')
      setForm(initial)
      window.setTimeout(() => nav('/admin/staff'), 800)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Register staff"
        subtitle="Super admin only — create manager, waiter, kitchen, bar, or cashier accounts."
      />
      <div className="max-w-xl rounded-2xl border border-deus-border bg-white p-6 shadow-sm">
        <StaffForm value={form} onChange={setForm} />
        {err && <p className="mt-3 text-sm text-deus-danger">{err}</p>}
        <button
          type="button"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-deus-primary py-3 text-white disabled:opacity-50"
          onClick={submit}
        >
          {loading ? 'Saving…' : 'Create user'}
        </button>
      </div>
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}
