import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMicrochip,
    faMemory,
    faHdd,
    faServer,
    faArrowRight,
    faCopy,
    faCheck,
    faCube,
    faRobot,
    faCar,
    faCode,
    faGamepad,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import copy from 'copy-to-clipboard';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

interface ServerTypeMeta {
    type: string;
    label: string;
    icon: any;
    color: string;
    bg: string;
    border: string;
    glow: string;
}

const getServerTypeMeta = (server: Server): ServerTypeMeta => {
    const text = `${server.name || ''} ${server.description || ''} ${(server as any).eggName || ''} ${(server as any).nestName || ''}`.toLowerCase();

    // 1. SA-MP / GTA San Andreas / FiveM
    if (
        text.includes('samp') ||
        text.includes('sa-mp') ||
        text.includes('san andreas') ||
        text.includes('gta') ||
        text.includes('fivem')
    ) {
        return {
            type: 'samp',
            label: 'SA-MP',
            icon: faCar,
            color: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.3)',
            glow: 'rgba(245, 158, 11, 0.2)',
        };
    }

    // 2. Discord Bot / Bots
    if (
        text.includes('discord') ||
        text.includes('bot') ||
        (server as any).nestName?.toLowerCase().includes('bot') ||
        (server as any).eggName?.toLowerCase().includes('bot')
    ) {
        return {
            type: 'discord_bot',
            label: 'Discord Bot',
            icon: faRobot,
            color: '#5865F2',
            bg: 'rgba(88, 101, 242, 0.12)',
            border: 'rgba(88, 101, 242, 0.3)',
            glow: 'rgba(88, 101, 242, 0.25)',
        };
    }

    // 3. Minecraft (Paper, Purpur, Spigot, Forge, Fabric, Bedrock, Bungee, Velocity, SMP)
    if (
        text.includes('minecraft') ||
        text.includes('mc') ||
        text.includes('smp') ||
        text.includes('paper') ||
        text.includes('purpur') ||
        text.includes('spigot') ||
        text.includes('forge') ||
        text.includes('fabric') ||
        text.includes('bedrock') ||
        text.includes('bungee') ||
        text.includes('velocity') ||
        (server as any).nestName?.toLowerCase().includes('minecraft')
    ) {
        return {
            type: 'minecraft',
            label: 'Minecraft',
            icon: faCube,
            color: '#34D399',
            bg: 'rgba(52, 211, 153, 0.12)',
            border: 'rgba(52, 211, 153, 0.3)',
            glow: 'rgba(52, 211, 153, 0.2)',
        };
    }

    // 4. Web / API / Node / Python / DB
    if (
        text.includes('backend') ||
        text.includes('api') ||
        text.includes('web') ||
        text.includes('node') ||
        text.includes('python') ||
        text.includes('database') ||
        text.includes('mysql') ||
        text.includes('ai')
    ) {
        return {
            type: 'web',
            label: 'Node / Web',
            icon: faCode,
            color: '#06B6D4',
            bg: 'rgba(6, 182, 212, 0.12)',
            border: 'rgba(6, 182, 212, 0.3)',
            glow: 'rgba(6, 182, 212, 0.2)',
        };
    }

    // 5. Game Server
    if (
        text.includes('palworld') ||
        text.includes('rust') ||
        text.includes('csgo') ||
        text.includes('cs2') ||
        text.includes('ark') ||
        text.includes('terraria')
    ) {
        return {
            type: 'game',
            label: 'Game Server',
            icon: faGamepad,
            color: '#A855F7',
            bg: 'rgba(168, 85, 247, 0.12)',
            border: 'rgba(168, 85, 247, 0.3)',
            glow: 'rgba(168, 85, 247, 0.2)',
        };
    }

    // 6. Default Server
    return {
        type: 'server',
        label: 'Server',
        icon: faServer,
        color: '#BFA89E',
        bg: 'rgba(191, 168, 158, 0.12)',
        border: 'rgba(191, 168, 158, 0.25)',
        glow: 'rgba(191, 168, 158, 0.15)',
    };
};

