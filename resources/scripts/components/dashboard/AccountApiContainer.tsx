import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import ContentBox from '@/components/elements/ContentBox';
import CreateApiKeyForm from '@/components/dashboard/forms/CreateApiKeyForm';
import getApiKeys, { ApiKey } from '@/api/account/getApiKeys';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import deleteApiKey from '@/api/account/deleteApiKey';
import FlashMessageRender from '@/components/FlashMessageRender';

import PageContentBlock from '@/components/elements/PageContentBlock';
import { Dialog } from '@/components/elements/dialog';
import { useFlashKey } from '@/plugins/useFlash';
import Code from '@/components/elements/Code';
import GreyRowBox from '@/components/elements/GreyRowBox';

const HeaderBanner = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const HeaderInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const IconBadge = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 18px;
    flex-shrink: 0;
`;

const Title = styled.h2`
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0 0 4px 0;
`;

const Subtitle = styled.p`
    font-size: 13px;
    color: #8B786D;
    margin: 0;
`;

const LimitPill = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #EBF5EE;
`;

const SplitGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 1024px) {
        grid-template-columns: 380px minmax(0, 1fr);
    }
`;

const KeyRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 12px;
    transition: all 0.15s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.45);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const KeyInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
`;

const KeyIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 16px;
    flex-shrink: 0;
`;

const KeyMeta = styled.div`
    min-width: 0;
    flex: 1;
`;

const KeyDesc = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px;
    font-weight: 600;
    color: #EBF5EE;
    margin: 0 0 2px 0;
`;

const KeyIdPill = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #BFA89E;
    background: #1c1917;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(139, 120, 109, 0.25);
`;

const DateText = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    color: #8B786D;
    margin-left: 8px;
`;

const DeleteBtn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #EF4444;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.22);
        border-color: #EF4444;
    }
`;

const EmptyNotice = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #8B786D;
    text-align: center;
    margin: 32px 0;
`;


const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Recently';
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return 'Recently';
    }
};

export default () => {
    const [deleteIdentifier, setDeleteIdentifier] = useState('');
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const { clearAndAddHttpError } = useFlashKey('account');
    const isDemo = (window as any).PterodactylUser?.username === 'demo' || (window as any).PterodactylUser?.email === 'demo@bytenodes.id';

    useEffect(() => {
        getApiKeys()
            .then((keys) => setKeys(keys))
            .then(() => setLoading(false))
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    const doDeletion = (identifier: string) => {
        setLoading(true);
        clearAndAddHttpError();
        deleteApiKey(identifier)
            .then(() => setKeys((s) => [...(s || []).filter((key) => key.identifier !== identifier)]))
            .catch((error) => clearAndAddHttpError(error))
            .then(() => {
                setLoading(false);
                setDeleteIdentifier('');
            });
    };

    return (
        <PageContentBlock title={'Account API'}>
            <HeaderBanner>
                <HeaderInfo>
                    <IconBadge>
                        <FontAwesomeIcon icon={faKey} />
                    </IconBadge>
                    <div>
                        <Title>Account API Credentials</Title>
                        <Subtitle>Generate personal access tokens to interact with the Bytenodes Client API programmatically.</Subtitle>
                    </div>
                </HeaderInfo>
                <LimitPill>
                    <span style={{ color: '#BFA89E' }}>{keys.length}</span> Active Tokens
                </LimitPill>
            </HeaderBanner>

            <FlashMessageRender byKey={'account'} style={{ marginBottom: '16px' }} />

            <Dialog.Confirm
                open={deleteIdentifier.length > 0}
                onClose={() => setDeleteIdentifier('')}
                title={'Delete API Key'}
                confirm={'Delete Key'}
                onConfirmed={() => doDeletion(deleteIdentifier)}
            >
                Are you sure you wish to delete this API key? All applications using <Code>{deleteIdentifier}</Code> will immediately lose access.
            </Dialog.Confirm>

            <SplitGrid>
                <ContentBox title={'Create API Key'}>
                    {isDemo ? (
                        <div style={{ textAlign: 'center', padding: '36px 16px', color: '#8B786D' }}>
                            <p style={{ margin: 0, fontWeight: 600, color: '#EBF5EE', fontSize: '15px' }}>API Key Generation Locked</p>
                            <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>Demo accounts cannot generate new personal API access keys.</p>
                        </div>
                    ) : (
                        <CreateApiKeyForm onKeyCreated={(key) => setKeys((s) => [...s, key])} />
                    )}
                </ContentBox>

                <ContentBox title={'API Keys'}>
                    <SpinnerOverlay visible={loading} />
                    {keys.length === 0 ? (
                        <EmptyNotice>No API credentials found for this account.</EmptyNotice>
                    ) : (
                        keys.map((key) => (
                            <KeyRow key={key.identifier}>
                                <KeyInfo>
                                    <KeyIcon>
                                        <FontAwesomeIcon icon={faKey} />
                                    </KeyIcon>
                                    <KeyMeta>
                                        <KeyDesc>{key.description}</KeyDesc>
                                        <div>
                                            <KeyIdPill>{key.identifier}</KeyIdPill>
                                            <DateText>
                                                Created {key.createdAt ? formatDate(key.createdAt) : 'Recently'}
                                            </DateText>
                                        </div>
                                    </KeyMeta>
                                </KeyInfo>
                                <DeleteBtn
                                    type={'button'}
                                    title={'Revoke key'}
                                    onClick={() => setDeleteIdentifier(key.identifier)}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} style={{ fontSize: '13px' }} />
                                </DeleteBtn>
                            </KeyRow>
                        ))
                    )}
                </ContentBox>
            </SplitGrid>
        </PageContentBlock>
    );
};
