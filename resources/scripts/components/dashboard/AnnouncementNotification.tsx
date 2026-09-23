import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullhorn,
    faExclamationTriangle,
    faExclamationCircle,
    faCheckCircle,
    faTimes,
    faBell,
} from '@fortawesome/free-solid-svg-icons';
import http from '@/api/http';
import useSWR from 'swr';

export interface AnnouncementItem {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'critical' | 'warning' | 'success' | string;
}

const STORAGE_KEY = 'bytenodes_dismissed_announcements';

const fadeInDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const pulseDot = keyframes`
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.45;
        transform: scale(0.85);
    }
`;

const NotificationContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 22px;
    width: 100%;
    animation: ${fadeInDown} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

interface CardProps {
    $announcementType: string;
}

const getThemeForType = (type: string) => {
    switch (type) {
        case 'critical':
        case 'danger':
            return {
                accent: '#ef4444',
                accentBorder: 'rgba(239, 68, 68, 0.35)',
                accentBg: 'linear-gradient(135deg, rgba(35, 18, 18, 0.95) 0%, rgba(22, 16, 16, 0.98) 100%)',
                glow: 'rgba(239, 68, 68, 0.16)',
                iconColor: '#f87171',
                iconBg: 'rgba(239, 68, 68, 0.14)',
                iconBorder: 'rgba(239, 68, 68, 0.28)',
                badgeText: '#fca5a5',
                badgeBg: 'rgba(239, 68, 68, 0.12)',
                badgeBorder: 'rgba(239, 68, 68, 0.25)',
                dotColor: '#ef4444',
                label: 'CRITICAL ALERT',
                icon: faExclamationTriangle,
            };
        case 'warning':
            return {
                accent: '#f59e0b',
                accentBorder: 'rgba(245, 158, 11, 0.35)',
                accentBg: 'linear-gradient(135deg, rgba(34, 25, 16, 0.95) 0%, rgba(22, 18, 14, 0.98) 100%)',
                glow: 'rgba(245, 158, 11, 0.14)',
                iconColor: '#fbbf24',
                iconBg: 'rgba(245, 158, 11, 0.14)',
                iconBorder: 'rgba(245, 158, 11, 0.28)',
                badgeText: '#fde68a',
                badgeBg: 'rgba(245, 158, 11, 0.12)',
                badgeBorder: 'rgba(245, 158, 11, 0.25)',
                dotColor: '#f59e0b',
                label: 'IMPORTANT ADVISORY',
                icon: faExclamationCircle,
            };
        case 'success':
            return {
                accent: '#10b981',
                accentBorder: 'rgba(16, 185, 129, 0.35)',
                accentBg: 'linear-gradient(135deg, rgba(16, 30, 24, 0.95) 0%, rgba(14, 22, 18, 0.98) 100%)',
                glow: 'rgba(16, 185, 129, 0.14)',
                iconColor: '#34d399',
                iconBg: 'rgba(16, 185, 129, 0.14)',
                iconBorder: 'rgba(16, 185, 129, 0.28)',
                badgeText: '#a7f3d0',
                badgeBg: 'rgba(16, 185, 129, 0.12)',
                badgeBorder: 'rgba(16, 185, 129, 0.25)',
                dotColor: '#10b981',
                label: 'SYSTEM UPDATE',
                icon: faCheckCircle,
            };
        case 'info':
        default:
            return {
                accent: '#38bdf8',
                accentBorder: 'rgba(56, 189, 248, 0.28)',
                accentBg: 'linear-gradient(135deg, rgba(20, 26, 34, 0.95) 0%, rgba(17, 20, 25, 0.98) 100%)',
                glow: 'rgba(56, 189, 248, 0.12)',
                iconColor: '#38bdf8',
                iconBg: 'rgba(56, 189, 248, 0.12)',
                iconBorder: 'rgba(56, 189, 248, 0.24)',
                badgeText: '#bae6fd',
                badgeBg: 'rgba(56, 189, 248, 0.10)',
                badgeBorder: 'rgba(56, 189, 248, 0.22)',
                dotColor: '#38bdf8',
                label: 'ANNOUNCEMENT',
                icon: faBullhorn,
            };
    }
};

const NotificationCard = styled.div<CardProps>`
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 15px 18px;
    border-radius: 12px;
    box-sizing: border-box;
    backdrop-filter: blur(12px);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    ${({ $announcementType }) => {
        const theme = getThemeForType($announcementType);
        return css`
            background: ${theme.accentBg};
            border: 1px solid ${theme.accentBorder};
            border-left: 4px solid ${theme.accent};
            box-shadow: 0 6px 22px -4px rgba(0, 0, 0, 0.45), 0 0 16px -2px ${theme.glow};

            &:hover {
                border-color: ${theme.accent};
                box-shadow: 0 8px 26px -3px rgba(0, 0, 0, 0.55), 0 0 20px 0 ${theme.glow};
            }
        `;
    }}

    @media (max-width: 640px) {
        flex-direction: column;
        gap: 12px;
        padding: 14px 16px;
    }
`;

