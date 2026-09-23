import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faExclamationTriangle, faExternalLinkAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const pulse = keyframes`
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
`;

const floatAnim = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
`;

const PageWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 160px);
    padding: 40px 20px;
    font-family: 'Outfit', sans-serif;
`;

const CardContainer = styled.div`
    max-width: 520px;
    width: 100%;
    background: #1c1917;
    border: 1px solid rgba(201, 75, 75, 0.25);
    border-radius: 16px;
    padding: 44px 36px;
    text-align: center;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(201, 75, 75, 0.08);

    @media (max-width: 600px) {
        padding: 32px 20px;
    }
`;

const IconShield = styled.div<{ $color?: string }>`
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(201, 75, 75, 0.18) 0%, rgba(201, 75, 75, 0.06) 100%);
    border: 2px solid ${({ $color }) => $color || 'rgba(201, 75, 75, 0.35)'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: ${({ $color }) => $color || '#c94b4b'};
    font-size: 28px;
    animation: ${floatAnim} 3s ease-in-out infinite;
`;

const Title = styled.h1`
    font-size: 22px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0 0 10px;
    letter-spacing: -0.02em;
`;

const Description = styled.p`
    font-size: 13.5px;
    color: #8B786D;
    margin: 0 0 24px;
    line-height: 1.6;
`;

const ReasonBox = styled.div`
    background: rgba(201, 75, 75, 0.08);
    border: 1px solid rgba(201, 75, 75, 0.2);
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 24px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-align: left;
`;

const ReasonIcon = styled.div`
    color: #dd9754;
    font-size: 14px;
    margin-top: 2px;
    min-width: 16px;
`;

const ReasonText = styled.div`
    font-size: 13px;
    color: #a39288;
    line-height: 1.5;

    strong {
        color: #EBF5EE;
        font-weight: 600;
    }
`;

const StatusPill = styled.div<{ $color?: string; $bg?: string; $border?: string }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 14px;
    border-radius: 20px;
    background: ${({ $bg }) => $bg || 'rgba(201, 75, 75, 0.12)'};
    border: 1px solid ${({ $border }) => $border || 'rgba(201, 75, 75, 0.25)'};
    color: ${({ $color }) => $color || '#c94b4b'};
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 20px;

    &::before {
        content: '';
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: ${({ $color }) => $color || '#c94b4b'};
        animation: ${pulse} 2s ease-in-out infinite;
    }
`;

const ActionsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const ContactButton = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 24px;
    background: #BFA89E;
    color: #141211;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;
    letter-spacing: -0.01em;

    &:hover {
        background: #d4bfb5;
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(191, 168, 158, 0.3);
    }

    &:active {
        transform: scale(0.98);
    }
`;

const DashboardBtn = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 20px;
    background: #25211e;
    color: #EBF5EE;
    border: 1px solid rgba(191, 168, 158, 0.25);
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(191, 168, 158, 0.1);
        border-color: #BFA89E;
    }
`;

const Footer = styled.p`
    font-size: 12px;
    color: #6b5f56;
    margin: 22px 0 0;
    line-height: 1.5;
`;

interface Props {
    /** 'suspended' or 'installing' or 'transfer' */
    type?: 'suspended' | 'installing' | 'transfer';
}

const SuspendedOverlay: React.FC<Props> = ({ type = 'suspended' }) => {
    let serverName = '';
    let suspensionReason: string | null = null;

    try {
        const server = ServerContext.useStoreState((state) => state.server.data);
        if (server) {
            serverName = server.name;
            suspensionReason = (server as any).suspensionReason || null;
        }
    } catch {
        /* Context not found fallback */
    }

    if (type === 'installing') {
        return (
            <PageWrap>
                <CardContainer style={{ borderColor: 'rgba(221, 151, 84, 0.25)' }}>
                    <IconShield $color={'#dd9754'} style={{ background: 'linear-gradient(135deg, rgba(221, 151, 84, 0.18) 0%, rgba(221, 151, 84, 0.06) 100%)' }}>
                        <FontAwesomeIcon icon={faSyncAlt} spin />
                    </IconShield>
                    <StatusPill $color={'#dd9754'} $bg={'rgba(221, 151, 84, 0.12)'} $border={'rgba(221, 151, 84, 0.25)'}>
                        Installing
                    </StatusPill>
                    <Title>{serverName ? `Installing "${serverName}"` : 'Installing server'}</Title>
                    <Description>
                        We are setting up your server. This usually takes a few minutes.
                    </Description>
                    <ActionsRow>
                        <ContactButton href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                            Contact Support
                        </ContactButton>
                        <DashboardBtn href={'/'}>Back to Dashboard</DashboardBtn>
                    </ActionsRow>
                    <Footer>This page refreshes automatically when ready.</Footer>
                </CardContainer>
            </PageWrap>
        );
    }

    if (type === 'transfer') {
        return (
            <PageWrap>
                <CardContainer style={{ borderColor: 'rgba(191, 168, 158, 0.25)' }}>
                    <IconShield $color={'#BFA89E'} style={{ background: 'linear-gradient(135deg, rgba(191, 168, 158, 0.18) 0%, rgba(191, 168, 158, 0.06) 100%)' }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </IconShield>
                    <StatusPill $color={'#BFA89E'} $bg={'rgba(191, 168, 158, 0.12)'} $border={'rgba(191, 168, 158, 0.25)'}>
                        Transferring
                    </StatusPill>
                    <Title>{serverName ? `Moving "${serverName}"` : 'Moving server'}</Title>
                    <Description>
                        We are moving your server to a new node. It will start up once files finish copying.
                    </Description>
                    <ActionsRow>
                        <ContactButton href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                            Contact Support
                        </ContactButton>
                        <DashboardBtn href={'/'}>Back to Dashboard</DashboardBtn>
                    </ActionsRow>
                    <Footer>Larger servers may take a few minutes.</Footer>
                </CardContainer>
            </PageWrap>
        );
    }

    /* Default: suspended */
    return (
        <PageWrap>
            <CardContainer>
                <IconShield $color={'#c94b4b'}>
                    <FontAwesomeIcon icon={faLock} />
                </IconShield>
                <StatusPill $color={'#c94b4b'} $bg={'rgba(201, 75, 75, 0.12)'} $border={'rgba(201, 75, 75, 0.25)'}>
                    Suspended
                </StatusPill>
                <Title>{serverName ? `Server "${serverName}" Suspended` : 'Server Suspended'}</Title>
                <Description>
                    This server is offline while suspended.
                </Description>

                <ReasonBox>
                    <ReasonIcon>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </ReasonIcon>
                    <ReasonText>
                        <strong>Reason:</strong>
                        <br />
                        {suspensionReason
                            ? suspensionReason
                            : 'The subscription expired. Renew your plan to turn the server back on.'}
                    </ReasonText>
                </ReasonBox>

                <ActionsRow>
                    <ContactButton href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                        Contact Support
                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: 11 }} />
                    </ContactButton>
                    <DashboardBtn href={'/'}>Back to Dashboard</DashboardBtn>
                </ActionsRow>

                <Footer>
                    Files and server data are kept for 7 days before deletion.
                </Footer>
            </CardContainer>
        </PageWrap>
    );
};

export default SuspendedOverlay;
