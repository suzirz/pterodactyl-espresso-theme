import React, { useEffect, useMemo, useState } from 'react';
import {
    faMicrochip,
    faMemory,
    faHdd,
    faNetworkWired,
    faCopy,
    faCheck,
    faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import styled from 'styled-components/macro';
import copy from 'copy-to-clipboard';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;

const SideRail = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
`;

const AddressHeroCard = styled.div`
    background: linear-gradient(135deg, rgba(191, 168, 158, 0.12) 0%, rgba(24, 21, 20, 0.95) 100%);
    border: 1px solid rgba(191, 168, 158, 0.35);
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: #BFA89E;
        background: linear-gradient(135deg, rgba(191, 168, 158, 0.18) 0%, rgba(37, 33, 30, 0.95) 100%);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
    }

    &::after {
        content: '';
        position: absolute;
        right: -15px;
        bottom: -15px;
        width: 90px;
        height: 90px;
        background: radial-gradient(circle, rgba(191, 168, 158, 0.15) 10%, transparent 70%);
        pointer-events: none;
    }
`;

const AddressHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #BFA89E;
`;

const AddressTitle = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;

const AddressString = styled.div`
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #EBF5EE;
    word-break: break-all;
    margin: 4px 0 2px;
`;

const AddressSubtitle = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 11.5px;
    color: #8B786D;
`;

const MetricCard = styled.div`
    background: #141211;
    border: 1px solid rgba(139, 120, 109, 0.2);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: all 0.2s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.4);
        background: #181514;
    }
`;

const MetricHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #8B786D;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
`;

const MetricValue = styled.div`
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #EBF5EE;
    letter-spacing: -0.01em;
`;

const MetricSub = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 11.5px;
    color: #8B786D;
`;

const NetLegends = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    color: #8B786D;
`;

