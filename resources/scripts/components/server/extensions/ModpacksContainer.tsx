import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import Spinner from '@/components/elements/Spinner';
import { ServerContext } from '@/state/server';
import http from '@/api/http';
import pullFile from '@/api/server/files/pullFile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faBoxes,
    faDownload,
    faSearch,
    faStar,
    faExternalLinkAlt,
    faExclamationTriangle,
    faTimes,
    faCheck,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

// --- Animations ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
`;

// --- Interfaces ---
interface ModpackItem {
    id: string;
    slug: string;
    name: string;
    description: string;
    author: string;
    iconUrl: string | null;
    downloads: number;
    downloadUrl?: string;
    externalUrl: string;
    platform: 'CurseForge' | 'Modrinth' | 'FTB';
}

// --- Formatters ---
const formatNumber = (num: number): string => {
    if (!num || isNaN(num)) return '0';
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(num);
};

// --- Preset Curated Modpacks (CurseForge & FTB) ---
const CURSEFORGE_MODPACKS: ModpackItem[] = [
    {
        id: 'atm10',
        slug: 'all-the-mods-10',
        name: 'All the Mods 10 - ATM10',
        description: 'The top pack of 2026 with around 500 mods! Tons of quests and a proper endgame.',
        author: 'ATMTeam',
        downloads: 21800000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/1045/487/256/256/638575024467576579.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/all-the-mods-10',
        platform: 'CurseForge',
    },
    {
        id: 'deceasedcraft',
        slug: 'deceasedcraft',
        name: 'DeceasedCraft - Urban Zombie Apocalypse',
        description: 'Explore, loot and shoot your way through cities overrun by the infected in this zombie apocalypse modpack. Master the modern combat and build fortified shelters.',
        author: 'TqLeQuan2',
        downloads: 9400000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/594/162/256/256/637989932062402120.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/deceasedcraft',
        platform: 'CurseForge',
    },
    {
        id: 'prominence2',
        slug: 'prominence-2-fabric',
        name: 'Prominence™ II: Hasturian Era',
        description: 'Lore-rich RPG | Explore the Kingdom of Vaaz with voiced NPCs, a custom Questing System, Custom Gear, Bosses, Talents and endless fantasy exploration.',
        author: 'ElocinDev',
        downloads: 12800000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/873/952/256/256/638302521092823611.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/prominence-2-fabric',
        platform: 'CurseForge',
    },
    {
        id: 'bmc4',
        slug: 'better-mc-forge-bmc4',
        name: 'Better MC [FORGE] BMC4',
        description: "Version 1.20.1 | A Proper Vanilla+ Modpack | Don't play Vanilla play this! 250+ Mods, Dungeons, Bosses, Dimensions, and Questing.",
        author: 'LunaPixelStudios',
        downloads: 18600000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/852/842/256/256/638262799757635928.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/better-mc-forge-bmc4',
        platform: 'CurseForge',
    },
    {
        id: 'rlcraft',
        slug: 'rlcraft',
        name: 'RLCraft',
        description: 'A modpack specially designed to bring an incredibly hardcore and semi-realism challenge revolving around survival, RPG skill trees, dragons and thirst.',
        author: 'Shivaxi',
        downloads: 30200000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/207/357/256/256/636952774187023150.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/rlcraft',
        platform: 'CurseForge',
    },
    {
        id: 'skyfactory4',
        slug: 'skyfactory-4',
        name: 'SkyFactory 4',
        description: 'The quintessential Skyblock experience with full automation, tech trees, bonsai resource trees, and magic.',
        author: 'Darkosto',
        downloads: 10500000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/199/191/256/256/636906236968032747.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/skyfactory-4',
        platform: 'CurseForge',
    },
    {
        id: 'cisco-rpg',
        slug: 'ciscos-medieval-rpg',
        name: "Cisco's Fantasy Medieval RPG [Ultimate]",
        description: 'Handcrafted RPG experience with custom skill trees, class progression, powerful bosses and unique loot.',
        author: 'ciscobad',
        downloads: 5200000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/1050/735/256/256/638649827977539499.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/ciscos-medieval-rpg',
        platform: 'CurseForge',
    },
    {
        id: 'bmc2',
        slug: 'better-mc-fabric-bmc2',
        name: 'Better MC [FABRIC] BMC2',
        description: 'Fabric edition of Better MC offering smooth high-FPS exploration, beautiful shaders, and hundreds of questlines.',
        author: 'LunaPixelStudios',
        downloads: 8400000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/852/842/256/256/638262799757635928.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/better-mc-fabric-bmc2',
        platform: 'CurseForge',
    },
    {
        id: 'allofcreate',
        slug: 'all-of-create',
        name: 'All of Create',
        description: 'Pure Create-focused engineering modpack with factories, trains, automation, and contraptions.',
        author: 'LunaPixelStudios',
        downloads: 2900000,
        iconUrl: 'https://media.forgecdn.net/avatars/thumbnails/852/842/256/256/638262799757635928.png',
        externalUrl: 'https://www.curseforge.com/minecraft/modpacks/all-of-create',
        platform: 'CurseForge',
    },
];

const FTB_MODPACKS: ModpackItem[] = [
    {
        id: 'ftb-stoneblock3',
        slug: 'ftb-stoneblock-3',
        name: 'FTB StoneBlock 3',
        description: 'The third entry in the iconic subterranean series. Tech, magic, dimensions, and chickens in a solid stone world.',
        author: 'FTB Team',
        downloads: 4500000,
        iconUrl: 'https://feed-the-beast.com/images/modpacks/100.png',
        externalUrl: 'https://feed-the-beast.com/modpacks/100-ftb-stoneblock-3',
        platform: 'FTB',
    },
    {
        id: 'ftb-skies',
        slug: 'ftb-skies',
        name: 'FTB Skies',
        description: 'Skyblock experience featuring modern questing, Mana and Artifice, Create, and occultism.',
        author: 'FTB Team',
        downloads: 3200000,
        iconUrl: 'https://feed-the-beast.com/images/modpacks/103.png',
        externalUrl: 'https://feed-the-beast.com/modpacks/103-ftb-skies',
        platform: 'FTB',
    },
    {
        id: 'ftb-revelation',
        slug: 'ftb-revelation',
        name: 'FTB Revelation',
        description: 'General purpose kitchen-sink modpack packed with industrial tech and magic mods.',
        author: 'FTB Team',
        downloads: 7800000,
        iconUrl: 'https://feed-the-beast.com/images/modpacks/35.png',
        externalUrl: 'https://feed-the-beast.com/modpacks/35-ftb-revelation',
        platform: 'FTB',
    },
    {
        id: 'ftb-oceanblock',
        slug: 'ftb-oceanblock',
        name: 'FTB OceanBlock',
        description: 'Skyblock on water — build your base from scratch over the infinite ocean with automated sluices.',
        author: 'FTB Team',
        downloads: 2600000,
        iconUrl: 'https://feed-the-beast.com/images/modpacks/84.png',
        externalUrl: 'https://feed-the-beast.com/modpacks/84-ftb-oceanblock',
        platform: 'FTB',
    },
    {
        id: 'ftb-academy',
        slug: 'ftb-academy',
        name: 'FTB Academy 1.16',
        description: 'Beginner-friendly questing modpack teaching modded Minecraft basics and automation step-by-step.',
        author: 'FTB Team',
        downloads: 2100000,
        iconUrl: 'https://feed-the-beast.com/images/modpacks/31.png',
        externalUrl: 'https://feed-the-beast.com/modpacks/31-ftb-academy-116',
        platform: 'FTB',
    },
];

// --- Styled Components (Strict Bytenodes Warm Obsidian) ---
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #EBF5EE;
    animation: ${fadeIn} 0.22s ease-out;
    padding-bottom: 48px;
`;

const SectionHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0;
    letter-spacing: -0.01em;
`;

const SectionSubtitle = styled.p`
    font-size: 13px;
    color: #8B786D;
    margin: 0;
    line-height: 1.4;
`;

// --- Warning Alert Banner ---
const WarningBanner = styled.div`
    background: #1c1917;
    border: 1px solid rgba(221, 151, 84, 0.28);
    border-radius: 10px;
    padding: 16px 20px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
`;

const WarningIconBox = styled.div`
    color: #dd9754;
    font-size: 18px;
    margin-top: 1px;
    flex-shrink: 0;
`;

const WarningContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const WarningTitle = styled.h3`
    font-size: 13.5px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0;
`;

const WarningDescription = styled.p`
    font-size: 12.5px;
    line-height: 1.5;
    color: #c4b5ac;
    margin: 0;
`;

// --- Filter Bar ---
const FilterBar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: 800px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const ProviderTabs = styled.div`
    display: flex;
    align-items: center;
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.18);
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
    flex-shrink: 0;
`;

const ProviderTab = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'Outfit', sans-serif;
    border: none;

    ${(props) =>
        props.$active
            ? css`
                  background: #25211e;
                  color: #EBF5EE;
                  border: 1px solid rgba(191, 168, 158, 0.3);
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
              `
            : css`
                  background: transparent;
                  color: #8B786D;
                  border: 1px solid transparent;
                  &:hover {
                      color: #EBF5EE;
                      background: rgba(191, 168, 158, 0.05);
                  }
              `}
`;

