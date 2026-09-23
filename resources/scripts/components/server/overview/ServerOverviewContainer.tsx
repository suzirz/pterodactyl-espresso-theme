import React from 'react';
import styled from 'styled-components';
import { ServerContext } from '@/state/server';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTerminal,
    faFolder,
    faExternalLinkAlt,
    faServer,
    faShieldAlt,
    faLifeRing,
} from '@fortawesome/free-solid-svg-icons';
import RenewalNoticeBanner from './RenewalNoticeBanner';
import ServerMetricsRow from './ServerMetricsRow';
import ServerInfoCard from './ServerInfoCard';
import ServerBillingCard from './ServerBillingCard';

const OverviewWrapper = styled.div`
    padding: 0;
    font-family: 'Outfit', sans-serif;
`;

const HeroHeader = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.22);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    @media (min-width: 900px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const HeroLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
`;

const BrandLogoWrap = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: #141211;
    border: 1px solid rgba(191, 168, 158, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    flex-shrink: 0;
    box-shadow: 0 0 16px rgba(191, 168, 158, 0.12);

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const ServerTitles = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ServerName = styled.h1`
    font-size: 20px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;

const MetaPills = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const Pill = styled.span<{ $color?: string; $bg?: string; $border?: string }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: ${({ $bg }) => $bg || '#25211e'};
    border: 1px solid ${({ $border }) => $border || 'rgba(139, 120, 109, 0.25)'};
    color: ${({ $color }) => $color || '#BFA89E'};
`;

const HeroActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;

const QuickActionBtn = styled(NavLink)`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: 8px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.25);
    color: #EBF5EE;
    font-size: 12.5px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(191, 168, 158, 0.12);
        border-color: #BFA89E;
        color: #BFA89E;
    }
`;

const SupportBtn = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 8px;
    background: #BFA89E;
    border: 1px solid #BFA89E;
    color: #141211;
    font-size: 12.5px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
        background: #d4bfb5;
        border-color: #d4bfb5;
        box-shadow: 0 4px 12px rgba(191, 168, 158, 0.25);
    }
`;

const SectionTitle = styled.h2`
    font-size: 16px;
    font-weight: 600;
    color: #EBF5EE;
    margin: 20px 0 14px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
        content: '';
        display: block;
        width: 3px;
        height: 16px;
        border-radius: 2px;
        background: #BFA89E;
    }
`;

const SplitRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const ServerOverviewContainer: React.FC = () => {
    const server = ServerContext.useStoreState((state) => state.server.data);
    const serverId = server?.id;
    const isSuspended = server?.isSuspended;

    return (
        <OverviewWrapper>
            <HeroHeader>
                <HeroLeft>
                    <BrandLogoWrap title={'Pterodactyl'}>
                        <img src={'/assets/svgs/pterodactyl.svg'} alt={'Pterodactyl Logo'} />
                    </BrandLogoWrap>
                    <ServerTitles>
                        <ServerName>{server?.name || 'Server Overview'}</ServerName>
                        <MetaPills>
                            <Pill
                                $color={isSuspended ? '#ef4444' : '#22c55e'}
                                $bg={isSuspended ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)'}
                                $border={isSuspended ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)'}
                            >
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSuspended ? '#ef4444' : '#22c55e' }} />
                                {isSuspended ? 'Suspended' : 'Online'}
                            </Pill>
                            {server?.node && (
                                <Pill>
                                    <FontAwesomeIcon icon={faServer} style={{ fontSize: 10 }} />
                                    {server.node}
                                </Pill>
                            )}
                            <Pill $color={'#BFA89E'}>
                                <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: 10 }} />
                                Protected
                            </Pill>
                        </MetaPills>
                    </ServerTitles>
                </HeroLeft>

                <HeroActions>
                    <QuickActionBtn to={`/server/${serverId}/console`}>
                        <FontAwesomeIcon icon={faTerminal} />
                        <span>Console</span>
                    </QuickActionBtn>
                    <QuickActionBtn to={`/server/${serverId}/files`}>
                        <FontAwesomeIcon icon={faFolder} />
                        <span>Files</span>
                    </QuickActionBtn>
                    <SupportBtn href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                        <FontAwesomeIcon icon={faLifeRing} />
                        <span>24/7 Support</span>
                    </SupportBtn>
                </HeroActions>
            </HeroHeader>

            <RenewalNoticeBanner />

            <SectionTitle>Live Resource Metrics</SectionTitle>
            <ServerMetricsRow />

            <SectionTitle>Instance Details & Subscription</SectionTitle>
            <SplitRow>
                <ServerInfoCard />
                <ServerBillingCard />
            </SplitRow>
        </OverviewWrapper>
    );
};

export default ServerOverviewContainer;