const LegendItem = styled.span<{ $color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 5px;

    &::before {
        content: '';
        width: 10px;
        height: 3px;
        border-radius: 2px;
        background-color: ${(props) => props.$color};
    }
`;

const formatRuntime = (uptimeMs: number, status: string | null): string => {
    if (status === 'offline' || !status) return 'Offline';
    if (status === 'starting') return 'Starting...';
    if (status === 'stopping') return 'Stopping...';
    if (uptimeMs <= 0) return '0s';

    const totalSeconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};

export default () => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });
    const [uptimeBase, setUptimeBase] = useState<{ ms: number; receivedAt: number }>({ ms: 0, receivedAt: 0 });
    const [now, setNow] = useState<number>(Date.now());
    const [copied, setCopied] = useState(false);

    const status = ServerContext.useStoreState((state) => state.status.value);
    const server = ServerContext.useStoreState((state) => state.server.data!);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const limits = server.limits;

    const allocation = server.allocations.find((alloc) => alloc.isDefault) || server.allocations[0];
    const isDemo = (window as any).PterodactylUser?.username === 'demo' || (window as any).PterodactylUser?.email === 'demo@bytenodes.id';
    const rawHost = (allocation?.alias && allocation.alias !== '0.0.0.0')
        ? allocation.alias
        : (allocation?.ip && allocation.ip !== '0.0.0.0' ? allocation.ip : server?.sftpDetails?.ip);
    const allocHost = isDemo ? '0.0.0.0' : (rawHost || '0.0.0.0');
    const fullAddress = allocation ? `${allocHost}:${allocation.port}` : 'Unavailable';

    // Live continuous second ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!connected || !instance) return;
        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        setStats({
            memory: values.memory_bytes,
            cpu: values.cpu_absolute,
            disk: values.disk_bytes,
            uptime: values.uptime || 0,
            tx: values.network?.tx_bytes || 0,
            rx: values.network?.rx_bytes || 0,
        });

        if (values.uptime !== undefined && values.uptime !== null) {
            setUptimeBase({ ms: values.uptime, receivedAt: Date.now() });
        }
    });

    const liveUptimeMs = useMemo(() => {
        if (status !== 'running' || uptimeBase.ms <= 0) {
            return status === 'running' ? stats.uptime : 0;
        }
        const delta = Math.max(0, now - uptimeBase.receivedAt);
        return uptimeBase.ms + delta;
    }, [status, uptimeBase, now, stats.uptime]);

    const cpuCores = useMemo(() => {
        if (!limits.cpu) return 'unlimited';
        const cores = limits.cpu / 100;
        return `${cores} ${cores === 1 ? 'core' : 'cores'}`;
    }, [limits.cpu]);

    const handleCopy = () => {
        copy(fullAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SideRail>
            <AddressHeroCard onClick={handleCopy} title={'Click to copy address'}>
                <AddressHeader>
                    <AddressTitle>
                        Copy address
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    </AddressTitle>
                </AddressHeader>
                <AddressString>{fullAddress}</AddressString>
                <AddressSubtitle>Point your client here to connect.</AddressSubtitle>
            </AddressHeroCard>

            <MetricCard>
                <MetricHeader>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 13, color: '#BFA89E' }} />
                    Runtime
                </MetricHeader>
                <MetricValue>{formatRuntime(liveUptimeMs, status)}</MetricValue>
                {status === 'running' ? (
                    <MetricSub style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#52b788',
                                boxShadow: '0 0 6px #52b788',
                                display: 'inline-block',
                            }}
                        />
                        Server is online
                    </MetricSub>
                ) : status === 'starting' ? (
                    <MetricSub style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#74a892',
                                display: 'inline-block',
                            }}
                        />
                        Booting up system...
                    </MetricSub>
                ) : status === 'stopping' ? (
                    <MetricSub style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#dd9754',
                                display: 'inline-block',
                            }}
                        />
                        Shutting down...
                    </MetricSub>
                ) : (
                    <MetricSub style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#8B786D',
                                display: 'inline-block',
                            }}
                        />
                        Server is stopped
                    </MetricSub>
                )}
            </MetricCard>

            <MetricCard>
                <MetricHeader>
                    <FontAwesomeIcon icon={faMicrochip} style={{ fontSize: 13, color: '#BFA89E' }} />
                    CPU
                </MetricHeader>
                <MetricValue>{status === 'offline' ? '0.0%' : `${stats.cpu.toFixed(1)}%`}</MetricValue>
                <MetricSub>of {cpuCores}</MetricSub>
            </MetricCard>

            <MetricCard>
                <MetricHeader>
                    <FontAwesomeIcon icon={faMemory} style={{ fontSize: 13, color: '#BFA89E' }} />
                    Memory
                </MetricHeader>
                <MetricValue>{status === 'offline' ? '0 MB' : bytesToString(stats.memory)}</MetricValue>
                <MetricSub>of {limits.memory ? bytesToString(mbToBytes(limits.memory)) : 'Unlimited'}</MetricSub>
            </MetricCard>

            <MetricCard>
                <MetricHeader>
                    <FontAwesomeIcon icon={faHdd} style={{ fontSize: 13, color: '#BFA89E' }} />
                    Disk
                </MetricHeader>
                <MetricValue>{bytesToString(stats.disk)}</MetricValue>
                <MetricSub>of {limits.disk ? bytesToString(mbToBytes(limits.disk)) : 'Unlimited'}</MetricSub>
            </MetricCard>

            <MetricCard>
                <MetricHeader>
                    <FontAwesomeIcon icon={faNetworkWired} style={{ fontSize: 13, color: '#BFA89E' }} />
                    Network
                </MetricHeader>
                <MetricValue>
                    {status === 'offline'
                        ? '0 B/s   0 B/s'
                        : `${bytesToString(stats.rx)}/s   ${bytesToString(stats.tx)}/s`}
                </MetricValue>
                <NetLegends>
                    <LegendItem $color={'#BFA89E'}>In</LegendItem>
                    <LegendItem $color={'#34D399'}>Out</LegendItem>
                </NetLegends>
            </MetricCard>
        </SideRail>
    );
};
