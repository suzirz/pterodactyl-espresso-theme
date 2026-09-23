import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperPlane,
    faCopy,
    faCheck,
    faPlay,
    faRedo,
    faStop,
    faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components/macro';
import copy from 'copy-to-clipboard';
import Can from '@/components/elements/Can';
import { Dialog } from '@/components/elements/dialog';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';

const pulse = keyframes`
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.95); }
`;

const HeaderCard = styled.div`
    background: linear-gradient(135deg, rgba(20, 18, 17, 0.95) 0%, rgba(14, 12, 11, 0.98) 100%);
    border: 1px solid rgba(139, 120, 109, 0.22);
    border-radius: 14px;
    padding: 14px 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    overflow: hidden;

    @media (min-width: 1024px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
`;

const ServerAvatar = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 11px;
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 19px;
    flex-shrink: 0;
    box-shadow: 0 0 16px rgba(191, 168, 158, 0.15);
`;

const ServerMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;

const ServerTitle = styled.h1`
    font-family: 'Outfit', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #EBF5EE;
    margin: 0;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StatusPill = styled.div<{ $status: string | null }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 9px;
    border-radius: 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${(props) => {
        switch (props.$status) {
            case 'running': return 'rgba(16, 185, 129, 0.15)';
            case 'starting': return 'rgba(245, 158, 11, 0.15)';
            case 'stopping': return 'rgba(239, 68, 68, 0.15)';
            default: return 'rgba(107, 114, 128, 0.18)';
        }
    }};
    border: 1px solid ${(props) => {
        switch (props.$status) {
            case 'running': return 'rgba(16, 185, 129, 0.4)';
            case 'starting': return 'rgba(245, 158, 11, 0.4)';
            case 'stopping': return 'rgba(239, 68, 68, 0.4)';
            default: return 'rgba(156, 163, 175, 0.3)';
        }
    }};
    color: ${(props) => {
        switch (props.$status) {
            case 'running': return '#34D399';
            case 'starting': return '#FBBF24';
            case 'stopping': return '#F87171';
            default: return '#9CA3AF';
        }
    }};

    & > span.dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: currentColor;
        animation: ${(props) => (props.$status === 'running' || props.$status === 'starting' ? pulse : 'none')} 2s infinite ease-in-out;
    }
`;

const DetailsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const NodeBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 7px;
    background: #181514;
    border: 1px solid rgba(139, 120, 109, 0.22);
    border-radius: 6px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #BFA89E;
`;

const ConnectionChip = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #141211;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 6px;
    padding: 2px 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #D1D5DB;
    cursor: pointer;
    transition: all 0.16s ease;
    user-select: none;

    .copy-icon {
        color: #BFA89E;
        font-size: 10px;
    }

    &:hover {
        border-color: #BFA89E;
        background: #1a1716;
        color: #EBF5EE;

        .copy-icon {
            color: #EBF5EE;
        }
    }
`;

const PowerButtonGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

/* High-Contrast Semantic Power Buttons */
const StartBtn = styled.button<{ $disabled: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 8px;
    background: ${(props) => (props.$disabled ? 'rgba(30, 27, 25, 0.4)' : '#22c55e')};
    border: 1px solid ${(props) => (props.$disabled ? 'rgba(139, 120, 109, 0.15)' : '#16a34a')};
    color: ${(props) => (props.$disabled ? '#6b7280' : '#141211')};
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 800;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.18s ease;
    box-shadow: ${(props) => (props.$disabled ? 'none' : '0 2px 12px rgba(34, 197, 94, 0.3)')};

    &:hover:not(:disabled) {
        background: #16a34a;
        transform: translateY(-1px);
        box-shadow: 0 4px 18px rgba(34, 197, 94, 0.45);
    }
`;

