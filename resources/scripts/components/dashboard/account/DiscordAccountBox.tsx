import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faCopy, faCheck, faSyncAlt, faTimesCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import http from '@/api/http';

/* ── Types ── */
interface DiscordRole {
    id: string;
    name: string;
    color: string;
}

interface DiscordData {
    is_linked: boolean;
    discord_id: string | null;
    username: string | null;
    discord_tag: string | null;
    avatar_url: string | null;
    roles: DiscordRole[];
}

/* ── Animations ── */
const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

/* ── Styled Components ── */
const CardBox = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 14px;
    padding: 24px 28px;
    font-family: 'Outfit', sans-serif;
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const DiscordLogo = styled.div`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #5865F2;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DiscordSvg: React.FC = () => (
    <svg width="20" height="15" viewBox="0 0 71 55" fill="none">
        <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.1a58.8 58.8 0 0017.7 9a.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.6 58.6 0 0070.5 45.6v-.1c1.4-15-2.3-28.4-9.8-40.1a.2.2 0 00-.1-.1zM23.7 37.3c-3.5 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7zm23.3 0c-3.5 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7z" fill="white"/>
    </svg>
);

const CardTitle = styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #EBF5EE;
    letter-spacing: -0.01em;
`;

const StatusBadge = styled.span<{ $connected: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: ${(p) => (p.$connected ? 'rgba(52, 211, 153, 0.12)' : 'rgba(251, 191, 36, 0.12)')};
    color: ${(p) => (p.$connected ? '#34d399' : '#fbbf24')};
    border: 1px solid ${(p) => (p.$connected ? 'rgba(52, 211, 153, 0.25)' : 'rgba(251, 191, 36, 0.25)')};
`;

const Description = styled.p`
    font-size: 13px;
    color: #8B786D;
    line-height: 1.6;
    margin: 0 0 20px;
`;

/* ── Profile Section ── */
const ProfileCard = styled.div`
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.2);
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
`;

const AvatarFrame = styled.div`
    width: 56px;
    height: 56px;
    min-width: 56px;
    border-radius: 50%;
    border: 2.5px solid #5865F2;
    overflow: hidden;
    background: #1c1917;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
`;

const AvatarFallback = styled.div`
    width: 100%;
    height: 100%;
    background: #5865F2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
`;

const ProfileInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const Username = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #EBF5EE;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const DiscordId = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #8B786D;
`;

const CopyBtn = styled.button`
    background: none;
    border: none;
    padding: 2px 4px;
    color: #8B786D;
    cursor: pointer;
    font-size: 11px;
    transition: color 0.15s;
    display: inline-flex;

    &:hover { color: #BFA89E; }
`;

/* ── Roles ── */
const RolesRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 18px;
`;

const RolePill = styled.span<{ $color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    background: ${(p) => p.$color}18;
    color: ${(p) => p.$color};
    border: 1px solid ${(p) => p.$color}30;

    &::before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${(p) => p.$color};
    }
`;

/* ── Action Buttons ── */
const ButtonRow = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const ActionBtn = styled.button<{ $variant?: 'danger' | 'primary' }>`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid;

    ${(p) =>
        p.$variant === 'danger'
            ? `
        background: rgba(201, 75, 75, 0.1);
        border-color: rgba(201, 75, 75, 0.3);
        color: #c94b4b;
        &:hover { background: rgba(201, 75, 75, 0.2); }
    `
            : `
        background: rgba(191, 168, 158, 0.1);
        border-color: rgba(191, 168, 158, 0.25);
        color: #BFA89E;
        &:hover { background: rgba(191, 168, 158, 0.2); }
    `}

    &:active { transform: scale(0.97); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const LinkButton = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #5865F2;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
        background: #4752c4;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(88, 101, 242, 0.3);
    }

    &:active { transform: scale(0.98); }
`;

