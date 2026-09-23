import React, { useState, useEffect } from 'react';
import { NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import Can from '@/components/elements/Can';
import copy from 'copy-to-clipboard';
import { ip } from '@/lib/formatters';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTerminal,
    faFolder,
    faSlidersH,
    faCog,
    faDatabase,
    faArchive,
    faCloud,
    faNetworkWired,
    faUserFriends,
    faServer,
    faCopy,
    faCheck,
    faExternalLinkAlt,
    faTimes,
    faArrowLeft,
    faThLarge,
    faLifeRing,
    faRocket,
    faCreditCard,
    faUser,
    faPlug,
    faBoxes,
    faCube,
    faTag,
    faGlobe,
    faMapMarkedAlt,
    faPaw,
    faCar,
    faExchangeAlt,
    faGlobeAmericas,
    faChevronDown,
    faHeadset,
    faTicketAlt,
    faBook,
    faCalendarAlt,
    faWaveSquare,
    faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
}

const Backdrop = styled.div<{ $open: boolean }>`
    display: ${(props) => (props.$open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    z-index: 49;

    @media (min-width: 1024px) {
        display: none;
    }
`;

const SidebarContainer = styled.aside<{ $open: boolean }>`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    background-color: #141211;
    border-right: 1px solid rgba(139, 120, 109, 0.18);
    display: flex;
    flex-direction: column;
    padding: 16px 12px 20px;
    box-sizing: border-box;
    z-index: 50;
    transition: transform 0.25s ease-in-out;
    transform: ${(props) => (props.$open ? 'translateX(0)' : 'translateX(-100%)')};

    @media (min-width: 1024px) {
        position: sticky;
        top: 0;
        height: 100vh;
        align-self: flex-start;
        transform: none;
        flex-shrink: 0;
    }
`;

const ScrollableNav = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-top: 8px;
    padding-right: 2px;

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
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(191, 168, 158, 0.4);
    }
`;

const MobileCloseBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background-color: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.25);
    color: #8B786D;
    font-size: 14px;
    cursor: pointer;
    margin-left: auto;
    margin-bottom: 8px;
    transition: all 0.15s ease;

    &:hover {
        color: #EBF5EE;
        background-color: #25211e;
    }

    @media (min-width: 1024px) {
        display: none;
    }
`;

const BackLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 6px;
    color: #8B786D;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    margin-bottom: 10px;
    transition: all 0.15s ease;

    & svg {
        transition: transform 0.15s ease;
    }

    &:hover {
        color: #EBF5EE;
        background-color: rgba(191, 168, 158, 0.08);

        & svg {
            transform: translateX(-2px);
        }
    }
`;

const ServerMiniCard = styled.div`
    background-color: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.22);
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
`;

const ServerHeaderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const ServerAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(191, 168, 158, 0.12);
    border: 1px solid rgba(191, 168, 158, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 14px;
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(191, 168, 158, 0.15);
`;

const ServerDetailsCol = styled.div`
    flex: 1;
    min-width: 0;
`;

const ServerNameText = styled.span`
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: #EBF5EE;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StatusDot = styled.span<{ $status: string }>`
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${(props) => {
        switch (props.$status) {
            case 'running':
                return '#22c55e';
            case 'starting':
                return '#eab308';
            case 'stopping':
                return '#f97316';
            default:
                return '#ef4444';
        }
    }};
    box-shadow: 0 0 6px
        ${(props) => {
            switch (props.$status) {
                case 'running':
                    return '#22c55e';
                case 'starting':
                    return '#eab308';
                default:
                    return 'transparent';
            }
        }};
`;

const NodeRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
`;

const NodePill = styled.span`
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    background-color: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.25);
    color: #BFA89E;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const AddressCopyBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    padding: 5px 8px;
    border-radius: 6px;
    background-color: #12100f;
    border: 1px solid rgba(139, 120, 109, 0.2);
    color: #a39288;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.15s ease;

    & > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
        flex: 1;
        text-align: left;
    }

    & svg {
        flex-shrink: 0;
        transition: color 0.15s ease;
    }

    &:hover {
        border-color: rgba(191, 168, 158, 0.4);
        background-color: #181514;
        color: #EBF5EE;

        & svg {
            color: #BFA89E;
        }
    }
`;