const SearchInputWrapper = styled.div`
    position: relative;
    flex: 1 1 260px;
    min-width: 220px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #8B786D;
    font-size: 13px;
    pointer-events: none;
`;

const SearchInput = styled.input`
    width: 100%;
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.2);
    border-radius: 8px;
    padding: 9px 14px 9px 38px;
    font-size: 13px;
    color: #EBF5EE;
    font-family: 'Outfit', sans-serif;
    transition: all 0.18s ease;

    &::placeholder {
        color: #8B786D;
    }

    &:focus {
        outline: none;
        border-color: #BFA89E;
        background: #25211e;
        box-shadow: 0 0 0 2px rgba(191, 168, 158, 0.15);
    }
`;

// --- Horizontal Modpack Cards List ---
const ModpacksList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ModpackCard = styled.div`
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.15);
    border-radius: 10px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: all 0.18s ease;

    &:hover {
        background: #25211e;
        border-color: #BFA89E;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 680px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const ModpackLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    flex: 1;
`;

const ThumbnailBox = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 8px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 20px;
    flex-shrink: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ModpackDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
`;

const ModpackTitle = styled.span`
    font-size: 15px;
    font-weight: 700;
    color: #EBF5EE;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ModpackDescription = styled.p`
    font-size: 12.5px;
    line-height: 1.4;
    color: #c4b5ac;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ModpackMeta = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #8B786D;
`;

const ModpackActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;

    @media (max-width: 680px) {
        justify-content: flex-end;
    }
`;

const ExternalLinkButton = styled.a`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.2);
    color: #8B786D;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    text-decoration: none;
    transition: all 0.18s ease;

    &:hover {
        background: #302b27;
        color: #BFA89E;
        border-color: #BFA89E;
    }
`;

const InstallButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.28);
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    color: #EBF5EE;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;

    &:hover {
        background: #BFA89E;
        border-color: #BFA89E;
        color: #181514;
        transform: scale(0.98);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

// --- Modal ---
const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(14, 12, 11, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
    animation: ${fadeIn} 0.15s ease-out;
`;

const ModalContent = styled.div`
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.25);
    border-radius: 12px;
    width: 100%;
    max-width: 540px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    overflow: hidden;
`;

const ModalHeader = styled.div`
    padding: 18px 22px;
    border-bottom: 1px solid rgba(191, 168, 158, 0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #25211e;
`;

const ModalCloseButton = styled.button`
    background: transparent;
    border: none;
    color: #8B786D;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease;

    &:hover {
        color: #EBF5EE;
    }
`;

const ModalBody = styled.div`
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ModalFooter = styled.div`
    padding: 14px 22px;
    border-top: 1px solid rgba(191, 168, 158, 0.15);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background: #1c1917;
`;

// --- Provider Icons SVGs ---
const CurseForgeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.32 8.35c-.17-.4-.5-.7-.91-.84l-5.07-1.7a2.53 2.53 0 0 0-1.68 0L5.59 7.51c-.41.14-.74.44-.91.84L2.09 14.5c-.24.57-.1 1.23.35 1.64.44.42 1.09.52 1.64.26l4.63-2.2c.28-.13.6-.13.88 0l4.63 2.2c.25.12.52.18.79.18.3 0 .6-.08.85-.24.45-.41.59-1.07.35-1.64l-2.59-6.15z" />
    </svg>
);

const ModrinthIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.252 24a11.78 11.78 0 0 1-8.31-3.447C1.353 17.965.008 14.542 0 10.877c.01-3.666 1.358-7.09 3.945-9.678A11.79 11.79 0 0 1 12.252 0c3.27 0 6.35 1.077 8.877 3.082a11.96 11.96 0 0 1 3.42 5.093 1.25 1.25 0 0 1-.77 1.602 1.25 1.25 0 0 1-1.602-.77 9.47 9.47 0 0 0-2.709-4.032A9.3 9.3 0 0 0 12.252 2.5a9.3 9.3 0 0 0-7.147 3.328A9.36 9.36 0 0 0 2.5 10.877c.007 2.894 1.07 5.6 2.605 7.649a9.3 9.3 0 0 0 7.147 3.328 9.31 9.31 0 0 0 6.64-2.825 9.47 9.47 0 0 0 2.709-4.032 1.25 1.25 0 0 1 1.602-.77c.654.248.995.968.77 1.602a11.96 11.96 0 0 1-3.42 5.093 11.78 11.78 0 0 1-8.291 3.078zm1.096-7.854a1.25 1.25 0 0 1-.884-.366l-4.167-4.167a1.25 1.25 0 0 1 1.768-1.768l3.283 3.284 6.84-6.84a1.25 1.25 0 1 1 1.768 1.768l-7.726 7.726a1.25 1.25 0 0 1-.882.363z" />
    </svg>
);

const FTBIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addFlash, clearFlashes } = useFlash();

    // --- State ---
    const [provider, setProvider] = useState<'curseforge' | 'modrinth' | 'ftb'>('curseforge');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [modpacksList, setModpacksList] = useState<ModpackItem[]>([]);

    // --- Install Modal State ---
    const [modalPack, setModalPack] = useState<ModpackItem | null>(null);
    const [confirmedBackup, setConfirmedBackup] = useState(false);
    const [customDownloadUrl, setCustomDownloadUrl] = useState('');
    const [installing, setInstalling] = useState(false);

    // --- Fetch Modpacks ---
    const fetchModpacks = useCallback(() => {
        setLoading(true);

        if (provider === 'curseforge') {
            let list = CURSEFORGE_MODPACKS;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                list = list.filter(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.author.toLowerCase().includes(q)
                );
            }
            setModpacksList(list);
            setLoading(false);
        } else if (provider === 'modrinth') {
            const queryParams = new URLSearchParams();
            queryParams.set('facets', JSON.stringify([['project_type:modpack']]));
            if (searchQuery.trim()) {
                queryParams.set('query', searchQuery.trim());
                queryParams.set('index', 'relevance');
            } else {
                queryParams.set('index', 'downloads');
            }
            queryParams.set('limit', '30');

            fetch(`https://api.modrinth.com/v2/search?${queryParams.toString()}`, {
                headers: { 'User-Agent': 'ByteNodes/1.0 (support@bytenodes.id)' },
            })
                .then((res) => res.json())
                .then((data) => {
                    const hits = data.hits || [];
                    const items: ModpackItem[] = hits.map((h: any) => ({
                        id: h.project_id || h.slug,
                        slug: h.slug,
                        name: h.title,
                        description: h.description,
                        author: h.author,
                        iconUrl: h.icon_url || null,
                        downloads: h.downloads || 0,
                        externalUrl: `https://modrinth.com/modpack/${h.slug}`,
                        platform: 'Modrinth',
                    }));
                    setModpacksList(items);
                })
                .catch((err) => {
                    console.error('Failed to fetch from Modrinth:', err);
                    setModpacksList([]);
                })
                .finally(() => setLoading(false));
        } else {
            let list = FTB_MODPACKS;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                list = list.filter(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.author.toLowerCase().includes(q)
                );
            }
            setModpacksList(list);
            setLoading(false);
        }
    }, [provider, searchQuery]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchModpacks();
        }, 250);
        return () => clearTimeout(timeout);
    }, [fetchModpacks]);

    // --- Action: Open Install Modal ---
    const handleOpenInstall = (pack: ModpackItem) => {
        setModalPack(pack);
        setConfirmedBackup(false);
        setCustomDownloadUrl('');
    };

    // --- Action: Perform Installation ---
    const handleExecuteInstall = async () => {
        if (!modalPack) return;

        setInstalling(true);
        clearFlashes('server-modpacks');

        try {
            let downloadUrl = customDownloadUrl.trim();

            // If Modrinth and no custom URL, fetch latest server release / mrpack
            if (!downloadUrl && modalPack.platform === 'Modrinth') {
                const versionRes = await fetch(
                    `https://api.modrinth.com/v2/project/${modalPack.slug}/version`,
                    { headers: { 'User-Agent': 'ByteNodes/1.0' } }
                );
                const versions = await versionRes.json();
                if (Array.isArray(versions) && versions.length > 0) {
                    const latest = versions[0];
                    const primary =
                        latest.files.find((f: any) => f.primary) ||
                        latest.files[0];
                    if (primary) {
                        downloadUrl = primary.url;
                    }
                }
            }

            // Fallback for CurseForge / FTB if user didn't enter custom URL
            if (!downloadUrl) {
                downloadUrl = modalPack.downloadUrl || '';
            }

            if (downloadUrl) {
                // Pull directly into root directory /
                await pullFile(uuid, downloadUrl, {
                    directory: '/',
                    use_header: true,
                    foreground: false,
                });

                addFlash({
                    key: 'server-modpacks',
                    type: 'success',
                    message: `Modpack "${modalPack.name}" download initiated into server root. Please monitor the console and restart your server once completed.`,
                });
            } else {
                addFlash({
                    key: 'server-modpacks',
                    type: 'info',
                    message: `To install "${modalPack.name}", download the server pack from CurseForge/FTB and upload its files into your server root (/), or paste the direct download URL in the install prompt.`,
                });
            }

            setModalPack(null);
        } catch (err: any) {
            console.error(err);
            addFlash({
                key: 'server-modpacks',
                type: 'error',
                message: err.message || 'Failed to install modpack to server.',
            });
        } finally {
            setInstalling(false);
        }
    };

    return (
        <ServerContentBlock title={'Modpacks'}>
            <FlashMessageRender byKey={'server-modpacks'} className={'mb-4'} />

            <PageContainer>
                {/* --- 1. HEADER & SUBTITLE --- */}
                <SectionHeader>
                    <SectionTitle>Modpacks</SectionTitle>
                    <SectionSubtitle>A pack replaces the server rather than adding to it.</SectionSubtitle>
                </SectionHeader>

                {/* --- 2. WARNING ALERT BANNER --- */}
                <WarningBanner>
                    <WarningIconBox>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </WarningIconBox>
                    <WarningContent>
                        <WarningTitle>A modpack replaces the server</WarningTitle>
                        <WarningDescription>
                            Installing a modpack writes into the server root and overwrites files that share a name. Back up anything you want to keep. The pack&apos;s own installer is run afterwards and the startup command is pointed at what it leaves behind, so the server is ready to start.
                        </WarningDescription>
                    </WarningContent>
                </WarningBanner>

                {/* --- 3. FILTER BAR --- */}
                <FilterBar>
                    <ProviderTabs>
                        <ProviderTab
                            $active={provider === 'curseforge'}
                            onClick={() => setProvider('curseforge')}
                        >
                            <CurseForgeIcon />
                            <span>CurseForge</span>
                        </ProviderTab>
                        <ProviderTab
                            $active={provider === 'modrinth'}
                            onClick={() => setProvider('modrinth')}
                        >
                            <ModrinthIcon />
                            <span>Modrinth</span>
                        </ProviderTab>
                        <ProviderTab
                            $active={provider === 'ftb'}
                            onClick={() => setProvider('ftb')}
                        >
                            <FTBIcon />
                            <span>Feed the Beast</span>
                        </ProviderTab>
                    </ProviderTabs>

                    <SearchInputWrapper>
                        <SearchIcon icon={faSearch} />
                        <SearchInput
                            placeholder={`Search ${provider === 'curseforge' ? 'CurseForge' : provider === 'modrinth' ? 'Modrinth' : 'Feed the Beast'}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchInputWrapper>
                </FilterBar>

                {/* --- 4. HORIZONTAL MODPACK CARDS LIST --- */}
                {loading ? (
                    <div className={'py-12 text-center'}>
                        <Spinner size={'large'} centered />
                    </div>
                ) : modpacksList.length === 0 ? (
                    <div className={'py-12 text-center text-taupe text-sm'}>
                        No modpacks found matching &quot;{searchQuery}&quot;.
                    </div>
                ) : (
                    <ModpacksList>
                        {modpacksList.map((pack) => (
                            <ModpackCard key={pack.id}>
                                <ModpackLeft>
                                    <ThumbnailBox>
                                        {pack.iconUrl ? (
                                            <img
                                                src={pack.iconUrl}
                                                alt={pack.name}
                                                onError={(e) => {
                                                    // Fallback to icon if error
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faBoxes} />
                                        )}
                                    </ThumbnailBox>

                                    <ModpackDetails>
                                        <ModpackTitle title={pack.name}>{pack.name}</ModpackTitle>
                                        <ModpackDescription title={pack.description}>
                                            {pack.description}
                                        </ModpackDescription>
                                        <ModpackMeta>
                                            {formatNumber(pack.downloads)} installs · {pack.author}
                                        </ModpackMeta>
                                    </ModpackDetails>
                                </ModpackLeft>

                                <ModpackActions>
                                    <ExternalLinkButton
                                        href={pack.externalUrl}
                                        target={'_blank'}
                                        rel={'noopener noreferrer'}
                                        title={'Open project page in new tab'}
                                    >
                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                    </ExternalLinkButton>

                                    <InstallButton onClick={() => handleOpenInstall(pack)}>
                                        <FontAwesomeIcon icon={faDownload} style={{ fontSize: 11 }} />
                                        <span>Install</span>
                                    </InstallButton>
                                </ModpackActions>
                            </ModpackCard>
                        ))}
                    </ModpacksList>
                )}
            </PageContainer>

            {/* --- 5. SAFE INSTALLATION MODAL --- */}
            {modalPack && (
                <ModalBackdrop onClick={() => setModalPack(null)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <ThumbnailBox style={{ width: 34, height: 34, fontSize: 14 }}>
                                    {modalPack.iconUrl ? (
                                        <img src={modalPack.iconUrl} alt={modalPack.name} />
                                    ) : (
                                        <FontAwesomeIcon icon={faBoxes} />
                                    )}
                                </ThumbnailBox>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#EBF5EE' }}>
                                        Install {modalPack.name}
                                    </h3>
                                    <span style={{ fontSize: 12, color: '#8B786D' }}>
                                        Server Root Installation
                                    </span>
                                </div>
                            </div>
                            <ModalCloseButton onClick={() => setModalPack(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </ModalCloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <WarningBanner style={{ padding: '12px 16px' }}>
                                <WarningIconBox style={{ fontSize: 16 }}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                </WarningIconBox>
                                <WarningContent>
                                    <WarningTitle style={{ fontSize: 13 }}>Warning: Server Files Will Be Overwritten</WarningTitle>
                                    <WarningDescription style={{ fontSize: 12 }}>
                                        Installing a modpack writes into the server root (/) and replaces existing world, configuration, and mods. Please take a backup if you wish to keep current progress.
                                    </WarningDescription>
                                </WarningContent>
                            </WarningBanner>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#BFA89E' }}>
                                    Direct Server Pack / MRPack URL (Optional)
                                </label>
                                <input
                                    type={'text'}
                                    placeholder={'https://... (leave blank for automatic fetch)'}
                                    value={customDownloadUrl}
                                    onChange={(e) => setCustomDownloadUrl(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: '#25211e',
                                        border: '1px solid rgba(191, 168, 158, 0.25)',
                                        borderRadius: '8px',
                                        padding: '9px 12px',
                                        color: '#EBF5EE',
                                        fontSize: '13px',
                                        fontFamily: 'Outfit, sans-serif',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    fontSize: 12.5,
                                    color: '#EBF5EE',
                                    cursor: 'pointer',
                                    marginTop: 4,
                                }}
                            >
                                <input
                                    type={'checkbox'}
                                    checked={confirmedBackup}
                                    onChange={(e) => setConfirmedBackup(e.target.checked)}
                                    style={{ accentColor: '#BFA89E', width: 16, height: 16, cursor: 'pointer' }}
                                />
                                <span>I understand that existing server files may be overwritten.</span>
                            </label>
                        </ModalBody>

                        <ModalFooter>
                            <button
                                type={'button'}
                                onClick={() => setModalPack(null)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(191, 168, 158, 0.2)',
                                    borderRadius: '8px',
                                    padding: '7px 16px',
                                    color: '#8B786D',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    fontFamily: 'Outfit, sans-serif',
                                }}
                            >
                                Cancel
                            </button>

                            <InstallButton
                                onClick={handleExecuteInstall}
                                disabled={!confirmedBackup || installing}
                                style={{
                                    background: confirmedBackup ? '#BFA89E' : '#25211e',
                                    color: confirmedBackup ? '#181514' : '#8B786D',
                                }}
                            >
                                {installing ? (
                                    <>
                                        <Spinner size={'small'} />
                                        <span>Installing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faDownload} />
                                        <span>Confirm &amp; Install</span>
                                    </>
                                )}
                            </InstallButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </ServerContentBlock>
    );
};
