import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faUserShield,
    faKey,
    faTerminal,
    faHistory,
    faComments,
    faServer,
    faCreditCard,
    faLifeRing,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import styled from 'styled-components/macro';
import SidebarProfileWidget from '@/components/dashboard/SidebarProfileWidget';

interface SidebarProps {
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
}

const Backdrop = styled.div<{ $open: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    z-index: 45;
    opacity: ${(props) => (props.$open ? 1 : 0)};
    pointer-events: ${(props) => (props.$open ? 'auto' : 'none')};
    transition: opacity 0.2s ease;

    @media (min-width: 1024px) {
        display: none;
    }
`;

const SidebarContainer = styled.aside<{ $open: boolean }>`
    width: 250px;
    flex-shrink: 0;
    background-color: #141211;
    border-right: 1px solid rgba(139, 120, 109, 0.18);
    display: flex;
    flex-direction: column;
    padding: 16px 12px 18px 12px;
    z-index: 50;
    box-sizing: border-box;

    /* Always fixed to viewport so scrolling content never scrolls the sidebar */
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    overflow: hidden;
    transform: ${(props) => (props.$open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 1024px) {
        transform: none;
    }
`;

const TopBrandRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px 18px 10px;
    border-bottom: 1px solid rgba(139, 120, 109, 0.15);
    margin-bottom: 16px;
`;

const BrandSection = styled(Link)`
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
`;

const BrandBadge = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: rgba(191, 168, 158, 0.12);
    border: 1px solid rgba(191, 168, 158, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    box-shadow: 0 0 12px rgba(191, 168, 158, 0.15);
    padding: 4px;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const BrandName = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #EBF5EE;
    letter-spacing: -0.02em;
`;

const CloseMobileBtn = styled.button`
    background: transparent;
    border: none;
    color: #8B786D;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #EBF5EE;
    }

    @media (min-width: 1024px) {
        display: none;
    }
`;

const NavScrollArea = styled.div`
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-right: 4px;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(139, 120, 109, 0.2);
        border-radius: 4px;
    }
`;

const CategoryLabel = styled.div`
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #8B786D;
    text-transform: uppercase;
    padding: 16px 12px 6px 12px;
`;

const NavItem = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 9px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #a39288;
    text-decoration: none;
    transition: all 0.15s ease;

    & svg {
        font-size: 15px;
        width: 16px;
        text-align: center;
        color: #8B786D;
        transition: color 0.15s ease;
    }

    &:hover {
        background-color: rgba(191, 168, 158, 0.08);
        color: #EBF5EE;

        & svg {
            color: #BFA89E;
        }
    }

    &.active {
        background-color: #25211e;
        color: #EBF5EE;
        border: 1px solid rgba(191, 168, 158, 0.25);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);

        & svg {
            color: #BFA89E;
        }
    }
`;

const ExternalNavItem = styled.a`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 9px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #a39288;
    text-decoration: none;
    transition: all 0.15s ease;

    & svg {
        font-size: 15px;
        width: 16px;
        text-align: center;
        color: #8B786D;
        transition: color 0.15s ease;
    }

    &:hover {
        background-color: rgba(191, 168, 158, 0.08);
        color: #EBF5EE;

        & svg {
            color: #BFA89E;
        }
    }
`;

export default ({ mobileOpen = false, onCloseMobile }: SidebarProps) => {
    const user = useStoreState((state: ApplicationStore) => state.user.data);

    return (
        <>
            <Backdrop $open={mobileOpen} onClick={onCloseMobile} />
            <SidebarContainer $open={mobileOpen}>
                <TopBrandRow>
                    <BrandSection to="/">
                        <BrandBadge>
                            <img src={'/assets/svgs/pterodactyl.svg'} alt={'Pterodactyl'} />
                        </BrandBadge>
                        <BrandName>Pterodactyl</BrandName>
                    </BrandSection>
                    {onCloseMobile && (
                        <CloseMobileBtn onClick={onCloseMobile}>
                            <FontAwesomeIcon icon={faTimes} />
                        </CloseMobileBtn>
                    )}
                </TopBrandRow>

                <NavScrollArea>
                    <NavItem to="/" exact onClick={onCloseMobile}>
                        <FontAwesomeIcon icon={faTachometerAlt} />
                        <span>Dashboard</span>
                    </NavItem>

                    <CategoryLabel>Account</CategoryLabel>
                    <NavItem to="/account" exact onClick={onCloseMobile}>
                        <FontAwesomeIcon icon={faUserShield} />
                        <span>Overview</span>
                    </NavItem>
                    <NavItem to="/account/api" onClick={onCloseMobile}>
                        <FontAwesomeIcon icon={faKey} />
                        <span>API Credentials</span>
                    </NavItem>
                    <NavItem to="/account/ssh" onClick={onCloseMobile}>
                        <FontAwesomeIcon icon={faTerminal} />
                        <span>SSH Keys</span>
                    </NavItem>
                    <NavItem to="/account/activity" onClick={onCloseMobile}>
                        <FontAwesomeIcon icon={faHistory} />
                        <span>Activity</span>
                    </NavItem>

                    {(() => {
                        const hub = (window as any).SiteConfiguration?.hubLinks;
                        const links = [
                            {
                                key: 'discord',
                                title: 'Discord',
                                icon: faComments,
                                enabled: hub?.discord ? !!hub.discord.enabled : true,
                                url: hub?.discord?.url || 'https://dsc.gg/bytenodes',
                            },
                            {
                                key: 'status',
                                title: 'Nodes Status',
                                icon: faServer,
                                enabled: hub?.status ? !!hub.status.enabled : true,
                                url: hub?.status?.url || 'https://status.bytenodes.id',
                            },
                            {
                                key: 'billing',
                                title: 'Billing',
                                icon: faCreditCard,
                                enabled: hub?.billing ? !!hub.billing.enabled : true,
                                url: hub?.billing?.url || 'https://billing.bytenodes.id',
                            },
                            {
                                key: 'support',
                                title: 'Support',
                                icon: faLifeRing,
                                enabled: hub?.support ? !!hub.support.enabled : true,
                                url: hub?.support?.url || 'https://dsc.gg/bytenodes',
                            },
                        ].filter((l) => l.enabled && l.url);

                        if (links.length === 0) return null;

                        return (
                            <>
                                <CategoryLabel>Links</CategoryLabel>
                                {links.map((link) => (
                                    <ExternalNavItem key={link.key} href={link.url} target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon icon={link.icon} />
                                        <span>{link.title}</span>
                                    </ExternalNavItem>
                                ))}
                            </>
                        );
                    })()}
                </NavScrollArea>

                <div style={{ flexShrink: 0, marginTop: 'auto', paddingTop: '8px' }}>
                    <SidebarProfileWidget
                        username={user?.username || 'User'}
                        email={user?.email || ''}
                        isAdmin={user?.rootAdmin}
                    />
                </div>
            </SidebarContainer>
        </>
    );
};