const RestartBtn = styled.button<{ $disabled: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 8px;
    background: ${(props) => (props.$disabled ? 'rgba(30, 27, 25, 0.4)' : 'rgba(245, 158, 11, 0.14)')};
    border: 1px solid ${(props) => (props.$disabled ? 'rgba(139, 120, 109, 0.15)' : 'rgba(245, 158, 11, 0.4)')};
    color: ${(props) => (props.$disabled ? '#6b7280' : '#f59e0b')};
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 700;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.18s ease;

    &:hover:not(:disabled) {
        background: rgba(245, 158, 11, 0.25);
        border-color: #f59e0b;
        color: #fbbf24;
        transform: translateY(-1px);
    }
`;

const StopBtn = styled.button<{ $disabled: boolean; $isKill?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 8px;
    background: ${(props) => (props.$disabled ? 'rgba(30, 27, 25, 0.4)' : (props.$isKill ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.14)'))};
    border: 1px solid ${(props) => (props.$disabled ? 'rgba(139, 120, 109, 0.15)' : (props.$isKill ? '#ef4444' : 'rgba(239, 68, 68, 0.4)'))};
    color: ${(props) => (props.$disabled ? '#6b7280' : '#f87171')};
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 700;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.18s ease;

    &:hover:not(:disabled) {
        background: #ef4444;
        border-color: #ef4444;
        color: #ffffff;
        transform: translateY(-1px);
    }
`;

export default () => {
    const server = ServerContext.useStoreState((state) => state.server.data!);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [copied, setCopied] = useState(false);

    const allocation = server.allocations.find((alloc) => alloc.isDefault) || server.allocations[0];
    const isDemo = (window as any).PterodactylUser?.username === 'demo' || (window as any).PterodactylUser?.email === 'demo@bytenodes.id';
    const ipAddr = allocation ? ((isDemo || allocation.ip === '0.0.0.0') ? '0.0.0.0' : (allocation.alias || allocation.ip)) : '0.0.0.0';
    const port = allocation ? allocation.port : 0;
    const fullAddr = `${ipAddr}:${port}`;

    const killable = status === 'stopping';

    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpenConfirm(true);
        }

        if (instance) {
            setOpenConfirm(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpenConfirm(false);
        }
    }, [status]);

    const handleCopy = () => {
        copy(fullAddr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getNodeFlag = (nodeName: string) => {
        const lower = nodeName.toLowerCase();
        if (lower.includes('de') || lower.includes('germany')) return '🇩🇪';
        if (lower.includes('sg') || lower.includes('singapore')) return '🇸🇬';
        if (lower.includes('us') || lower.includes('usa')) return '🇺🇸';
        return '🇮🇩';
    };

    return (
        <HeaderCard>
            <Dialog.Confirm
                open={openConfirm}
                hideCloseIcon
                onClose={() => setOpenConfirm(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>

            <LeftSection>
                <ServerAvatar>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </ServerAvatar>
                <ServerMeta>
                    <TitleRow>
                        <ServerTitle>{server.name}</ServerTitle>
                        <StatusPill $status={status}>
                            <span className={'dot'} />
                            {status || 'offline'}
                        </StatusPill>
                    </TitleRow>
                    <DetailsRow>
                        <NodeBadge>
                            {getNodeFlag(server.node)} {server.node}
                        </NodeBadge>
                        <ConnectionChip onClick={handleCopy} title={'Click to copy address'}>
                            <span>{fullAddr}</span>
                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={'copy-icon'} />
                            {copied && <span style={{ fontSize: '10px', color: '#52b788', fontWeight: 700 }}>Copied!</span>}
                        </ConnectionChip>
                    </DetailsRow>
                </ServerMeta>
            </LeftSection>

            <PowerButtonGroup>
                <Can action={'control.start'}>
                    <StartBtn
                        $disabled={status !== 'offline'}
                        disabled={status !== 'offline'}
                        onClick={onButtonClick.bind(this, 'start')}
                    >
                        <FontAwesomeIcon icon={faPlay} style={{ fontSize: 10 }} />
                        Start
                    </StartBtn>
                </Can>
                <Can action={'control.restart'}>
                    <RestartBtn
                        $disabled={!status || status === 'offline'}
                        disabled={!status || status === 'offline'}
                        onClick={onButtonClick.bind(this, 'restart')}
                    >
                        <FontAwesomeIcon icon={faRedo} style={{ fontSize: 10 }} />
                        Restart
                    </RestartBtn>
                </Can>
                <Can action={'control.stop'}>
                    <StopBtn
                        $disabled={status === 'offline'}
                        $isKill={killable}
                        disabled={status === 'offline'}
                        onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                    >
                        <FontAwesomeIcon icon={killable ? faPowerOff : faStop} style={{ fontSize: 10 }} />
                        {killable ? 'Kill' : 'Stop'}
                    </StopBtn>
                </Can>
            </PowerButtonGroup>
        </HeaderCard>
    );
};