const IconBadge = styled.div<CardProps>`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 15px;

    ${({ $announcementType }) => {
        const theme = getThemeForType($announcementType);
        return css`
            background: ${theme.iconBg};
            border: 1px solid ${theme.iconBorder};
            color: ${theme.iconColor};
        `;
    }}
`;

const ContentWrapper = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const TagBadge = styled.span<CardProps>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2.5px 8px;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;

    ${({ $announcementType }) => {
        const theme = getThemeForType($announcementType);
        return css`
            background: ${theme.badgeBg};
            color: ${theme.badgeText};
            border: 1px solid ${theme.badgeBorder};
        `;
    }}
`;

const LiveDot = styled.span<CardProps>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: ${pulseDot} 2s infinite ease-in-out;

    ${({ $announcementType }) => {
        const theme = getThemeForType($announcementType);
        return css`
            background-color: ${theme.dotColor};
            box-shadow: 0 0 6px ${theme.dotColor};
        `;
    }}
`;

const BroadcastLabel = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #8B786D;
    letter-spacing: 0.02em;
`;

const Title = styled.h3`
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 2px 0 0 0;
    letter-spacing: -0.01em;
    line-height: 1.35;
`;

const MessageBody = styled.div`
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    line-height: 1.55;
    color: #cfc4bc;
    white-space: pre-line;
    word-break: break-word;
    margin-top: 2px;

    p {
        margin: 0;
    }

    a {
        color: #BFA89E;
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.15s ease;

        &:hover {
            color: #EBF5EE;
        }
    }
`;

const DismissBtn = styled.button`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #8B786D;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.18s ease;
    flex-shrink: 0;
    align-self: flex-start;
    padding: 0;

    &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #EBF5EE;
        border-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.06);
    }

    &:active {
        transform: scale(0.96);
    }

    @media (max-width: 640px) {
        position: absolute;
        top: 12px;
        right: 12px;
    }
`;

const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

const AnnouncementNotification: React.FC = () => {
    const [dismissedIds, setDismissedIds] = useState<number[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setDismissedIds(parsed);
                }
            }
        } catch {
            // Ignore JSON parse errors
        }
    }, []);

    const { data: announcements } = useSWR<AnnouncementItem[]>(
        '/api/client/announcements',
        async () => {
            const response = await http.get('/api/client/announcements');
            return response.data;
        },
        {
            refreshInterval: 60000,
            revalidateOnFocus: true,
        }
    );

    const handleDismiss = (id: number) => {
        const updated = [...dismissedIds, id];
        setDismissedIds(updated);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
            // Ignore localStorage errors
        }
    };

    const activeAnnouncements = (announcements || []).filter(
        (item) => !dismissedIds.includes(item.id)
    );

    if (activeAnnouncements.length === 0) {
        return null;
    }

    return (
        <NotificationContainer>
            {activeAnnouncements.map((item) => {
                const theme = getThemeForType(item.type);
                const hasHtml = isHtml(item.message);

                return (
                    <NotificationCard key={item.id} $announcementType={item.type}>
                        <IconBadge $announcementType={item.type}>
                            <FontAwesomeIcon icon={theme.icon} />
                        </IconBadge>

                        <ContentWrapper>
                            <HeaderRow>
                                <TagBadge $announcementType={item.type}>
                                    <LiveDot $announcementType={item.type} />
                                    {theme.label}
                                </TagBadge>
                                <BroadcastLabel>Panel Notice</BroadcastLabel>
                            </HeaderRow>

                            {item.title && <Title>{item.title}</Title>}

                            {hasHtml ? (
                                <MessageBody dangerouslySetInnerHTML={{ __html: item.message }} />
                            ) : (
                                <MessageBody>{item.message}</MessageBody>
                            )}
                        </ContentWrapper>

                        <DismissBtn
                            type="button"
                            title="Dismiss notification"
                            aria-label="Dismiss notification"
                            onClick={() => handleDismiss(item.id)}
                        >
                            <FontAwesomeIcon icon={faTimes} style={{ fontSize: 12 }} />
                        </DismissBtn>
                    </NotificationCard>
                );
            })}
        </NotificationContainer>
    );
};

export default AnnouncementNotification;
