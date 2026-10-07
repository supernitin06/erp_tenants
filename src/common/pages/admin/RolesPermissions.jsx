import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusIcon, PencilSquareIcon, TrashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/authcontext';
import {
    useGetTenantRolesQuery,
    useCreateTenantRoleMutation,
    useUpdateTenantRoleMutation,
    useDeleteTenantRoleMutation,
    useGetTenantPermissionsQuery,
    useSetRolePermissionsMutation,
} from '../../../api/services/tenantAdminApi';
import { PageHeader, Card, PrimaryButton, GhostButton, Badge, Field, inputClass, Modal } from './ui';

const ADMIN_POWER = 100;

/**
 * Roles & Permissions
 * Left: the organisation's roles (highest power first).
 * Right: the permissions of the selected role, grouped by area, with checkboxes.
 *
 * Rules (enforced by the backend too):
 *  - power is 1-99; the organisation admin account is 100
 *  - staff can only create / edit roles with power below their own
 */
const RolesPermissions = () => {
    const { tenantName: t } = useParams();
    const { user, hasPermission, isTenantAdmin } = useAuth();
    const myPower = isTenantAdmin ? ADMIN_POWER : (user?.power ?? 0);

    const { data: rolesData, isLoading: rolesLoading } = useGetTenantRolesQuery(t);
    const { data: permData, isLoading: permsLoading } = useGetTenantPermissionsQuery(t, {
        skip: !hasPermission('VIEW_TENANT_PERMISSIONS'),
    });
    const [createRole, { isLoading: creating }] = useCreateTenantRoleMutation();
    const [updateRole, { isLoading: updating }] = useUpdateTenantRoleMutation();
    const [deleteRole] = useDeleteTenantRoleMutation();
    const [setRolePermissions, { isLoading: saving }] = useSetRolePermissionsMutation();

    const roles = rolesData?.roles || [];
    const groups = permData?.groups || [];

    const [selectedId, setSelectedId] = useState(null);
    const [draft, setDraft] = useState(new Set());
    const [form, setForm] = useState(null); // { id?, name, power }

    const selected = roles.find((r) => r.id === selectedId) || roles[0];
    const savedIds = useMemo(
        () => new Set((selected?.permissions || []).map((p) => p.permissionId)),
        [selected]
    );

    // Reset the checkbox draft whenever another role is selected / data reloads
    useEffect(() => {
        setDraft(new Set(savedIds));
    }, [savedIds]);

    const canEditRole = (role) => isTenantAdmin || role.power < myPower;
    const canAssign = hasPermission('ASSIGN_TENANT_PERMISSIONS') && selected && canEditRole(selected);
    const isDirty = draft.size !== savedIds.size || [...draft].some((id) => !savedIds.has(id));

    const toggle = (id) => {
        setDraft((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleGroup = (group, on) => {
        setDraft((prev) => {
            const next = new Set(prev);
            group.permissions.forEach((p) => (on ? next.add(p.id) : next.delete(p.id)));
            return next;
        });
    };

    const savePermissions = async () => {
        try {
            await setRolePermissions({ t, roleId: selected.id, permissions: [...draft] }).unwrap();
        } catch {
            /* toast shown by the API layer */
        }
    };

    const submitRole = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await updateRole({ t, id: form.id, name: form.name, power: Number(form.power) }).unwrap();
            } else {
                const res = await createRole({ t, name: form.name, power: Number(form.power) }).unwrap();
                setSelectedId(res.role?.id);
            }
            setForm(null);
        } catch {
            /* toast shown by the API layer */
        }
    };

    const removeRole = async (role) => {
        if (!window.confirm(`Delete the role "${role.name}"?`)) return;
        try {
            await deleteRole({ t, id: role.id }).unwrap();
            setSelectedId(null);
        } catch {
            /* toast shown by the API layer */
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles & Permissions"
                subtitle="A role is a job title (e.g. Teacher). Tick what each role is allowed to do — everyone with that role gets exactly those permissions."
                action={hasPermission('CREATE_TENANT_ROLE') && (
                    <PrimaryButton onClick={() => setForm({ name: '', power: Math.min(10, myPower - 1) })}>
                        <PlusIcon className="w-4 h-4" /> New role
                    </PrimaryButton>
                )}
            />

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                {/* Roles list */}
                <Card className="p-3 h-fit">
                    {rolesLoading && <p className="p-4 text-sm text-slate-500">Loading roles…</p>}
                    {!rolesLoading && roles.length === 0 && (
                        <p className="p-4 text-sm text-slate-500">No roles yet. Create the first one.</p>
                    )}
                    <ul className="space-y-1">
                        {roles.map((role) => {
                            const active = selected?.id === role.id;
                            return (
                                <li key={role.id}>
                                    <button
                                        onClick={() => setSelectedId(role.id)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl transition ${active
                                            ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`font-semibold text-sm ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {role.name}
                                            </span>
                                            <Badge tone="blue">Power {role.power}</Badge>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                            {role.permissions?.length || 0} permissions · {role._count?.staffs || 0} staff · {role._count?.users || 0} users
                                        </p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </Card>

                {/* Permissions of the selected role */}
                <Card className="p-5">
                    {!selected ? (
                        <p className="text-sm text-slate-500">Select a role to see its permissions.</p>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <ShieldCheckIcon className="w-5 h-5 text-emerald-500" /> {selected.name}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {canEditRole(selected)
                                            ? 'Changes apply to everyone with this role as soon as you save.'
                                            : 'This role is at or above your own level, so you can only view it.'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {hasPermission('UPDATE_TENANT_ROLE') && canEditRole(selected) && (
                                        <GhostButton onClick={() => setForm({ id: selected.id, name: selected.name, power: selected.power })}>
                                            <PencilSquareIcon className="w-4 h-4" /> Edit
                                        </GhostButton>
                                    )}
                                    {hasPermission('DELETE_TENANT_ROLE') && canEditRole(selected) && (
                                        <GhostButton onClick={() => removeRole(selected)} className="!text-red-600">
                                            <TrashIcon className="w-4 h-4" /> Delete
                                        </GhostButton>
                                    )}
                                </div>
                            </div>

                            {!hasPermission('VIEW_TENANT_PERMISSIONS') && (
                                <p className="text-sm text-slate-500">Your role cannot view permissions.</p>
                            )}
                            {permsLoading && <p className="text-sm text-slate-500">Loading permissions…</p>}

                            <div className="grid gap-5 xl:grid-cols-2">
                                {groups.map((group) => {
                                    const allOn = group.permissions.every((p) => draft.has(p.id));
                                    return (
                                        <div key={group.label} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{group.label}</h3>
                                                {canAssign && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGroup(group, !allOn)}
                                                        className="text-[11px] font-semibold text-emerald-600 hover:underline"
                                                    >
                                                        {allOn ? 'Clear all' : 'Select all'}
                                                    </button>
                                                )}
                                            </div>
                                            <ul className="space-y-2">
                                                {group.permissions.map((p) => (
                                                    <li key={p.id}>
                                                        <label className={`flex items-start gap-2.5 ${canAssign ? 'cursor-pointer' : 'cursor-default opacity-80'}`}>
                                                            <input
                                                                type="checkbox"
                                                                className="mt-0.5 w-4 h-4 accent-emerald-600"
                                                                checked={draft.has(p.id)}
                                                                disabled={!canAssign}
                                                                onChange={() => toggle(p.id)}
                                                            />
                                                            <span>
                                                                <span className="block text-sm text-slate-700 dark:text-slate-200">{p.name}</span>
                                                                <span className="block text-[10px] font-mono text-slate-400">{p.key}</span>
                                                            </span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>

                            {canAssign && (
                                <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
                                    {isDirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
                                    <GhostButton disabled={!isDirty} onClick={() => setDraft(new Set(savedIds))}>Reset</GhostButton>
                                    <PrimaryButton disabled={!isDirty || saving} onClick={savePermissions}>
                                        {saving ? 'Saving…' : 'Save permissions'}
                                    </PrimaryButton>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>

            {form && (
                <Modal title={form.id ? 'Edit role' : 'New role'} onClose={() => setForm(null)}>
                    <form onSubmit={submitRole} className="space-y-4">
                        <Field label="Role name" hint="Saved in capitals, e.g. TEACHER">
                            <input className={inputClass} required value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Librarian" />
                        </Field>
                        <Field label="Power (1 – 99)" hint={`Higher power = more senior. Must be lower than yours (${myPower}).`}>
                            <input className={inputClass} type="number" min={1} max={Math.min(99, myPower - 1)} required
                                value={form.power} onChange={(e) => setForm({ ...form, power: e.target.value })} />
                        </Field>
                        <div className="flex justify-end gap-2 pt-2">
                            <GhostButton type="button" onClick={() => setForm(null)}>Cancel</GhostButton>
                            <PrimaryButton type="submit" disabled={creating || updating}>
                                {form.id ? 'Save role' : 'Create role'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default RolesPermissions;
