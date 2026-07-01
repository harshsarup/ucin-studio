import { useEffect, useState } from 'react'
import { ArrowLeft, UserPlus, Trash2, Check } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { getToken } from '@/api/auth'
import {
  listTeams, createTeam, listMembers, inviteMember, acceptInvite,
  setMemberRole, removeMember, type Team as TeamT, type Member,
} from '@/api/teams'

const inputCls =
  'w-full rounded-lg border border-canvas-border bg-canvas-surface px-3 py-2.5 text-[15px] text-fg outline-none focus:border-accent'

/** Studio/agency team management — create a team, invite by email, manage roles
 *  and seats. Reuses the authed API + the /customer/teams endpoints. */
export function Team() {
  const authed = !!getToken()
  const [team, setTeam] = useState<TeamT | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [lastInvite, setLastInvite] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const refresh = async (): Promise<void> => {
    setLoading(true)
    try {
      const teams = await listTeams()
      const t = teams[0] ?? null
      setTeam(t)
      setMembers(t ? await listMembers(t.id) : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authed) { setLoading(false); return }
    const token = new URLSearchParams(window.location.search).get('invite')
    void (async () => {
      if (token) { try { await acceptInvite(token) } catch { /* already used / invalid */ } }
      await refresh()
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onCreate = async (): Promise<void> => {
    setBusy(true)
    try { const t = await createTeam(name); setTeam(t); setMembers(await listMembers(t.id)) }
    finally { setBusy(false) }
  }

  const onInvite = async (): Promise<void> => {
    if (!team) return
    setBusy(true)
    try {
      const r = await inviteMember(team.id, inviteEmail, inviteRole)
      setLastInvite(`${window.location.origin}/team?invite=${r.invite_token}`)
      setInviteEmail('')
      setMembers(await listMembers(team.id))
    } finally { setBusy(false) }
  }

  const canManage = team?.role === 'owner' || team?.role === 'admin'

  return (
    <div className="min-h-screen">
      <header className="border-b border-canvas-border">
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-6">
          <a href="/" aria-label="UCIN Studio"><Logo /></a>
          <a href="/app" className="flex items-center gap-1.5 text-[14px] font-medium text-fg-subtle hover:text-fg">
            <ArrowLeft size={15} /> Back to app
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="eyebrow mb-3">Team</div>

        {!authed ? (
          <p className="text-lg text-fg-muted">Please <a href="/login" className="text-accent font-medium">sign in</a> to manage your team.</p>
        ) : loading ? (
          <p className="text-fg-subtle">Loading…</p>
        ) : !team ? (
          <>
            <h1 className="display mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>Create your team</h1>
            <p className="text-[15px] text-fg-muted mb-6 max-w-lg">Bring your shooters and editors onto one workspace — shared styles, rolled-up billing, one place to manage seats.</p>
            <div className="card p-6 flex items-end gap-3 max-w-lg">
              <div className="flex-1">
                <label className="text-[13px] font-medium text-fg">Team name</label>
                <input className={`${inputCls} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stories by Joseph Radhik" />
              </div>
              <button onClick={onCreate} disabled={busy || !name} className="btn-primary">Create</button>
            </div>
          </>
        ) : (
          <>
            <h1 className="display mb-1" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>{team.name}</h1>
            <p className="text-[14px] text-fg-subtle mb-8">{team.member_count} member{team.member_count !== 1 ? 's' : ''} · you're {team.role}</p>

            {/* Invite */}
            {canManage && (
              <div className="card p-6 mb-6">
                <div className="text-[15px] font-semibold text-fg mb-3 flex items-center gap-2"><UserPlus size={16} className="text-accent" /> Invite a member</div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <label className="text-[13px] font-medium text-fg">Email</label>
                    <input className={`${inputCls} mt-1.5`} type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="shooter@studio.com" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-fg">Role</label>
                    <select className={`${inputCls} mt-1.5`} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button onClick={onInvite} disabled={busy || !inviteEmail} className="btn-primary">Send invite</button>
                </div>
                {lastInvite && (
                  <div className="mt-4 rounded-lg border px-3 py-2.5 text-[13px]" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)' }}>
                    <div className="flex items-center gap-1.5 text-fg"><Check size={14} className="text-accent" /> Invite created — share this link:</div>
                    <code className="mono mt-1 block break-all text-fg-subtle">{lastInvite}</code>
                  </div>
                )}
              </div>
            )}

            {/* Members */}
            <div className="card divide-y divide-canvas-border">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <div className="text-[15px] text-fg truncate">{m.email}</div>
                    <div className="text-[12px] text-fg-faint">{m.status === 'invited' ? 'Invited — pending' : 'Active'}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {canManage && m.role !== 'owner' ? (
                      <select
                        className="rounded-lg border border-canvas-border bg-canvas-surface px-2 py-1 text-[13px] text-fg"
                        value={m.role}
                        onChange={(e) => { void setMemberRole(team.id, m.id, e.target.value).then(() => refresh()) }}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-[13px] text-fg-subtle capitalize">{m.role}</span>
                    )}
                    {canManage && m.role !== 'owner' && (
                      <button onClick={() => { void removeMember(team.id, m.id).then(() => refresh()) }} className="text-fg-faint hover:text-fg" aria-label="Remove">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