const CategorySection = styled.div`
    margin-top: 6px;
    margin-bottom: 6px;
`;

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #8B786D;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
    border-radius: 6px;
    transition: all 0.15s ease;

    &:hover {
        color: #BFA89E;
        background-color: rgba(191, 168, 158, 0.08);
    }
`;

const CategoryChevron = styled.span<{ $open: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #8B786D;
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$open ? 'rotate(0deg)' : 'rotate(-90deg)')};
`;

const NavItemLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6.5px 12px;
    border-radius: 8px;
    color: #a39288;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s ease;
    margin-bottom: 2px;

    & .item-icon {
        font-size: 14px;
        width: 16px;
        text-align: center;
        color: #8B786D;
        transition: color 0.15s ease;
    }

    &:hover {
        color: #EBF5EE;
        background-color: rgba(191, 168, 158, 0.08);

        & .item-icon {
            color: #BFA89E;
        }
    }

    &.active {
        color: #EBF5EE;
        background-color: #25211e;
        font-weight: 600;
        border: 1px solid rgba(191, 168, 158, 0.25);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25), 0 0 12px rgba(191, 168, 158, 0.08);

        & .item-icon {
            color: #BFA89E;
        }
    }
`;

const NavItemBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 6.5px 12px;
    border-radius: 8px;
    color: #a39288;
    background: transparent;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-bottom: 2px;
    text-align: left;

    & .item-icon {
        font-size: 14px;
        width: 16px;
        text-align: center;
        color: #8B786D;
        transition: color 0.15s ease;
    }

    &:hover {
        color: #EBF5EE;
        background-color: rgba(191, 168, 158, 0.08);

        & .item-icon {
            color: #BFA89E;
        }
    }
`;

const NavExternalLink = styled.a`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6.5px 12px;
    border-radius: 8px;
    color: #a39288;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s ease;
    margin-bottom: 2px;

    & .item-icon {
        font-size: 14px;
        width: 16px;
        text-align: center;
        color: #8B786D;
        transition: color 0.15s ease;
    }

    &:hover {
        color: #EBF5EE;
        background-color: rgba(191, 168, 158, 0.08);

        & .item-icon {
            color: #BFA89E;
        }
    }
`;

const PremiumBadge = styled.span`
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #141211;
    font-size: 9px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    margin-left: auto;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.25);
`;

const AdminExternalLink = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 8px;
    color: #8B786D;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s ease;
    margin-top: 10px;
    border: 1px solid rgba(139, 120, 109, 0.2);

    &:hover {
        color: #EBF5EE;
        background-color: rgba(191, 168, 158, 0.08);
        border-color: rgba(191, 168, 158, 0.35);
    }
`;

/* Staff Support Modal */
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
`;

const ModalCard = styled.div`
    background: #181514;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 16px;
    width: 100%;
    max-width: 440px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    font-family: 'Outfit', sans-serif;
`;