const RowCard = styled(Link)`
    display: flex;
    flex-direction: column;
    background-color: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.15);
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 12px;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    &:hover {
        border-color: rgba(191, 168, 158, 0.35);
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);

        & .manage-btn {
            background-color: #BFA89E;
            color: #141211;
            border-color: #BFA89E;
        }

        & .server-avatar {
            border-color: rgba(191, 168, 158, 0.4);
            filter: brightness(1.1);
        }
    }

    @media (min-width: 1024px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1 1 200px;
    max-width: 270px;

    @media (min-width: 1440px) {
        max-width: 320px;
        gap: 14px;
    }
`;

const ServerAvatar = styled.div<{ $color: string; $bg: string; $border: string; $glow: string }>`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: ${({ $bg }) => $bg};
    border: 1px solid ${({ $border }) => $border};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ $color }) => $color};
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 0 12px ${({ $glow }) => $glow};
`;

const ServerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
`;

const ServerName = styled.h4`
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #EBF5EE;
    margin: 0;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
`;

const GameTypeBadge = styled.span<{ $color: string; $bg: string; $border: string }>`
    font-family: 'Outfit', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 2px 7px;
    border-radius: 5px;
    background-color: ${({ $bg }) => $bg};
    border: 1px solid ${({ $border }) => $border};
    color: ${({ $color }) => $color};
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
`;

const NodeBadge = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 2px 7px;
    border-radius: 5px;
    background-color: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.25);
    color: #BFA89E;
    flex-shrink: 0;
`;

const ConnectionString = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #8B786D;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: color 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;

    &:hover {
        color: #EBF5EE;
    }
`;

const MiddleSection = styled.div`
    display: none;
    align-items: center;
    gap: 14px;
    margin: 12px 0;
    flex-shrink: 1;
    min-width: 0;

    @media (min-width: 768px) {
        display: flex;
    }
    @media (min-width: 1024px) {
        margin: 0 10px;
        flex: 1;
        justify-content: center;
        gap: 16px;
    }
    @media (min-width: 1440px) {
        margin: 0 20px;
        gap: 24px;
    }
`;

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
    flex-shrink: 0;
`;

const StatHeader = styled.div<{ $alarm?: boolean }>`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: ${(props) => (props.$alarm ? '#ef4444' : '#8B786D')};
    margin-bottom: 2px;
`;

const StatValue = styled.span<{ $alarm?: boolean }>`
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    font-weight: 600;
    color: ${(props) => (props.$alarm ? '#ef4444' : '#EBF5EE')};
    white-space: nowrap;
`;

const StatSub = styled.span`
    font-size: 10.5px;
    color: #8B786D;
    white-space: nowrap;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;

    @media (min-width: 1024px) {
        margin-top: 0;
        flex-shrink: 0;
        gap: 10px;
    }
    @media (min-width: 1440px) {
        gap: 14px;
    }
`;

const StatusPill = styled.div<{ $status?: ServerPowerState }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 7px;
    background-color: #1c1917;
    border: 1px solid
        ${({ $status }) =>
        $status === 'running'
            ? 'rgba(34, 197, 94, 0.3)'
            : $status === 'starting'
                ? 'rgba(234, 179, 8, 0.3)'
                : 'rgba(139, 120, 109, 0.25)'};
`;

const StatusDot = styled.span<{ $status?: ServerPowerState }>`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${({ $status }) =>
        $status === 'running' ? '#22c55e' : $status === 'starting' ? '#eab308' : '#8B786D'};
    box-shadow: ${({ $status }) =>
        $status === 'running' ? '0 0 6px #22c55e' : $status === 'starting' ? '0 0 6px #eab308' : 'none'};
`;

const StatusText = styled.span<{ $status?: ServerPowerState }>`
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ $status }) =>
        $status === 'running' ? '#22c55e' : $status === 'starting' ? '#eab308' : '#8B786D'};