/* ── Benefit list for unlinked state ── */
const BenefitList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
`;

const BenefitItem = styled.li`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-size: 13px;
    color: #a39288;
    border-bottom: 1px solid rgba(139, 120, 109, 0.08);

    &:last-child { border-bottom: none; }

    svg { color: #52b788; font-size: 12px; min-width: 14px; }
`;

const SpinIcon = styled(FontAwesomeIcon)`
    animation: ${spin} 1s linear infinite;
`;

/* ── Component ── */
const DiscordAccountBox: React.FC = () => {
    const [data, setData] = useState<DiscordData | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchDiscord = () => {
        setLoading(true);
        http.get('/api/client/account/discord')
            .then((res) => {
                const d = res.data?.data || res.data;
                setData(d);
            })
            .catch(() => setData({ is_linked: false, discord_id: null, username: null, discord_tag: null, avatar_url: null, roles: [] }))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchDiscord(); }, []);

    const handleResync = () => {
        setSyncing(true);
        http.get('/api/client/account/discord?refresh=1')
            .then((res) => {
                const d = res.data?.data || res.data;
                setData(d);
            })
            .catch(() => {})
            .finally(() => setSyncing(false));
    };

    const handleUnlink = () => {
        if (!confirm('Are you sure you want to unlink your Discord account?')) return;
        http.post('/api/client/account/discord/unlink')
            .then(() => fetchDiscord())
            .catch(() => alert('Failed to unlink Discord account.'));
    };

    const handleCopyId = () => {
        if (data?.discord_id) {
            navigator.clipboard.writeText(data.discord_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <CardBox>
                <CardHeader>
                    <HeaderLeft>
                        <DiscordLogo><DiscordSvg /></DiscordLogo>
                        <CardTitle>Discord Integration</CardTitle>
                    </HeaderLeft>
                </CardHeader>
                <Description style={{ textAlign: 'center', padding: '20px 0' }}>Loading...</Description>
            </CardBox>
        );
    }

    /* ── Connected State ── */
    if (data?.is_linked) {
        const avatarSrc = data.avatar_url || data.avatar;

        return (
            <CardBox>
                <CardHeader>
                    <HeaderLeft>
                        <DiscordLogo><DiscordSvg /></DiscordLogo>
                        <CardTitle>Discord Integration</CardTitle>
                    </HeaderLeft>
                    <StatusBadge $connected>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 10 }} />
                        Connected
                    </StatusBadge>
                </CardHeader>

                <Description>
                    Your Discord account is linked to Pterodactyl. Auto-sync verifies membership, community roles, and enables instant access.
                </Description>

                <ProfileCard>
                    <AvatarFrame>
                        {avatarSrc ? (
                            <AvatarImg src={avatarSrc} alt={data.username || 'Discord'} />
                        ) : (
                            <AvatarFallback><DiscordSvg /></AvatarFallback>
                        )}
                    </AvatarFrame>
                    <ProfileInfo>
                        <Username>{data.username || data.discord_tag || 'Unknown'}</Username>
                        <DiscordId>
                            ID: {data.discord_id}
                            <CopyBtn onClick={handleCopyId} title={'Copy ID'}>
                                <FontAwesomeIcon icon={copied ? faCheck : faCopy} style={{ color: copied ? '#52b788' : undefined }} />
                            </CopyBtn>
                        </DiscordId>
                    </ProfileInfo>
                </ProfileCard>

                {data.roles && data.roles.length > 0 && (
                    <RolesRow>
                        {data.roles.map((role) => (
                            <RolePill key={role.id} $color={role.color || '#BFA89E'}>
                                {role.name}
                            </RolePill>
                        ))}
                    </RolesRow>
                )}

                <ButtonRow>
                    <ActionBtn onClick={handleResync} disabled={syncing}>
                        {syncing ? <SpinIcon icon={faSyncAlt} /> : <FontAwesomeIcon icon={faSyncAlt} />}
                        Re-sync Discord
                    </ActionBtn>
                    <ActionBtn $variant={'danger'} onClick={handleUnlink}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                        Unlink
                    </ActionBtn>
                </ButtonRow>
            </CardBox>
        );
    }

    /* ── Not Connected State ── */
    return (
        <CardBox>
            <CardHeader>
                <HeaderLeft>
                    <DiscordLogo><DiscordSvg /></DiscordLogo>
                    <CardTitle>Discord Integration</CardTitle>
                </HeaderLeft>
                <StatusBadge $connected={false}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: 10 }} />
                    Not Connected
                </StatusBadge>
            </CardHeader>

            <Description>
                Link your Discord account to unlock additional features and seamless integration with the Pterodactyl community.
            </Description>

            <BenefitList>
                <BenefitItem>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Priority support tickets linked to your Discord profile
                </BenefitItem>
                <BenefitItem>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Automatic community role sync on the Pterodactyl server
                </BenefitItem>
                <BenefitItem>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    One-click login with Discord OAuth2
                </BenefitItem>
            </BenefitList>

            <LinkButton href={'/auth/discord'}>
                <DiscordSvg />
                Link Discord Account
            </LinkButton>
        </CardBox>
    );
};

export default DiscordAccountBox;
