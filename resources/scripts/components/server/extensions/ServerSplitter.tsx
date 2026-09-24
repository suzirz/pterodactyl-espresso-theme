import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import http from '@/api/http';
import { NotFound } from '@/components/elements/ScreenBlock';
import { Dialog } from '@/components/elements/dialog';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import styled, { keyframes, css } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMicrochip,
    faMemory,
    faHdd,
    faServer,
    faPlus,
    faTimes,
    faNetworkWired,
    faDatabase,
    faTrashAlt,
    faExternalLinkAlt,
    faBoxes,
    faChevronDown,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';

interface Split {
    id: number;
    name: string;
    child_uuid: string;
    cpu: number;
    memory: number;
    disk: number;
    db_limit: number;
    alloc_limit: number;
    status: string;
    created_at: string;
    allocation?: {
        ip: string;
        port: number;
        alias: string | null;
    };
}

interface Limits {
    cpu: { used: number; total: number };
    memory: { used: number; total: number };
    disk: { used: number; total: number };
    databases: { used: number; total: number };
    allocations: { used: number; total: number };
    backups: { used: number; total: number };
    split_limit: number;
    splits_count: number;
    include_disk: boolean;
    display_reserved: boolean;
    min_limits: { cpu: number; memory: number; disk: number; alloc: number };
}

interface AllocationItem {
    id: number;
    ip: string;
    port: number;
    alias: string | null;
}

interface EggItem {
    egg_id: number;
    egg_name: string;
    nest_id: number;
    nest_name: string;
}

const formatRAM = (mb: number) => {
    if (mb === undefined || mb === null) return '0 MiB';
    if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GiB';
    return mb + ' MiB';
};

const formatDisk = (mb: number) => {
    if (mb === undefined || mb === null) return '0 MiB';
    if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GiB';
    return mb + ' MiB';
};

// --- Animations ---
const slideDown = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-12px) scale(0.98);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const dropdownFade = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-6px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

// --- Styled Components ---
const FormContainer = styled.div`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.25);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 28px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
    animation: ${slideDown} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px 14px;
    background: #141211;
    border: 1px solid rgba(191, 168, 158, 0.22);
    border-radius: 8px;
    color: #EBF5EE;
    font-size: 13.5px;
    outline: none;
    box-sizing: border-box;
    font-family: 'Outfit', sans-serif;
    transition: all 0.18s ease;

    &:focus {
        border-color: #BFA89E;
        box-shadow: 0 0 0 2px rgba(191, 168, 158, 0.2);
    }
`;

const Label = styled.label`
    display: block;
    font-size: 11px;
    color: #8B786D;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
`;

const SplitCard = styled.div`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.18);
    border-radius: 12px;
    padding: 18px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    transition: all 0.2s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.35);
    }

    @media (max-width: 640px) {
        flex-direction: column;
        align-items: stretch;
        padding: 16px;
        gap: 14px;
    }
`;

const SplitCardInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;

    @media (max-width: 640px) {
        width: 100%;
        gap: 12px;
    }
`;

const SplitActions = styled.div`
    display: flex;
    gap: 10px;
    flex-shrink: 0;

    @media (max-width: 640px) {
        width: 100%;
        margin-top: 6px;

        & > a, & > button {
            flex: 1;
            justify-content: center;
            padding: 12px 14px;
            font-size: 13px;
        }
    }
`;

// --- Custom Styled Dropdown ---
const DropdownWrapper = styled.div`
    position: relative;
    width: 100%;
    user-select: none;
`;

const DropdownTrigger = styled.div<{ $open: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 14px;
    background: #141211;
    border: 1px solid ${(props) => (props.$open ? '#BFA89E' : 'rgba(191, 168, 158, 0.22)')};
    border-radius: 8px;
    color: #EBF5EE;
    font-size: 13.5px;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.18s ease;
    box-shadow: ${(props) => (props.$open ? '0 0 0 2px rgba(191, 168, 158, 0.2)' : 'none')};

    &:hover {
        border-color: #BFA89E;
    }

    .selected-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 8px;
    }

    .arrow-icon {
        color: #8B786D;
        font-size: 11px;
        transition: transform 0.2s ease;
        transform: ${(props) => (props.$open ? 'rotate(180deg)' : 'rotate(0)')};
        flex-shrink: 0;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.25);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    z-index: 50;
    max-height: 240px;
    overflow-y: auto;
    padding: 4px;
    animation: ${dropdownFade} 0.18s ease-out;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(191, 168, 158, 0.3);
        border-radius: 4px;
    }
`;

