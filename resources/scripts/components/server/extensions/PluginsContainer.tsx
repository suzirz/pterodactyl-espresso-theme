import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import Spinner from '@/components/elements/Spinner';
import { ServerContext } from '@/state/server';
import http from '@/api/http';
import loadDirectory, { FileObject } from '@/api/server/files/loadDirectory';
import renameFiles from '@/api/server/files/renameFiles';
import deleteFiles from '@/api/server/files/deleteFiles';
import pullFile from '@/api/server/files/pullFile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlug,
    faPowerOff,
    faTrashAlt,
    faExternalLinkAlt,
    faSearch,
    faDownload,
    faStar,
    faClock,
    faChevronDown,
    faCheck,
    faTimes,
    faSyncAlt,
    faMicrophone,
    faMapMarkedAlt,
    faHammer,
    faShieldAlt,
    faCube,
    faBoxes,
    faCheckCircle,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

// --- Animations ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
`;

// --- Interfaces ---
interface InstalledPlugin {
    filename: string;
    displayName: string;
    size: number;
    isDisabled: boolean;
    modifiedAt: Date;
    iconUrl?: string;
    projectUrl?: string;
    author?: string;
}

interface PluginCardItem {
    id: string;
    slug: string;
    title: string;
    description: string;
    author: string;
    iconUrl: string | null;
    downloads: number;
    stars: number;
    updatedAt: string;
    projectType: string;
    categories: string[];
    versions: string[];
    externalUrl: string;
}

interface ModrinthVersionFile {
    url: string;
    filename: string;
    primary: boolean;
    size: number;
}

interface ModrinthVersion {
    id: string;
    name: string;
    version_number: string;
    game_versions: string[];
    version_type: 'release' | 'beta' | 'alpha';
    loaders: string[];
    files: ModrinthVersionFile[];
    date_published: string;
    downloads: number;
}

// --- Formatters ---
const formatNumber = (num: number): string => {
    if (!num || isNaN(num)) return '0';
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(num);
};

const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatRelativeTime = (dateStr: string): string => {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffSec < 60) return 'just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 30) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
        const diffMonth = Math.floor(diffDay / 30);
        if (diffMonth < 12) return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
        const diffYear = Math.floor(diffDay / 365);
        return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
    } catch {
        return 'recently';
    }
};

const cleanPluginName = (filename: string): string => {
    const raw = filename.replace(/\.disabled$/i, '').replace(/\.jar$/i, '');
    const lower = raw.toLowerCase();

    if (lower.startsWith('voicechat') || lower.includes('simple-voice-chat')) return 'Simple Voice Chat';
    if (lower.startsWith('veinminer')) return 'VeinMiner';
    if (lower.startsWith('lmd') || lower.includes('let-me-despawn')) return 'Let Me Despawn';
    if (lower.startsWith('chunky')) return 'Chunky';
    if (lower.startsWith('worldedit')) return 'WorldEdit';
    if (lower.startsWith('luckperms')) return 'LuckPerms';
    if (lower.startsWith('viaversion')) return 'ViaVersion';
    if (lower.startsWith('essentials')) return 'EssentialsX';
    if (lower.startsWith('citizens')) return 'Citizens';
    if (lower.startsWith('geyser')) return 'Geyser';
    if (lower.startsWith('floodgate')) return 'Floodgate';
    if (lower.startsWith('vault')) return 'Vault';
    if (lower.startsWith('coreprotect')) return 'CoreProtect';
    if (lower.startsWith('dynmap')) return 'Dynmap';
    if (lower.startsWith('bluemap')) return 'BlueMap';
    if (lower.startsWith('squaremap')) return 'Squaremap';
    if (lower.startsWith('spark')) return 'spark';
    if (lower.startsWith('protocollib')) return 'ProtocolLib';
    if (lower.startsWith('placeholderapi')) return 'PlaceholderAPI';
    if (lower.startsWith('clearlag')) return 'ClearLag';
    if (lower.startsWith('authme')) return 'AuthMe Reloaded';
    if (lower.startsWith('multiverse')) return 'Multiverse-Core';
    if (lower.startsWith('decentholograms')) return 'DecentHolograms';
    if (lower.startsWith('griefprevention')) return 'GriefPrevention';
    if (lower.startsWith('discordsrv')) return 'DiscordSRV';

    return raw
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getPluginIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('voice') || lower.includes('mic')) return faMicrophone;
    if (lower.includes('map')) return faMapMarkedAlt;
    if (lower.includes('edit') || lower.includes('build')) return faHammer;
    if (lower.includes('protect') || lower.includes('perm') || lower.includes('auth') || lower.includes('guard')) return faShieldAlt;
    return faPlug;
};

// --- Styled Components (Strict Bytenodes Warm Obsidian) ---
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
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
    font-size: 16px;
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

// --- Installed Section ---
const InstalledList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const InstalledCard = styled.div<{ $disabled?: boolean }>`
    background: #1c1917;
    border: 1px solid ${(props) => (props.$disabled ? 'rgba(201, 75, 75, 0.25)' : 'rgba(191, 168, 158, 0.15)')};
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: all 0.18s ease;

    &:hover {
        border-color: ${(props) => (props.$disabled ? 'rgba(201, 75, 75, 0.45)' : 'rgba(191, 168, 158, 0.35)')};
        background: #25211e;
    }
`;

const InstalledLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
`;

const PluginIconBox = styled.div<{ $disabled?: boolean }>`
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: ${(props) => (props.$disabled ? 'rgba(201, 75, 75, 0.1)' : 'rgba(191, 168, 158, 0.1)')};
    border: 1px solid ${(props) => (props.$disabled ? 'rgba(201, 75, 75, 0.25)' : 'rgba(191, 168, 158, 0.2)')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.$disabled ? '#c94b4b' : '#BFA89E')};
    font-size: 16px;
    flex-shrink: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const InstalledDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
`;

const InstalledTitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const InstalledTitle = styled.span`
    font-size: 14.5px;
    font-weight: 600;
    color: #EBF5EE;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ExternalLinkIcon = styled.a`
    color: #8B786D;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    transition: color 0.15s ease;

    &:hover {
        color: #BFA89E;
    }
`;

const InstalledMeta = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #8B786D;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const InstalledActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'default' | 'success' }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'Outfit', sans-serif;

    ${(props) =>
        props.$variant === 'danger'
            ? css`
                  background: rgba(201, 75, 75, 0.12);
                  color: #e57373;
                  border: 1px solid rgba(201, 75, 75, 0.3);
                  &:hover {
                      background: rgba(201, 75, 75, 0.22);
                      color: #ff8a80;
                      border-color: rgba(201, 75, 75, 0.5);
                  }
              `
            : props.$variant === 'success'
            ? css`
                  background: rgba(82, 183, 136, 0.12);
                  color: #52b788;
                  border: 1px solid rgba(82, 183, 136, 0.3);
                  &:hover {
                      background: rgba(82, 183, 136, 0.22);
                      color: #74c69d;
                      border-color: rgba(82, 183, 136, 0.5);
                  }
              `
            : css`
                  background: #25211e;
                  color: #EBF5EE;
                  border: 1px solid rgba(191, 168, 158, 0.2);
                  &:hover {
                      background: #302b27;
                      border-color: #BFA89E;
                      color: #BFA89E;
                  }
              `}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const IconButton = styled.button`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.2);
    color: #8B786D;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.18s ease;

    &:hover {
        background: rgba(201, 75, 75, 0.15);
        color: #e57373;
        border-color: rgba(201, 75, 75, 0.35);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const EmptyInstalledCard = styled.div`
    background: #1c1917;
    border: 1px dashed rgba(191, 168, 158, 0.2);
    border-radius: 10px;
    padding: 24px;
    text-align: center;
    color: #8B786D;
    font-size: 13.5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

// --- Browse Section ---
const BrowseContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const FilterBar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: 900px) {
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
    flex: 1 1 240px;
    min-width: 200px;
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

// --- Custom Select Dropdowns ---
const DropdownWrapper = styled.div`
    position: relative;
    flex-shrink: 0;
`;

const DropdownTrigger = styled.button<{ $isOpen?: boolean; $isFiltered?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: ${(props) => (props.$isOpen ? '#25211e' : '#1c1917')};
    border: 1px solid ${(props) => (props.$isOpen || props.$isFiltered ? '#BFA89E' : 'rgba(191, 168, 158, 0.2)')};
    border-radius: 8px;
    padding: 9px 14px;
    font-size: 13px;
    font-weight: 500;
    color: ${(props) => (props.$isFiltered ? '#BFA89E' : '#EBF5EE')};
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
    min-width: 130px;

    &:hover {
        background: #25211e;
        border-color: #BFA89E;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.25);
    border-radius: 8px;
    padding: 6px;
    min-width: 160px;
    max-height: 240px;
    overflow-y: auto;
    z-index: 40;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    animation: ${fadeIn} 0.15s ease-out;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(191, 168, 158, 0.25);
        border-radius: 9999px;
    }
`;

const DropdownItem = styled.div<{ $selected?: boolean }>`
    padding: 8px 12px;
    font-size: 12.5px;
    color: ${(props) => (props.$selected ? '#BFA89E' : '#EBF5EE')};
    background: ${(props) => (props.$selected ? 'rgba(191, 168, 158, 0.12)' : 'transparent')};
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.12s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background: rgba(191, 168, 158, 0.18);
        color: #EBF5EE;
    }
`;

// --- Bento Cards Grid (3 Columns) ---
const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const PluginCard = styled.div`
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.15);
    border-radius: 10px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;

    &:hover {
        background: #25211e;
        border-color: #BFA89E;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
`;

const CardTopRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
`;

const CardIconBox = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 18px;
    flex-shrink: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const CardHeaderInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
`;

const CardTitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const CardTitle = styled.span`
    font-size: 15px;
    font-weight: 700;
    color: #EBF5EE;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.01em;
`;

const CardAuthor = styled.span`
    font-size: 12px;
    color: #8B786D;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    strong {
        color: #BFA89E;
        font-weight: 500;
    }
`;

const CardDescription = styled.p`
    font-size: 13px;
    line-height: 1.45;
    color: #c4b5ac;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 38px;
`;

const CardBottomRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid rgba(191, 168, 158, 0.1);
    padding-top: 12px;
`;

const CardStats = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #8B786D;
    flex-wrap: wrap;
`;

const StatItem = styled.span`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const VersionsButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.28);
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    color: #EBF5EE;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
    flex-shrink: 0;

    &:hover {
        background: #BFA89E;
        border-color: #BFA89E;
        color: #181514;
        transform: scale(0.98);
    }
`;

// --- Versions Modal ---
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
    max-width: 680px;
    max-height: 85vh;
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

const ModalHeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
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
    padding: 18px 22px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(191, 168, 158, 0.25);
        border-radius: 9999px;
    }
`;

const VersionRow = styled.div`
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.15);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: border-color 0.15s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.35);
    }
`;

const VersionInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

const VersionNameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const VersionName = styled.span`
    font-size: 13.5px;
    font-weight: 600;
    color: #EBF5EE;
