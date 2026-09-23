import React from 'react';
import styled from 'styled-components';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCreditCard,
    faCheckCircle,
    faTimesCircle,
    faCube,
    faCalendarAlt,
    faExternalLinkAlt,
    faClock,
} from '@fortawesome/free-solid-svg-icons';

const Card = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.22);
    border-radius: 12px;
    padding: 22px 24px;
    font-family: 'Outfit', sans-serif;
    display: flex;
    flex-direction: column;
    transition: all 0.15s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.35);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }
`;

const CardTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(139, 120, 109, 0.15);
`;

const TitleIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: rgba(191, 168, 158, 0.12);
    border: 1px solid rgba(191, 168, 158, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 15px;
`;

const TitleText = styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #EBF5EE;
    letter-spacing: -0.01em;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid rgba(139, 120, 109, 0.1);

    &:last-of-type {
        border-bottom: none;
    }

    &:first-of-type {
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

const StatusBadge = styled.span<{ $status: 'active' | 'warning' | 'expired' }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: ${({ $status }) =>
        $status === 'active'
            ? 'rgba(52, 211, 153, 0.12)'
            : $status === 'warning'
            ? 'rgba(245, 158, 11, 0.12)'
            : 'rgba(239, 68, 68, 0.12)'};
    color: ${({ $status }) =>
        $status === 'active' ? '#34D399' : $status === 'warning' ? '#F59E0B' : '#ef4444'};
    border: 1px solid
        ${({ $status }) =>
            $status === 'active'
                ? 'rgba(52, 211, 153, 0.25)'
                : $status === 'warning'
                ? 'rgba(245, 158, 11, 0.25)'
                : 'rgba(239, 68, 68, 0.25)'};
`;

const MonoText = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #EBF5EE;
`;

const ManageButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 18px;
    padding: 11px 20px;
    background: #BFA89E;
    color: #141211;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;
    letter-spacing: -0.01em;

    &:hover {
        background: #d4bfb5;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(191, 168, 158, 0.3);
    }

    &:active {
        transform: scale(0.98);
    }
`;

function getDueInfo(expiresAt: string | null | undefined): { label: string; status: 'active' | 'warning' | 'expired'; dateStr: string } {
    if (!expiresAt) {
        return { label: 'Permanent / Lifetime', status: 'active', dateStr: '—' };
    }
    try {
        const exp = new Date(expiresAt);
        const now = new Date();
        const diffMs = exp.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const dateStr = exp.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        if (diffDays <= 0) {
            return { label: 'Expired (Grace Period)', status: 'expired', dateStr };
        }
        if (diffDays <= 7) {
            return {
                label: diffDays === 1 ? 'Expires tomorrow' : `Expires in ${diffDays} days`,
                status: 'warning',
                dateStr,
            };
        }
        return {
            label: `Active (${diffDays} days left)`,
            status: 'active',
            dateStr,
        };
    } catch {
        return { label: '—', status: 'active', dateStr: '—' };
    }
}

const ServerBillingCard: React.FC = () => {
    const server = ServerContext.useStoreState((state) => state.server.data!);

    const isSuspended = server.isSuspended;
    const billingPlan = (server as any).billingPlan || server.eggName || 'Custom';
    const expiresAt = (server as any).expiresAt;
    const memoryMb = server.limits?.memory || 0;
    const planDisplay = `${billingPlan}${memoryMb > 0 ? ` (${memoryMb >= 1024 ? `${(memoryMb / 1024).toFixed(0)} GB RAM` : `${memoryMb} MB RAM`})` : ''}`;

    const dueInfo = getDueInfo(expiresAt);

    return (
        <Card>
            <CardTitle>
                <TitleIcon>
                    <FontAwesomeIcon icon={faCreditCard} />
                </TitleIcon>
                <TitleText>Billing & Subscription</TitleText>
            </CardTitle>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 11 }} />
                    Service Status
                </InfoLabel>
                <InfoValue>
                    <StatusBadge $status={isSuspended ? 'expired' : 'active'}>
                        <FontAwesomeIcon icon={isSuspended ? faTimesCircle : faCheckCircle} style={{ fontSize: 10 }} />
                        {isSuspended ? 'Suspended' : 'Active'}
                    </StatusBadge>
                </InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faCube} style={{ fontSize: 11 }} />
                    Package Plan
                </InfoLabel>
                <InfoValue style={{ textTransform: 'uppercase', fontWeight: 600 }}>{planDisplay}</InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: 11 }} />
                    Expiration Date
                </InfoLabel>
                <InfoValue>
                    <MonoText>{dueInfo.dateStr}</MonoText>
                </InfoValue>
            </InfoRow>

            <InfoRow>
                <InfoLabel>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 11 }} />
                    Due / Masa Tenggang
                </InfoLabel>
                <InfoValue>
                    <StatusBadge $status={dueInfo.status}>{dueInfo.label}</StatusBadge>
                </InfoValue>
            </InfoRow>

            <ManageButton href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                <span>Manage & Renew on Discord</span>
                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: 11 }} />
            </ManageButton>
        </Card>
    );
};

export default ServerBillingCard;