export default ({ mobileOpen = false, onCloseMobile }: SidebarProps) => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const server = ServerContext.useStoreState((state) => state.server.data);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const serverId = server?.internalId;
    const [copied, setCopied] = useState(false);
    const [supportModal, setSupportModal] = useState(false);

    // Collapsible Categories state
    const [openCategories, setOpenCategories] = useState({
        mcUtils: true,
        hytale: false,
        palworld: false,
        fivem: false,
        management: true,
    });

    // Auto open accordion if current route belongs to it
    useEffect(() => {
        const p = location.pathname;
        if (p.includes('/players') || p.includes('/plugins') || p.includes('/mods') || p.includes('/modpacks') || p.includes('/version') || p.includes('/properties') || p.includes('/worlds') || p.includes('/world-viewer')) {
            setOpenCategories((prev) => ({ ...prev, mcUtils: true }));
        } else if (p.includes('/hytale-mods')) {
            setOpenCategories((prev) => ({ ...prev, hytale: true }));
        } else if (p.includes('/palworld-mods')) {
            setOpenCategories((prev) => ({ ...prev, palworld: true }));
        } else if (p.includes('/fivem')) {
            setOpenCategories((prev) => ({ ...prev, fivem: true }));
        } else if (p.includes('/databases') || p.includes('/backups') || p.includes('/cloud-backups') || p.includes('/network') || p.includes('/schedules') || p.includes('/users') || p.includes('/activity') || p.includes('/switch-egg') || p.includes('/subdomains')) {
            setOpenCategories((prev) => ({ ...prev, management: true }));
        }
    }, [location.pathname]);

    const toggleCat = (cat: 'mcUtils' | 'hytale' | 'palworld' | 'fivem' | 'management') => {
        setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
    };

    const defaultAlloc = server?.allocations?.find((alloc) => alloc.isDefault);
    const connString = defaultAlloc ? `${defaultAlloc.alias || ip(defaultAlloc.ip)}:${defaultAlloc.port}` : '';

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (connString) {
            copy(connString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const to = (path: string) => {
        if (path === '/') return match.url;
        return `${match.url.replace(/\/*$/, '')}/${path.replace(/^\/+/, '')}`;
    };

    return (
        <>
            <Backdrop $open={mobileOpen} onClick={onCloseMobile} />
            <SidebarContainer $open={mobileOpen}>
                <MobileCloseBtn onClick={onCloseMobile}>
                    <FontAwesomeIcon icon={faTimes} />
                </MobileCloseBtn>

                <BackLink to={'/'}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Dashboard</span>
                </BackLink>

                <ServerMiniCard>
                    <ServerHeaderRow>
                        <ServerAvatar>
                            <FontAwesomeIcon icon={faServer} />
                        </ServerAvatar>
                        <ServerDetailsCol>
                            <ServerNameText title={server?.name}>{server?.name || 'Loading...'}</ServerNameText>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <StatusDot $status={status || 'offline'} />
                                <span style={{ fontSize: '11px', color: '#8B786D', textTransform: 'uppercase', fontWeight: 600 }}>
                                    {status || 'offline'}
                                </span>
                            </div>
                        </ServerDetailsCol>
                    </ServerHeaderRow>

                    <NodeRow>
                        {server?.node && <NodePill>{server.node}</NodePill>}
                    </NodeRow>

                    {connString && (
                        <AddressCopyBtn onClick={handleCopy} title={`${connString} (Klik untuk menyalin)`}>
                            <span>{connString}</span>
                            <FontAwesomeIcon
                                icon={copied ? faCheck : faCopy}
                                style={{ fontSize: '10px', color: copied ? '#22c55e' : '#8B786D' }}
                            />
                        </AddressCopyBtn>
                    )}
                </ServerMiniCard>

                <ScrollableNav>
                    {/* 1. ESSENTIALS */}
                    <CategorySection>
                        <CategoryHeader style={{ cursor: 'default' }}>
                            <span>ESSENTIALS</span>
                        </CategoryHeader>

                        <NavItemLink
                            to={to('/')}
                            exact
                            isActive={(m, loc) => !!m && !loc.pathname.endsWith('/console')}
                            onClick={onCloseMobile}
                        >
                            <FontAwesomeIcon icon={faThLarge} className={'item-icon'} />
                            <span>Overview</span>
                        </NavItemLink>

                        <Can action={['control.console-view', 'control.console', 'websocket.connect']} matchAny>
                            <NavItemLink
                                to={to('/console')}
                                exact
                                isActive={(m, loc) => !!m && loc.pathname.endsWith('/console')}
                                onClick={onCloseMobile}
                            >
                                <FontAwesomeIcon icon={faTerminal} className={'item-icon'} />
                                <span>Console</span>
                            </NavItemLink>
                        </Can>

                        <Can action={'file.*'} matchAny>
                            <NavItemLink to={to('/files')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faFolder} className={'item-icon'} />
                                <span>Files</span>
                            </NavItemLink>
                        </Can>

                        <NavItemLink to={to('/support')} onClick={onCloseMobile}>
                            <FontAwesomeIcon icon={faLifeRing} className={'item-icon'} />
                            <span>Staff Support</span>
                        </NavItemLink>

                        <Can action={'startup.*'} matchAny>
                            <NavItemLink to={to('/startup')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faRocket} className={'item-icon'} />
                                <span>Startup</span>
                            </NavItemLink>
                        </Can>

                        <Can action={['settings.*', 'file.sftp']} matchAny>
                            <NavItemLink to={to('/settings')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faCog} className={'item-icon'} />
                                <span>Settings</span>
                            </NavItemLink>
                        </Can>

                        {!server?.isSplitChild && (server?.featureLimits?.splits ?? 0) !== -1 && (
                            <NavItemLink to={to('/splitter')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faCodeBranch} className={'item-icon'} />
                                <span>Server Splitter</span>
                            </NavItemLink>
                        )}

                        <NavExternalLink href={'https://discord.gg'} target={'_blank'} rel={'noopener noreferrer'}>
                            <FontAwesomeIcon icon={faCreditCard} className={'item-icon'} />
                            <span>Secret ...</span>
                            <PremiumBadge>PREMIUM</PremiumBadge>
                            <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '10px', color: '#8B786D' }} />
                        </NavExternalLink>
                    </CategorySection>

                    {/* 2. MC UTILS */}
                    <CategorySection>
                        <CategoryHeader onClick={() => toggleCat('mcUtils')}>
                            <span>MC UTILS</span>
                            <CategoryChevron $open={openCategories.mcUtils}>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </CategoryChevron>
                        </CategoryHeader>

                        {openCategories.mcUtils && (
                            <>
                                <NavItemLink to={to('/players')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faUser} className={'item-icon'} />
                                    <span>Players</span>
                                </NavItemLink>
                                <NavItemLink to={to('/plugins')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faPlug} className={'item-icon'} />
                                    <span>Plugins</span>
                                </NavItemLink>
                                <NavItemLink to={to('/mods')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faBoxes} className={'item-icon'} />
                                    <span>Mods</span>
                                </NavItemLink>
                                <NavItemLink to={to('/modpacks')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faCube} className={'item-icon'} />
                                    <span>Modpacks</span>
                                </NavItemLink>
                                <NavItemLink to={to('/version')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faTag} className={'item-icon'} />
                                    <span>Version</span>
                                </NavItemLink>
                                <NavItemLink to={to('/properties')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faSlidersH} className={'item-icon'} />
                                    <span>Server Properties</span>
                                </NavItemLink>
                                <NavItemLink to={to('/worlds')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faGlobe} className={'item-icon'} />
                                    <span>Worlds</span>
                                </NavItemLink>
                                <NavItemLink to={to('/world-viewer')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className={'item-icon'} />
                                    <span>World Viewer</span>
                                </NavItemLink>
                            </>
                        )}
                    </CategorySection>

                    {/* 3. HYTALE */}
                    <CategorySection>
                        <CategoryHeader onClick={() => toggleCat('hytale')}>
                            <span>HYTALE</span>
                            <CategoryChevron $open={openCategories.hytale}>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </CategoryChevron>
                        </CategoryHeader>

                        {openCategories.hytale && (
                            <NavItemLink to={to('/hytale-mods')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faBoxes} className={'item-icon'} />
                                <span>Hytale Mods</span>
                            </NavItemLink>
                        )}
                    </CategorySection>

                    {/* 4. PALWORLD */}
                    <CategorySection>
                        <CategoryHeader onClick={() => toggleCat('palworld')}>
                            <span>PALWORLD</span>
                            <CategoryChevron $open={openCategories.palworld}>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </CategoryChevron>
                        </CategoryHeader>

                        {openCategories.palworld && (
                            <NavItemLink to={to('/palworld-mods')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faPaw} className={'item-icon'} />
                                <span>Palworld Mods</span>
                            </NavItemLink>
                        )}
                    </CategorySection>

                    {/* 5. FIVEM */}
                    <CategorySection>
                        <CategoryHeader onClick={() => toggleCat('fivem')}>
                            <span>FIVEM</span>
                            <CategoryChevron $open={openCategories.fivem}>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </CategoryChevron>
                        </CategoryHeader>

                        {openCategories.fivem && (
                            <NavItemLink to={to('/fivem')} onClick={onCloseMobile}>
                                <FontAwesomeIcon icon={faCar} className={'item-icon'} />
                                <span>FiveM</span>
                            </NavItemLink>
                        )}
                    </CategorySection>

                    {/* 6. MANAGEMENT */}
                    <CategorySection>
                        <CategoryHeader onClick={() => toggleCat('management')}>
                            <span>MANAGEMENT</span>
                            <CategoryChevron $open={openCategories.management}>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </CategoryChevron>
                        </CategoryHeader>

                        {openCategories.management && (
                            <>
                                <Can action={'database.*'} matchAny>
                                    <NavItemLink to={to('/databases')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faDatabase} className={'item-icon'} />
                                        <span>Databases</span>
                                    </NavItemLink>
                                </Can>
                                <Can action={'backup.*'} matchAny>
                                    <NavItemLink to={to('/backups')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faArchive} className={'item-icon'} />
                                        <span>Backups</span>
                                    </NavItemLink>
                                </Can>
                                <Can action={'backup.*'} matchAny>
                                    <NavItemLink to={to('/cloud-backups')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faCloud} className={'item-icon'} />
                                        <span>Cloud Backups</span>
                                    </NavItemLink>
                                </Can>
                                <Can action={'allocation.*'} matchAny>
                                    <NavItemLink to={to('/network')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faNetworkWired} className={'item-icon'} />
                                        <span>Network</span>
                                    </NavItemLink>
                                </Can>
                                <Can action={'schedule.*'} matchAny>
                                    <NavItemLink to={to('/schedules')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faCalendarAlt} className={'item-icon'} />
                                        <span>Schedules</span>
                                    </NavItemLink>
                                </Can>
                                <Can action={'user.*'} matchAny>
                                    <NavItemLink to={to('/users')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faUserFriends} className={'item-icon'} />
                                        <span>Users</span>
                                    </NavItemLink>
                                </Can>
                                <Can action={'activity.*'} matchAny>
                                    <NavItemLink to={to('/activity')} onClick={onCloseMobile}>
                                        <FontAwesomeIcon icon={faWaveSquare} className={'item-icon'} />
                                        <span>Activity</span>
                                    </NavItemLink>
                                </Can>
                                <NavItemLink to={to('/switch-egg')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faExchangeAlt} className={'item-icon'} />
                                    <span>Switch egg</span>
                                </NavItemLink>
                                <NavItemLink to={to('/subdomains')} onClick={onCloseMobile}>
                                    <FontAwesomeIcon icon={faGlobeAmericas} className={'item-icon'} />
                                    <span>Subdomains</span>
                                </NavItemLink>
                            </>
                        )}
                    </CategorySection>
                </ScrollableNav>

                {rootAdmin && (
                    <AdminExternalLink
                        href={`/admin/servers/view/${serverId}`}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                        <span>Admin Area</span>
                    </AdminExternalLink>
                )}
            </SidebarContainer>

            {/* Staff Support Modal */}
            {supportModal && (
                <ModalOverlay onClick={() => setSupportModal(false)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(191, 168, 158, 0.12)', border: '1px solid rgba(191, 168, 158, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA89E', fontSize: '16px' }}>
                                    <FontAwesomeIcon icon={faHeadset} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#EBF5EE', margin: 0 }}>Support</h3>
                                    <span style={{ fontSize: '12px', color: '#8B786D' }}>Select your preferred help channel</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSupportModal(false)}
                                style={{ background: 'transparent', border: 'none', color: '#8B786D', fontSize: '16px', cursor: 'pointer' }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <a
                                href="https://discord.gg"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: '#1c1917', border: '1px solid rgba(139, 120, 109, 0.22)', textDecoration: 'none', color: '#EBF5EE', transition: 'all 0.15s ease' }}
                            >
                                <FontAwesomeIcon icon={faHeadset} style={{ fontSize: '20px', color: '#5865F2' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Discord 24/7 Priority Support</div>
                                    <div style={{ fontSize: '12px', color: '#8B786D' }}>Fast responses from staff and active community</div>
                                </div>
                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '12px', color: '#8B786D' }} />
                            </a>

                            <a
                                href="https://discord.gg"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: '#1c1917', border: '1px solid rgba(139, 120, 109, 0.22)', textDecoration: 'none', color: '#EBF5EE', transition: 'all 0.15s ease' }}
                            >
                                <FontAwesomeIcon icon={faTicketAlt} style={{ fontSize: '18px', color: '#BFA89E' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Official Ticket Portal</div>
                                    <div style={{ fontSize: '12px', color: '#8B786D' }}>Submit a formal technical or billing inquiry</div>
                                </div>
                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '12px', color: '#8B786D' }} />
                            </a>

                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: '#1c1917', border: '1px solid rgba(139, 120, 109, 0.22)', textDecoration: 'none', color: '#EBF5EE', transition: 'all 0.15s ease' }}
                            >
                                <FontAwesomeIcon icon={faBook} style={{ fontSize: '18px', color: '#BFA89E' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Knowledgebase & Docs</div>
                                    <div style={{ fontSize: '12px', color: '#8B786D' }}>Guides, tutorials, and server optimization tips</div>
                                </div>
                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '12px', color: '#8B786D' }} />
                            </a>
                        </div>
                    </ModalCard>
                </ModalOverlay>
            )}
        </>
    );
};