`;

const VersionBadge = styled.span<{ $type: 'release' | 'beta' | 'alpha' }>`
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 2px 7px;
    border-radius: 4px;

    ${(props) =>
        props.$type === 'release'
            ? css`
                  background: rgba(82, 183, 136, 0.15);
                  color: #52b788;
                  border: 1px solid rgba(82, 183, 136, 0.3);
              `
            : props.$type === 'beta'
            ? css`
                  background: rgba(221, 151, 84, 0.15);
                  color: #dd9754;
                  border: 1px solid rgba(221, 151, 84, 0.3);
              `
            : css`
                  background: rgba(201, 75, 75, 0.15);
                  color: #c94b4b;
                  border: 1px solid rgba(201, 75, 75, 0.3);
              `}
`;

const VersionFileMeta = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #8B786D;
`;

const VersionTagsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
`;

const TagBadge = styled.span`
    font-size: 10.5px;
    color: #BFA89E;
    background: rgba(191, 168, 158, 0.08);
    border: 1px solid rgba(191, 168, 158, 0.15);
    padding: 1px 6px;
    border-radius: 4px;
`;

// --- Provider Icons SVGs ---
const ModrinthIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.252 24a11.78 11.78 0 0 1-8.31-3.447C1.353 17.965.008 14.542 0 10.877c.01-3.666 1.358-7.09 3.945-9.678A11.79 11.79 0 0 1 12.252 0c3.27 0 6.35 1.077 8.877 3.082a11.96 11.96 0 0 1 3.42 5.093 1.25 1.25 0 0 1-.77 1.602 1.25 1.25 0 0 1-1.602-.77 9.47 9.47 0 0 0-2.709-4.032A9.3 9.3 0 0 0 12.252 2.5a9.3 9.3 0 0 0-7.147 3.328A9.36 9.36 0 0 0 2.5 10.877c.007 2.894 1.07 5.6 2.605 7.649a9.3 9.3 0 0 0 7.147 3.328 9.31 9.31 0 0 0 6.64-2.825 9.47 9.47 0 0 0 2.709-4.032 1.25 1.25 0 0 1 1.602-.77c.654.248.995.968.77 1.602a11.96 11.96 0 0 1-3.42 5.093 11.78 11.78 0 0 1-8.291 3.078zm1.096-7.854a1.25 1.25 0 0 1-.884-.366l-4.167-4.167a1.25 1.25 0 0 1 1.768-1.768l3.283 3.284 6.84-6.84a1.25 1.25 0 1 1 1.768 1.768l-7.726 7.726a1.25 1.25 0 0 1-.882.363z" />
    </svg>
);

const SpigotIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 6h-3.18C18.4 4.84 17.3 4 16 4H8C6.7 4 5.6 4.84 5.18 6H2c-.55 0-1 .45-1 1s.45 1 1 1h1v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8h1c.55 0 1-.45 1-1s-.45-1-1-1zM5 8h14v2H5V8zm14 10H5v-6h14v6z" />
    </svg>
);

const CurseForgeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.32 8.35c-.17-.4-.5-.7-.91-.84l-5.07-1.7a2.53 2.53 0 0 0-1.68 0L5.59 7.51c-.41.14-.74.44-.91.84L2.09 14.5c-.24.57-.1 1.23.35 1.64.44.42 1.09.52 1.64.26l4.63-2.2c.28-.13.6-.13.88 0l4.63 2.2c.25.12.52.18.79.18.3 0 .6-.08.85-.24.45-.41.59-1.07.35-1.64l-2.59-6.15z" />
    </svg>
);

// --- Dropdown Filters Data ---
const LOADERS = [
    { label: 'Any loader', value: '' },
    { label: 'Paper', value: 'paper' },
    { label: 'Purpur', value: 'purpur' },
    { label: 'Spigot', value: 'spigot' },
    { label: 'Bukkit', value: 'bukkit' },
    { label: 'BungeeCord', value: 'bungeecord' },
    { label: 'Velocity', value: 'velocity' },
    { label: 'Fabric', value: 'fabric' },
    { label: 'Folia', value: 'folia' },
    { label: 'NeoForge', value: 'neoforge' },
    { label: 'Forge', value: 'forge' },
];

const GAME_VERSIONS = [
    { label: 'Any version', value: '' },
    { label: '1.21.4', value: '1.21.4' },
    { label: '1.21.3', value: '1.21.3' },
    { label: '1.21.1', value: '1.21.1' },
    { label: '1.21', value: '1.21' },
    { label: '1.20.6', value: '1.20.6' },
    { label: '1.20.4', value: '1.20.4' },
    { label: '1.20.2', value: '1.20.2' },
    { label: '1.20.1', value: '1.20.1' },
    { label: '1.19.4', value: '1.19.4' },
    { label: '1.19.2', value: '1.19.2' },
    { label: '1.18.2', value: '1.18.2' },
    { label: '1.16.5', value: '1.16.5' },
    { label: '1.12.2', value: '1.12.2' },
    { label: '1.8.8', value: '1.8.8' },
];

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addFlash, clearFlashes } = useFlash();

    // --- State: Installed Plugins ---
    const [installedPlugins, setInstalledPlugins] = useState<InstalledPlugin[]>([]);
    const [loadingInstalled, setLoadingInstalled] = useState(true);
    const [togglingFile, setTogglingFile] = useState<string | null>(null);
    const [deletingFile, setDeletingFile] = useState<string | null>(null);

    // --- State: Browse & Filters ---
    const [provider, setProvider] = useState<'modrinth' | 'spigotmc' | 'curseforge'>('modrinth');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLoader, setSelectedLoader] = useState('');
    const [selectedVersion, setSelectedVersion] = useState('');

    // Dropdown open states
    const [loaderDropdownOpen, setLoaderDropdownOpen] = useState(false);
    const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const versionRef = useRef<HTMLDivElement>(null);

    // --- State: Project Cards ---
    const [pluginsList, setPluginsList] = useState<PluginCardItem[]>([]);
    const [loadingBrowse, setLoadingBrowse] = useState(false);

    // --- State: Versions Modal ---
    const [activeProjectModal, setActiveProjectModal] = useState<PluginCardItem | null>(null);
    const [projectVersions, setProjectVersions] = useState<ModrinthVersion[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [installingVersionId, setInstallingVersionId] = useState<string | null>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (loaderRef.current && !loaderRef.current.contains(e.target as Node)) {
                setLoaderDropdownOpen(false);
            }
            if (versionRef.current && !versionRef.current.contains(e.target as Node)) {
                setVersionDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Fetch Installed Plugins ---
    const fetchInstalledPlugins = useCallback(() => {
        setLoadingInstalled(true);
        loadDirectory(uuid, 'plugins')
            .then((files: FileObject[]) => {
                const metaCacheKey = `bytenodes_plugins_meta_${uuid}`;
                let metaMap: Record<string, any> = {};
                try {
                    metaMap = JSON.parse(localStorage.getItem(metaCacheKey) || '{}');
                } catch {
                    // Ignore parse error
                }

                const plugins = files
                    .filter((f) => f.isFile && (f.name.endsWith('.jar') || f.name.endsWith('.jar.disabled') || f.name.endsWith('.disabled')))
                    .map((f) => {
                        const meta = metaMap[f.name] || metaMap[f.name.replace(/\.disabled$/, '')] || {};
                        return {
                            filename: f.name,
                            displayName: meta.name || cleanPluginName(f.name),
                            size: f.size,
                            isDisabled: f.name.endsWith('.disabled'),
                            modifiedAt: f.modifiedAt,
                            iconUrl: meta.iconUrl || undefined,
                            projectUrl: meta.projectUrl || undefined,
                            author: meta.author || undefined,
                        };
                    });
                setInstalledPlugins(plugins);
            })
            .catch(() => {
                // If /plugins directory doesn't exist yet, it's 0 installed
                setInstalledPlugins([]);
            })
            .finally(() => setLoadingInstalled(false));
    }, [uuid]);

    useEffect(() => {
        fetchInstalledPlugins();
    }, [fetchInstalledPlugins]);

    // --- Action: Toggle Enable / Disable ---
    const handleTogglePlugin = (plugin: InstalledPlugin) => {
        setTogglingFile(plugin.filename);
        clearFlashes('server-plugins');

        const from = plugin.filename;
        const to = plugin.isDisabled ? plugin.filename.replace(/\.disabled$/, '') : `${plugin.filename}.disabled`;

        renameFiles(uuid, 'plugins', [{ from, to }])
            .then(() => {
                const metaCacheKey = `bytenodes_plugins_meta_${uuid}`;
                try {
                    const metaMap = JSON.parse(localStorage.getItem(metaCacheKey) || '{}');
                    if (metaMap[from]) {
                        metaMap[to] = metaMap[from];
                        delete metaMap[from];
                        localStorage.setItem(metaCacheKey, JSON.stringify(metaMap));
                    }
                } catch {
                    // Ignore
                }

                addFlash({
                    key: 'server-plugins',
                    type: 'success',
                    message: plugin.isDisabled
                        ? `Plugin "${plugin.displayName}" has been enabled.`
                        : `Plugin "${plugin.displayName}" has been disabled. Changes take effect the next time the server restarts.`,
                });
                fetchInstalledPlugins();
            })
            .catch((err) => {
                console.error(err);
                addFlash({
                    key: 'server-plugins',
                    type: 'error',
                    message: err.message || 'Failed to toggle plugin state.',
                });
            })
            .finally(() => setTogglingFile(null));
    };

    // --- Action: Delete Plugin ---
    const handleDeletePlugin = (plugin: InstalledPlugin) => {
        if (!confirm(`Are you sure you want to delete "${plugin.displayName}" (${plugin.filename})?`)) {
            return;
        }

        setDeletingFile(plugin.filename);
        clearFlashes('server-plugins');

        deleteFiles(uuid, 'plugins', [plugin.filename])
            .then(() => {
                const metaCacheKey = `bytenodes_plugins_meta_${uuid}`;
                try {
                    const metaMap = JSON.parse(localStorage.getItem(metaCacheKey) || '{}');
                    delete metaMap[plugin.filename];
                    localStorage.setItem(metaCacheKey, JSON.stringify(metaMap));
                } catch {
                    // Ignore
                }

                addFlash({
                    key: 'server-plugins',
                    type: 'success',
                    message: `Plugin "${plugin.displayName}" was successfully deleted from /plugins.`,
                });
                fetchInstalledPlugins();
            })
            .catch((err) => {
                console.error(err);
                addFlash({
                    key: 'server-plugins',
                    type: 'error',
                    message: err.message || 'Failed to delete plugin file.',
                });
            })
            .finally(() => setDeletingFile(null));
    };

    // --- Fetch Browse Plugins (Modrinth / SpigotMC) ---
    const fetchBrowsePlugins = useCallback(() => {
        setLoadingBrowse(true);

        if (provider === 'modrinth') {
            const facets: string[][] = [['project_type:plugin']];
            if (selectedLoader) facets.push([`categories:${selectedLoader}`]);
            if (selectedVersion) facets.push([`versions:${selectedVersion}`]);

            const queryParams = new URLSearchParams();
            queryParams.set('facets', JSON.stringify(facets));
            if (searchQuery.trim()) {
                queryParams.set('query', searchQuery.trim());
                queryParams.set('index', 'relevance');
            } else {
                queryParams.set('index', 'downloads');
            }
            queryParams.set('limit', '24');

            fetch(`https://api.modrinth.com/v2/search?${queryParams.toString()}`, {
                headers: { 'User-Agent': 'ByteNodes/1.0 (support@bytenodes.id)' },
            })
                .then((res) => res.json())
                .then((data) => {
                    const hits = data.hits || [];
                    const items: PluginCardItem[] = hits.map((h: any) => ({
                        id: h.project_id || h.slug,
                        slug: h.slug,
                        title: h.title,
                        description: h.description,
                        author: h.author,
                        iconUrl: h.icon_url || null,
                        downloads: h.downloads || 0,
                        stars: h.follows || 0,
                        updatedAt: h.date_modified || new Date().toISOString(),
                        projectType: h.project_type,
                        categories: h.categories || [],
                        versions: h.versions || [],
                        externalUrl: `https://modrinth.com/plugin/${h.slug}`,
                    }));
                    setPluginsList(items);
                })
                .catch((err) => {
                    console.error('Failed to fetch from Modrinth:', err);
                    setPluginsList([]);
                })
                .finally(() => setLoadingBrowse(false));
        } else if (provider === 'spigotmc') {
            const q = searchQuery.trim();
            const url = q
                ? `https://api.spiget.org/v2/search/resources/${encodeURIComponent(q)}?size=24&sort=-downloads`
                : `https://api.spiget.org/v2/resources/free?size=24&sort=-downloads`;

            fetch(url, { headers: { 'User-Agent': 'ByteNodes/1.0' } })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        const items: PluginCardItem[] = data.map((item: any) => ({
                            id: String(item.id),
                            slug: String(item.id),
                            title: item.name,
                            description: item.tag || 'Minecraft Server Plugin from SpigotMC',
                            author: item.author?.username || 'SpigotMC',
                            iconUrl: item.icon?.url ? `https://www.spigotmc.org/${item.icon.url}` : null,
                            downloads: item.downloads || 0,
                            stars: item.rating?.average ? Math.round(item.rating.average * 20) : 0,
                            updatedAt: item.updateDate ? new Date(item.updateDate * 1000).toISOString() : new Date().toISOString(),
                            projectType: 'plugin',
                            categories: item.testedVersions || ['Spigot'],
                            versions: item.testedVersions || [],
                            externalUrl: `https://www.spigotmc.org/resources/${item.id}`,
                        }));
                        setPluginsList(items);
                    } else {
                        setPluginsList([]);
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch from Spiget:', err);
                    setPluginsList([]);
                })
                .finally(() => setLoadingBrowse(false));
        } else {
            setPluginsList([]);
            setLoadingBrowse(false);
        }
    }, [provider, searchQuery, selectedLoader, selectedVersion]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchBrowsePlugins();
        }, 300);
        return () => clearTimeout(timeout);
    }, [fetchBrowsePlugins]);

    // --- Action: Open Versions Modal ---
    const handleOpenVersions = (plugin: PluginCardItem) => {
        setActiveProjectModal(plugin);
        setLoadingVersions(true);
        setProjectVersions([]);

        if (provider === 'modrinth') {
            fetch(`https://api.modrinth.com/v2/project/${plugin.slug}/version`, {
                headers: { 'User-Agent': 'ByteNodes/1.0 (support@bytenodes.id)' },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setProjectVersions(data);
                    } else {
                        setProjectVersions([]);
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch project versions:', err);
                    setProjectVersions([]);
                })
                .finally(() => setLoadingVersions(false));
        } else {
            setLoadingVersions(false);
        }
    };

    // --- Action: Install Version Directly into /plugins ---
    const handleInstallVersion = (version: ModrinthVersion) => {
        if (!activeProjectModal) return;

        const primaryFile =
            version.files.find((f) => f.primary && f.filename.endsWith('.jar')) ||
            version.files.find((f) => f.filename.endsWith('.jar')) ||
            version.files[0];

        if (!primaryFile) {
            addFlash({
                key: 'server-plugins',
                type: 'error',
                message: 'No downloadable .jar file found for this release.',
            });
            return;
        }

        setInstallingVersionId(version.id);
        clearFlashes('server-plugins');

        http.post(`/api/client/servers/${uuid}/quick-setup/plugin`, {
            plugin_id: activeProjectModal.slug,
            plugin_name: activeProjectModal.title,
            url: primaryFile.url,
            directory: 'plugins',
            filename: primaryFile.filename,
        })
            .then((res: any) => {
                const metaCacheKey = `bytenodes_plugins_meta_${uuid}`;
                try {
                    const metaMap = JSON.parse(localStorage.getItem(metaCacheKey) || '{}');
                    metaMap[primaryFile.filename] = {
                        name: activeProjectModal.title,
                        slug: activeProjectModal.slug,
                        iconUrl: activeProjectModal.iconUrl,
                        projectUrl: activeProjectModal.externalUrl,
                        author: activeProjectModal.author,
                    };
                    localStorage.setItem(metaCacheKey, JSON.stringify(metaMap));
                } catch {
                    // Ignore
                }

                addFlash({
                    key: 'server-plugins',
                    type: 'success',
                    message: res.data?.message || `Successfully installed ${activeProjectModal.title} (${primaryFile.filename}) to /plugins.`,
                });
                fetchInstalledPlugins();
                setActiveProjectModal(null);
            })
            .catch((err) => {
                console.error(err);
                pullFile(uuid, primaryFile.url, {
                    directory: 'plugins',
                    filename: primaryFile.filename,
                    foreground: true,
                })
                    .then(() => {
                        const metaCacheKey = `bytenodes_plugins_meta_${uuid}`;
                        try {
                            const metaMap = JSON.parse(localStorage.getItem(metaCacheKey) || '{}');
                            metaMap[primaryFile.filename] = {
                                name: activeProjectModal.title,
                                slug: activeProjectModal.slug,
                                iconUrl: activeProjectModal.iconUrl,
                                projectUrl: activeProjectModal.externalUrl,
                                author: activeProjectModal.author,
                            };
                            localStorage.setItem(metaCacheKey, JSON.stringify(metaMap));
                        } catch {
                            // Ignore
                        }

                        addFlash({
                            key: 'server-plugins',
                            type: 'success',
                            message: `Successfully installed ${activeProjectModal.title} to /plugins.`,
                        });
                        fetchInstalledPlugins();
                        setActiveProjectModal(null);
                    })
                    .catch((pullErr) => {
                        addFlash({
                            key: 'server-plugins',
                            type: 'error',
                            message: pullErr.message || 'Failed to download plugin file to server.',
                        });
                    });
            })
            .finally(() => setInstallingVersionId(null));
    };

    // Quick direct install for Spigot
    const handleInstallSpigot = (plugin: PluginCardItem) => {
        clearFlashes('server-plugins');
        const filename = `${plugin.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.jar`;

        http.post(`/api/client/servers/${uuid}/quick-setup/plugin`, {
            plugin_id: plugin.id,
            plugin_name: plugin.title,
            url: `https://api.spiget.org/v2/resources/${plugin.id}/download`,
            directory: 'plugins',
            filename,
        })
            .then((res: any) => {
                const metaCacheKey = `bytenodes_plugins_meta_${uuid}`;
                try {
                    const metaMap = JSON.parse(localStorage.getItem(metaCacheKey) || '{}');
                    metaMap[filename] = {
                        name: plugin.title,
                        slug: plugin.id,
                        iconUrl: plugin.iconUrl,
                        projectUrl: plugin.externalUrl,
                        author: plugin.author,
                    };
                    localStorage.setItem(metaCacheKey, JSON.stringify(metaMap));
                } catch {
                    // Ignore
                }

                addFlash({
                    key: 'server-plugins',
                    type: 'success',
                    message: res.data?.message || `Successfully installed ${plugin.title} to /plugins.`,
                });
                fetchInstalledPlugins();
            })
            .catch((err) => {
                console.error(err);
                addFlash({
                    key: 'server-plugins',
                    type: 'error',
                    message: err.response?.data?.error || err.message || `Failed to install ${plugin.title}.`,
                });
            });
    };

    // Calculate active loader & version display labels
    const currentLoaderLabel = useMemo(() => {
        return LOADERS.find((l) => l.value === selectedLoader)?.label || 'Any loader';
    }, [selectedLoader]);

    const currentVersionLabel = useMemo(() => {
        return GAME_VERSIONS.find((v) => v.value === selectedVersion)?.label || 'Any version';
    }, [selectedVersion]);

    return (
        <ServerContentBlock title={'Plugins'}>
            <FlashMessageRender byKey={'server-plugins'} className={'mb-4'} />

            <PageContainer>
                {/* --- 1. INSTALLED SECTION --- */}
                <div>
                    <SectionHeader className={'mb-3'}>
                        <SectionTitle>{installedPlugins.length} installed</SectionTitle>
                        <SectionSubtitle>Changes take effect the next time the server restarts.</SectionSubtitle>
                    </SectionHeader>

                    {loadingInstalled ? (
                        <div className={'py-6 text-center'}>
                            <Spinner size={'base'} centered />
                        </div>
                    ) : installedPlugins.length === 0 ? (
                        <EmptyInstalledCard>
                            <FontAwesomeIcon icon={faPlug} style={{ fontSize: 24, color: '#8B786D' }} />
                            <span>No plugins installed yet in /plugins. Browse plugins below to install.</span>
                        </EmptyInstalledCard>
                    ) : (
                        <InstalledList>
                            {installedPlugins.map((plugin) => (
                                <InstalledCard key={plugin.filename} $disabled={plugin.isDisabled}>
                                    <InstalledLeft>
                                        <PluginIconBox $disabled={plugin.isDisabled}>
                                            {plugin.iconUrl ? (
                                                <img src={plugin.iconUrl} alt={plugin.displayName} />
                                            ) : (
                                                <FontAwesomeIcon icon={getPluginIcon(plugin.displayName)} />
                                            )}
                                        </PluginIconBox>

                                        <InstalledDetails>
                                            <InstalledTitleRow>
                                                <InstalledTitle>{plugin.displayName}</InstalledTitle>
                                                {plugin.projectUrl && (
                                                    <ExternalLinkIcon
                                                        href={plugin.projectUrl}
                                                        target={'_blank'}
                                                        rel={'noopener noreferrer'}
                                                        title={'View project website'}
                                                    >
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    </ExternalLinkIcon>
                                                )}
                                            </InstalledTitleRow>
                                            <InstalledMeta>
                                                {plugin.filename} · {formatFileSize(plugin.size)}
                                            </InstalledMeta>
                                        </InstalledDetails>
                                    </InstalledLeft>

                                    <InstalledActions>
                                        <ActionButton
                                            $variant={plugin.isDisabled ? 'danger' : 'default'}
                                            onClick={() => handleTogglePlugin(plugin)}
                                            disabled={togglingFile === plugin.filename || deletingFile === plugin.filename}
                                        >
                                            {togglingFile === plugin.filename ? (
                                                <Spinner size={'small'} />
                                            ) : (
                                                <FontAwesomeIcon icon={faPowerOff} />
                                            )}
                                            <span>{plugin.isDisabled ? 'Enable' : 'Disable'}</span>
                                        </ActionButton>

                                        <IconButton
                                            onClick={() => handleDeletePlugin(plugin)}
                                            disabled={togglingFile === plugin.filename || deletingFile === plugin.filename}
                                            title={'Delete plugin from /plugins'}
                                        >
                                            {deletingFile === plugin.filename ? (
                                                <Spinner size={'small'} />
                                            ) : (
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            )}
                                        </IconButton>
                                    </InstalledActions>
                                </InstalledCard>
                            ))}
                        </InstalledList>
                    )}
                </div>

                {/* --- 2. BROWSE SECTION --- */}
                <BrowseContainer>
                    <SectionHeader>
                        <SectionTitle style={{ fontSize: 18 }}>Browse</SectionTitle>
                        <SectionSubtitle>Downloads are fetched by the node itself, not by your browser.</SectionSubtitle>
                    </SectionHeader>

                    {/* Filter Bar */}
                    <FilterBar>
                        {/* Provider Tabs */}
                        <ProviderTabs>
                            <ProviderTab
                                $active={provider === 'modrinth'}
                                onClick={() => setProvider('modrinth')}
                            >
                                <ModrinthIcon />
                                <span>Modrinth</span>
                            </ProviderTab>
                            <ProviderTab
                                $active={provider === 'spigotmc'}
                                onClick={() => setProvider('spigotmc')}
                            >
                                <SpigotIcon />
                                <span>SpigotMC</span>
                            </ProviderTab>
                            <ProviderTab
                                $active={provider === 'curseforge'}
                                onClick={() => setProvider('curseforge')}
                            >
                                <CurseForgeIcon />
                                <span>CurseForge</span>
                            </ProviderTab>
                        </ProviderTabs>

                        {/* Search Input */}
                        <SearchInputWrapper>
                            <SearchIcon icon={faSearch} />
                            <SearchInput
                                placeholder={`Search ${provider === 'modrinth' ? 'Modrinth' : provider === 'spigotmc' ? 'SpigotMC' : 'CurseForge'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </SearchInputWrapper>

                        {/* Loader Dropdown */}
                        <DropdownWrapper ref={loaderRef}>
                            <DropdownTrigger
                                $isOpen={loaderDropdownOpen}
                                $isFiltered={!!selectedLoader}
                                onClick={() => {
                                    setLoaderDropdownOpen(!loaderDropdownOpen);
                                    setVersionDropdownOpen(false);
                                }}
                            >
                                <span>{currentLoaderLabel}</span>
                                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11 }} />
                            </DropdownTrigger>
                            {loaderDropdownOpen && (
                                <DropdownMenu>
                                    {LOADERS.map((loader) => (
                                        <DropdownItem
                                            key={loader.value}
                                            $selected={selectedLoader === loader.value}
                                            onClick={() => {
                                                setSelectedLoader(loader.value);
                                                setLoaderDropdownOpen(false);
                                            }}
                                        >
                                            <span>{loader.label}</span>
                                            {selectedLoader === loader.value && <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11 }} />}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            )}
                        </DropdownWrapper>

                        {/* Version Dropdown */}
                        <DropdownWrapper ref={versionRef}>
                            <DropdownTrigger
                                $isOpen={versionDropdownOpen}
                                $isFiltered={!!selectedVersion}
                                onClick={() => {
                                    setVersionDropdownOpen(!versionDropdownOpen);
                                    setLoaderDropdownOpen(false);
                                }}
                            >
                                <span>{currentVersionLabel}</span>
                                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11 }} />
                            </DropdownTrigger>
                            {versionDropdownOpen && (
                                <DropdownMenu>
                                    {GAME_VERSIONS.map((ver) => (
                                        <DropdownItem
                                            key={ver.value}
                                            $selected={selectedVersion === ver.value}
                                            onClick={() => {
                                                setSelectedVersion(ver.value);
                                                setVersionDropdownOpen(false);
                                            }}
                                        >
                                            <span>{ver.label}</span>
                                            {selectedVersion === ver.value && <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11 }} />}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            )}
                        </DropdownWrapper>
                    </FilterBar>

                    {/* --- 3. BENTO CARDS GRID (3 Columns) --- */}
                    {loadingBrowse ? (
                        <div className={'py-12 text-center'}>
                            <Spinner size={'large'} centered />
                        </div>
                    ) : provider === 'curseforge' ? (
                        <EmptyInstalledCard style={{ padding: '36px 20px' }}>
                            <CurseForgeIcon />
                            <h4 style={{ color: '#EBF5EE', fontSize: 15, margin: 0 }}>CurseForge Integration</h4>
                            <p style={{ maxWidth: 480, margin: '4px 0 0 0', lineHeight: 1.5 }}>
                                CurseForge plugins require direct JAR installation due to API third-party restrictions. You can copy any direct download link from CurseForge and install it into /plugins.
                            </p>
                        </EmptyInstalledCard>
                    ) : pluginsList.length === 0 ? (
                        <EmptyInstalledCard style={{ padding: '36px 20px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ fontSize: 24 }} />
                            <h4 style={{ color: '#EBF5EE', fontSize: 15, margin: 0 }}>No plugins found</h4>
                            <p style={{ margin: 0 }}>Try clearing your search filters or searching with a different term.</p>
                        </EmptyInstalledCard>
                    ) : (
                        <CardsGrid>
                            {pluginsList.map((plugin) => (
                                <PluginCard key={plugin.id}>
                                    <div>
                                        <CardTopRow>
                                            <CardIconBox>
                                                {plugin.iconUrl ? (
                                                    <img src={plugin.iconUrl} alt={plugin.title} />
                                                ) : (
                                                    <FontAwesomeIcon icon={getPluginIcon(plugin.title)} />
                                                )}
                                            </CardIconBox>

                                            <CardHeaderInfo>
                                                <CardTitleRow>
                                                    <CardTitle title={plugin.title}>{plugin.title}</CardTitle>
                                                    <ExternalLinkIcon
                                                        href={plugin.externalUrl}
                                                        target={'_blank'}
                                                        rel={'noopener noreferrer'}
                                                        title={'Open on Modrinth'}
                                                    >
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    </ExternalLinkIcon>
                                                </CardTitleRow>
                                                <CardAuthor>
                                                    Author <strong>{plugin.author}</strong>
                                                </CardAuthor>
                                            </CardHeaderInfo>
                                        </CardTopRow>

                                        <CardDescription title={plugin.description}>
                                            {plugin.description}
                                        </CardDescription>
                                    </div>

                                    <CardBottomRow>
                                        <CardStats>
                                            <StatItem title={'Total Downloads'}>
                                                <FontAwesomeIcon icon={faDownload} style={{ fontSize: 10 }} />
                                                <span>{formatNumber(plugin.downloads)}</span>
                                            </StatItem>
                                            <StatItem title={'Followers / Stars'}>
                                                <FontAwesomeIcon icon={faStar} style={{ fontSize: 10, color: '#BFA89E' }} />
                                                <span>{formatNumber(plugin.stars)}</span>
                                            </StatItem>
                                            <StatItem title={'Last Updated'}>
                                                <span>{formatRelativeTime(plugin.updatedAt)}</span>
                                            </StatItem>
                                        </CardStats>

                                        {provider === 'modrinth' ? (
                                            <VersionsButton onClick={() => handleOpenVersions(plugin)}>
                                                <FontAwesomeIcon icon={faDownload} style={{ fontSize: 11 }} />
                                                <span>Versions</span>
                                            </VersionsButton>
                                        ) : (
                                            <VersionsButton onClick={() => handleInstallSpigot(plugin)}>
                                                <FontAwesomeIcon icon={faDownload} style={{ fontSize: 11 }} />
                                                <span>Install</span>
                                            </VersionsButton>
                                        )}
                                    </CardBottomRow>
                                </PluginCard>
                            ))}
                        </CardsGrid>
                    )}
                </BrowseContainer>
            </PageContainer>

            {/* --- 4. VERSIONS SELECTION MODAL --- */}
            {activeProjectModal && (
                <ModalBackdrop onClick={() => setActiveProjectModal(null)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalHeaderLeft>
                                <PluginIconBox style={{ width: 32, height: 32, fontSize: 14 }}>
                                    {activeProjectModal.iconUrl ? (
                                        <img src={activeProjectModal.iconUrl} alt={activeProjectModal.title} />
                                    ) : (
                                        <FontAwesomeIcon icon={getPluginIcon(activeProjectModal.title)} />
                                    )}
                                </PluginIconBox>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#EBF5EE' }}>
                                        {activeProjectModal.title}
                                    </h3>
                                    <span style={{ fontSize: 12, color: '#8B786D' }}>
                                        Select a release to install directly to /plugins
                                    </span>
                                </div>
                            </ModalHeaderLeft>
                            <ModalCloseButton onClick={() => setActiveProjectModal(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </ModalCloseButton>
                        </ModalHeader>

                        <ModalBody>
                            {loadingVersions ? (
                                <div className={'py-8 text-center'}>
                                    <Spinner size={'large'} centered />
                                </div>
                            ) : projectVersions.length === 0 ? (
                                <div className={'py-8 text-center text-taupe text-sm'}>
                                    No available versions found for this project.
                                </div>
                            ) : (
                                projectVersions.map((version) => {
                                    const primaryFile =
                                        version.files.find((f) => f.primary && f.filename.endsWith('.jar')) ||
                                        version.files.find((f) => f.filename.endsWith('.jar')) ||
                                        version.files[0];

                                    const isInstalled = installedPlugins.some(
                                        (ip) =>
                                            primaryFile &&
                                            (ip.filename === primaryFile.filename ||
                                                ip.filename === `${primaryFile.filename}.disabled`)
                                    );

                                    return (
                                        <VersionRow key={version.id}>
                                            <VersionInfo>
                                                <VersionNameRow>
                                                    <VersionName>{version.name || version.version_number}</VersionName>
                                                    <VersionBadge $type={version.version_type}>
                                                        {version.version_type}
                                                    </VersionBadge>
                                                </VersionNameRow>

                                                {primaryFile && (
                                                    <VersionFileMeta>
                                                        {primaryFile.filename} · {formatFileSize(primaryFile.size)}
                                                    </VersionFileMeta>
                                                )}

                                                <VersionTagsRow>
                                                    {(version.loaders || []).slice(0, 4).map((loader) => (
                                                        <TagBadge key={loader}>{loader}</TagBadge>
                                                    ))}
                                                    {(version.game_versions || []).slice(0, 3).map((gv) => (
                                                        <TagBadge key={gv}>{gv}</TagBadge>
                                                    ))}
                                                    {(version.game_versions || []).length > 3 && (
                                                        <TagBadge>
                                                            +{(version.game_versions || []).length - 3} more
                                                        </TagBadge>
                                                    )}
                                                </VersionTagsRow>
                                            </VersionInfo>

                                            <ActionButton
                                                $variant={isInstalled ? 'success' : 'default'}
                                                onClick={() => handleInstallVersion(version)}
                                                disabled={installingVersionId === version.id}
                                                style={{ flexShrink: 0 }}
                                            >
                                                {installingVersionId === version.id ? (
                                                    <>
                                                        <Spinner size={'small'} />
                                                        <span>Installing...</span>
                                                    </>
                                                ) : isInstalled ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faCheckCircle} />
                                                        <span>Installed</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faDownload} />
                                                        <span>Install</span>
                                                    </>
                                                )}
                                            </ActionButton>
                                        </VersionRow>
                                    );
                                })
                            )}
                        </ModalBody>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </ServerContentBlock>
    );
};
