import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import http from '@/api/http';
import Spinner from '@/components/elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlug,
    faCube,
    faBoxes,
    faDownload,
    faSearch,
    faStar,
    faPlus,
    faCloudDownloadAlt,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

// --- Animations ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: 'Outfit', sans-serif;
    color: #EBF5EE;
    animation: ${fadeIn} 0.22s ease-out;
`;

const NavTabs = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(191, 168, 158, 0.18);
    padding-bottom: 12px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    background: ${(props) => (props.$active ? '#25211e' : '#181514')};
    color: ${(props) => (props.$active ? '#EBF5EE' : '#8B786D')};
    border: 1px solid ${(props) => (props.$active ? 'rgba(191, 168, 158, 0.35)' : 'rgba(191, 168, 158, 0.15)')};
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'Outfit', sans-serif;

    &:hover {
        background: #25211e;
        color: #EBF5EE;
        border-color: rgba(191, 168, 158, 0.3);
    }
`;

const BannerCard = styled.div`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.22);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

const BannerLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const BannerIconCircle = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(191, 168, 158, 0.1);
    border: 1px solid rgba(191, 168, 158, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 15px;
`;

const BannerText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;

    .title {
        font-size: 14px;
        font-weight: 700;
        color: #EBF5EE;
    }
    .desc {
        font-size: 12px;
        color: #8B786D;
    }
`;

const CustomUrlBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #25211e;
    color: #EBF5EE;
    border: 1px solid rgba(191, 168, 158, 0.25);
    border-radius: 7px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'Outfit', sans-serif;

    &:hover {
        background: #352e2a;
        border-color: rgba(191, 168, 158, 0.45);
    }
`;

const ControlBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

const SearchInputWrapper = styled.div`
    position: relative;
    flex: 1;
    min-width: 260px;
    max-width: 500px;

    input {
        width: 100%;
        background: #181514;
        border: 1px solid rgba(191, 168, 158, 0.2);
        border-radius: 8px;
        padding: 9px 14px 9px 38px;
        font-size: 13px;
        color: #EBF5EE;
        font-family: 'Outfit', sans-serif;
        box-sizing: border-box;
        transition: border-color 0.18s ease;

        &:focus {
            outline: none;
            border-color: #BFA89E;
            box-shadow: 0 0 0 2px rgba(191, 168, 158, 0.15);
        }

        &::placeholder {
            color: #8B786D;
        }
    }

    .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #8B786D;
        font-size: 13px;
        pointer-events: none;
    }
`;

const SelectDropdown = styled.select`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.2);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    color: #EBF5EE;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    outline: none;
    transition: border-color 0.18s ease;

    &:focus {
        border-color: #BFA89E;
    }

    option {
        background: #181514;
        color: #EBF5EE;
    }
`;

const ItemsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 14px;
`;

const ItemCard = styled.div`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.18);
    border-radius: 10px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(191, 168, 158, 0.4);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    }
`;

const ItemLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
`;

const ItemIconBox = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 9px;
    background: #25211e;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid rgba(191, 168, 158, 0.12);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const FallbackIcon = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 18px;
    background: rgba(191, 168, 158, 0.08);
`;

const ItemInfo = styled.div`
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
`;

const ItemName = styled.h4`
    font-size: 13.5px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ItemSummary = styled.p`
    font-size: 11.5px;
    color: #8B786D;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    color: #8B786D;
    margin-top: 2px;

    span {
        display: flex;
        align-items: center;
        gap: 4px;
    }
`;

const InstallBtn = styled.button<{ $installed?: boolean }>`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    background: ${(props) => (props.$installed ? '#22c55e22' : '#25211e')};
    color: ${(props) => (props.$installed ? '#22c55e' : '#EBF5EE')};
    border: 1px solid ${(props) => (props.$installed ? '#22c55e55' : 'rgba(191, 168, 158, 0.25)')};
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.18s ease;
    font-family: 'Outfit', sans-serif;

    &:hover:not(:disabled) {
        background: #352e2a;
        border-color: rgba(191, 168, 158, 0.5);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const EmptyNotice = styled.div`
    background: #181514;
    border: 1px dashed rgba(191, 168, 158, 0.25);
    border-radius: 12px;
    padding: 50px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .icon {
        font-size: 28px;
        color: #8B786D;
    }
    h4 {
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        color: #EBF5EE;
    }
    p {
        font-size: 13px;
        color: #8B786D;
        margin: 0;
        max-width: 420px;
    }
