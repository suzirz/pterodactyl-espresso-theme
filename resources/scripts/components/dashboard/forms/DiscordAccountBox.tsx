import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationTriangle,
    faSyncAlt,
    faUnlink,
    faCopy,
    faCheck,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@/components/elements/dialog';
import Spinner from '@/components/elements/Spinner';
import { useLocation } from 'react-router-dom';

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
    avatar: string | null;
    avatar_url?: string | null;
    roles: DiscordRole[];
}

const DiscordSvg = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const StatusPill = styled.div<{ $active: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 9999px;
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    margin-bottom: 16px;
    background: ${({ $active }) => ($active ? 'rgba(52, 211, 153, 0.12)' : 'rgba(251, 191, 36, 0.08)')};
    border: 1px solid ${({ $active }) => ($active ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 191, 36, 0.25)')};
    color: ${({ $active }) => ($active ? '#34d399' : '#fbbf24')};
`;

const AlertBanner = styled.div`
    background: rgba(52, 211, 153, 0.12);
    border: 1px solid rgba(52, 211, 153, 0.35);
    color: #34d399;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
`;

const Desc = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    color: #a39288;
    line-height: 1.55;
    margin: 0 0 20px 0;
`;

const ProfileCard = styled.div`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.25);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const ProfileHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const AvatarContainer = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: #25211e;
    border: 2px solid #5865F2;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(88, 101, 242, 0.25);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const UserDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
`;

const DisplayName = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #EBF5EE;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TagText = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #8B786D;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const CopyIdBtn = styled.button`
    background: transparent;
    border: none;
    color: #8B786D;
    cursor: pointer;
    padding: 2px;
    display: inline-flex;
    align-items: center;
    transition: color 0.15s ease;

    &:hover {
        color: #BFA89E;
    }
`;

const RolesWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
`;

const RoleBadge = styled.span<{ $color?: string }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    background: rgba(37, 33, 30, 0.9);
    border: 1px solid ${({ $color }) => $color || 'rgba(191, 168, 158, 0.3)'};
    color: ${({ $color }) => $color || '#BFA89E'};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const ActionsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const ConnectDiscordBtn = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 11px 22px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    background: #5865F2;
    color: #ffffff;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(88, 101, 242, 0.35);

    &:hover {
        background: #4752c4;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(88, 101, 242, 0.45);
        color: #ffffff;
    }

    &:active {
        transform: scale(0.98);
    }
`;

const ResyncBtn = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.35);
    color: #BFA89E;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(191, 168, 158, 0.1);
        border-color: #BFA89E;
        color: #EBF5EE;
    }
`;

const UnlinkBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #EF4444;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: #EF4444;
    }
`;

export default () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [discordData, setDiscordData] = useState<DiscordData | null>(null);
    const [copied, setCopied] = useState(false);
    const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
    const [unlinking, setUnlinking] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    useEffect(() => {
        if (location.search.includes('sync=success')) {
            setSyncSuccess(true);
        }
        fetchDiscordStatus();
    }, [location]);

    const fetchDiscordStatus = async () => {
        try {
            const res = await axios.get('/api/client/account/discord');
            if (res.data?.success && res.data?.data) {
                setDiscordData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load Discord status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyId = (e: React.MouseEvent) => {
        e.preventDefault();
        if (discordData?.discord_id) {
            navigator.clipboard.writeText(discordData.discord_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleUnlink = async () => {
        setUnlinking(true);
        try {
            await axios.post('/api/client/account/discord/unlink');
            setDiscordData({
                is_linked: false,
                discord_id: null,
                username: null,
                discord_tag: null,
                avatar: null,
                roles: [],
            });
            setShowUnlinkDialog(false);
        } catch (err) {
            console.error('Failed to unlink Discord account:', err);
        } finally {
            setUnlinking(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
                <Spinner size="large" />
            </div>
        );
    }

    const isLinked = !!discordData?.is_linked && !!discordData?.discord_id;
    const avatarUrl = discordData?.avatar || discordData?.avatar_url || (discordData?.discord_id ? `https://cdn.discordapp.com/embed/avatars/${absHash(discordData.discord_id)}.png` : null);

    return (
        <div>
            <Dialog.Confirm
                open={showUnlinkDialog}
                onClose={() => setShowUnlinkDialog(false)}
                title={'Unlink Discord Account?'}
                confirm={'Yes, Unlink Account'}
                onConfirmed={handleUnlink}
                submitting={unlinking}
            >
                Are you sure you want to disconnect your Discord account from Pterodactyl? You may lose your verified Discord community roles, priority support ticket perks, and fast 1-click login.
            </Dialog.Confirm>

            {syncSuccess && (
                <AlertBanner>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Your Discord account was successfully linked and synchronized with Pterodactyl!</span>
                </AlertBanner>
            )}

            <StatusPill $active={isLinked}>
                <FontAwesomeIcon icon={isLinked ? faCheckCircle : faExclamationTriangle} />
                <span>{isLinked ? 'Connected with Discord' : 'Not Connected'}</span>
            </StatusPill>

            <Desc>
                {isLinked
                    ? 'Your Discord account is connected to Pterodactyl. Real-time synchronization verifies your community membership, official roles in the Pterodactyl server, and enables priority support.'
                    : 'Connect your Discord account to synchronize your official roles, unlock 24/7 priority support tickets, server activity alerts, and fast 1-click login.'}
            </Desc>

            {isLinked && discordData ? (
                <>
                    <ProfileCard>
                        <ProfileHeader>
                            <AvatarContainer>
                                <img
                                    src={avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                    alt={discordData.username || 'Discord Avatar'}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                                    }}
                                />
                            </AvatarContainer>
                            <UserDetails>
                                <DisplayName>{discordData.username || 'Discord User'}</DisplayName>
                                <TagText>
                                    <span>ID: {discordData.discord_id}</span>
                                    <CopyIdBtn onClick={handleCopyId} title="Copy Discord ID">
                                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} style={{ color: copied ? '#34d399' : undefined }} />
                                    </CopyIdBtn>
                                </TagText>
                            </UserDetails>
                        </ProfileHeader>

                        {discordData.roles && discordData.roles.length > 0 && (
                            <RolesWrap>
                                {discordData.roles.map((r) => (
                                    <RoleBadge key={r.id} $color={r.color}>
                                        {r.name}
                                    </RoleBadge>
                                ))}
                            </RolesWrap>
                        )}
                    </ProfileCard>

                    <ActionsRow>
                        <ResyncBtn href="/auth/discord">
                            <FontAwesomeIcon icon={faSyncAlt} />
                            <span>Re-sync Discord</span>
                        </ResyncBtn>

                        <UnlinkBtn type="button" onClick={() => setShowUnlinkDialog(true)}>
                            <FontAwesomeIcon icon={faUnlink} />
                            <span>Unlink</span>
                        </UnlinkBtn>
                    </ActionsRow>
                </>
            ) : (
                <div>
                    <ConnectDiscordBtn href="/auth/discord">
                        <DiscordSvg />
                        <span>Link / Sync Discord Account</span>
                    </ConnectDiscordBtn>
                </div>
            )}
        </div>
    );
};

function absHash(id: string | null): number {
    if (!id) return 0;
    return Math.abs(parseInt(id.slice(-4), 10) || 0) % 5;
}
