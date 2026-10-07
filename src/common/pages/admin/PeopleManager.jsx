import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/authcontext';
import {
    useGetTenantRolesQuery,
    useGetTenantStaffQuery,
    useCreateTenantStaffMutation,
    useUpdateTenantStaffMutation,
    useDeleteTenantStaffMutation,
    useGetTenantUsersQuery,
    useCreateTenantUserMutation,
    useUpdateTenantUserMutation,
    useDeactivateTenantUserMutation,
    useRestoreTenantUserMutation,
} from '../../../api/services/tenantAdminApi';
import { PageHeader, PrimaryButton, GhostButton, Badge, Field, inputClass, Modal, TableShell, EmptyRow } from './ui';

const ADMIN_POWER = 100;

/**
 * Shared screen for "Staff" and "Users". Both are people who log in with
 * organisation + email + password, and both get their permissions from a role.
 *   kind = "staff" → employees (Principal, Teacher, Accountant …)
 *   kind = "user"  → everyone else who needs an account (e.g. students)
 */
const CONFIG = {
    staff: {
        title: 'Staff',
        subtitle: 'Employees who sign in to this organisation. What they can do depends on their role.',
        noun: 'staff member',
        perms: { create: 'CREATE_TENANT_STAFF', update: 'UPDATE_TENANT_STAFF', remove: 'DELETE_TENANT_STAFF' },
        removeLabel: 'Delete',
        removeConfirm: (p) => `Delete ${p.name || p.email}? They will no longer be able to sign in.`,
    },
    user: {
        title: 'Users',
        subtitle: 'Other people with an account in this organisation, such as students. What they can do depends on their role.',
        noun: 'user',
        perms: { create: 'USER_CREATE', update: 'USER_UPDATE', remove: 'USER_DELETE' },
        removeLabel: 'Deactivate',
        removeConfirm: (p) => `Deactivate ${p.name || p.email}? You can restore them later.`,
    },
};

const useKindApi = (kind, t) => {
    const staffQuery = useGetTenantStaffQuery(t, { skip: kind !== 'staff' });
    const usersQuery = useGetTenantUsersQuery(t, { skip: kind !== 'user' });
    const [createStaff, cs] = useCreateTenantStaffMutation();
    const [updateStaff, us] = useUpdateTenantStaffMutation();
    const [deleteStaff] = useDeleteTenantStaffMutation();
    const [createUser, cu] = useCreateTenantUserMutation();
    const [updateUser, uu] = useUpdateTenantUserMutation();
    const [deactivateUser] = useDeactivateTenantUserMutation();
    const [restoreUser] = useRestoreTenantUserMutation();

    if (kind === 'staff') {
        return {
            list: staffQuery.data?.staff || [],
            isLoading: staffQuery.isLoading,
            create: (body) => createStaff({ t, ...body }).unwrap(),
            update: (id, body) => updateStaff({ t, id, ...body }).unwrap(),
            remove: (id) => deleteStaff({ t, id }).unwrap(),
            setActive: (id, isActive) => updateStaff({ t, id, isActive }).unwrap(),
            saving: cs.isLoading || us.isLoading,
        };
    }
    return {
        list: usersQuery.data?.users || [],
        isLoading: usersQuery.isLoading,
        create: (body) => createUser({ t, ...body }).unwrap(),
        update: (id, body) => updateUser({ t, id, ...body }).unwrap(),
        remove: (id) => deactivateUser({ t, id }).unwrap(),
        setActive: (id, isActive) => (isActive ? restoreUser({ t, id }) : deactivateUser({ t, id })).unwrap(),
        saving: cu.isLoading || uu.isLoading,
    };
};