`;

// Modal
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const ModalBox = styled.div`
    background: #181514;
    border: 1px solid rgba(191, 168, 158, 0.3);
    border-radius: 14px;
    width: 100%;
    max-width: 480px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    font-family: 'Outfit', sans-serif;

    label {
        font-size: 12px;
        font-weight: 600;
        color: #BFA89E;
        margin-bottom: 4px;
        display: block;
    }

    input {
        width: 100%;
        background: #25211e;
        border: 1px solid rgba(191, 168, 158, 0.2);
        border-radius: 7px;
        padding: 9px 12px;
        color: #EBF5EE;
        font-size: 13px;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: #BFA89E;
        }
    }
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 6px;
`;

// --- Interfaces ---
interface PackageItem {
    id: string | number;
    name: string;
    summary: string;
    icon?: string;
    downloads?: number;
    rating?: number;
    downloadUrl?: string;
}

interface PluginItem {
    id: number;
    name: string;
    tag: string;
    downloads: number;
    rating: {
        average: number;
    };
    icon?: {
        url?: string;
    };
}

// Popular Minecraft Mods
const PRESET_MODS: PackageItem[] = [
    { id: 'jei', name: 'Just Enough Items (JEI)', summary: 'View Items, Recipes and Usages in-game seamlessly', downloads: 284000000, icon: 'https://cdn.modrinth.com/data/u6dRKJwZ/icon.png' },
    { id: 'sodium', name: 'Sodium', summary: 'Modern rendering engine and FPS optimization mod for Minecraft', downloads: 41000000, icon: 'https://cdn.modrinth.com/data/AANobbMI/icon.png' },
    { id: 'create', name: 'Create', summary: 'Aesthetic technology, automation, kinetics and contraptions', downloads: 78000000, icon: 'https://cdn.modrinth.com/data/LNytGWDc/icon.png' },
    { id: 'iris', name: 'Iris Shaders', summary: 'Modern shaderpack support compatible with Sodium performance', downloads: 35000000, icon: 'https://cdn.modrinth.com/data/YL57xq9U/icon.png' },
    { id: 'appleskin', name: 'AppleSkin', summary: 'Food value and saturation HUD information for players', downloads: 156000000, icon: 'https://cdn.modrinth.com/data/EsAfCjCV/icon.png' },
    { id: 'journeymap', name: 'JourneyMap', summary: 'Real-time mapping in-game or in a web browser as you explore', downloads: 215000000, icon: 'https://cdn.modrinth.com/data/mOgUtBDg/icon.png' },
    { id: 'waystones', name: 'Waystones', summary: 'Teleport to discovered waystones with scroll or warp stone', downloads: 142000000, icon: 'https://cdn.modrinth.com/data/ohNO6lps/icon.png' },
    { id: 'clumps', name: 'Clumps', summary: 'Clumps XP orbs together to reduce entity lag and boost FPS', downloads: 189000000, icon: 'https://cdn.modrinth.com/data/Wnxd13zP/icon.png' },
    { id: 'farmers-delight', name: "Farmer\'s Delight", summary: 'Gently expands farming and cooking in Minecraft vanilla style', downloads: 68000000, icon: 'https://cdn.modrinth.com/data/4I1GQGQb/icon.png' },
    { id: 'spark', name: 'Spark Profiler', summary: 'Performance profiler for TPS, CPU usage and memory leaks', downloads: 45000000, icon: 'https://cdn.modrinth.com/data/l6YH9Als/icon.png' },
    { id: 'iron-chests', name: 'Iron Chests', summary: 'Upgradable storage chests with tiered capacities', downloads: 130000000, icon: 'https://cdn.modrinth.com/data/2u6q7q8x/icon.png' },
    { id: 'mouse-tweaks', name: 'Mouse Tweaks', summary: 'Enhances inventory management with mouse drag mechanics', downloads: 175000000, icon: 'https://cdn.modrinth.com/data/aC3cM3Vq/icon.png' },
    { id: 'applied-energistics-2', name: 'Applied Energistics 2', summary: 'Compact digital matter-energy storage systems and automation', downloads: 92000000, icon: 'https://cdn.modrinth.com/data/XxWD5pD3/icon.png' },
    { id: 'chunky', name: 'Chunky Pre-generator', summary: 'Pre-generates world chunks rapidly to eliminate exploration lag', downloads: 22000000, icon: 'https://cdn.modrinth.com/data/fALzjamp/icon.png' },
    { id: 'ferritecore', name: 'FerriteCore', summary: 'Reduces memory (RAM) usage of Minecraft modded servers', downloads: 74000000, icon: 'https://cdn.modrinth.com/data/uXXizFIs/icon.png' },
    { id: 'lithium', name: 'Lithium', summary: 'Optimization mod for server tick rates, physics, and mob AI', downloads: 55000000, icon: 'https://cdn.modrinth.com/data/gvQqBUqZ/icon.png' },
    { id: 'gravestones', name: 'GraveStone Mod', summary: 'Places a secure gravestone upon player death', downloads: 88000000, icon: 'https://cdn.modrinth.com/data/kXM9oxnT/icon.png' },
    { id: 'alexs-mobs', name: "Alex\'s Mobs", summary: 'Adds 85+ beautiful animated wildlife animals and exotic creatures', downloads: 62000000, icon: 'https://cdn.modrinth.com/data/5b7pWq6A/icon.png' },
    { id: 'pams-harvestcraft', name: "Pam\'s HarvestCraft 2", summary: 'Massive food and farming overhaul with 300+ crops and recipes', downloads: 48000000, icon: 'https://cdn.modrinth.com/data/PYHOlZDp/icon.png' },
    { id: 'botania', name: 'Botania', summary: 'Tech mod powered by flowers and natural magic', downloads: 71000000, icon: 'https://cdn.modrinth.com/data/MrW9zwkQ/icon.png' },
    { id: 'tinkers-construct', name: "Tinkers\' Construct", summary: 'Build custom tools and weapons using a modular crafting system', downloads: 115000000, icon: 'https://cdn.modrinth.com/data/3IuO68q1/icon.png' },
    { id: 'immersive-engineering', name: 'Immersive Engineering', summary: 'Retro-futuristic tech mod with multiblock machines and power', downloads: 83000000, icon: 'https://cdn.modrinth.com/data/V1Z35rKy/icon.png' },
    { id: 'thermal-expansion', name: 'Thermal Expansion', summary: 'Classic tech mod with machines, energy and ducts', downloads: 200000000, icon: 'https://cdn.modrinth.com/data/9dv3oFEj/icon.png' },
    { id: 'origins', name: 'Origins', summary: 'Choose an origin at game start and gain unique abilities', downloads: 43000000, icon: 'https://cdn.modrinth.com/data/ufXbGCMv/icon.png' },
    { id: 'betterdungeons', name: 'YUNG\'s Better Dungeons', summary: 'Completely redesigned vanilla dungeons with new layouts and loot', downloads: 29000000, icon: 'https://cdn.modrinth.com/data/jLNBMPSL/icon.png' },
    { id: 'betterstrongholds', name: 'YUNG\'s Better Strongholds', summary: 'Redesigned strongholds with multi-level layouts and secret rooms', downloads: 18000000, icon: 'https://cdn.modrinth.com/data/h46PaD5q/icon.png' },
    { id: 'twilightforest', name: 'The Twilight Forest', summary: 'Magical forest dimension with unique bosses and exploration', downloads: 95000000, icon: 'https://cdn.modrinth.com/data/MPCBE8Qh/icon.png' },
    { id: 'biomes-o-plenty', name: "Biomes O\' Plenty", summary: '80+ new diverse biomes with unique flora and terrain generation', downloads: 103000000, icon: 'https://cdn.modrinth.com/data/HrzRDnNf/icon.png' },
    { id: 'ad-astra', name: 'Ad Astra', summary: 'Explore space, build rockets and colonise other planets', downloads: 19000000, icon: 'https://cdn.modrinth.com/data/TCdnBuRH/icon.png' },
    { id: 'bloodmagic', name: 'Blood Magic', summary: 'Dark magic mod powered by life essence and ritual circles', downloads: 57000000, icon: 'https://cdn.modrinth.com/data/EjXzmVmH/icon.png' },
];

// Popular Modpacks
const PRESET_MODPACKS: Record<string, PackageItem[]> = {
    Modrinth: [
        { id: 'mr-fo', name: 'Fabulously Optimized', summary: 'A simple Fabric modpack focused on performance & graphics', icon: 'https://cdn.modrinth.com/data/1eAoo2hA/icon.png', downloads: 5400000 },
        { id: 'mr-cobblemon', name: 'Cobblemon Official Pack', summary: 'Official modpack for Cobblemon — catch and battle Pokemon in MC', icon: 'https://cdn.modrinth.com/data/5Z2h4y4d/icon.png', downloads: 2100000 },
        { id: 'mr-simply-optimized', name: 'Simply Optimized', summary: 'Lightweight Fabric performance modpack for high FPS', icon: 'https://cdn.modrinth.com/data/lh6Xx1nd/icon.png', downloads: 1800000 },
        { id: 'mr-medieval-mc', name: 'Medieval MC [Fabric]', summary: 'Explore dungeons, magic and boss fights in MC 1.20.1', icon: 'https://cdn.modrinth.com/data/2M14J9rB/icon.png', downloads: 1200000 },
        { id: 'mr-better-adventures', name: 'Better Adventures', summary: 'Vanilla+ exploration modpack with new biomes and structures', icon: 'https://cdn.modrinth.com/data/8k8Xx2nd/icon.png', downloads: 950000 },
        { id: 'mr-prominence2', name: 'Prominence II RPG', summary: 'Lore-rich RPG modpack with custom quests and dimensions', icon: 'https://cdn.modrinth.com/data/Rn4TAqnQ/icon.png', downloads: 820000 },
        { id: 'mr-atm9', name: 'All the Mods 9', summary: 'Massive kitchen-sink modpack for Fabric with 350+ mods', icon: 'https://cdn.modrinth.com/data/UcJPsyNZ/icon.png', downloads: 760000 },
    ],
    CurseForge: [
        { id: 'cisco-medieval-rpg', name: "Cisco\'s Fantasy Medieval RPG [Ultimate]", summary: 'Deep custom lore, powerful equipment and handcrafted quests — solo or coop', icon: 'https://media.forgecdn.net/avatars/thumbnails/1050/735/256/256/638649827977539499.png', downloads: 4900000 },
        { id: 'atm10', name: 'All the Mods 10 - ATM10', summary: 'The top pack of 2026 with around 500+ mods', downloads: 4200000 },
        { id: 'bmc4', name: 'Better MC [FORGE] BMC4', summary: 'Version 1.20.1 | A Proper Vanilla+ Modpack Experience', downloads: 8900000 },
        { id: 'rlcraft', name: 'RLCraft', summary: 'A modpack designed to bring real survival and dragons', downloads: 16200000 },
        { id: 'deceasedcraft', name: 'DeceasedCraft - Urban Zombie', summary: 'Explore, loot and shoot your way through zombie apocalypse', downloads: 3100000 },
        { id: 'cobbleverse', name: 'COBBLEVERSE - Pokemon Adventure', summary: 'Start a true Pokemon adventure in Minecraft Cobblemon', downloads: 2800000 },
        { id: 'prominence2', name: 'Prominence II: Hasturian Era', summary: 'Lore-rich RPG | Explore the Kingdom of Hastur & Magic', downloads: 2400000 },
        { id: 'skyfactory4', name: 'SkyFactory 4', summary: 'The ultimate skyblock modpack — resource trees & automation', downloads: 9100000 },
        { id: 'fabulously-optimized', name: 'Fabulously Optimized', summary: 'Beautiful graphics, speedy performance & shader support', downloads: 3800000 },
        { id: 'create-aeronautics', name: 'All of Create Aeronautics', summary: 'The Ultimate Create Aeronautics Experience with Physics', downloads: 1500000 },
        { id: 'bmc5', name: 'Better MC [NEOFORGE] BMC5', summary: 'Next Gen Vanilla+ Modpack for Minecraft 1.20.1+', downloads: 1100000 },
        { id: 'medieval-mc-forge', name: 'Medieval MC [FORGE]', summary: 'Magic, dungeons and boss fights with Forge for MC 1.20.1', downloads: 2600000 },
        { id: 'enigmatica9', name: 'Enigmatica 9: Expert', summary: 'Expert-mode kitchen sink with 300+ challenging recipes', downloads: 1300000 },
        { id: 'crucial2', name: 'Crucial 2', summary: 'Casual Forge modpack — the best vanilla+ experience on CF', downloads: 1700000 },
        { id: 'allofcreate', name: 'All of Create', summary: 'Pure Create-focused modpack with factories and contraptions', downloads: 980000 },
    ],
    'Feed The Beast': [
        { id: 'ftb-stoneblock3', name: 'FTB StoneBlock 3', summary: 'The third entry in the iconic Stoneblock series', downloads: 2300000 },
        { id: 'ftb-revelation', name: 'FTB Revelation', summary: 'General purpose kitchen-sink modpack packed with tech & magic', downloads: 4100000 },
        { id: 'ftb-skies', name: 'FTB Skies', summary: 'Skyblock experience featuring modern questing and tech mods', downloads: 1900000 },
        { id: 'ftb-ocean-block', name: 'FTB OceanBlock', summary: 'Skyblock on water — build your base from scratch over the ocean', downloads: 1400000 },
        { id: 'ftb-academy', name: 'FTB Academy', summary: 'Beginner-friendly modpack teaching modded Minecraft basics', downloads: 1100000 },
    ],
    Technic: [
        { id: 'technic-tekkit', name: 'Tekkit Classic', summary: 'The classic industrial modpack with IC2 & Buildcraft', downloads: 8500000 },
        { id: 'technic-hexxit', name: 'Hexxit II', summary: 'Adventure and dungeon clearing modpack for explorers', downloads: 3400000 },
        { id: 'technic-blightfall', name: 'Blightfall', summary: 'Story-driven survival modpack with alien planet exploration', downloads: 1800000 },
    ],
};

// --- Dedicated Card Component with graceful image fallback ---
const PackageCardItem = ({
    item,
    type,
    installing,
    onInstall,
}: {
    item: PackageItem;
    type: 'plugins' | 'mods' | 'modpacks';
    installing: boolean;
    onInstall: () => void;
}) => {
    const [imgErr, setImgErr] = useState(false);

    return (
        <ItemCard>
            <ItemLeft>
                <ItemIconBox>
                    {!imgErr && item.icon ? (
                        <img
                            src={item.icon}
                            alt={item.name}
                            onError={() => setImgErr(true)}
                        />
                    ) : (
                        <FallbackIcon>
                            <FontAwesomeIcon
                                icon={type === 'plugins' ? faPlug : type === 'mods' ? faBoxes : faCube}
                            />
                        </FallbackIcon>
                    )}
                </ItemIconBox>
                <ItemInfo>
                    <ItemName title={item.name}>{item.name}</ItemName>
                    <ItemSummary title={item.summary || ''}>
                        {item.summary || (type === 'plugins' ? 'Minecraft Server Plugin' : type === 'mods' ? 'Minecraft Mod' : 'Minecraft Modpack')}
                    </ItemSummary>
                    <ItemMeta>
                        {item.downloads ? (
                            <span>
                                <FontAwesomeIcon icon={faDownload} style={{ fontSize: '10px' }} />
                                {item.downloads.toLocaleString()}
                            </span>
                        ) : null}
                        {item.rating ? (
                            <span>
                                <FontAwesomeIcon icon={faStar} style={{ fontSize: '10px', color: '#f59e0b' }} />
                                {item.rating.toFixed(1)}
                            </span>
                        ) : null}
                    </ItemMeta>
                </ItemInfo>
            </ItemLeft>

            <InstallBtn disabled={installing} onClick={onInstall}>
                {installing ? (
                    <span>Installing...</span>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCloudDownloadAlt} />
                        <span>Install</span>
                    </>
                )}
            </InstallBtn>
        </ItemCard>
    );
};

interface Props {
    defaultTab?: 'plugins' | 'mods' | 'modpacks';
}

export default ({ defaultTab = 'plugins' }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addFlash, clearFlashes } = useFlash();

    const [activeTab, setActiveTab] = useState<'plugins' | 'mods' | 'modpacks'>(defaultTab);

    // Modpacks State
    const [platform, setPlatform] = useState('CurseForge');
    const [search, setSearch] = useState('');
    const [modpacks, setModpacks] = useState<PackageItem[]>([]);
    const [loadingModpacks, setLoadingModpacks] = useState(false);

    // Mods State
    const [modSearch, setModSearch] = useState('');
    const [mods, setMods] = useState<PackageItem[]>(PRESET_MODS);
    const [loadingMods, setLoadingMods] = useState(false);

    // Plugins State
    const [plugins, setPlugins] = useState<PluginItem[]>([]);
    const [pluginSearch, setPluginSearch] = useState('');
    const [loadingPlugins, setLoadingPlugins] = useState(false);

    // Install State
    const [installingId, setInstallingId] = useState<string | number | null>(null);

    // Custom Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [customUrl, setCustomUrl] = useState('');
    const [customDir, setCustomDir] = useState(
        defaultTab === 'modpacks' ? '/modpacks' : defaultTab === 'mods' ? '/mods' : '/plugins'
    );
    const [customFilename, setCustomFilename] = useState(
        defaultTab === 'modpacks' ? 'custom_pack.zip' : defaultTab === 'mods' ? 'custom_mod.jar' : 'custom_plugin.jar'
    );
    const [customSubmitting, setCustomSubmitting] = useState(false);

    // Sync tab when prop changes
    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);

    // Fetch Modpacks
    const fetchModpacks = () => {
        setLoadingModpacks(true);
        clearFlashes('package-installer');

        if (platform === 'Modrinth') {
            const query = search ? encodeURIComponent(search) : 'modpack';
            fetch(`https://api.modrinth.com/v2/search?query=${query}&facets=[["project_type:modpack"]]&limit=50`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.hits) {
                        const formatted = data.hits.map((hit: any) => ({
                            id: hit.project_id,
                            name: hit.title,
                            summary: hit.description,
                            icon: hit.icon_url,
                            downloadUrl: `https://modrinth.com/modpack/${hit.slug}`,
                            downloads: hit.downloads,
                        }));
                        setModpacks(formatted);
                    } else {
                        setModpacks(PRESET_MODPACKS.Modrinth || []);
                    }
                })
                .catch(() => {
                    setModpacks(PRESET_MODPACKS.Modrinth || []);
                })
                .finally(() => setLoadingModpacks(false));
        } else {
            let list = PRESET_MODPACKS[platform] || PRESET_MODPACKS.CurseForge;
            if (search) {
                list = list.filter(
                    (m) =>
                        m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.summary.toLowerCase().includes(search.toLowerCase())
                );
            }
            setModpacks(list);
            setLoadingModpacks(false);
        }
    };

    // Fetch Mods
    const fetchMods = (query = '') => {
        setLoadingMods(true);
        clearFlashes('package-installer');

        if (query) {
            // Search Modrinth Mods API dynamically
            fetch(`https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=[["project_type:mod"]]&limit=40`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.hits && data.hits.length > 0) {
                        const formatted = data.hits.map((hit: any) => ({
                            id: hit.project_id,
                            name: hit.title,
                            summary: hit.description,
                            icon: hit.icon_url,
                            downloads: hit.downloads,
                        }));
                        setMods(formatted);
                    } else {
                        // Filter local presets
                        const filtered = PRESET_MODS.filter(
                            (m) =>
                                m.name.toLowerCase().includes(query.toLowerCase()) ||
                                m.summary.toLowerCase().includes(query.toLowerCase())
                        );
                        setMods(filtered);
                    }
                })
                .catch(() => {
                    const filtered = PRESET_MODS.filter(
                        (m) =>
                            m.name.toLowerCase().includes(query.toLowerCase()) ||
                            m.summary.toLowerCase().includes(query.toLowerCase())
                    );
                    setMods(filtered);
                })
                .finally(() => setLoadingMods(false));
        } else {
            setMods(PRESET_MODS);
            setLoadingMods(false);
        }
    };

    // Fetch Plugins
    const fetchPlugins = (query = '') => {
        setLoadingPlugins(true);
        clearFlashes('package-installer');

        let url = 'https://api.spiget.org/v2/resources/free?size=36&sort=-downloads';
        if (query) {
            url = `https://api.spiget.org/v2/search/resources/${encodeURIComponent(query)}?field=name&size=36&sort=-downloads`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setPlugins(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error(err);
                addFlash({
                    key: 'package-installer',
                    type: 'error',
                    message: 'Failed to fetch plugins from Spiget repository.',
                });
            })
            .finally(() => setLoadingPlugins(false));
    };

    // Initial load
    useEffect(() => {
        fetchPlugins();
        fetchModpacks();
        fetchMods();
    }, []);

    useEffect(() => {
        if (activeTab === 'modpacks') {
            fetchModpacks();
        }
    }, [platform]);

    // Install handlers
    const installPlugin = (plugin: PluginItem) => {
        setInstallingId(plugin.id);
        clearFlashes('package-installer');

        http.post(`/api/client/servers/${uuid}/quick-setup/plugin`, {
            plugin_id: plugin.id,
            plugin_name: plugin.name,
            url: `https://api.spiget.org/v2/resources/${plugin.id}/download`,
            directory: 'plugins',
        })
            .then((res: any) => {
                addFlash({
                    key: 'package-installer',
                    type: 'success',
                    message: res.data?.message || `Successfully installed plugin "${plugin.name}" to /plugins.`,
                });
            })
            .catch((err) => {
                console.error(err);
                const msg = err.response?.status === 429
                    ? 'Download rate limit reached. Please wait a moment before downloading more plugins.'
                    : (err.response?.data?.error || err.response?.data?.message || err.message || `Failed to install plugin "${plugin.name}".`);
                addFlash({
                    key: 'package-installer',
                    type: 'error',
                    message: msg,
                });
            })
            .finally(() => setInstallingId(null));
    };

    const installMod = (mod: PackageItem) => {
        setInstallingId(mod.id);
        clearFlashes('package-installer');

        const cleanName = mod.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${cleanName}.jar`;

        // Direct install if URL provided, or direct prompt
        if (mod.downloadUrl) {
            http.post(`/api/client/servers/${uuid}/quick-setup/plugin`, {
                plugin_id: mod.id,
                plugin_name: mod.name,
                url: mod.downloadUrl,
                directory: 'mods',
            })
                .then((res: any) => {
                    addFlash({
                        key: 'package-installer',
                        type: 'success',
                        message: res.data?.message || `Successfully installed mod "${mod.name}" to /mods.`,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    const msg = err.response?.status === 429
                        ? 'Download rate limit reached. Please wait a moment before downloading more mods.'
                        : (err.response?.data?.error || err.response?.data?.message || err.message || `Failed to install mod "${mod.name}".`);
                    addFlash({
                        key: 'package-installer',
                        type: 'error',
                        message: msg,
                    });
                })
                .finally(() => setInstallingId(null));
        } else {
            // Open direct modal prefilled
            setCustomDir('/mods');
            setCustomFilename(filename);
            setCustomUrl(`https://modrinth.com/mod/${mod.id}`);
            setModalOpen(true);
            setInstallingId(null);
        }
    };

    const installModpack = async (modpack: PackageItem) => {
        setInstallingId(modpack.id);
        clearFlashes('package-installer');

        try {
            let directMrpackUrl = modpack.downloadUrl;

            // If Modrinth, dynamically fetch the latest release version .mrpack URL
            if (!directMrpackUrl && (platform === 'Modrinth' || String(modpack.id).startsWith('mr-'))) {
                const slug = String(modpack.id).replace(/^mr-/, '');
                try {
                    const res = await fetch(`https://api.modrinth.com/v2/project/${slug}/version`);
                    if (res.ok) {
                        const versions = await res.json();
                        if (Array.isArray(versions) && versions.length > 0) {
                            for (const v of versions) {
                                const mrpackFile = v.files?.find((f: any) => f.filename?.endsWith('.mrpack'));
                                if (mrpackFile?.url) {
                                    directMrpackUrl = mrpackFile.url;
                                    break;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to resolve Modrinth mrpack version:', e);
                }
            }

            if (directMrpackUrl) {
                // If it is an .mrpack, invoke Pterodactyl automated QuickSetup server unpacker
                if (directMrpackUrl.endsWith('.mrpack')) {
                    const res: any = await http.post(`/api/client/servers/${uuid}/quick-setup/modpack`, {
                        url: directMrpackUrl,
                        name: modpack.name,
                    });
                    addFlash({
                        key: 'package-installer',
                        type: 'success',
                        message: res.data?.message || `Successfully installed modpack "${modpack.name}"!`,
                    });
                    setInstallingId(null);
                    return;
                }

                // If regular zip or file
                const cleanName = modpack.name.replace(/[^a-zA-Z0-9_-]/g, '_');
                await http.post(`/api/client/servers/${uuid}/files/pull`, {
                    url: directMrpackUrl,
                    directory: '/modpacks',
                    filename: `${cleanName}.zip`,
                    use_header: false,
                });
                addFlash({
                    key: 'package-installer',
                    type: 'success',
                    message: `Successfully queued modpack "${modpack.name}" into /modpacks.`,
                });
            } else {
                const cleanName = modpack.name.replace(/[^a-zA-Z0-9_-]/g, '_');
                setCustomDir('/modpacks');
                setCustomFilename(`${cleanName}.zip`);
                setCustomUrl('');
                setModalOpen(true);
            }
        } catch (err: any) {
            console.error(err);
            addFlash({
                key: 'package-installer',
                type: 'error',
                message: err.message || `Failed to install modpack "${modpack.name}".`,
            });
        } finally {
            setInstallingId(null);
        }
    };

    // Custom URL Submit
    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customUrl) return;

        setCustomSubmitting(true);
        clearFlashes('package-installer');

        try {
            if (customUrl.endsWith('.mrpack')) {
                const res: any = await http.post(`/api/client/servers/${uuid}/quick-setup/modpack`, {
                    url: customUrl,
                    name: customFilename || 'Custom Modpack',
                });
                addFlash({
                    key: 'package-installer',
                    type: 'success',
                    message: res.data?.message || 'Modpack successfully deployed to server!',
                });
            } else {
                await http.post(`/api/client/servers/${uuid}/files/pull`, {
                    url: customUrl,
                    directory: customDir || (activeTab === 'modpacks' ? '/modpacks' : activeTab === 'mods' ? '/mods' : '/plugins'),
                    filename: customFilename || 'package_file.zip',
                    use_header: false,
                });
                addFlash({
                    key: 'package-installer',
                    type: 'success',
                    message: `Downloading "${customFilename}" into ${customDir} in background.`,
                });
            }
            setModalOpen(false);
            setCustomUrl('');
        } catch (err: any) {
            console.error(err);
            addFlash({
                key: 'package-installer',
                type: 'error',
                message: err.message || 'Failed to download package from URL.',
            });
        } finally {
            setCustomSubmitting(false);
        }
    };

    return (
        <ServerContentBlock title={'Package Installer'}>
            <Container>
                <FlashMessageRender byKey={'package-installer'} />

                {/* Top Navigation Tabs */}
                <NavTabs>
                    <TabButton
                        $active={activeTab === 'plugins'}
                        onClick={() => {
                            setActiveTab('plugins');
                            setCustomDir('/plugins');
                            setCustomFilename('custom_plugin.jar');
                        }}
                    >
                        <FontAwesomeIcon icon={faPlug} style={{ fontSize: '13px' }} />
                        <span>Plugins (Spiget)</span>
                    </TabButton>
                    <TabButton
                        $active={activeTab === 'mods'}
                        onClick={() => {
                            setActiveTab('mods');
                            setCustomDir('/mods');
                            setCustomFilename('custom_mod.jar');
                        }}
                    >
                        <FontAwesomeIcon icon={faBoxes} style={{ fontSize: '13px' }} />
                        <span>Mods (CurseForge/Modrinth)</span>
                    </TabButton>
                    <TabButton
                        $active={activeTab === 'modpacks'}
                        onClick={() => {
                            setActiveTab('modpacks');
                            setCustomDir('/modpacks');
                            setCustomFilename('custom_pack.zip');
                        }}
                    >
                        <FontAwesomeIcon icon={faCube} style={{ fontSize: '13px' }} />
                        <span>Modpacks (CurseForge/Modrinth)</span>
                    </TabButton>
                </NavTabs>

                {/* Banner */}
                <BannerCard>
                    <BannerLeft>
                        <BannerIconCircle>
                            <FontAwesomeIcon
                                icon={activeTab === 'plugins' ? faPlug : activeTab === 'mods' ? faBoxes : faCube}
                            />
                        </BannerIconCircle>
                        <BannerText>
                            <span className={'title'}>
                                {activeTab === 'plugins'
                                    ? 'SpigotMC & Paper Plugin Catalog'
                                    : activeTab === 'mods'
                                    ? 'CurseForge & Modrinth Minecraft Mods'
                                    : 'Pre-Packaged Minecraft Modpacks'}
                            </span>
                            <span className={'desc'}>
                                {activeTab === 'plugins'
                                    ? 'Search and install free plugins directly into your server /plugins directory.'
                                    : activeTab === 'mods'
                                    ? 'Browse and install individual Minecraft mods directly to your server /mods directory.'
                                    : 'Browse and auto-deploy modpack zip packages straight to your server storage.'}
                            </span>
                        </BannerText>
                    </BannerLeft>
                    <CustomUrlBtn
                        onClick={() => {
                            setCustomDir(activeTab === 'plugins' ? '/plugins' : activeTab === 'mods' ? '/mods' : '/modpacks');
                            setCustomFilename(activeTab === 'plugins' ? 'custom_plugin.jar' : activeTab === 'mods' ? 'custom_mod.jar' : 'custom_pack.zip');
                            setModalOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: '11px' }} />
                        <span>Install from Direct URL</span>
                    </CustomUrlBtn>
                </BannerCard>

                {/* Controls (Search, Platform Filter) */}
                <ControlBar>
                    <SearchInputWrapper>
                        <FontAwesomeIcon icon={faSearch} className={'search-icon'} />
                        {activeTab === 'plugins' ? (
                            <input
                                type={'text'}
                                placeholder={'Search plugins & press Enter...'}
                                value={pluginSearch}
                                onChange={(e) => setPluginSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchPlugins(pluginSearch)}
                            />
                        ) : activeTab === 'mods' ? (
                            <input
                                type={'text'}
                                placeholder={'Search mods & press Enter (e.g. JEI, Sodium, Create)...'}
                                value={modSearch}
                                onChange={(e) => setModSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchMods(modSearch)}
                            />
                        ) : (
                            <input
                                type={'text'}
                                placeholder={'Search modpacks by name...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchModpacks()}
                            />
                        )}
                    </SearchInputWrapper>

                    {activeTab === 'modpacks' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#8B786D', fontWeight: 600 }}>PLATFORM:</span>
                            <SelectDropdown value={platform} onChange={(e) => setPlatform(e.target.value)}>
                                <option value={'CurseForge'}>CurseForge</option>
                                <option value={'Modrinth'}>Modrinth</option>
                                <option value={'Feed The Beast'}>Feed The Beast</option>
                                <option value={'Technic'}>Technic</option>
                            </SelectDropdown>
                        </div>
                    )}
                </ControlBar>

                {/* Content Grid: Plugins */}
                {activeTab === 'plugins' && (
                    <>
                        {loadingPlugins ? (
                            <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
                                <Spinner size={'large'} centered />
                            </div>
                        ) : plugins.length === 0 ? (
                            <EmptyNotice>
                                <FontAwesomeIcon icon={faPlug} className={'icon'} />
                                <h4>No plugins found</h4>
                                <p>No results matched "{pluginSearch}". Try searching for a different keyword.</p>
                            </EmptyNotice>
                        ) : (
                            <ItemsGrid>
                                {plugins.map((plugin) => (
                                    <PackageCardItem
                                        key={plugin.id}
                                        type={'plugins'}
                                        installing={installingId === plugin.id}
                                        onInstall={() => installPlugin(plugin)}
                                        item={{
                                            id: plugin.id,
                                            name: plugin.name,
                                            summary: plugin.tag || 'Minecraft Server Plugin',
                                            icon: plugin.icon?.url ? `https://www.spigotmc.org/${plugin.icon.url}` : undefined,
                                            downloads: plugin.downloads,
                                            rating: plugin.rating?.average,
                                        }}
                                    />
                                ))}
                            </ItemsGrid>
                        )}
                    </>
                )}

                {/* Content Grid: Mods */}
                {activeTab === 'mods' && (
                    <>
                        {loadingMods ? (
                            <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
                                <Spinner size={'large'} centered />
                            </div>
                        ) : mods.length === 0 ? (
                            <EmptyNotice>
                                <FontAwesomeIcon icon={faBoxes} className={'icon'} />
                                <h4>No mods found</h4>
                                <p>No mods matched "{modSearch}". Try searching for another mod name or keyword.</p>
                            </EmptyNotice>
                        ) : (
                            <ItemsGrid>
                                {mods.map((mod) => (
                                    <PackageCardItem
                                        key={mod.id}
                                        type={'mods'}
                                        installing={installingId === mod.id}
                                        onInstall={() => installMod(mod)}
                                        item={mod}
                                    />
                                ))}
                            </ItemsGrid>
                        )}
                    </>
                )}

                {/* Content Grid: Modpacks */}
                {activeTab === 'modpacks' && (
                    <>
                        {loadingModpacks ? (
                            <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
                                <Spinner size={'large'} centered />
                            </div>
                        ) : modpacks.length === 0 ? (
                            <EmptyNotice>
                                <FontAwesomeIcon icon={faCube} className={'icon'} />
                                <h4>No modpacks found</h4>
                                <p>No packages matched "{search}". Try switching platforms or clearing your search.</p>
                            </EmptyNotice>
                        ) : (
                            <ItemsGrid>
                                {modpacks.map((modpack) => (
                                    <PackageCardItem
                                        key={modpack.id}
                                        type={'modpacks'}
                                        installing={installingId === modpack.id}
                                        onInstall={() => installModpack(modpack)}
                                        item={modpack}
                                    />
                                ))}
                            </ItemsGrid>
                        )}
                    </>
                )}

                {/* Custom Package Modal */}
                {modalOpen && (
                    <ModalOverlay onClick={() => setModalOpen(false)}>
                        <ModalBox onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#EBF5EE' }}>
                                    Install from Direct URL
                                </h3>
                                <button
                                    type={'button'}
                                    onClick={() => setModalOpen(false)}
                                    style={{ background: 'transparent', border: 'none', color: '#8B786D', cursor: 'pointer', fontSize: '15px' }}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label>Direct Download URL (.jar / .zip)</label>
                                    <input
                                        type={'url'}
                                        required
                                        placeholder={'https://example.com/download/package.jar'}
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Destination Directory</label>
                                    <input
                                        type={'text'}
                                        required
                                        placeholder={'/plugins'}
                                        value={customDir}
                                        onChange={(e) => setCustomDir(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Save Filename</label>
                                    <input
                                        type={'text'}
                                        required
                                        placeholder={'custom_file.jar'}
                                        value={customFilename}
                                        onChange={(e) => setCustomFilename(e.target.value)}
                                    />
                                </div>

                                <ModalFooter>
                                    <CustomUrlBtn type={'button'} onClick={() => setModalOpen(false)}>
                                        Cancel
                                    </CustomUrlBtn>
                                    <CustomUrlBtn type={'submit'} disabled={customSubmitting} style={{ background: '#352e2a', borderColor: '#BFA89E' }}>
                                        {customSubmitting ? 'Downloading...' : 'Install Package'}
                                    </CustomUrlBtn>
                                </ModalFooter>
                            </form>
                        </ModalBox>
                    </ModalOverlay>
                )}
            </Container>
        </ServerContentBlock>
    );
};
