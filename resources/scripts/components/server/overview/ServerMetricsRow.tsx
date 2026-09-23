import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faMemory, faHdd, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { bytesToString } from '@/lib/formatters';

const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 16px;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const MetricCard = styled.div`
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.2);
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.15s ease;
    font-family: 'Outfit', sans-serif;

    &:hover {
        border-color: rgba(191, 168, 158, 0.35);
        transform: translateY(-1px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const LabelRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const IconBox = styled.div<{ $color: string }>`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background: ${(props) => props.$color}18;
    color: ${(props) => props.$color};
`;

const Label = styled.span`
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #8B786D;
`;

const Value = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    font-weight: 600;
    color: #EBF5EE;
    line-height: 1;
`;

const SubValue = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #8B786D;
    font-weight: 500;
`;

const ProgressBarOuter = styled.div`
    width: 100%;
    height: 6px;
    background: #1c1917;
    border-radius: 3px;
    overflow: hidden;
`;

const ProgressBarInner = styled.div<{ $percent: number; $color: string }>`
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    width: ${(props) => Math.min(100, props.$percent)}%;
    background: ${(props) => props.$color};

    ${(props) =>
        props.$percent > 85 &&
        css`
            animation: ${pulse} 1.5s ease-in-out infinite;
        `}
`;

function getBarColor(percent: number): string {
    if (percent >= 90) return '#c94b4b';
    if (percent >= 70) return '#dd9754';
    return '#52b788';
}

function formatNetworkRate(bytesPerSec: number): string {
    if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`;
    if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
}

interface MetricItemProps {
    icon: any;
    iconColor: string;
    label: string;
    value: string;
    subValue?: string;
    percent?: number;
}

const MetricItem: React.FC<MetricItemProps> = ({ icon, iconColor, label, value, subValue, percent }) => (
    <MetricCard>
        <CardHeader>
            <LabelRow>
                <IconBox $color={iconColor}>
                    <FontAwesomeIcon icon={icon} />
                </IconBox>
                <Label>{label}</Label>
            </LabelRow>
        </CardHeader>
        <div>
            <Value>{value}</Value>
            {subValue && <SubValue style={{ marginLeft: 6 }}>{subValue}</SubValue>}
        </div>
        {typeof percent === 'number' && (
            <ProgressBarOuter>
                <ProgressBarInner $percent={percent} $color={getBarColor(percent)} />
            </ProgressBarOuter>
        )}
    </MetricCard>
);

const ServerMetricsRow: React.FC = () => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const stats = ServerContext.useStoreState((state) => state.server.data?.status === null ? null : undefined) || null;

    /* Live stats from the WebSocket connection */
    const cpuUsage = ServerContext.useStoreState((state) => state.status.value === 'offline' ? 0 : (state as any).stats?.cpu ?? 0);
    const memoryUsage = ServerContext.useStoreState((state) => state.status.value === 'offline' ? 0 : (state as any).stats?.memory ?? 0);
    const diskUsage = ServerContext.useStoreState((state) => state.status.value === 'offline' ? 0 : (state as any).stats?.disk ?? 0);
    const networkRx = ServerContext.useStoreState((state) => state.status.value === 'offline' ? 0 : (state as any).stats?.rx ?? 0);
    const networkTx = ServerContext.useStoreState((state) => state.status.value === 'offline' ? 0 : (state as any).stats?.tx ?? 0);

    const limits = ServerContext.useStoreState((state) => state.server.data?.limits);

    const cpuLimit = limits?.cpu || 100;
    const memoryLimit = (limits?.memory || 1024) * 1024 * 1024; // Convert MB to bytes
    const diskLimit = (limits?.disk || 1024) * 1024 * 1024; // Convert MB to bytes

    const cpuPercent = cpuLimit > 0 ? (cpuUsage / cpuLimit) * 100 : 0;
    const memPercent = memoryLimit > 0 ? (memoryUsage / memoryLimit) * 100 : 0;
    const diskPercent = diskLimit > 0 ? (diskUsage / diskLimit) * 100 : 0;

    const cpuCores = cpuLimit >= 100 ? `${(cpuLimit / 100).toFixed(0)} core${cpuLimit > 100 ? 's' : ''}` : `${cpuLimit}%`;

    return (
        <MetricsGrid>
            <MetricItem
                icon={faMicrochip}
                iconColor={'#52b788'}
                label={'CPU'}
                value={`${cpuUsage.toFixed(1)}%`}
                subValue={`of ${cpuCores}`}
                percent={cpuPercent}
            />
            <MetricItem
                icon={faMemory}
                iconColor={'#BFA89E'}
                label={'Memory'}
                value={bytesToString(memoryUsage)}
                subValue={`/ ${bytesToString(memoryLimit)}`}
                percent={memPercent}
            />
            <MetricItem
                icon={faHdd}
                iconColor={'#dd9754'}
                label={'Disk'}
                value={bytesToString(diskUsage)}
                subValue={`/ ${bytesToString(diskLimit)}`}
                percent={diskPercent}
            />
            <MetricItem
                icon={faNetworkWired}
                iconColor={'#8B786D'}
                label={'Network'}
                value={formatNetworkRate(networkRx)}
                subValue={`↑ ${formatNetworkRate(networkTx)}`}
            />
        </MetricsGrid>
    );
};

export default ServerMetricsRow;