const DropdownOption = styled.div<{ $selected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    color: ${(props) => (props.$selected ? '#141211' : '#EBF5EE')};
    background: ${(props) => (props.$selected ? '#BFA89E' : 'transparent')};
    font-weight: ${(props) => (props.$selected ? '700' : '500')};
    cursor: pointer;
    transition: all 0.14s ease;

    &:hover {
        background: ${(props) => (props.$selected ? '#BFA89E' : 'rgba(191, 168, 158, 0.12)')};
        color: ${(props) => (props.$selected ? '#141211' : '#BFA89E')};
    }
`;

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = 'Select option' }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.value === value);

    return (
        <DropdownWrapper ref={containerRef}>
            <DropdownTrigger $open={open} onClick={() => setOpen(!open)}>
                <span className={'selected-text'}>{selectedOption ? selectedOption.label : placeholder}</span>
                <FontAwesomeIcon icon={faChevronDown} className={'arrow-icon'} />
            </DropdownTrigger>

            {open && (
                <DropdownMenu>
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <DropdownOption
                                key={opt.value}
                                $selected={isSelected}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <FontAwesomeIcon icon={faCheck} style={{ fontSize: '11px' }} />}
                            </DropdownOption>
                        );
                    })}
                </DropdownMenu>
            )}
        </DropdownWrapper>
    );
};

export default function ServerSplitter() {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const server = ServerContext.useStoreState(state => state.server.data!);
    const getServer = ServerContext.useStoreActions(actions => actions.server.getServer);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [splits, setSplits] = useState<Split[]>([]);
    const [limits, setLimits] = useState<Limits | null>(null);
    const [allocations, setAllocations] = useState<AllocationItem[]>([]);
    const [allowedEggs, setAllowedEggs] = useState<EggItem[]>([]);

    const [deleteSplit, setDeleteSplit] = useState<{ id: number; name: string } | null>(null);

    const [form, setForm] = useState({
        name: '',
        cpu: '25',
        memory: '1024',
        disk: '5120',
        db_limit: '0',
        alloc_limit: '0',
        allocation_id: '',
        egg_id: '',
    });

    const load = async () => {
        setFetching(true);
        try {
            const [splitsRes, limitsRes, allocsRes, eggsRes] = await Promise.all([
                http.get(`/api/client/servers/${uuid}/splits`),
                http.get(`/api/client/servers/${uuid}/splits/limits`),
                http.get(`/api/client/servers/${uuid}/splits/allocations`),
                http.get(`/api/client/servers/${uuid}/splits/eggs`),
            ]);
            setSplits(splitsRes.data.data || []);
            setLimits(limitsRes.data.data);

            const allocList = allocsRes.data.data || [];
            setAllocations(allocList);

            const eggList = eggsRes.data.data || [];
            setAllowedEggs(eggList);

            const ldata = limitsRes.data.data;
            const minCpu = ldata.min_limits?.cpu ?? 10;
            const minMem = ldata.min_limits?.memory ?? 1024;
            const minDisk = ldata.min_limits?.disk ?? 1024;
            const availCpu = Math.max(0, ldata.cpu.total - ldata.cpu.used - minCpu);
            const availMem = Math.max(0, ldata.memory.total - ldata.memory.used - minMem);
            const availDisk = Math.max(0, ldata.disk.total - ldata.disk.used - minDisk);
            const defaultCpu = Math.min(25, Math.floor(availCpu * 0.25)) || 10;
            const defaultMem = Math.min(1024, Math.floor(availMem * 0.25)) || minMem;
            const defaultDisk = Math.min(5120, Math.floor(availDisk * 0.5)) || minDisk;
            setForm(f => ({
                ...f,
                cpu: defaultCpu.toString(),
                memory: defaultMem.toString(),
                disk: defaultDisk.toString(),
                allocation_id: allocList[0]?.id.toString() || '',
                egg_id: eggList.find((e: EggItem) => e.egg_id === (server as any).eggId)?.egg_id.toString() || eggList[0]?.egg_id.toString() || '',
            }));
        } catch (e: any) {
            addFlash({ type: 'danger', key: 'splitter:load', message: 'Failed to load: ' + (e.response?.data?.error || e.message) });
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        clearFlashes('splitter');
        load();
    }, [uuid]);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearFlashes('splitter');
        try {
            await http.post(`/api/client/servers/${uuid}/splits`, {
                name: form.name,
                cpu: parseFloat(form.cpu),
                memory: parseInt(form.memory),
                disk: parseInt(form.disk),
                db_limit: parseInt(form.db_limit),
                alloc_limit: parseInt(form.alloc_limit),
                allocation_id: parseInt(form.allocation_id),
                egg_id: form.egg_id ? parseInt(form.egg_id) : undefined,
            });
            addFlash({ type: 'success', key: 'splitter:create', message: 'Split server created successfully! Parent resources updated.' });
            setShowForm(false);
            setForm({ name: '', cpu: '25', memory: '1024', disk: '5120', db_limit: '0', alloc_limit: '0', allocation_id: allocations[0]?.id.toString() || '', egg_id: allowedEggs[0]?.egg_id.toString() || '' });
            await getServer(uuid);
            await load();
        } catch (err: any) {
            addFlash({ type: 'danger', key: 'splitter:create', message: err.response?.data?.error || err.message });
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async () => {
        if (!deleteSplit) return;
        clearFlashes('splitter');
        try {
            await http.delete(`/api/client/servers/${uuid}/splits/${deleteSplit.id}`);
            addFlash({ type: 'success', key: 'splitter:delete', message: `"${deleteSplit.name}" deleted. Master server resources restored.` });
            setDeleteSplit(null);
            await getServer(uuid);
            await load();
        } catch (err: any) {
            addFlash({ type: 'danger', key: 'splitter:delete', message: err.response?.data?.error || err.message });
        }
    };

    const cardStyle: React.CSSProperties = {
        background: '#181514',
        border: '1px solid rgba(191, 168, 158, 0.18)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
    };

    if (fetching && !limits) {
        return (
            <ServerContentBlock title={'Server Splitter'}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <div style={{ color: '#BFA89E', fontSize: '14px', fontWeight: 600 }}>Loading Splitter...</div>
                </div>
            </ServerContentBlock>
        );
    }

    if (!limits) {
        return (
            <ServerContentBlock title={'Server Splitter'}>
                <div style={{ fontFamily: 'Outfit', color: '#EBF5EE', padding: '24px 0' }}>
                    <FlashMessageRender byKey="splitter" />
                    <div style={{ background: '#181514', border: '1px solid rgba(191, 168, 158, 0.22)', borderRadius: '12px', padding: '36px', textAlign: 'center' }}>
                        <div style={{ color: '#BFA89E', fontSize: '32px', marginBottom: '12px' }}>
                            <FontAwesomeIcon icon={faBoxes} />
                        </div>
                        <h4 style={{ margin: 0, color: '#EBF5EE', fontWeight: 700, fontSize: '17px' }}>Splitter Tidak Tersedia</h4>
                        <p style={{ margin: '8px auto 20px', fontSize: '13px', color: '#8B786D', maxWidth: '420px' }}>
                            Fitur Server Splitter tidak aktif untuk server ini atau server bukan server utama (master package).
                        </p>
                        <button
                            onClick={load}
                            style={{ background: '#BFA89E', color: '#141211', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            </ServerContentBlock>
        );
    }

    const cpuPercent = limits.cpu.total > 0 ? (limits.cpu.used / limits.cpu.total) * 100 : 0;
    const ramPercent = limits.memory.total > 0 ? (limits.memory.used / limits.memory.total) * 100 : 0;
    const diskPercent = limits.disk.total > 0 ? (limits.disk.used / limits.disk.total) * 100 : 0;

    const allocationOptions = allocations.map((alloc) => ({
        value: alloc.id.toString(),
        label: `${alloc.alias || alloc.ip}:${alloc.port}`,
    }));

    const eggOptions = allowedEggs.map((egg) => ({
        value: egg.egg_id.toString(),
        label: `[${egg.nest_name}] ${egg.egg_name}`,
    }));

    return (
        <ServerContentBlock title={'Server Splitter'}>
            <div style={{ fontFamily: 'Outfit, sans-serif', color: '#EBF5EE' }}>
                <FlashMessageRender byKey="splitter" />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#EBF5EE', letterSpacing: '-0.02em' }}>
                            Server Splitter
                        </h2>
                        <p style={{ color: '#8B786D', marginTop: '4px', fontSize: '0.875rem' }}>
                            Create and manage sub-servers carved out of your parent server package.
                        </p>
                    </div>
                    {(limits.split_limit === 0 || limits.splits_count < limits.split_limit) && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                background: showForm ? '#25211e' : '#BFA89E',
                                color: showForm ? '#EBF5EE' : '#141211',
                                border: showForm ? '1px solid rgba(191, 168, 158, 0.3)' : '1px solid #BFA89E',
                                borderRadius: '8px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: showForm ? 'none' : '0 2px 10px rgba(191, 168, 158, 0.25)',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            <FontAwesomeIcon icon={showForm ? faTimes : faPlus} />
                            <span>{showForm ? 'Close Form' : 'Create Split'}</span>
                        </button>
                    )}
                </div>

                {/* Progress Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                    {/* CPU Card */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                            <div>
                                <Label>Assigned CPU</Label>
                                <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#EBF5EE' }}>
                                    {limits.cpu.used}% <span style={{ fontSize: '13px', fontWeight: 500, color: '#8B786D' }}>/ {limits.cpu.total}%</span>
                                </h3>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(191, 168, 158, 0.12)', border: '1px solid rgba(191, 168, 158, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA89E' }}>
                                <FontAwesomeIcon icon={faMicrochip} style={{ fontSize: '17px' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ width: '100%', height: '8px', background: '#12100f', borderRadius: '6px', border: '1px solid rgba(191, 168, 158, 0.12)', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{ width: `${Math.min(100, cpuPercent)}%`, height: '100%', background: '#BFA89E', borderRadius: '6px', transition: 'width 0.3s ease' }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#8B786D', fontWeight: 500 }}>{cpuPercent.toFixed(0)}% of total pool allocated</span>
                        </div>
                    </div>

                    {/* Memory Card */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                            <div>
                                <Label>Assigned Memory</Label>
                                <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#EBF5EE' }}>
                                    {formatRAM(limits.memory.used)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#8B786D' }}>/ {formatRAM(limits.memory.total)}</span>
                                </h3>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(191, 168, 158, 0.12)', border: '1px solid rgba(191, 168, 158, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA89E' }}>
                                <FontAwesomeIcon icon={faMemory} style={{ fontSize: '17px' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ width: '100%', height: '8px', background: '#12100f', borderRadius: '6px', border: '1px solid rgba(191, 168, 158, 0.12)', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{ width: `${Math.min(100, ramPercent)}%`, height: '100%', background: '#BFA89E', borderRadius: '6px', transition: 'width 0.3s ease' }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#8B786D', fontWeight: 500 }}>{ramPercent.toFixed(0)}% of total pool allocated</span>
                        </div>
                    </div>

                    {/* Disk Card */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                            <div>
                                <Label>Assigned Disk</Label>
                                <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#EBF5EE' }}>
                                    {formatDisk(limits.disk.used)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#8B786D' }}>/ {formatDisk(limits.disk.total)}</span>
                                </h3>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(191, 168, 158, 0.12)', border: '1px solid rgba(191, 168, 158, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA89E' }}>
                                <FontAwesomeIcon icon={faHdd} style={{ fontSize: '17px' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ width: '100%', height: '8px', background: '#12100f', borderRadius: '6px', border: '1px solid rgba(191, 168, 158, 0.12)', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{ width: `${Math.min(100, diskPercent)}%`, height: '100%', background: '#BFA89E', borderRadius: '6px', transition: 'width 0.3s ease' }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#8B786D', fontWeight: 500 }}>
                                {limits.include_disk ? `${diskPercent.toFixed(0)}% of total pool allocated` : 'Disk limit tracking disabled by admin'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Create Form with Smooth Opening Animation & Custom Select Dropdown */}
                {showForm && (
                    <FormContainer>
                        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#BFA89E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FontAwesomeIcon icon={faPlus} /> Create New Split Server
                        </h3>
                        <form onSubmit={create}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '22px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Label>Server Name</Label>
                                    <InputField
                                        type="text"
                                        value={form.name}
                                        onChange={e => { const val = e.target.value; setForm(f => ({ ...f, name: val })); }}
                                        placeholder="e.g. Bungeecord Proxy"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Primary Port / Allocation</Label>
                                    {allocations.length === 0 ? (
                                        <div style={{ fontSize: '12.5px', color: '#ef4444', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)' }}>
                                            No unassigned ports available on node.
                                        </div>
                                    ) : (
                                        <CustomSelect
                                            value={form.allocation_id}
                                            onChange={val => setForm(f => ({ ...f, allocation_id: val }))}
                                            options={allocationOptions}
                                            placeholder="Select Port Allocation"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label>Server Type (Egg)</Label>
                                    <CustomSelect
                                        value={form.egg_id}
                                        onChange={val => setForm(f => ({ ...f, egg_id: val }))}
                                        options={eggOptions}
                                        placeholder="Select Server Type (Egg)"
                                    />
                                </div>
                                {([
                                    { label: 'CPU Allocation (%)', key: 'cpu', hint: `Avail: ${Math.max(0, limits.cpu.total - limits.cpu.used - (limits.min_limits?.cpu ?? 10)).toFixed(0)}%`, min: '1' },
                                    { label: 'RAM Allocation (MiB)', key: 'memory', hint: `Avail: ${Math.max(0, limits.memory.total - limits.memory.used - (limits.min_limits?.memory ?? 1024))} MiB`, min: '128' },
                                    { label: 'Disk Space (MiB)', key: 'disk', hint: limits.include_disk ? `Avail: ${Math.max(0, limits.disk.total - limits.disk.used - (limits.min_limits?.disk ?? 1024))} MiB` : 'Independent', min: '512' },
                                    { label: 'Databases Limit', key: 'db_limit', hint: `Avail: ${limits.databases.total - limits.databases.used}`, min: '0' },
                                    { label: 'Extra Ports Limit', key: 'alloc_limit', hint: `Avail: ${limits.allocations.total - limits.allocations.used}`, min: '0' },
                                ] as const).map(({ label, key, hint, min }) => (
                                    <div key={key}>
                                        <Label>
                                            {label}
                                            <span style={{ color: '#BFA89E', marginLeft: '6px', fontWeight: 500, textTransform: 'none' }}>({hint})</span>
                                        </Label>
                                        <InputField
                                            type="number"
                                            value={(form as any)[key]}
                                            onChange={e => { const val = e.target.value; setForm(f => ({ ...f, [key]: val })); }}
                                            required
                                            min={min}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(191, 168, 158, 0.15)', paddingTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{ background: '#25211e', border: '1px solid rgba(191, 168, 158, 0.25)', color: '#8B786D', borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.18s ease' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || allocations.length === 0}
                                    style={{ background: '#BFA89E', border: 'none', color: '#141211', borderRadius: '8px', padding: '9px 22px', cursor: (loading || allocations.length === 0) ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '13px', boxShadow: '0 2px 10px rgba(191, 168, 158, 0.25)', opacity: (loading || allocations.length === 0) ? 0.6 : 1, transition: 'all 0.18s ease' }}
                                >
                                    {loading ? 'Creating...' : 'Confirm & Create'}
                                </button>
                            </div>
                        </form>
                    </FormContainer>
                )}

                {/* Servers List */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                    <h4 style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#8B786D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Servers Configuration
                    </h4>

                    {/* Master Server */}
                    <div style={{ background: '#181514', border: '1px solid rgba(191, 168, 158, 0.2)', borderRadius: '12px', padding: '18px 22px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: '#BFA89E', fontSize: '24px' }}>
                                <FontAwesomeIcon icon={faServer} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 800, color: '#EBF5EE', fontSize: '15px' }}>{server.name}</span>
                                    <span style={{ fontSize: '9.5px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: '#25211e', color: '#BFA89E', border: '1px solid rgba(191, 168, 158, 0.35)', textTransform: 'uppercase' }}>
                                        Master
                                    </span>
                                    <span style={{ fontSize: '9.5px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: 'rgba(191, 168, 158, 0.12)', color: '#EBF5EE', border: '1px solid rgba(191, 168, 158, 0.25)', textTransform: 'uppercase' }}>
                                        Parent
                                    </span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#8B786D', display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px' }}>
                                    <span><strong style={{ color: '#BFA89E' }}>CPU:</strong> {(server as any).cpu ?? server.limits?.cpu ?? 0}%</span>
                                    <span><strong style={{ color: '#BFA89E' }}>RAM:</strong> {formatRAM((server as any).memory ?? server.limits?.memory ?? 0)}</span>
                                    <span><strong style={{ color: '#BFA89E' }}>Disk:</strong> {formatDisk((server as any).disk ?? server.limits?.disk ?? 0)}</span>
                                    <span><strong style={{ color: '#BFA89E' }}>DBs:</strong> {(server as any).database_limit ?? server.featureLimits?.databases ?? 0}</span>
                                    <span><strong style={{ color: '#BFA89E' }}>Ports:</strong> {(server as any).allocation_limit ?? server.featureLimits?.allocations ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Split Servers */}
                    {splits.length === 0 ? (
                        <div style={{ background: '#181514', border: '1px dashed rgba(191, 168, 158, 0.22)', borderRadius: '12px', padding: '36px', textAlign: 'center' }}>
                            <div style={{ color: '#8B786D', fontSize: '28px', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faBoxes} />
                            </div>
                            <h5 style={{ margin: 0, color: '#EBF5EE', fontWeight: 700, fontSize: '15px' }}>No Split Servers Created</h5>
                            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#8B786D' }}>Split resources to launch child containers from this master.</p>
                        </div>
                    ) : (
                        splits.map(split => (
                            <SplitCard key={split.id}>
                                <SplitCardInfo>
                                    <div style={{ color: '#BFA89E', fontSize: '24px', flexShrink: 0 }}>
                                        <FontAwesomeIcon icon={faServer} />
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 800, color: '#EBF5EE', fontSize: '15px' }}>{split.name}</span>
                                            <span style={{
                                                fontSize: '9.5px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700,
                                                background: split.status === 'running' ? 'rgba(34,197,94,0.15)' : '#25211e',
                                                color: split.status === 'running' ? '#22c55e' : '#8B786D',
                                                border: `1px solid ${split.status === 'running' ? 'rgba(34,197,94,0.35)' : 'rgba(191,168,158,0.2)'}`,
                                                textTransform: 'uppercase',
                                            }}>
                                                {split.status || 'offline'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12.5px', color: '#8B786D', display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px' }}>
                                            {split.allocation && (
                                                <span><FontAwesomeIcon icon={faNetworkWired} style={{ color: '#BFA89E', marginRight: '6px' }} />{split.allocation.alias || split.allocation.ip}:{split.allocation.port}</span>
                                            )}
                                            <span><FontAwesomeIcon icon={faMicrochip} style={{ color: '#BFA89E', marginRight: '6px' }} />{split.cpu}%</span>
                                            <span><FontAwesomeIcon icon={faMemory} style={{ color: '#BFA89E', marginRight: '6px' }} />{formatRAM(split.memory)}</span>
                                            <span><FontAwesomeIcon icon={faHdd} style={{ color: '#BFA89E', marginRight: '6px' }} />{formatDisk(split.disk)}</span>
                                            <span><FontAwesomeIcon icon={faDatabase} style={{ color: '#BFA89E', marginRight: '6px' }} />{split.db_limit} DBs</span>
                                        </div>
                                    </div>
                                </SplitCardInfo>
                                <SplitActions>
                                    <Link
                                        to={`/server/${split.child_uuid.slice(0, 8)}`}
                                        style={{ padding: '8px 18px', background: '#25211e', color: '#BFA89E', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(191, 168, 158, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '11px' }} />
                                        <span>Manage</span>
                                    </Link>
                                    <button
                                        onClick={() => setDeleteSplit({ id: split.id, name: split.name })}
                                        style={{ padding: '8px 18px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} style={{ fontSize: '11px' }} />
                                        <span>Delete</span>
                                    </button>
                                </SplitActions>
                            </SplitCard>
                        ))
                    )}
                </div>

                {/* Dialog Confirm */}
                <Dialog.Confirm
                    open={deleteSplit !== null}
                    onClose={() => setDeleteSplit(null)}
                    title={'Delete Split Server'}
                    confirm={'Delete'}
                    onConfirmed={executeDelete}
                >
                    Are you sure you want to delete <strong>{deleteSplit?.name}</strong>? This action cannot be undone. Parent server resources will be restored and restarted.
                </Dialog.Confirm>
            </div>
        </ServerContentBlock>
    );
}