const PeopleManager = ({ kind }) => {
    const cfg = CONFIG[kind];
    const { tenantName: t } = useParams();
    const { user, hasPermission, isTenantAdmin } = useAuth();
    const myPower = isTenantAdmin ? ADMIN_POWER : (user?.power ?? 0);

    const api = useKindApi(kind, t);
    const { data: rolesData } = useGetTenantRolesQuery(t, { skip: !hasPermission('VIEW_TENANT_ROLES') });
    const allRoles = rolesData?.roles || [];
    // Only roles below your own level can be handed out
    const assignableRoles = allRoles.filter((r) => isTenantAdmin || r.power < myPower);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [form, setForm] = useState(null); // { id?, name, email, password, roleId }

    const people = useMemo(() => {
        const q = search.trim().toLowerCase();
        return api.list.filter((p) =>
            (!roleFilter || p.roleId === roleFilter) &&
            (!q || p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q))
        );
    }, [api.list, search, roleFilter]);

    const canManage = (person) => isTenantAdmin || (person.role?.power ?? 0) < myPower;
    const isSelf = (person) => person.id === user?.id;

    const submit = async (e) => {
        e.preventDefault();
        const body = { name: form.name, roleId: form.roleId };
        if (form.password) body.password = form.password;
        try {
            if (form.id) await api.update(form.id, body);
            else await api.create({ ...body, email: form.email });
            setForm(null);
        } catch {
            /* toast shown by the API layer */
        }
    };

    const remove = async (person) => {
        if (!window.confirm(cfg.removeConfirm(person))) return;
        try { await api.remove(person.id); } catch { /* toast shown */ }
    };

    const toggleActive = async (person) => {
        try { await api.setActive(person.id, !person.isActive); } catch { /* toast shown */ }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={cfg.title}
                subtitle={cfg.subtitle}
                action={hasPermission(cfg.perms.create) && (
                    <PrimaryButton
                        onClick={() => setForm({ name: '', email: '', password: '', roleId: assignableRoles.at(-1)?.id || '' })}
                        disabled={!assignableRoles.length}
                        title={!assignableRoles.length ? 'Create a role first' : undefined}
                    >
                        <PlusIcon className="w-4 h-4" /> Add {cfg.noun}
                    </PrimaryButton>
                )}
            />

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className={`${inputClass} pl-9`} placeholder="Search by name or email"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {allRoles.length > 0 && (
                    <select className={`${inputClass} sm:w-56`} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="">All roles</option>
                        {allRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                )}
            </div>

            <TableShell headers={['Name', 'Role', 'Status', kind === 'staff' ? 'Last sign-in' : 'Created', '']}>
                {api.isLoading && <EmptyRow colSpan={5}>Loading…</EmptyRow>}
                {!api.isLoading && people.length === 0 && (
                    <EmptyRow colSpan={5}>{api.list.length ? 'Nobody matches your search.' : `No ${cfg.noun}s yet.`}</EmptyRow>
                )}
                {people.map((p) => {
                    const manageable = canManage(p) && !isSelf(p);
                    return (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-5 py-3">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{p.name || '—'}</p>
                                <p className="text-xs text-slate-500">{p.email}</p>
                            </td>
                            <td className="px-5 py-3">
                                {p.role ? <Badge tone="blue">{p.role.name}</Badge> : <Badge>No role</Badge>}
                            </td>
                            <td className="px-5 py-3">
                                {p.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="red">Inactive</Badge>}
                            </td>
                            <td className="px-5 py-3 text-xs text-slate-500">
                                {kind === 'staff'
                                    ? (p.lastLogin ? new Date(p.lastLogin).toLocaleString() : 'Never')
                                    : new Date(p.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3">
                                <div className="flex justify-end gap-1">
                                    {hasPermission(cfg.perms.update) && manageable && (
                                        <>
                                            <GhostButton onClick={() => setForm({ id: p.id, name: p.name || '', email: p.email, password: '', roleId: p.roleId || '' })}>
                                                <PencilSquareIcon className="w-4 h-4" /> Edit
                                            </GhostButton>
                                            {(kind === 'staff' || !p.isActive) && (
                                                <GhostButton onClick={() => toggleActive(p)}>
                                                    <ArrowPathIcon className="w-4 h-4" /> {p.isActive ? 'Deactivate' : 'Activate'}
                                                </GhostButton>
                                            )}
                                        </>
                                    )}
                                    {hasPermission(cfg.perms.remove) && manageable && (kind === 'staff' || p.isActive) && (
                                        <GhostButton onClick={() => remove(p)} className="!text-red-600">
                                            <TrashIcon className="w-4 h-4" /> {cfg.removeLabel}
                                        </GhostButton>
                                    )}
                                    {isSelf(p) && <span className="text-[11px] text-slate-400 px-2">You</span>}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </TableShell>

            {form && (
                <Modal title={form.id ? `Edit ${cfg.noun}` : `Add ${cfg.noun}`} onClose={() => setForm(null)}>
                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Full name">
                            <input className={inputClass} required value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </Field>
                        <Field label="Email" hint={form.id ? 'Email cannot be changed.' : 'Used to sign in (with your organisation username).'}>
                            <input className={inputClass} type="email" required disabled={!!form.id} value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </Field>
                        <Field label={form.id ? 'New password' : 'Password'} hint={form.id ? 'Leave empty to keep the current password.' : 'At least 6 characters.'}>
                            <input className={inputClass} type="password" minLength={6} required={!form.id} value={form.password}
                                autoComplete="new-password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        </Field>
                        <Field label="Role" hint="Decides what this person can see and do.">
                            <select className={inputClass} required value={form.roleId}
                                onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
                                <option value="" disabled>Select a role…</option>
                                {assignableRoles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name} (power {r.power})</option>
                                ))}
                            </select>
                        </Field>
                        <div className="flex justify-end gap-2 pt-2">
                            <GhostButton type="button" onClick={() => setForm(null)}>Cancel</GhostButton>
                            <PrimaryButton type="submit" disabled={api.saving}>
                                {form.id ? 'Save changes' : `Add ${cfg.noun}`}
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default PeopleManager;