`;

const ManageButton = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 7px;
    background-color: rgba(191, 168, 158, 0.1);
    color: #BFA89E;
    border: 1px solid rgba(191, 168, 158, 0.25);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
    white-space: nowrap;
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);
    const [copied, setCopied] = useState(false);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => {
                if (data.isSuspended) {
                    setIsSuspended(true);
                }
                setStats(data);
            })
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(server.status === 'suspended');
        if (server.status !== 'suspended') {
            interval.current = setInterval(getStats, 30000);
            getStats();
        }

        return () => {
            if (interval.current) clearInterval(interval.current);
        };
    }, [server]);

    const alarms = {
        cpu: isAlarmState(stats?.cpuUsagePercent || 0, server.limits.cpu),
        memory: isAlarmState(stats?.memoryUsageInBytes || 0, server.limits.memory),
        disk: isAlarmState(stats?.diskUsageInBytes || 0, server.limits.disk),
    };

    const diskLimit = server.limits.disk ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu ? `${server.limits.cpu}%` : 'Unlimited';

    const defaultAlloc = server.allocations?.find((alloc) => alloc.isDefault);
    const connString = defaultAlloc ? `${defaultAlloc.alias || ip(defaultAlloc.ip)}:${defaultAlloc.port}` : '';

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (connString) {
            copy(connString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const typeMeta = getServerTypeMeta(server);

    return (
        <RowCard to={`/server/${server.id}`} className={className}>
            <LeftSection>
                <ServerAvatar
                    className={'server-avatar'}
                    $color={typeMeta.color}
                    $bg={typeMeta.bg}
                    $border={typeMeta.border}
                    $glow={typeMeta.glow}
                >
                    <FontAwesomeIcon icon={typeMeta.icon} />
                </ServerAvatar>
                <ServerInfo>
                    <ServerName>{server.name}</ServerName>
                    <MetaRow>
                        <GameTypeBadge
                            $color={typeMeta.color}
                            $bg={typeMeta.bg}
                            $border={typeMeta.border}
                        >
                            <FontAwesomeIcon icon={typeMeta.icon} style={{ fontSize: '10px' }} />
                            <span>{typeMeta.label}</span>
                        </GameTypeBadge>
                        {server.node && <NodeBadge>{server.node}</NodeBadge>}
                        {connString && (
                            <ConnectionString onClick={handleCopy} title={'Click to copy connection address'}>
                                <span>{connString}</span>
                                <FontAwesomeIcon icon={copied ? faCheck : faCopy} style={{ fontSize: '11px' }} />
                            </ConnectionString>
                        )}
                    </MetaRow>
                </ServerInfo>
            </LeftSection>

            <MiddleSection>
                {!stats || isSuspended ? (
                    <div style={{ color: '#8B786D', fontSize: '13px', fontFamily: 'Outfit, sans-serif' }}>
                        {isSuspended
                            ? 'Suspended'
                            : server.isTransferring
                                ? 'Transferring...'
                                : server.status === 'installing'
                                    ? 'Installing...'
                                    : 'Offline'}
                    </div>
                ) : (
                    <>
                        <StatItem>
                            <StatHeader $alarm={alarms.cpu}>
                                <FontAwesomeIcon icon={faMicrochip} />
                                <span>CPU</span>
                            </StatHeader>
                            <StatValue $alarm={alarms.cpu}>{stats.cpuUsagePercent.toFixed(1)}%</StatValue>
                            <StatSub>of {cpuLimit}</StatSub>
                        </StatItem>
                        <StatItem>
                            <StatHeader $alarm={alarms.memory}>
                                <FontAwesomeIcon icon={faMemory} />
                                <span>RAM</span>
                            </StatHeader>
                            <StatValue $alarm={alarms.memory}>{bytesToString(stats.memoryUsageInBytes)}</StatValue>
                            <StatSub>of {memoryLimit}</StatSub>
                        </StatItem>
                        <StatItem>
                            <StatHeader $alarm={alarms.disk}>
                                <FontAwesomeIcon icon={faHdd} />
                                <span>DISK</span>
                            </StatHeader>
                            <StatValue $alarm={alarms.disk}>{bytesToString(stats.diskUsageInBytes)}</StatValue>
                            <StatSub>of {diskLimit}</StatSub>
                        </StatItem>
                    </>
                )}
            </MiddleSection>

            <RightSection>
                <StatusPill $status={isSuspended ? undefined : stats?.status}>
                    <StatusDot $status={isSuspended ? undefined : stats?.status} />
                    <StatusText $status={isSuspended ? undefined : stats?.status}>
                        {isSuspended ? 'SUSPENDED' : stats?.status || 'OFFLINE'}
                    </StatusText>
                </StatusPill>
                <ManageButton className={'manage-btn'}>
                    <span>Manage</span>
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '11px' }} />
                </ManageButton>
            </RightSection>
        </RowCard>
    );
};
