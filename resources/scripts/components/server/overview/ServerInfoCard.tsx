import React, { useState } from 'react';
import styled from 'styled-components';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircle, faClock, faServer, faFingerprint, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const Card = styled.div`
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.2);
    border-radius: 10px;
    padding: 22px 24px;
    font-family: 'Outfit', sans-serif;
    transition: all 0.15s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.35);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }
`;

const CardTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(139, 120, 109, 0.15);
`;

const TitleIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: rgba(191, 168, 158, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 14px;
`;

const TitleText = styled.h3`
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #EBF5EE;
    letter-spacing: -0.01em;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(139, 120, 109, 0.08);

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    &:first-child {
        padding-top: 0;
    }
`;

const InfoLabel = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 500;
    color: #8B786D;
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;

const InfoValue = styled.span`
    font-size: 13.5px;
    font-weight: 500;
    color: #EBF5EE;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StatusDot = styled.span<{ $color: string }>`
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.$color};
    box-shadow: 0 0 6px ${(props) => props.$color}80;
`;

const MonoText = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #a39288;
`;

const CopyBtn = styled.button`
    background: rgba(191, 168, 158, 0.1);
    border: 1px solid rgba(139, 120, 109, 0.2);
    border-radius: 6px;
    padding: 4px 8px;
    color: #8B786D;
    font-size: 11px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(191, 168, 158, 0.2);
        color: #BFA89E;
    }

    &:active {
        transform: scale(0.96);
    }
`;

function getStatusColor(status: string | null): string {
    switch (status) {
        case 'running':
            return '#52b788';
        case 'starting':
            return '#74a892';
        case 'stopping':
            return '#dd9754';
        default:
            return '#c94b4b';
    }
}

function getStatusLabel(status: string | null): string {
    switch (status) {
        case 'running':
            return 'Online';
        case 'starting':
            return 'Starting';
        case 'stopping':
            return 'Stopping';
        default:
            return 'Offline';
    }
}

function formatUptime(uptimeMs: number): string {
    if (uptimeMs <= 0) return '—';
    const seconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ') || '< 1m';
}

const ServerInfoCard: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const server = ServerContext.useStoreState((state) => state.server.data!);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const uptime = ServerContext.useStoreState((state) => (state as any).stats?.uptime ?? 0);

    const uuid = server.uuid;
    const node = server.node;
    const allocation = server.allocations.find((a: any) => a.isDefault);
    const isDemo = (window as any).PterodactylUser?.username === 'demo' || (window as any).PterodactylUser?.email === 'demo@bytenodes.id';
    const allocHost = (isDemo || allocation?.ip === '0.0.0.0') ? '0.0.0.0' : (allocation?.alias || allocation?.ip);
    const hostname = allocation
        ? `${allocHost}:${allocation.port}`
        : '—';

    const handleCopyUuid = () => {
        navigator.clipboard.writeText(uuid).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Card>
            <CardTitle>
                <TitleIcon>
                    <FontAwesomeIcon icon={faInfoCircle} />
                </TitleIcon>
                <TitleText>Server Information</TitleText>
            </CardTitle>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} />
                    Status
                </InfoLabel>
                <InfoValue>
                    <StatusDot $color={getStatusColor(status)} />
                    {getStatusLabel(status)}
                </InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 11 }} />
                    Uptime
                </InfoLabel>
                <InfoValue>
                    <MonoText>{formatUptime(uptime)}</MonoText>
                </InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faServer} style={{ fontSize: 11 }} />
                    Hostname
                </InfoLabel>
                <InfoValue>
                    <MonoText>{hostname}</MonoText>
                </InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faServer} style={{ fontSize: 11 }} />
                    Node
                </InfoLabel>
                <InfoValue>{node}</InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faFingerprint} style={{ fontSize: 11 }} />
                    Server ID
                </InfoLabel>
                <InfoValue>
                    <MonoText style={{ fontSize: 11 }}>{uuid.substring(0, 8)}...</MonoText>
                    <CopyBtn onClick={handleCopyUuid}>
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} style={{ fontSize: 10, color: copied ? '#52b788' : undefined }} />
                        {copied ? 'Copied' : 'Copy'}
                    </CopyBtn>
                </InfoValue>
            </InfoRow>
        </Card>
    );
};

export default ServerInfoCard;
