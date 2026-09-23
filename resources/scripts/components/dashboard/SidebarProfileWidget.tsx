/**
 * SidebarProfileWidget.tsx
 * 
 * Bottom profile widget for DashboardSidebar.tsx
 * Shows Discord avatar (if linked) instead of initials.
 * Avatar & username are clickable → navigates to /account.
 * Settings gear → /admin (if admin) or /account, Logout → http.post('/auth/logout').
 */
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import http from '@/api/http';

const pulse = keyframes`
    0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
    50% { box-shadow: 0 0 0 4px rgba(52, 211, 153, 0); }
`;

const WidgetWrap = styled.div`
    padding: 14px 12px;
    border-top: 1px solid rgba(139, 120, 109, 0.18);
    margin-top: auto;
    background: #141211;
`;

const ProfileRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const AvatarLink = styled.a`
    position: relative;
    display: block;
    width: 38px;
    height: 38px;
    min-width: 38px;
    border-radius: 50%;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.15s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const AvatarCircle = styled.div<{ $hasImage: boolean }>`
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid ${(p) => (p.$hasImage ? '#5865F2' : 'rgba(191, 168, 158, 0.35)')};
    background: #25211e;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${(p) => (p.$hasImage ? '0 0 10px rgba(88, 101, 242, 0.35)' : 'none')};
`;

const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const AvatarInitials = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #BFA89E;
`;

const StatusDot = styled.span`
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #34D399;
    border: 2px solid #141211;
    animation: ${pulse} 2s ease-in-out infinite;
`;

const InfoBlock = styled.div`
    flex: 1;
    min-width: 0;
`;

const UserName = styled.a`
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: #EBF5EE;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
    transition: color 0.15s ease;

    &:hover {
        color: #BFA89E;
    }
`;

const UserEmail = styled.span`
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: #8B786D;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
`;

const ActionBtns = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const IconBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: #8B786D;
    font-size: 13px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(191, 168, 158, 0.12);
        color: #EBF5EE;
    }
`;

const IconLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: #8B786D;
    font-size: 13px;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(191, 168, 158, 0.12);
        color: #BFA89E;
    }
`;

interface Props {
    username: string;
    email: string;
    isAdmin?: boolean;
}

const SidebarProfileWidget: React.FC<Props> = ({ username, email, isAdmin }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        /* Fetch Discord profile to display Discord avatar if linked */
        http.get('/api/client/account/discord')
            .then((res) => {
                const d = res.data?.data || res.data;
                const url = d?.avatar || d?.avatar_url;
                if (d?.is_linked && url) {
                    setAvatarUrl(url);
                }
            })
            .catch(() => {
                // Fallback silently to initials
            });
    }, []);

    const onLogout = () => {
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };

    const initials = username ? username.substring(0, 2).toUpperCase() : 'SU';

    return (
        <WidgetWrap>
            <ProfileRow>
                <AvatarLink href={'/account'} title={'View Account Settings'}>
                    <AvatarCircle $hasImage={!!avatarUrl}>
                        {avatarUrl ? (
                            <AvatarImg src={avatarUrl} alt={username} />
                        ) : (
                            <AvatarInitials>{initials}</AvatarInitials>
                        )}
                    </AvatarCircle>
                    <StatusDot />
                </AvatarLink>

                <InfoBlock>
                    <UserName href={'/account'} title={'View Account Settings'}>
                        {username}
                    </UserName>
                    <UserEmail title={email}>{email}</UserEmail>
                </InfoBlock>

                <ActionBtns>
                    {isAdmin && (
                        <IconLink href={'/admin'} title={'Admin Control Panel'}>
                            <FontAwesomeIcon icon={faCogs} />
                        </IconLink>
                    )}
                    <IconBtn onClick={onLogout} title={'Sign Out'}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </IconBtn>
                </ActionBtns>
            </ProfileRow>
        </WidgetWrap>
    );
};

export default SidebarProfileWidget;
