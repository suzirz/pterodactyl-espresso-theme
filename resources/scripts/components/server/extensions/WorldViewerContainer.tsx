import React, { useState, useEffect } from 'react';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkedAlt,
    faExternalLinkAlt,
    faExpand,
    faCompress,
    faCog,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 20px 40px;
    font-family: 'Outfit', sans-serif;
`;

const TopBar = styled.div`
    background: #171413;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
`;

const InputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 280px;
`;

const UrlInput = styled.input`
    flex: 1;
    background: #131110;
    border: 1px solid rgba(139, 120, 109, 0.3);
    border-radius: 8px;
    padding: 8px 14px;
    color: #EBF5EE;
    font-size: 13.5px;
    font-family: 'JetBrains Mono', monospace;

    &:focus {
        outline: none;
        border-color: #BFA89E;
    }
`;

const Button = styled.button<{ $primary?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    ${(props) =>
        props.$primary
            ? `
        background: #BFA89E;
        color: #181514;
        border: 1px solid #BFA89E;
        &:hover { filter: brightness(1.1); }
    `
            : `
        background: #25211e;
        color: #EBF5EE;
        border: 1px solid rgba(191, 168, 158, 0.25);
        &:hover { border-color: #BFA89E; color: #BFA89E; }
    `}
`;

const ViewerFrameWrapper = styled.div<{ $fullscreen?: boolean }>`
    width: 100%;
    height: ${(props) => (props.$fullscreen ? '90vh' : '650px')};
    background: #141211;
    border-radius: 12px;
    border: 1px solid rgba(139, 120, 109, 0.25);
    overflow: hidden;
    position: relative;
`;

export default function WorldViewerContainer() {
    const server = ServerContext.useStoreState((state) => state.server.data);
    const defaultAlloc = server?.allocations?.find((alloc) => alloc.isDefault);
    const isDemo = (window as any).PterodactylUser?.username === 'demo' || (window as any).PterodactylUser?.email === 'demo@bytenodes.id';
    const isDemoServer = server?.id === 171 || server?.uuid === 'c06dfb84-0b2a-4233-9bd4-83ad49d3ac68';
    const hostIp = (isDemo || isDemoServer || defaultAlloc?.ip === '0.0.0.0') ? '0.0.0.0' : (defaultAlloc?.alias || (defaultAlloc ? defaultAlloc.ip : '127.0.0.1'));

    const [mapUrl, setMapUrl] = useState(`http://${hostIp}:8123`);
    const [currentUrl, setCurrentUrl] = useState(`http://${hostIp}:8123`);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        setMapUrl(`http://${hostIp}:8123`);
        setCurrentUrl(`http://${hostIp}:8123`);
    }, [hostIp]);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentUrl(mapUrl);
    };

    return (
        <ServerContentBlock title={'World Map Viewer'}>
            <Container>
                <TopBar>
                    <form onSubmit={handleApply} style={{ display: 'flex', flex: 1, gap: '10px' }}>
                        <InputRow>
                            <span style={{ fontSize: '13px', color: '#94a3b8', whiteSpace: 'nowrap' }}>Map URL:</span>
                            <UrlInput
                                value={mapUrl}
                                onChange={(e) => setMapUrl(e.target.value)}
                                placeholder="http://server-ip:8123 (Dynmap / Bluemap / Squaremap)"
                            />
                        </InputRow>
                        <Button type="submit" $primary>Load Map</Button>
                    </form>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button onClick={() => setFullscreen(!fullscreen)}>
                            <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
                            <span>{fullscreen ? 'Normal' : 'Fullscreen'}</span>
                        </Button>
                        <Button onClick={() => window.open(currentUrl, '_blank')}>
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                            <span>Open in Tab</span>
                        </Button>
                    </div>
                </TopBar>

                <ViewerFrameWrapper $fullscreen={fullscreen}>
                    <iframe
                        src={currentUrl}
                        title="Live Server Map Viewer"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                </ViewerFrameWrapper>

                <div style={{ marginTop: '16px', padding: '14px 18px', background: '#171413', borderRadius: '10px', border: '1px solid rgba(139, 120, 109, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#BFA89E', fontSize: '18px' }} />
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        <strong>Tip:</strong> Ensure you have installed a web map plugin such as <strong>Dynmap</strong>, <strong>BlueMap</strong>, or <strong>Squaremap</strong>, and allocated an additional port in the <strong>Network</strong> tab.
                    </span>
                </div>
            </Container>
        </ServerContentBlock>
    );
}
