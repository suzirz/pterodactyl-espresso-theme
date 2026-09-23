import React from 'react';
import styled from 'styled-components';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExternalLinkAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const BannerWrap = styled.div<{ $isExpired?: boolean }>`
    background: ${({ $isExpired }) =>
        $isExpired
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.06) 100%)'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.06) 100%)'};
    border: 1px solid
        ${({ $isExpired }) => ($isExpired ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)')};
    border-radius: 10px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    font-family: 'Outfit', sans-serif;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
`;

const IconCircle = styled.div<{ $isExpired?: boolean }>`
    width: 38px;
    height: 38px;
    min-width: 38px;
    border-radius: 50%;
    background: ${({ $isExpired }) =>
        $isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ $isExpired }) => ($isExpired ? '#ef4444' : '#F59E0B')};
    font-size: 16px;
`;

const TextBlock = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
`;

const Message = styled.div`
    color: #EBF5EE;
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.5;

    strong {
        font-weight: 700;
    }
`;

const RenewLink = styled.a<{ $isExpired?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: ${({ $isExpired }) =>
        $isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
    border: 1px solid
        ${({ $isExpired }) => ($isExpired ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.45)')};
    color: ${({ $isExpired }) => ($isExpired ? '#fca5a5' : '#fbbf24')};
    font-size: 13px;
    font-weight: 600;
    padding: 7px 16px;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.15s ease;
    font-family: 'Outfit', sans-serif;

    &:hover {
        background: ${({ $isExpired }) =>
            $isExpired ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)'};
        color: #ffffff;
        transform: translateY(-1px);
    }

    &:active {
        transform: scale(0.98);
    }
`;

const RenewalNoticeBanner: React.FC = () => {
    const server = ServerContext.useStoreState((state) => state.server.data);
    const expiresAt = (server as any)?.expiresAt;

    if (!expiresAt) return null;

    try {
        const expiry = new Date(expiresAt);
        const now = new Date();
        const diffMs = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        // Format date string nicely: "24 Sep 2026"
        const formattedDate = expiry.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        // 1. Expired (diffDays <= 0)
        if (diffDays <= 0) {
            return (
                <BannerWrap $isExpired>
                    <IconCircle $isExpired>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </IconCircle>
                    <TextBlock>
                        <Message>
                            <strong style={{ color: '#ef4444' }}>Subscription Expired:</strong> Expired on {formattedDate}.
                            Renew within 7 days to keep your files and server data.
                        </Message>
                        <RenewLink href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'} $isExpired>
                            <span>Renew Plan</span>
                            <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: 11 }} />
                        </RenewLink>
                    </TextBlock>
                </BannerWrap>
            );
        }

        // 2. Expiring soon (1 to 7 days)
        if (diffDays <= 7) {
            const daysText = diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`;
            return (
                <BannerWrap>
                    <IconCircle>
                        <FontAwesomeIcon icon={faClock} />
                    </IconCircle>
                    <TextBlock>
                        <Message>
                            <strong style={{ color: '#F59E0B' }}>Renewal Due:</strong> Subscription ends {daysText} ({formattedDate}).
                            Renew now to avoid suspension.
                        </Message>
                        <RenewLink href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                            <span>Renew Plan</span>
                            <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: 11 }} />
                        </RenewLink>
                    </TextBlock>
                </BannerWrap>
            );
        }

        return null;
    } catch {
        return null;
    }
};

export default RenewalNoticeBanner;
